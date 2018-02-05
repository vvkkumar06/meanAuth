const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/db');

mongoose.connect(config.db, (err)=>{
    if(err) console.log("Oops!! Error connecting database: "+ err);
    else console.log('Congratulation! Successfully connected to database');
});


const app = express();

//Controllers
const user = require('./routes/user');


//port based on env
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/users', user);

app.get('/',(req,res)=>{
    res.send("Invalid Endpoint");
});

app.listen(port, (err)=>{
    if(err)
        console.log("Error running server: "+err);
    else    
        console.log("Server running on localhost:"+port);
});