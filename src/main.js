import {Telegraf} from 'telegraf'
import config from 'config'
import { message } from 'telegraf/filters'
import { ogg } from './ogg.js'
import { openai } from './openai.js'

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))


bot.on(message('voice'), async ctx => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const user_id = String(ctx.message.from.id)
    const oggPath = await ogg.create(link.href, user_id)
    //await ctx.reply(JSON.stringify(link, null, 2))
    const mp3Path = await ogg.toMp3(oggPath, user_id)
    
    const text = await openai.transcription(mp3Path)
    //const response = await openai.chat(text)
    console.log("IMHERE");
    await ctx.reply(text)
  } catch (error) {
    console.log("Error while voice message", error.message);
    
  }
  
})

bot.command("start", async(ctx)=>{
  await ctx.reply(JSON.stringify(ctx.message, null, 2))
})
bot.launch()
process.once('SIGINT', ()=> bot.stop("SIGINT"))
process.once('SIGTERM', ()=> bot.stop("SIGTERM"))
