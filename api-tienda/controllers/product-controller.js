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

    static getProductById(req, res) {
        const id = req.params;
        const consulta = 'SELECT id, nombre, descripcion, precio, stock, categoria, fecha_creacion FROM productos WHERE id = ?';

        try {
            connection.query(consulta, [id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener el producto" + error,
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
                message: "Ocurrio un error al obtener el producto" + error
            });
        }
    }

    static createProduct(req, res) {
        const query = 'INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const data = req.body;

        const { success, error } = ValidateProductSchema(data);
        if (!success) {
            res.status(400).json({
                message: JSON.parse(error.message)
            });
        }

        try {

            const { id, nombre, descripcion, precio, stock, categoria, fecha_creacion } = data;

            connection.query(query, { id, nombre, descripcion, precio, stock, categoria, fecha_creacion }, (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al crear el producto" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(201)
                    .json({ data });
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al crear el producto" + error
            });
        }
    }

    static updateProduct(req, res) {
        const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?, fecha_creacion = ? WHERE id = ?';
        const data = req.body;

        const { success, error } = ValidateProductSchema(data);
        if (!success) {
            res.status(400).json({
                message: JSON.parse(error.message)
            });
        }

        try {
            const { id, nombre, descripcion, precio, stock, categoria, fecha_creacion } = data;

            connection.query(query, { nombre, descripcion, precio, stock, categoria, fecha_creacion, id }, (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al actualizar el producto" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json({ data });
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al actualizar el producto" + error
            });
        }
    }

    static deleteProduct(req, res) {
        const id = req.params;
        const query = 'DELETE FROM productos WHERE id = ?';

        try {
            connection.query(query, [id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al eliminar el producto" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json({ message: "Producto eliminado" });
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al eliminar el producto" + error
            });
        }
    }

}
