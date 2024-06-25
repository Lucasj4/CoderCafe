document.querySelector('.users__action__button').addEventListener('click', async () => {
    try {
      
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Usuarios eliminados');

        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el rol');
    }
})