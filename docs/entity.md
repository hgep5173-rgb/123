# Entity

Entity API состоит из таблицы `entitylist` и userdata `base_entity_t` (`Nixware_Entity` metatable). Entity userdata хранит адрес игровой сущности.

## `entitylist`

### `entitylist.get_entity_from_handle(handle)`

```lua
local ent = entitylist.get_entity_from_handle(handle)
```

Если `handle` равен `0`, `0xffffffff` или entity не найдена, возвращает `nil`. Иначе возвращает `base_entity_t` по `GetEntityByIndex(handle & 0x7FFF)`.

### `entitylist.get_local_player_controller()`

Возвращает local player controller как `base_entity_t` или `nil`.

### `entitylist.get_local_player_pawn()`

Берет `m_hPlayerPawn` у local controller и возвращает pawn как `base_entity_t` или `nil`.

### `entitylist.get_entities(class_name, inherits?)`

```lua
local chickens = entitylist.get_entities('C_Chicken')
local all_smokes = entitylist.get_entities('C_SmokeGrenadeProjectile', true)
```

Возвращает Lua table со всеми найденными entity. Поиск проходит индексы `1..16384` и читает `current_class`/`designer_name` через `Chams::SafeReadEntityNames`.

Если `inherits` не передан или `false`, совпадение строгое: `current_class == class_name` или `designer_name == class_name`.

Если `inherits == true`, используется substring-поиск: `current_class:find(class_name)` или `designer_name:find(class_name)` на C++ стороне.

Дополнительные hardcoded совпадения:

| `class_name` | `designer_name` |
| --- | --- |
| `C_Chicken` | `chicken` |
| `C_EnvCubemapFog` | `env_cubemap_fog` |
| `C_SmokeGrenadeProjectile` | `smokegrenade_projectile` |

### `entitylist.get_entities(class_name, callback)`

```lua
entitylist.get_entities('C_Chicken', function(ent)
    print(ent:get_class_name())
    return true
end)
```

Callback вызывается для каждой найденной entity. Если callback вернул boolean `false`, перебор останавливается. В этой overload-версии совпадение всегда substring-based плюс те же hardcoded совпадения.

## `base_entity_t` методы

### `ent:get_abs_origin()`

Возвращает `vec3_t`. Читает `m_pGameSceneNode`, затем `m_vecAbsOrigin`. При ошибке возвращает `vec3_t(0, 0, 0)`.

### `ent:get_class_name()`

Возвращает `designer_name`, полученный через `Chams::SafeReadEntityNames`. Если entity невалидна, возвращает пустую строку.

### `ent:get_entity_handle()`

Возвращает адрес entity как number. Если entity невалидна, возвращает `nil`.

## Индексация entity по number

```lua
local ptr_number = ent[0x10]
```

Если ключ - number, возвращается `address + offset` как Lua number. Это не читает память по адресу, а только складывает базовый адрес entity и offset.

## Чтение netvars через `ent.<name>`

Если ключ - string и это не один из методов выше, API ищет offset через internal cache `GetNetvarOffsetCached(name)`. Cache перебирает hardcoded список schema classes и вызывает:

```cpp
SchemaManager::GetOffset('client.dll', class_name, name)
```

Если offset найден, тип возвращаемого значения определяется именем netvar:

| Условие имени | Возвращаемое значение |
| --- | --- |
| `m_steamID` | string с uint64 value |
| начинается с `m_p` | `base_entity_t` по pointer или `nil` |
| `m_Glow` | `base_entity_t` на `address + offset` |
| начинается с `m_b` | boolean |
| начинается с `m_sz` или `m_isz` | string по `address + offset` |
| начинается с `m_s` | string по pointer или `Unknown` |
| `m_fFlags` или `m_fEffects` | number uint32 |
| начинается с `m_fl` или `m_f` | number float |
| начинается с `m_vec`, `m_ang` или `m_v` | `vec3_t` |
| начинается с `m_h` или равно `m_leader` | `base_entity_t` по handle или `nil` |
| другое имя с найденным offset | number int32 |

Если entity/address невалидны, offset не найден или чтение словило exception, возвращается `nil`.

Пример:

```lua
local pawn = entitylist.get_local_player_pawn()
if pawn then
    print(pawn.m_iHealth)
    print(pawn.m_vecVelocity:length_2d())
end
```

## Запись netvars через `ent.<name> = value`

Запись работает только для string-ключей, у которых найден offset. Если offset равен `0`, запись игнорируется.

| Условие имени | Как записывается |
| --- | --- |
| начинается с `m_b` | boolean |
| `m_fFlags` или `m_fEffects` | uint32 из number |
| начинается с `m_fl` или `m_f` | float из number |
| начинается с `m_vec`, `m_ang` или `m_v` | три float из `vec3_t` |
| начинается с `m_h` или равно `m_leader` | uint32 из number |
| другое имя с найденным offset | int32 из number |

В текущей реализации нет отдельной безопасной записи строковых netvars.

## Сравнение entity

```lua
if ent1 == ent2 then
    print('same entity address')
end
```

Оператор `==` сравнивает сохраненные адреса игровых сущностей.
