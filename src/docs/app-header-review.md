# AppHeader Implementation Review Report

## Component: `src/components/AppHeader.tsx`

**Props:** `nomeUsuario`, `nomePropriedade`, `cadPro`, `etapaAtual`, `totalEtapas`, `exibirBotaoVoltar`, `acaoVoltar`

All props are optional. When omitted, `nomeUsuario`, `nomePropriedade`, and `cadPro` default to values from `useAuth` and `useSession` context. `exibirBotaoVoltar` defaults to `true`. `acaoVoltar` defaults to `navigate(-1)`.

**Layout:**

- Line 1: `Usuário: {userName}` (white/60 label, white value)
- Line 2: `Propriedade Selecionada: {propertyName}` (truncates with ellipsis on long names)
- Line 3: `CAD/PRO: {cadPro}` (never truncated, `#A8914E` highlight)
- Line 4: Left `← Voltar` button, right `Etapa X de Y` indicator (when step props provided)

**Sticky:** `position: sticky; top: 0; z-30` — content scrolls below, never overlaps.

## Screens Updated

| Screen           | File                             | Changes                                                                                                                                                                                    |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dashboard        | `src/pages/Dashboard.tsx`        | Added `exibirBotaoVoltar={false}` (main screen, no back). No duplicate info existed.                                                                                                       |
| NotaFiscal       | `src/pages/NotaFiscal.tsx`       | Removed user/property/CAD-PRO info block. Removed `useAuth`, `useSession` imports.                                                                                                         |
| EmitirNF         | `src/pages/EmitirNF.tsx`         | Removed user/property/CAD-PRO info block. Removed `useAuth` import, removed `user` and `activeProperty` from destructure.                                                                  |
| SelectClient     | `src/pages/SelectClient.tsx`     | Removed user/property/CAD-PRO info block. Removed "Etapa 1 – Cliente" text. Added `etapaAtual={1} totalEtapas={3}`. Removed `useAuth` import, removed `user` and `activeProperty`.         |
| EmitirLeite      | `src/pages/EmitirLeite.tsx`      | Removed user/property/CAD-PRO info block. Removed "Etapa 2 – Produto" text. Added `etapaAtual={2} totalEtapas={3}`. Kept `useAuth`/`useSession` (used in `buildDraft`).                    |
| EmitirLeiteNext  | `src/pages/EmitirLeiteNext.tsx`  | Removed "Etapa 2 – Revisão dos dados" text. Added `etapaAtual={3} totalEtapas={3}`.                                                                                                        |
| ConsultarNF      | `src/pages/ConsultarNF.tsx`      | No changes needed — no duplicate info existed.                                                                                                                                             |
| InvoiceDetail    | `src/pages/InvoiceDetail.tsx`    | No changes needed — no duplicate info existed.                                                                                                                                             |
| Configuracoes    | `src/pages/Configuracoes.tsx`    | Removed property name + CAD/PRO line from body. Removed `useSession` import.                                                                                                               |
| CadastrarCliente | `src/pages/CadastrarCliente.tsx` | Removed user/property/CAD-PRO info block. Removed `useAuth`, `useSession` imports.                                                                                                         |
| EmitirGado       | `src/pages/EmitirGado.tsx`       | Removed property name + CAD/PRO line. Removed `activeProperty` from destructure.                                                                                                           |
| InvoiceHistory   | `src/pages/InvoiceHistory.tsx`   | No changes needed — no duplicate info existed.                                                                                                                                             |
| ProducerProfile  | `src/pages/ProducerProfile.tsx`  | Removed user name from profile card. Removed property name "Fazenda Santa Luzia" from property card. Removed IE line (CAD/PRO duplicate). Kept email, CPF/CNPJ, regime, CAR, municipality. |

## Confirmation

All internal screens after property selection now use the standardized `AppHeader` component. No screen displays user name, property name, or CAD/PRO outside of the `AppHeader`. Step indicators are configurable per flow via `etapaAtual` and `totalEtapas` props.
