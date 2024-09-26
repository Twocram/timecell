<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import VCreateTaskDialog from './components/dialogs/VCreateTaskDialog.vue'
import type { Task, UserTask } from './types/task';
import VTaskList from './components/VTaskList.vue';
import { getTasks, createTask } from './scripts/task';

useHead({
  title: 'TimeCell',
  meta: [
    { name: 'description', content: 'TimeCell' }
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
    }
  ],
  script: [
    {
      src: 'https://telegram.org/js/telegram-web-app.js',
    }
  ]
})

const rows = ref<string[]>(['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'])
const columns = ref<string[]>(['00', '10', '20', '30', '40', '50'])

const tasks = ref<UserTask[]>([])

const responseTasks = ref<Task[]>([])

const currentTime = computed(() => {
  const time = new Date();

  return `${time.getHours()}:${Math.round(time.getMinutes() / 10) * 10 === 0 ? '00' : Math.round(time.getMinutes() / 10) * 10}`
})

onMounted(async () => {
  if (import.meta.client && typeof Telegram !== 'undefined') {
    const telegram = Telegram.WebApp;
    telegram.enableClosingConfirmation();
  }

  window.addEventListener('mouseup', handlePointerUp)

  responseTasks.value = await getTasks()
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handlePointerUp)
})

const isCreateTaskDialogVisible = ref<boolean>(false)
const selectedBlocks = ref<string[]>([])
const previousTaskColor = ref<string>('')

const blocksCount = computed<string[]>(() => {
  const result = []
  for (const row of rows.value) {
    for (const column of columns.value) {
      result.push(`${row}:${column}`)
    }
  }
  return result
})

const activeBlocks = ref<Map<string, string>>(new Map())
const isSelecting = ref<boolean>(false)
const startBlock = ref<string | null>(null)

const getBlockCoordinates = (block: string) => {
  const [row, col] = block.split(':')
  return { row, col }
}

const handlePointerDown = (block: string) => {
  isSelecting.value = true
  startBlock.value = block
  selectBlocksInRange(startBlock.value, block)
}

const handlePointerEnter = (block: string) => {
  if (isSelecting.value && startBlock.value) {
    selectBlocksInRange(startBlock.value, block)
  }
}

const handlePointerUp = () => {
  if (isSelecting.value) {
    isSelecting.value = false
    startBlock.value = null
    handleMouseUp()
  }
}

const handleTouchStart = (event: TouchEvent, block: string) => {
  event.preventDefault()
  handlePointerDown(block)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)
  if (element && element.classList.contains('blocks')) {
    handlePointerEnter((element as HTMLElement).dataset.tip as string)
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  handlePointerUp()
}

const selectBlocksInRange = (start: string, end: string) => {
  const startCoords = getBlockCoordinates(start)
  const endCoords = getBlockCoordinates(end)

  const startIndex = rows.value.indexOf(startCoords.row)
  const endIndex = rows.value.indexOf(endCoords.row)

  if (startIndex !== endIndex) {
    return
  }

  const rowIndex = startIndex
  const startColIndex = columns.value.indexOf(startCoords.col)
  const endColIndex = columns.value.indexOf(endCoords.col)
  const minCol = Math.min(startColIndex, endColIndex)
  const maxCol = Math.max(startColIndex, endColIndex)

  for (let j = minCol; j <= maxCol; j++) {
    activeBlocks.value.set(`${rows.value[rowIndex]}:${columns.value[j]}`, '')
  }
}

const formatBlock = (hour: number, minute: number) => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getNextBlock = (row: number, col: number) => {
  let currentHour = Number(row);
  let currentMinute = Number(col);

  if (currentMinute < 50) {
    currentMinute += 10;
  } else {
    currentMinute = 0;
    currentHour += 1;

    if (currentHour >= 24) {
      currentHour = 0;
    }
  }

  return formatBlock(currentHour, currentMinute);
};

const handleMouseUp = () => {
  const parseBlock = (block: string) => block.split(':').map(Number);

  selectedBlocks.value = Array.from(activeBlocks.value.keys())
    .sort((a, b) => {
      const [aRow, aCol] = parseBlock(a);
      const [bRow, bCol] = parseBlock(b);
      return aRow === bRow ? aCol - bCol : aRow - bRow;
    });

  if (selectedBlocks.value.length === 1) {
    const [row, col] = parseBlock(selectedBlocks.value[0]);
    selectedBlocks.value.push(getNextBlock(row, col));
  } else {
    let [lastRow, lastCol] = parseBlock(selectedBlocks.value[selectedBlocks.value.length - 1]);
    if (lastCol > 40) {
      lastCol = 0;
      lastRow += 1;

      if (lastRow >= 24) {
        lastRow = 0;
      }
    }
    selectedBlocks.value.push(formatBlock(lastRow, lastCol));
  }
  isCreateTaskDialogVisible.value = true;
};


