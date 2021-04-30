/* eslint-disable no-console */
/* eslint-disable consistent-return */
import executeQuery from '../../../../../lib/db';

export default async (req, res) => {
  const {
    query: { table, id },
  } = req;

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
