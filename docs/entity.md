# 🏃 Сущности (Entity API)

## `base_entity_t`
Объект, представляющий игровую сущность в памяти CS2. 

**Ключевая особенность:** Вы можете напрямую обращаться к Netvars (сетевым переменным) по их строковым названиям! Движок автоматически найдет оффсет и прочитает/запишет значение.

### Чтение и Запись Netvars
```lua
local local_player = entitylist.get_local_player_pawn()

-- Чтение
local hp = local_player.m_iHealth
local is_scoped = local_player.m_bIsScoped
local flags = local_player.m_fFlags
local origin = local_player.m_vecOrigin -- возвращает vec3_t

-- Запись
local_player.m_iHealth = 100
local_player.m_bIsScoped = true
```

### Методы Сущности
* `ent:get_abs_origin()` -> `vec3_t` (Возвращает абсолютные координаты сущности в мире).
* `ent:get_class_name()` -> `string` (Возвращает имя класса, например `"C_CSPlayerPawn"`).
* `ent:get_entity_handle()` -> `number` (Возвращает адрес сущности. Полезно для использования с `ffi.cast`).

---

## `entitylist`
Таблица для работы с глобальным списком сущностей игры.

### `get_local_player_controller()`
Возвращает контроллер локального игрока.
* **Возвращает:** `base_entity_t` | `nil`

### `get_local_player_pawn()`
Возвращает "пешку" (физическое тело) локального игрока.
* **Возвращает:** `base_entity_t` | `nil`

### `get_entity_from_handle(handle)`
Получает сущность по её хэндлу/индексу.
* **Возвращает:** `base_entity_t` | `nil`

### `get_entities(class_name, [inherits])`
Ищет все сущности указанного класса и возвращает их в виде массива (Lua table).
* **class_name:** Строка (например, `"C_Chicken"`, `"C_SmokeGrenadeProjectile"`).
* **inherits:** `boolean` (Искать ли дочерние классы. По умолчанию `false`).
* **Возвращает:** `table`

### `get_entities(class_name, callback)`
Оптимизированный поиск сущностей через функцию обратного вызова. Работает быстрее, так как не создает массивы в памяти Lua.
```lua
entitylist.get_entities("C_Chicken", function(chicken)
    local pos = chicken:get_abs_origin()
    print("Found a chicken at: ", pos.x)
end)
```
