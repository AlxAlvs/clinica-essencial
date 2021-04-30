import mysql from 'serverless-mysql';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

const db = mysql({
  config: {
    host: serverRuntimeConfig.MYSQL_HOST,
    port: serverRuntimeConfig.MYSQL_PORT,
    database: serverRuntimeConfig.MYSQL_DATABASE,
    user: serverRuntimeConfig.MYSQL_USER,
    password: serverRuntimeConfig.MYSQL_PASSWORD,
  },
});

export default async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw new Error(error);
  }
}
