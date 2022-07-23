const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')

function requireAuth(req, res, next) {
  // MUST HAVE SOME REQUIREAUTH HERE !
  const token = req.cookies.accessToken
  console.log(req.cookies)
  if (!token) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.verifyJwt(token)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  next()
}

function requireAdmin(req, res, next) {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(token)
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
