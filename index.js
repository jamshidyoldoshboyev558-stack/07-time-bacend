const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Bazaga ulandi ");

    const res = await client.query('SELECT NOW()');
    console.log("Server vaqti:", res.rows);

  } catch (err) {
    console.error("Xatolik ", err);
  } finally {
    await client.end();
  }
}

run();
