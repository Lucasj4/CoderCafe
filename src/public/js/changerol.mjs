document.getElementById('changeRoleButton').addEventListener('click', async function() {
    const userId = this.getAttribute('data-user-id');
    console.log(userId); // Usar el ID del usuario desde tu template engine
    try {
      const response = await fetch(`/api/users/premium/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert('Rol cambiado exitosamente');
        // Opcional: refrescar la página o actualizar el contenido dinámicamente
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el rol');
    }
  });