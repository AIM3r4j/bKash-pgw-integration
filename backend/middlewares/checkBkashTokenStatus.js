const Token = require("../MVC Structure/models/token")
const checkBkashTokenStatus = async (req, res, next) => {
  try {
    const tokens = await Token.findOne(
      {},
      {
        initiatedAt: true,
        bkash_token: true,
        bkash_refresh_token: true,
      }
    )
    const timeDiffInMinutes = Math.ceil(
      (Date.now() - tokens.initiatedAt) / (1000 * 60)
    )
    if (timeDiffInMinutes >= 55) {
      const result = await bkashToken.refreshToken()
      if (result.success == false) {
        throw Error(result.error.message)
      } else {
        req.session.bkash_token = result.data.bkash_token
        req.session.bkash_refresh_token = result.data.bkash_refresh_token
        next()
      }
    } else {
      req.session.bkash_token = tokens.bkash_token
      req.session.bkash_refresh_token = tokens.bkash_refresh_token
      next()
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = checkBkashTokenStatus
