module.exports = {
    picValidation: (req, res, next) => {
        const {imgUrl} = req.body
        if(!imgUrl) return res.send({success: false, error: "Field can't be empty"})
        if(!imgUrl.includes("http")) return res.send({success: false, error: "URL has to be correct"})
        next()
    }
}