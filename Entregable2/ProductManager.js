
//   ----------------------   CLASS    -----------------------

const { warn, error } = require("console");
const fs= require( "fs" );

//----------------- CLASS ----------------------

class ProductManager{

    #id=1; //Inicialización de ID
    
    constructor(path){
        this.path=path;
        this.products=[]; 
        try{
            this.setData(this.products)        
        }catch(error){
            console.error(`No fué posible crear el archivo ${this.path}`)
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
                    title: productRecived.title ?? "Sin título",// (nombre del producto)
                    description: productRecived.description ?? "Sin descripcion",// (descripción del producto)
                    price: productRecived.price ?? 0,// (precio)
                    thumbnail: productRecived.thumbnail ?? "Sin imagen",// (ruta de imagen)
                    code: productRecived.code ?? "000AAA",// (código identificador)
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
            const product = this.products.find(product => product.id === id);            
            if (!product) {
                console.error(`NO SE ENCUENTRA un producto con el ID: ${id}`);
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



//   ----------------------   TEST    -----------------------

let path=`${__dirname}/prueba.txt`;

const instanceManager = new ProductManager(path);

const test= async()=>{
    try{
        const productData={
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25
        }; 
        const productData2={
            title: "producto prueba",
            description: "Este es otro producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "xxx111",
            stock: 25
        };
        const productData3={
            title: "producto prueba",
            description: "Este es otro producto prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "yyy222",
            stock: 25
        };
    
        console.log('TEST: getProducts() [sin productos]...\n');
        console.log(await instanceManager.getProducts());
        console.log("\n=============================================\n");
        console.log('TEST: addProduct() [Pasando los datos de prueba]...\n');
        console.log(await instanceManager.addProduct(productData));    
        console.log("\n=============================================\n");        
        console.log('TEST: addProduct() [Pasando los datos de prueba]...\n');
        console.log(await instanceManager.addProduct(productData2));    
        console.log("\n=============================================\n");        
        console.log('TEST: addProduct() [Pasando los datos de prueba]...\n');
        console.log(await instanceManager.addProduct(productData3));    
        console.log("\n=============================================\n");        
        console.log('TEST: addProduct() [Pasando datos de prueba con el mismo CODE]...\n');
        console.log(await instanceManager.addProduct(productData));    
        console.log("\n=============================================\n");        
        console.log('TEST: getProducts() [Con productos creados]...');
        console.log(await instanceManager.getProducts());
        console.log("\n=============================================\n");        
        console.log('TEST: getProductById() [Con el id=1]...');
        console.log(await instanceManager.getProductById(1));     
        console.log("\n=============================================\n");        
        console.log('TEST: getProductById() [Con el id=8 (No existe)]...');
        console.log(await instanceManager.getProductById(8));       
        console.log("\n=============================================\n");        
        console.log('TEST: updateProducts() [Actualización del título del producto existente ID: 2]...');
        console.log(await instanceManager.updateProduct(2,{title:"título Modificado"}));   
        console.log("\n=============================================\n");        
        console.log('TEST: deleteProducts() [Borrando el producto con ID=3]...');
        console.log(await instanceManager.deleteProduct(3)); 
        console.log("\n=============================================\n");        

           
    }catch (error) {
        console.error(error.message);
    }

}

test();
