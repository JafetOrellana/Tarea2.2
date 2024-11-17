import connection from '../config/db.js';

export class CartController {
    static getCartByUser(req, res) {
        const id = req.params.id;
        const query = 'SELECT c.id, c.usuario_id, c.producto_id, c.cantidad, p.nombre, p.precio FROM carrito c JOIN productos p ON c.producto_id = p.id WHERE c.usuario_id = ?';  

        try {
            connection.query(query, [id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener el carrito: " + error.message,
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        error: true,
                        message: `Carrito no encontrado para el usuario con ID ${id}`,
                    });
                }

                return res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json(results);
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar la solicitud: " + error.message,
            });
        }
    }

    static addToCart(req, res) {
        const data = req.body;
        const { usuario_id, producto_id, cantidad = 1, detalle_id = null } = data;
    
        if (!usuario_id || !producto_id) {
            return res.status(400).json({
                error: true,
                message: "Faltan datos en la solicitud. Asegúrese de incluir usuario_id y producto_id."
            });
        }
    
        const checkStockQuery = 'SELECT stock FROM productos WHERE id = ?';
        connection.query(checkStockQuery, [producto_id], (error, stockResults) => {
            if (error) {
                return res.status(400).json({
                    error: true,
                    message: "Ocurrió un error al verificar el stock: " + error.message,
                });
            }
    
            if (stockResults.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: `Producto con ID ${producto_id} no encontrado en la base de datos.`,
                });
            }
    
            const stockDisponible = stockResults[0].stock;
    
            if (stockDisponible < cantidad) {
                return res.status(400).json({
                    error: true,
                    message: `No hay suficiente stock para agregar ${cantidad} unidades del producto.`,
                });
            }
    
            const checkQuery = 'SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?';
            connection.query(checkQuery, [usuario_id, producto_id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al verificar el carrito: " + error.message,
                    });
                }
    
                if (results.length > 0) {
                    const newQuantity = results[0].cantidad + cantidad;
                    const updateQuery = 'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?';
                    
                    connection.query(updateQuery, [newQuantity, usuario_id, producto_id], (error, updateResults) => {
                        if (error) {
                            return res.status(400).json({
                                error: true,
                                message: "Ocurrió un error al actualizar el carrito: " + error.message,
                            });
                        }
    
                        const newStock = stockDisponible - cantidad;
                        const updateStockQuery = 'UPDATE productos SET stock = ? WHERE id = ?';
                        
                        connection.query(updateStockQuery, [newStock, producto_id], (error) => {
                            if (error) {
                                return res.status(400).json({
                                    error: true,
                                    message: "Ocurrió un error al actualizar el stock: " + error.message,
                                });
                            }
    
                            return res
                                .set('Content-Type', 'application/json')
                                .status(200)
                                .json({
                                    message: "Cantidad actualizada en el carrito y stock actualizado",
                                    data: { usuario_id, producto_id, cantidad: newQuantity, detalle_id }
                                });
                        });
                    });
                } else {
                    const insertQuery = 'INSERT INTO carrito (usuario_id, producto_id, cantidad, detalle_id) VALUES (?, ?, ?, ?)';
                    
                    connection.query(insertQuery, [usuario_id, producto_id, cantidad, detalle_id], (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                error: true,
                                message: "Ocurrió un error al agregar el producto al carrito: " + error.message,
                            });
                        }
    
                        const newStock = stockDisponible - cantidad;
                        const updateStockQuery = 'UPDATE productos SET stock = ? WHERE id = ?';
                        
                        connection.query(updateStockQuery, [newStock, producto_id], (error) => {
                            if (error) {
                                return res.status(400).json({
                                    error: true,
                                    message: "Ocurrió un error al actualizar el stock: " + error.message,
                                });
                            }
    
                            return res
                                .set('Content-Type', 'application/json')
                                .status(201)
                                .json({
                                    message: "Producto agregado al carrito y stock ajustado",
                                    data: { usuario_id, producto_id, cantidad, detalle_id }
                                });
                        });
                    });
                }
            });
        });
    }
    

    static removeFromCart(req, res) {
        const id = req.params.id;  
        const data = req.body;
        const id_producto = data.producto_id;
    
        const query = 'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?';
    
        try {
            connection.query(query, [id, id_producto], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al eliminar el producto del carrito: " + error.message,
                    });
                }
    
                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: `Producto ${id_producto} no encontrado en el carrito del usuario ${id}`,
                    });
                }
    
                return res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json({ message: `Producto ${id_producto} eliminado del carrito del usuario ${id}` });
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar la solicitud: " + error.message,
            });
        }
    }
    
    
}
