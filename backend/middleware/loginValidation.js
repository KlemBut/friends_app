const userScheme = require('../models/userScheme')
const bcrypt = require('bcrypt');

module.exports = {
    loginValidation: async (req, res, next) => {
        const {name, password} = req.body
        
        const currentUser = await userScheme.findOne({name: name})
        if (!currentUser) return res.send({success: false, error: "Username not found"})
        const passMatch = await bcrypt.compare(password, currentUser.password)
        if (!passMatch) return res.send ({success: false, error: "Wrong password"})
        next()
    }
}