require("dotenv").config()

const dbURI = process.env.dbURI
const mongoose = require("mongoose")

let db

const connectDB = () => {
  try {
    db = mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    return db
  } catch (error) {
    console.log(error)
  }
}

const getDB = () => {
  return db
}

const close = async () => {
  await mongoose.connection.close()
}

const countTokenDocs = async () => {
  return await mongoose.connection.db.collection("tokens").countDocuments()
}

module.exports = {
  connectDB,
  getDB,
  close,
  countTokenDocs,
}
