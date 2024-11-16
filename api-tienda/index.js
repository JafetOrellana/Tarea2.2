import express, { json } from "express";
import productsRoute from "./routes/products.js";

const app = express();

app.disable("x-powered-by");
app.use(json());

const PORT = process.env.PORT || 3000;

// Rutas 
app.use('./products', productsRoute);

// Midleware para manejo de rutas inexistentes 
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: "Ruta no encontrada"
    });
})

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`);
});