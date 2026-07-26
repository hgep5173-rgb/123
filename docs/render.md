# Render

Все функции находятся в глобальной таблице `render`. Отрисовка идет в `ImGui::GetBackgroundDrawList()`.

## Ресурсы

### `render.setup_font(path, size, flags?)`

```lua
local font = render.setup_font('C:/Windows/Fonts/arial.ttf', 16)
```

Возвращает numeric id шрифта. Если шрифт с тем же `path` и `size` уже есть, возвращается существующий id. `flags` сохраняется, но в текущей загрузке шрифтов из `menu.cpp` не используется.

### `render.setup_texture(path, flip_y?)`

Возвращает numeric id текстуры. Текстура загружается асинхронно в render loop. Если путь содержит `avatarcache`, `flip_y` принудительно становится `true`.

```lua
local tex = render.setup_texture('C:/image.png')
```

### `render.setup_texture_rgba(data, size)`

```lua
local pixels = {
    0xffffffff, 0xff0000ff,
    0xff00ff00, 0xffff0000,
}
local tex = render.setup_texture_rgba(pixels, vec2_t(2, 2))
```

`data` - Lua table с `width * height` значениями `uint32_t`, индексация с `1`. `size` - `vec2_t(width, height)`. Возвращает id текстуры или `-1`, если `size` невалиден или `data` не table.

### `render.update_texture_rgba(tex_id, data, size)`

Обновляет динамическую RGBA-текстуру. Возвращает `true` при успешной постановке обновления, иначе `false`.

### `render.destroy_texture(texture)`

Принимает `texture` как numeric id, `image_t` или table с полем `id`. Очищает слот текстуры. Для panorama texture native resource не освобождается вручную.

### `render.texture(texture, from, to, color?, rounding?)`

Рисует текстуру.

```lua
render.texture(tex, vec2_t(10, 10), vec2_t(110, 110), color_t(255, 255, 255, 255), 4)
```

`texture` может быть id, `image_t` или table `{ id = ... }`. `from` и `to` - `vec2_t`. `color` по умолчанию белый, `rounding` по умолчанию `0`.

### `render.create_panorama_svg_texture(path, height)`

Загружает panorama image через `CImageResourceManager::LoadImageFromURL` и возвращает table:

```lua
local img = render.create_panorama_svg_texture('materials/icons/example', 64)
if img then
    local size = img:get_size()
    render.texture(img, vec2_t(0, 0), size)
end
```

Поведение пути из кода:

- если нет `s2r://`, префикс добавляется;
- `.vsvg_c` превращается в `.vsvg`;
- `.vtex_c` превращается в `.vtex`;
- если нет `.vsvg` и `.vtex`, добавляется `.vsvg`.

Возвращает `nil`, если panorama engine/resource manager/proxy недоступны.

## Экран и frame

### `render.screen_size()`

Возвращает `vec2_t(width, height)`. Без текущего ImGui context возвращает `vec2_t(0, 0)`.

### `render.frame_time()`

Возвращает `ImGui::GetIO().DeltaTime`.

### `render.frame_count()`

Возвращает `ImGui::GetFrameCount()`.

### `render.world_to_screen(pos)`

```lua
local screen = render.world_to_screen(world_pos)
```

`pos` - `vec3_t`. Возвращает `vec2_t` или `nil`, если точка не проецируется на экран.

## Текст

### `render.calc_text_size(text, font, size?)`

Возвращает `vec2_t(width, height)` для текста. `font` должен быть numeric id. Параметр `size` присутствует в сигнатуре, но текущий код его не использует.

### `render.text(text, font, pos, arg4?, arg5?)`

Рисует текст.

```lua
render.text('Hello', font, vec2_t(20, 20), color_t(255, 255, 255, 255), 18)
render.text('Hello', font, vec2_t(20, 40), 18, color_t(255, 0, 0, 255))
```

`arg4` и `arg5` могут быть `color_t` или number size. Если цвет не передан, используется белый. Если size не передан или `<= 0`, используется размер текущего font.

## 2D примитивы

### `render.rect(from, to, color, rounding?, thickness?)`

