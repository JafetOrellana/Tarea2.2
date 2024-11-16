import { Router } from 'express';
import { ProductController } from '../controllers/product-controller.js';

const productRoute = Router();

// productos 
productRoute.get('/', ProductController.getAllProducts);

// carrito

export default productRoute;
