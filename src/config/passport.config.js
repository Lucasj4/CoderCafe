import passport from "passport";
import local from "passport-local";
import jwt from 'passport-jwt';
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import GitHubStrategy from 'passport-github2'
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
export const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));




    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol } = req.body;
    
        try {
            let user = await UserModel.findOne({ email });
            if (user) {
                // Si el usuario ya existe, devolver un error personalizado
                return done(null, false, { message: "El usuario ya existe" });
            }
    
            // Si no existe, voy a crear un registro de usuario nuevo
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                rol
            }
            let result = await UserModel.create(newUser);
            // Si todo resulta bien, podemos mandar done con el usuario generado. 
            return done(null, result);
        } catch (error) {
            return done(error);   
        }
    }));
    

    // //Agregamos otra estrategia, ahora para el "login":
    // passport.use("login", new LocalStrategy({
    //     usernameField: "email"
    // }, async (email, password, done) => {
    //     try {
    //         //Primero verifico si existe un usuario con ese mail.
    //         const user = await UserModel.findOne({ email });
    //         if (!user) {
    //             console.log("Usuario no existe");
    //             return done(null, false);
    //         }
    //         //Si existe verifico la contraseña: 
    //         if (!isValidPassword(password, user)) return done(null, false);
    //         return done(null, user);

    //     } catch (error) {
    //         return done(error);
    //     }
    // }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    // passport.use('github', new GitHubStrategy({
    //     clientID: "Iv1.f1f3e5af3de42293",
    //     clientSecret: "ea80de5f4e06fc73ef8008267a03e67f14bd06bc",
    //     callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    // }, async (accessToken, refreshToken, profile, done) => {
    //     console.log("Profile: nuevo ", profile);
    //     try {
    //         let user = await UserModel.findOne({ email: profile._json.email })
    //         if (!user) {
    //             let newUser = {
    //                 first_name: profile._json.name,
    //                 last_name: "",
    //                 age: 36,
    //                 email: profile._json.email,
    //                 password: "",
    //                 rol: ''
    //             }
    //             let result = await UserModel.create(newUser)
    //             done(null, result)
    //         } else {
    //             done(null, user)
    //         }
    //     } catch (error) {
    //         return done(error)
    //     }
    // }));
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}