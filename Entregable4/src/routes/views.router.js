import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';

const router = Router(); 
const manager = new ProductManager('src/data/products.json')

router.get('/',async (req,res)=>{
    let products = await manager.getProducts();    
    res.render('home',{title:"Productos",style:"style-products.css",products});    
});

export default router;