import { Router } from 'express';
import { promises as fs } from "fs";

import ProductManager from '../managers/ProductManager.js';
import { uploader } from '../utils.js';

const router = Router();
const manager = new ProductManager('src/data/products.json')

router.get('/', async (req, res) => {
    try {
        let products = await manager.getProducts();
        const { limit } = req.query;

        if (limit) {
            products = products.slice(0, limit);
        }

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` })
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        let product = await manager.getProductById(productId);

        return product ? res.status(200).send(product) : res.status(400).send({ error: `No se encontró ningún producto con id ${productId}` });
    } catch (error) {
       return res.status(500).send({ error: `Error en el servidor` })
    }

});


router.post('/',uploader.single('file'), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;        
        const existingProducts = await manager.getProducts();

        if (existingProducts.find(product => product.code === code)) {
            return res.status(400).send({ error: `Ya existe un producto con el código ${code}` });
        }
        if(!req.file){
            return res.status(400).send({ error: `No se logrò cargar la imagen` });
        }
        if (!title || !description || !code || !price || !stock || !category) {
           return res.status(400).send({ error: `Falta información para registrar un nuevo producto` });
        }
        req.body.thumbnail=req.file.path.substring(7); //se retira "public" de la ruta
        const newProduct=await manager.addProduct(req.body);
        return res.status(201).send(newProduct);
        //return res.status(201).send({ message: `${title} añadido con éxito` });
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }
})

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        await manager.updateProduct(parseInt(productId), req.body);
        return res.status(201).send({ message: `Producto actualizado con éxito` });
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }

});

const deleteImageOfProduct=async(productId)=>{    
    try {
        let product = await manager.getProductById(productId);
        const filePath="public/"+product.thumbnail; 
        await fs.unlink(filePath);
        console.log("Archivo de imagen eliminado correctamente");
    } catch (err) {
        console.log("Error al eliminar el archivo de la imagen:", err.message);
    }
}

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;        
        deleteImageOfProduct(productId);
        await manager.deleteProduct(parseInt(productId));
        return res.status(201).send({ idDeleted: productId });
        //return res.status(201).send({ message: `Producto eliminado exitosamente` });
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }

});

export default router;