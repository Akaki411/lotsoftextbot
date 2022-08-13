class TelegramSender
{
    constructor(bot)
    {
        this.telebot = bot
    }

    DestructText(text, limit)
    {
        let texts = []
        let iter = Math.ceil(text.length / limit)
        for(let i = 0; i < iter; i++)
        {
            texts.push(text.substr(i * limit, limit))
        }
        return texts
    }

    async SendMessage(text)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                this.telebot.sendMessage(process.env.telegram_chat_id, text)
                resolve()
            }, 3000)
        })
    }

    async SendPhoto(url)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                this.telebot.sendPhoto(process.env.telegram_chat_id, url)
                resolve()
            }, 3000)
        })
    }

    async SendCloseMessage(text)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                this.telebot.sendMessage(process.env.telegram_chat_id, text, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Читать больше в группе', url: 'https://vk.com/worked_time'}]
                        ]})
                })
                resolve()
            }, 3000)
        })
    }
}

module.exports = TelegramSender