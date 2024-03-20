import { Router } from 'express';
import CartsManager from '../managers/CartsManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const cartManager = new CartsManager('src/data/carts.json');
const productManager = new ProductManager('src/data/products.json');

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(201).send(carts);
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart  = await cartManager.getCartById(cartId);
        if (!cart){
            return res.status(400).send({error: `No existe un carrito con el ID ${cartId}`});
        }
        else {
            const productsInCart = await cartManager.getProductsInCart(cart);
            return res.status(200).send(productsInCart);
        }
    } catch (error) {
       return res.status(500).send({ error: `Error en el servidor` })
    }
});

router.post('/', async (req, res) => {
    try {
        await manager.createCart();
        res.status(201).send({ message: `Carrito creado exitosamente` });
    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }
});

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);

        const productId = req.params.productId;
        const productToAdd = await productManager.getProductById(productId);

        if (!productToAdd){
            return res.status(400).send({error: `No se encontró el producto con id ${productId}`});
        }
        if (!cart){
            return res.status(400).send({error: `No existe un carrito con el ID ${cartId}`});
        }

        await cartManager.addProductToCart(cart, productToAdd, 1);
        return res.status(200).send({message: 'Producto agregado al carrito de forma exitosa'});

    } catch (error) {
        return res.status(500).send({ error: `Error en el servidor` });
    }
});

export default router;