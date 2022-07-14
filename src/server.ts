import http from 'http'
import express, { Request, Response, NextFunction } from 'express'
import apiRouter from './routes'
import sequelize from './config/sequelize'
import path from 'path'
import { Outbox } from './models/outbox.model'
import socketio from 'socket.io'
import arrayEqual from './utils/array-equal'
const app = express()

const port = '3000'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', apiRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

/** Create HTTP server. */
const server = http.createServer(app)
/** Listen on provided port, on all network interfaces. */
server.listen(port)

const io = new socketio.Server(server)

/** Event listener for HTTP server "listening" event. */
server.on('listening', () => {
  sequelize.authenticate().then(async () => {
    try {
      await sequelize.sync({ force: true })
    } catch (err: any) {
      console.error(err.message)
    }
  })

  console.log(`Listening on port:: http://localhost:${port}/`)
})

const fetchOutboxes = async (): Promise<Outbox[]> => await Outbox.findAll()

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

// To prevent re-renders when no update
let cachedOutboxes: Outbox[]

// Polling the outbox table every 5s
const run = async () => {
  await delay(5000)
  const outboxes = await fetchOutboxes()
  if (cachedOutboxes == null || !arrayEqual(outboxes, cachedOutboxes)) {
    io.emit('outboxes', outboxes)
  }
  await run()
}
run()

io.on('connection', function (socket) {
  console.log('client connected')
  socket.on('disconnect', function () {
    console.log('client disconnected')
  })
})

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/user', (req, res) => {
  res.render('user')
})
