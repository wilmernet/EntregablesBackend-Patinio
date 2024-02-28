
//   ----------------------   CLASS    -----------------------

class ProductManager{
    constructor(){
        this.products=[];
        this.nextId = 1; //Inicialización de ID
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (this.products.find(product => product.code === code)) {
          throw new Error('El código del producto ya existe.');
        }
        const newProduct = {
            id: this.nextId++,        
            title,// (nombre del producto)
            description,// (descripción del producto)
            price,// (precio)
            thumbnail,// (ruta de imagen)
            code,// (código identificador)
            stock,// (número de piezas disponibles)
        };  
        this.products.push(newProduct);
        return newProduct;  
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
          throw new Error(`NO SE ENCUENTRA un producto con el ID: ${id}`);
        }
        return product;
    }    
}

//   ----------------------   TEST    -----------------------

const instanceManager = new ProductManager();

try{
    console.log('TEST: getProducts() [sin productos]...\n');
    console.log(instanceManager.getProducts());
    
    console.log('TEST: addProduct() [Pasando los datos de prueba]...\n');
    console.log(instanceManager.addProduct({
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25
    }));    

    console.log('TEST: getProducts() [Con un producto creado]...');
    console.log(instanceManager.getProducts());
    
    console.log('TEST: addProducts() [Con un producto que posee el campo code repetido - No debe permitir agregar el producto]...');    
    console.log(instanceManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    }));     
}catch (error) {
    console.error(error.message);
}

try{
    console.log('TEST: getProductById() [Con el id=1 e id=2]...');
    console.log(instanceManager.getProductById(1));     
    console.log(instanceManager.getProductById(2));
}catch (error) {
    console.error(error.message);
}