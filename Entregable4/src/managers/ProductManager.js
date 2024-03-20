import fs from  'fs';

//----------------- CLASS ----------------------

class ProductManager{

   // #id=1; //Inicialización de ID
    
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
                    //id: this.#id++,        
                    id: this.products.length>0?parseInt(this.products[this.products.length-1].id)+1:1, //asigna el entero siguiente al id del último producto creado, si no hay productos asigna id=1       
                    title: productRecived.title,// (nombre del producto)
                    description: productRecived.description,// (descripción del producto)
                    price: productRecived.price ?? 0,// (precio)
                    status: productRecived.status,
                    stock: productRecived.stock ?? 0,// (número de piezas disponibles)
                    category: productRecived.category,// (categoría a la que pertene
                    thumbnail: productRecived.thumbnail ?? [],// (ruta de imagen)
                    code: productRecived.code,// (código identificador)
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

export default ProductManager;
