// ===========================================
// NORMALIZATION UTILS - Normalização de Termos do Sistema
// ===========================================
// Este módulo garante consistência nos termos "Entrada" e "Saída"
// independente de como foram digitados (com/sem acento, maiúsculas/minúsculas)

var NormalizationUtils = {
  
  // Valores padrão do sistema
  TIPO_ENTRADA: 'Entrada',
  TIPO_SAIDA: 'Saída',
  
  // Padrões aceitos para ENTRADA (case-insensitive)
  ENTRADA_PATTERNS: ['entrada', 'entradas', 'credit', 'crédito', 'credito', 'c', 'in', 'receita', 'recebimento'],
  
  // Padrões aceitos para SAÍDA (case-insensitive, com e sem acento)
  SAIDA_PATTERNS: ['saída', 'saida', 'saídas', 'saidas', 'debit', 'débito', 'debito', 'd', 'out', 'despesa', 'pagamento'],
  
  /**
   * Remove acentos de uma string
   * @param {string} str - String com possíveis acentos
   * @returns {string} - String sem acentos
   */
  removeAccents: function(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  },
  
  /**
   * Normaliza o tipo de transação para o padrão do sistema
   * Aceita variações: "Saída", "Saida", "saída", "saida", "SAIDA", etc.
   * @param {string} type - Tipo de transação (qualquer variação)
   * @returns {string} - 'Entrada' ou 'Saída' (padrão do sistema)
   */
  normalizeTransactionType: function(type) {
    if (!type) return null;
    
    // Converte para minúsculo e remove acentos para comparação
    var typeLower = String(type).toLowerCase().trim();
    var typeNoAccent = this.removeAccents(typeLower);
    
    // Verifica se é ENTRADA
    for (var i = 0; i < this.ENTRADA_PATTERNS.length; i++) {
      var pattern = this.ENTRADA_PATTERNS[i];
      var patternNoAccent = this.removeAccents(pattern);
      
      if (typeLower === pattern || typeNoAccent === patternNoAccent || 
          typeLower.indexOf(pattern) > -1 || typeNoAccent.indexOf(patternNoAccent) > -1) {
        return this.TIPO_ENTRADA;
      }
    }
    
    // Verifica se é SAÍDA
    for (var j = 0; j < this.SAIDA_PATTERNS.length; j++) {
      var pattern = this.SAIDA_PATTERNS[j];
      var patternNoAccent = this.removeAccents(pattern);
      
      if (typeLower === pattern || typeNoAccent === patternNoAccent ||
          typeLower.indexOf(pattern) > -1 || typeNoAccent.indexOf(patternNoAccent) > -1) {
        return this.TIPO_SAIDA;
      }
    }
    
    // Se não reconheceu, retorna o valor original
    Logger.log('[Normalization] Tipo não reconhecido: "' + type + '"');
    return String(type).trim();
  },
  
  /**
   * Verifica se um tipo é ENTRADA (aceita variações)
   * @param {string} type - Tipo de transação
   * @returns {boolean}
   */
  isEntrada: function(type) {
    return this.normalizeTransactionType(type) === this.TIPO_ENTRADA;
  },
  
  /**
   * Verifica se um tipo é SAÍDA (aceita variações)
   * @param {string} type - Tipo de transação
   * @returns {boolean}
   */
  isSaida: function(type) {
    return this.normalizeTransactionType(type) === this.TIPO_SAIDA;
  },
  
  /**
   * Normaliza uma transação completa (normaliza o campo type)
   * @param {Object} transaction - Objeto da transação
   * @returns {Object} - Transação com tipo normalizado
   */
  normalizeTransaction: function(transaction) {
    if (!transaction) return transaction;
    
    var normalized = Object.assign({}, transaction);
    
    if (normalized.type) {
      normalized.type = this.normalizeTransactionType(normalized.type);
    }
    
    if (normalized.transactionType) {
      normalized.transactionType = this.normalizeTransactionType(normalized.transactionType);
    }
    
    return normalized;
  },
  
  /**
   * Normaliza um array de transações
   * @param {Array} transactions - Array de transações
   * @returns {Array} - Array com transações normalizadas
   */
  normalizeTransactions: function(transactions) {
    if (!transactions || !Array.isArray(transactions)) return transactions;
    
    var self = this;
    return transactions.map(function(tx) {
      return self.normalizeTransaction(tx);
    });
  },
  
  /**
   * Normaliza o tipo para uso em regras de categorização
   * @param {string} type - Tipo da regra (auto, Entrada, Saída, etc.)
   * @returns {string} - Tipo normalizado ou 'auto'
   */
  normalizeRuleType: function(type) {
    if (!type) return 'auto';
    
    var typeLower = String(type).toLowerCase().trim();
    
    if (typeLower === 'auto' || typeLower === 'automatico' || typeLower === 'automático') {
      return 'auto';
    }
    
    return this.normalizeTransactionType(type) || 'auto';
  }
};

// Função global de conveniência para normalização de tipo
function normalizeType(type) {
  return NormalizationUtils.normalizeTransactionType(type);
}

// Função global para verificar se é entrada
function isEntrada(type) {
  return NormalizationUtils.isEntrada(type);
}

// Função global para verificar se é saída
function isSaida(type) {
  return NormalizationUtils.isSaida(type);
}
