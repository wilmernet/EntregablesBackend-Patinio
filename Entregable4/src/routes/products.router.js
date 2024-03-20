import { Router } from 'express';
import ProductManager from '../ProductManager.js';

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

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;
        const existingProducts = await manager.getProducts();

        if (existingProducts.find(product => product.code === code)) {
            return res.status(400).send({ error: `Ya existe un producto con el código ${code}` });
        }
        if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
           return res.status(400).send({ error: `Falta información para registrar un nuevo producto` });
        }

        await manager.addProduct(req.body);
        return res.status(201).send({ message: `${title} añadido con éxito` });
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

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        await manager.deleteProduct(parseInt(productId));
        return res.status(201).send({ message: `Producto eliminado exitosamente` });
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }

});

export default router;