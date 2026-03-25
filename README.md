# Re-Fix Chat Backend

Backend-прокси для скрытия API ключа Portkey.

## Установка

```bash
cd backend
npm install
```

## Запуск

```bash
npm start
```

## Настройка

API ключ Portkey можно задать через переменную окружения:

```bash
PORTKEY_API_KEY=your_api_key npm start
```

Или изменить значение по умолчанию в `server.js`.

## API

### POST /api/chat

Отправляет сообщение в AI и возвращает ответ.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Привет" }
  ]
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Здравствуйте! Чем могу помочь?"
      }
    }
  ]
}
```

## Деплой

### Railway
1. Создайте проект на railway.app
2. Подключите GitHub репозиторий
3. Добавьте переменную окружения `PORTKEY_API_KEY`
4. Укажите команду запуска: `cd backend && npm start`

### Render
1. Создайте Web Service
2. Подключите GitHub
3. Build command: `cd backend && npm install`
4. Start command: `npm start`
5. Добавьте переменную `PORTKEY_API_KEY`
