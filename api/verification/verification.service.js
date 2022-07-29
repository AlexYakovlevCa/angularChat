const utilService = require('../../services/util.service')
const { accountSid, authToken } = require('../../config')

  // Your Auth Token from www.twilio.com/console
const gVerifications = {}
const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
})

// sendVerificationRequest('0546113469') // michael
// sendVerificationRequest('0542552355') // alex


async function sendVerificationRequest(phoneNum) {
    const reciverPhone = utilService.getPhoneNumString(phoneNum)
    const userVerificationCode = utilService.generateVcode()
    console.log('hey')
    try {

        await client.messages.create({
            from: '+19475002002',
            to: reciverPhone,
            body: `Verification Code:${userVerificationCode}`
        })
        gVerifications[phoneNum] = userVerificationCode
        setTimeout(() => delete gVerifications[phoneNum], 1000 * 60 * 5)
        return

    } catch (e) { console.log(e) }

}

function matchVerificationToken(vCode, phoneNum) {
    return gVerifications[phoneNum] === vCode
}

module.exports = {
    sendVerificationRequest,
    matchVerificationToken
}