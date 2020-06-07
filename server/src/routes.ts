import express from 'express';


import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import multer from 'multer';
import multerConfig from './config/multer';
import {celebrate,Joi} from 'celebrate';

// index, show, create, update, destroy
const routes = express.Router();

const upload = multer(multerConfig);


const pointController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);


routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);


routes.post('/points',
 upload.single('image'),
 celebrate({
     body:Joi.object().keys({
         name:Joi.string().required(),
         email:Joi.string().required().email(),
         whatsapp:Joi.number().required(),
         latitude:Joi.number().required(),
         longitude:Joi.number().required(),
         city:Joi.string().required(),
         uf:Joi.string().required().max(2),
         items:Joi.string().required(),         

     })
 },{
     abortEarly:false
 }),
 pointController.create
 );


export default routes;




//Possibilidades de Design
//Servie Pattern
// Repositoy Pattern (Data. Mapper)




/* routes.get('/',(request,response)=>{

    return response.json({message: 'Hello World'});

});
export default routes; */