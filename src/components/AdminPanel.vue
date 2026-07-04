<script setup>
import { onMounted, reactive, ref } from 'vue'
import { assetUrl, store } from '../composables/useStore.js'

// --- авторизация ---
const token = ref(localStorage.getItem('admin-token') || '')
const password = ref('')
const loginError = ref('')

// --- редактируемая копия данных ---
const draft = reactive(JSON.parse(JSON.stringify(store)))
const activeTab = ref('settings')
const saveStatus = ref('') // '', 'saving', 'saved', 'error'
const saveError = ref('')

const tabs = [
  { id: 'settings', label: '⚙️ Настройки' },
  { id: 'model', label: '📦 Товар' },
  { id: 'flavors', label: '🍧 Вкусы' },
  { id: 'wallets', label: '🪙 Кошельки' },
]

onMounted(() => {
  // подтягиваем актуальные данные с сервера в черновик
  fetch('/api/store')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) Object.assign(draft, data)
    })
    .catch(() => {})
})

async function login() {
  loginError.value = ''
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    })
    if (!res.ok) {
      loginError.value = 'Неверный пароль'
      return
    }
    const { token: t } = await res.json()
    token.value = t
    localStorage.setItem('admin-token', t)
    password.value = ''
  } catch {
    loginError.value = 'Сервер недоступен. Запущен ли npm run dev / npm start?'
  }
}

function logout() {
  token.value = ''
  localStorage.removeItem('admin-token')
}

async function save() {
  saveStatus.value = 'saving'
  saveError.value = ''
  try {
    const res = await fetch('/api/store', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(draft),
    })
    if (res.status === 401) {
      logout()
      saveStatus.value = 'error'
      saveError.value = 'Сессия истекла — войдите заново'
      return
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Ошибка сохранения')
    }
    Object.assign(store, JSON.parse(JSON.stringify(draft)))
    saveStatus.value = 'saved'
    setTimeout(() => (saveStatus.value = ''), 2000)
  } catch (e) {
    saveStatus.value = 'error'
    saveError.value = e.message
  }
}

// --- характеристики ---
function addSpec() {
  draft.model.specs.push({ icon: '✨', label: '' })
}
function removeSpec(i) {
  draft.model.specs.splice(i, 1)
}

// --- вкусы ---
function addFlavor() {
  draft.flavors.push({
    id: `flavor-${Date.now()}`,
    name: '',
    ru: '',
    colors: ['#8b5cf6', '#22d3ee'],
    badge: null,
    image: '',
  })
}
function removeFlavor(i) {
  draft.flavors.splice(i, 1)
}
function moveFlavor(i, dir) {
  const j = i + dir
  if (j < 0 || j >= draft.flavors.length) return
  const [f] = draft.flavors.splice(i, 1)
  draft.flavors.splice(j, 0, f)
}

async function uploadImage(event, flavor) {
  const file = event.target.files?.[0]
  if (!file) return
  const form = new FormData()
  form.append('image', file)
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: form,
    })
    if (res.status === 401) {
      logout()
      return
    }
    const data = await res.json()
    if (data.path) flavor.image = data.path
  } catch {
    saveError.value = 'Не удалось загрузить картинку'
  } finally {
    event.target.value = ''
  }
}

// --- кошельки ---
function addWallet() {
  draft.wallets.push({
    id: `coin-${Date.now()}`,
    name: '',
    network: '',
    address: '',
    coingeckoId: '',
    decimals: 2,
    icon: '🪙',
  })
}
function removeWallet(i) {
  draft.wallets.splice(i, 1)
}
</script>

