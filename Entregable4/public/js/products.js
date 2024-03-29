const detailsButton = document.getElementsByClassName('detailsButton'); 

for(const i of detailsButton){
    i.addEventListener("click",()=>{
        const id = document.getElementById(i.id).id;        
        window.location.href = `/api/products/${id}`;
    });
}
