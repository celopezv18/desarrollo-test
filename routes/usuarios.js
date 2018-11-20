const express = require('express');
const router = express.Router();
const fs = require('fs');

//cargar vista de usuarios
router.get('/',(req, res) => {
	res.sendFile('usuarios.html',{root: './public'});

});
//obtener lista de usuarios
router.post('/:list',(req, res) => {
	var usersJSON = require('../usuarios.json');
	res.json(usersJSON.usuarios);

});
//crear usuarios nuevos
router.post('/', async(req, res) =>{
	//var datajson = fs.readFileSync('../usuarios.json');
	//usersJSON = JSON.parse(datajson);
	var usersJSON = require('../usuarios.json');
	var countUsers = usersJSON.usuarios.length; //número de usuarios en la lista
	
	var bodyjson = JSON.stringify(req.body, null, 2);
	bodyjson = JSON.parse(bodyjson);
	usersJSON.usuarios.push(bodyjson);
	usersJSON.usuarios[countUsers].id=(countUsers + 1);

	var nuevoUser = JSON.stringify(usersJSON, null, 2); //convertir data a texto
	fs.writeFile('./usuarios.json', nuevoUser, function(x){
		
	});
 
	res.json(nuevoUser); //enviarlo en json como respuesta
});
//editar los usuarios
router.put('/:id', async(req, res) =>{
	var usersJSON = require('../usuarios.json');
	var indice = 0;
	
	for(x=0;x<usersJSON.usuarios.length;x++){
		if(usersJSON.usuarios[x].id==req.params.id) indice = x;
	}
	
	usersJSON.usuarios[indice].nombre = req.body.nombre;
	usersJSON.usuarios[indice].email = req.body.email;
	usersJSON.usuarios[indice].password = req.body.password;
	
	var actualizado = JSON.stringify(usersJSON, null, 2);
	fs.writeFile('./usuarios.json', actualizado, function(x){
		
	});
	res.json(actualizado);
});
//obtener un solo usuario a editar por id 
router.get('/:id', async(req, res) =>{
	//retornar el usuario solicitado
	var usersJSON = require('../usuarios.json');
	var indice = 0;
	
	for(x=0;x<usersJSON.usuarios.length;x++){
		if(usersJSON.usuarios[x].id==req.params.id) indice = x;
	}
	
	res.json(usersJSON.usuarios[req.params.id - 1]);
});
//eliminar usuarios
router.delete('/:id', async(req, res) =>{
	var usersJSON = require('../usuarios.json');
	
	for(x=0;x<usersJSON.usuarios.length;x++){
		if(usersJSON.usuarios[x].id==req.params.id) usersJSON.usuarios.splice(x, 1);
	}
	
	var actualizado = JSON.stringify(usersJSON, null, 2);
	
	fs.writeFile('./usuarios.json', actualizado, function(x){
		
	});
	
	res.json(actualizado);
});

module.exports = router;