import express from  'express';
import ProductManager from './ProductManager.js';

//---------------------- carga Express y el puerto a escuchar  ----------------
const app = express();
const PORT = 8080; 

let path=`src/savedProducts.json`;
const data = new ProductManager(path); 

app.get('/products', async (req, res) => {
    let products = await data.getProducts();
    const {limit} = req.query;
    if(limit){
        products = products.slice(0, limit);
    }
    res.send(products);
});

app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    let product = await data.getProductById(productId);
    product ? res.send(product) : console.error('Producto no encontrado');

})

//---------- Inicializar el servidor, punto de entrada ---------------------

app.listen(PORT, () => console.log(`El Servidor está corriendo en el puerto: ${PORT}`));