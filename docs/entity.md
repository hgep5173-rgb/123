# 🧍 Сущности (Entity API)

Таблица `entity` предоставляет функционал для взаимодействия с игроками, оружием и объектами на карте (пропсами).

---

## 🔍 Глобальные функции

### `entity.get_local_player()`
Возвращает объект локального игрока.
* **Возвращает:** `Entity` (Или `nil`, если игрок не подключен к серверу или мертв/в спектаторах, в зависимости от логики).

### `entity.get_player(index)`
Получает сущность игрока по его индексу на сервере.
* **index:** `number` (От 1 до 64)
* **Возвращает:** `Entity` | `nil`

### `entity.get_all()`
Возвращает массив всех активных сущностей игроков на сервере.
* **Возвращает:** `table` (Массив объектов `Entity`).

---

## 🧬 Объект `Entity`

Объект сущности позволяет читать свойства памяти (NetVars / Schema System).

### Базовые методы
* `entity:get_index()` -> `number` (Индекс сущности)
* `entity:is_valid()` -> `boolean` (Проверка на то, существует ли сущность прямо сейчас)
* `entity:is_alive()` -> `boolean`
* `entity:is_dormant()` -> `boolean` (Находится ли игрок вне зоны видимости сервера - PVS)
* `entity:get_team()` -> `number` (Обычно 2 - T, 3 - CT)

### Координаты и Хитбоксы
* `entity:get_origin()` -> `vec3_t` (Координаты в мире)
* `entity:get_bone_position(bone_index)` -> `vec3_t` (Позиция конкретной кости, например, головы)
* `entity:get_bounding_box()` -> `table` (Возвращает `{x1, y1, x2, y2}` для отрисовки ESP)

### Schema / Prop система
Для доступа к внутренней памяти Source 2 используются пропы (NetVars).

* `entity:get_prop_int(name)` -> `number`
* `entity:get_prop_float(name)` -> `number`
* `entity:get_prop_bool(name)` -> `boolean`

!!! example "Пример использования ESP"
    ```lua
    register_callback("paint", function()
        local local_player = entity.get_local_player()
        if not local_player then return end
        
        local players = entity.get_all()
        for i = 1, #players do
            local enemy = players[i]
            
            if enemy:is_alive() and not enemy:is_dormant() and enemy:get_team() ~= local_player:get_team() then
                local bbox = enemy:get_bounding_box()
                if bbox then
                    -- Рисуем квадрат ESP вокруг противника
                    render.rect(
                        vec2_t(bbox.x1, bbox.y1), 
                        vec2_t(bbox.x2, bbox.y2), 
                        color_t(255, 50, 50, 255)
                    )
                end
            end
        end
    end)
    ```
