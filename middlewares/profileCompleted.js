async function profileCompleted(req,res,next){
    try{
        const user=req.user
        if(!user.isProfileCompleted){
            return res.status(403).json({
                status:false,
                message:"The profile is not completed"
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
                status:false,
                message:err.message
            })
    }
}

module.exports={
    profileCompleted
}