const { Router } = require("express");
const User = require('../models/user');

const router = Router();


router.get('/signin', (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

// signin route
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    try{ 
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // console.log("Token : ", token);
    
        return res.cookie("token",token).redirect("/");
    } catch(error){
        return res.render("signin",{
            error:"Incorrect email or password",
        });
    }
})


router.get("/logout",(req, res)=>{
    res.clearCookie("token").redirect("/")
})



// signUp route
router.post("/signup", async (req, res) => {

    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    // when user is created it will redirect to the home page
    return res.redirect("/");

});

module.exports = router;












