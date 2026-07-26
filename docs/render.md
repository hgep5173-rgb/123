# 🎨 Отрисовка (Render API)

Таблица `render` предоставляет доступ к мощному рендереру на базе ImGui, включая 2D примитивы, работу с текстурами, 3D примитивы в мире и эффекты размытия (Blur).

Все функции отрисовки должны вызываться внутри коллбека `"paint"`.
**Внимание:** Все основные функции `render.*` теперь рисуют в один и тот же `ImDrawList` через `GetLuaRenderDrawList()`.

---

## 🖼 Текстуры и Шрифты

### `setup_font(path, size, [flags])`
Загружает кастомный шрифт.
* **Возвращает:** `number` (ID шрифта)

### `setup_texture(path)`
Загружает текстуру из файла на диске. 
> **Нововведение:** Теперь поддерживает `flip_y`, а для путей `Steam\config\avatarcache\...` включает flip автоматически.
* **Возвращает:** `number` (ID текстуры)

### `setup_texture_rgba(data, size)`
Первоначально создаёт динамическую RGBA-текстуру из таблицы пикселей. Автоматически переиспользует свободные слоты, предотвращая рост памяти и утечки VRAM. Активные текстуры корректно освобождаются при выгрузке скриптов.
* **data:** Таблица пикселей RGBA или `uint32_t`.
* **size:** Объект `vec2_t` с размерами текстуры.
* **Возвращает:** `number` (ID текстуры) или `-1` при ошибке.

### `update_texture_rgba(id, data, size)`
Безопасно перезаписывает пиксели в уже существующую текстуру без аллокации новых слотов и выделений памяти. Оптимизировано для динамического рендеринга каждый кадр (идеально под динамический блюр).
* **id:** ID текстуры.
* **data:** Таблица пикселей.
* **size:** `vec2_t`.
* **Возвращает:** `boolean` (`true` при успехе, `false` при ошибке/неверном ID).

### `destroy_texture(id)`
Уничтожает текстуру, освобождает ресурсы в видеопамяти (`ID3D11ShaderResourceView::Release()`) и очищает слот для последующего переиспользования.

### `create_panorama_svg_texture(path)`
Загружает SVG. Принимает пути вида `.vsvg_c` / `.vtex_c` и перед загрузкой в Panorama нормализует их в `.vsvg` / `.vtex`.

---

## 📏 Базовые функции и Клиппинг (Clipping)

* `render.screen_size()` -> `vec2_t`
* `render.frame_time()` -> `number` (DeltaTime)
* `render.frame_count()` -> `number`
* `render.world_to_screen(pos_vec3)` -> `vec2_t` | `nil`

### `push_clip_rect(from, to, [intersect])`
Настоящий клиппинг зоны отрисовки. Применяется ко всему: `text` (добавлен fine clip rect), `texture`, `rect`, `rect_filled`, `line`, `circle`, `circle_filled`, `filled_polygon`, `rect_filled_fade`, `circle_fade`, `polyline` и 3D-проекциям.
* **from:** `vec2_t` (верхний левый угол)
* **to:** `vec2_t` (нижний правый угол)
* **intersect:** `boolean` (пересекать ли с текущим клипом, опционально)

### `pop_clip_rect()`
Убирает ограничение. 
> **Примечание:** Если скрипт забудет вызвать эту функцию, в конце `OnPaint()` стек клипа безопасно очищается.

---

## 📐 2D Примитивы

*Все координаты передаются в формате `vec2_t`.*

### Текст и Изображения
* `render.calc_text_size(text, font_id, [size])` -> `vec2_t`
* `render.text(text, font_id, pos, color, [size])`
* `render.texture(tex_id, from, to, [color], [rounding])`

### Прямоугольники и Линии
* `render.rect(from, to, color, [rounding], [thickness])`
* `render.rect_filled(from, to, color, [rounding])`
* `render.rect_filled_fade(from, to, col_ul, col_ur, col_br, col_bl)`
* `render.line(from, to, color, [thickness])`
* `render.poly_line(table_of_vec2, color, [thickness])`

### Круги и Полигоны
* `render.circle(pos, radius, segments, color, [thickness])`
* `render.circle_filled(pos, radius, segments, color)`
* `render.circle_fade(pos, radius, color_in, color_out)`
* `render.arc(pos, radius, a_min, a_max, segments, color, [thickness])`
* `render.filled_polygon(table_of_vec2, color)`

---

## 🌐 3D Примитивы (В мире)

* `render.circle_3d(pos, radius, color, [thickness], [normal_vec3])`
* `render.circle_filled_3d(pos, radius, color, [normal_vec3])`
* `render.circle_fade_3d(pos, radius, color_in, color_out, [normal_vec3])`

---

## 🌫 Эффекты размытия (UI Blur)

Продвинутые функции для создания размытого заднего фона в стиле современных интерфейсов.

### `set_blur_mode(mode, passes)`
Устанавливает глобальный алгоритм блюра и количество проходов.
* **mode:** `number` (`0` — Gaussian, `1` — Kawase, `2` — Dual Kawase).
* **passes:** `number` (интенсивность шейдера, обычно от `2` до `6`).

### `draw_blurred_rect(x, y, w, h, strength, r, g, b, a, rounding)`
Рисует прямоугольник с заблюренным фоном и цветовым тинтом.
* **strength:** `number` (сила размытия текстуры, `0.0` - `1.0`).
* **r, g, b, a:** `number` (цвет и прозрачность тинта, `0–255`).
* **rounding:** `number` (радиус скругления углов).

### `draw_blurred_circle(x, y, radius, strength, r, g, b, a, [segments])`
Рисует закругленную фигуру/круг с блюром.
* **strength:** `number` (`0.0` - `1.0`).
* **r, g, b, a:** `number` (оттенок, `0–255`).
* **segments:** `number` (детализация круга, по умолчанию `36`).

### `draw_blurred_triangle(x1, y1, x2, y2, x3, y3, strength, r, g, b, a)`
Рисует треугольник с блюром по координатам трех вершин.
* **strength:** `number` (`0.0` - `1.0`).
* **r, g, b, a:** `number` (оттенок, `0–255`).

**Пример использования размытия:**
```lua
register_callback("paint", function()
    -- Настраиваем глобальный блюр на алгоритм Dual Kawase с 4 проходами
    render.set_blur_mode(2, 4)
    
    -- Рисуем размытый квадрат 200x200 с полупрозрачным черным тинтом
    render.draw_blurred_rect(50, 50, 200, 200, 1.0, 0, 0, 0, 100, 8.0)
end)
