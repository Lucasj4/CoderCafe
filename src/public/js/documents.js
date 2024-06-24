document.getElementById('document').addEventListener('change', function() {
    const fileNames = Array.from(this.files).map(file => file.name).join(', ');
    document.getElementById('documentName').textContent = fileNames;
});

document.getElementById('products').addEventListener('change', function() {
    const fileNames = Array.from(this.files).map(file => file.name).join(', ');
    document.getElementById('productsName').textContent = fileNames;
});

document.getElementById('profile').addEventListener('change', function() {
    const fileNames = Array.from(this.files).map(file => file.name).join(', ');
    document.getElementById('profileName').textContent = fileNames;
});

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Hacer una solicitud al servidor para obtener el ID del usuario autenticado
        const response = await fetch('http://localhost:8080/api/users/getusers'); // Ruta para obtener el usuario autenticado
        if (!response.ok) {
            throw new Error('No se pudo obtener el usuario autenticado');
        }
      
        const data = await response.json();
        
        const uid = data.userId; // Obtener el ID del usuario
        
        
        // Agregar evento de escucha para el envío del formulario
        document.getElementById('uploadForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);

            try {
                const response = await fetch(`http://localhost:8080/api/users/${uid}/documents`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.text();
                    alert('Documentos subidos exitosamente');
                    console.log(result);
                } else {
                    alert('Error al subir documentos');
                    console.error('Error al subir documentos');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});