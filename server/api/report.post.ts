import { Bot } from "grammy";
import { Task } from "~/types/task";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { tasks } = await readBody(event) as {
        tasks: Task[]
    }

    const bot = new Bot(config.botToken)
    const chat_id = config.groupChatId

    const message = tasks.map((task) => {
        return `- <a href="${task.link}">${task.name}</a> \n ${task.summary}\n\n`
    }).join('')

    await bot.api.sendMessage(chat_id, message, {
        parse_mode: 'HTML'
    })

    return {
        ok: true,
    };
})
