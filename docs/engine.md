# ⚙️ Движок и Математика (Engine & Math)

## `engine`
Таблица для взаимодействия с функциями движка CS2.

* `engine.get_netvar_offset(module, class, prop)` -> `number`
* `engine.play_sound(sound_name, volume)`
* `engine.execute_client_cmd(cmd_string)` — Выполняет консольную команду (добавляется в безопасную очередь).
* `engine.camera_in_thirdperson()` -> `boolean`
* `engine.get_level_name()` -> `string`
* `engine.trace_bullet(pawn_ent, start_vec3, end_vec3)` -> `number` | `nil` — Симуляция выстрела с учетом AutoWall. Возвращает нанесенный урон, или `nil`, если пуля не долетела.

---

## `math`
Математические функции.

* `math.calc_angle(src_vec3, dst_vec3)` -> `angle_t`
* `math.calc_fov(src_angle, dst_angle)` -> `number`
* `math.normalize_angle(angle)` -> `number`
* `math.vector_angles(fwd_vec3)` -> `angle_t`
* `math.angle_vectors(angle)` -> `vec3_t, vec3_t, vec3_t` (Возвращает `forward`, `right`, `up`).

---

## `cvars` (Консольные переменные)
Управление консольными переменными игры. Получаются через глобальную таблицу `cvars`. 

**Методы объекта `convar_t`:**
* `cv:get_name()` -> `string`
* `cv:get_desc()` -> `string`
* `cv:get_float()` -> `number`
* `cv:get_int()` -> `number`
* `cv:get_bool()` -> `boolean`
* `cv:get_string()` -> `string`

---

## `game_event_t` (Игровые события)
Объект, передаваемый в обработчики событий (например, `game_event`, `player_death`).

* `event:get_name()` -> `string`
* `event:get_int(key)` -> `number`
* `event:get_float(key)` -> `number`
* `event:get_string(key)` -> `string`

!!! tip "Безопасное получение сущностей"
    Методы ниже работают напрямую, обходя уязвимые vtable-геттеры, что исключает краши.

* `event:get_pawn(key)` -> `base_entity_t` | `nil`
* `event:get_controller(key)` -> `base_entity_t` | `nil`

---

## `ui` & `view_setup_t`

### `ui`
* `ui.is_menu_opened()` -> `boolean` — Возвращает `true`, если меню чита открыто.

### `view_setup_t` (Изменение камеры)
Передается в коллбек `override_view`.
* **Доступные поля:**
  * `setup.fov` (`number`)
  * `setup.fov_viewmodel` (`number`)
  * `setup.origin` (`vec3_t`)
  * `setup.angles` (`angle_t`)

---

## 🔌 FFI (Вызов C-функций)
Наш API включает стандартную библиотеку `ffi` из LuaJIT. 

!!! note "Защита от крашей"
    В движок встроен безопасный перехватчик `ffi.cdef`. Он игнорирует ошибки дублирования структур, чтобы эмулировать поведение Nixware/Primordial и не ломать скрипты при их перезагрузке.
