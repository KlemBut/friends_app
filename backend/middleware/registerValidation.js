const userScheme = require('../models/userScheme')
module.exports = {
    registerValidation: async (req, res, next) => {
        const {name, passwordOne, passwordTwo, gender, birthday, city} = req.body
        const duplicatUsername = await userScheme.findOne({name: name})
        const age = Math.floor((new Date() - new Date(birthday)) / 31557600000);
        if (!name || !passwordOne || !passwordTwo || !gender || !birthday || !city) return res.send({success: false, error: "All fields need to be present"})
        if (duplicatUsername) return res.send({success: false, error: "User already exists"})
        if (passwordOne !== passwordTwo) return res.send({success:false, error: "Passwords do not match"})
        if (age < 18) return res.send({success: false, error: "You need to be at least 18 to register"})
        next()
    }
}
