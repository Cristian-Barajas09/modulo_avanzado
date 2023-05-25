const {Router} = require("express")
const router = Router()
const {
  getUsers, getUserByToken, createUser, updateView, updateUser, deleteUser, loginUser
} = require("../controllers/controller.js")

router.get("/", getUsers)
router.get("/user", getUserByToken)
router.get("/create", (req, res)=>res.render("create.ejs"))
router.get("/signin", (req, res)=>res.render("login.ejs"))
router.get("/update/:id", updateView)
router.get("/delete/:id", deleteUser)

router.post("/create", createUser)
router.post("/update", updateUser)
router.post("/login", loginUser)

module.exports = router
