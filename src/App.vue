<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import VCreateTaskDialog from '@/components/dialogs/VCreateTaskDialog.vue'
import type { UserTask } from './@types/task'
import VTaskList from './components/VTaskList.vue';

const rows = ref<string[]>(['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'])
const columns = ref<string[]>(['00', '10', '20', '30', '40', '50'])

const telegram = Telegram.WebApp

const tasks = ref<UserTask[]>([])

onMounted(() => {
  telegram.enableClosingConfirmation()
})

const isCreateTaskDialogVisible = ref<boolean>(false)
const selectedBlocks = ref<string[]>([])
const currentTaskColor = ref<string>('grey')

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
  const minRow = Math.min(startIndex, endIndex)
  const maxRow = Math.max(startIndex, endIndex)

  const startColIndex = columns.value.indexOf(startCoords.col)
  const endColIndex = columns.value.indexOf(endCoords.col)
  const minCol = Math.min(startColIndex, endColIndex)
  const maxCol = Math.max(startColIndex, endColIndex)


  if (startIndex <= endIndex) {
    for (let i = minRow; i <= maxRow; i++) {
      for (
        let j = i === minRow ? minCol : 0;
        j <= (i === maxRow ? maxCol : columns.value.length - 1);
        j++
      ) {
        activeBlocks.value.set(`${rows.value[i]}:${columns.value[j]}`, currentTaskColor.value)
      }
    }
  } else {
    for (let i = maxRow; i >= minRow; i--) {
      for (
        let j = i === maxRow ? maxCol : columns.value.length - 1;
        j >= (i === minRow ? minCol : 0);
        j--
      ) {
        activeBlocks.value.set(`${rows.value[i]}:${columns.value[j]}`, currentTaskColor.value)
      }
    } 
  }
}

const handleMouseUp = () => {
  const activeBlocksArray = Array.from(activeBlocks.value.keys())
  if (activeBlocksArray.length > 1) {
    selectedBlocks.value = activeBlocksArray.sort((a, b) => a.localeCompare(b))
  } else {
    selectedBlocks.value = activeBlocksArray
  }

  isCreateTaskDialogVisible.value = true
}

const closeTaskDialog = () => {
  isCreateTaskDialogVisible.value = false
}

const closeTaskDialogWithoutSave = () => {
  isCreateTaskDialogVisible.value = false
}

const addRow = () => {
  if (rows.value[rows.value.length - 1] === String(23)) return
  rows.value.push(String(Number(rows.value[rows.value.length - 1]) + 1))
}

const createTaskHandler = (task: UserTask) => {
  task.color = currentTaskColor.value // Assign a unique color to each task
  tasks.value.push(task)

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

const generateColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

watch(tasks, updateActiveBlocks)

updateActiveBlocks()

watch(isCreateTaskDialogVisible, (newValue) => {
  if (newValue) {
    currentTaskColor.value = generateColor();
  }
})

</script>

<template>
  <VCreateTaskDialog
    v-if="isCreateTaskDialogVisible"
    :picked-time="selectedBlocks"
    @create="createTaskHandler($event)"
    @close="closeTaskDialog"
    @close-without-save="closeTaskDialogWithoutSave"
  />
  <div class="main-container">
    <div class="container" @pointerup="handlePointerUp" @touchend="handleTouchEnd">
      <div class="minutes-wrapper">
        <div class="minutes" v-for="column in columns" :key="column">
          {{ column }}
        </div>
      </div>

      <div class="hours-wrapper" :style="{ gridTemplateRows: `repeat(${rows.length}, 28px)` }">
        <div class="hours" v-for="(row, index) in rows" :key="index">{{ row }}</div>
      </div>

      <div
        class="blocks-wrapper"
        :style="{ gridTemplateColumns: `repeat(${columns.length}, 28px)` }"
      >
        <div
          v-for="block in blocksCount"
          class="blocks"
          :data-tip="block"
          :key="block"
          :style="{ backgroundColor: activeBlocks.get(block) || 'black' }"
          @pointerdown="handlePointerDown(block)"
          @pointerenter="handlePointerEnter(block)"
          @touchstart="handleTouchStart($event, block)"
          @touchmove="handleTouchMove"
        />
      </div>
    </div>
    <button class="row-btn" @click="addRow">Add row</button>

    <VTaskList v-if="tasks.length" :tasks="tasks" />
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

.blocks {
  height: 100%;
  width: 100%;
  user-select: none;
  background: black;
  border-radius: 4px;
  cursor: pointer;
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
