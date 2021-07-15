# movies-explorer-api

## О проекте:

Бэкенд для приложения movies-explorer.

**Стек технологий:**

![](https://img.shields.io/badge/-JS-000000?style=for-the-badge&logo=JavaScript)
![](https://img.shields.io/badge/-Node.JS-000000?style=for-the-badge&logo=NODE.JS)
![](https://img.shields.io/badge/-express-000000?style=for-the-badge&logo=EXPRESS)
![](https://img.shields.io/badge/-MongoDB-000000?style=for-the-badge&logo=MONGODB)

**Директории**

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и фильма   
`/models` — папка с файлами описания схем пользователя и фильма 
`/middlewares` — содержит мидлвару для проверки токена 
`/errors` — папка содержит классы ошибок
  
**Запуск проекта**

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

**Запросы**

GET /users/me  - возвращает информацию о пользователе (email и имя)

PATCH /users/me  - обновляет информацию о пользователе (email и имя)

GET /movies - возвращает все сохранённые пользователем фильмы

POST /movies - создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

DELETE /movies/movieId - удаляет сохранённый фильм по id

POST /signup - создаёт пользователя с переданными в теле email, password и name

POST /signin - проверяет переданные в теле почту и пароль и возвращает JWT

POST /signout - выход из профиля(удаляет токен)


**Локальная установка:**
1. Для работы необходимо установить Node.js и MongoDB.

2. Скачать репозиторий.
3. Установить зависимости
```
npm ci
```
4. Запустить приложение командой
```
npm run start
```
или для запуска с hot-reload
```
npm run dev
```
5. Если все сделано правильно, то можно будет отправлять запросы на: http://localhost:3000/. Запросы можно отправлять через Postman.

**Ссылки на проект**

1. https://api.hlopkov-movies-exp.nomoredomains.monster
2. Публичный ip - 84.252.136.157
