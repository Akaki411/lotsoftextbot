const samples = require("./samples");
const keyboards = require("./keyboards");
const axios = require('axios')
const {Users, Admins} = require('./models')

function RandomID(x)
{
    return Math.floor(Math.random() * x)
}

async function GetUser(id, vk)
{
    return await vk.api.users.get({user_ids: id})
}

class Commands
{
    async Start(context, isAdmin)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        if(user)
        {
            if (isAdmin)
            {
                context.send("Назад", {keyboard: keyboards.adminDefaultKeyboard})
            }
            else
            {
                context.send("Назад", {keyboard: keyboards.defaultKeyboard})
            }
        }
        else
        {
            await Users.create({id: context.peerId})
            if (isAdmin)
            {
                context.send("Привет хозяин!", {keyboard: keyboards.adminDefaultKeyboard})
            }
            else
            {
                context.send(samples.welcome_text, {keyboard: keyboards.defaultKeyboard})
            }
        }
    }

    async Back(context, isAdmin)
    {
        if (isAdmin)
        {
            context.send("Назад", {keyboard: keyboards.adminDefaultKeyboard})
        }
        else
        {
            context.send("Назад", {keyboard: keyboards.defaultKeyboard})
        }
    }

    Subscribe(context)
    {
        context.send("Подписаться", {keyboard: keyboards.subscribeKeyboard})
    }

    Unsubscribe(context)
    {
        context.send("Отписаться", {keyboard: keyboards.unsubscribeKeyboard})
    }

    GetAdminPanel(context)
    {
        context.send("Админка", {keyboard: keyboards.adminKeyboard})
    }

    async SubscribeToAll(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({
            new: true,
            drafts: true,
            templates: true,
            updates: true,
            off_topic: true,
            opinions: true,
            republications: true,
            stuff: true})
        await user.save()
        context.send("Вы подписались на получение любых уведомлений.\n Храни вас Господь!")
    }

    async SubscribeToNew(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({new: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о новых работах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToDrafts(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({drafts: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о черновиках. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToTemplates(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({templates: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о шаблонах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToUpdates(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({updates: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений об обновлениях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToOffTops(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({off_topic: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений об оффтопах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToOpinions(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({opinions: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о постах с мнением автора. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToRepublications(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({republications: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о переизданиях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async SubscribeToStuff(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({stuff: true})
        await user.save()
        context.send(`Вы подписались на получение уведомлений о технических и неформатных постах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    async UnsubscribeToAll(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({
            new: false,
            drafts: false,
            templates: false,
            updates: false,
            off_topic: false,
            opinions: false,
            republications: false,
            stuff: false})
        await user.save()
        context.send(`Вы отписались от получения любых уведомлений, фу таким быть.\n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToNew(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({new: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о новых работах. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToDrafts(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({drafts: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о черновиках. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToTemplates(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({templates: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о шаблонах. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToUpdates(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({updates: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений об обновлениях. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToOffTops(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({off_topic: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений об оффтопах. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToOpinions(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({opinions: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о постах с мнением автора.. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToRepublications(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({republications: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о переизданиях. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    async UnsubscribeToStuff(context)
    {
        let user = await Users.findOne({where: {id: context.peerId}})
        await user.update({stuff: false})
        await user.save()
        context.send(`Вы отписались от получения уведомлений о технических и неформатных постах. \n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    SendRandomResponse(context)
    {
        context.send(samples.unknown_text_responses[RandomID(samples.unknown_text_responses.length)])
    }

    async SendNotificationAboutNew(context, post)
    {
        let users = await Users.findAll({where: {new: true}})
        users.forEach((user) => {
            context.api.messages.send({
                peer_id: user.id,
                message: samples.notification_text_new[RandomID(samples.notification_text_new.length)],
                random_id: 0,
                attachment: `wall${post.wall.ownerId}_${post.wall.id}`
            })
        })
    }

    async SendNotificationAboutDraft(context, post)
    {
        let users = await Users.findAll({where: {drafts: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_draft[RandomID(samples.notification_text_draft.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutTemplate(context, post)
    {
        let users = await Users.findAll({where: {templates: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_templates[RandomID(samples.notification_text_templates.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutUpdate(context, post)
    {
        let users = await Users.findAll({where: {updates: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_updates[RandomID(samples.notification_text_updates.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutOffTop(context, post)
    {
        let users = await Users.findAll({where: {off_topic: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_off_topic[RandomID(samples.notification_text_off_topic.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutOpinion(context, post)
    {
        let users = await Users.findAll({where: {new: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_opinions[RandomID(samples.notification_text_opinions.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutRepublication(context, post)
    {
        let users = await Users.findAll({where: {new: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_republications[RandomID(samples.notification_text_republications.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    async SendNotificationAboutStuff(context, post)
    {
        let users = await Users.findAll({where: {new: true}})
            users.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.id,
                    message: samples.notification_text_stuff[RandomID(samples.notification_text_stuff.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
    }

    GetPorfirevichText(context)
    {
        let command = context.text.substr(context.text.indexOf(" ") + 1)
        axios.post("https://pelevin.gpt.dobro.ai/generate/", {prompt: command, length: 100}).then((result) => context.send(command + result.data.replies[0])).catch((err) => context.send("Я не хочу с тобой говорить, я обиделся!"))
    }

    async CommandHandler(context, vk, sequelize, callback)
    {
        let users = []
        let user = {}
        if (context.text === "Команды")
        {
            context.send(`Список команд:
                           * getuser + <ID> - возвращает имя пользователя по его id
                           * sql + <query> - SQL запрос к базе данных
                           * level + <ID> - возвращает информацию о подписках пользователя
                           * addadmin + <ID> - Добавляет администратора по id
            `)
        }
        else if (context.text === "Количество подписчиков")
        {
            users = await Users.findAll()
            context.send(`Количество подписчиков: ${users.length}`)
        }
        else if ((context.text === "Все подписчики"))
        {
            users = await Users.findAll()
            let usersText = "\n"
            let status = ''
            users.forEach((user) => {
                if(user.dataValues.new && user.dataValues.drafts && user.dataValues.templates && user.dataValues.updates && user.dataValues.off_topic && user.dataValues.opinions && user.dataValues.republications && user.dataValues.stuff) status = " - подписан на все"
                else if(user.dataValues.new || user.dataValues.drafts || user.dataValues.templates || user.dataValues.updates || user.dataValues.off_topic || user.dataValues.opinions || user.dataValues.republications || user.dataValues.stuff) status = " - подписан частично"
                else status = " - ни на что не подписан"
                usersText += `${user.dataValues.id} ${status}\n`
            })
            context.send(`Подписчики: ${usersText}`)
        }
        else if ((context.text === "Проверить БД"))
        {
            try
            {
                await Users.findAll()
                context.send("База данных жива!")
            }
            catch (e)
            {
                context.send(`База данных упала с ошибкой \n ${e.message}`)
            }
        }
        else
        {
            let prefix = context.text.split(' ')[0]
            let command = context.text.substr(context.text.indexOf(" ") + 1)
            if(prefix === "sql")
            {
                context.send(`${JSON.stringify(await sequelize.query(command))}`)
            }
            else if (prefix === "getuser")
            {
                GetUser(command, vk).then((res) => {context.send(`ID: ${res[0].id} \nИмя: ${res[0].first_name} \nФамилия: ${res[0].last_name}`)}).catch(() => context.send("Не верный формат ID"))
            }
            else if (prefix === "addadmin")
            {
                try
                {
                    await Admins.create({id: command})
                    context.send(`${command} добавлен в администраторы`)
                    callback()
                }
                catch (e)
                {
                    context.send("Не верный формат ID")
                }
            }
            else if (prefix === "level")
            {
                try
                {
                    user = await Users.findOne({where: {id: command}})
                    GetUser(command, vk).then((res) => {context.send(`
                            ID: ${res[0].id}
                            Имя: ${res[0].first_name}
                            Фамилия: ${res[0].last_name}
                            Новое: ${user.dataValues.new ? "да" : "нет"}
                            Черновики: ${user.dataValues.drafts ? "да" : "нет"}
                            Шаблоны: ${user.dataValues.templates ? "да" : "нет"}
                            Обновления: ${user.dataValues.updates ? "да" : "нет"}
                            Оффтопы: ${user.dataValues.off_topic ? "да" : "нет"}
                            Мнения: ${user.dataValues.opinions ? "да" : "нет"}
                            Переиздания: ${user.dataValues.republications ? "да" : "нет"}
                            Прочее: ${user.dataValues.stuff ? "да" : "нет"}
                            `)}).catch(() => context.send("Не верный формат ID"))
                }
                catch (e)
                {
                    context.send(e.message)
                }
            }
            else
            {
                context.send("Command is not found.")
            }
        }
    }
}

module.exports = new Commands()