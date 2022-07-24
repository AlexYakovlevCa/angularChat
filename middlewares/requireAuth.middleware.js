const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')

function requireAuth(req, res, next) {
  // MUST HAVE SOME REQUIREAUTH HERE !
  const {accessToken} = req.cookies
  if (!accessToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.verifyJwt(accessToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  next()
}

function requireAdmin(req, res, next) {
  const {accessToken} = req.cookies
  if (!accessToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.verifyJwt(accessToken)
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.userName + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
