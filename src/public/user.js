const socket = io()

socket.emit("client:connected")

socket.on("disconnect", () => console.log("c murio"))
