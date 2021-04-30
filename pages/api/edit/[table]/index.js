/* eslint-disable camelcase */
/* eslint-disable no-console */
import executeQuery from '../../../../lib/db';
import {
  formatNumberForDatabase,
  formatDateForDatabase,
} from '../../../../src/utils/index';

const produtoEdit = async (req, table, res) => {
  const {
    id, nome, valor, data_validade,
  } = await req.body;

  const formattedValue = formatNumberForDatabase(valor);
  const formattedDate = data_validade ? formatDateForDatabase(data_validade) : '';

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}', 
      valor = '${formattedValue}', 
      data_validade = '${formattedDate}'
      WHERE id = ${id}`,
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

const equipamentoEdit = async (req, table, res) => {
  const {
    id, nome, valor, tipo,
  } = await req.body;

  const formattedValue = formatNumberForDatabase(valor);

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}', 
      valor = '${formattedValue}', 
      tipo = '${tipo}'
      WHERE id = ${id}`,
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
      return produtoEdit(req, table, res);
    case 'equipamento':
      return equipamentoEdit(req, table, res);
    default:
      return '';
  }
};
