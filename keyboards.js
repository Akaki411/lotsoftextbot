const {Keyboard} = require('vk-io')

const defaultKeyboard = Keyboard.builder()
    .textButton({label: 'Подписаться', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Отписаться', color: Keyboard.NEGATIVE_COLOR})

const adminDefaultKeyboard = Keyboard.builder()
    .textButton({label: 'Подписаться', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Отписаться', color: Keyboard.NEGATIVE_COLOR})
    .row()
    .textButton({label: 'Админка', color: Keyboard.SECONDARY_COLOR})

const adminKeyboard = Keyboard.builder()
    .textButton({label: 'Количество подписчиков', color: Keyboard.PRIMARY_COLOR})
    .textButton({label: 'Все подписчики', color: Keyboard.PRIMARY_COLOR})
    .textButton({label: 'Проверить БД', color: Keyboard.PRIMARY_COLOR})
    .row()
    .textButton({label: 'Команды', color: Keyboard.PRIMARY_COLOR})
    .row()
    .textButton({label: 'Назад', color: Keyboard.SECONDARY_COLOR})

const subscribeKeyboard = Keyboard.builder()
    .textButton({label: 'Подписаться на все оповещения', color: Keyboard.POSITIVE_COLOR})
    .row()
    .textButton({label: 'Новое', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Черновики', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Шаблоны', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Обновления', color: Keyboard.POSITIVE_COLOR})
    .row()
    .textButton({label: 'Оффтопы', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Мнения', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Переиздания', color: Keyboard.POSITIVE_COLOR})
    .textButton({label: 'Прочее', color: Keyboard.POSITIVE_COLOR})
    .row()
    .textButton({label: 'Назад', color: Keyboard.SECONDARY_COLOR})

const unsubscribeKeyboard = Keyboard.builder()
    .textButton({label: 'Отписаться от всех оповещений', color: Keyboard.NEGATIVE_COLOR})
    .row()
    .textButton({label: 'От нового', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От черновиков', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От шаблонов', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От обновлений', color: Keyboard.NEGATIVE_COLOR})
    .row()
    .textButton({label: 'От оффтопов', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От мнений', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От переизданий', color: Keyboard.NEGATIVE_COLOR})
    .textButton({label: 'От прочего', color: Keyboard.NEGATIVE_COLOR})
    .row()
    .textButton({label: 'Назад', color: Keyboard.SECONDARY_COLOR})


module.exports = {
    defaultKeyboard,
    adminDefaultKeyboard,
    adminKeyboard,
    subscribeKeyboard,
    unsubscribeKeyboard
}