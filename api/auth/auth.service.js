const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/index');

async function login(phoneNum) {
    // logger.debug(`auth.service - login with phone number: ${phoneNum}`)
    const user = await userService.getByPhoneNum(phoneNum)
    // if (user) user.token = signJwt(user)
    return user
}

async function signup(credentials) {
    const { phoneNum, userName } = credentials
    // logger.debug(`auth.service - signup with phoneNum: ${phoneNum}, userName: ${userName}`)
    if (!phoneNum || !userName) return Promise.reject('Missing required signup information')
    return userService.add(credentials)
}


function signJwt(user) {
    return jwt.sign(user, jwtSecret)
}

function verifyJwt(token) {
    try {
        const user = jwt.verify(token, jwtSecret)
        return user
    } catch (err) {
        return null
    }
}


module.exports = {
    signup,
    login,
    signJwt,
    verifyJwt
}