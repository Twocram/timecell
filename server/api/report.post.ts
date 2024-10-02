import { Bot } from "grammy";
import {Task} from "~/types/task";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { tasks } = await readBody(event) as {
        tasks: Task[]
    }

    const bot = new Bot(config.botToken)
    const chat_id = config.groupChatId

    const message = tasks.map((task) => {
        return `- ${task.name} \n ${task.summary}\n\n`
    }).join('')

    await bot.api.sendMessage(chat_id, message)

    return {
        ok: true,
    };
})
