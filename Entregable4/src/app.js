import express from 'express';

import handlebars from 'express-handlebars';
import __dirname  from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'
import viewsRouter from  './routes/views.router.js';

//================ EXPRESS ===============================
const app = express();
const PORT = 8080; 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//================ MOTOR DE PLANTILLAS ===================
app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

//================ ARCHIVOS ESTÁTICOS ===================
//app.use(express.static(__dirname+'../public'));
app.use(express.static("public"));

//================= ROUTES ==============================
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


//================ LEVANTAR EL SERVIDOR=================
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})


