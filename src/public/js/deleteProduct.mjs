document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-product-btn');
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.dataset.productId;
        console.log("product id: ", productId);
        try {
          const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message);
            location.reload(); // Recargar la página para reflejar los cambios
          } else {
            alert(result.message);
          }
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          alert('Hubo un problema al eliminar el producto');
        }
      });
    });
  });