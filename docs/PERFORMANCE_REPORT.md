# Relatório de Performance — Inicialização do 2A Rural

## 1. Diagnóstico de Bloqueios (Antes)

### Componente que inicia a aplicação

- `src/main.tsx` chama `createRoot(document.getElementById('root')!).render(<App />)`
- `src/App.tsx` é o componente raiz que define todos os providers e rotas

### Arquivo que controla a rota inicial

- `src/App.tsx` define `<Route path="/" element={<Login />} />` como rota inicial

### Funções executadas antes do login renderizar

1. `AuthProvider` (em `src/hooks/use-auth.tsx`) inicializa `loading = true` (sempre)
2. `AuthProvider.useEffect` executa `pb.collection('users').authRefresh()` — chamada de rede ao PocketBase
3. `SessionProvider` (em `src/stores/session.tsx`) lê `localStorage` em `useEffect` (síncrono, não bloqueante)
4. `NativeAppShell` executa `useEffect` com lógica de navegação (não bloqueante)
5. `Login.tsx` retorna `<div className="fixed inset-0 bg-[#002C45]" />` (tela em branco) enquanto `authLoading || isAuthenticated`

### Chamadas `await` antes do primeiro render

- `await pb.collection('users').authRefresh()` em `AuthProvider` — bloqueia `loading` em `true` até completar
- `Login.tsx` aguarda `authLoading` ser `false` antes de renderizar o formulário

### Consultas a APIs externas no startup

- **PocketBase**: `authRefresh()` é chamado antes do login aparecer
- Nenhuma consulta a Sintegra, BrasilAPI ou Focus NFe no startup

### Todas as telas importadas no bundle inicial

- **Sim** — todos os 22+ componentes de página são importados eager em `App.tsx`
- Isso inclui: Dashboard, EmitirNF, EmitirLeite, EmitirGado, ConsultarNF, Configuracoes, Estatistica, CadastrarCliente, todas as telas de registro, etc.

### Fontes e recursos visuais bloqueando render

- `@import url('https://fonts.googleapis.com/css2?...')` em `src/main.css` — bloqueia renderização
- Três famílias de fontes carregadas: Montserrat, Playfair Display, Roboto
- O `@import` CSS é síncrono e bloqueia o first paint

### Validação de sessão remota antes da UI

- **Sim** — `authRefresh()` faz uma chamada de rede antes do login ser exibido
- Se não há sessão salva, `loading` ainda inicia como `true` e só muda para `false` após o `useEffect` executar

### Propriedades, clientes ou configurações pré-carregadas

- Não — propriedades e clientes são carregados após autenticação nas telas respectivas
- `SessionProvider` lê do `localStorage` (síncrono, não bloqueante)

### Múltiplos redirecionamentos entre abrir e login

- `NativeAppShell` pode redirecionar de `/login` para `/dashboard` ou `/selecionar-propriedade` se autenticado
- Não há redirecionamentos sucessivos, mas há um redirecionamento condicional

---

## 2. Arquivos Analisados

| Arquivo                              | Função                                  |
| ------------------------------------ | --------------------------------------- |
| `src/main.tsx`                       | Entry point — renderização do React     |
| `src/App.tsx`                        | Rotas, providers, guards                |
| `src/hooks/use-auth.tsx`             | Autenticação e estado de loading        |
| `src/stores/session.tsx`             | Sessão e propriedade ativa              |
| `src/pages/Login.tsx`                | Tela de login (rota inicial)            |
| `src/components/NativeAppShell.tsx`  | Shell nativo, navegação, restore        |
| `src/components/ProtectedLayout.tsx` | Layout para rotas protegidas            |
| `src/components/Layout.tsx`          | Layout para rotas não-protegidas        |
| `src/main.css`                       | Estilos globais e @import de fontes     |
| `index.html`                         | HTML entry (PROTEGIDO — não modificado) |
| `src/lib/pocketbase/client.ts`       | Cliente PocketBase                      |

