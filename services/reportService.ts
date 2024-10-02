import type {Task} from "~/types/task";

export async function createReport(tasks: Task[]) {
    try {
        await $fetch('/api/report', {
            method: 'post',
            body: JSON.stringify({
                tasks
            })
        })
    } catch (error: Error) {
        console.log(error)
    }
}