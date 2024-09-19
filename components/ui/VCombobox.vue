<template>
    <div class="combobox-container" v-click-outside="() => isFocused = false">
        <input class="combobox-input" @focus="isFocused = true" v-model="inputModel" type="text" />

        <div class="combobox-options" v-if="isFocused">
            <div class="combobox-option" v-if="!filteredOptions.length">No options</div>
            <div class="combobox-option" v-for="option in filteredOptions" :key="option.value"
                :class="{ 'selected': option.value === selectedOption }" @click="selectOption(option)">
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ComboboxOption } from '../../types/task';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    options: ComboboxOption[];
}>();

const inputModel = ref<string>('')

const isFocused = ref<boolean>(false)

const selectedOption = defineModel<string>();

const filteredOptions = computed<ComboboxOption[]>(() => {
    return props.options.filter(option => option.label.toLowerCase().includes(inputModel.value.toLowerCase()))
})

const selectOption = (option: ComboboxOption) => {
    selectedOption.value = option.value as string
    inputModel.value = option.label
    isFocused.value = false
}

watch(inputModel, (value) => {
    selectedOption.value = value
})

</script>

<style scoped>
.combobox-container {
    display: inline-block;
    position: relative;
    font-family: 'Montserrat', sans-serif;
    margin: 10px 0;
    width: 100%;
}

.combobox-input {
    width: 100%;
    height: 34px;
    outline: none;
    border: 1px solid grey;
    border-radius: 8px;
    padding: 8px;
    font-family: 'Montserrat', sans-serif;
}

.combobox-input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(38, 143, 255, 0.25);
}

.combobox-options {
    position: absolute;
    top: 103%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid grey;
    border-radius: 8px;
    padding: 8px;
    max-height: 200px;
    overflow-y: auto;
}

.combobox-option {
    padding: 8px;
    cursor: pointer;
}

.combobox-option:hover {
    background: #007bff;
    color: white;
}
</style>