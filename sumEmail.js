import  { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import "dotenv/config"
import pkg from "pg"

const snsClient = new SNSClient({ region: 'us-east-1' })

const { Client } = pkg

let allEntries = []
let emailMessage = ""

async function getDBdata() {

    const client = new Client({ connectionString: process.env.DB_CONNECTIONSTRING,})
        await client.connect()
        const res = await client.query("SELECT * FROM timestamps")
        for (let i = 0; i < res.rows.length; i++) {
            allEntries.push(`\n NEW ENTRY:
            Start date and time: ${res.rows[i]["start_date"]} ${res.rows[i]["start_time"]}
            End date and time: ${res.rows[i]["end_date"]} ${res.rows[i]["end_time"]}
            Project and description: ${res.rows[i]["project"]}, ${res.rows[i]["description"]}
            Working hours total: ${res.rows[i]["time_sum"]}`)
        }
        await client.end()

        console.log(allEntries)
        emailMessage = `The following entries were added to the database in the last 24H:\n ${allEntries}`
        console.log(emailMessage)
        await sendSNS()
}

getDBdata()

async function sendSNS() {

    const params = {
        Message: emailMessage,
        TopicArn: ' '
      }

      const run = async () => {
        try {
          const data = await snsClient.send(new PublishCommand(params))
          console.log("Success.",  data)
        } catch (err) {
          console.log("Error", err.stack)
        }
      }
    run()
}