import express from 'express';
import InventoryController from '../controllers/inventory.controller';
const Router = express.Router();

Router.get(
    '/ping', 
    (req:any, res:any) => res.status(200).json({msg:'Pong!'})
);

Router.post(
    '/:itemName/add',
    InventoryController.add
);

Router.get(
    '/:itemName/quantity',
    InventoryController.get
);

Router.post(
    '/:itemName/sell',
    InventoryController.sell
);

export default Router;