<template>
  <div class="admin">
    <!-- ЛОГИН -->
    <div v-if="!token" class="login-wrap">
      <form class="login-card" @submit.prevent="login">
        <h1>🔐 Админка {{ draft.shopName }}</h1>
        <p class="login-hint">
          Пароль лежит в файле <code>data/admin-password.txt</code>
          (создаётся при первом запуске сервера).
        </p>
        <input
          v-model="password"
          type="password"
          placeholder="Пароль"
          class="field"
          autofocus
        />
        <p v-if="loginError" class="error">{{ loginError }}</p>
        <button class="btn btn-primary" type="submit">Войти</button>
        <a href="/" class="back-link">← на сайт</a>
      </form>
    </div>

    <!-- ПАНЕЛЬ -->
    <template v-else>
      <header class="admin-head">
        <h1>⚙️ Админка {{ draft.shopName }}</h1>
        <div class="head-actions">
          <a href="/" class="back-link">← на сайт</a>
          <button class="btn-small ghost" @click="logout">Выйти</button>
        </div>
      </header>

      <nav class="tabs">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="tab"
          :class="{ active: activeTab === t.id }"
          @click="activeTab = t.id"
        >
          {{ t.label }}
        </button>
      </nav>

      <main class="admin-body">
        <!-- НАСТРОЙКИ -->
        <section v-if="activeTab === 'settings'" class="panel">
          <label class="row">
            <span>Название магазина</span>
            <input v-model="draft.shopName" class="field" />
          </label>
          <label class="row">
            <span>Telegram-канал <small>username или инвайт-код «+XXXX» для приватного</small></span>
            <input v-model="draft.tgChannel" class="field" placeholder="my_channel или +AbCdEf123" />
          </label>
          <label class="row">
            <span>Менеджер (принимает заказы) <small>username, можно с @</small></span>
            <input v-model="draft.tgManager" class="field" placeholder="username" />
          </label>
          <label class="row">
            <span>Валюта</span>
            <input v-model="draft.currency" class="field short" />
          </label>
        </section>

        <!-- ТОВАР -->
        <section v-if="activeTab === 'model'" class="panel">
          <div class="grid-2">
            <label class="row">
              <span>Бренд</span>
              <input v-model="draft.model.brand" class="field" />
            </label>
            <label class="row">
              <span>Название модели</span>
              <input v-model="draft.model.name" class="field" />
            </label>
            <label class="row">
              <span>Цена, {{ draft.currency }}</span>
              <input v-model.number="draft.model.price" type="number" min="0" class="field" />
            </label>
            <label class="row">
              <span>Количество тяг</span>
              <input v-model.number="draft.model.puffs" type="number" min="0" class="field" />
            </label>
          </div>

          <h3 class="sub">Характеристики (чипы на сайте)</h3>
          <div v-for="(s, i) in draft.model.specs" :key="i" class="spec-row">
            <input v-model="s.icon" class="field emoji" title="Эмодзи" />
            <input v-model="s.label" class="field" placeholder="Текст характеристики" />
            <button class="btn-small danger" @click="removeSpec(i)">✕</button>
          </div>
          <button class="btn-small" @click="addSpec">+ Добавить характеристику</button>
        </section>

        <!-- ВКУСЫ -->
        <section v-if="activeTab === 'flavors'" class="panel">
          <div v-for="(f, i) in draft.flavors" :key="f.id" class="flavor-card">
            <div class="flavor-preview" :style="{ background: `linear-gradient(135deg, ${f.colors[0]}33, ${f.colors[1]}22)` }">
              <img v-if="f.image" :src="assetUrl(f.image)" :alt="f.name" />
              <span v-else class="no-img">нет фото</span>
            </div>
            <div class="flavor-fields">
              <div class="grid-2">
                <label class="row">
                  <span>Название (как на упаковке)</span>
                  <input v-model="f.name" class="field" placeholder="Watermelon Ice" />
                </label>
                <label class="row">
                  <span>Подпись по-русски</span>
                  <input v-model="f.ru" class="field" placeholder="Арбуз · Лёд" />
                </label>
                <label class="row">
                  <span>Плашка <small>пусто = без плашки</small></span>
                  <input
                    :value="f.badge || ''"
                    class="field"
                    placeholder="Хит / Новинка"
                    @input="f.badge = $event.target.value || null"
                  />
                </label>
                <div class="row">
                  <span>Цвета карточки</span>
                  <div class="colors">
                    <input v-model="f.colors[0]" type="color" />
                    <input v-model="f.colors[1]" type="color" />
                  </div>
                </div>
              </div>
              <div class="flavor-image-row">
                <label class="upload-btn btn-small">
                  📷 Загрузить фото
                  <input type="file" accept="image/*" hidden @change="uploadImage($event, f)" />
                </label>
                <input v-model="f.image" class="field" placeholder="или путь к картинке: /products/….webp" />
              </div>
            </div>
            <div class="flavor-actions">
              <button class="btn-small" :disabled="i === 0" @click="moveFlavor(i, -1)">↑</button>
              <button class="btn-small" :disabled="i === draft.flavors.length - 1" @click="moveFlavor(i, 1)">↓</button>
              <button class="btn-small danger" @click="removeFlavor(i)">✕</button>
            </div>
          </div>
          <button class="btn-small" @click="addFlavor">+ Добавить вкус</button>
          <p class="note">Первые три вкуса списка показываются в шапке сайта.</p>
        </section>

        <!-- КОШЕЛЬКИ -->
        <section v-if="activeTab === 'wallets'" class="panel">
          <div v-for="(w, i) in draft.wallets" :key="w.id" class="wallet-card">
            <div class="grid-2">
              <label class="row">
                <span>Название монеты</span>
                <input v-model="w.name" class="field" placeholder="USDT" />
              </label>
              <label class="row">
                <span>Сеть</span>
                <input v-model="w.network" class="field" placeholder="TRC-20" />
              </label>
              <label class="row full">
                <span>Адрес кошелька</span>
                <input v-model="w.address" class="field mono" placeholder="TXXXX…" />
              </label>
              <label class="row">
                <span>ID на CoinGecko <small>для пересчёта курса</small></span>
                <input v-model="w.coingeckoId" class="field" placeholder="tether" />
              </label>
              <label class="row">
                <span>Знаков после запятой</span>
                <input v-model.number="w.decimals" type="number" min="0" max="8" class="field short" />
              </label>
              <label class="row">
                <span>Эмодзи</span>
                <input v-model="w.icon" class="field emoji" />
              </label>
            </div>
            <button class="btn-small danger wallet-remove" @click="removeWallet(i)">✕ Убрать монету</button>
          </div>
          <button class="btn-small" @click="addWallet">+ Добавить монету</button>
        </section>
      </main>

      <footer class="save-bar">
        <span v-if="saveStatus === 'saved'" class="ok">✅ Сохранено — изменения уже на сайте</span>
        <span v-else-if="saveStatus === 'error'" class="error">{{ saveError }}</span>
        <span v-else-if="saveStatus === 'saving'">Сохраняем…</span>
        <button class="btn btn-primary" :disabled="saveStatus === 'saving'" @click="save">
          💾 Сохранить всё
        </button>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  padding-bottom: 90px;
}

