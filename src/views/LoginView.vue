<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const rememberMe = ref(false)

function handleLogin() {
  isLoading.value = true
  // Simulação — lógica real será implementada depois
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

const floatingItems = [
  { icon: '🎒', delay: '0s', x: '10%', y: '15%', size: '2.2rem' },
  { icon: '🔑', delay: '1.2s', x: '78%', y: '22%', size: '1.8rem' },
  { icon: '📱', delay: '0.6s', x: '20%', y: '65%', size: '1.9rem' },
  { icon: '👜', delay: '1.8s', x: '72%', y: '60%', size: '2rem' },
  { icon: '📚', delay: '0.4s', x: '50%', y: '10%', size: '1.7rem' },
  { icon: '💳', delay: '2.2s', x: '85%', y: '45%', size: '1.6rem' },
  { icon: '🎧', delay: '1s', x: '8%', y: '42%', size: '2rem' },
  { icon: '⌚', delay: '1.5s', x: '60%', y: '78%', size: '1.8rem' },
]
</script>

<template>
  <div class="login-page">
    <!-- Lado Esquerdo: Visual / Branding -->
    <div class="login-visual" aria-hidden="true">
      <div class="visual-backdrop" />

      <!-- Itens flutuantes animados -->
      <div
        v-for="(item, i) in floatingItems"
        :key="i"
        class="floating-item"
        :style="{
          left: item.x,
          top: item.y,
          fontSize: item.size,
          animationDelay: item.delay,
        }"
      >
        {{ item.icon }}
      </div>

      <!-- Conteúdo central do visual -->
      <div class="visual-content">
        <div class="brand-logo">
          <div class="logo-icon">
            <i class="pi pi-search" aria-hidden="true"></i>
          </div>
          <span class="brand-name">Achados e Perdidos</span>
        </div>

        <div class="visual-headline">
          <h2>
            Encontre o que é seu.
          </h2>
          <p>
            A plataforma da UNDB para<br />
            recuperar itens perdidos com mais<br />
            agilidade e segurança.
          </p>
        </div>


      </div>
    </div>

    <!-- Lado Direito: Formulário de Login -->
    <div class="login-form-panel">
      <div class="form-container">

        <div class="form-header">
          <h1>Bem-vindo de volta</h1>
          <p>Entre com sua conta universitária para continuar</p>
        </div>

        <form class="login-form" novalidate @submit.prevent="handleLogin">
          <!-- Campo E-mail -->
          <div class="field-group">
            <label for="email-input" class="field-label">E-mail institucional</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="email-input"
                v-model="email"
                type="email"
                class="input-field"
                placeholder="seu.nome@undb.edu.br"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <!-- Campo Senha -->
          <div class="field-group">
            <label for="password-input" class="field-label">Senha</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password-input"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="toggle-password"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Lembrar-me -->
          <div class="remember-row">
            <label class="checkbox-label" for="remember-checkbox">
              <input
                id="remember-checkbox"
                v-model="rememberMe"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom" />
              <span>Lembrar de mim</span>
            </label>
          </div>

          <!-- Botão de Login -->
          <button
            id="login-btn"
            type="submit"
            class="login-btn"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            <span v-if="!isLoading" class="btn-text">
              Entrar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span v-else class="btn-spinner" aria-label="Carregando">
              <svg class="spinner-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            </span>
          </button>
        </form>

        <!-- Divisor -->
        <div class="divider">
          <span>ou</span>
        </div>

        <!-- Registro -->
        <div class="register-section">
          <p class="register-text">
            Ainda não tem uma conta?
          </p>
          <a
            id="register-link"
            href="#"
            class="register-btn"
            role="button"
            tabindex="0"
          >
            Criar conta gratuita
          </a>
        </div>
      </div>

      <!-- Footer -->
      <p class="form-footer">
        © 2026 Achados e Perdidos · UNDB · Todos os direitos reservados
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ────────────────────────────────────────────
   Fonte e Reset
─────────────────────────────────────────────*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ────────────────────────────────────────────
   Layout Principal
─────────────────────────────────────────────*/
.login-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #0f0f1a;
}

/* ────────────────────────────────────────────
   Lado Esquerdo — Visual / Branding
─────────────────────────────────────────────*/
.login-visual {
  position: relative;
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 100vh;
}

