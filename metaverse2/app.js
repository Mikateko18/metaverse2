const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
var smtpTransport = require('nodemailer-smtp-transport'); 
const jwt = require('jsonwebtoken')
const Role = mongoose.role;


const app = express();

app.use(express.json());
app.use(express.static("Styles"));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://Mikateko:test123@cluster1.ujdfq9n.mongodb.net/test", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  FirstName:String,
  LastName:String,
  email:String,
  password:String,
  WalletID:String,
  Gender:String,
  Occupation:String,
  Country:String,
  Province:String,
 

  
  //tatus: {
      //type: String,
      //enum: ['Pending', 'Active'],
      //default: 'Pending'
    //},
    //confirmationCode: { 
      //type: String, 
      //unique: true },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ],
      
      //WalletID: String,
});
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret,  encryptedFields:["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/Login.html");
})
app.get("/landingPage", function(req, res) {
  res.sendFile(__dirname + "/landingPage.html");
})
app.get("/Login.html", function(req, res) {
  res.sendFile(__dirname + "/Login.html");
})
app.get("/AR.html", function(req, res) {
  res.sendFile(__dirname + "/AR.html");
})
app.get("/failureVerify.html", function(req, res) {
  res.sendFile(__dirname + "/Login.html");
})
app.get("/ARWebGL.html", function(req, res) {
  res.sendFile(__dirname + "/ARWebGL.html");
})
app.get("/ARMixedReality.html", function(req, res) {
  res.sendFile(__dirname + "/ARMixedReality.html");
})

app.get("/Register.html", function(req, res) {
  res.sendFile(__dirname + "/Register.html");
})
app.get("/Help.html", function(req, res) {
  res.sendFile(__dirname + "/Help.html");
})
app.get("/success.html", function(req, res) {
  res.sendFile(__dirname + "/success.html");
})
app.get("/Terms.html", function(req, res) {
  res.sendFile(__dirname + "/Terms.html");
})
app.get("/walletID.html", function(req, res) {
  res.sendFile(__dirname + "/walletID.html");
})
app.get("/forgot-password.html", (req, res, next) => {
  res.sendFile(__dirname + "/forgot-password.html");
})
app.post("/forgot-password.html", (req, res, next) => {
  const {email} = req.body;
  //make sure user exixts
  User.findOne({ email: req.body.email,status: 'Active' },function(err,user) {
    if(!user){
      res.sendFile(__dirname + "/failureLogin.html");
    }else{
    
    sendMail2(email, user._id);
    res.sendFile(__dirname + "/emailsuccessPassword.html");
  }
});
  });
  const payload = {
    email: userSchema.email,

  };
  //const token = jwt.sign(payload, secret);
  //const sendMail2 = (email, _id) => {
    //var transport = nodemailer.createTransport({
  
      //service: 'gmail',
  //auth: {
  //user: 'nonreply18@gmail.com',
  //pass: 'nvdouhayavahbguj',
  //}
  //});
  //var mailOptions;
  //mailOptions = {
   //from:"Metaverse",
   //to: email,
   //subject: 'Reset password',
    //html:
    
   // `<p>Hello</p>
    
    //<P>You are receiving this because you (or someone else) have requested the reset of the password for your account.
    //Please click on the following link, or paste this into your browser to complete the process: 
    //<a href=http://146.64.217.202:8501/reset-password.html/${_id}/${token}>here </a> </p> . 
    //<p> If you did not request this, please ignore this email and your password will remain unchanged.</p>
   // `
  
  //};
  
  //transport.sendMail(mailOptions, function(error, response) {
  //if (error) {
   // console.log(error);
  //} else {
    //console.log("Message sent");
  //}
  
  //});
  //}
  

//app.get("/reset-password.html/:_id/:token", (req, res, next) => {
  //const {token} = req.params;
  //try {
    //const payload = jwt.verify(token, secret);
    //res.sendFile(__dirname + "/reset-password.html");
  //} catch (error) {
    //console.log(error);
  //}
  
  
//})
app.post("/reset-password.html/:_id/:token", (req, res, next) => {
  const {token} = req.params;
  const {newPassword} = req.body.newPassword;
  try {
    const payload = jwt.verify(token, secret);
    
  } catch (error) {
    console.log(error);
  }
  User.findOne({_id: req.params._id },function(err,user) {

    if (!user) {
         
        res.sendFile(__dirname + "/failureRegistration.html");
    }
    user.password = req.body.newPassword;
    user.save();
    res.sendFile(__dirname + "/successfulReset.html");
  
});
});

