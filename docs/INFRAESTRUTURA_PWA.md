# INFRAESTRUTURA PWA — VERSÃO ESTÁVEL

## Status

**CONGELADA**

Data da estabilização: 29/07/2026

Tag oficial de referência:

`v1.0-pwa-estavel`

## Objetivo

Este documento estabelece a infraestrutura PWA atualmente validada do aplicativo 2A Rural.

Os arquivos relacionados abaixo não poderão ser modificados durante o desenvolvimento normal de telas, formulários, integrações, autenticação ou regras de negócio.

## Arquivos protegidos

- `public/manifest.json`
- `public/sw.js`
- `public/2ARural192x192.png`
- `public/2ARural512x512.png`
- `public/favicon.ico`
- `index.html`

## Estado validado

Foram confirmados:

- Manifest reconhecido pelo Chrome;
- Nome da aplicação: 2A Rural;
- Ícones 192x192 e 512x512 carregados corretamente;
- Ausência de erros de carregamento dos ícones;
- Aplicativo reconhecido como instalável;
- Opção “Instalar 2A Rural” disponível;
- Display em modo standalone;
- Rota inicial abrindo diretamente a tela de login;
- Tela intermediária anterior ao login removida.

## Regra de congelamento

É proibida a alteração dos arquivos protegidos sem autorização expressa do responsável pelo projeto.

Solicitações relacionadas a:

- telas;
- botões;
- formulários;
- propriedades;
- emissão de nota fiscal;
- consultas;
- autenticação;
- API Focus NFe;
- regras de negócio;

não autorizam alterações nos arquivos protegidos.

## Exceções

Os arquivos protegidos somente poderão ser alterados quando houver:

1. autorização expressa;
2. justificativa técnica;
3. descrição dos arquivos que serão alterados;
4. análise do impacto;
5. plano de restauração;
6. validação após a alteração.

## Validação obrigatória após alteração autorizada

Após qualquer alteração na infraestrutura PWA, deverão ser testados:

- carregamento do Manifest;
- carregamento dos ícones;
- registro do Service Worker;
- rota inicial;
- tela de login;
- instalação pelo Chrome;
- abertura em modo standalone;
- funcionamento no desktop;
- funcionamento no celular.

## Restauração

Se qualquer alteração provocar regressão, restaurar a versão:

`v1.0-pwa-estavel`

Essa versão representa o último estado validado da infraestrutura PWA.
