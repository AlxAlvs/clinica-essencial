/* eslint-disable camelcase */
/* eslint-disable no-console */
import executeQuery from '../../../../lib/db';
import {
  formatMoneyForDatabase,
  formatDateForDatabase,
  formatToOnlyNumbersForDatabase,
} from '../../../../src/utils/index';

const produtoEdit = async (req, table, res) => {
  const {
    id, nome, valor, data_validade,
  } = await req.body;

  const formattedValue = formatMoneyForDatabase(valor);
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

  const formattedValue = formatMoneyForDatabase(valor);

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

const professionalEdit = async (req, table, res) => {
  const {
    id, nome, cpf, cnpj, celular, fixo, aluga_sala,
  } = await req.body;

  const formattedCpf = cpf ? formatToOnlyNumbersForDatabase(cpf) : null;
  const formattedCnpj = cnpj ? formatToOnlyNumbersForDatabase(cnpj) : null;
  const formattedCelular = celular ? formatToOnlyNumbersForDatabase(celular) : null;

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}', 
      cpf = '${formattedCpf}', 
      cnpj = '${formattedCnpj}',
      celular = '${formattedCelular}', 
      fixo = ${fixo},
      aluga_sala = ${aluga_sala}
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

const clienteEdit = async (req, table, res) => {
  const {
    id, nome, data_nascimento, endereço, celular,
  } = await req.body;

  const formattedDate = data_nascimento ? formatDateForDatabase(data_nascimento) : data_nascimento;
  const formattedCelular = celular ? formatToOnlyNumbersForDatabase(celular) : null;

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}', 
      data_nascimento = '${formattedDate}', 
      endereço = '${endereço}',
      celular = '${formattedCelular}'
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

const saidaDeCaixaEdit = async (req, table, res) => {
  const {
    id, descrição, valor, data_pagamento,
  } = await req.body;

  const formattedValue = formatMoneyForDatabase(valor);
  const formattedDate = data_pagamento ? formatDateForDatabase(data_pagamento) : '';

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      descrição = '${descrição}', 
      valor = '${formattedValue}', 
      data_pagamento = '${formattedDate}'
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
    case 'profissional':
      return professionalEdit(req, table, res);
    case 'cliente':
      return clienteEdit(req, table, res);
    case 'saidaDeCaixa':
      return saidaDeCaixaEdit(req, table, res);
    default:
      return '';
  }
};
