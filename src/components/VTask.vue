<script setup lang="ts">
import type { UserTask } from '@/@types/task.d.ts';

defineProps<{
    task: UserTask
}>()

</script>

<template>
    <div class="task">
        <div class="task-option">
            Name: {{ task.option }}
        </div>

        <div class="task-time">
            Selected time: {{ task.selectedTime }}
        </div>

        <div class="task-summary">
            Summary: {{ task.summary }}
        </div>
    </div>
</template>

<style scoped>
.task {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid black;
    border-radius: 4px;
    padding: 8px;
}
</style>