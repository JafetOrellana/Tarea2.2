import { z } from 'zod';

const productSchema = z.object({
    //`id` int(11) NOT NULL AUTO_INCREMENT,
    "nombre": z.string({
        invalid_type_error: "El nombre debe ser un string"
    }).trim().min(3, {
        message: "El nombre debe tener al menos 3 caracteres"
    }).max(30, {
        message: "El nombre debe tener menos de 30 caracteres"
    }), // varchar(100) NOT NULL
    "descripcion": z.string().trim().optional(), // text,
    "precio": z.number({
        invalid_type_error: "El precio debe ser un número"
    }).positive({
        message: "El precio debe ser un número positivo"
    }), //decimal(10,2) NOT NULL,
    "stock": z.number().int({
        message: "El stock debe ser un número entero"
    }),/*.nonegative({
        message: "El stock no puede ser negativo"
    }),*/ //int(11) NOT NULL DEFAULT '0',
    "categoria": z.string().trim().max(50).nullable().optional(), //varchar(50) DEFAULT NULL,
    "fecha_creacion": z.string({
        invalid_type_error: "La fecha de creación debe ser un string"
    }).datetime({
        message: "La fecha de creación debe ser un string con formato de fecha y hora"
    }), //timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
})

export const ValidateProductSchema = (product) => { productSchema.parse(product) };