const closeTaskDialog = () => {
  isCreateTaskDialogVisible.value = false
}

const closeTaskDialogWithoutSave = () => {
  isCreateTaskDialogVisible.value = false

  activeBlocks.value.forEach((value, key) => {
    if (value === previousTaskColor.value) {
      activeBlocks.value.delete(key)
    }
  })
  selectedBlocks.value = []
}

const addRow = () => {
  if (rows.value[rows.value.length - 1] === String(23)) return
  rows.value.push(String(Number(rows.value[rows.value.length - 1]) + 1).padStart(2, '0'))
}

const createTaskHandler = async (task: UserTask) => {

  await createTask(task)

  responseTasks.value = await getTasks()

  isCreateTaskDialogVisible.value = false
}

const updateActiveBlocks = () => {
  activeBlocks.value.clear()
  tasks.value.forEach(task => {
    task.time.forEach(time => {
      activeBlocks.value.set(time, task.color)
    })
  })
}

const isPicked = (block: string): string => {
  for (const task of responseTasks.value) {
    const pickedTimeArray = task.pickedTime.split(',')

    for (const pickedTimeItem of pickedTimeArray) {
      if (pickedTimeItem === block) {
        return task.color
      }
    }
  }

  return 'black';
}

watch(tasks, updateActiveBlocks)

updateActiveBlocks()
</script>

<template>
  <VCreateTaskDialog v-if="isCreateTaskDialogVisible" :tasks="responseTasks" :picked-time="selectedBlocks"
    @create="createTaskHandler($event)" @close="closeTaskDialog" @close-without-save="closeTaskDialogWithoutSave" />
  <div class="main-container">
    <div class="container" @touchend="handleTouchEnd">
      <div class="minutes-wrapper">
        <div class="minutes" v-for="column in columns" :key="column">
          {{ column }}
        </div>
      </div>

      <div class="hours-wrapper" :style="{ gridTemplateRows: `repeat(${rows.length}, 28px)` }">
        <div class="hours" v-for="(row, index) in rows" :key="index">{{ row }}</div>
      </div>

      <div class="blocks-wrapper" :style="{ gridTemplateColumns: `repeat(${columns.length}, 28px)` }">
        <div v-for="block in blocksCount" class="block" :data-tip="block" :key="block"
          :style="[{ backgroundColor: activeBlocks.get(block) || isPicked(block) }]"
          :class="[{ 'current-time': block === currentTime }, { 'picked-block': activeBlocks.has(block) && isSelecting }]"
          @pointerdown="handlePointerDown(block)" @pointerenter="handlePointerEnter(block)"
          @touchstart="handleTouchStart($event, block)" @touchmove="handleTouchMove">
        </div>
      </div>
    </div>
    <button class="row-btn" @click="addRow">Add row</button>

    <VTaskList v-if="responseTasks.length" :tasks="responseTasks" />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  display: grid;
  justify-content: center;
  grid-template:
    '. minutes .' 24px
    'hours blocks timeOfDay' / 24px auto 24px;
}

.minutes-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
  grid-area: 1 / 2 / minutes / minutes;
}

.minutes {
  justify-self: center;
  align-self: flex-end;
}

.hours-wrapper {
  display: grid;
  grid-template-columns: repeat(1, auto);
  gap: 2px;
  grid-area: 2 / 1 / hours / hours;
}

.hours {
  align-self: center;
}

.blocks-wrapper {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(6, 1.75rem);
  grid-area: 2 / 2 / blocks / blocks;
}

.block {
  height: 100%;
  width: 100%;
  user-select: none;
  border: 1px solid black;
  background: black;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.block.current-time::before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  content: '';
}

.block.picked-block {
  border: 1px solid red;
}

.row-btn {
  margin-top: 30px;
  width: 200px;
  height: 40px;
  background: none;
  border: 1px solid grey;
  border-radius: 4px;
  font-size: 16px;
}

.row-btn:hover {
  background: grey;
  color: white;
  transition: 0.3s;
}
</style>