# ⚙️ Движок и Математика (Engine & Math)

## `engine`
Таблица для взаимодействия с функциями движка CS2.

* `engine.get_netvar_offset(module, class, prop)` -> `number`
* `engine.play_sound(sound_name, volume)`
* `engine.execute_client_cmd(cmd_string)` — Выполняет консольную команду (добавляется в безопасную очередь вызовов).
* `engine.camera_in_thirdperson()` -> `boolean` — Проверяет, находится ли камера от 3-го лица.
* `engine.get_level_name()` -> `string`
* `engine.trace_bullet(pawn_ent, start_vec3, end_vec3)` -> `number` | `nil` — Симуляция выстрела с учетом прострела стен (AutoWall). Возвращает нанесенный урон, или `nil`, если пуля не долетела.

---

## `math`
Математические функции и хелперы.

* `math.calc_angle(src_vec3, dst_vec3)` -> `angle_t` — Вычисляет углы между двумя точками.
* `math.calc_fov(src_angle, dst_angle)` -> `number` — Вычисляет угол обзора (FOV) между двумя углами.
* `math.normalize_angle(angle)` -> `number` — Нормализует Yaw угол (от -180 до 180).
* `math.vector_angles(fwd_vec3)` -> `angle_t` — Конвертирует вектор направления в углы Эйлера.
* `math.angle_vectors(angle)` -> `vec3_t, vec3_t, vec3_t` — Конвертирует углы в 3 вектора: `forward`, `right`, `up`.

---

## `cvars` (Консольные переменные)
Управление консольными переменными игры. Переменные получаются через обращение к глобальной таблице `cvars`. 

```lua
local sv_gravity = cvars.sv_gravity
print("Текущая гравитация:", sv_gravity:get_float())
```

**Методы объекта `convar_t`:**
* `cv:get_name()` -> `string`
* `cv:get_desc()` -> `string`
* `cv:get_float()` -> `number`
* `cv:get_int()` -> `number`
* `cv:get_bool()` -> `boolean`
* `cv:get_string()` -> `string`

---

## `game_event_t` (Игровые события)
Объект, который передается в коллбеки событий (например, `game_event`, `player_death`, `bullet_impact`).

* `event:get_name()` -> `string`
* `event:get_int(key)` -> `number`
* `event:get_float(key)` -> `number`
* `event:get_string(key)` -> `string`
* `event:get_pawn(key)` -> `base_entity_t` | `nil` — Безопасное получение пешки игрока без использования уязвимых vtable-геттеров.
* `event:get_controller(key)` -> `base_entity_t` | `nil`

**Пример использования:**
```lua
register_callback("player_death", function(event)
    local victim = event:get_pawn("userid")
    local attacker = event:get_pawn("attacker")
    
    if victim then
        print(victim:get_class_name(), " was killed!")
    end
end)
```

---

## `ui` & Камера

### `ui`
* `ui.is_menu_opened()` -> `boolean` — Возвращает `true`, если меню чита открыто.

### `view_setup_t`
Объект, передаваемый в коллбек `override_view`. Позволяет управлять камерой.
* **Поля (доступны для чтения и записи):**
  * `setup.fov` (`number`)
  * `setup.fov_viewmodel` (`number`)
  * `setup.origin` (`vec3_t`)
  * `setup.angles` (`angle_t`)

---

## 🔌 FFI (Вызов C-функций)
Наш API включает стандартную библиотеку `ffi` из LuaJIT. 

**Важно:** В движок встроен безопасный парсер `ffi.cdef`. Он перехватывает ошибки дублирования структур, чтобы скрипты не ломались (эмулирует поведение Nixware/Primordial). Вы можете смело объявлять C-типы:

```lua
local ffi = require("ffi")

ffi.cdef[[
    typedef struct { float x, y, z; } my_vec_t;
]]
```
