<script setup lang="ts">
import type { Task } from '../types/task';
import VTask from './VTask.vue';

defineProps<{
    tasks: Task[]
}>()

</script>

<template>
    <div class="task-container">
        <div class="caption">Summary:</div>
        <VTask v-for="(task, index) in tasks" :key="index" :task="task" />
    </div>
</template>


<style scoped>
.task-container {
    max-width: 310px;
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