.visual-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a0f3f 0%, #080520 30%, #060e2a 60%, #050f1e 100%);
  z-index: 0;
}

/* Efeitos de luz */
.login-visual::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(80, 40, 180, 0.18) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  z-index: 1;
}

.login-visual::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
  bottom: -80px;
  right: -60px;
  z-index: 1;
}

/* Itens flutuantes */
.floating-item {
  position: absolute;
  z-index: 2;
  animation: floatItem 6s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6));
  opacity: 0.45;
  user-select: none;
}

@keyframes floatItem {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-14px) rotate(5deg); }
  66% { transform: translateY(8px) rotate(-4deg); }
}

/* Conteúdo central */
.visual-content {
  position: relative;
  z-index: 3;
  color: white;
  text-align: center;
  padding: 2rem;
  max-width: 560px;
}

/* Logo da marca */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.logo-icon {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  font-size: 1.5rem;
  color: white;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
  line-height: 1.3;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* Headline */
.visual-headline h2 {
  font-size: clamp(1.3rem, 2.4vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.headline-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.2em;
  margin-bottom: 0.1em;
}

.visual-headline p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

/* Cards de estatística */
.stat-cards {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0.875rem 1.25rem;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.13);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ────────────────────────────────────────────
   Lado Direito — Formulário
─────────────────────────────────────────────*/
.login-form-panel {
  flex: 0 0 50%;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2rem 2rem;
  position: relative;
}

.form-container {
  width: 100%;
  max-width: 380px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Mobile brand */
.mobile-brand {
  display: none;
  align-items: center;
  gap: 0.6rem;
  color: #4f46e5;
  font-weight: 700;
  font-size: 1rem;
}

.mobile-logo-icon {
  display: flex;
  align-items: center;
  color: #4f46e5;
  font-size: 1.2rem;
}

/* Header do formulário */
.form-header h1 {
  font-size: 1.875rem;
  font-weight: 800;
  color: #0f0f1a;
  letter-spacing: -0.03em;
  margin-bottom: 0.4rem;
}

.form-header p {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 400;
}

/* Campos */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.01em;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.8rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #3730a3;
  text-decoration: underline;
}

/* Input */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s;
}

.input-field {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.8rem 3rem 0.8rem 2.75rem;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.input-field::placeholder {
  color: #c4c9d4;
}

.input-field:hover {
  border-color: #c4b5fd;
}

.input-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  background: #fff;
}

.input-field:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #4f46e5;
}

/* Toggle senha */
.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.toggle-password:hover {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
}

/* Checkbox */
.remember-row {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: white;
}

.checkbox-input:checked + .checkbox-custom {
  background: #4f46e5;
  border-color: #4f46e5;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  width: 5px;
  height: 9px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translateY(-1px);
  display: block;
}

/* Botão de Login */
.login-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  margin-top: 0.25rem;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s;
}

.login-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(79, 70, 229, 0.5);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0px);
  box-shadow: 0 2px 12px rgba(79, 70, 229, 0.3);
}

.login-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-svg {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divisor */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #d1d5db;
  font-size: 0.8rem;
  font-weight: 500;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  color: #9ca3af;
}

/* Seção de Registro */
.register-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.register-text {
  font-size: 0.88rem;
  color: #6b7280;
}

.register-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.825rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.register-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.04);
  transform: translateY(-1px);
}

/* Footer */
.form-footer {
  font-size: 0.72rem;
  color: #c4c9d4;
  text-align: center;
  margin-top: 2rem;
}

/* ────────────────────────────────────────────
   Responsividade
─────────────────────────────────────────────*/
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-visual {
    min-height: 220px;
    flex: none;
  }

  .visual-headline h2 {
    font-size: 1.6rem;
  }

  .stat-cards {
    flex-wrap: nowrap;
    gap: 0.6rem;
  }

  .stat-card {
    padding: 0.6rem 0.8rem;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .brand-logo {
    margin-bottom: 1.5rem;
  }

  .visual-headline p {
    display: none;
  }

  .login-form-panel {
    flex: 1;
    padding: 2rem 1.5rem 1.5rem;
  }
}
</style>
