import { SNSClient, AddPermissionCommand } from "@aws-sdk/client-sns";
import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

let allEntries = []
let emailMessage = ""

async function getDBdata() {

    const client = new Client({ connectionString: process.env.DB_CONNECTIONSTRING,})
        await client.connect()
        const res = await client.query("SELECT * FROM timestamps")
        for (let i = 0; i < res.rows.length; i++) {
            allEntries.push(`${res.rows[i]}`)
        }
        await client.end()

        console.log(allEntries)
        emailMessage = `The following entries were added to the database in the last 24H:\n ${allEntries}`
        console.log(emailMessage)
}

getDBdata()

async function sendSNS() {
    /* let emailMessage = `The following entry was added to the database:
    Start date: ${startDate}
    Start time: ${startTime}
    End date: ${endDate}
    End time: ${endTime}
    Project name: ${projectName}
    Description: ${description}
    Total time: ${time_sum}`
    console.log(emailMessage) */

    /* const client = new SNSClient({ region: "us-east-1" })

    const params = {
        Protocol: "email",
        Message: emailMessage,
        TopicArn: "TOPIC_ARN",
        Endpoint: "some@email"
    }
    try {
        const data = await client.send(new SubscribeCommand(params))
        console.log("Success.",  data)
      } catch (error) {
        console.log("Error", err.stack)
      } */
}