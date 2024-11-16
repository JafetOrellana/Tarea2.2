import { ValidateProductSchema } from '../schemas/products.schema.js';
import connection from '../config/db.js';

export class ProductController {
    static getAllProducts(req, res) {
        const consulta = 'SELECT id, nombre, descripcion, precio, stock, categoria, fecha_creacion FROM productos';

        try {
            connection.query(consulta, (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener los productos" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json(results);
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al obtener los productos" + error
            });
        }
    }
}
