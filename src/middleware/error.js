import { Errors } from "../services/errors/enums.js";

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);

    let errorMessage;
    let statusCode;

    switch (error.code) {
        case Errors.ROUTE_ERROR:
            errorMessage = "Error relacionado con rutas o direcciones";
            statusCode = 400; 
            break;
        case Errors.INVALID_TYPE:
            errorMessage = "Tipo de dato inválido";
            statusCode = 422; 
            break;
        case Errors.DB_ERROR:
            errorMessage = "Error de base de datos";
            statusCode = 500; 
            break;
        case Errors.AUTHENTICATION_ERROR:
            errorMessage = "Error de autenticación";
            statusCode = 401; 
            break;
        case Errors.VALIDATION_ERROR:
            errorMessage = "Error de validación de datos";
            statusCode = 422; 
            break;
        case Errors.CONNECTION_ERROR:
            errorMessage = "Error de conexión";
            statusCode = 503; 
            break;
        case Errors.FILE_ERROR:
            errorMessage = "Error relacionado con archivos";
            statusCode = 500;
            break;
        case Errors.PERMISSION_ERROR:
            errorMessage = "Error de permisos";
            statusCode = 403;
            break;
        case Errors.MISSING_DATA_ERROR:
            errorMessage = "Error faltan datos";
            statusCode = 400;
            break;
        default:
            errorMessage = "Error desconocido";
            statusCode = 500; 
            break;
    }

    res.status(statusCode).send({ status: "error", error: errorMessage });
}

export default errorHandler;





