import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';

const router = Router(); 
const manager = new ProductManager('src/data/products.json')

router.get('/',async (req,res)=>{
    let products = await manager.getProducts();    
    res.render('home',{title:"Productos",style:"style-products.css",products});    
});

router.get('/realtimeproducts',async (req,res)=>{
    let products = await manager.getProducts();    
    res.render('realTimeProducts',{title:"Productos",style:"style-products.css",style2:"style-form.css",products});    
});


export default router;