const express = require('express');
const router = express.Router();
const session = require('express-session');
const fs = require('fs');


//validar inicio de sesión
router.post('/',(req, res) => {
	var usersJSON = require('../usuarios.json');
	sess = req.session;
	var registrado = false;
	var indice = 0;
	
	for(x=0;x<usersJSON.usuarios.length;x++){
		if(usersJSON.usuarios[x].email == req.body.email && usersJSON.usuarios[x].password == req.body.password){
			registrado = true;
			indice = x;
		}
	}
	
	if(registrado == true){ //si el usuario existe
		req.session.email = req.body.email; //se crea la sesión
		res.json(req.session.email);
	}else res.json('error'); //si no, se muestra un mensaje de error

});

module.exports = router;