require("dotenv/config.js")
const express       = require("express")
const app           = express()
const routes        = require("./router/routes.js")
const path          = require("path")
const cookieParser  = require("cookie-parser")

const {Server}    = require("socket.io")
const http        = require("http")
const socket      = require("./socket.js") 

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(routes)
// app.use((req, res) => res.render("404.ejs"))

app.use(express.static(path.join(__dirname, "public")))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const server      = http.createServer(app) 
const httpServer  = server.listen(3000)
console.log("Running on port 3000")
const io          = new Server(httpServer)
socket(io)