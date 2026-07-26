# Движок и глобальные таблицы

В данном разделе описаны глобальные таблицы, зарегистрированные в среде Lua и предоставляющие доступ к математическому аппарату и настройкам чита.

## Таблица `math`
Содержит функции для работы с 3D пространством, вычисления углов и дистанций.

* `math.calc_angle(src: vec3_t, dst: vec3_t) -> angle_t`
  Вычисляет углы поворота (`angle_t`), необходимые для того, чтобы смотреть из точки `src` в точку `dst`.

* `math.calc_fov(src: angle_t, dst: angle_t) -> number`
  Возвращает разницу угла обзора (FOV) между двумя углами.

* `math.normalize_angle(angle: number) -> number`
  Нормализует угол (yaw) в диапазоне от -180 до 180 градусов, возвращая корректное значение.

* `math.vector_angles(fwd: vec3_t) -> angle_t`
  Преобразует вектор направления (forward vector) в углы Эйлера (pitch, yaw, 0).

* `math.angle_vectors(ang: angle_t) -> vec3_t, vec3_t, vec3_t`
  Преобразует углы в 3 направляющих вектора.
  **Возвращает 3 значения:** `forward` (вперед), `right` (вправо), `up` (вверх).

## Таблица `menu`
Предоставляет доступ к переменным пользовательского интерфейса (меню). Доступные поля могут быть прочитаны или перезаписаны скриптом.

* `menu.ragebot_fov` (number): Значение FOV для Ragebot по умолчанию `100.0`.
* `menu.ragebot_anti_aim_base_yaw_offset` (number): Смещение Yaw для Anti-Aim.
* `menu.ragebot_anti_aim_pitch` (number): Значение Pitch для Anti-Aim.
* `menu.ragebot_auto_strafer` (boolean): Состояние авто-стрейфера.