# Lua API

Документация составлена по текущей реализации в `src/lua_engine.cpp`, `src/lua_engine.h`, `src/ui_blur.cpp` и `src/ui_blur.h`. Здесь описано только то, что реально регистрируется в Lua VM.

## Разделы

- [Engine](engine.md) - глобальные функции, callbacks, `engine`, `math`, `cvars`, `ui`, `menu`.
- [Entity](entity.md) - `entitylist`, `base_entity_t`, чтение и запись netvars.
- [Render](render.md) - `render` API, текст, примитивы, текстуры, blur.
- [Types](types.md) - `vec2_t`, `vec3_t`, `vec4_t`, `angle_t`, `color_t`, `image_t`, `convar_t`, `game_event_t`, `view_setup_t`.

## Доступные Lua-библиотеки

При инициализации открываются стандартные библиотеки:

```lua
base, package, math, string, table, bit32, os, io
```

Также через `luaL_requiref` доступны:

```lua
local ffi = require('ffi')
local bit = require('bit')
```

`ffi.cdef` обернут в `pcall`, поэтому ошибки повторного объявления C-типов подавляются.

## Основные глобальные таблицы

```lua
render      -- отрисовка
engine      -- функции движка/утилиты
entitylist  -- поиск игровых сущностей
cvars       -- доступ к ConVar через __index
ui          -- состояние UI
menu        -- несколько совместимых полей-настроек
math        -- стандартная math + дополнительные функции
```

## Глобальные конструкторы типов

```lua
vec2_t(x, y)
vec3_t(x, y, z)
vec4_t(x, y, z, w)
angle_t(pitch, yaw, roll)
color_t(r, g, b, a)
ray_t(...)
trace_filter_t(...)
```

`ray_t(...)` и `trace_filter_t(...)` в текущем коде являются заглушками и возвращают число `1`.

## Callbacks

Callbacks регистрируются глобальной функцией:

```lua
register_callback(name, fn)
```

Реально вызываемые системой callbacks:

| Имя | Аргументы | Когда вызывается |
| --- | --- | --- |
| `paint` | нет | каждый ImGui frame перед основной отрисовкой меню |
| `game_event` | `game_event_t event` | на любой игровой event |
| имя конкретного event | `game_event_t event` | на event с таким именем |
| `override_view` | `view_setup_t view` | при `HookedOverrideView` |
| `unload` | нет | перед перезагрузкой/выгрузкой Lua VM |

Пример:

```lua
register_callback('paint', function()
    render.text('hello', 0, vec2_t(20, 20), color_t(255, 255, 255, 255))
end)

register_callback('player_hurt', function(event)
    print(event:get_name(), event:get_int('dmg_health'))
end)
```
