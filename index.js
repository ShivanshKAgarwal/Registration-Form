const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();


const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.7qic2rf.mongodb.net/registrationFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology: true,

});


//registration schema
const registrationSchema = new mongoose.Schema({
    username : {type : String, required:true},
    email : {type :String , required:true},
    password : { type : String ,required:true}
})

//mode of registtration schema
const Registration = mongoose.model("Registration", registrationSchema)

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.post("/register", async (req, res) =>{
    try{
        const {username, email, password} = req.body;

        const existingUser = await Registration.findOne({email: email});
        if(!existingUser){
            const registrationData = new Registration((
                username,
                email,
                password 
             ));
             await registrationData.save();
             res.redirect("/success");   
        }
        else{
            console.log("User Already Exist");
            res.redirect("/error");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success", (req,res) =>{
    res.sendFile(__dirname+"/pages/sucess.html");
})

app.get("/error", (req, res) =>{
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});