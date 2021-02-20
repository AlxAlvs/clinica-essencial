/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* import executeQuery from '../../../lib/db';

export default async (req, res) => {
  const {
    query: { table },
  } = req;
  const { firstName, lastName, telephone, creditCardNumber } = req.body;
  try {
      const result = await executeQuery({
      query: 'INSERT INTO users (id, createdAt, email, hash, salt) VALUES(?, ?, ?, ?, ?)',
      values: [user.id, user.createdAt.toString(), user.email, user.hash, user.salt],
    });
    console.log(result);
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}; */
