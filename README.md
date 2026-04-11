# web-findit-gamified
#Estive aqui. Prof Rondineli Seba
#Por que 3 repositóri
Interface web gamificada para o sistema de achados e perdidos universitário.

## Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia

## Estrutura

```text
src/
│
├── assets/                 # Arquivos estáticos (imagens, ícones, fontes)
│   ├── images/
│   ├── icons/
│   └── styles/             # CSS global, variáveis, temas
│
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes base (botão, input, modal)
│   │   ├── BaseInput.vue
│   │   ├── BaseButton.vue
│   │   └── BaseModal.vue
│   │
│   ├── layout/             # Layouts reutilizáveis
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   │
│   └── shared/             # Componentes genéricos
│       ├── LoadingSpinner.vue
│       └── EmptyState.vue
│
├── views/                  # Páginas da aplicação (rotas)
│   ├── auth/               # Autenticação
│   │   ├── Login.vue
│   │   └── Register.vue
│   │
│   ├── dashboard/          # Tela principal após login
│   │   └── Dashboard.vue
│   │
│   ├── items/              # Itens perdidos/encontrados
│   │   ├── LostItems.vue
│   │   ├── FoundItems.vue
│   │   ├── ItemDetails.vue
│   │   └── CreateItem.vue
│   │
│   ├── profile/            # Perfil do usuário
│   │   └── Profile.vue
│   │
│   └── NotFound.vue        # Página 404
│
├── router/                 # Configuração de rotas
│   └── index.ts
│
├── services/               # Comunicação com APIs (Axios/FETCH)
│   ├── api.ts
│   ├── authService.ts
│   └── itemService.ts
│
├── stores/                 # Gerenciamento de estado (Pinia ou Vuex)
│   ├── auth.store.ts
│   └── item.store.ts
│
├── hooks/                  # Composables (lógica reutilizável)
│   ├── useAuth.ts
│   ├── useItems.ts
│   └── useLoading.ts
│
├── types/                  # Tipagens TypeScript
│   ├── user.ts
│   └── item.ts
│
├── utils/                  # Funções utilitárias
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
│
├── App.vue                 # Componente raiz
├── main.ts                 # Entry point da aplicação
└── env.d.ts                # Tipos globais
```

## Como rodar

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
