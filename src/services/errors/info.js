export const generateProductErrorInfo = (product) => {
    return `Los datos están incompletos o no son válidos.
Necesitamos recibir los siguientes datos:
- Título: String, pero recibimos ${product.title}
- Descripción: String, pero recibimos ${product.description}
- Precio: Number, pero recibimos ${product.price}
- Código: String, pero recibimos ${product.code}
- Stock: Number, pero recibimos ${product.stock}
- Categoría: String, pero recibimos ${product.category}`;
}