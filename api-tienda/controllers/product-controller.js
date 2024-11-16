import { Route } from 'express';
import { ProductController } from '../controllers/product-controller.js';

const productRoute = Route();

// productos 
productRoute.get('/', ProductController.getAllProducts);

// carrito

export default productRoute;