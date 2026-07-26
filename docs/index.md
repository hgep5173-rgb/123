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
Выводит цветной текст в консоль. Поддерживает отмену переноса строки при наличии `\0` в конце текста.
* **text** `string` — Текст для вывода.
* **color** `color_t` *(опционально)* — Цвет текста (по умолчанию белый).
```lua
color_print("Loaded successfully!", color_t(50, 255, 50))
```

### `get_game_directory()`
Возвращает путь к папке с игрой (до `game\bin\win64`).

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

### `register_callback(event, callback)`
Регистрирует функцию для вызова по определенному событию игры или чита.
* **События:** * `"paint"` — Вызывается каждый кадр для отрисовки (ImGui).
  * `"override_view"` — Вызывается для изменения камеры (передает `view_setup_t`).
  * `"game_event"` — Вызывается при любом событии движка (передает `game_event_t`).
  * `"unload"` — Вызывается перед выгрузкой скрипта (используется для сохранения конфигов).

---

## 🛠 Модули движка (Engine & Utils)

### Таблица `engine`
Предоставляет доступ к функциям игрового движка.
* `engine.get_netvar_offset(module, class, prop)` — Получает оффсет нетвара.
* `engine.play_sound(sound_name, volume)` — Воспроизводит звук через консоль.
* `engine.execute_client_cmd(cmd)` — Выполняет консольную команду в игре.
* `engine.camera_in_thirdperson()` -> `boolean` — Проверяет, активен ли вид от третьего лица.
* `engine.trace_bullet(pawn_ent, start_vec3, end_vec3)` -> `number` | `nil` — Проверяет пробитие (AutoWall). Возвращает урон или `nil`.

### Таблица `math`
Математические утилиты для работы с векторами и углами.
* `math.calc_angle(src_vec3, dst_vec3)` -> `angle_t` — Рассчитывает угол между двумя точками.
* `math.calc_fov(src_angle, dst_angle)` -> `number` — Возвращает FOV (поле зрения) между углами.
* `math.normalize_angle(yaw)` -> `number` — Нормализует угол (Yaw).
* `math.vector_angles(forward_vec3)` -> `angle_t` — Преобразует вектор направления в углы.
* `math.angle_vectors(angle)` -> `vec3_t`, `vec3_t`, `vec3_t` — Возвращает векторы (forward, right, up) из угла.

### Таблица `cvars`
Доступ к переменным консоли CS2 (ConVars).
```lua
local sv_gravity = cvars.sv_gravity
print("Gravity is:", sv_gravity:get_int())

-- Доступные методы:
-- cvar:get_name(), cvar:get_desc()
-- cvar:get_float(), cvar:get_int(), cvar:get_bool(), cvar:get_string()
```

### Таблица `ui`
* `ui.is_menu_opened()` -> `boolean` — Возвращает статус видимости меню чита.
