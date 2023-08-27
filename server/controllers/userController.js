const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const passport = require('passport');
const UserVerification = require('../models/userVerificationModel')
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
const GoogleUser = require("../models/googleModel")

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    verified: false,
  });

  const otp = generateOTP();

  // Setup email data
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Registration",
    text: `Your OTP for registration: ${otp}, expires in 5 mins`,
  };


  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    } else {
      console.log("OTP sent:", info.response);
      const verification = new UserVerification({
        user_id: user._id,
        otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
      });
      verification.save();

      res.status(201).json({ _id: user.id, email: user.email });
    }})

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});


// Verifying OTP
const verifyOTP = asyncHandler(async (req, res) => {
   let { user_id, otp } = req.body;
 
   if(!user_id, !otp){
    throw new Error("Required Data not provided")
   } else {
   
     const OTPRecords = await UserVerification.find({
      user_id
     }); // Finding OTP Record
     
     

     if(OTPRecords.length <= 0){
      throw new Error("Account doesn't exist")
     } else {
      const user = await User.findOne({ _id: user_id });  // Finding User of OTP
      const expiresAt = OTPRecords[0].expiresAt

      const userOTP = OTPRecords[0].otp
    
      if(expiresAt < Date.now()){ // Checking if OTP is Expired
        await UserVerification.deleteMany({ user_id }) 
        throw new Error("OTP has expired")
      } else {
        if(otp === userOTP){
          await User.updateOne({ _id: user_id}, {verified: true}) // Verifying User
          await UserVerification.deleteMany({ user_id})
          const accessToken = jwt.sign(
            {
              user: {
                username: user.username,
                email: user.email,
                id: user.id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" } // Providing an Access Token
          );
          console.log("hes verified")
          res.status(200).json({
            status: "Verified",
            message: "User Verified",
            accessToken
          })
        }
      }
     }
   }


})

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;


  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

// Forget Password OTP
const forgetPass = asyncHandler(async (req, res) => {
   const { email } = req.body

   if(!email){
    res.status(400)
    throw new Error("Fill all fields!")
   }

   const user = await User.findOne({ email });
   if(user){
    const otp = generateOTP(); // Generating OTP

    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP for Resetting your Password: ${otp}, expires in 5 mins`,
    };
    // Sending Mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("OTP sent:", info.response);
        const verification = new UserVerification({
          user_id: user._id,
          otp,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
        });
        verification.save();
  
        res.status(201).json({ _id: user.id, email: user.email });
      }})
   } else{
    res.status(401)
    throw new Error("User doesn't exist")
   }
})


// Verifying the Reset Password OTP
const verifyResetPassOTP = asyncHandler(async (req, res) => {
  let { user_id, otp } = req.body;

  if(!user_id, !otp){
   throw new Error("Required Data not provided")
  } else {
  
    const OTPRecords = await UserVerification.find({
     user_id
    });
    
    

    if(OTPRecords.length <= 0){
     throw new Error("Account doesn't exist")
    } else {
     const user = await User.findOne({ _id: user_id }); 
     const expiresAt = OTPRecords[0].expiresAt

     const userOTP = OTPRecords[0].otp
   
     if(expiresAt < Date.now()){
       await UserVerification.deleteMany({ user_id })
       throw new Error("OTP has expired")
     } else {
       if(otp === userOTP){
         await UserVerification.deleteMany({ user_id})
         const accessToken = jwt.sign(
           {
             user: {
               username: user.username,
               email: user.email,
               id: user.id,
             },
           },
           process.env.ACCESS_TOKEN_SECRET,
           { expiresIn: "1d" }
         );
         console.log("hes verified")
         res.status(200).json({
           status: "Verified",
           message: "User Verified",
           accessToken
         })
       }
     }
    }
  }


})

// Setting the New Password
const setNewPass = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body

  if(!user_id, !password){
    throw new Error("Required Data not provided")
   } else {
   
     const userRecords = await User.findOne({
      _id: user_id
     });

     const hashedPassword = await bcrypt.hash(password, 10);

     if(userRecords.length <= 0){
      throw new Error("Account doesn't exist")
     } else  {

          await User.updateOne({ _id: user_id}, {password: hashedPassword})
          res.status(204).json({
           message: "User Updated"
          })
        }
      }
})


const googleLogin = asyncHandler(async (req, res) => {
   const { name, email, verified } = req.body

   if (!name || !email || !verified) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  const googleUserAvailable = await GoogleUser.findOne({ email });
  if (userAvailable || googleUserAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const user = await GoogleUser.create({
    name,
    email,
    verified,
  });

  const accessToken = jwt.sign(
    {
      user: {
        username: user.name,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" } // Providing an Access Token
  );
  console.log("hes verified")
  res.status(200).json({
    status: "Verified",
    message: "User Verified",
    accessToken,
    _id: user.id
  })
});

const googleVerifier = asyncHandler(async (req, res) => {
  const { email, _id } = req.body 
  console.log(email, _id)

  if(!email || !_id){
    res.status(400)
    throw new Error("All Fields must be filled")
  }

  const googleUserAvailable = await GoogleUser.findOne({ email });
  console.log(googleUserAvailable)
  if (!googleUserAvailable) {
    res.status(400);
    throw new Error("User not registered!");
  } else{ 
    res.status(401).json({
      Status: "User not fulfilled."
    })
    console.log("He matched the Id")
    const accessToken = jwt.sign(
      {
        user: {
          username: googleUserAvailable.name,
          email: googleUserAvailable.email,
          id: googleUserAvailable.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    console.log("He signed the token")
    res.status(200).json({ accessToken });
 
 }

})

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser, googleLogin, verifyOTP, forgetPass, verifyResetPassOTP, setNewPass, googleVerifier };
