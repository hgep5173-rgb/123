# 📖 Lua API Documentation (CS2)

Добро пожаловать в официальную документацию Lua API. Наш движок основан на Sol3 / LuaJIT и поддерживает FFI, работу с памятью, отрисовку примитивов и взаимодействие с игровым движком CS2.

---

## 🌍 Глобальные функции (Globals)

Базовые функции, доступные в любом месте скрипта.

### `print(...)`
Выводит текст в консоль игры белым цветом.
```lua
print("Hello", "World", 123)
```

### `color_print(text, [color])`
Выводит цветной текст в консоль. 
* **text** `string` — Текст для вывода.
* **color** `color_t` *(опционально)* — Цвет текста (по умолчанию белый).
```lua
color_print("Loaded successfully!", color_t(50, 255, 50))
```

### `get_game_directory()`
Возвращает путь к папке с игрой (до `game\bin\win64`).
* **Возвращает:** `string`

### `find_pattern(module_name, pattern, [offset])`
Ищет паттерн (сигнатуру) в памяти указанного модуля.
* **Возвращает:** `lightuserdata` (указатель). Совместимо с `ffi.cast`.
```lua
local ptr = find_pattern("client.dll", "48 8B 0D ? ? ? ? 48 89 7C 24", 0)
```

### `find_export(module_name, export_name)`
Ищет экспортируемую функцию в указанном модуле.
* **Возвращает:** `lightuserdata` (указатель).

### `get_user_name()`
Возвращает имя пользователя Windows.
* **Возвращает:** `string`

### `register_callback(event, callback)`
Регистрирует функцию для вызова по определенному событию игры или чита.
* **События:** 
  * `"paint"` — Вызывается каждый кадр для отрисовки (ImGui).
  * `"override_view"` — Вызывается для изменения камеры (передает `view_setup_t`).
  * `"game_event"` — Вызывается при любом событии движка (передает `game_event_t`).
  * `"unload"` — Вызывается перед выгрузкой скрипта (используется для сохранения конфигов).
```lua
register_callback("paint", function()
    render.text("Hello CS2", 1, vec2_t(10, 10), color_t(255, 255, 255))
end)
```
