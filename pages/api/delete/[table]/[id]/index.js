/* eslint-disable camelcase */
/* eslint-disable no-console */
import executeQuery from '../../../../../lib/db';

export default async (req, res) => {
  const {
    query: { table, id },
  } = req;

  if (table === 'procedimento') {
    try {
      const result = await executeQuery({
        query: `DELETE FROM ${table} 
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

      console.log(result);
      const data = {
        result,
      };
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: `Error while getting ${table}` });
    }
  }

  if (table === 'fluxoProcedimento') {
    try {
      const result = await executeQuery({
        query: `DELETE FROM ${table} 
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
        query: `DELETE FROM fluxoProcedimentoProduto 
        WHERE fluxoProcedimentoProduto.fluxoProcedimentoId = ${id}`,
      });
      await executeQuery({
        query: `DELETE FROM fluxoProcedimentoProcedimento 
        WHERE fluxoProcedimentoProcedimento.fluxoProcedimentoId = ${id}`,
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
  }

  try {
    const result = await executeQuery({
      query: `DELETE FROM ${table} 
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