Рамка прямоугольника. `from`/`to` - `vec2_t`, `color` - `color_t`. Defaults: `rounding = 0`, `thickness = 1`.

### `render.rect_filled(from, to, color, rounding?)`

Залитый прямоугольник. Default: `rounding = 0`.

### `render.rect_filled_fade(from, to, col_ul, col_ur, col_br, col_bl)`

Залитый прямоугольник с 4 цветами по углам: upper-left, upper-right, bottom-right, bottom-left.

### `render.line(from, to, color, thickness?)`

Линия. Default: `thickness = 1`.

### `render.circle(pos, radius, segments, color, thickness?)`

Окружность. Default: `thickness = 1`.

### `render.circle_filled(pos, radius, segments, color)`

Залитый круг.

### `render.circle_fade(pos, radius, col_in, col_out)`

Радиальный градиентный круг. В коде используется `64` сегмента.

### `render.arc(pos, radius, a_min, a_max, segments, color, thickness?)`

Дуга через `PathArcTo` и `PathStroke`. Углы передаются напрямую в ImGui, то есть в радианах.

### `render.poly_line(points, color, thickness?)`

`points` - table из `vec2_t`. Рисует polyline, если точек минимум 2. Default: `thickness = 1`.

### `render.polygon(points, color)`
### `render.concave_polygon(points, color)`
### `render.filled_polygon(points, color)`

Все три имени привязаны к одной функции. Она собирает `vec2_t` из table и вызывает `AddConvexPolyFilled`, если точек минимум 3.

## Clip rect

### `render.push_clip_rect(from, to, intersect?)`

Добавляет clip rect и увеличивает внутренний счетчик Lua clip depth. Default: `intersect = false`.

### `render.pop_clip_rect()`

Снимает clip rect только если внутренний счетчик больше `0`. После `paint` оставшиеся clip rect автоматически снимаются.

## 3D примитивы

### `render.circle_3d(pos, radius, color, thickness?, normal?)`

Рисует 3D окружность, проецируя 64 точки в экранные координаты. `pos` и `normal` - `vec3_t`; `normal` по умолчанию `vec3_t(0, 0, 1)`. Если любая точка не проецируется, окружность не рисуется.

### `render.circle_filled_3d(pos, radius, color, normal?)`

Залитый 3D круг. Используется та же генерация 64 точек и `AddConvexPolyFilled`.

### `render.circle_fade_3d(pos, radius, col_in, col_out, normal?)`

3D радиальный градиент. Центр и окружность проецируются через `WorldToScreen`; если проекция не удалась, ничего не рисуется.

## Blur

Blur API привязан к `UIBlur` из `ui_blur.cpp`.

### `render.set_blur_mode(mode, passes?)`

```lua
render.set_blur_mode(0, 4)
```

Если третий аргумент не передан, вызывается `UIBlur::SetGlobalBlurMode(mode, passes)`. В текущем `SetGlobalBlurMode` сам `mode` не используется; radius выставляется как `passes * 12`, quality и directions становятся `16`.

Значения enum из `ui_blur.h`:

| Mode | Значение |
| --- | --- |
| `Gaussian` | `0` |
| `Kawase` | `1` |
| `DualKawase` | `2` |
| `RadialHiQuality` | `3` |

### `render.set_blur_mode(radius, quality, directions)`

Если передан третий аргумент, эта же функция вызывает `UIBlur::SetBlurParams(radius, quality, directions)`.

### `render.set_blur_params(radius, quality?, directions?)`

Прямо задает blur параметры. Defaults: `quality = 16`, `directions = 16`.

### `render.draw_blurred_rect(x, y, w, h, strength, r, g, b, a, rounding)`

Рисует blurred rectangle. `strength` clamp-ится в диапазон `0..1`. Tint рисуется поверх, если alpha больше `0`.

### `render.draw_blurred_circle(x, y, radius, strength, r, g, b, a, segments?)`

Рисует blurred circle. Default: `segments = 36`. `strength` clamp-ится в `0..1`.

### `render.draw_blurred_triangle(x1, y1, x2, y2, x3, y3, strength, r, g, b, a)`

Рисует blurred triangle. `strength` clamp-ится в `0..1`.
