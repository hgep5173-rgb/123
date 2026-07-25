# 🎨 Отрисовка (Render API)

Таблица `render` предоставляет доступ к мощному рендереру на базе ImGui, включая 2D примитивы, работу с текстурами, 3D примитивы в мире и эффекты размытия (Blur).

Все функции отрисовки должны вызываться внутри коллбека `"paint"`.

---

## 🖼 Текстуры и Шрифты

### `setup_font(path, size, [flags])`
Загружает кастомный шрифт.
* **Возвращает:** `number` (ID шрифта)

### `setup_texture(path)`
Загружает текстуру из файла на диске.
* **Возвращает:** `number` (ID текстуры)

### `setup_texture_rgba(table_pixels, vec2_t_size)`
Создает динамическую текстуру из массива байт (RGBA).
* **Возвращает:** `number` (ID текстуры)

### `update_texture_rgba(id, table_pixels, vec2_t_size)`
Обновляет пиксели динамической текстуры (например, для отрисовки кастомных изображений в реальном времени).

### `destroy_texture(id)`
Удаляет текстуру из видеопамяти и освобождает ресурсы.

---

## 📏 Базовые функции

* `render.screen_size()` -> `vec2_t` (Возвращает размер экрана)
* `render.frame_time()` -> `number` (Время отрисовки последнего кадра - DeltaTime)
* `render.frame_count()` -> `number` (Счетчик кадров ImGui)
* `render.world_to_screen(pos_vec3)` -> `vec2_t` | `nil` (Переводит 3D координаты мира в 2D координаты экрана. Возвращает `nil`, если точка находится за спиной камеры).
* `render.push_clip_rect(from_vec2, to_vec2, [intersect])` (Ограничивает зону отрисовки)
* `render.pop_clip_rect()` (Убирает ограничение зоны отрисовки)

---

## 📐 2D Примитивы

Все координаты для этих функций передаются в формате `vec2_t`.

### Текст и Изображения
* `render.calc_text_size(text, font_id, [size])` -> `vec2_t`
* `render.text(text, font_id, pos, color, [size])`
* `render.texture(tex_id, from, to, [color], [rounding])`

### Прямоугольники и Линии
* `render.rect(from, to, color, [rounding], [thickness])`
* `render.rect_filled(from, to, color, [rounding])`
* `render.rect_filled_fade(from, to, col_ul, col_ur, col_br, col_bl)` — Прямоугольник с градиентом по 4 углам.
* `render.line(from, to, color, [thickness])`
* `render.poly_line(table_of_vec2, color, [thickness])`

### Круги и Полигоны
* `render.circle(pos, radius, segments, color, [thickness])`
* `render.circle_filled(pos, radius, segments, color)`
* `render.circle_fade(pos, radius, color_in, color_out)` — Залитый круг с радиальным градиентом (от центра к краям).
* `render.arc(pos, radius, a_min, a_max, segments, color, [thickness])`
* `render.filled_polygon(table_of_vec2, color)`

---

## 🌐 3D Примитивы (В мире)

Эти функции принимают 3D координаты (`vec3_t`) и сами переводят их на экран, создавая правильную перспективу. Идеально подходит для ESP.

* `render.circle_3d(pos, radius, color, [thickness], [normal_vec3])`
* `render.circle_filled_3d(pos, radius, color, [normal_vec3])`
* `render.circle_fade_3d(pos, radius, color_in, color_out, [normal_vec3])`

*Примечание: Если `normal_vec3` не передан, круг рисуется на земле по умолчанию.*

---

## 🌫 Эффекты размытия (UI Blur)

Функции для создания красивого заднего фона у окон и плашек в стиле современных читов.

* `render.set_blur_mode(mode_int, passes_int)` — Устанавливает глобальный режим размытия (например, качество и количество проходов).
* `render.draw_blurred_rect(x, y, w, h, strength, r, g, b, a, rounding)`
* `render.draw_blurred_circle(x, y, radius, strength, r, g, b, a, [segments])`
* `render.draw_blurred_triangle(x1, y1, x2, y2, x3, y3, strength, r, g, b, a)`

**Пример размытого прямоугольника:**
```lua
register_callback("paint", function()
    -- Рисуем размытый квадрат 200x200 на координатах 50, 50
    render.draw_blurred_rect(50, 50, 200, 200, 5.0, 255, 255, 255, 255, 8.0)
end)
```
