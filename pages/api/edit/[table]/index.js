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
    id, nome, valor, data_validade, quantidade, vendidos,
  } = await req.body;

  const formattedValue = formatMoneyForDatabase(valor);
  const formattedDate = data_validade ? formatDateForDatabase(data_validade) : '';

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}', 
      valor = '${formattedValue}', 
      quantidade = '${quantidade}', 
      vendidos = '${vendidos}', 
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

const procedimentoEdit = async (req, table, res) => {
  const {
    id, nome, profissionais, equipamentos, produtos, valor,
  } = await req.body;

  const formattedValue = await formatMoneyForDatabase(valor);

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      nome = '${nome}',
      valor = '${formattedValue}'
      WHERE id = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM procedimentoProfissional 
      WHERE procedimentoProfissional.procedimentoId = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM procedimentoEquipamento 
      WHERE procedimentoEquipamento.procedimentoId = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM procedimentoProduto 
      WHERE procedimentoProduto.procedimentoId = ${id}`,
    });
    await profissionais.forEach((profissional) => {
      executeQuery({
        query: `INSERT INTO procedimentoProfissional (procedimentoId, profissionalId) 
        VALUES(?, ?)`,
        values: [id, profissional.value],
      });
    });
    await equipamentos.forEach((equipamento) => {
      executeQuery({
        query: `INSERT INTO procedimentoEquipamento (procedimentoId, equipamentoId) 
        VALUES(?, ?)`,
        values: [id, equipamento.value],
      });
    });
    await produtos.forEach((produto) => {
      executeQuery({
        query: `INSERT INTO procedimentoProduto (procedimentoId, produtoId) 
        VALUES(?, ?)`,
        values: [id, produto.value],
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

const fluxoProcedimentoEdit = async (req, table, res) => {
  const {
    id, cliente, profissionais, equipamentos, procedimentos, valor_profissional, data_procedimento, descrição, valor_total, pago, forma_pagamento
  } = await req.body;

  const clientes = await Array.isArray(cliente) ? cliente : [cliente];
  const isPago = await Boolean(pago);
  const formattedValorProfissional = await formatMoneyForDatabase(valor_profissional);
  const formattedValorTotal = await formatMoneyForDatabase(valor_total);
  const formattedProcedimentoDate = await data_procedimento ? formatDateForDatabase(data_procedimento) : '';

  try {
    const result = await executeQuery({
      query: `UPDATE ${table} 
      SET 
      clienteId = '${clientes[0].value}',
      valor_profissional = '${formattedValorProfissional}',
      data_procedimento = '${formattedProcedimentoDate}',
      descrição = '${descrição}',
      valor_total = '${formattedValorTotal}', 
      pago = ${isPago}, 
      forma_pagamento = '${forma_pagamento}'
      WHERE id = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM fluxoProcedimentoProfissional 
      WHERE fluxoProcedimentoProfissional.fluxoProcedimentoId = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM fluxoProcedimentoEquipamento 
      WHERE fluxoProcedimentoEquipamento.fluxoProcedimentoId = ${id}`,
    });
    await executeQuery({
      query: `DELETE FROM fluxoProcedimentoProcedimento 
      WHERE fluxoProcedimentoProcedimento.fluxoProcedimentoId = ${id}`,
    });
    await profissionais.forEach((profissional) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoProfissional (fluxoProcedimentoId, profissionalId) 
        VALUES(?, ?)`,
        values: [id, profissional.value],
      });
    });
    await equipamentos.forEach((equipamento) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoEquipamento (fluxoProcedimentoId, equipamentoId) 
        VALUES(?, ?)`,
        values: [id, equipamento.value],
      });
    });
    await procedimentos.forEach((produto) => {
      executeQuery({
        query: `INSERT INTO fluxoProcedimentoProcedimento (fluxoProcedimentoId, procedimentoId) 
        VALUES(?, ?)`,
        values: [id, produto.value],
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
    case 'procedimento':
      return procedimentoEdit(req, table, res);
    case 'fluxoProcedimento':
      return fluxoProcedimentoEdit(req, table, res);
    default:
      return '';
  }
};
