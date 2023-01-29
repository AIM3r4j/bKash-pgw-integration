const express = require("express")
const path = require("path");
const cors = require("cors")
const logger = require("morgan")
const session = require("express-session")
const mongoSessionStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")
const dbConnection = require("./lib/dbConnection")
const bkashToken = require("./modules/bkashToken")
require("dotenv").config()

const routes = require("./routes")

const app = express()
if (process.env.NODE_ENV === "PROD") {
  app.use(
    cors({
      origin: process.env.DOMAIN,
      methods: ["POST", "GET"],
      credentials: true,
    })
  )
} else {
  app.use(cors())
}

//Providing path to the frontend's static folder
app.use(express.static(path.join(__dirname, "../frontend/dist/spa")));

const dbURI = process.env.dbURI
const port = process.env.PORT || 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(logger("dev"))
if (process.env.NODE_ENV === "PROD") {
  app.set("trust proxy", 1)
  app.enable("trust proxy")
}
app.use(
  session({
    name: "bkash-payment",
    proxy: process.env.NODE_ENV === "PROD" ? true : undefined,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "PROD" ? true : false,
      // httpOnly: true,
      sameSite: process.env.NODE_ENV === "PROD" ? "none" : "lax",
      domain: process.env.NODE_ENV === "PROD" ? process.env.DOMAIN : null,
    },
    resave: false,
    saveUninitialized: false,
    store: mongoSessionStore({
      uri: dbURI,
      collection: "sessions",
    }),
  })
)

app.use(flash())

dbConnection
  .connectDB()
  .then(async () => {
    console.log("Connected to database")
    if ((await dbConnection.countTokenDocs()) == 0) {
      const result = await bkashToken.fetchToken()
      if (result.success == false) {
        throw Error(result.error.message)
      }
      console.log("Tokens fetched initially")
    } else {
      const result = await bkashToken.refreshToken()
      if (result.success == false) {
        throw Error(result.error.message)
      }
      console.log("Tokens refreshed")
    }
  })
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Server is listening to port ${port}\nAddress: ${process.env.BASE_URL}:${port}\n`
      )
    })
  })
  .catch((err) => console.error(err))

app.use("/api", routes)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/spa/index.html"))
})
