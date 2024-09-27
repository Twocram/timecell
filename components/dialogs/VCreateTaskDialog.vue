<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ComboboxOption, Task, UserTask } from '../../types/task';
import VCombobox from '../ui/VCombobox.vue';

const emits = defineEmits(['close', 'create', 'closeWithoutSave'])

const props = defineProps<{
    pickedTime: string[],
    tasks: Task[],
}>()

const telegramId = ref<number | null>(null)

const summaryText = ref<string>('')

const isLoading = ref<boolean>(false)

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        emits('closeWithoutSave')
    }
}

onMounted(() => {
    const telegram = useTelegram()
    telegramId.value = telegram.getUserId()
    document.body.classList.add('overflow')
    document.addEventListener('keydown', handleKeydown)
})

const selectedTime = computed<string>(() => {
    if (props.pickedTime.length > 1) {
        return `${props.pickedTime[0]} - ${props.pickedTime[props.pickedTime.length - 1]}`
    }

    return props.pickedTime[0]
})

const optionsModel = ref<string>('')

const color = ref<string>('#000000')

const options = computed<ComboboxOption[]>(() => {
    const _options = props.tasks.map((task) => {
        return {
            label: task.name,
            value: task.name,
        }
    })

    const uniqueOptions = [
        ...new Map(_options.map(item => [item.label, item])).values()
    ];

    return uniqueOptions
})

const createHandler = (): void => {
    if (isLoading.value) return;

    isLoading.value = true;

    const output: UserTask = {
        time: props.pickedTime,
        summary: summaryText.value,
        selectedTime: selectedTime.value,
        color: color.value,
        option: optionsModel.value,
        pickedTime: props.pickedTime,
        telegramId: telegramId.value || 0
    }

    emits('create', output)
}

onBeforeUnmount(() => {
    document.body.classList.remove('overflow')
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div class="container" @click.self="emits('closeWithoutSave')">
        <div class="wrapper">
            <div class="caption">Create Task</div>

            <VCombobox v-model="optionsModel" :options="options" />

            <div class="time-container">
                <div class="caption-sub">Selected time: {{ selectedTime }}</div>
            </div>

            <div class="color-container">
                <div class="caption-sub">Color: {{ color }}</div>

                <input type="color" v-model="color" />
            </div>

            <div class="summary-container">
                <div class="caption-sub">Summary:</div>

                <textarea v-model="summaryText" class="summary" name="summary" id="summary" cols="30"
                    rows="10"></textarea>
            </div>

            <button :aria-disabled="isLoading" :class="{ 'disabled': isLoading }" class="save-btn"
                @click="createHandler">
                <template v-if="isLoading">
                    <div class="lds-dual-ring"></div>
                </template>

                <template v-else>
                    Create
                </template>
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
}

.wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: auto;
    background: white;
    border-radius: 8px;
    padding: 16px;
}

.caption {
    font-size: 20px;
    font-weight: 600;
}

.input {
    width: 100%;
    height: 28px;
    outline: none;
    margin-top: 8px;
    border: 1px solid grey;
    border-radius: 4px;
    padding: 4px;
}

.save-btn {
    margin-top: 14px;
    width: 100%;
    height: 40px;
    background: none;
    border: 1px solid grey;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
}

.save-btn.disabled {
    cursor: not-allowed;
}

.save-btn:hover {
    background: grey;
    color: white;
    transition: 0.3s;
}

.summary {
    width: 100%;
    resize: none;
    outline: none;
    border: 1px solid grey;
    border-radius: 8px;
    padding: 8px;
    font-family: 'Montserrat', sans-serif;
}

.summary-container {
    margin-top: 14px;
}

.time-container {
    margin-top: 4px;
}


.lds-dual-ring,
.lds-dual-ring:after {
    box-sizing: border-box;
}

.lds-dual-ring {
    display: inline-block;
    width: 24px;
    height: 24px;
}

.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 24px;
    height: 24px;
    margin-top: 2px;
    border-radius: 50%;
    border: 3.4px solid currentColor;
    border-color: currentColor transparent currentColor transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
