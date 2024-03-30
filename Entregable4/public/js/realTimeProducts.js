const socket = io();

const newProductForm = document.getElementById('newProductForm'); 
const deleteBottons= document.getElementsByClassName('deleteBotton');
const container= document.getElementById('container');

newProductForm.addEventListener( 'submit', async(e) => {
    e.preventDefault();
    const formData=new FormData(newProductForm);
    const status=formData.get('status')==='on'?true:false;
    formData.set('status',status);
    await fetch('/api/products',{
        method: 'POST',
        body: formData,        
    })
    .then(response=>response.json()) 
    .then(data=>socket.emit("newProductCreated",data))               
} );

socket.on("newProductToDOM",(newProduct)=>{       
    createHTMLnewProduct(newProduct);
    newProductForm.reset();
}); 

for(const botton of deleteBottons){
    botton.addEventListener("click",()=>eventDelete(botton));
}

const eventDelete=async(botton)=>{
        const id = botton.closest('.card-product').id;
        await fetch(`/api/products/${id}`,{
            method: 'DELETE',
        })
        .then(response=>response.json())
        .then((idDeleted)=>{
            socket.emit("productDeleted",idDeleted);
        })        
    };

socket.on("productDeletedToDOM",(idProductDeleted)=>{
    const productCardDeleted=document.getElementById(idProductDeleted.idDeleted);
    productCardDeleted.remove();
});

const createHTMLnewProduct=(newProduct)=>{
    const divCardProduct= document.createElement("div");
    divCardProduct.className="card-product";
    divCardProduct.id=newProduct.id;
    const divCardProduct__img= document.createElement("div");
    divCardProduct__img.className="card-Product__img";
    const img= document.createElement("img");
    img.src=newProduct.thumbnail;
    img.alt=newProduct.title;
    img.className="card-product__img_file"; 
    divCardProduct__img.appendChild(img);
    divCardProduct.appendChild(divCardProduct__img);
    const div2=document.createElement("div");    
    const p1=document.createElement("p");    
    p1.textContent=newProduct.title;
    p1.className="card-product__title";
    const p2=document.createElement("p");    
    p2.className="card-product__price";
    p2.textContent="COP$ "+newProduct.price;
    div2.appendChild(p1);
    div2.appendChild(p2);
    divCardProduct.appendChild(div2);
    const divCardProduct__btn=document.createElement("div");    
    divCardProduct__btn.className="card-product__btn";
    const botton=document.createElement("botton");
    botton.innerHTML+='<ion-icon name="trash-outline"></ion-icon>';
    botton.className="deleteBotton";
    botton.id="btnDel"+newProduct.id;
    divCardProduct__btn.appendChild(botton);
    divCardProduct.appendChild(divCardProduct__btn);
    container.appendChild(divCardProduct);
    botton.addEventListener("click",()=>eventDelete(botton));
}