const {sendToSocket} = require("./controllers/controller.js")
const pool = require("./models/mysql.connection.js")

module.exports = function(io){
  io.on("connection", socket =>{
    let user = sendToSocket()
    console.log(socket.id)

    if(user){

      socket.emit("saludar", "hola")
      
      socket.on("client:connected", async () =>{
        try {
          await pool.query(`UPDATE users SET status = 1 WHERE id = ${user.id}`)
          console.log(`El usuario ${user.name} se ha conectado`)
        } catch (error) {
          console.log("no hay usuario por que activar")
        }
      })
  
      socket.on("disconnect", async () => {
        try {
          await pool.query(`UPDATE users SET status = 0 WHERE id = ${user.id}`)
          console.log(`El usuario ${user.name} se ha desconectado`)
        } catch (error) {
          console.log("no hay usuario por que desactivar")
        }
      })
    }
  })
}