# ⚙️ Движок (Engine API)

Таблица `engine` дает возможность взаимодействовать с глобальным состоянием клиента CS2: проверять статус подключения, менять углы обзора, выполнять консольные команды и получать информацию о карте.

---

## 🌐 Состояние клиента

### `engine.is_connected()`
Проверяет, установлено ли соединение с сервером.
* **Возвращает:** `boolean`

### `engine.is_in_game()`
Проверяет, зашел ли игрок на карту и находится ли в процессе игры.
* **Возвращает:** `boolean`

### `engine.get_map_name()`
* **Возвращает:** `string` (Например: `"de_mirage"`)

---

## 🎥 Камера и Углы

### `engine.get_view_angles()`
Возвращает текущие углы обзора локального игрока в движке.
* **Возвращает:** `angle_t`

### `engine.set_view_angles(angles)`
Устанавливает новые углы обзора. Часто используется для реализации AimBot или Anti-Aim функций.
* **angles:** `angle_t`

!!! warning "Осторожно"
    Установка некорректных углов (Pitch > 89 или < -89) без правильной нормализации на немодифицированных серверах приведет к кику (Untrusted).

---

## 💻 Консоль и Инфо

### `engine.execute_client_cmd(command)`
Исполняет команду в консоли разработчика от лица клиента.
* **command:** `string`

### `engine.get_screen_size()`
Возвращает размер игрового окна движка (отличается от `render.screen_size()`, если используются нестандартные режимы масштабирования).
* **Возвращает:** `vec2_t`

!!! example "Пример спама в консоль при подключении"
    ```lua
    local was_in_game = false

    register_callback("paint", function()
        local in_game = engine.is_in_game()
        
        if in_game and not was_in_game then
            engine.execute_client_cmd("echo [MyScript] Successfully loaded into " .. engine.get_map_name())
        end
        
        was_in_game = in_game
    end)
    ```