/* --- логин --- */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 36px 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-card h1 {
  font-size: 1.3rem;
}

.login-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.login-hint code {
  background: var(--bg);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* --- шапка / вкладки --- */
.admin-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.admin-head h1 {
  font-size: 1.25rem;
}

.head-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  color: var(--text);
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 16px 24px 0;
  flex-wrap: wrap;
}

.tab {
  background: var(--card);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.tab.active {
  color: var(--text);
  border-color: var(--accent);
  background: rgba(139, 92, 246, 0.12);
}

.admin-body {
  padding: 24px;
  max-width: 900px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- поля --- */
.row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.row small {
  color: var(--text-muted);
  font-weight: 400;
}

.field {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  padding: 10px 12px;
  font: inherit;
  font-size: 0.9rem;
  width: 100%;
}

.field:focus {
  outline: none;
  border-color: var(--accent);
}

.field.short {
  max-width: 120px;
}

.field.emoji {
  max-width: 70px;
  text-align: center;
}

.field.mono {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.8rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.grid-2 .full {
  grid-column: 1 / -1;
}

.sub {
  font-size: 1rem;
  margin-top: 8px;
}

.spec-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* --- кнопки --- */
.btn-small {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  font-size: 0.85rem;
  align-self: flex-start;
}

.btn-small:hover:not(:disabled) {
  border-color: var(--accent);
}

.btn-small:disabled {
  opacity: 0.4;
  cursor: default;
}

.btn-small.danger {
  color: #f87171;
}

.btn-small.danger:hover {
  border-color: #f87171;
}

.btn-small.ghost {
  color: var(--text-muted);
}

/* --- вкусы --- */
.flavor-card {
  display: flex;
  gap: 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}

.flavor-preview {
  width: 110px;
  min-height: 130px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.flavor-preview img {
  max-height: 120px;
  object-fit: contain;
}

.no-img {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.flavor-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.flavor-image-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.upload-btn {
  cursor: pointer;
  white-space: nowrap;
}

.colors {
  display: flex;
  gap: 8px;
}

.colors input {
  width: 44px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  padding: 3px;
  cursor: pointer;
}

.flavor-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* --- кошельки --- */
.wallet-card {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wallet-remove {
  align-self: flex-end;
}

/* --- сохранение --- */
.save-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(11, 11, 18, 0.92);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.ok {
  color: #4ade80;
  font-size: 0.9rem;
}

.error {
  color: #f87171;
  font-size: 0.9rem;
}

@media (max-width: 700px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
  .flavor-card {
    flex-direction: column;
  }
  .flavor-actions {
    flex-direction: row;
  }
}
</style>
