const cors = require('cors')
const express = require('express')
const EventEmitter = require('events')
const { Server } = require('socket.io')
const { createServer } = require('http')
const puppeteer = require('puppeteer-core');
const login = require('./src/controller/login');
const follows = require('./src/controller/follows');
const unfollows = require('./src/controller/unfollows');
const errorRouting = require('./src/middleware/errorRouting');
const routeNotFound = require('./src/middleware/routeNotFound');
const passingBrowser = require('./src/middleware/passingBrowser');
const getCookiesCredentials = require('./src/middleware/getCookiesCredentials');

const server = ({ browser, server, io, app, PORT }) => {
  console.log(browser)
  app.use(express.json())

  app.use(cors({
    origin: "*"
  }))

  app.get("/", (req, res) => res.send("Hi, Bakunya!"))

  app.post("/login", passingBrowser(browser), login)

  app.post("/unfollows", passingBrowser(browser), getCookiesCredentials, unfollows)

  app.post("/follows", passingBrowser(browser), getCookiesCredentials, follows)

  app.use(routeNotFound)

  app.use(errorRouting)

  io.of('/unfollows').on('connection', socket => {
    global.event.on("unfollows", (message, username) => {
      socket.emit(`unfollows/${username ?? ''}`, message)
    })
  })

  io.of('/follows').on('connection', socket => {
    global.event.on("follows", (message, username) => {
      socket.emit(`follows/${username ?? ''}`, message)
    })
  })
  
  server.listen(PORT, () => console.log(`running at port ${PORT}`))
}

;(async () => {
  try {
    const app = express()
    const httpServer = createServer(app)
    const PORT = process.env.PORT || 8000
    const io = new Server(httpServer, { 
      cors: {
        origin: '*',
      }
    })
    const browser = await puppeteer.launch({ 
      headless: true, 
      executablePath: "/usr/bin/google-chrome", 
      args: ["--no-sandbox", "--disabled-setupid-sandbox"] 
    });
    global.event = new EventEmitter()
    
    server({
      io,
      app,
      browser,
      server: httpServer,
      PORT
    })
  } catch(er) {
    console.log(er)
  }
})()