import fs from  'fs';

//----------------- CLASS ----------------------

class ProductManager{

    #id=1; //Inicialización de ID
    
    constructor(path){
        this.path=path;
        this.products=[]; 
        if(!fs.existsSync(path)){
            try{
                this.setData(this.products)        
            }catch(error){
                console.error(`No fué posible crear el archivo ${this.path}`)
            }       
        }
    }

    async getData(){
        try{
            return JSON.parse(await fs.promises.readFile(this.path,'utf-8'));
        }catch(error){
            console.error("Se produjo un error al intentar leer el archivo");
        }
    }        

    async setData(products){
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(this.products, null, '\t'));
        }catch(error){
            console.error("Se produjo un error al intentar guardar la información en el archivo");
        }
    }        

    async addProduct(productRecived) {  
        try{                        
            this.products=await this.getData();                                    
            //const {title,description,price,thumbnail,code,stock}=productRecived;        
            if (this.products.find(product => product.code === productRecived.code)) {
                return console.error(`Se produjo un error al intentar agregar el producto con código ${productRecived.code}, ya existe un producto con este código.`)                
            }else{
                const newProduct = {
                    id: this.#id++,        
                    title: productRecived.title,// (nombre del producto)
                    description: productRecived.description,// (descripción del producto)
                    price: productRecived.price ?? 0,// (precio)
                    thumbnail: productRecived.thumbnail ?? "Sin imagen",// (ruta de imagen)
                    code: productRecived.code,// (código identificador)
                    stock: productRecived.stock ?? 0,// (número de piezas disponibles)
                };  
                this.products.push(newProduct);
                console.warn("datos",this.products);
                await this.setData(this.products);
                console.log(`Producto agregado con éxito`);
                return newProduct;  
            }            
        }catch(error){
            "Se produjo un error al intentar agregar un nuevo producto"
        }      
    }

    async getProducts() {
        try{            
            this.products=await this.getData();         
            return this.products;            
        }catch(error){
            console.error("Se produjo un error al intentar mostrar los productos");
        }
    }

    async getProductById(id) {
        try{
            this.products=await this.getData();                  
            const product = this.products.find(product => product.id === parseInt(id));            
            if (!product) {
                return console.error(`NO SE ENCUENTRA un producto con el ID: ${id}`);
            }else{
                return product;
            }
        }catch(error){
            throw new Error(error.message);            
        }
    }    
    
    async getIndexProductById(id) { 
        try{
            this.products=await this.getData();            
            const index = this.products.findIndex(product => product.id === id);            
            if (index == -1) {
                console.error(`NO SE ENCUENTRA un producto con el ID: ${id}`);
            }
            return index;            
        }catch(error){
            throw new Error(error.message);            
        }
    }    

    async updateProduct(id,changes){    
        try {
            const index=await this.getIndexProductById(id);   
            if(index==-1){
                return `- No se encontró ningún producto con el id:${id}.\n- RESULTADO: ERROR en la actualización`;     
            }else{
                this.products=await this.getData();   
                this.products[index] = {
                    ...this.products[index],
                    ...changes,
                };  
                await this.setData(this.products);
                let stringObject = "";
                for (const propierties in changes) {            
                    stringObject += `\t${propierties}: ${changes[propierties]}\n`;
                }        
                console.log(`- Producto id:${id}.\n- Campos Actualizados:\n${stringObject}- RESULTADO: Actualizado con éxito\nProducto actualizado:\n`);     
                return this.products[index];
            }            
        } catch (error) {
            throw new Error(error.message);            
        }  
    }
    
    async deleteProduct(id){
        try {
            const index=await this.getIndexProductById(id);                
            if(index==-1){
                return `- No se encontró ningún producto con el id:${id}.\n- RESULTADO: ERROR al intentar eliminar el producto`;     
            }else{
                this.products=await this.getData();   
                this.products.splice(index,1); 
                await this.setData(this.products);
                return (`Producto con id:${id}, ELIMINADO CON ÉXITO`);                  
            }
            
        } catch (error) {
            
        }
    }

}



//   ----------------------   CREATE 10 PRODUCTS FOR SERVER TEST   -----------------------

// let path=`src/savedProducts.json`;

// const instanceManager = new ProductManager(path);

// const test= async()=>{
//     try{        
//         for (let index = 1; index <=10 ; index++) {
//             console.log(await instanceManager.addProduct(
//                 {
//                     title: `producto prueba ${index}`,
//                     description: `Este es un producto de prueba ${index}`,
//                     price: 200,
//                     thumbnail: "Sin imagen",
//                     code: `abc123_${index}`,
//                     stock: 25
//                 }
//             ));    
//         }        
//         console.log("\n=============================================\n");        
//         console.log('TEST: getProducts() [Con productos creados]...');
//         console.log(await instanceManager.getProducts());
//         console.log("\n=============================================\n");        
//     }catch (error) {
//         console.error(error.message);
//     }

// }

// test();

export default ProductManager;
