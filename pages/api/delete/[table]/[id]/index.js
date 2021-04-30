/* eslint-disable camelcase */
/* eslint-disable no-console */
import executeQuery from '../../../../../lib/db';

export default async (req, res) => {
  const {
    query: { table, id },
  } = req;

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
