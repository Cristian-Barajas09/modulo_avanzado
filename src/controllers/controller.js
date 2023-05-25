const controller  = {}
const pool        = require("../models/mysql.connection.js")
const bcrypt      = require("bcrypt")
const jwt         = require("jsonwebtoken")

controller.user = {}

controller.getUsers = async (req, res) =>{
  const users = await pool.query("SELECT * FROM users")
  res.render("index.ejs", {users: users[0]})
}

controller.getUserByToken = async (req, res) => { 
  try {
    const user_token = req.cookies.token
  
    if(!user_token){
      return res.status(400).redirect("/signin")
    }
  
    const user = jwt.verify(user_token, "supersecreto")
  
    if(user){
      controller.user = user
      res.status(200).render("user.ejs", {user: controller.user})
    } else {
      res.status(400).render("user.ejs", {})
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

controller.createUser = async (req, res) => {
  try {
    const {name, age, email, password, confirm} = req.body
  
    if(password != confirm){
      return res.send("Las claves no coinciden!")
    }

    const hash = await bcrypt.hash(password, 10) 
  
    const result = await pool.query(`INSERT INTO users (name, age, email, password) VALUES ('${name}', '${age}', '${email}', '${hash}')`)
  
    res.redirect("/")
    
  } catch (error) {
    res.json(error)
  }
}

controller.updateView = async (req, res) => {
  const id = req.params.id
  const data = await pool.query(`SELECT name, age, email, password, rol FROM users WHERE id = ${id}`)
  const {name, age, email, password, rol} = data[0][0]
  res.render("update.ejs", {name, age, email, password, rol})
}

controller.updateUser = async (req, res) => {
  try {
    const {name, age, email, password, rol} = req.body

    console.log(rol)

    if(rol != "estandar" && rol != "admin"){
      return res.send("Rol incorrecto, debe ser o estandar o admin")
    }

    const result = await pool.query(`UPDATE users SET name = '${name}', age = '${age}', email = '${email}', password = '${password}', rol = '${rol}' WHERE email = '${email}'`)

    res.redirect("/")

  } catch (error) {
    res.json(error)
  }
}

controller.deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const result = await pool.query(`DELETE FROM users WHERE id = ${id}`)
    res.redirect("/")
  } catch (error) {
    res.json(error)
  }
}

controller.loginUser = async (req, res) => {
  const {email, password} = req.body
  if(!email || !password){
    return res.status(400).send("faltan campos por llenar")
  } 

  const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
  
  if(!user[0].length){ 
    return res.status(400).send("El usuario no existe")
  }

  const clave_correcta = await bcrypt.compare(password, user[0][0].password)

  if(!clave_correcta){
    return res.status(400).send("La clave es incorrecta")
  }

  const token = jwt.sign(user[0][0], "supersecreto") 

  res.cookie("token", token).status(200).redirect("/user")
}

controller.sendToSocket = () => controller.user

module.exports = controller