import connection from '../config/db.js';

export class CartController {
    static getCartByUser(req, res) {
        const id = req.params.id;
        const query = 'SELECT * FROM carrito WHERE usuario_id = ?';  

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
    
        const query = 'INSERT INTO carrito (usuario_id, producto_id, cantidad, detalle_id) VALUES (?, ?, ?, ?)';
    
        try {
            connection.query(query, [usuario_id, producto_id, cantidad, detalle_id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al agregar el producto al carrito: " + error.message,
                    });
                }
    
                // Respuesta exitosa
                return res
                    .header("Content-Type", "application/json")
                    .status(201)
                    .json({
                        message: "Producto agregado al carrito",
                        data: {
                            usuario_id,
                            producto_id,
                            cantidad,
                            detalle_id
                        }
                    });
            });
        } catch (error) {
            // Error inesperado
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar la solicitud: " + error.message,
            });
        }
    }
    
    
}
