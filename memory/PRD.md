# PRD - DashFin v4 - Correção de Normalização

## Problema Original
O sistema não reconhecia variações dos termos "Entrada" e "Saída" (com/sem acento, maiúsculas/minúsculas). Quando a IA ou o admin inseria "Saida" (sem acento) ou "entrada" (minúsculo), o dashboard não processava corretamente as transações.

## Data: 02/02/2026

## O que foi implementado

### 1. Novo arquivo: `NormalizationUtils.js`
- Função `normalizeTransactionType()` - normaliza qualquer variação para "Entrada" ou "Saída"
- Função `isEntrada()` / `isSaida()` - verificação flexível de tipo
- Suporta variações: "Saída", "Saida", "saída", "saida", "SAIDA", "entrada", "ENTRADA", etc.
- Remove acentos para comparação usando `normalize('NFD')`

### 2. Arquivos modificados:
- **ImportService.js**: Normaliza tipo ao importar OFX/CSV
- **CategorizationService.js**: 
  - Normaliza regras de categorização ao ler
  - Normaliza resposta da IA
  - Normaliza antes de salvar transações aprovadas
  - Normaliza ao aprender novas regras
- **DataService.js**: Normaliza tipo ao ler transações da planilha

## Arquitetura da Solução
```
Entrada de dados → NormalizationUtils.normalizeTransactionType() → Saída padronizada
                        ↓
            "saida", "Saida", "SAIDA" → "Saída"
            "entrada", "Entrada", "ENTRADA" → "Entrada"
```

## Backlog / Próximas Melhorias (P2)
- [ ] Adicionar logs de normalização para auditoria
- [ ] Criar função de migração para corrigir dados existentes na planilha
- [ ] Expandir normalização para outros campos (status, categorias)

## Repositório Original
https://github.com/amacodesistemas-art/dashfinv4/tree/correcaocontabanco
