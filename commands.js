const mysql = require('mysql');
const samples = require("./samples");
const keyboards = require("./keyboards");
const axios = require('axios')

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
    constructor()
    {
        this.connection = mysql.createPool({
            connectionLimit : 1000,
            host     : 'remotemysql.com',
            user     : 'yBIH070R9q',
            password : 'xoH84rz3p1',
            database : 'yBIH070R9q'
        })
        this.connection.query('SHOW TABLES LIKE \'vk_users\';', (error, result) => {
            if (result.length === 0) {
                this.connection.query('CREATE TABLE vk_users(ID INT NOT NULL UNIQUE, new BOOL NOT NULL, drafts BOOL NOT NULL, templates BOOL NOT NULL, updates BOOL NOT NULL, off_topic BOOL NOT NULL, opinions BOOL NOT NULL, republications BOOL NOT NULL, stuff BOOL NOT NULL);', (err) => {
                if (!err) console.log("Таблица vk_users создана!")
            })}
        })
    }

    Start(context)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE ID = ${context.peerId}`, (error, result) => {
            if (result.length === 0)
            {
                this.connection.query(`INSERT INTO vk_users(ID, new, drafts, templates, updates, off_topic, opinions, republications, stuff) values (${context.peerId}, false, false, false, false, false, false, false, false);`)
                if (samples.admins.includes(context.peerId))
                {
                    context.send("Привет хозяин!", {keyboard: keyboards.adminDefaultKeyboard})
                }
                else
                {
                    context.send(samples.welcome_text, {keyboard: keyboards.defaultKeyboard})
                }
            }
            else
            {
                if (samples.admins.includes(context.peerId))
                {
                    context.send("Назад", {keyboard: keyboards.adminDefaultKeyboard})
                }
                else
                {
                    context.send("Назад", {keyboard: keyboards.defaultKeyboard})
                }
            }
        })
    }

    Back(context)
    {
        if (samples.admins.includes(context.peerId))
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

    SubscribeToAll(context)
    {
        this.connection.query(`UPDATE vk_users SET new = true, drafts = true, templates = true, updates = true, off_topic = true, opinions = true, republications = true, stuff = true WHERE ID = ${context.peerId};`)
        context.send("Вы подписались на получение любых уведомлений.\n Храни вас Господь!")
    }

    SubscribeToNew(context)
    {
        this.connection.query(`UPDATE vk_users SET new = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о новых работах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToDrafts(context)
    {
        this.connection.query(`UPDATE vk_users SET drafts = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о черновиках. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToTemplates(context)
    {
        this.connection.query(`UPDATE vk_users SET templates = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о шаблонах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToUpdates(context)
    {
        this.connection.query(`UPDATE vk_users SET updates = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений об обновлениях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToOffTops(context)
    {
        this.connection.query(`UPDATE vk_users SET off_topic = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений об оффтопах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToOpinions(context)
    {
        this.connection.query(`UPDATE vk_users SET opinions = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о постах с мнением автора. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToRepublications(context)
    {
        this.connection.query(`UPDATE vk_users SET republications = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о переизданиях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SubscribeToStuff(context)
    {
        this.connection.query(`UPDATE vk_users SET stuff = true WHERE ID = ${context.peerId};`)
        context.send(`Вы подписались на получение уведомлений о технических и неформатных постах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToAll(context)
    {
        this.connection.query(`UPDATE vk_users SET new = false, drafts = false, templates = false, updates = false, off_topic = false, opinions = false, republications = false, stuff = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения любых уведомлений, фу таким быть.\n\n ${samples.unsubscribe_text_responses[RandomID(samples.unsubscribe_text_responses.length)]}`)
    }

    UnsubscribeToNew(context)
    {
        this.connection.query(`UPDATE vk_users SET new = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о новых работах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToDrafts(context)
    {
        this.connection.query(`UPDATE vk_users SET drafts = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о черновиках. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToTemplates(context)
    {
        this.connection.query(`UPDATE vk_users SET templates = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о шаблонах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToUpdates(context)
    {
        this.connection.query(`UPDATE vk_users SET updates = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений об обновлениях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToOffTops(context)
    {
        this.connection.query(`UPDATE vk_users SET off_topic = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений об оффтопах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToOpinions(context)
    {
        this.connection.query(`UPDATE vk_users SET opinions = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о постах с мнением автора.. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToRepublications(context)
    {
        this.connection.query(`UPDATE vk_users SET republications = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о переизданиях. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    UnsubscribeToStuff(context)
    {
        this.connection.query(`UPDATE vk_users SET stuff = false WHERE ID = ${context.peerId};`)
        context.send(`Вы отписались от получения уведомлений о технических и неформатных постах. \n\n ${samples.subscribe_text_responses[RandomID(samples.subscribe_text_responses.length)]}`)
    }

    SendRandomResponse(context)
    {
        context.send(samples.unknown_text_responses[RandomID(samples.unknown_text_responses.length)])
    }

    SendNotificationAboutNew(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE new = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_new[RandomID(samples.notification_text_new.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutDraft(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE drafts = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_draft[RandomID(samples.notification_text_draft.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutTemplate(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE templates = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_templates[RandomID(samples.notification_text_templates.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutUpdate(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE updates = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_updates[RandomID(samples.notification_text_updates.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutOffTop(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE off_topic = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_off_topic[RandomID(samples.notification_text_off_topic.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutOpinion(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE opinions = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_opinions[RandomID(samples.notification_text_opinions.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutRepublication(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE republications = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_republications[RandomID(samples.notification_text_republications.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    SendNotificationAboutStuff(context, post)
    {
        this.connection.query(`SELECT * FROM vk_users WHERE stuff = true`, (error, result) => {
            result.forEach((user) => {
                context.api.messages.send({
                    peer_id: user.ID,
                    message: samples.notification_text_stuff[RandomID(samples.notification_text_stuff.length)],
                    random_id: 0,
                    attachment: `wall${post.wall.ownerId}_${post.wall.id}`
                })
            })
        })
    }

    GetPorfirevichText(context)
    {
        let command = context.text.substr(context.text.indexOf(" ") + 1)
        axios.post("https://pelevin.gpt.dobro.ai/generate/", {prompt: command, length: 100}).then((result) => context.send(command + result.data.replies[0])).catch((err) => context.send("Я не хочу с тобой говорить, я обиделся!"))
    }

    CommandHandler(context, vk)
    {
        if (context.text === "Команды")
        {
            context.send(`Список команд:
                           * getuser + <ID> - возвращает имя и фамилию пользователя по его id 
                           * sql + <query> - SQL запрос к базе данных
                           * level + <ID> - возвращает информацию о подписках пользователя`)
        }
        else if (context.text === "Количество подписчиков")
        {
            this.connection.query(`SELECT COUNT(*) FROM vk_users;`, (error, result) => {
                context.send(`Количество подписчиков: ${result[0]['COUNT(*)']}`)
            })
        }
        else if ((context.text === "Все подписчики"))
        {
            this.connection.query(`SELECT * FROM vk_users;`, (error, result) => {
                let users = "\n"
                let status = ''
                result.forEach((user) => {
                    if(user.new && user.drafts && user.templates && user.updates && user.off_topic && user.opinions && user.republications && user.stuff) status = " - подписан на все"
                    else if(user.new || user.drafts || user.templates || user.updates || user.off_topic || user.opinions || user.republications || user.stuff) status = " - подписан частично"
                    else status = " - ни на что не подписан"
                    users += `${user.ID} ${status}\n`
                })
                context.send(`Подписчики: ${users}`)
            })
        }
        else if ((context.text === "Проверить БД"))
        {
            this.connection.query(`SHOW TABLES LIKE 'vk_users';`, (error) => {
                if (error) context.send("База данных упала!")
                else context.send("База данных жива!")
            })
        }
        else
        {
            let prefix = context.text.split(' ')[0]
            let command = context.text.substr(context.text.indexOf(" ") + 1)
            if(prefix === "sql")
            {
                this.connection.query(command, (error, result) => {
                    if (!error) context.send(`${JSON.stringify(result)}`)
                })
            }
            else if (prefix === "getuser")
            {
                GetUser(command, vk).then((res) => {context.send(`ID: ${res[0].id} \nИмя: ${res[0].first_name} \nФамилия: ${res[0].last_name}`)}).catch(() => context.send("Не верный формат ID"))
            }
            else if (prefix === "level")
            {
                this.connection.query(`SELECT * FROM vk_users WHERE ID = ${command};`, (error, result) => {
                    if (error)
                    {
                        context.send("Не верный формат ID")
                    }
                    else
                    {
                        GetUser(command, vk).then((res) => {context.send(`
                            ID: ${res[0].id}
                            Имя: ${res[0].first_name}
                            Фамилия: ${res[0].last_name}
                            Новое: ${result[0].new ? "да" : "нет"}
                            Черновики: ${result[0].drafts ? "да" : "нет"}
                            Шаблоны: ${result[0].templates ? "да" : "нет"}
                            Обновления: ${result[0].updates ? "да" : "нет"}
                            Оффтопы: ${result[0].off_topic ? "да" : "нет"}
                            Мнения: ${result[0].opinions ? "да" : "нет"}
                            Переиздания: ${result[0].republications ? "да" : "нет"}
                            Прочее: ${result[0].stuff ? "да" : "нет"}
                            `)}).catch(() => context.send("Не верный формат ID"))
                    }

                })
            }
            else
            {
                context.send("Command is not found.")
            }
        }
    }
}

module.exports = new Commands()