🎨 Отрисовка (Render API)
Таблица render предоставляет доступ к ImGui и 2D/3D примитивами.
Текстуры и Шрифты
render.setup_font(path, size, [flags]) -> number (ID шрифта)
render.setup_texture(path) -> number (ID текстуры из файла)
render.setup_texture_rgba(table_pixels, vec2_t_size) -> number (Создание текстуры из массива байт)
render.update_texture_rgba(id, table_pixels, vec2_t_size)
render.destroy_texture(id)
Базовые функции
render.screen_size() -> vec2_t
render.frame_time() -> number
render.frame_count() -> number
render.world_to_screen(pos_vec3) -> vec2_t (Вернет nil, если точка за экраном).
render.push_clip_rect(from_vec2, to_vec2, [intersect])
render.pop_clip_rect()
2D Примитивы
render.calc_text_size(text, font_id, [size]) -> vec2_t
render.text(text, font_id, pos_vec2, color_t, [size])
render.texture(tex_id, from_vec2, to_vec2, [color_t], [rounding])
render.rect(from, to, color, [rounding], [thickness])
render.rect_filled(from, to, color, [rounding])
render.rect_filled_fade(from, to, col_ul, col_ur, col_br, col_bl) — Градиентный квадрат.
render.line(from, to, color, [thickness])
render.circle(pos, radius, segments, color, [thickness])
render.circle_filled(pos, radius, segments, color)
render.circle_fade(pos, radius, color_in, color_out) — Радиальный градиент.
render.arc(pos, radius, a_min, a_max, segments, color, [thickness])
render.poly_line(table_of_vec2, color, [thickness])
render.filled_polygon(table_of_vec2, color)
3D Примитивы (в мире)
render.circle_3d(pos_vec3, radius, color, [thickness], [normal_vec3])
render.circle_filled_3d(pos_vec3, radius, color, [normal_vec3])
render.circle_fade_3d(pos_vec3, radius, color_in, color_out, [normal_vec3])
Эффекты Blur (UI Blur)
render.set_blur_mode(mode, passes)
render.draw_blurred_rect(x, y, w, h, strength, r, g, b, a, rounding)
render.draw_blurred_circle(x, y, radius, strength, r, g, b, a, [segments])
render.draw_blurred_triangle(x1, y1, x2, y2, x3, y3, strength, r, g, b, a)
