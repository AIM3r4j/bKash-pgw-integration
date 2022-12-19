require("dotenv").config()
const logger = require("../modules/el")
const axios = require("axios")
const Token = require("../MVC Structure/models/token")

const fetchToken = async () => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant",
      headers: {
        accept: "application/json",
        username: process.env.BKASH_USERNAME,
        password: process.env.BKASH_PASSWORD,
        "content-type": "application/json",
      },
      data: {
        app_key: process.env.BKASH_API_KEY,
        app_secret: process.env.BKASH_API_SECRET,
      },
    }

    const response = await axios.request(options)
    if (response.data.statusCode == "0000") {
      const token = new Token({
        bkash_token: response.data.id_token,
        bkash_refresh_token: response.data.refresh_token,
        initiatedAt: Date.now(),
      })
      token.save()
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        error: {
          message: response.data.statusMessage,
        },
      }
    }
  } catch (error) {
    return error
  }
}

const refreshToken = async () => {
  try {
    const refresh_token = (
      await Token.findOne(
        {},
        {
          bkash_refresh_token: true,
        }
      )
    ).bkash_refresh_token
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/refresh",
      headers: {
        accept: "application/json",
        username: process.env.BKASH_USERNAME,
        password: process.env.BKASH_PASSWORD,
        "content-type": "application/json",
      },
      data: {
        app_key: process.env.BKASH_API_KEY,
        app_secret: process.env.BKASH_API_SECRET,
        refresh_token: refresh_token,
      },
    }

    const response = await axios.request(options)
    if (response.data.statusCode == "0000") {
      await Token.updateOne(
        {},
        {
          bkash_token: response.data.id_token,
          bkash_refresh_token: response.data.refresh_token,
          initiatedAt: Date.now(),
        }
      )
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        error: {
          message: response.data.statusMessage,
        },
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  fetchToken,
  refreshToken,
}
