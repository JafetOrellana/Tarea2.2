import  { Router } from 'express'
import {CartController} from '../controllers/cart-controller.js'

const cartRouter = Router();

// carrito

cartRouter.get('/:id', CartController.getCartByUser);
/*
cartRouter.post('/', CartController.addToCart);

cartRouter.put('/:id', CartController.removeFromCart);
*/

export default cartRouter