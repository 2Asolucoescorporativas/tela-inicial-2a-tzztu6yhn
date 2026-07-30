# Auditoria Completa do Projeto 2A Rural

**Data da auditoria:** 30 de julho de 2026
**Base:** Análise do código-fonte existente no repositório
**Responsável:** Equipe de desenvolvimento

---

## Sumário

1. [Tecnologias Utilizadas](#1-tecnologias-utilizadas)
2. [Estrutura do Projeto](#2-estrutura-do-projeto)
3. [Rotas](#3-rotas)
4. [Telas](#4-telas)
5. [Componentes Reutilizáveis](#5-componentes-reutilizáveis)
6. [Design System](#6-design-system)
7. [PWA](#7-pwa)
8. [Autenticação e Segurança](#8-autenticação-e-segurança)
9. [APIs e Integrações](#9-apis-e-integrações)
10. [Banco de Dados e Persistência](#10-banco-de-dados-e-persistência)
11. [Funcionalidades](#11-funcionalidades)
12. [Qualidade do Código](#12-qualidade-do-código)
13. [Erros e Itens Pendentes](#13-erros-e-itens-pendentes)
14. [Percentuais de Evolução](#14-percentuais-de-evolução)
15. [Próximos Passos](#15-próximos-passos)

---

## 1. Tecnologias Utilizadas

### Framework principal

- **React** `^19.2.7` — biblioteca de UI
- **React DOM** `^19.2.7` — renderização no DOM

### Linguagem

- **TypeScript** `^6.0.3` — tipagem estática

### Build tool

- **Vite** `8.0.16` — bundler e dev server
- **@vitejs/plugin-react** `^6.0.2` — plugin React para Vite

### Gerenciador de pacotes

- **pnpm** — identificado pela presença de `pnpm-workspace.yaml` e `pnpm-lock.yaml`

### Roteamento

- **react-router-dom** `^7.18.0` — roteamento SPA

### Estilização

- **TailwindCSS** `^3.4.19` — framework CSS utilitário
- **tailwindcss-animate** `^1.0.7` — plugin de animações
- **@tailwindcss/typography** `^0.5.20` — plugin de tipografia
- **@tailwindcss/aspect-ratio** `^0.4.2` — plugin de aspect ratio
- **tailwind-merge** `^2.6.1` — merge de classes Tailwind
- **clsx** `^2.1.1` — merge condicional de classes
- **class-variance-authority** `^0.7.1` — variantes de componentes

### UI Components (shadcn/ui)

- **Radix UI** — múltiplos pacotes `@radix-ui/react-*` (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, popover, select, tabs, toast, tooltip, etc.)
- **cmdk** `^1.1.1` — command palette
- **vaul** `^1.1.2` — drawer component
- **sonner** `^2.0.7` — toast notifications
- **lucide-react** `^0.577.0` — ícones
- **input-otp** `^1.4.2` — input OTP

### Formulários e validação

- **react-hook-form** `^7.80.0` — gerenciamento de formulários
- **@hookform/resolvers** `^5.4.0` — resolvers para react-hook-form
- **zod** `^4.4.3` — validação de schemas

### Gráficos

- **recharts** `^3.8.1` — biblioteca de gráficos

### Datas

- **date-fns** `^4.4.0` — manipulação de datas

### Backend

- **PocketBase** `~0.26.9` — SDK cliente para comunicação com o backend Skip Cloud (PocketBase v0.36)

### Outras bibliotecas

- **embla-carousel-react** `^8.6.0` + **embla-carousel-autoplay** `^8.6.0` — carrossel
- **react-resizable-panels** `^3.0.6` — painéis redimensionáveis
- **react-day-picker** `^9.14.0` — seletor de data
- **next-themes** `^0.4.6` — alternância de tema (não utilizado ativamente)

### Ferramentas de desenvolvimento

- **oxlint** `^1.71.0` — linter
- **oxfmt** `^0.56.0` — formatador
- **oxc-parser** `^0.137.0` — parser
- **autoprefixer** `^10.5.0` — pós-processador CSS
- **postcss** `^8.5.15` — transformação CSS

---

## 2. Estrutura do Projeto

### Diretórios principais

| Diretório                | Propósito                                        |
| ------------------------ | ------------------------------------------------ |
| `src/`                   | Código-fonte do frontend React                   |
| `src/pages/`             | Páginas/telas da aplicação                       |
| `src/components/`        | Componentes reutilizáveis                        |
| `src/components/ui/`     | Componentes shadcn/ui (design system base)       |
| `src/hooks/`             | Hooks customizados (auth, toast, realtime, etc.) |
| `src/lib/`               | Utilitários, helpers e configurações             |
| `src/lib/pocketbase/`    | Cliente PocketBase, erros e schema               |
| `src/services/`          | Camada de serviços para acesso a dados           |
| `src/stores/`            | Stores de estado global (Context API)            |
| `src/providers/`         | Providers de injeção de dependência              |
| `src/config/`            | Arquivos de configuração (PWA protegido)         |
| `src/assets/`            | Imagens e assets importados                      |
| `public/`                | Arquivos estáticos servidos diretamente          |
| `pocketbase/`            | Hooks e migrations do backend                    |
| `pocketbase/hooks/`      | Hooks JavaScript do PocketBase                   |
| `pocketbase/migrations/` | Migrations do banco de dados                     |
| `docs/`                  | Documentação do projeto                          |

### Arquivos de entrada

| Arquivo        | Propósito                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `index.html`   | HTML raiz — meta tags, favicon, registro de Service Worker, splash screen                       |
| `src/main.tsx` | Ponto de entrada React — renderiza `<App />`, importa `main.css`, registra Service Worker       |
| `src/App.tsx`  | Componente raiz — configura BrowserRouter, AuthProvider, SessionProvider, todas as rotas        |
| `src/main.css` | Estilos globais — variáveis CSS, classes utilitárias customizadas, componentes do design system |

### Organização de componentes

Os componentes seguem um padrão misto:

- **shadcn/ui** (`src/components/ui/*`) — componentes base do design system (Button, Input, Dialog, etc.)
- **Componentes customizados da aplicação** (`src/components/*`) — AppHeader, AppFooter, AppButton, AppScreen, Layout, etc.
- **Páginas** (`src/pages/*`) — cada tela é um componente default export

### Configuração de roteamento

O roteamento é configurado em `src/App.tsx` usando `BrowserRouter` com `Routes` e `Route` do `react-router-dom`. Existem dois layouts principais:

- `Layout` — para rotas não protegidas (login, registro, seleção de propriedade)
- `ProtectedLayout` — para rotas protegidas que exigem autenticação e propriedade selecionada

Há dois guardas de rota: `ProtectedRoute` (exige autenticação) e `RequireProperty` (exige autenticação + propriedade ativa).

---

## 3. Rotas

| Rota                               | Componente             | Propósito                              | Proteção          | Estado                                  |
| ---------------------------------- | ---------------------- | -------------------------------------- | ----------------- | --------------------------------------- |
| `/`                                | `Login`                | Tela de login inicial                  | Pública           | Funcional                               |
| `/login`                           | `Login`                | Tela de login                          | Pública           | Funcional                               |
| `/forgot-password`                 | `ForgotPassword`       | Recuperação de senha                   | Pública           | Placeholder (exibe mensagem "em breve") |
| `/register`                        | `Register`             | Início do cadastro (consulta CPF)      | Pública           | Funcional                               |
| `/register/resultados`             | `RegisterResultados`   | Resultados da consulta de propriedades | Pública           | Funcional                               |
| `/register/propriedades`           | `RegisterPropriedades` | Nomear propriedades selecionadas       | Pública           | Funcional                               |
| `/register/senha`                  | `RegisterSenha`        | Criar senha de 6 dígitos               | Pública           | Funcional                               |
| `/register/revisao`                | `RegisterRevisao`      | Revisar e confirmar cadastro           | Pública           | Funcional                               |
| `/selecionar-propriedade`          | `SelectProperty`       | Selecionar propriedade ativa           | `ProtectedRoute`  | Funcional                               |
| `/dashboard`                       | `Dashboard`            | Menu principal                         | `RequireProperty` | Funcional                               |
| `/nota-fiscal`                     | `NotaFiscal`           | Menu de nota fiscal (emitir/consultar) | `RequireProperty` | Funcional                               |
| `/configuracoes`                   | `Configuracoes`        | Configurações do app                   | `RequireProperty` | Funcional                               |
| `/estatistica`                     | `Estatistica`          | Estatísticas de vendas                 | `RequireProperty` | Funcional                               |
| `/cadastrar-cliente`               | `CadastrarCliente`     | Cadastro e lista de clientes           | `RequireProperty` | Funcional                               |
| `/emitir-nf`                       | `EmitirNF`             | Seleção de tipo de operação            | `RequireProperty` | Funcional                               |
| `/emitir-leite/selecionar-cliente` | `SelectClient`         | Seleção de cliente para venda de leite | `RequireProperty` | Funcional                               |
| `/emitir-leite`                    | `EmitirLeite`          | Dados do produto (leite)               | `RequireProperty` | Funcional                               |
| `/emitir-leite/next`               | `EmitirLeiteNext`      | Confirmação e emissão da NF de leite   | `RequireProperty` | Funcional                               |
| `/emitir-gado`                     | `EmitirGado`           | Venda de gado                          | `RequireProperty` | Placeholder (página em construção)      |
| `/consultar-nf`                    | `ConsultarNF`          | Lista de notas fiscais emitidas        | `RequireProperty` | Funcional                               |
| `/consultar-nf/:invoiceId`         | `InvoiceDetail`        | Detalhes de uma NF específica          | `RequireProperty` | Funcional                               |
| `/historico`                       | `InvoiceHistory`       | Histórico de notas (alternativa)       | `RequireProperty` | Funcional                               |
| `/perfil`                          | `ProducerProfile`      | Perfil do produtor rural               | `RequireProperty` | Funcional                               |
| `*`                                | `NotFound`             | Página 404                             | Pública           | Funcional                               |

### Observações

- A rota `/` e `/login` carregam o mesmo componente `Login`, o que pode causar redirecionamento duplo.
- O componente `NativeAppShell` gerada restauração de rota e navegação nativa (botão voltar do dispositivo).
- O componente `PwaIntegrityGuard` é renderizado dentro do `App` mas apenas faz `console.log`.

---

## 4. Telas

### 4.1 Login (`src/pages/Login.tsx`)

- **Rota:** `/` e `/login`
- **Componentes usados:** `Logo2A`, `Input`, `Label`, ícones `lucide-react`
- **Funcionalidades implementadas:** Login por CPF + senha (via endpoint customizado `/backend/v1/auth/cpf`), máscara de CPF, validação de CPF, toggle de visibilidade de senha, banner de sucesso pós-cadastro, botão cancelar (limpa sessão e tenta fechar janela)
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Recuperação de senha não implementada (link leva a placeholder)
- **Percentual estimado:** 90% — funcional, falta apenas o fluxo de recuperação de senha

### 4.2 Dashboard (`src/pages/Dashboard.tsx`)

- **Rota:** `/dashboard`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Menu principal com opções "Nota Fiscal" e "Configurações", botões "Cancelar" e "Alterar Propriedade"
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Sem estatísticas resumidas no dashboard; navegação limitada a 2 opções
- **Percentual estimado:** 70% — funcional mas com escopo reduzido

### 4.3 NotaFiscal (`src/pages/NotaFiscal.tsx`)

- **Rota:** `/nota-fiscal`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Menu com opções "Emitir" e "Consultar"
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — tela de menu simples e completa

### 4.4 EmitirNF (`src/pages/EmitirNF.tsx`)

- **Rota:** `/emitir-nf`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Seleção entre "Venda de Leite" e "Venda de Gado"
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Apenas 2 tipos de operação disponíveis
- **Percentual estimado:** 80% — funcional para o escopo atual

### 4.5 EmitirLeite (`src/pages/EmitirLeite.tsx`)

- **Rota:** `/emitir-leite`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Entrada de quantidade e valor unitário com máscara decimal brasileira, cálculo automático de total, exibição de cliente selecionado, alteração de cliente, validação de campos
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — fluxo completo de entrada de dados

### 4.6 EmitirLeiteNext (`src/pages/EmitirLeiteNext.tsx`)

- **Rota:** `/emitir-leite/next`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Revisão de dados, geração de XML NFe, geração de chave de acesso, salvamento no PocketBase, tela de sucesso, validação de campos obrigatórios
- **Funcionalidades simuladas:** Geração de XML NFe (não transmitida para SEFAZ — apenas salva localmente)
- **Pendências:** Sem transmissão real para SEFAZ; sem download de XML/DANFE na tela de sucesso
- **Percentual estimado:** 75% — gera e salva a NF mas não transmite para a SEFAZ

### 4.7 EmitirGado (`src/pages/EmitirGado.tsx`)

- **Rota:** `/emitir-gado`
- **Componentes usados:** `AppScreen`, ícone `Beef`
- **Funcionalidades implementadas:** Nenhuma (placeholder)
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Tela inteira não implementada
- **Percentual estimado:** 5% — apenas placeholder visual

### 4.8 ConsultarNF (`src/pages/ConsultarNF.tsx`)

- **Rota:** `/consultar-nf`
- **Componentes usados:** `AppHeader`, `FormPageLayout`, ícones `lucide-react`
- **Funcionalidades implementadas:** Lista de NFs com busca (número, destinatário, CPF/CNPJ, município), paginação (carregar mais), badges de status, realtime updates, navegação para detalhe
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.9 InvoiceDetail (`src/pages/InvoiceDetail.tsx`)

- **Rota:** `/consultar-nf/:invoiceId`
- **Componentes usados:** `AppHeader`, `FormPageLayout`, `AlertDialog`, ícones `lucide-react`
- **Funcionalidades implementadas:** Exibição de detalhes da NF, download de XML, impressão de DANFE, cancelamento de NF, envio (placeholder), realtime updates
- **Funcionalidades simuladas:** "Enviar" exibe toast informativo ("será implementado em breve")
- **Pendências:** Transmissão para SEFAZ não implementada
- **Percentual estimado:** 85% — visualização e ações implementadas, falta transmissão real

### 4.10 InvoiceHistory (`src/pages/InvoiceHistory.tsx`)

- **Rota:** `/historico`
- **Componentes usados:** `AppHeader`, `BottomNav`, `InvoiceDetailModal`, `Input`
- **Funcionalidades implementadas:** Lista de NFs com busca, modal de detalhes
- **Funcionalidades simuladas:** Modal de detalhes tem botões de download que exibem `alert()`
- **Pendências:** Sobreposição com `ConsultarNF` (telas duplicadas com propósito similar)
- **Percentual estimado:** 70% — funcional mas redundante

### 4.11 SelectProperty (`src/pages/SelectProperty.tsx`)

- **Rota:** `/selecionar-propriedade`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenContent`, `PropertyCard`, `PrimaryButton`, `LoadingOverlay`, `EmptyState`, `ErrorState`, `ScreenTitle`
- **Funcionalidades implementadas:** Lista de propriedades do usuário, seleção, realtime updates, estados de loading/erro/vazio
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.12 SelectClient (`src/pages/SelectClient.tsx`)

- **Rota:** `/emitir-leite/selecionar-cliente`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Lista de clientes com busca, seleção, navegação para cadastro, realtime updates
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.13 Configuracoes (`src/pages/Configuracoes.tsx`)

- **Rota:** `/configuracoes`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Menu com opções (Cadastrar Cliente, Estatísticas, Trocar Propriedade, Histórico, Sair), exibição de propriedade ativa, logout
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 90% — funcional e completa

### 4.14 Estatistica (`src/pages/Estatistica.tsx`)

- **Rota:** `/estatistica`
- **Componentes usados:** `AppScaffold`, `SafeContent`, `AppHeader`, `ScreenTitle`, `ScreenContent`, `PrimaryButton`
- **Funcionalidades implementadas:** Total de notas emitidas, faturamento total, faturamento do mês atual, distribuição por categoria (leite, gado, outros) com barras de progresso
- **Funcionalidades simuladas:** Nenhuma (dados vêm do PocketBase)
- **Pendências:** Sem gráficos interativos (apenas barras CSS); sem filtros de período
- **Percentual estimado:** 75% — funcional mas visualmente básica

### 4.15 CadastrarCliente (`src/pages/CadastrarCliente.tsx`)

- **Rota:** `/cadastrar-cliente`
- **Componentes usados:** `AppHeader`, `ScreenTitle`, `ClientForm`, `ClientList`, `FormPageLayout`
- **Funcionalidades implementadas:** Formulário de cadastro com consulta de CNPJ via SINTEGRA, lista de clientes com edição/exclusão, verificação de duplicidade, realtime updates, suporte a retorno para fluxo de emissão
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.16 Register (`src/pages/Register.tsx`)

- **Rota:** `/register`
- **Componentes usados:** `Logo2A`, `Input`, `Label`, ícones `lucide-react`
- **Funcionalidades implementadas:** Consulta de CPF para localizar cadastro rural, detecção de CPF já cadastrado, navegação para resultados
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.17 RegisterResultados (`src/pages/RegisterResultados.tsx`)

- **Rota:** `/register/resultados`
- **Componentes usados:** `Logo2A`, `Checkbox`, ícones `lucide-react`
- **Funcionalidades implementadas:** Exibição de propriedades encontradas, seleção de propriedades elegíveis, exibição de dados cadastrais, indicadores de mock/cache
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.18 RegisterPropriedades (`src/pages/RegisterPropriedades.tsx`)

- **Rota:** `/register/propriedades`
- **Componentes usados:** `Input`, `Label`, ícone `lucide-react`
- **Funcionalidades implementadas:** Atribuição de nomes às propriedades, validação de nomes (duplicidade, formato, comprimento)
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.19 RegisterSenha (`src/pages/RegisterSenha.tsx`)

- **Rota:** `/register/senha`
- **Componentes usados:** `Input`, `Label`, ícones `lucide-react`
- **Funcionalidades implementadas:** Criação de senha de 6 dígitos, confirmação de senha, validações (sequências, repetições, CPF), toggle de visibilidade
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.20 RegisterRevisao (`src/pages/RegisterRevisao.tsx`)

- **Rota:** `/register/revisao`
- **Componentes usados:** `Logo2A`, `Dialog`, ícones `lucide-react`
- **Funcionalidades implementadas:** Revisão de dados, confirmação via dialog, submissão para o backend, tratamento de erros, redirecionamento para login
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Nenhuma aparente
- **Percentual estimado:** 95% — funcional e completa

### 4.21 ForgotPassword (`src/pages/ForgotPassword.tsx`)

- **Rota:** `/forgot-password`
- **Componentes usados:** `Link`, ícone `lucide-react`
- **Funcionalidades implementadas:** Nenhuma (apenas mensagem informativa)
- **Funcionalidades simuladas:** Nenhuma
- **Pendências:** Funcionalidade inteira não implementada
- **Percentual estimado:** 5% — apenas placeholder visual

### 4.22 ProducerProfile (`src/pages/ProducerProfile.tsx`)

- **Rota:** `/perfil`
- **Componentes usados:** `AppHeader`, `BottomNav`, ícones `lucide-react`
- **Funcionalidades implementadas:** Exibição de dados do usuário (nome, email, CPF), propriedade vinculada, badge de "Produtor Verificado SEFAZ"
- **Funcionalidades simuladas:** Badge "Produtor Verificado SEFAZ" e "Regime Tributário: Isento / Diferido (Rural)" são hardcoded
- **Pendências:** Sem edição de perfil; dados simulados
- **Percentual estimado:** 40% — apenas visualização estática

### 4.23 NotFound (`src/pages/NotFound.tsx`)

- **Rota:** `*`
- **Componentes usados:** Nenhum componente customizado
- **Funcionalidades implementadas:** Página 404 com log de erro
- **Pendências:** Não usa o design system do app (estilo genérico)
- **Percentual estimado:** 50% — funcional mas visualmente inconsistente

---

## 5. Componentes Reutilizáveis

| Componente               | Arquivo                                     | Onde é usado                                                                                                                                                                               | Padronizado | Duplicação                                         |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------- |
| `AppHeader`              | `src/components/AppHeader.tsx`              | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica, ConsultarNF, InvoiceDetail, InvoiceHistory, ProducerProfile, CadastrarCliente | Sim         | Não                                                |
| `AppFooter`              | `src/components/AppFooter.tsx`              | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |
| `AppButton`              | `src/components/AppButton.tsx`              | Não detectado em uso ativo (usado `PrimaryButton` em vez disso)                                                                                                                            | Sim         | Possível duplicação conceitual com `PrimaryButton` |
| `AppButtonGroup`         | `src/components/AppButtonGroup.tsx`         | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |
| `AppScaffold`            | `src/components/AppScaffold.tsx`            | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica                                                                                | Sim         | Não                                                |
| `AppScreen`              | `src/components/AppScreen.tsx`              | EmitirGado                                                                                                                                                                                 | Sim         | Possível duplicação conceitual com `AppScaffold`   |
| `BottomActions`          | `src/components/BottomActions.tsx`          | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |
| `BottomNav`              | `src/components/BottomNav.tsx`              | InvoiceHistory, ProducerProfile                                                                                                                                                            | Sim         | Não                                                |
| `BackButtonGuard`        | `src/components/BackButtonGuard.tsx`        | Layout, ProtectedLayout                                                                                                                                                                    | Sim         | Não                                                |
| `BodyText`               | `src/components/BodyText.tsx`               | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |
| `ClientForm`             | `src/components/ClientForm.tsx`             | CadastrarCliente                                                                                                                                                                           | Sim         | Não                                                |
| `ClientList`             | `src/components/ClientList.tsx`             | CadastrarCliente                                                                                                                                                                           | Sim         | Não                                                |
| `ConfirmationDialog`     | `src/components/ConfirmationDialog.tsx`     | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Possível duplicação com `ExitConfirmationDialog`   |
| `EmptyState`             | `src/components/EmptyState.tsx`             | SelectProperty                                                                                                                                                                             | Sim         | Não                                                |
| `ErrorState`             | `src/components/ErrorState.tsx`             | SelectProperty                                                                                                                                                                             | Sim         | Não                                                |
| `ExitConfirmationDialog` | `src/components/ExitConfirmationDialog.tsx` | BackButtonGuard                                                                                                                                                                            | Sim         | Possível duplicação com `ConfirmationDialog`       |
| `FormPageLayout`         | `src/components/FormPageLayout.tsx`         | ConsultarNF, InvoiceDetail, InvoiceHistory, ProducerProfile, CadastrarCliente                                                                                                              | Sim         | Não                                                |
| `InvoiceActionsBar`      | `src/components/InvoiceActionsBar.tsx`      | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |
| `InvoiceDetailModal`     | `src/components/InvoiceDetailModal.tsx`     | InvoiceHistory                                                                                                                                                                             | Sim         | Não                                                |
| `LoadingOverlay`         | `src/components/LoadingOverlay.tsx`         | SelectProperty                                                                                                                                                                             | Sim         | Não                                                |
| `Logo2A`                 | `src/components/Logo2A.tsx`                 | Login, Register, RegisterResultados, RegisterRevisao                                                                                                                                       | Sim         | Não                                                |
| `MenuPageLayout`         | `src/components/MenuPageLayout.tsx`         | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Possível duplicação com `FormPageLayout`           |
| `NativeAppShell`         | `src/components/NativeAppShell.tsx`         | App.tsx                                                                                                                                                                                    | Sim         | Não                                                |
| `NewInvoiceModal`        | `src/components/NewInvoiceModal.tsx`        | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Código legado/não utilizado                        |
| `OrientationLockOverlay` | `src/components/OrientationLockOverlay.tsx` | NativeAppShell                                                                                                                                                                             | Sim         | Não                                                |
| `PrimaryButton`          | `src/components/PrimaryButton.tsx`          | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica, NotaFiscal                                                                    | Sim         | Possível duplicação conceitual com `AppButton`     |
| `PropertyCard`           | `src/components/PropertyCard.tsx`           | SelectProperty                                                                                                                                                                             | Sim         | Não                                                |
| `PwaDiagnosticOverlay`   | `src/components/PwaDiagnosticOverlay.tsx`   | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Ferramenta de debug                                |
| `PwaIntegrityGuard`      | `src/components/PwaIntegrityGuard.tsx`      | App.tsx                                                                                                                                                                                    | Sim         | Não                                                |
| `SafeContent`            | `src/components/SafeContent.tsx`            | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica                                                                                | Sim         | Não                                                |
| `ScreenContent`          | `src/components/ScreenContent.tsx`          | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica, NotaFiscal                                                                    | Sim         | Não                                                |
| `ScreenTitle`            | `src/components/ScreenTitle.tsx`            | Dashboard, EmitirNF, EmitirLeite, EmitirLeiteNext, SelectProperty, SelectClient, Configuracoes, Estatistica, NotaFiscal, CadastrarCliente                                                  | Sim         | Não                                                |
| `TextButton`             | `src/components/TextButton.tsx`             | Não detectado em uso ativo                                                                                                                                                                 | Sim         | Não                                                |

### Observações sobre duplicação

- `AppButton` e `PrimaryButton` têm propósitos sobrepostos; `PrimaryButton` é o componente efetivamente usado.
- `AppScreen` e `AppScaffold` têm propósitos sobrepostos; `AppScaffold` é o mais utilizado.
- `ConfirmationDialog` e `ExitConfirmationDialog` são variações do mesmo padrão.
- `FormPageLayout` e `MenuPageLayout` são praticamente idênticos (ambos aplicam as mesmas classes CSS).
- `NewInvoiceModal` e `InvoiceActionsBar` não são utilizados em nenhuma página ativa — são código legado.

---

## 6. Design System

### Cores (variáveis CSS em `src/main.css`)

| Token                      | Valor HSL          | Uso                         |
| -------------------------- | ------------------ | --------------------------- |
| `--background`             | `201.7 100% 13.5%` | Fundo principal (`#002C45`) |
| `--foreground`             | `0 0% 100%`        | Texto principal (branco)    |
| `--card`                   | `202 100% 10%`     | Fundo de cards              |
| `--card-foreground`        | `0 0% 100%`        | Texto em cards              |
| `--popover`                | `202 100% 14%`     | Fundo de popovers           |
| `--popover-foreground`     | `0 0% 100%`        | Texto em popovers           |
| `--primary`                | `48 89% 60%`       | Cor primária (dourado)      |
| `--primary-foreground`     | `202 100% 14%`     | Texto sobre primária        |
| `--secondary`              | `202 100% 10%`     | Cor secundária              |
| `--secondary-foreground`   | `0 0% 100%`        | Texto sobre secundária      |
| `--muted`                  | `202 60% 20%`      | Cor muted                   |
| `--muted-foreground`       | `202 20% 70%`      | Texto muted                 |
| `--accent`                 | `48 89% 60%`       | Cor de destaque (dourado)   |
| `--accent-foreground`      | `202 100% 14%`     | Texto sobre accent          |
| `--destructive`            | `0 84.2% 60.2%`    | Cor de erro/destrutivo      |
| `--destructive-foreground` | `0 0% 100%`        | Texto sobre destrutivo      |
| `--border`                 | `202 50% 25%`      | Bordas                      |
| `--input`                  | `202 50% 25%`      | Inputs                      |
| `--ring`                   | `48 89% 60%`       | Ring de foco                |
| `--radius`                 | `1rem`             | Raio de borda padrão        |

### Cores usadas diretamente (hardcoded)

- `#002C45` — azul escuro (fundo principal, usado em múltiplos componentes)
- `#A8914E` — dourado (cor de destaque, bordas, botões)
- `#D4AF37` — dourado claro (gradientes, seleção)
- `#F9E27D` — amarelo claro (textos de destaque)
- `#001f31` — azul mais escuro (fundos de seções, footer)
- `#071C33` — azul escuro (botões secundários)
- `#C89B51` — dourado médio (bordas de botões secundários)
- `#D0A85C` — dourado texto (botões secundários)
- `#3B626B` — azul acinzentado (fundos de telas de registro)

### Fontes

- **Montserrat** — fonte principal (importada do Google Fonts, pesos 400, 500, 600, 700)
- **Playfair Display** — importada mas não detectada em uso ativo
- **Roboto** — importada mas não detectada em uso ativo

### Tamanhos de texto

- Classes utilitárias customizadas: `text-mont-medium` (14px/500), `text-mont-semibold` (16px/600), `text-mont-semibold-lg` (18px/600)
- Tamanhos inline variados (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`)

### Estilos de botão (`src/lib/button-styles.ts`)

- `primaryButtonStyle` — fundo `#A8914E`, texto branco, raio `14px`, altura `56px`, Montserrat 700
- `secondaryButtonStyle` — fundo `#071C33`, borda dourada, texto `#D0A85C`, raio `14px`, altura `56px`

### Classes CSS customizadas (em `src/main.css`)

- `.app-shell` — container principal com `max-width: 28rem`
- `.app-header` — cabeçalho com fundo `#a8914e`, altura `120px`
- `.app-button` — botão base com altura `56px`, raio `14px`, transições
- `.menu-btn` — botão de menu responsivo com `clamp()` para dimensões
- `.form-page` / `.menu-page` — layouts de página com `100dvh`
- `.screen-title` — título de tela centralizado, texto dourado, uppercase
- `.safe-area-*` — paddings para safe areas de dispositivos móveis
- `.bg-gold-gradient` — gradiente dourado

### Inconsistências visuais detectadas

1. **Cores hardcoded vs. tokens CSS** — Muitos componentes usam cores hexadecimais diretamente (`#002C45`, `#A8914E`) em vez das variáveis CSS do Tailwind.
2. **Telas de registro** usam fundo `#3B626B` enquanto telas principais usam `#002C45` — inconsistência de paleta.
3. **NotFound** usa estilo genérico (fundo cinza) não alinhado com o design system.
4. **InvoiceHistory** usa `AppHeader` + `BottomNav` enquanto `ConsultarNF` usa apenas `AppHeader` — layouts inconsistentes para funcionalidades similares.
5. **EmitirGado** usa `AppScreen` enquanto outras telas de emissão usam `AppScaffold` — componentes diferentes para o mesmo propósito.
6. **Fontes não utilizadas** (Playfair Display, Roboto) são carregadas sem necessidade, impactando performance.

---

## 7. PWA

### Manifest (`public/manifest.json`)

| Propriedade        | Valor                                                  | Status       |
| ------------------ | ------------------------------------------------------ | ------------ |
| `id`               | `/`                                                    | Implementado |
| `name`             | `2A Rural`                                             | Implementado |
| `short_name`       | `2A Rural`                                             | Implementado |
| `description`      | `Emissor de documentos fiscais para produtores rurais` | Implementado |
| `start_url`        | `/`                                                    | Implementado |
| `scope`            | `/`                                                    | Implementado |
| `display`          | `standalone`                                           | Implementado |
| `display_override` | `["standalone", "minimal-ui"]`                         | Implementado |
| `orientation`      | `portrait`                                             | Implementado |
| `theme_color`      | `#002C45`                                              | Implementado |
| `background_color` | `#002C45`                                              | Implementado |
| `categories`       | `["business", "productivity", "finance"]`              | Implementado |
| `icons`            | 192x192 e 512x512 PNG, purpose `any maskable`          | Implementado |

### Service Worker (`public/sw.js`)

| Aspecto                 | Detalhe                                                            | Status       |
| ----------------------- | ------------------------------------------------------------------ | ------------ |
| Versão do cache         | `2a-rural-v16`                                                     | Implementado |
| Precache                | `/`, `/index.html`, ícones, manifest                               | Implementado |
| Estratégia de navegação | Network-first com fallback para cache                              | Implementado |
| Estratégia de assets    | Cache-first com atualização em background (stale-while-revalidate) | Implementado |
| Limpeza de cache antigo | Remove todos os caches com nome diferente na ativação              | Implementado |
| Página offline          | HTML inline com mensagem "Você está offline"                       | Implementado |
| `SKIP_WAITING`          | Suportado via `message` event                                      | Implementado |
| `clients.claim()`       | Chamado na ativação                                                | Implementado |

### Registro do Service Worker

| Local          | Detalhe                             | Status                                       |
| -------------- | ----------------------------------- | -------------------------------------------- |
| `index.html`   | `<script>` inline registra `/sw.js` | Implementado                                 |
| `src/main.tsx` | Registro adicional no evento `load` | Implementado (duplo registro — ver Seção 13) |

### Funcionalidades PWA adicionais

| Funcionalidade                | Status                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Orientação travada em retrato | Implementado (via `useOrientationLock` hook + overlay)                              |
| Diagnóstico PWA               | Implementado (`PwaDiagnosticOverlay`, `pwa-diagnostics.ts`) — não ativo em produção |
| Verificação de integridade    | Implementado (`PwaIntegrityGuard`, `pwa-integrity-check.ts`) — apenas `console.log` |
| Arquivos protegidos           | Documentado em `docs/INFRAESTRUTURA_PWA.md` e `src/config/pwa-protected-files.ts`   |
| Comportamento offline real    | Não foi possível verificar — depende de teste em ambiente offline real              |

### Meta tags PWA em `index.html`

- `theme-color`: `#002C45` — Implementado
- `mobile-web-app-capable`: `yes` — Implementado
- `apple-mobile-web-app-capable`: `yes` — Implementado
- `apple-mobile-web-app-status-bar-style`: `black-translucent` — Implementado
- `apple-mobile-web-app-title`: `2A Rural` — Implementado
- Favicon: `/2ARural192x192.png` — Implementado
- Apple touch icon: `/2ARural512x512.png` — Implementado
- OG image: `/2ARural512x512.png` — Implementado
- Manifest: `/manifest.json` — Implementado
- Splash screen: div com logo centralizado — Implementado

---

## 8. Autenticação e Segurança

### Fluxo de login

- **Método principal:** Login por CPF + senha numérica de 6 dígitos
- **Endpoint customizado:** `POST /backend/v1/auth/cpf` (hook `auth_cpf.js`)
- **Fluxo:** O hook busca o usuário por CPF no PocketBase, valida a senha com `user.validatePassword(password)`, e retorna um token de autenticação via `$apis.recordAuthResponse(e, user)`
- **SDK:** O frontend usa `pb.send()` para chamar o endpoint e `pb.authStore.save()` para armazenar o token

### Fluxo de logout

- Implementado em `useLogout` hook (`src/hooks/use-logout.tsx`)
- Chama `signOut()` (limpa `pb.authStore`), `clearSession()` (limpa estado + localStorage), limpa `sessionStorage`, remove chaves específicas do `localStorage` (`pb_auth`, `2a_rural_active_property`)
- Navega para `/login`

### Gerenciamento de sessão

- **AuthProvider** (`src/hooks/use-auth.tsx`) — Context API com estado de usuário, `isAuthenticated`, `loading`
- **SessionProvider** (`src/stores/session.tsx`) — Context API com propriedade ativa, cliente selecionado, rascunho de NF, tipo de operação
- **Persistência:** `localStorage` para propriedade ativa (`2a_rural_active_property`) e estado de operação (`2a_rural_operation_state`)

### Armazenamento de token

- PocketBase SDK armazena o token JWT em `localStorage` (chave `pb_auth`)
- O token é anexado automaticamente às requisições via `pb.send()` e métodos do SDK

### Proteção de rotas

- `ProtectedRoute` — exige `isAuthenticated` (baseado em `pb.authStore.isValid`, não apenas `!!user`)
- `RequireProperty` — exige `isAuthenticated` + `activeProperty` definida
- `NativeAppShell` — gerencia restauração de rota e redirecionamento pós-login

### Tratamento de expiração

- `AuthProvider` tenta `pb.collection('users').authRefresh()` na inicialização
- Em caso de falha, limpa o `authStore` e define `isAuthenticated = false`
- `pb.authStore.onChange()` monitora mudanças no estado de autenticação

### Dados sensíveis

- CPF é tratado com máscara parcial em telas de revisão (`maskCpfPartial`)
- Senhas não são logadas ou expostas
- O hook `auth_cpf.js` não loga CPF ou senha

### Variáveis de ambiente

- `VITE_POCKETBASE_URL` — URL do backend PocketBase (em `.env`)
- Secrets do backend: `PB_INSTANCE_URL`, `PB_SUPERUSER_TOKEN`, `SITE_URL`, `SKIP_AI_GATEWAY_API_KEY`, `SKIP_AI_GATEWAY_URL`, `PRODUTOR_RURAL_DEFAULT_UF`, `SINTEGRA_API_BASE_URL`, `SINTEGRA_API_KEY`

### Certificado digital

- Não foi possível verificar — não há código relacionado a certificado digital A1/A3 no código-fonte

### Riscos de segurança detectados

1. **Filtro de CPF com string concatenation** no hook `auth_cpf.js`: `"cpf = '" + cpf + "'"` — vulnerável a injection se o CPF não for sanitizado (embora o frontend faça `replace(/\D/g, '')`, o backend deveria validar independentemente)
2. **Rate limiting** implementado apenas no hook `consultar_propriedades.js` (por CPF e IP), mas não no hook `auth_cpf.js` — risco de brute force
3. **Senha mínima de 6 dígitos** — baixa complexidade para aplicativo financeiro

---

## 9. APIs e Integrações

### Endpoints customizados (hooks PocketBase)

| Endpoint                                      | Método | Hook                         | Propósito                             | Autenticação   |
| --------------------------------------------- | ------ | ---------------------------- | ------------------------------------- | -------------- |
| `/backend/v1/auth/cpf`                        | POST   | `auth_cpf.js`                | Login por CPF + senha                 | Pública        |
| `/backend/v1/cadastro/consultar-propriedades` | POST   | `consultar_propriedades.js`  | Consultar propriedades rurais por CPF | Pública        |
| `/backend/v1/cadastro/concluir-cadastro`      | POST   | `concluir_cadastro.js`       | Concluir cadastro de produtor         | Pública        |
| `/backend/v1/destinatarios/consultar-cnpj`    | POST   | `consultar_cnpj_sintegra.js` | Consultar CNPJ via SINTEGRA           | Auth requerida |
| `/backend/v1/consultar-cnpj/{cnpj}`           | GET    | `consultar_cnpj.js`          | Consultar CNPJ via BrasilAPI          | Auth requerida |
| `/backend/v1/invoices/next-number`            | GET    | `next_invoice_number.js`     | Obter próximo número de NF            | Auth requerida |

### APIs externas

| API                     | Hook                                                      | Propósito                         | Status                                                                         |
| ----------------------- | --------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| SINTEGRA (Sintegra API) | `consultar_propriedades.js`, `consultar_cnpj_sintegra.js` | Consulta de produtor rural e CNPJ | Implementado (depende de secrets `SINTEGRA_API_BASE_URL` e `SINTEGRA_API_KEY`) |
| BrasilAPI               | `consultar_cnpj.js`                                       | Consulta de CNPJ                  | Implementado (fallback, não usado ativamente no frontend)                      |

### Chamadas PocketBase SDK (CRUD direto)

| Coleção        | Operação                                      | Service                        | Status       |
| -------------- | --------------------------------------------- | ------------------------------ | ------------ |
| `invoices`     | List, Get, Create, Update, Delete             | `src/services/invoices.ts`     | Implementado |
| `propriedades` | List                                          | `src/services/propriedades.ts` | Implementado |
| `clientes`     | List, Create, Update, Delete, Check duplicate | `src/services/clientes.ts`     | Implementado |
| `users`        | Create, AuthWithPassword, AuthRefresh         | `src/hooks/use-auth.tsx`       | Implementado |

### Dados mock/simulados

| Local                       | Descrição                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `consultar_propriedades.js` | Dados mock para CPFs específicos (11111111111, 22222222222, etc.) quando SINTEGRA não está configurado |
| `NewInvoiceModal.tsx`       | Componente não utilizado com dados hardcoded (Cooperativa, Frigorífico, etc.)                          |
| `InvoiceDetailModal.tsx`    | Chave de acesso fallback hardcoded                                                                     |
| `ProducerProfile.tsx`       | Badge "Produtor Verificado SEFAZ" e "Regime Tributário" hardcoded                                      |

### Padrões de tratamento de erro

| Padrão                      | Local                                         | Descrição                                                         |
| --------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| `try/catch` com toast       | `CadastrarCliente.tsx`, `EmitirLeiteNext.tsx` | Captura erro, exibe toast via `sonner`                            |
| `extractFieldErrors`        | `src/lib/pocketbase/errors.ts`                | Extrai erros por campo de `ClientResponseError`                   |
| `getErrorMessage`           | `src/lib/pocketbase/errors.ts`                | Extrai mensagem de erro legível                                   |
| Hooks PocketBase            | `auth_cpf.js`, etc.                           | Retornam JSON com `{ error, message }` e códigos HTTP apropriados |
| `consultar_propriedades.js` | Logging estruturado via `$app.logger()`       | Registra resultados, erros e métricas                             |

### Integrações pendentes

- **Transmissão para SEFAZ** — Não implementada. O XML é gerado mas não transmitido.
- **Focus NFe** — Mencionado em `docs/INFRAESTRUTURA_PWA.md` mas não há código relacionado.
- **Certificado digital** — Não implementado.

---

## 10. Banco de Dados e Persistência

### Coleções PocketBase

#### `users` (auth)

| Campo                         | Tipo     | Obrigatório | Descrição                         |
| ----------------------------- | -------- | ----------- | --------------------------------- |
| `name`                        | text     | Não         | Nome do usuário                   |
| `avatar`                      | file     | Não         | Avatar                            |
| `cpf`                         | text     | Sim         | CPF (único)                       |
| `cadastro_concluido`          | bool     | Não         | Flag de cadastro completo         |
| `senha_hash`                  | text     | Não         | Hash de senha (legado)            |
| `data_cadastro_concluido`     | date     | Não         | Data de conclusão do cadastro     |
| `data_criacao_senha`          | date     | Não         | Data de criação da senha          |
| `data_ultima_alteracao_senha` | date     | Não         | Data da última alteração de senha |
| `created`                     | autodate | —           | Criado em                         |
| `updated`                     | autodate | —           | Atualizado em                     |

**Índices:** `idx_tokenKey__pb_users_auth_` (unique), `idx_email__pb_users_auth_` (unique), `idx_users_cpf` (unique)
**Regras de acesso:** list/view/update/delete limitados ao próprio usuário; create é público

#### `invoices` (base)

| Campo                | Tipo                                           | Obrigatório | Descrição                 |
| -------------------- | ---------------------------------------------- | ----------- | ------------------------- |
| `user_id`            | relation→users                                 | Sim         | Usuário proprietário      |
| `number`             | text                                           | Sim         | Número da NF              |
| `series`             | text                                           | Sim         | Série da NF               |
| `producer_name`      | text                                           | Sim         | Nome do produtor          |
| `cpf_cnpj`           | text                                           | Sim         | CPF/CNPJ do produtor      |
| `ie_number`          | text                                           | Não         | Inscrição estadual        |
| `recipient_name`     | text                                           | Sim         | Nome do destinatário      |
| `recipient_document` | text                                           | Sim         | Documento do destinatário |
| `operation_type`     | select(saida/entrada)                          | Sim         | Tipo de operação          |
| `total_value`        | number                                         | Sim         | Valor total               |
| `status`             | select(emitida/processando/cancelada/rascunho) | Sim         | Status da NF              |
| `chavenfe`           | text                                           | Não         | Chave de acesso da NF     |
| `items_summary`      | text                                           | Não         | Resumo dos itens          |
| `municipio`          | text                                           | Não         | Município                 |
| `created`            | autodate                                       | —           | Criado em                 |
| `updated`            | autodate                                       | —           | Atualizado em             |

**Índices:** `idx_invoices_user`, `idx_invoices_status`
**Regras de acesso:** Todos os métodos exigem autenticação (`@request.auth.id != ''`)

#### `propriedades` (base)

| Campo                | Tipo           | Obrigatório | Descrição                    |
| -------------------- | -------------- | ----------- | ---------------------------- |
| `usuario_id`         | relation→users | Sim         | Usuário proprietário         |
| `nome`               | text           | Sim         | Nome da propriedade          |
| `nome_normalizado`   | text           | Sim         | Nome normalizado (lowercase) |
| `inscricao_estadual` | text           | Sim         | IE da propriedade            |
| `situacao_ie`        | text           | Não         | Situação da IE               |
| `tipo_ie`            | text           | Não         | Tipo da IE                   |
| `municipio`          | text           | Não         | Município                    |
| `codigo_ibge`        | text           | Não         | Código IBGE                  |
| `uf`                 | text           | Não         | UF                           |
| `endereco`           | text           | Não         | Endereço                     |
| `numero`             | text           | Não         | Número                       |
| `bairro`             | text           | Não         | Bairro                       |
| `cep`                | text           | Não         | CEP                          |
| `cnae`               | text           | Não         | CNAE                         |
| `tipo_produtor`      | text           | Não         | Tipo de produtor             |
| `ativo`              | bool           | Não         | Propriedade ativa            |
| `created`            | autodate       | —           | Criado em                    |
| `updated`            | autodate       | —           | Atualizado em                |

**Índices:** `idx_prop_usuario_nome` (unique: usuario_id + nome_normalizado), `idx_prop_usuario_ie` (unique: usuario_id + inscricao_estadual), `idx_prop_usuario_id`
**Regras de acesso:** list/view/update/delete limitados ao proprietário; create exige autenticação

#### `consultas` (base)

| Campo                   | Tipo     | Obrigatório | Descrição                        |
| ----------------------- | -------- | ----------- | -------------------------------- |
| `cpf`                   | text     | Sim         | CPF consultado                   |
| `consulta_id`           | text     | Sim         | ID único da consulta             |
| `resultado_json`        | text     | Sim         | Resultado completo em JSON       |
| `resultado_normalizado` | text     | Não         | Resultado normalizado            |
| `utilizada`             | bool     | Não         | Se a consulta já foi utilizada   |
| `uf_consultada`         | text     | Não         | UF consultada                    |
| `nome`                  | text     | Não         | Nome do consultado               |
| `origem`                | text     | Não         | Origem dos dados (sintegra/mock) |
| `origem_cache`          | bool     | Não         | Se veio de cache                 |
| `data_expiracao`        | date     | Não         | Data de expiração                |
| `ip_origem`             | text     | Não         | IP de origem                     |
| `created`               | autodate | —           | Criado em                        |
| `updated`               | autodate | —           | Atualizado em                    |

**Índices:** `idx_consultas_id` (unique), `idx_consultas_cpf`
**Regras de acesso:** Todas `null` (apenas superusuários)

#### `clientes` (base)

| Campo                | Tipo                    | Obrigatório | Descrição            |
| -------------------- | ----------------------- | ----------- | -------------------- |
| `user_id`            | relation→users          | Sim         | Usuário proprietário |
| `tipo_pessoa`        | select(FISICA/JURIDICA) | Sim         | Tipo de pessoa       |
| `cpf_cnpj`           | text                    | Sim         | CPF/CNPJ             |
| `nome_razao_social`  | text                    | Sim         | Nome/Razão social    |
| `nome_fantasia`      | text                    | Não         | Nome fantasia        |
| `indicador_ie`       | text                    | Não         | Indicador da IE      |
| `inscricao_estadual` | text                    | Não         | IE                   |
| `tipo_ie`            | text                    | Não         | Tipo da IE           |
| `cep`                | text                    | Não         | CEP                  |
| `logradouro`         | text                    | Não         | Logradouro           |
| `numero`             | text                    | Não         | Número               |
| `complemento`        | text                    | Não         | Complemento          |
| `bairro`             | text                    | Não         | Bairro               |
| `municipio`          | text                    | Não         | Município            |
| `codigo_ibge`        | text                    | Não         | Código IBGE          |
| `uf`                 | text                    | Não         | UF                   |
| `pais`               | text                    | Não         | País                 |
| `codigo_pais`        | text                    | Não         | Código do país       |
| `telefone`           | text                    | Não         | Telefone             |
| `email`              | text                    | Não         | E-mail               |
| `created`            | autodate                | —           | Criado em            |
| `updated`            | autodate                | —           | Atualizado em        |

**Índices:** `idx_clientes_user_cpf_cnpj` (unique: user_id + cpf_cnpj)
**Regras de acesso:** list/view/update/delete limitados ao proprietário; create exige autenticação

### Migrations existentes

| #    | Arquivo                          | Descrição                                    | Status   |
| ---- | -------------------------------- | -------------------------------------------- | -------- |
| 0001 | `seed_admin.js`                  | Cria usuário admin inicial                   | Aplicada |
| 0002 | `create_invoices.js`             | Cria coleção `invoices`                      | Aplicada |
| 0003 | `seed_invoices.js`               | Popula invoices com dados de exemplo         | Aplicada |
| 0004 | `add_cpf_field.js`               | Adiciona campo `cpf` aos users               | Aplicada |
| 0005 | `add_cadastro_fields.js`         | Adiciona campos de cadastro aos users        | Aplicada |
| 0006 | `create_propriedades.js`         | Cria coleção `propriedades`                  | Aplicada |
| 0007 | `create_consultas.js`            | Cria coleção `consultas`                     | Aplicada |
| 0008 | `set_password_min_length.js`     | Define senha mínima de 6 caracteres          | Aplicada |
| 0009 | `update_consultas_fields.js`     | Adiciona campos à coleção `consultas`        | Aplicada |
| 0010 | `add_usuario_id_index.js`        | Adiciona índice a `propriedades`             | Aplicada |
| 0011 | `add_property_address_fields.js` | Adiciona campos de endereço a `propriedades` | Aplicada |
| 0012 | `create_clientes.js`             | Cria coleção `clientes`                      | Aplicada |
| 0013 | `add_invoices_municipio.js`      | Adiciona campo `municipio` a `invoices`      | Aplicada |
| 0014 | `add_clientes_tipo_ie.js`        | Adiciona campo `tipo_ie` a `clientes`        | Aplicada |

### Uso de localStorage

| Chave                      | Propósito                                        | Local de escrita      | Local de leitura  |
| -------------------------- | ------------------------------------------------ | --------------------- | ----------------- |
| `pb_auth`                  | Token de autenticação PocketBase                 | PocketBase SDK        | PocketBase SDK    |
| `2a_rural_active_property` | Propriedade ativa selecionada                    | `SessionProvider`     | `SessionProvider` |
| `2a_rural_operation_state` | Estado de operação em andamento (rascunho de NF) | `SessionProvider`     | `SessionProvider` |
| `2a_rural_last_route`      | Última rota acessada (para restauração)          | `useNativeNavigation` | `NativeAppShell`  |

### Dados de seed (simulados)

- Usuário admin: `alexandre@2asolucoescorporativas.com.br` / `Skip@Pass`
- 3 invoices de exemplo (milho, gado, leite) com dados fictícios
- Dados mock para CPFs específicos no hook de consulta de propriedades

---

## 11. Funcionalidades

| Funcionalidade                 | Estado                    | Detalhes                                                                                                               |
| ------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Splash Screen**              | Implementado              | Div com logo centralizado em `index.html`, substituído pelo React ao carregar                                          |
| **Login**                      | Implementado              | Login por CPF + senha, validação, máscara, toggle de senha                                                             |
| **Seleção de Propriedade**     | Implementado              | Lista de propriedades do usuário, seleção única, persistência em localStorage                                          |
| **Menu Principal (Dashboard)** | Implementado              | Menu com Nota Fiscal e Configurações                                                                                   |
| **Emissão de NF — Leite**      | Implementado parcialmente | Fluxo completo de seleção de cliente, entrada de dados, geração de XML e salvamento. **Falta:** transmissão para SEFAZ |
| **Emissão de NF — Gado**       | Não implementado          | Apenas placeholder visual                                                                                              |
| **Emissão de NF — Genérica**   | Não implementado          | `NewInvoiceModal` existe mas não é utilizado                                                                           |
| **Consulta de NF**             | Implementado              | Lista com busca, paginação, detalhes, download XML, DANFE, cancelamento                                                |
| **Cancelamento de NF**         | Implementado              | Altera status para `cancelada` via PocketBase                                                                          |
| **Envio/Transmissão de NF**    | Não implementado          | Botão "Enviar" exibe toast informativo                                                                                 |
| **Cadastro de Cliente**        | Implementado              | Formulário com consulta CNPJ via SINTEGRA, validação, CRUD completo                                                    |
| **Estatísticas**               | Implementado parcialmente | Total de notas, faturamento, distribuição por categoria. Sem gráficos interativos                                      |
| **Configurações**              | Implementado              | Menu de configurações com acesso a clientes, estatísticas, troca de propriedade, histórico, logout                     |
| **Logout**                     | Implementado              | Limpa sessão, authStore, localStorage, sessionStorage                                                                  |
| **Recuperação de Senha**       | Não implementado          | Apenas placeholder                                                                                                     |
| **Cadastro de Produtor**       | Implementado              | Fluxo completo: consulta CPF → seleciona propriedades → nomeia → cria senha → revisa → confirma                        |
| **Recuperação de Sessão**      | Implementado              | Restauração de propriedade ativa e operação em andamento via localStorage                                              |
| **Navegação (botão voltar)**   | Implementado              | Interceptação de `popstate`, modal de confirmação de saída, bloqueio em operações fiscais                              |
| **Cancelamento de Operação**   | Implementado              | Botões de cancelar em cada etapa do fluxo de emissão                                                                   |
| **Realtime**                   | Implementado              | Atualização em tempo real de invoices, propriedades e clientes via SSE                                                 |
| **Orientação (portrait lock)** | Implementado              | Hook `useOrientationLock` + overlay de aviso                                                                           |
| **PWA (instalação)**           | Implementado              | Manifest, Service Worker, ícones, meta tags                                                                            |
| **Modo Offline**               | Parcialmente implementado | Service Worker com cache, mas comportamento real offline não foi possível verificar                                    |
| **Certificado Digital**        | Não implementado          | Não há código relacionado                                                                                              |
| **Integração SEFAZ**           | Não implementado          | XML é gerado mas não transmitido                                                                                       |

---

## 12. Qualidade do Código

### Duplicação de código

| Item                                             | Descrição                                                                     | Severidade |
| ------------------------------------------------ | ----------------------------------------------------------------------------- | ---------- |
| `AppButton` vs `PrimaryButton`                   | Dois sistemas de botão com propósito sobreposto                               | Média      |
| `AppScreen` vs `AppScaffold`                     | Dois componentes de scaffold com propósito sobreposto                         | Média      |
| `FormPageLayout` vs `MenuPageLayout`             | Classes CSS praticamente idênticas                                            | Baixa      |
| `ConfirmationDialog` vs `ExitConfirmationDialog` | Padrão de dialog duplicado                                                    | Baixa      |
| `ConsultarNF` vs `InvoiceHistory`                | Telas com propósito sobreposto (lista de NFs)                                 | Alta       |
| `InvoiceDetailModal` vs `InvoiceDetail`          | Modal e página com propósito sobreposto                                       | Média      |
| Estilos inline repetidos                         | `style={{ backgroundColor: '#A8914E' }}` repetido em múltiplas telas          | Baixa      |
| Padding de footer repetido                       | `style={{ paddingTop: '24px', paddingBottom: '24px', gap: '16px' }}` repetido | Baixa      |

### Componentes grandes

| Componente                   | Linhas (estimado) | Observação                                                                 |
| ---------------------------- | ----------------- | -------------------------------------------------------------------------- |
| `ClientForm.tsx`             | ~300+             | Componente complexo com lógica de consulta, formulário e múltiplos estados |
| `concluir_cadastro.js`       | ~300+             | Hook com múltiplas validações e lógica de transação                        |
| `consultar_propriedades.js`  | ~400+             | Hook extenso com rate limiting, mock data, normalização                    |
| `consultar_cnpj_sintegra.js` | ~250+             | Hook com normalização complexa de dados                                    |
| `EmitirLeiteNext.tsx`        | ~200+             | Página com lógica de emissão e múltiplos estados de UI                     |

### Código não utilizado (legado)

| Arquivo                                | Observação                                                          |
| -------------------------------------- | ------------------------------------------------------------------- |
| `NewInvoiceModal.tsx`                  | Componente não referenciado em nenhuma página ativa                 |
| `InvoiceActionsBar.tsx`                | Componente não referenciado em nenhuma página ativa                 |
| `AppButton.tsx` / `AppButtonGroup.tsx` | Substituído por `PrimaryButton`                                     |
| `AppFooter.tsx`                        | Não referenciado em uso ativo                                       |
| `BottomActions.tsx`                    | Não referenciado em uso ativo                                       |
| `BodyText.tsx`                         | Não referenciado em uso ativo                                       |
| `TextButton.tsx`                       | Não referenciado em uso ativo                                       |
| `MenuPageLayout.tsx`                   | Não referenciado em uso ativo                                       |
| `PwaDiagnosticOverlay.tsx`             | Ferramenta de debug, não usada em produção                          |
| `Index.tsx`                            | Página de exemplo do template, não roteada                          |
| `consultar_cnpj.js`                    | Hook alternativo usando BrasilAPI, não usado ativamente no frontend |
| `src/assets/`                          | Múltiplas imagens antigas não utilizadas                            |

### Inconsistências

| Item                  | Descrição                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Nomenclatura de rotas | `/consultar-nf` vs `/historico` para funcionalidades similares                                     |
| Padrão de export      | Páginas usam `export default`, componentes usam `export function` (correto)                        |
| Estilos               | Mistura de classes Tailwind, estilos inline, e classes CSS customizadas                            |
| Tipagem               | `user: any` no `AuthContext` — sem interface tipada para usuário                                   |
| Imports               | Alguns componentes importam de `@/components/ui/*` (shadcn) e outros usam componentes customizados |
| Hooks deCPF           | `maskCpf` em `src/lib/cpf-utils.ts` e validação separada — não unificada                           |

### Riscos técnicos

| Risco                            | Descrição                                                                       | Severidade |
| -------------------------------- | ------------------------------------------------------------------------------- | ---------- |
| SQL Injection em hooks           | `auth_cpf.js` concatena CPF em string de filtro                                 | Alta       |
| Ausência de Error Boundary       | Não há ErrorBoundary no React — erros não tratados podem quebrar a tela inteira | Alta       |
| Duplo registro de Service Worker | Registrado em `index.html` e `main.tsx`                                         | Baixa      |
| Senha de 6 dígitos               | Baixa entropia para aplicativo financeiro                                       | Média      |
| Sem rate limiting no login       | `auth_cpf.js` não tem proteção contra brute force                               | Alta       |
| Token JWT em localStorage        | Vulnerável a XSS                                                                | Média      |
| `user: any` no contexto          | Perde benefícios de tipagem                                                     | Baixa      |

### Necessidades de refatoração

1. Unificar componentes duplicados (`AppButton`/`PrimaryButton`, `AppScreen`/`AppScaffold`, etc.)
2. Remover código legado não utilizado
3. Consolidar `ConsultarNF` e `InvoiceHistory` em uma única tela
4. Adicionar ErrorBoundary
5. Tipar o usuário no `AuthContext`
6. Extrair estilos inline repetidos em classes CSS ou constantes
7. Sanitizar entradas nos hooks do PocketBase (usar `pb.filter()` em vez de concatenação)
8. Remover fontes não utilizadas (Playfair Display, Roboto)

---

## 13. Erros e Itens Pendentes

### Bugs conhecidos

| Bug                               | Descrição                                                                   | Arquivo                              |
| --------------------------------- | --------------------------------------------------------------------------- | ------------------------------------ |
| Duplo registro de Service Worker  | O SW é registrado tanto em `index.html` quanto em `main.tsx`                | `index.html`, `src/main.tsx`         |
| `createInvoice` com `user_id: ''` | No `NewInvoiceModal.tsx` (não utilizado), `user_id` é passado vazio         | `src/components/NewInvoiceModal.tsx` |
| Rota `/` duplicada                | Tanto `/` quanto `/login` carregam `Login`, podendo causar conflito de rota | `src/App.tsx`                        |
| `InvoiceHistory` sem realtime     | Diferente de `ConsultarNF`, não usa `useRealtime`                           | `src/pages/InvoiceHistory.tsx`       |

### Implementações incompletas

| Item                 | Descrição                                        |
| -------------------- | ------------------------------------------------ |
| Venda de Gado        | Tela inteira é placeholder                       |
| Recuperação de Senha | Apenas placeholder visual                        |
| Transmissão SEFAZ    | XML é gerado mas não transmitido                 |
| Envio de NF          | Botão "Enviar" exibe apenas toast                |
| Perfil do Produtor   | Dados hardcoded (badge, regime tributário)       |
| NotFound             | Não usa design system do app                     |
| Estatísticas         | Sem gráficos interativos, sem filtros de período |

### Features apenas visuais

| Item                                             | Descrição                           |
| ------------------------------------------------ | ----------------------------------- |
| Badge "Produtor Verificado SEFAZ"                | Hardcoded em `ProducerProfile.tsx`  |
| "Regime Tributário: Isento / Diferido"           | Hardcoded em `ProducerProfile.tsx`  |
| Botão "Enviar" em `InvoiceDetail`                | Apenas toast informativo            |
| `PwaIntegrityGuard`                              | Apenas `console.log`, sem ação real |
| Chave de acesso fallback em `InvoiceDetailModal` | Hardcoded                           |

### Dependências externas

| Dependência             | Status                                                          | Risco                                                                |
| ----------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| SINTEGRA API            | Configurada via secrets                                         | Se indisponível, consulta de propriedades falha (fallback para mock) |
| BrasilAPI               | Disponível publicamente                                         | Não usada ativamente no frontend                                     |
| PocketBase (Skip Cloud) | Hospedado em `tela-inicial-2a-4c818.shrd00.internal.goskip.dev` | Dependência crítica do backend                                       |

### Decisões necessárias

1. **ConsultarNF vs InvoiceHistory** — Qual manter? Consolidar em uma única tela.
2. **Emissão de NF genérica** — O `NewInvoiceModal` deve ser integrado ou removido?
3. **Transmissão SEFAZ** — Qual provedor usar? (Focus NFe mencionado mas não implementado)
4. **Certificado digital** — Como lidar com certificado A1/A3 no frontend?
5. **Venda de Gado** — Quando e como implementar?
6. **Componentes duplicados** — Qual padrão adotar como definitivo?

---

## 14. Percentuais de Evolução

| Área                  | Percentual | Justificativa                                                                                                                                                                                                                                            |
| --------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquitetura**       | 80%        | A árvore de componentes e o roteamento são bem estruturados. Há separação clara entre pages, components, hooks, services e stores. No entanto, não há ErrorBoundary, há componentes duplicados e código legado não utilizado.                            |
| **PWA**               | 90%        | Manifest, Service Worker, ícones, meta tags e orientação lock estão implementados e documentados. Há proteção de arquivos e diagnóstico. Falta apenas verificar comportamento offline real e remover o duplo registro de SW.                             |
| **Interface**         | 75%        | O design system está definido com cores, fontes e componentes, mas há inconsistências (cores hardcoded vs tokens, telas com paletas diferentes, fontes não utilizadas carregadas). A maioria das telas é visualmente polida.                             |
| **Navegação**         | 85%        | O roteamento é completo com guards adequados. A interceptação do botão voltar e a restauração de rota estão implementadas. Há redundância entre ConsultarNF e InvoiceHistory.                                                                            |
| **Autenticação**      | 70%        | Login por CPF funciona, há refresh de token e proteção de rotas. No entanto, não há rate limiting no login, a senha é de apenas 6 dígitos, não há recuperação de senha, e o filtro CPF no hook é vulnerável a injection.                                 |
| **Banco de Dados**    | 85%        | Todas as coleções necessárias estão criadas com índices apropriados e regras de acesso. Há 14 migrations aplicadas. Faltam índices em alguns campos de busca e a coleção `consultas` não tem regras de acesso para usuários.                             |
| **Integração Fiscal** | 30%        | O XML da NFe é gerado corretamente com todos os campos necessários, a chave de acesso é calculada, e a NF é salva no banco. No entanto, não há transmissão para SEFAZ, não há certificado digital, e o DANFE é simplificado.                             |
| **Regras de Negócio** | 65%        | O fluxo de venda de leite está completo (seleção de cliente, entrada de dados, emissão). O cadastro de produtor está completo. No entanto, venda de gado não existe, não há gestão de estoque, não há relatórios avançados.                              |
| **Testes**            | 0%         | Não há testes unitários, de integração ou E2E. O script `test` apenas exibe uma mensagem e retorna 0.                                                                                                                                                    |
| **Geral**             | 65%        | O aplicativo é funcional para o fluxo principal (cadastro, login, seleção de propriedade, emissão de NF de leite, consulta de NF). As principais lacunas são: transmissão SEFAZ, venda de gado, recuperação de senha, testes e limpeza de código legado. |

---

## 15. Próximos Passos

### Prioridade 1 — Correções de bugs e segurança

1. **Corrigir SQL injection no hook `auth_cpf.js`** — Usar `$app.findFirstRecordByFilter` com parâmetros bind em vez de concatenação de string
2. **Adicionar rate limiting no login** — Limitar tentativas por CPF e IP no hook `auth_cpf.js`
3. **Adicionar ErrorBoundary** — Envolver a aplicação com um ErrorBoundary para evitar telas em branco
4. **Remover duplo registro de Service Worker** — Manter apenas em `index.html` ou `main.tsx`
5. **Corrigir rota `/` duplicada** — Redirecionar `/` para `/login` em vez de renderizar `Login` em ambas

### Prioridade 2 — Limpeza e refatoração

6. **Remover código legado não utilizado** — `NewInvoiceModal`, `InvoiceActionsBar`, `AppButton`, `AppFooter`, `BottomActions`, `BodyText`, `TextButton`, `MenuPageLayout`, `Index.tsx`
7. **Consolidar componentes duplicados** — Unificar `AppButton`/`PrimaryButton`, `AppScreen`/`AppScaffold`, `ConfirmationDialog`/`ExitConfirmationDialog`
8. **Consolidar `ConsultarNF` e `InvoiceHistory`** — Manter apenas uma tela de listagem de NFs
9. **Remover fontes não utilizadas** — Playfair Display e Roboto no import do Google Fonts
10. **Tipar o usuário no `AuthContext`** — Substituir `user: any` por uma interface tipada
11. **Extrair estilos inline repetidos** — Criar classes CSS ou constantes para padrões repetidos

### Prioridade 3 — Completar funcionalidades pendentes

12. **Implementar transmissão para SEFAZ** — Integrar com provedor como Focus NFe ou API direta da SEFAZ
13. **Implementar certificado digital** — Suporte para certificado A1/A3
14. **Implementar venda de gado** — Seguir o padrão do fluxo de venda de leite
15. **Implementar recuperação de senha** — Fluxo de reset via email ou código
16. **Implementar DANFE completo** — Substituir o DANFE simplificado por um layout oficial

### Prioridade 4 — Melhorias de UX e performance

17. **Melhorar estatísticas** — Adicionar gráficos interativos (recharts já instalado) e filtros de período
18. **Melhorar perfil do produtor** — Adicionar edição de perfil e dados reais
19. **Padronizar design system** — Migrar cores hardcoded para variáveis CSS do Tailwind
20. **Adicionar skeletons de loading** — Substituir spinners por skeletons nos carregamentos de lista
21. **Otimizar performance** — Lazy loading de páginas, code splitting

### Prioridade 5 — Qualidade e testes

22. **Adicionar testes unitários** — Configurar Vitest e escrever testes para hooks, services e utilitários
23. **Adicionar testes de integração** — Testar fluxos completos (login, cadastro, emissão de NF)
24. **Configurar CI/CD** — Pipeline com lint, testes e build automatizado
25. **Adicionar monitoramento** — Error tracking (ex: Sentry) e analytics

---

## Apêndice — Itens Não Verificáveis

Os seguintes itens não puderam ser verificados a partir do código-fonte alone:

| Item                                        | Motivo                                           |
| ------------------------------------------- | ------------------------------------------------ |
| Comportamento offline real                  | Requer teste em ambiente offline físico          |
| Respostas reais da API SINTEGRA             | Requer credenciais válidas e execução            |
| Comportamento do Service Worker em produção | Requer deploy e teste no domínio de produção     |
| Funcionamento de notificações push          | Não há código de push notifications implementado |
| Comportamento em iOS Safari                 | Requer teste em dispositivo físico iOS           |
| Performance em dispositivos antigos         | Requer teste em hardware de baixo desempenho     |
| Resposta da transmissão SEFAZ               | Não implementado                                 |
| Validação do certificado digital            | Não implementado                                 |

---

_Fim do documento de auditoria._
