import knex from '../database/connection';
import {Request,Response} from 'express';

class ItemsController{
    async index(request:Request,response:Response){
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item =>{
            return{

                id:item.id,
                title:item.title,
                //your ip
                image_url:`http://xxx.xxx.x.x:3333/uploads/${item.image}`,
            }
    
        });
    
        return response.json(serializedItems);
    
    }

    
}


export default ItemsController;