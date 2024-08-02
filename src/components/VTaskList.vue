<script setup lang="ts">
import type { UserTask } from '@/@types/task.d.ts'; 
import VTask from './VTask.vue';

defineProps<{
    tasks: UserTask[]
}>()

</script>

<template>
    <div class="task-container">
        <div class="caption">Tasks:</div>
        <VTask  v-for="(task, index) in tasks" :key="index" :task="task" />
    </div>
</template>


<style scoped>
.task-container {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>