import express from 'express';

import handlebars from 'express-handlebars';
import __dirname  from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'
import viewsRouter from  './routes/views.router.js';

import { Server } from  "socket.io";

//================ EXPRESS ===============================
const app = express();
const PORT = 8080; 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//================ ARCHIVOS ESTÁTICOS ===================
app.use(express.static("public"));

//================ LEVANTAR EL SERVIDOR=================
const httpServer=app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})
//================= WEBSOCKETS ===========================
const io = new Server(httpServer)
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('newProductCreated', data => {        
        console.log("Producto agregado",data);
        io.emit('newProductToDOM', data);
    })

    socket.on('productDeleted', data => {
        console.log("La id eliminada es",data);
        io.emit('productDeletedToDOM', data);
    } )
})

//================ MOTOR DE PLANTILLAS ===================
app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

//================= ROUTES ==============================
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);



