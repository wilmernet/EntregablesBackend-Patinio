const socket = io();

const newProductForm = document.getElementById('newProductForm'); 
const deleteBottons= document.getElementsByClassName('deleteBotton');

newProductForm.addEventListener( 'submit', async(e) => {
    e.preventDefault();
    const formData=new FormData(newProductForm);
    const status=formData.get('status')==='on'?true:false;
    formData.set('status',status);
    const resp= await fetch('http://localhost:8080/api/products',{
        method: 'POST',
        body: formData,        
    });
    if(resp.ok){
        alert("RESPJS: Producto creado con éxito.");
    }else{
        alert("RESPJS: ERROR: no fué posible crear el producto.");
    }   
} );

for(const i of deleteBottons){
    i.addEventListener("click",async()=>{
        const id = document.getElementById(i.id).id;                
        const resp= await fetch(`/api/products/${id}`,{
            method: 'DELETE',
        });
        if(resp.ok){
            alert("Producto eliminado con éxito.");
        }else{
            alert("ERROR: no fué posible eliminar el producto.");
        } 
    });
}

const createNewProduct=async()=>{
    const formData=new FormData(newProductForm);
    
    const status=formData.get('status')==='on'?true:false;
    formData.set('status',status);
    
    const resp= await fetch('/api/products',{
        method: 'POST',
        body: formData,        
    });
    if(resp.ok){
        alert("Producto creado con éxito.");
    }else{
        alert("ERROR: no fué posible crear el producto.");
    }       
    //socket.emit( "createProduct", newProduct);
    document.getElementsByName('title').value="";
    document.getElementsByName('description').value="";
    document.getElementsByName('price').value="";
    document.getElementsByName('stock').value="";
    document.getElementsByName('category').value="";
    document.getElementsByName('code').value="";
    document.getElementsByName('thumbnail').value="";
    //document.getElementsByName('status').checked;
}



