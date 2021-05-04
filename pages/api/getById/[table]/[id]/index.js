/* eslint-disable no-console */
/* eslint-disable consistent-return */
import executeQuery from '../../../../../lib/db';

export default async (req, res) => {
  const {
    query: { table, id },
  } = req;

  if (table === 'procedimento') {
    try {
      const result = await executeQuery({
        query: `SELECT procedimento.*,
        profissional.nome as profissionalNome,
        profissional.id as profissionalIdentification,
        equipamento.nome as equipamentoNome,
        equipamento.id as equipamentoIdentification,
        produto.nome as produtoNome,
        produto.id as produtoIdentification 
        FROM procedimento 
        LEFT JOIN procedimentoProfissional ON procedimentoProfissional.procedimentoId = procedimento.Id
        LEFT JOIN profissional ON procedimentoProfissional.profissionalId = profissional.id
        LEFT JOIN procedimentoEquipamento ON procedimentoEquipamento.procedimentoId = procedimento.Id
        LEFT JOIN equipamento ON procedimentoEquipamento.equipamentoId = equipamento.id
        LEFT JOIN procedimentoProduto ON procedimentoProduto.procedimentoId = procedimento.Id
        LEFT JOIN produto ON procedimentoProduto.produtoId = produto.id WHERE procedimento.id = ${id};`,
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

  try {
    const result = await executeQuery({
      query: `SELECT * FROM clinica.${table} WHERE id = ${id}`,
    });
    const data = {
      result,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Error while getting ${table}` });
  }
};
