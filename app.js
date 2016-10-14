var usuarioController =  require('./controller/usuarioController.js');
var arduinoController =  require('./controller/arduinoController.js');
var dashboardController =  require('./controller/dashboardController.js');
var quedaController = require('./controller/quedaController.js');

var config = require("./config.json");

var jwt = require('jsonwebtoken');
var express = require("express");
var app = express();
var morgan = require("morgan");
var co = require('co');
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(morgan('dev'));

//CORS
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token, content-type, Authorization');
	next();
});

app.post('/login', (req, res)=>{
    co(function*(){
        return yield usuarioController.login(req, res);
    }).then((result)=>{
        var token = jwt.sign(result, config.salt, {
            expiresIn: "24h"
        });
        res.json({success:true});
    }).catch((err)=>{
        res.json({success:false});
    });
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var api = express.Router();

app.use("/api", api);

//=========================
//         USUARIO
//=========================
api.post('/usuario', (req, res)=>{
    co(function*(){
        return yield usuarioController.inserir(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        console.log(err);
        res.json({success:false, errBody:err});
    });
});

api.delete('/usuario/:id/:rev', (req, res)=>{
    co(function*(){
        return yield usuarioController.remover(req, res);
    }).then((result)=>{
        res.json({success:true});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

api.get('/usuario/:id', (req, res)=>{
    co(function*(){
        return yield usuarioController.consultar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

api.put('/usuario/:id', (req, res)=>{
    co(function*(){
        return yield usuarioController.atualizar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

api.get('/usuario', (req, res)=>{
    co(function*(){
        return yield usuarioController.listar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

api.post('/associar/:idPaciente/:idCuidador', (req, res)=>{
    co(function*(){
        return yield usuarioController.associar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

api.post('/desassociar/:idPaciente/:idCuidador', (req, res)=>{
    co(function*(){
        return yield usuarioController.desAssociar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

//=========================
//         ARDUINO
//=========================

api.get('/arduino/:id', (req, res)=>{
    co(function*(){
        return yield arduinoController.consultar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});

//=========================

api.get('/dashboard', (req, res)=>{
    co(function*(){
        return yield dashboardController.consultar(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        res.json({success:false, errBody:err});
    });
});


// QUEDAS
api.post('/queda', (req, res) =>{
    co(function*(){
        return yield quedaController.inserir(req, res);
    }).then((result)=>{
        res.json({success:true, result:result});
    }).catch((err)=>{
        console.log(err);
        res.json({success:false, errBody:err});
    });
});

app.listen(process.env.PORT);
console.log("Ouvindo em " + process.env.PORT);