---

## 3. Arquivos Modificados

| Arquivo                  | Alteração                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `src/lib/font-loader.ts` | **NOVO** — Carregamento assíncrono de fontes via JS                                                          |
| `src/main.tsx`           | Importar e chamar `loadFonts()` após render                                                                  |
| `src/main.css`           | Remover `@import` de Google Fonts; adicionar `font-family` fallback no `body`                                |
| `src/hooks/use-auth.tsx` | Inicializar `loading` com `pb.authStore.isValid` em vez de `true`                                            |
| `src/pages/Login.tsx`    | Mostrar spinner (não tela em branco) quando autenticado; renderizar login imediatamente quando não há sessão |
| `src/App.tsx`            | Lazy loading de todas as telas não-essenciais via `React.lazy` + `Suspense`; SplashLoader com spinner        |

---

## 4. Mudanças Detalhadas

### `src/lib/font-loader.ts` (novo)

- Cria `<link rel="preconnect">` para `fonts.googleapis.com` e `fonts.gstatic.com`
- Cria `<link rel="stylesheet">` via JavaScript (não bloqueia renderização)
- Fontes carregam em paralelo após o primeiro paint

### `src/main.tsx`

- Importa `loadFonts` de `@/lib/font-loader`
- Chama `loadFonts()` após `createRoot().render()` — fontes carregam depois do React iniciar

### `src/main.css`

- Removido `@import url('https://fonts.googleapis.com/...')` (bloqueava renderização)
- Adicionado `font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` no `body` — garante fallback visual antes das fontes carregarem

### `src/hooks/use-auth.tsx`

- `useState(true)` → `useState(pb.authStore.isValid)`
- Quando não há sessão local: `loading = false` imediatamente → login renderiza sem aguardar rede
- Quando há sessão local: `loading = true` → valida em background via `authRefresh()` → redireciona ou mostra login

### `src/pages/Login.tsx`

- Substituído `<div className="fixed inset-0 bg-[#002C45]" />` (tela em branco) por tela com spinner `Loader2` quando `authLoading || isAuthenticated`
- Quando não há sessão: login renderiza imediatamente (sem aguardar `authRefresh`)

### `src/App.tsx`

- `import Login from './pages/Login'` — mantido eager (tela inicial)
- 22 páginas convertidas para `React.lazy(() => import(...))`
- Componentes estruturais (Layout, ProtectedLayout, NativeAppShell, PwaIntegrityGuard) mantidos eager
- Providers (AuthProvider, SessionProvider, TooltipProvider) mantidos eager
- `<Suspense fallback={<SplashLoader />}>` envolve `<Routes>` — SplashLoader mostra spinner
- SplashLoader melhorado: de `<div bg-[#002C45] />` para `<div>` com `Loader2` animado

---

## 5. Medidas de Performance (Antes vs Depois)

### Antes (análise de código)

| Métrica                                  | Valor Estimado                                                      |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Tempo até primeiro render                | 500–2000 ms (bloqueado por @import de fontes + estado loading=true) |
| Tempo até login visível                  | 1000–3000 ms (bloqueado por authRefresh ao PocketBase)              |
| Tempo até tela interativa                | 1000–3000 ms                                                        |
| Requisições antes do login               | 1 (authRefresh) + 1 (CSS de fontes) + 3–6 (arquivos de fonte)       |
| Tamanho do bundle inicial                | ~500–800 KB (todas as 22+ páginas + componentes + bibliotecas)      |
| Módulos carregados antes da autenticação | App inteira (todas as telas, serviços, utilitários)                 |

### Depois (análise de código)

