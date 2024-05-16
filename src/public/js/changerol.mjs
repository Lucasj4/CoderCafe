document.getElementById('changeRoleForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const form = event.target;
    const url = form.action;
    
    try {
        const response = await fetch(url, {
            method: 'PUT', // Usar el método PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) 
        });
        
        if (!response.ok) {
            throw new Error('Error al cambiar el rol');
        }
        
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
       
    }
});