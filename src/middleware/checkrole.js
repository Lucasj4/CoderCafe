import jwt from 'jsonwebtoken'

export const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;
  

    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                res.status(403).send('Acceso denegado. Token inválido.');
            } else {
                const userRole = decoded.user.rol;
                const user = decoded.user;
                console.log(user);
                
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
                }
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};