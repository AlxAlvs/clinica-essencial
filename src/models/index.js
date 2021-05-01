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

const getModel = (model) => {
  if (typeof models[model] === 'function') {
    return models[model]();
  }
  return [];
};

export default getModel;
