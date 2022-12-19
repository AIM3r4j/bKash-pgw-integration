const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tokenSchema = new Schema({
  bkash_token: {
    type: String,
    required: true,
  },
  bkash_refresh_token: {
    type: String,
    required: true,
  },
  initiatedAt: {
    type: String,
    required: true,
  },
})

const Token = mongoose.model("token", tokenSchema)
module.exports = Token
