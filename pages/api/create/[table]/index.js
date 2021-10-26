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

  const formattedValue = await formatMoneyForDatabase(valor);
  const formattedDate = await data_validade ? formatDateForDatabase(data_validade) : data_validade;

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

  const formattedValue = await formatMoneyForDatabase(valor);

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

  const formattedCpf = await  cpf ? formatToOnlyNumbersForDatabase(cpf) : null;
  const formattedCnpj = await cnpj ? formatToOnlyNumbersForDatabase(cnpj) : null;
  const formattedCelular = await celular ? formatToOnlyNumbersForDatabase(celular) : null;

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

const clienteCreate = async (req, table, res) => {
  const {
    nome, data_nascimento, endereço, celular,
  } = await req.body;

  const formattedDate = await data_nascimento ? formatDateForDatabase(data_nascimento) : data_nascimento;
  const formattedCelular = await celular ? formatToOnlyNumbersForDatabase(celular) : null;

  try {
    const result = await executeQuery({
      query: `INSERT INTO ${table} (nome, data_nascimento, endereço, celular) 
      VALUES(?, ?, ?, ?)`,
      values: [nome, formattedDate, endereço, formattedCelular],
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

const saidaDeCaixaCreate = async (req, table, res) => {
  const {
    descrição, valor, data_pagamento,
  } = await req.body;

  const formattedValue = await formatMoneyForDatabase(valor);
  const formattedDate = await data_pagamento ? formatDateForDatabase(data_pagamento) : data_pagamento;

  try {
    const result = await executeQuery({
      query: `INSERT INTO ${table} (descrição, valor, data_pagamento) 
      VALUES(?, ?, ?)`,
      values: [descrição, formattedValue, formattedDate],
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

const procedimentoCreate = async (req, table, res) => {
  const {
    nome, profissionais, equipamentos, produtos, valor,
  } = await req.body;

  const formattedValue = await formatMoneyForDatabase(valor);

  try {
    const lastId = await executeQuery({
      query: 'SELECT MAX(id) as lastId FROM procedimento;',
    });
    const currentId = await lastId ? JSON.parse(JSON.stringify(lastId))[0].lastId + 1 : 1;
    const result = await executeQuery({
      query: `INSERT INTO ${table} (id, nome, valor) 
      VALUES(?, ?, ?)`,
      values: [currentId, nome, formattedValue],
    });
    await profissionais.forEach((profissional) => {
      executeQuery({
        query: `INSERT INTO procedimentoProfissional (procedimentoId, profissionalId) 
        VALUES(?, ?)`,
        values: [currentId, profissional.value],
      });
    });
    await equipamentos.forEach((equipamento) => {
      executeQuery({
        query: `INSERT INTO procedimentoEquipamento (procedimentoId, equipamentoId) 
        VALUES(?, ?)`,
        values: [currentId, equipamento.value],
      });
    });
    await produtos.forEach((produto) => {
      executeQuery({
        query: `INSERT INTO procedimentoProduto (procedimentoId, produtoId) 
        VALUES(?, ?)`,
        values: [currentId, produto.value],
      });
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

const fluxoProcedimentoCreate = async (req, table, res) => {
  const {
    cliente, profissionais, equipamentos, produtos, procedimentos, valor_profissional, data_procedimento, descrição, valor_total, pago, forma_pagamento
  } = await req.body;

  const valorTotalFormatted = await formatMoneyForDatabase(valor_total);
  const valorProfissionalFormatted = await formatMoneyForDatabase(valor_profissional);
  const dataProcedimentoFormatted = await data_procedimento ? formatDateForDatabase(data_procedimento) : data_procedimento;

  try {
    const lastId = await executeQuery({
      query: 'SELECT MAX(id) as lastId FROM fluxoProcedimento;',
    });
    const currentId = await lastId ? JSON.parse(JSON.stringify(lastId))[0].lastId + 1 : 1;
    const result = await executeQuery({
      query: `INSERT INTO ${table} (id, clienteId, valor_profissional, data_procedimento, descrição, valor_total, pago, forma_pagamento) 
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      values: [currentId, cliente.value, valorProfissionalFormatted, dataProcedimentoFormatted, descrição, valorTotalFormatted, pago, forma_pagamento],
    });
    await profissionais.forEach((profissional) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoProfissional (fluxoProcedimentoId, profissionalId) 
        VALUES(?, ?)`,
        values: [currentId, profissional.value],
      });
    });
    await equipamentos.forEach((equipamento) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoEquipamento (fluxoProcedimentoId, equipamentoId) 
        VALUES(?, ?)`,
        values: [currentId, equipamento.value],
      });
    });
    await produtos.forEach((produto) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoProduto (fluxoProcedimentoId, produtoId) 
        VALUES(?, ?)`,
        values: [currentId, produto.value],
      });
    });
    await procedimentos.forEach((procedimento) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoProcedimento (fluxoProcedimentoId, procedimentoId) 
        VALUES(?, ?)`,
        values: [currentId, procedimento.value],
      });
    });

    console.log(result);
    const data = {
      result,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Error while getting ${table}, ${error}` });
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
    case 'cliente':
      return clienteCreate(req, table, res);
    case 'saidaDeCaixa':
      return saidaDeCaixaCreate(req, table, res);
    case 'procedimento':
      return procedimentoCreate(req, table, res);
    case 'fluxoProcedimento':
      return fluxoProcedimentoCreate(req, table, res);
    default:
      return '';
  }
};
