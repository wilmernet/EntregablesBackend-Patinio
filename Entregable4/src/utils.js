//----------------------- DIRNAME ------------------------
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


//----------------------- MULTER ------------------------
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'public/img/products');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
export const uploader = multer({storage});

