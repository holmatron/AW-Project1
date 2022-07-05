import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

async function lisaa_timestamp(
  s_date,
  s_time,
  e_datename,
  e_time,
  project,
  description
) {
  const values = [s_date, s_time, e_datename, e_time, project, description];
  const client = new Client({
    connectionString: process.env.DB_CONNECTIONSTRING,
  });
  await client.connect();
  const res = await client.query(
    "INSERT INTO timestamps (start_date,start_time,end_date,end_time,project,description) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
    values
  );
  console.table(res.rows);

  await client.end();
}
lisaa_timestamp();

async function tulosta_timestamp() {
  const client = new Client({
    connectionString: process.env.DB_CONNECTIONSTRING,
  });
  await client.connect();
  const res = await client.query("SELECT * FROM timestamps");
  console.table(res.rows);

  await client.end();
}
tulosta_timestamp();
