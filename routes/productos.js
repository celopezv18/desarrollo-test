const express = require('express');
const router = express.Router();
const session = require('express-session');
const fs = require('fs');


//obtener los productos (url por get)
router.get('/',(req, res) => {
	
	var productosJSON = require('../productos.json');
	res.json(productosJSON.productos);
	
});
//obtener los productos para guardar
router.post('/', async(req, res) =>{
	//var datajson = fs.readFileSync('../productos.json');
	//productosJSON = JSON.parse(datajson);
	var productosJSON = require('../productos.json');
	var countProductos = productosJSON.productos.length; //número de productos en la lista
	
	var bodyjson = JSON.stringify(req.body, null, 2);
	bodyjson = JSON.parse(bodyjson);
	productosJSON.productos.push(bodyjson);
	productosJSON.productos[countProductos].id=(countProductos + 1);

	var nuevoProducto = JSON.stringify(productosJSON, null, 2); //convertir data a texto
	fs.writeFile('./productos.json', nuevoProducto, function(x){
		
	});
 
	res.json(nuevoProducto); //enviarlo en json como respuesta
});
//editar los productos
router.put('/:id', async(req, res) =>{
	var productosJSON = require('../productos.json');
	var indice = 0;
	
	for(x=0;x<productosJSON.productos.length;x++){
		if(productosJSON.productos[x].id==req.params.id) indice = x;
	}
	
	productosJSON.productos[indice].nombre = req.body.nombre;
	productosJSON.productos[indice].tipo = req.body.tipo;
	productosJSON.productos[indice].categoria = req.body.categoria;
	productosJSON.productos[indice].stock = req.body.stock;
	
	var actualizado = JSON.stringify(productosJSON, null, 2);
	fs.writeFile('./productos.json', actualizado, function(x){
		
	});
	res.json(actualizado);
});
//obtener un solo producto a editar por id 
router.get('/:id', async(req, res) =>{
	//retornar el producto solicitado
	var productosJSON = require('../productos.json');
	var indice = 0;
	
	for(x=0;x<productosJSON.productos.length;x++){
		if(productosJSON.productos[x].id==req.params.id) indice = x;
	}
	
	res.json(productosJSON.productos[indice]);
});
//eliminar productos
router.delete('/:id', async(req, res) =>{
	var productosJSON = require('../productos.json');
	
	for(x=0;x<productosJSON.productos.length;x++){
		if(productosJSON.productos[x].id==req.params.id) productosJSON.productos.splice(x, 1);
	}
	
	var actualizado = JSON.stringify(productosJSON, null, 2);
	
	fs.writeFile('./productos.json', actualizado, function(x){
		
	});
	
	res.json(actualizado);
});

module.exports = router;