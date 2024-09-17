<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted } from 'vue'
import type { ComboboxOption, UserTask } from '../../types/task';
import VCombobox from '../ui/VCombobox.vue';

const emits = defineEmits(['close', 'create', 'closeWithoutSave'])

const props = defineProps<{
    pickedTime: string[]
}>()

const summaryText = ref<string>('')

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        emits('closeWithoutSave')
    }
}

onMounted(() => {
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

const color = ref<string>('')

const options = ref<ComboboxOption[]>([
    {
        label: 'Raffkers fix land',
        value: 'Raffkers fix land'
    },

    {
        label: 'Shopot fix upload',
        value: 'Shopot fix upload'
    },

    {
        label: 'Shopot feat telegram bot',
        value: 'Shopot feat telegram bot'
    }
])

const createHandler = (): void => {
    const output: UserTask = {
        time: props.pickedTime,
        summary: summaryText.value,
        selectedTime: selectedTime.value,
        color: color.value,
        option: optionsModel.value
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

            <button class="save-btn" @click="createHandler">Create</button>
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
</style>