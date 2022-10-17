const {VK} = require('vk-io')
const TelegramBot = require('node-telegram-bot-api')
const samples = require('./samples')
const commands = require('./commands')
const sequelize = require('./database')
const {Admins} = require('./models')
const TelegramSender = require('./telegram-sender')
require('dotenv').config()

const vk = new VK({token: process.env.vk_token})
const telebot = new TelegramBot(process.env.telegram_token)
const telesender = new TelegramSender(telebot)

let admins = []

async function StartDB()
{
    await sequelize.authenticate()
    await sequelize.sync()
    try
    {
        await Admins.create({id: 565472458})
    }
    catch{}

    admins = await Admins.findAll()
}
StartDB()

vk.updates.on('wall_post', (context) => {
    let content = context.wall.text
    if (content.includes("#Новое_@worked_time") || content.includes("#новое_@worked_time"))
    {
        commands.SendNotificationAboutNew(vk, context)
    }
    else if (content.includes("#Черновик_@worked_time") || content.includes("#черновик_@worked_time"))
    {
        commands.SendNotificationAboutDraft(vk, context)
    }
    else if (content.includes("#Шаблон_@worked_time") || content.includes("#шаблон_@worked_time"))
    {
        commands.SendNotificationAboutTemplate(vk, context)
    }
    else if (content.includes("#Обновление_@worked_time") || content.includes("#обновление_@worked_time"))
    {
        commands.SendNotificationAboutUpdate(vk, context)
    }
    else if (content.includes("#Оффтоп_@worked_time") || content.includes("#оффтоп_@worked_time"))
    {
        commands.SendNotificationAboutOffTop(vk, context)
    }
    else if (content.includes("#Мнение_@worked_time") || content.includes("#мнение_@worked_time"))
    {
        commands.SendNotificationAboutOpinion(vk, context)
    }
    else if (content.includes("#Переиздание_@worked_time") || content.includes("#переиздание_@worked_time"))
    {
        commands.SendNotificationAboutRepublication(vk, context)
    }
    else
    {
        commands.SendNotificationAboutStuff(vk, context)
    }
    DestructPost(context)
})

vk.updates.on('message_new', (context) => {
    try
    {
        let isAdmin = false
        admins.forEach(admin => {
            if (admin.dataValues.id === context.peerId)
            {
                isAdmin = true
            }
        })
        if(isAdmin && context.attachments[0])
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
            return
        }

        if (context.text === "Начать") commands.Start(context, isAdmin)
        else if (context.text === "Назад") commands.Back(context, isAdmin)
        else if (context.text === "Подписаться") commands.Subscribe(context)
        else if (context.text === "Отписаться") commands.Unsubscribe(context)
        else if (context.text === "Админка" && isAdmin) commands.GetAdminPanel(context)
        else if (context.text === "Подписаться на все оповещения") commands.SubscribeToAll(context)
        else if (context.text === "Новое") commands.SubscribeToNew(context)
        else if (context.text === "Черновики") commands.SubscribeToDrafts(context)
        else if (context.text === "Шаблоны") commands.SubscribeToTemplates(context)
        else if (context.text === "Обновления") commands.SubscribeToUpdates(context)
        else if (context.text === "Оффтопы") commands.SubscribeToOffTops(context)
        else if (context.text === "Мнения") commands.SubscribeToOpinions(context)
        else if (context.text === "Переиздания") commands.SubscribeToRepublications(context)
        else if (context.text === "Прочее") commands.SubscribeToStuff(context)
        else if (context.text === "Отписаться от всех оповещений") commands.UnsubscribeToAll(context)
        else if (context.text === "От нового") commands.UnsubscribeToNew(context)
        else if (context.text === "От черновиков") commands.UnsubscribeToDrafts(context)
        else if (context.text === "От шаблонов") commands.UnsubscribeToTemplates(context)
        else if (context.text === "От обновлений") commands.UnsubscribeToUpdates(context)
        else if (context.text === "От оффтопов") commands.UnsubscribeToOffTops(context)
        else if (context.text === "От мнений") commands.UnsubscribeToOpinions(context)
        else if (context.text === "От переизданий") commands.UnsubscribeToRepublications(context)
        else if (context.text === "От прочего") commands.UnsubscribeToStuff(context)
        else if (context.text.includes("Апострофыч") || context.text.includes("апострофыч") || context.text.includes("Апострофич") || context.text.includes("апострофич")) commands.GetPorfirevichText(context)
        else if (isAdmin) commands.CommandHandler(context, vk, sequelize, UpdateAdmins)
    }
    catch (e)
    {
        console.log(e.message)
    }
})

async function UpdateAdmins()
{
    admins = await Admins.findAll()
}

async function GetGroupName(id)
{
    return vk.api.groups.getById({group_id: id * -1})
}

async function GetVideo(id)
{
    return await vk.api.video.get({
        videos: id
    })
}

async function DestructPost(context)
{
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
        })
    }

    texts = telesender.DestructText(text, 4000)
    texts.concat(linkURL)

    if (photoURL.length > 0)
    {
        for(let i = 0; i < photoURL.length; i++)
        {
            await telesender.SendPhoto(photoURL[i])
        }
    }
    for(let i = 0; i < texts.length; i++)
    {
        if(i === texts.length - 1)
        {
            await telesender.SendCloseMessage(texts[i])
            break
        }
        await telesender.SendMessage(texts[i])
    }
}

vk.updates.start().then(() => console.log("Бот запущен"))