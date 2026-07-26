# 🎨 Отрисовка (Render API)

Таблица `render` предоставляет доступ к мощному рендереру на базе ImGui. Включает в себя работу с 2D/3D примитивами, продвинутую систему динамических текстур (с защитой от утечек VRAM) и современные эффекты размытия (UI Blur).

!!! warning "Внимание"
    Все функции отрисовки **должны** вызываться строго внутри коллбека `"paint"`.

---

## 🖼 Текстуры и Шрифты

Движок автоматически управляет переиспользованием слотов текстур, предотвращая утечки видеопамяти.

### `setup_font(path, size, [flags])`
Загружает кастомный шрифт.
* **Возвращает:** `number` (ID шрифта)

### `setup_texture(path, [flip_y])`
Загружает текстуру из файла. Если текстура уже была загружена, возвращает её существующий ID.
* **flip_y:** `boolean` — Отразить по вертикали. *(Примечание: для аватарок из `avatarcache` отражение применяется автоматически).*
* **Возвращает:** `number` (ID текстуры)

### `create_panorama_svg_texture(path, height)`
Создает текстуру из SVG-файлов движка Panorama. Пути `.vsvg_c` / `.vtex_c` автоматически нормализуются.
* **Возвращает:** `table` с полями `{ id = number, get_size = function }`.

---

### 🚀 Динамические текстуры (RGBA)
Оптимизированный API для создания текстур из массива пикселей в реальном времени.

#### `setup_texture_rgba(data, size)`
Первоначально создаёт динамическую текстуру.
* **data:** `table` — Массив пикселей в формате `uint32_t` (RGBA).
* **size:** `vec2_t` — Размеры текстуры.
* **Возвращает:** `number` (ID текстуры) или `-1` при ошибке.

#### `update_texture_rgba(id, data, size)`
Безопасно перезаписывает пиксели в существующую текстуру **без аллокации новых слотов** и лишних выделений памяти. Идеально для рендеринга каждый кадр.
* **Возвращает:** `boolean` (Успешно ли обновлено).

#### `destroy_texture(id)`
Уничтожает текстуру, освобождает ресурсы в видеопамяти (ID3D11) и очищает слот для последующего переиспользования.

---

## 📏 Базовые функции и Clipping (Обрезка)

* `render.screen_size()` -> `vec2_t` (Размер экрана)
* `render.frame_time()` -> `number` (DeltaTime)
* `render.frame_count()` -> `number` (Счетчик кадров)
* `render.world_to_screen(pos_vec3)` -> `vec2_t` | `nil` (Переводит 3D в 2D. Возвращает `nil`, если точка за камерой).

### ✂️ Зоны отрисовки (Clip Rect)
Позволяет ограничить область, внутри которой будут рисоваться примитивы. Влияет на текст, линии, текстуры и даже 3D-проекции.

* `render.push_clip_rect(from, to, [intersect])` — Устанавливает зону обрезки (`from` и `to` это `vec2_t`).
* `render.pop_clip_rect()` — Убирает последнюю зону обрезки.

!!! note "Авто-очистка"
    Если вы забудете вызвать `pop_clip_rect`, движок автоматически очистит стек клиппинга в конце кадра, чтобы интерфейс игры не сломался.

---

## 🌫 Эффекты размытия (UI Blur)

Современные функции для создания эффекта "матового стекла" (Frosted Glass).

### `set_blur_mode(mode, passes)`
Устанавливает глобальный алгоритм блюра и количество проходов (качество).
* **mode:** `number` — Алгоритм: `0` (Gaussian), `1` (Kawase), `2` (Dual Kawase), `3` (Radial HiQuality).
* **passes:** `number` — Интенсивность/проходы шейдера (обычно от 2 до 6).

### `draw_blurred_rect(x, y, w, h, strength, r, g, b, a, rounding)`
Рисует прямоугольник с заблюренным фоном и цветовым тинтом (оттенком).
* **strength:** `number` — Сила размытия (от 0.0 до 1.0).
* **r, g, b, a:** `number` — Цвет накладываемого оттенка (0-255).
* **rounding:** `number` — Радиус скругления углов (0.0 для прямых).

### `draw_blurred_circle(x, y, radius, strength, r, g, b, a, [segments])`
Рисует заблюренный круг.
* **segments:** `number` *(опционально)* — Детализация круга (по умолчанию 36).

### `draw_blurred_triangle(x1, y1, x2, y2, x3, y3, strength, r, g, b, a)`
Рисует треугольник с блюром по координатам трех вершин.

**Пример UI Blur:**
```lua
register_callback("paint", function()
    -- Настраиваем качественный Kawase блюр
    render.set_blur_mode(1, 4)
    
    -- Рисуем плашку: позиция (100, 100), размер 300x150, сила 1.0
    -- Тинт: полупрозрачный черный (0, 0, 0, 150), скругление 8.0
    render.draw_blurred_rect(100, 100, 300, 150, 1.0, 0, 0, 0, 150, 8.0)
end)

📐 2D Примитивы

Все координаты для этих функций передаются в формате vec2_t.

Текст и Изображения

  - render.calc_text_size(text, font_id, [size]) -> vec2_t
  - render.text(text, font_id, pos, color, [size])
  - render.texture(tex_id, from, to, [color], [rounding])

Прямоугольники и Линии

  - render.rect(from, to, color, [rounding], [thickness])
  - render.rect_filled(from, to, color, [rounding])
  - render.rect_filled_fade(from, to, col_ul, col_ur, col_br, col_bl) —
    Прямоугольник с градиентом по 4 углам.
  - render.line(from, to, color, [thickness])
  - render.poly_line(table_of_vec2, color, [thickness])

Круги и Полигоны

  - render.circle(pos, radius, segments, color, [thickness])
  - render.circle_filled(pos, radius, segments, color)
  - render.circle_fade(pos, radius, color_in, color_out) — Залитый круг с
    радиальным градиентом (от центра к краям).
  - render.arc(pos, radius, a_min, a_max, segments, color, [thickness])
  - render.filled_polygon(table_of_vec2, color)

🌐 3D Примитивы (В мире)

Принимают 3D координаты (vec3_t), сами производят World-to-Screen проекцию.

  - render.circle_3d(pos, radius, color, [thickness], [normal_vec3])
  - render.circle_filled_3d(pos, radius, color, [normal_vec3])
  - render.circle_fade_3d(pos, radius, color_in, color_out, [normal_vec3])

(Если normal_vec3 не передан, круг рисуется лежащим на земле).
