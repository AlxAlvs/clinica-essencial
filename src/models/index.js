const models = {};

models.produto = () => [
  { nome: { displayName: 'nome', type: 'string', databaseName: 'nome' } },
  { valor: { displayName: 'valor', type: 'monetary', databaseName: 'valor' } },
  { data_validade: { displayName: 'data de validade', type: 'date', databaseName: 'data_validade' } },
];

const getModel = (model) => {
  if (typeof models[model] === 'function') {
    return models[model]();
  }
  return [];
};

export default getModel;
