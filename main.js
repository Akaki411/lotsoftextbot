const {VK} = require('vk-io')
const TelegramBot = require('node-telegram-bot-api')
const samples = require('./samples')
const commands = require('./commands')

const vk = new VK({
    token: 'vk1.a.wqWYRjcbdM89tzQxSsVDfxlCegPuxs9Mopl8L0YfnXPPL_pn1z_RCP6fsAjFVkRQEBaiAeJSd_J_crGiFqIbsmqPvjShkRH-Fn8Jtj4RB_ZxSultie8odtWdN3MCJkkMolXy3XC4zHC7plUM84KmChZb1XxIUfLHA65mwCML3ndFn79RQTJPMba8QxPGqAvr'
})

const telebot = new TelegramBot("5418980257:AAEP1sufU6noGIQQYsa2eNMj7AxvKmO88_s")

vk.updates.on('wall_post', (context) => {
    let content = context.wall.text
    if (content.includes("#Новое_@worked_time") || content.includes("#новое_@worked_time"))
    {
        commands.SendNotificationAboutNew(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Черновик_@worked_time") || content.includes("#черновик_@worked_time"))
    {
        commands.SendNotificationAboutDraft(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Шаблон_@worked_time") || content.includes("#шаблон_@worked_time"))
    {
        commands.SendNotificationAboutTemplate(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Обновление_@worked_time") || content.includes("#обновление_@worked_time"))
    {
        commands.SendNotificationAboutUpdate(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Оффтоп_@worked_time") || content.includes("#оффтоп_@worked_time"))
    {
        commands.SendNotificationAboutOffTop(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Мнение_@worked_time") || content.includes("#мнение_@worked_time"))
    {
        commands.SendNotificationAboutOpinion(vk, context)
        SendTelegramPost(context)
    }
    else if (content.includes("#Переиздание_@worked_time") || content.includes("#переиздание_@worked_time"))
    {
        commands.SendNotificationAboutRepublication(vk, context)
        SendTelegramPost(context)
    }
    else
    {
        commands.SendNotificationAboutStuff(vk, context)
        SendTelegramPost(context)
    }
})

vk.updates.on('message_new', (context) => {
    if (context.text === "Начать") commands.Start(context)
    else if (context.text === "Назад") commands.Back(context)
    else if (context.text === "Подписаться") commands.Subscribe(context)
    else if (context.text === "Отписаться") commands.Unsubscribe(context)
    else if (context.text === "Админка" && samples.admins.includes(context.peerId)) commands.GetAdminPanel(context)
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
    else if (samples.admins.includes(context.peerId)) commands.CommandHandler(context, vk)
    else commands.SendRandomResponse(context)
})

function SendTelegramPost(context)
{
    let text = context.wall.text
    let repost = context.wall.copyHistory[0]
    let photoURL = null
    let linkURL = ""
    let itHasPhoto = false
    context.wall.attachments.forEach((attachment) => {
        if (attachment.type === "photo")
        {
            photoURL = attachment.largeSizeUrl
            itHasPhoto = true
        }
        if (attachment.type === "link")
        {
            linkURL = attachment.url
        }
    })
    if (itHasPhoto)
    {
        if (context.wall.text.length > 950)
        {
            text = context.wall.text.substr(0, 950) + "... \nЧитать дальше в группе https://vk.com/worked_time"
        }
        else
        {
            text = context.wall.text
        }
    }
    else
    {
        if (context.wall.text.length > 3900)
        {
            text = context.wall.text.substr(0, 3900) + "... \nЧитать дальше в группе https://vk.com/worked_time"
        }
        else
        {
            text = context.wall.text
        }
    }
    if (repost)
    {
        vk.api.groups.getById({group_id: repost.ownerId * -1}).then((result) => {
            let repostText = repost.text
            let repostAttachment = repost.attachments
            let isHasAttachment = false
            if(repostAttachment.length !== 0)
            {
                repostAttachment.forEach((attachment) => {
                    if (attachment.type === "photo") {
                        isHasAttachment = true
                        photoURL = attachment.largeSizeUrl
                    }
                })
            }
            if (isHasAttachment)
            {
                if (repostText.length > 950)
                {
                    text = `Репост из группы "${result[0].name}" \n\n${repostText.substr(0, 950) + "..."} \nЧитать дальше в группе https://vk.com/worked_time`
                }
                else
                {
                    text = `Репост из группы "${result[0].name}" \n\n${repostText}`
                }
                telebot.sendPhoto(-1001725789637, photoURL, {caption: text })
            }
            else
            {
                if (repostText.length > 3900)
                {
                    text = `Репост из группы "${result[0].name}" \n\n${repostText.substr(0, 3900) + "..."} \nЧитать дальше в группе https://vk.com/worked_time`
                }
                else
                {
                    text = `Репост из группы "${result[0].name}" \n\n${repostText}`
                }
                telebot.sendMessage(-1001725789637, text)
            }
        })
        return
    }
    if (photoURL)
    {
        telebot.sendPhoto(-1001725789637, photoURL, {caption: text + "\n" + linkURL })
    }
    else
    {
        telebot.sendMessage(-1001725789637, text + "\n" + linkURL)
    }
}

vk.updates.start().then(() => console.log("Бот запущен"))