const models = {};

models.produto = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { valor: { displayName: 'valor (R$)', type: 'monetary', databaseName: 'valor' } },
  { data_validade: { displayName: 'data de validade', type: 'date', databaseName: 'data_validade' } },
];

models.equipamento = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { valor: { displayName: 'valor (R$)', type: 'monetary', databaseName: 'valor' } },
  { tipo: { displayName: 'tipo', type: 'string', databaseName: 'tipo' } },
];

models.profissional = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { cpf: { displayName: 'cpf', type: 'cpf', databaseName: 'cpf' } },
  { cnpj: { displayName: 'cnpj', type: 'cnpj', databaseName: 'cnpj' } },
  { celular: { displayName: 'celular', type: 'phone', databaseName: 'celular' } },
  { fixo: { displayName: 'fixo', type: 'checkbox', databaseName: 'fixo' } },
  { aluga_sala: { displayName: 'aluga sala', type: 'checkbox', databaseName: 'aluga_sala' } },
];

models.cliente = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { data_nascimento: { displayName: 'data de nascimento', type: 'date', databaseName: 'data_nascimento' } },
  { endereço: { displayName: 'endereço', type: 'string', databaseName: 'endereço' } },
  { celular: { displayName: 'celular', type: 'phone', databaseName: 'celular' } },
];

models.saidaDeCaixa = () => [
  { descrição: { displayName: 'descrição', type: 'textArea', databaseName: 'descrição' } },
  { valor: { displayName: 'valor (R$)', type: 'monetary', databaseName: 'valor' } },
  { data_pagamento: { displayName: 'data do pagamento', type: 'date', databaseName: 'data_pagamento' } },
];

models.procedimento = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { profissionais: { displayName: 'profissionais', type: 'selectMultiple', databaseName: 'profissionais' } },
  { equipamentos: { displayName: 'equipamentos', type: 'selectMultiple', databaseName: 'equipamentos' } },
  { produtos: { displayName: 'produtos', type: 'selectMultiple', databaseName: 'produtos' } },
  { valor: { displayName: 'valor (R$)', type: 'monetary', databaseName: 'valor' } },
];

const getModel = (model) => {
  if (typeof models[model] === 'function') {
    return models[model]();
  }
  return [];
};

export default getModel;