| Métrica                                  | Valor Estimado                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| Tempo até primeiro render                | 50–200 ms (bundle mínimo, sem recursos bloqueantes)                     |
| Tempo até login visível                  | 50–200 ms (sem chamadas de rede, sem bloqueio de fontes)                |
| Tempo até tela interativa                | 50–200 ms                                                               |
| Requisições antes do login               | 0 (fontes carregam assíncrono após render)                              |
| Tamanho do bundle inicial                | ~150–250 KB (Login + auth + session + layout + UI mínima)               |
| Módulos carregados antes da autenticação | Login, AuthProvider, SessionProvider, Layout, NativeAppShell, UI básica |

### Redução estimada

- Bundle inicial: **~60–70% menor** (lazy loading de 22 páginas)
- Requisições antes do login: **100% redução** (0 vs 5–8)
- Tempo até login visível: **~80–90% mais rápido** (sem rede, sem bloqueio de fontes)

---

## 6. Confirmação de Arquivos Protegidos

Os seguintes arquivos NÃO foram modificados:

- `public/manifest.json` ✓
- `public/sw.js` ✓
- `public/2ARural192x192.png` ✓
- `public/2ARural512x512.png` ✓
- `public/favicon.ico` ✓
- `index.html` ✓

---

## 7. Riscos e Pendências

### Riscos

- **FOUT (Flash of Unstyled Text)**: Texto pode aparecer com fonte do sistema antes do Montserrat carregar. Mitigado por `display=swap` e fallback `system-ui`.
- **Chunks sob demanda**: Primeira navegação para uma tela lazy tem um pequeno delay de carregamento do chunk. Mitigado por Suspense com spinner.
- **Estimativas de performance**: Os números são baseados em análise de código, não em medições em dispositivo real. Recomenda-se validar com Lighthouse/DevTools.

### Pendências

- Validar tempos reais em smartphone com Lighthouse mobile
- Considerar preload de chunks críticos (ex: SelectProperty) se o delay for perceptível
- Avaliar se Playfair Display e Roboto são necessários (remover se não usados reduz payload de fontes)

---

## 8. Resultados de Testes

### Teste em Smartphone (esperado)

- App abre → login aparece imediatamente (sem tela em branco)
- Sem barras de rolagem indesejadas
- Fonte do sistema aparece primeiro, Montserrat carrega em seguida (FOUT mínimo)
- Navegação para outras telas mostra spinner breve durante carregamento do chunk

### Teste de Page Refresh (esperado)

- Refresh no login → login reaparece imediatamente
- Refresh em rota protegida → SplashLoader com spinner → redirect para login (se sessão expirada) ou volta à tela (se sessão válida)
- Sem congelamento ou tela em branco
- Estado de sessão restaurado do localStorage sem chamada de rede antes do UI

---

## 9. Validação Prática em Dispositivo Físico

### Registro de Validação

> Validação prática realizada em dispositivo físico pelo responsável pelo projeto. O aplicativo apresentou inicialização praticamente imediata após o toque, com exibição rápida da tela de login e melhora significativa em relação à versão anterior. As métricas quantitativas permanecem pendentes de instrumentação formal.

### Comportamento Observado

- O aplicativo inicia praticamente imediatamente após o toque no ícone.
- A tela de login aparece sem atraso perceptível.
- Houve melhora significativa em comparação com o comportamento anterior à otimização.
- Nenhuma tela branca prolongada foi observada antes da exibição do login.

### Status da Otimização

- A otimização de inicialização está **aprovada funcionalmente** no dispositivo testado.
- Não há ainda uma medição técnica formal em milissegundos disponível.
- A melhora foi confirmada por teste direto em smartphone físico pelo responsável pelo projeto.

### Proteção da Infraestrutura PWA

Os arquivos de infraestrutura PWA congelados **permanecem inalterados** e devem continuar sem modificações:

- `public/manifest.json` ✓
- `public/sw.js` ✓
- `public/2ARural192x192.png` ✓
- `public/2ARural512x512.png` ✓
- `public/favicon.ico` ✓
- `index.html` ✓

> A infraestrutura PWA congelada deve continuar sem alterações. Nenhuma modificação nestes arquivos é permitida.
