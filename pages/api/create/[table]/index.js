/* eslint-disable camelcase */
/* eslint-disable no-console */
import executeQuery from '../../../../lib/db';
import {
  formatMoneyForDatabase,
  formatDateForDatabase,
  formatToOnlyNumbersForDatabase,
} from '../../../../src/utils/index';

const produtoCreate = async (req, table, res) => {
  const {
    nome, valor, data_validade,
  } = await req.body;

  const formattedValue = formatMoneyForDatabase(valor);
  const formattedDate = data_validade ? formatDateForDatabase(data_validade) : data_validade;

  try {
    const result = await executeQuery({
      query: `INSERT INTO ${table} (nome, valor, data_validade) VALUES(?, ?, ?)`,
      values: [nome, formattedValue, formattedDate],
    });
    console.log(result);
    const data = {
      result,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Error while getting ${table}` });
  }
};

const equipamentoCreate = async (req, table, res) => {
  const {
    nome, valor, tipo,
  } = await req.body;

  const formattedValue = formatMoneyForDatabase(valor);

  try {
    const result = await executeQuery({
      query: `INSERT INTO ${table} (nome, valor, tipo) VALUES(?, ?, ?)`,
      values: [nome, formattedValue, tipo],
    });
    console.log(result);
    const data = {
      result,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Error while getting ${table}` });
  }
};

const profissionalCreate = async (req, table, res) => {
  const {
    nome, cpf, cnpj, celular, fixo, aluga_sala,
  } = await req.body;

  const formattedCpf = cpf ? formatToOnlyNumbersForDatabase(cpf) : null;
  const formattedCnpj = cnpj ? formatToOnlyNumbersForDatabase(cnpj) : null;
  const formattedCelular = celular ? formatToOnlyNumbersForDatabase(celular) : null;

  try {
    const result = await executeQuery({
      query: `INSERT INTO ${table} (nome, cpf, cnpj, celular, fixo, aluga_sala) 
      VALUES(?, ?, ?, ?, ?, ?)`,
      values: [nome, formattedCpf, formattedCnpj, formattedCelular, fixo, aluga_sala],
    });
    console.log(result);
    const data = {
      result,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Error while getting ${table}` });
  }
};

export default async (req, res) => {
  const {
    query: { table },
  } = req;

  switch (table) {
    case 'produto':
      return produtoCreate(req, table, res);
    case 'equipamento':
      return equipamentoCreate(req, table, res);
    case 'profissional':
      return profissionalCreate(req, table, res);
    default:
      return '';
  }
};
