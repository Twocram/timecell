import type { Task, UserTask } from "~/types/task";

export async function getTasks(telegramId: number): Promise<Task[]> {
  try {
    const response = await $fetch("/api/task", {
      method: "get",
      headers: {
        'authorization': `Bearer ${telegramId}`,
      }
    });

    return response as unknown as Task[];
  } catch (err) {
    return [];
  }
}

export async function createTask(task: UserTask) {
  try {
    await $fetch("/api/task", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: task.option,
        time: task.selectedTime,
        summary: task.summary,
        color: task.color,
        pickedTime: task.pickedTime,
        telegramId: task.telegramId,
        minutes: task.minutes,
        startTime: task.startTime,
        endTime: task.endTime,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}
