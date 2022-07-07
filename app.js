import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

process.stdout.write(`Hello! Please add your working hours in this format:\n
2022-01-30,08:05,2022-01-30,17:05,ProjectName,Today I coded\n
`)

//CORRECT DATA
// 2022-07-07,09:04,2022-07-07,17:19,Project MiauMiau,I coded and ate lunch
// 2022-07-06,09:04,2022-07-06,12:19,Project Torstai,I coded and ate lunch
// 2022-07-07,09:00,2022-07-07,17:50,Project Marsu,I coded and did some stuff
//INVALID DATA
// 2022-07-05, 09:04, 2022-07-04, 17:19, Project Elmer, I coded and ate lunch
// 2023-07-05, 09:04, 2022-07-05, 17:19, Project Elmer, I coded and ate lunch
// 2022-07-05,09:04,2022-07-05,17:19,Project Elmer,I coded and ate lunch;--

let allInput = ""
let startDate = ""
let startTime = ""
let endDate = ""
let endTime = ""
let projectName = ""
let description = ""
let time_sum = ""

async function collectTimestamp(userInput) {
    let input = userInput.toString().trim()
    allInput = input
    let inputSplit = input.split(",")
    startDate = inputSplit[0]
    startTime = inputSplit[1]
    endDate = inputSplit[2]
    endTime = inputSplit[3]
    projectName = inputSplit[4]
    description = inputSplit[5]
    validate()
    let startSplit = startTime.split(':')
    let startMin = parseInt(startSplit[1])
    let startHour = parseInt(startSplit[0])
    let endSplit = endTime.split(':')
    let endMin = parseInt(endSplit[1])
    let endHour = parseInt(endSplit[0])
    let totalHours = endHour - startHour
    let totalMinutes = endMin - startMin
    time_sum = (`${totalHours}:${totalMinutes}`)
    process.stdout.write(`\nThank you, your input was the following: \n`)
    process.stdout.write(`
    Start date: ${startDate}
    Start time: ${startTime}
    End date: ${endDate}
    End time: ${endTime}
    Project name: ${projectName}
    Description: ${description}
    `)
    await toDB()
    process.exit()
}

let validate = () => {
    let dayOfStart = parseInt(startDate.split("-")[2])
    let monthOfStart = parseInt(startDate.split("-")[1])
    let yearOfStart = parseInt(startDate.split("-")[0])
    let dayOfEnd = parseInt(endDate.split("-")[2])
    let monthOfEnd = parseInt(endDate.split("-")[1])
    let yearOfEnd = parseInt(endDate.split("-")[0])
    let format = /[!@#$%^&*()_+\=\[\]{};'"\\|<>\/?]+/
    if (format.test(allInput)) {
        process.stdout.write(`\nSorry there was a probelm with your input:\nNo special characters aloud.\nRestart to try again.\n`)
        process.exit()
    }
    if (startDate === "" || startTime === "" || endDate === "" || endTime === "" || projectName === "" || description === "") {
        process.stdout.write(`Sorry there was a probelm with your input:\nPlease fill in all the fields.\nRestart to try again.`)
        process.exit()
    }
    if (yearOfStart === yearOfEnd) {
        if (monthOfEnd < monthOfStart) {
            process.stdout.write(`Sorry there was a probelm with your input:\nEnd date can't be after start date.\nRestart to try again.`)
            process.exit()
        }
        if (monthOfEnd === monthOfStart && dayOfEnd < dayOfStart) {
            process.stdout.write(`Sorry there was a probelm with your input:\nEnd date can't be after start date.\nRestart to try again.`)
            process.exit()
        }
    }
    if (yearOfStart > yearOfEnd) {
        process.stdout.write(`Sorry there was a probelm with your input:\nEnd date can't be after start date.\nRestart to try again.`)
        process.exit()
    }
    if (yearOfEnd > yearOfStart) {
        if (monthOfEnd !== 12 && monthOfStart === 1) {
            process.stdout.write(`Sorry there was a probelm with your input:\nEnd date can't be after start date.\nRestart to try again.`)
            process.exit()
        }
    }
    return
}

async function toDB() {
    const values = []
    values.push(startDate)
    values.push(startTime)
    values.push(endDate)
    values.push(endTime)
    values.push(projectName)
    values.push(description)
    values.push(time_sum)
  
    const client = new Client({ connectionString: process.env.DB_CONNECTIONSTRING,})
    await client.connect()
    const res = await client.query("INSERT INTO timestamps (start_date,start_time,end_date,end_time,project,description,time_sum) VALUES ($1,$2,$3,$4,$5,$6,$7)", values)
    await client.end()
}

process.stdin.on('data', collectTimestamp)
