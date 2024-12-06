import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import 'reflect-metadata'

import helmet from 'helmet'
import { appDataSource } from './constants/appDataSource'
import route from './routes'

const app = express()
dotenv.config()
const port = process.env.APP_PORT
const corsOrigin = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Nếu cần thiết cho cookie và authentication
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOrigin))
app.use(helmet())

//Routes init
route(app)

//Init Datasource
const main = async () => {
  await appDataSource.initialize()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

//listen port
app.listen(port, () => {
  console.log(`Warehouse management web server is listening on port ${port}`)
})
