const {VK} = require('vk-io')
const express = require('express')
const app = express()
const TelegramBot = require('node-telegram-bot-api')
const TelegramSender = require('./telegram-sender')
const {admins} = require('./samples')
require('dotenv').config()

const vk = new VK({token: process.env.vk_token})
const telebot = new TelegramBot(process.env.telegram_token)
const telesender = new TelegramSender(telebot)


vk.updates.on('wall_post', context => DestructPost(context))

vk.updates.on('message_new', (context) => {
    try
    {
        let isAdmin = admins.includes(context.peerId)

        if(isAdmin && context.attachments[0] && !context.text)
        {
            try
            {
                DestructPost({wall: context.attachments[0]})
                context.send("Пост опубликован")
            }
            catch (e)
            {
                context.send(`Что-то пошло не так: ${e.message}`)
            }
        }
        else if(isAdmin && context.attachments[0] && context.text)
        {
            context.send("Я не понял, что мне с ним сделать?")
        }
    }
    catch (e)
    {
        console.log(e.message)
    }
})

async function GetGroupName(id)
{
    return vk.api.groups.getById({group_id: id * -1})
}

async function DestructPost(context)
{
    console.log(context)
    let repost = context.wall.copyHistory[0]
    let text = ''
    let photoURL = []
    let linkURL = []
    let texts = []

    if(repost)
    {
        let groupName = await GetGroupName(repost.ownerId)
        text += context.wall.text + "\n Репост из группы " + groupName[0].name + "\n\n" + repost.text
        repost.attachments.forEach((attachment) => {
            if (attachment.type === "photo")
            {
                photoURL.push(attachment.largeSizeUrl)
            }
            if (attachment.type === "link")
            {
                linkURL.push(attachment.url)
            }
        })
    }
    else
    {
        text += context.wall.text
        context.wall.attachments.forEach((attachment) => {
            if (attachment.type === "photo")
            {
                photoURL.push(attachment.largeSizeUrl)
            }
            if (attachment.type === "link")
            {
                linkURL.push(attachment.url)
            }
            console.log(attachment.type)
        })
    }

    texts = telesender.DestructText(text, 4000)
    texts.concat(linkURL)
    texts[0] = telesender.SeparateHeader(texts[0])

    if (photoURL.length > 0)
    {
        for(let i = 0; i < photoURL.length; i++)
        {
            await telesender.SendPhoto(photoURL[i])
        }
    }
    for(let i = 0; i < texts.length; i++)
    {
        await telesender.SendMessage(texts[i])
    }
}
app.get('/', (req, res) => {
    res.send('Бот работает')
})
app.listen(3000)
vk.updates.start().then(() => console.log("Бот запущен"))