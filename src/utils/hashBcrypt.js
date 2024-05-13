import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) => {
    
    const isValid = bcrypt.compareSync(password.trim(), user.password.trim());
   
    return isValid;
}




