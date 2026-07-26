# Engine

Этот раздел описывает глобальные функции, таблицу `engine`, расширения `math`, `cvars`, `ui` и зарегистрированные compatibility-поля `menu`.

## Глобальные функции

### `print(...)`

Переопределенный Lua `print`. Все аргументы конвертируются через `tostring`, соединяются двумя пробелами и выводятся в console белым цветом с переводом строки.

### `color_print(text, color?)`

```lua
color_print('message', color_t(255, 160, 80, 255))
```

Выводит `text` в console. Если `color` не передан, используется белый. Для `color_t` значения `<= 1.0` масштабируются в `0..255`, значения выше clamp-ятся в `0..255`.

Если последним символом `text` является `\0`, перевод строки не добавляется.

### `get_game_directory()`

Возвращает директорию процесса до последнего `\` или `/`. Если путь получить не удалось, возвращает `std::filesystem::current_path()`.

### `find_pattern(module_name, pattern, offset?)`

```lua
local ptr = find_pattern('client.dll', '48 8B ?? ??', 3)
```

Ищет pattern через `PatternScan::FindPattern`. Возвращает lightuserdata pointer `addr + offset` или `nil`, если pattern не найден. Default: `offset = 0`.

### `find_export(module_name, export_name)`

Возвращает lightuserdata pointer на export из уже загруженного module через `GetModuleHandleA` + `GetProcAddress`. Если module или export не найден, возвращает `nil`.

### `get_user_name()`

Возвращает Windows user name через `GetUserNameA`. Если получить имя не удалось, возвращает строку `hsky_user`.

### `register_callback(name, fn)`

Регистрирует callback в `g_Callbacks[name]`.

```lua
register_callback('paint', function()
    -- draw here
end)
```

Реально вызываемые имена описаны на главной странице: `paint`, `game_event`, имя конкретного game event, `override_view`, `unload`.

### `_get_cvar_internal(name)`

Внутренняя функция, которую использует `cvars.__index`. Возвращает `convar_t` или `nil`.

### `ray_t(...)`
### `trace_filter_t(...)`

Обе функции принимают любые аргументы и возвращают число `1`. Это текущие заглушки.

## `engine`

### `engine.get_netvar_offset(mod, table, prop)`

```lua
local offset = engine.get_netvar_offset('client.dll', 'C_CSPlayerPawn', 'm_iHealth')
```

Возвращает offset из `SchemaManager::GetOffset(mod, table, prop)`.

### `engine.play_sound(sound_name, volume)`

Выполняет client command:

```text
play <sound_name>
```

`volume` есть в сигнатуре, но текущая реализация его не использует.

### `engine.execute_client_cmd(cmd)`

Кладет `cmd` в защищенную очередь `g_CommandQueue`. Команда не выполняется напрямую внутри Lua-вызова.

### `engine.camera_in_thirdperson()`

Возвращает boolean `g_ThirdPerson`.

### `engine.get_level_name()`

Возвращает строку `de_mirage`. В текущем коде это hardcoded заглушка.

### `engine.trace_shape(ray, start, end, filter)`

Возвращает table:

```lua
{ fraction = 1.0 }
```

В текущем коде это заглушка, которая всегда возвращает `fraction = 1.0`.

### `engine.trace_bullet(pawn, start, end)`

```lua
local damage = engine.trace_bullet(enemy_pawn, start_pos, end_pos)
```

Аргументы:

| Аргумент | Тип |
| --- | --- |
| `pawn` | `base_entity_t` target pawn |
| `start` | `vec3_t` |
| `end` | `vec3_t` |

Возвращает damage number, если `TraceSystem::FireBullet` вернул hit. Возвращает `nil`, если входные аргументы невалидны, нет local controller/pawn, не удалось получить weapon data или bullet не попала/не прошла.

## `math`

Стандартная Lua table `math` расширяется функциями ниже.

### `math.calc_angle(src, dst)`

`src` и `dst` - `vec3_t`. Возвращает `angle_t` или `nil`.

### `math.calc_fov(src, dst)`

`src` и `dst` - `angle_t`. Возвращает number FOV. Если аргументы невалидны, возвращает `0.0`.

### `math.normalize_angle(angle)`

Возвращает `Math::NormalizeYaw(angle)`.

### `math.vector_angles(fwd)`

`fwd` - `vec3_t`. Возвращает `angle_t` или `nil`.

### `math.angle_vectors(angle)`

`angle` - `angle_t`. Возвращает три значения:

```lua
local forward, right, up = math.angle_vectors(angle_t(0, 90, 0))
```

Если аргумент невалиден, возвращает `nil, nil, nil`.

## `cvars`

`cvars` - table с `__index`, который вызывает `_get_cvar_internal(key)`.

```lua
local cv = cvars.sv_cheats
if cv then
    print(cv:get_int())
end
```

Методы `convar_t` описаны в [Types](types.md).

## `ui`

### `ui.is_menu_opened()`

Возвращает boolean `g_ShowMenu`.

## `menu`

В VM создается table `menu` со следующими полями-значениями:

| Поле | Начальное значение |
| --- | --- |
| `ragebot_fov` | `100.0` |
| `ragebot_anti_aim_base_yaw_offset` | `0.0` |
| `ragebot_anti_aim_pitch` | `0` |
| `ragebot_auto_strafer` | `false` |

В просмотренном коде для этих полей нет C++ getter/setter логики; это обычные значения Lua table, созданные при инициализации VM.
