import { Router } from 'express';
import CartsManager from '../CartsManager.js';
import ProductManager from '../ProductManager.js';

const router = Router();
const cartManager = new CartsManager('./data/carts.json');
const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(201).send(carts);
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart  = await cartManager.getCartById(cartId);
        if (!cart){
            return res.status(400).send({error: 'No existe un carrito con el ID especificado'});
        }
        else {
            const productsInCart = await cartManager.getProductsInCart(cart);
            return res.status(200).send(productsInCart);
        }
    } catch (error) {
       return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.post('/', async (req, res) => {
    try {
        await manager.createCart();
        res.status(201).send({ message: 'Carrito creado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);

        const productId = req.params.productId;
        const productToAdd = await productManager.getProductById(productId);

        if (!productToAdd){
            return res.status(400).send({error: 'No existe el producto'});
        }
        if (!cart){
            return res.status(400).send({error: 'No existe el carrito'});
        }

        await cartManager.addProductToCart(cart, productToAdd, 1);
        return res.status(200).send({message: 'Producto añadido al carrito'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

export default router;