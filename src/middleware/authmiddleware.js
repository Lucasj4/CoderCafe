import passport from 'passport';

export function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
       
        res.locals.isAuthenticated = !!user;
        
        req.user = user.user || null;
     
        
        next();
    })(req, res, next);
}