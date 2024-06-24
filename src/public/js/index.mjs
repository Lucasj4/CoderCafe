

// const socket = io();

// socket.on('updateProducts', async () => {
//     const response = await fetch('/api/products');
//     const updatedProducts = await response.json();

//     const productList = document.getElementById('productList');
//     productList.innerHTML = ''; 

//     updatedProducts.forEach(product => {
//         const listItem = document.createElement('li');
//         listItem.innerHTML = `
//             <strong>${product.title}</strong><br>
//             <span>${product.description}</span><br>
//             <span>Precio: ${product.price}</span><br>
//             <span>Código: ${product.code}</span><br>
//             <span>Stock: ${product.stock}</span><br>
//             <span>Categoría: ${product.category}</span><br>
//             <button> Eliminar Producto </button>
//             <hr>
//         `;
//         listItem.querySelector('button').addEventListener("click", () => {
//             deleteProduct(product.id);
//         })
//         productList.appendChild(listItem);
//     });

//     console.log('Productos actualizados:', updatedProducts);
// });

// document.getElementById("btnEnviar").addEventListener("click", () => {
//     agregarProducto();
// });

// const deleteProduct = (id) => {
//     socket.emit("DeleteProduct", id);
// }

// const agregarProducto = () => {
    
//     const producto = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value,
//         code: document.getElementById("code").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value,
//         status: document.getElementById("status").value === "true",
//         thumbnail1: document.getElementById("thumbnail1").value,
//         thumbnail2: document.getElementById("thumbnail2").value
//     };

//     socket.emit("Addproduct", producto);
    
   
// };



