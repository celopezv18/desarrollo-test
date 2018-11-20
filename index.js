//index.js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

var sess;

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
//Session
app.use(session({
	secret: 'sessionsecret',
	resave: false,
	saveUninitialized: false,
	cookie: {secure: true}
}));

//Rutas
app.use('/login', require('./routes/login'));
app.use('/productos', require('./routes/productos'));
app.use('/usuarios', require('./routes/usuarios'));

//Static files
app.use(express.static(__dirname + '/public'));

//Crear servidor en puerto 3000
app.listen(app.get('port'), () => {
	console.log('ready ', app.get('port'));
});