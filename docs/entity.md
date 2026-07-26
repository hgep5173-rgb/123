# 🏃 Сущности (Entity API)

## `base_entity_t`
Объект, представляющий игровую сущность в памяти CS2. 

!!! tip "Прямой доступ к Netvars"
    Вы можете обращаться к сетевым переменным (Netvars) напрямую по их строковым названиям! Движок автоматически найдет оффсет, прочитает или запишет значение без лишнего кода.

### Чтение и Запись
```lua
local local_player = entitylist.get_local_player_pawn()
if not local_player then return end

-- Чтение
local hp = local_player.m_iHealth
local flags = local_player.m_fFlags
local origin = local_player.m_vecOrigin -- возвращает vec3_t

-- Запись
local_player.m_bIsScoped = true

Методы Сущности

  - ent:get_abs_origin() -> vec3_t (Возвращает абсолютные координаты в мире).
  - ent:get_class_name() -> string (Возвращает имя класса, например
    "C_CSPlayerPawn").
  - ent:get_entity_handle() -> number (Возвращает адрес сущности. Совместимо с
    ffi.cast).

entitylist

Таблица для работы с глобальным списком сущностей игры.

  - entitylist.get_local_player_controller() -> base_entity_t | nil
  - entitylist.get_local_player_pawn() -> base_entity_t | nil
  - entitylist.get_entity_from_handle(handle) -> base_entity_t | nil

Итерация сущностей (get_entities)

Движок предоставляет два стиля поиска сущностей.

Вариант 1: Массив (Array style)

Возвращает Lua-таблицу со всеми найденными сущностями.

  - class_name: Строка (например, "C_Chicken").
  - inherits: boolean (Искать ли дочерние классы. По умолчанию false).

local smokes = entitylist.get_entities("C_SmokeGrenadeProjectile")
for i, smoke in ipairs(smokes) do
    print(smoke:get_abs_origin().x)
end

Вариант 2: Коллбек (Callback style - Оптимизированный)

Работает быстрее, так как не создает массивы в памяти Lua (Zero Allocation).
Идеально для ESP.

entitylist.get_entities("C_Chicken", function(chicken)
    local pos = chicken:get_abs_origin()
    -- Верните false, если хотите прервать цикл
end)
