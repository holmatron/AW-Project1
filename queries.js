import "dotenv/config";
import pkg from "pg";
import { startDate, startTime, endDate, endTime, projectName, description } from "./app";

const globalValues = [startDate,startTime,endDate,endTime,projectName,description];
console.log(globalValues);

const { Client } = pkg;

async function lisaa_timestamp(startDate,startTime,endDate,endTime,projectName,description) {
  const values = [startDate,startTime,endDate,endTime,projectName,description];
  
  const client = new Client({ connectionString: process.env.DB_CONNECTIONSTRING,});
  await client.connect();
  const res = await client.query(
    "INSERT INTO timestamps (start_date,start_time,end_date,end_time,project,description) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
    values
  );
  console.table(res.rows);

  await client.end();
}

async function tulosta_timestamp() {
  const client = new Client({
    connectionString: process.env.DB_CONNECTIONSTRING,
  });
  await client.connect();
  const res = await client.query("SELECT * FROM timestamps");
  console.table(res.rows);

  await client.end();
}