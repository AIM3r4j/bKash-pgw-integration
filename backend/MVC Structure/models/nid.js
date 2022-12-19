const mongoose = require("mongoose")
const Schema = mongoose.Schema

const nidSchema = new Schema({
  nidNumber: {
    type: String,
    required: true,
  },
  dummyData: {
    type: String,
    required: true,
  },
  validated: {
    type: String,
    required: true,
    default: "none",
  },
})

const Nid = mongoose.model("nid", nidSchema)
module.exports = Nid
