import moment from 'moment';

const hasOnlyZeros = (valueAsString) => {
  const regex = /^0+$/;
  return regex.test(valueAsString);
};

const toBigNumberAsString = (valueAsString) => {
  let formatedValue = '';
  if (valueAsString !== undefined && valueAsString !== null && valueAsString !== '') {
    if (!hasOnlyZeros(valueAsString)) {
      formatedValue = `${valueAsString.toString().replace(/^0+/, '').replace(/\D/g, '').trim()}`;
    } else {
      formatedValue = `${valueAsString.toString().replace(/\D/g, '').trim()}`;
    }
  }
  return formatedValue;
};

export const formatterValue = (value) => {
  let stringValue = toBigNumberAsString(value);
  const separators = { decimal: ',', thousand: '.' };

  if (stringValue.length === 0) {
    return stringValue;
  }

  if (stringValue.length === 1) {
    return `0${separators.decimal}0${stringValue}`;
  }

  if (stringValue.length === 2) {
    return `0${separators.decimal}${stringValue}`;
  }

  if (stringValue.length <= 5) {
    return `${stringValue.slice(0, stringValue.length - 2)}`
          + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  if (stringValue.length <= 8) {
    return `${stringValue.slice(0, stringValue.length - 5)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
        + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  if (stringValue.length <= 11) {
    return `${stringValue.slice(0, stringValue.length - 8)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 8, stringValue.length - 5)}`
        + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
        + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
  }

  stringValue = stringValue.substring(0, 12);
  return `${stringValue.charAt(0)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 11, stringValue.length - 8)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 8, stringValue.length - 5)}`
      + `${separators.thousand}${stringValue.slice(stringValue.length - 5, stringValue.length - 2)}`
      + `${separators.decimal}${stringValue.slice(stringValue.length - 2, stringValue.length)}`;
};

export const formatMoneyForDatabase = (value) => {
  console.log(value);
  const formatted = value.toString().replace(/\./g,'').replace(',', '.');
  console.log(formatted);
  return formatted;
};

export const formatToOnlyNumbersForDatabase = (value) => {
  const formatted = value.toString().replace(/\D/g, '');
  return formatted;
};

export const formatDateForDatabase = (value) => {
  const formatted = moment(value, 'DD MM YYYY').format('YYYY-MM-DD');
  return formatted;
};

export const cpfMask = (value) => value
  .replace(/\D/g, '')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})/, '$1-$2')
  .replace(/(-\d{2})\d+?$/, '$1');

export const cnpjMask = (value) => value
  .replace(/\D+/g, '')
  .replace(/(\d{2})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1/$2')
  .replace(/(\d{4})(\d)/, '$1-$2')
  .replace(/(-\d{2})\d+?$/, '$1');

export const phoneMask = (value) => value
  .replace(/\D+/g, '')
  .replace(/(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{4})(\d)/, '$1-$2')
  .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
  .replace(/(-\d{4})\d+?$/, '$1');

export const renderTableName = (tableName) => {
  switch (tableName) {
    case 'saidaDeCaixa':
      return (
        'saída de caixa'
      );
    case 'fluxoDeProcedimentos':
      return (
        'fluxo de procedimentos'
      );
    default:
      return tableName;
  }
};

const procedimentoResultToObject = (finalList, procedimentoResultById) => {
  const profissionais = [];
  const profissionaisIds = [];
  const equipamentos = [];
  const equipamentosIds = [];
  const produtos = [];
  const produtosIds = [];

  procedimentoResultById.forEach((result) => {
    if (!profissionaisIds.includes(result.profissionalIdentification)) {
      profissionais.push({
        value: result.profissionalIdentification,
        label: result.profissionalNome,
      });
      profissionaisIds.push(result.profissionalIdentification);
    }
    if (!equipamentosIds.includes(result.equipamentoIdentification)) {
      equipamentos.push({
        value: result.equipamentoIdentification,
        label: result.equipamentoNome,
      });
      equipamentosIds.push(result.equipamentoIdentification);
    }
    if (!produtosIds.includes(result.produtoIdentification)) {
      produtos.push({
        value: result.produtoIdentification,
        label: result.produtoNome,
      });
      produtosIds.push(result.produtoIdentification);
    }
  });

  return {
    id: procedimentoResultById ? procedimentoResultById[0].id : null,
    nome: procedimentoResultById ? procedimentoResultById[0].nome : null,
    valor: procedimentoResultById ? procedimentoResultById[0].valor : null,
    profissionais,
    equipamentos,
    produtos,
  };
};

export const handleProcedimento = (procedimentoFromDatabase) => {
  const finalList = [];
  return procedimentoResultToObject(finalList, procedimentoFromDatabase);
};
