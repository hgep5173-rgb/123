import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "CS2 Lua API",
  description: "Документация",
  base: '/123/', // Важно: это название твоего репозитория
  appearance: 'dark', // Принудительная темная тема
  themeConfig: {
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'CS2 Lua API',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Типы данных', link: '/types' },
          { text: 'Отрисовка (Render)', link: '/render' },
          { text: 'Сущности (Entity)', link: '/entity' },
          { text: 'Движок (Engine)', link: '/engine' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'На этой странице'
    }
  }
})
