<script setup lang="ts">
import type { Task } from "../types/task";

defineProps<{
  task: Task;
}>();
</script>

<template>
  <div class="task">
    <div class="task-time">
      {{ task.time }}
    </div>

    <div class="task-option">
      {{ task.name }}
    </div>

    <div class="task-summary">
      {{ task.summary }}
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

.task-time {
    font-size: 14px;
}

.task-option {
    font-size: 16px;
}

.task-summary {
    font-size: 16px;
}
</style>
