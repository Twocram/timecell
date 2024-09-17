import type { Task, UserTask } from "~/types/task";

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await $fetch("/api/task", {
      method: "get",
    });

    const data = response as Task[];

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createTask(task: UserTask) {
  try {
    await $fetch("/api/task", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.option,
        time: task.selectedTime,
        summary: task.summary,
        color: task.color,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}
