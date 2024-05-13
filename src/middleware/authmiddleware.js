import passport from 'passport';

export function authMiddleware(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.user = null;
        } else {
            req.user = user.user;
           
        }
        next();
    })(req, res, next);
}