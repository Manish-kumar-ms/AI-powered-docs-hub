import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


export const signup = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

         const user=await UserModel.findOne({email,role})
         if(user){
            return res.status(400).json({ message: "User already exists" });
         }

         const hashedPassword=await bcrypt.hash(password,10)
        
         const newUser=new UserModel({
             name,
             email,
             password:hashedPassword,
             role,
             
         })
         await newUser.save()

         const jwtToken = jwt.sign(
         {name:newUser.name, _id:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn :'24h'}
    )

      res.cookie("token", jwtToken, {
            httpOnly: true,
            maxAge: 1*24 * 60 * 60 * 1000, // 1 day
             sameSite: "None",
            secure: true,  // Set to true if using HTTPS 
     })


       return res.status(201).json({ success: true, message: "User signed up" ,user:newUser});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "error while signing up" });
    }
}


export const login=async(req, res) => {
    try {
          const { email, password, role } = req.body;

    if(!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email, role });

    if(!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });
    }
    const isequal=await bcrypt.compare(password, user.password);

    if(!isequal) {
        return res.status(400).json({
            success: false,
            message: "password is incorrect"
        });
    }

    const jwtToken = jwt.sign(
         {name:user.name, _id:user._id},
            process.env.JWT_SECRET,
            {expiresIn :'24h'}
    )

      res.cookie("token", jwtToken, {
            httpOnly: true,
            maxAge: 1*24 * 60 * 60 * 1000, // 1 day
             sameSite: "None",
            secure: true,  // Set to true if using HTTPS 
     })

    res.status(200).json({
        success: true,
        message: "User logged in successfully", 
        jwtToken,
        email,
        name:user.name,
        user
    });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "There is some problem on login"
        });
        
    }
  
}


export const CurrentUser=async(req,res)=>{
   try {
       const user=await UserModel.findById(req.user._id).select("-password");
       if(!user){
           return res.status(404).json({message:"User not found"});
       }
       res.status(200).json({success:true,user});
   } catch (error) {
       console.error(error);
       return res.status(500).json({
           success: false,
           message: "There is some problem while fetching current user"
       });
   }
   
}



export const logout = (req, res) => {
    try {
           res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "There is some problem on logout"
        });
    }
}
