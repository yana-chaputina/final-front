export default class Translator {
    constructor() {
        this.init();
    }

    init() {
        this.lang = languages[0];
        for (const language of languages) {
            if (navigator.languages.includes(language)) {
                this.lang = language;
                break;
            }
        }
    }

    translate(code) {
        return translations[this.lang][code] || translations[this.lang]['error.unknown'];
    }
}

const languages = ['ru', 'en'];

const translations = {
    ru: {
        'error.network': 'Ошибка сети. Проверьте подключение',
        'error.unknown': 'Неизвестная ошибка',
        'error.message_send': 'Не удалось отправить сообщение',
        'error.bad_filetype': 'Неправильный формат файла',
        'error.forbidden': 'У вас недостаточно прав для совершения операции',
        'error.not_found': 'Не найдено',
        'error.validation': 'Введены неправильные данные',
        'error.unauthorized': 'Ошибка авторизации',
        'error.constraint':'Такой пользователь уже существует',
        'error.validation.min_size':'Слишком короткая запись',
        'error.validation.max_size':'Слишком длинная запись',
        'error.validation.email':'Неправильный тип адреса',

        'name':'Имя',
        'password':'Пароль',
        'email':'Email',
        'content':'Поле новости',
        'username':'Логин'



    },
    en: {
        'error.network': 'Network error',
        'error.unknown': 'Unknown error',
        'error.message_send': 'Can\'t send message',
        'error.bad_filetype': 'Invalid file type',
        'error.forbidden': 'You have no rights for this',
        'error.not_found': 'Not found',
        'error.validation': 'Entered invalid data',
        'error.unauthorized': 'Unautorized',
        'error.constraint':'Such user is exist already',
        'error.validation.min_size':'Too short',
        'error.validation.max_size':'Too long',
        'error.validation.email':'Invalid email',

        'name':'Name',
        'password':'Password',
        'email':'Email',
        'content':'Content',
        'username':'Login'
    }
};

