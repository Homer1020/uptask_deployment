const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const passport = require('./config/passport');
// estraer valores de variables.env
require('dotenv').config({ path: 'variables.env'});

// Helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexion a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

// sessiones nos permiten navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())

app.use(cookieParse());

// Pasar vardump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null
    next();
});

app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('El servidor esta funcionando');
});

require('./handlers/email');