# ⚙️ Движок, Математика и События (Engine & Utils)

Документация по таблицам `engine`, `math`, а также классам для работы с игровыми событиями (`game_event_t`) и камерой (`view_setup_t`).

---

## Таблица `engine`
Предоставляет низкоуровневый доступ к функциям игрового движка CS2.

* `engine.get_netvar_offset(module, class, prop)` -> `number`
  * Получает оффсет сетевой переменной (netvar) по имени модуля, класса и пропа.
* `engine.play_sound(sound_name, volume)`
  * Воспроизводит звуковой эффект через консоль движка.
* `engine.execute_client_cmd(cmd_string)` — Выполняет консольную команду (добавляется в безопасную очередь вызовов).
* `engine.camera_in_thirdperson()` -> `boolean` — Проверяет, находится ли камера в режиме от третьего лица.
* `engine.get_level_name()` -> `string` — Возвращает название текущей карты/уровня.
* `engine.trace_bullet(pawn_ent, start_vec3, end_vec3)` -> `number` | `nil` — Симуляция выстрела с учетом прострела стен (AutoWall). Возвращает нанесенный урон, или `nil`, если пуля не долетела.

**Пример использования `trace_bullet`:**
```lua
local local_player = entitylist.get_local_player_pawn()
if local_player then
    local start_pos = local_player.m_vecOrigin
    local end_pos = start_pos + vec3_t(500, 0, 0)
    local damage = engine.trace_bullet(local_player, start_pos, end_pos)
    if damage then
        print("AutoWall damage:", damage)
    end
end
```

---

## Таблица `math`
Математические утилиты для работы с пространством, векторами и углами обзора.

* `math.calc_angle(src_vec3, dst_vec3)` -> `angle_t` — Вычисляет углы Эйлера между двумя точками в пространстве.
* `math.calc_fov(src_angle, dst_angle)` -> `number` — Вычисляет угол обзора (FOV) между текущим углом прицела и целевым.
* `math.normalize_angle(angle)` -> `number` — Нормализует угол Yaw в диапазон от `-180` до `180` градусов.
* `math.vector_angles(fwd_vec3)` -> `angle_t` — Конвертирует вектор направления в углы (Pitch, Yaw, Roll).
* `math.angle_vectors(angle)` -> `vec3_t`, `vec3_t`, `vec3_t` — Возвращает три вектора из угла: направление вперед (forward), вправо (right) и вверх (up).

**Пример расчета FOV и угла:**
```lua
local my_pos = entitylist.get_local_player_pawn().m_vecOrigin
local target_pos = vec3_t(100, 200, 300)

local angle_to_target = math.calc_angle(my_pos, target_pos)
print("Calculated Pitch:", angle_to_target.pitch, "Yaw:", angle_to_target.yaw)
```

---

## `game_event_t` (Игровые события)
Объект, который передается в коллбеки событий (например, при регистрации `game_event`, `player_death`, `bullet_impact`). Позволяет безопасно считывать данные из события.

* `event:get_name()` -> `string` — Возвращает имя события (например, `"player_death"`).
* `event:get_int(key)` -> `number` — Возвращает целочисленный параметр по ключу.
* `event:get_float(key)` -> `number` — Возвращает число с плавающей точкой по ключу.
* `event:get_string(key)` -> `string` — Возвращает строковый параметр по ключу.
* `event:get_pawn(key)` -> `base_entity_t` | `nil` — Безопасное получение пешки игрока (например, `"userid"` или `"attacker"`) без использования уязвимых vtable-геттеров.
* `event:get_controller(key)` -> `base_entity_t` | `nil` — Возвращает игровой контроллер по ключу.

**Пример обработки события смерти игрока:**
```lua
register_callback("game_event", function(event)
    if event:get_name() == "player_death" then
        local victim = event:get_pawn("userid")
        local attacker = event:get_pawn("attacker")
        
        if victim and attacker then
            print("Player died! Attacker handle:", attacker:get_entity_handle())
        end
    end
end)
```

---

## `ui` & Камера (`view_setup_t`)

### Таблица `ui`
* `ui.is_menu_opened()` -> `boolean` — Возвращает `true`, если встроенное меню чита открыто пользователем.

### `view_setup_t`
Объект, передаваемый в коллбек `"override_view"`. Используется для перехвата и изменения параметров камеры во время кадра.

* **Поля (доступны для чтения и записи):**
  * `setup.fov` (`number`) — Угол обзора камеры (Field of View).
  * `setup.fov_viewmodel` (`number`) — Угол обзора модели оружия в руках.
  * `setup.origin` (`vec3_t`) — Мировые координаты камеры.
  * `setup.angles` (`angle_t`) — Углы наклона и поворота камеры.

**Пример кастомного FOV через `override_view`:**
```lua
register_callback("override_view", function(setup)
    setup.fov = 110.0 -- Установить кастомный FOV для камеры
end)
```
