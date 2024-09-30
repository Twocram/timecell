import { Bot } from "grammy";
import process from "process";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", (ctx) => {
  ctx.reply("Привет! Я твой бот!");
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); 
    await bot.handleUpdate(body); 
    return { status: "ok" }; 
  } catch (err: any) {
    console.error(err);
    return { status: "error", message: err.message };
  }
});
