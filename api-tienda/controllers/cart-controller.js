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
}
