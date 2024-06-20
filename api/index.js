const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

const User = require('./models/User');
const Agent = require('./models/Agent');
const Policy = require('./models/Policy');
const Booking = require('./models/Booking');
require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(8);
const jwtSecret = 'xcvbnmnbvcxasdfghjklpoiuytrewq';


app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req,res)=>{
    res.json('test ok');
});

app.post('/register', async(req,res)=>{
    const {name,email,password,agentId,user} = req.body;
    try{
        if(user=='Agent'){
            const newAgent = await Agent.create({
                name,email,password:bcrypt.hashSync(password,bcryptSalt),agentId
            })
            res.json(newAgent);
        }else{
        const newUser = await User.create({
            name,email,password:bcrypt.hashSync(password,bcryptSalt),
        })
        res.json(newUser);
    }
    } catch(e){
        res.status(422).json(e);
    }
});

app.post('/login', async(req,res)=>{
    const {email,password,agentId,userType} = req.body;
    if(userType ==='Agent'){
        const agentInfo = await Agent.findOne({'email':email,'agentId':agentId});
        //console.log("agent "+agentInfo);
        if(agentInfo){
            const agentOk = bcrypt.compareSync(password, agentInfo.password);
            if(agentOk){
                jwt.sign({email:agentInfo.email, id:agentInfo._id},jwtSecret,{}, (err, token)=>{
                    if (err) throw err;
                    res.cookie('token', token,{sameSite: 'none', secure: true}).json(agentInfo);
                });
            }else{
                res.json('password not verified');
            }
        }else{
            res.json('not found');
        }
    }else if(userType === 'User'){
        const userInfo = await User.findOne({email});
        //console.log("user "+userInfo);
        if(userInfo){
            const userOk = bcrypt.compareSync(password, userInfo.password);
            if(userOk){
                jwt.sign({email:userInfo.email, id:userInfo._id},jwtSecret,{}, (err, token)=>{
                    if (err) throw err;
                    res.cookie('token', token,{sameSite: 'none', secure: true}).json(userInfo);
                });
            }else{
                res.json('password not verified');
            }
        }else{
            res.json('not found');
        }
    }
});

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    try {
        if (token) {
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) {
                    throw err;
                }
                //console.log(userData);
                let user;
                if (!userData.agentId) {
                    user = await Agent.findById(userData.id);
                    const { name, email, _id,agentId } = user;
                    res.json({ name, email, _id,agentId });
                } else {
                    user = await User.findById(userData.id);
                    const { name, email, _id } = user;
                    res.json({ name, email, _id });
                }
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
               
            });
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error('Error in /profile route:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});


app.post('/upload-by-link',async(req,res) =>{
    const {link} = req.body;
    const newName = 'photo' + Date.now()+ '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/'+newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);
});

app.post('/policies',(req,res)=>{
    const {token} = req.cookies;
    const {pid,name,type,addedPhotos,quote,desc,features,benifits} = req.body;
    jwt.verify(token, jwtSecret,{}, async(err,userData)=>{
        if (err) throw err;
        const policyDoc = await Policy.create({
            powner: userData.id,
            pno:pid,pname:name,ptype:type,pimages:addedPhotos,
            pquote:quote,pdesc:desc,pfeatures:features,pbenifits:benifits
        });
        res.json(policyDoc);
    });
});

app.get('/user-policies',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret,{}, async(err,userData)=>{
        const {id} = userData;
        const policyData = await Policy.find({powner:id});
        res.json(policyData);
    });
});

app.get('/policies/:id', async(req,res)=>{
    const {id} = req.params;
    res.json(await Policy.findById(id));
});

app.put('/policies',(req,res)=>{
    const {token} = req.cookies;
    const {id,pid,name,type,addedPhotos,quote,desc,features,benifits} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err,userData) =>{
        if (err) throw err;
        const policyDoc = await Policy.findById(id);
        if(userData.id === policyDoc.powner.toString()){
            policyDoc.set({
                    pno:pid,pname:name,ptype:type,pimages:addedPhotos,
                    pquote:quote,pdesc:desc,pfeatures:features,pbenifits:benifits
            });
            await policyDoc.save();
            res.json('ok');
        }
    });
});

app.get('/policies', async(req,res)=>{
    res.json(await Policy.find());
});

function getUserFromReq(req){
    return new Promise((resolve,reject) => {
        jwt.verify(req.cookies.token, jwtSecret,{}, async(err,userData)=>{
            if(err) throw err;
            resolve(userData);
            console.log(userData);
        });
    });
}

app.post('/bookings', async(req,res)=>{
    const userData = await getUserFromReq(req);
    const {policy,uname,mobile,agent} = req.body;
    Booking.create({policy,uname,mobile,agent,user:userData.id}).then((doc)=>{
        res.json(doc);
    }).catch((err) => {
        throw err;
    })
});

app.get('/bookings', async(req,res) => {
    const userData = await getUserFromReq(req);
    console.log("hello "+userData.id);
    const agentInfo = await Agent.findById(userData.id);
    console.log(agentInfo);
    let query = {};
    if(agentInfo){
        query = {agent:userData.id};
    }else{
        query = {user:userData.id};
        console.log("yay");
    }
    res.json(await Booking.find(query).populate('policy'));
});

app.get('/agent',async(req,res)=>{
    const {_id} = req.query;
    const agent = await Agent.findById(_id);
    res.json(agent);
    //console.log(agent+" "+_id);
});

app.listen(4000);