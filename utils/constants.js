const PORTSERVER = 3000;
const ADRESS = 'mongodb://localhost:27017/bitfilmsdb';

const NOTFOUNDMESSAGE = 'Пользователь не найден';
const NOTFOUNDMOVIESMESSAGE = 'Фильм не найден';
const CONFLICTMESSAGE = 'Пользователь с введенным Email уже существует';
const BADREQUESTMESSAGE = 'Данные введены неверно';
const UNAUTHORIZEDMESSAGE = 'Неверно введен email или пароль';
const SERVERERRORMESSAGE = 'Ошибка на сервере';
const FORBIDDENMESSAGE = 'Нельзя удалять чужие фильмы';
const UNAUTHORIZEDAUTHMESSAGE = 'Необходима авторизация';
const NOTFOUNDPATHMESSAGE = 'Ресурс не найден';

module.exports = {
  PORTSERVER,
  ADRESS,
  NOTFOUNDPATHMESSAGE,
  UNAUTHORIZEDAUTHMESSAGE,
  FORBIDDENMESSAGE,
  NOTFOUNDMESSAGE,
  CONFLICTMESSAGE,
  BADREQUESTMESSAGE,
  UNAUTHORIZEDMESSAGE,
  SERVERERRORMESSAGE,
  NOTFOUNDMOVIESMESSAGE,
};