app.post("/Register.html", async (req, res)  => {
  const email = req.body.email;
  //const status =  {
    //type: String,
    //enum: ['Pending', 'Active'],
    //default: 'Pending'
 // };

User.findOne({ email: req.body.email, },function(err,user) {
  
      if (user) {

          res.sendFile(__dirname + "/failureRegistration.html");


      } else {
        //const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        //let tokenn = '';
        //for (let i = 0; i < 25; i++) {
           // tokenn += characters[Math.floor(Math.random() * characters.length )];
       // }
        const newUser= new User({
          FirstName:req.body.FName,
          LastName:req.body.LName,
          email:req.body.email,
          password: req.body.password,
          WalletID: req.body.WalletID,
          Gender: req.body.Gender,
          Occupation: req.body.Occupation,
          Country: req.body.Country,
          Province: req.body.Province,
         

          //confirmPassword:req.body.confirmPassword,
          //confirmationCode: tokenn,

          
         
        });
       
        newUser.save();
        //sendMail(email,newUser.confirmationCode, newUser.FirstName);
    
        res.sendFile(__dirname + "/successfulRegistration.html");
}
});
});


//const sendMail = (email, confirmationCode,FirstName) => {
 
  //var transport = nodemailer.createTransport({

    //service: 'gmail',
//auth: {
//user: 'nonreply18@gmail.com',
//pass: 'nvdouhayavahbguj',
//}
//});
//var mailOptions;
//mailOptions = {
 //from:"Mikateko",
 //to: email,
 //subject: "Please confirm your account",
    //html: `<h1>Email Confirmation</h1>
        //<p> Hello ${FirstName} </p>
        //<p>Thank you for subscribing to Metaverse. Please confirm your email by clicking on the following link</p>
        //<a href=http://localhost:8501/verify/${confirmationCode}> Click here</a>
       // </div>`,
 

//};

//transport.sendMail(mailOptions, function(error, response) {
//if (error) {
 // console.log(error);
//} else {
 // console.log("Message sent");
//}

//});
//}
//app.get("/verify/:confirmationCode", async(req,res, user) => {
  
//User.findOne({
    //confirmationCode: req.params.confirmationCode,
    
 // })

  //.then((user) => {
    //if (!user) {
      //res.sendFile(__dirname + "/failureVerify.html");
    //}

    //user.status = "Active";
    //user.save((err) => {
     // res.sendFile(__dirname + "/successfulRegistration.html");
      //if (err) {
       // res.status(500).send({ message: err });
       // return;
      //}
   // });
  //})
  //.catch((e) => console.log("error", e));

//});



app.post("/Login.html", function(req, res) {
 const email = req.body.email;
 const password = req.body.password;
 const newPassword = req.body.password;
 const WalletID = req.body.WalletID;
 //const status =  {
  //type: String,
  //enum: ['Pending', 'Active'],
  //default: 'Pending'
//};

 let user =  User.findOne({ email: email, }, function(err, user){
    if(user){

 User.findOne({email:email,}, function(err, foundUser) {

 if ( foundUser.email === email && foundUser.password === password && foundUser.WalletID === WalletID) {

      res.sendFile(__dirname + "/success.html");

 }
 else {
   if (foundUser.email === email && foundUser.password !== password && foundUser.WalletID === WalletID) {

    res.sendFile(__dirname + "/InncorrectPassword.html");

   }
   
   
   if (foundUser) {
     if (foundUser.WalletID !== WalletID && foundUser.email === email && foundUser.password === password) {
         res.sendFile(__dirname + "/incorrectWalletID.html");
     }

   }

 }


});
}else{
  if(!user)
{
  res.sendFile(__dirname + "/failureLogin.html");
}
}

});

});

app.post("/success.html", function(req, res) {
  res.sendFile(__dirname + "/success.html");
});
app.post("/walletID.html", function(req, res) {
  res.sendFile(__dirname + "/walletID.html");
});
app.post("/AR.html", function(req, res) {
  res.sendFile(__dirname + "/ARWebGL.html");
});
app.post("/ARWebGL.html", function(req, res) {
  res.sendFile(__dirname + "/ARWebGL.html");
});
app.post("/ARMixedReality.html", function(req, res) {
  res.sendFile(__dirname + "/ARMixedReality.html");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8501;
};


app.listen(port, function() {

  console.log ("Server has started successfully");
})