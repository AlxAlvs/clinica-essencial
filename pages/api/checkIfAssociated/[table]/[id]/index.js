/* eslint-disable no-console */
/* eslint-disable consistent-return */
import executeQuery from '../../../../../lib/db';

export default async (req, res) => {
  const {
    query: { table, id },
  } = req;

  if (table === 'cliente') {
    try {
        const result = await executeQuery({
          query: `SELECT * FROM clinica.fluxoProcedimento WHERE clienteId = ${id}`,
        });
        const data = {
          result,
        };
        return res.status(200).json(data);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Error while getting ${table}` });
      }
  }

  if (table === 'procedimento') {
    try {
        const result = await executeQuery({
          query: `SELECT * FROM clinica.fluxoProcedimentoProcedimento WHERE procedimentoId = ${id}`,
        });
        const data = {
          result,
        };
        return res.status(200).json(data);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Error while getting ${table}` });
      }
  }

  const tableName = await 'fluxoProcedimento' + table;
  const key = await table + 'Id';

  try {
    let result = await executeQuery({
      query: `SELECT * FROM clinica.${tableName} WHERE ${key} = ${id}`,
    });

    if (result.length <= 0) {
        const tableNameForProcedimento = await 'procedimento' + table;
        result = await executeQuery({
            query: `SELECT * FROM clinica.${tableNameForProcedimento} WHERE ${key} = ${id}`,
        });
    }
    const data = {
        result,
    };
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Error while getting ${table}` });
  }
  
};
