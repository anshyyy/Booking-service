const { PORT,DB_SYNC,FLIGHT_SERVICE_PATH } = require('./config/serverConfig');
const ApiRoutes = require('./routes/index');
const db = require('./models/index')
const bodyParser = require('body-parser');
const express = require('express');


const app = express();


const setUpAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',ApiRoutes);
    
    app.listen(PORT,async()=>{
        console.log(`Server started at ${PORT}`);
        if(DB_SYNC==true){
             db.sequelize.sync({alter:true});
        }
        //console.log(FLIGHT_SERVICE_PATH);
    })
}

setUpAndStartServer();