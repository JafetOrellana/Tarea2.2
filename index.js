import express, { json } from "express";

const app = express();

app.disable("x-powered-by");
app.use(json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`);
});