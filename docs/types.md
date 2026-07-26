# Types

## `vec2_t`

```lua
local v = vec2_t(x, y)
```

Если аргументы не переданы, поля получают `0`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `x` | number | read/write |
| `y` | number | read/write |

Операторы:

| Оператор | Поведение |
| --- | --- |
| `a + b` | сложение двух `vec2_t` |
| `a - b` | вычитание двух `vec2_t` |
| `a * number` / `number * a` | умножение на число |
| `a * b` | покомпонентное умножение двух `vec2_t` |
| `a / number` | деление на число |
| `a / b` | покомпонентное деление двух `vec2_t` |

## `vec3_t`

```lua
local v = vec3_t(x, y, z)
```

Если передано меньше 3 аргументов, создается `vec3_t(0, 0, 0)`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `x` | number | read/write |
| `y` | number | read/write |
| `z` | number | read/write |

Методы:

| Метод | Возвращает |
| --- | --- |
| `v:length()` | длину 3D-вектора |
| `v:length_2d()` | длину по X/Y |
| `v:length_sqr()` | квадрат 3D-длины |
| `v:length_2d_sqr()` | квадрат длины по X/Y |
| `v:dist_to(other)` | 3D-дистанцию до `other` |
| `v:dist_to_2d(other)` | 2D-дистанцию до `other` |
| `v:dot(other)` | dot product |
| `v:cross(other)` | `vec3_t` cross product |
| `v:normalized()` | новую нормализованную копию |
| `v:normalize()` | исходную длину; сам `v` нормализуется на месте |
| `v:lerp(other, fraction)` | новый `vec3_t` между `v` и `other` |

Операторы:

| Оператор | Поведение |
| --- | --- |
| `a + b` | сложение двух `vec3_t` |
| `a - b` | вычитание двух `vec3_t` |
| `a * number` / `number * a` | умножение на число |
| `a / number` | деление на число |
| `tostring(v)` | строка вида `vec3_t(x, y, z)` |

## `vec4_t`

```lua
local v = vec4_t(x, y, z, w)
```

Если аргументы не переданы, поля получают `0`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `x` | number | read/write |
| `y` | number | read/write |
| `z` | number | read/write |
| `w` | number | read/write |

`tostring(v)` возвращает строку вида `vec4_t(x, y, z, w)`.

## `angle_t`

```lua
local a = angle_t(pitch, yaw, roll)
```

Если аргументы не переданы, поля получают `0`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `pitch` | number | read/write |
| `yaw` | number | read/write |
| `roll` | number | read/write |

## `color_t`

```lua
local c = color_t(r, g, b, a)
```

Значения хранятся как `float`. По умолчанию `r = 0`, `g = 0`, `b = 0`, `a = 1`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `r` | number | read/write |
| `g` | number | read/write |
| `b` | number | read/write |
| `a` | number | read/write |

`color_print` дополнительно масштабирует значения `0..1` в `0..255`; render-функции передают значения в `ImColor` как есть.

## `image_t`

Регистрируется usertype `image_t` с методом:

```lua
local size = image:get_size() -- vec2_t
```

`get_size()` возвращает `vec2_t(width, height)`. Если id текстуры невалиден, возвращается `vec2_t(0, 0)`.

Важно: `render.create_panorama_svg_texture(...)` возвращает Lua-таблицу `{ id = ..., get_size = function(...) ... end }`, а не C++ `image_t` userdata.

## `convar_t`

Объекты `convar_t` получаются через таблицу `cvars` или внутреннюю функцию `_get_cvar_internal(name)`.

```lua
local cv = cvars.sv_cheats
if cv then
    print(cv:get_name(), cv:get_bool())
end
```

Методы:

| Метод | Возвращает |
| --- | --- |
| `cv:get_name()` | имя ConVar или `unknown` |
| `cv:get_desc()` | описание или пустую строку |
| `cv:get_float()` | float value или `0.0` |
| `cv:get_int()` | int value или `0` |
| `cv:get_bool()` | boolean value |
| `cv:get_string()` | string value или пустую строку |

## `game_event_t`

Передается в callbacks `game_event` и callbacks с именем конкретного event.

Методы:

| Метод | Возвращает |
| --- | --- |
| `event:get_name()` | имя event или `nil` |
| `event:get_int(key)` | integer value или `nil` |
| `event:get_float(key)` | float value или `nil` |
| `event:get_string(key)` | string value или `nil` |
| `event:get_pawn(key)` | `base_entity_t` pawn по slot value или `nil` |
| `event:get_controller(key)` | `base_entity_t` controller или `nil` |
| `event:set_int(...)` | ничего; заглушка |
| `event:set_float(...)` | ничего; заглушка |
| `event:set_string(...)` | ничего; заглушка |

В коде `get_controller` регистрируется дважды; итоговая версия использует vtable-вызов `GetPlayerController` по hash ключа.

## `view_setup_t`

Передается в callback `override_view`.

Поля:

| Поле | Тип | Доступ |
| --- | --- | --- |
| `fov` | number | read/write |
| `fov_viewmodel` | number | read/write |
| `origin` | `vec3_t` | read/write |
| `angles` | `angle_t` | read/write |

Пример:

```lua
register_callback('override_view', function(view)
    view.fov = 110
    view.fov_viewmodel = 75
end)
```

## `base_entity_t`

`base_entity_t` установлен как глобальная метатаблица entity userdata. Сами объекты создаются C++ кодом и обычно приходят из `entitylist` или game event methods. Подробности см. [Entity](entity.md).

## `ray_t` и `trace_filter_t`

```lua
local ray = ray_t(...)
local filter = trace_filter_t(...)
```

В текущей реализации обе функции принимают любые аргументы и возвращают число `1`. Метатаблицы `ray_t_mt` и `trace_filter_t_mt` создаются, но Lua-конструкторы их не заполняют.
