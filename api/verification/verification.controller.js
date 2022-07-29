const { response } = require('express')
const { info } = require('../../services/logger.service')
const verificationService = require('./verification.service')


async function sendVerification(req, res) {
    const { phoneNum } = req.params
    console.log(phoneNum, 'inside verification - send')
    if (phoneNum) {
        try {
            const verificationToken = await verificationService.sendVerificationRequest(phoneNum)
            res.send(verificationToken)

        } catch (e) {
            console.log(e, 'faild at getting verification token')
        }

    }


}

async function matchVerification(req, res) {
    const {vCode,phoneNum} = req.body
    console.log(vCode,phoneNum, 'inside verificationMatch')
    try{
        const verifiedToken =  verificationService.matchVerificationToken(vCode,phoneNum)
        res.send(verifiedToken)

    }catch(e){
        console.log(e)
        
    }
}

module.exports={
    sendVerification,
    matchVerification
}