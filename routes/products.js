const express = require("express")
const Contenedor = require("../getItems")
const Cart = require("../cart")
const productRouter = express.Router();
const app = express();
const contenedorProducts = new Contenedor("productos.txt")

const verificarRol = ((req, res, next) => {
    const rol = "admin";
    if (rol == "admin") {
        next()
    } else {
        res.json({
            message: "Usted no tiene permiso de administrador"
        })
    }
})

productRouter.get("/", async(req, res) => {
    try {
        const productosAMostrar = await contenedorProducts.getAll()
        if (productosAMostrar == 1) {
            res.json({
                message: "El archivo esta vacioo"
            })
        } else if (productosAMostrar == 2) {
            res.json({
                message: "El archivo no existe"
            })
        } else {
            res.json(productosAMostrar)
        }
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }
})

productRouter.get("/:id", async(req, res) => {
    const { id } = req.params;
    try {
        const productoPorID = await contenedorProducts.getByID(parseInt(id));
        if (productoPorID) {
            res.json({
                message: "El producto Solicitado es: ",
                product: productoPorID
            });
        } else {
            res.json({
                message: `No Se encontro el producto de id: ${id}`,
            });
        }
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }
})

productRouter.post("/", verificarRol, async(req, res) => {
    try {
        const newProduct = req.body;
        productoAAgregar = await contenedorProducts.save(newProduct)
        if (productoAAgregar == 2) {
            res.json({
                message: `El producto con ${newProduct.title}, ya existe, por favor no repita productos`
            })
        } else if (productoAAgregar == 1) {
            res.json({
                message: "No se completaron los datos de manera correcta"
            })
        } else {
            const productosAMostrar = await contenedorProducts.getAll()
            res.json({
                message: "Producto Agregado con exito!",
                product: productosAMostrar
            })
        }
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }
})

productRouter.put("/:id", verificarRol, async(req, res) => {
    const { id } = req.params;
    const datoActualizado = req.body;
    try {
        const productoAActualizar = await contenedorProducts.updateById(parseInt(id), datoActualizado);
        if (productoAActualizar == 1) {
            res.json({
                message: "Complete los datos correctamente"
            })
        } else if (productoAActualizar != undefined) {
            res.json({
                message: `El producto id:${id} Fue actualizado con exito`,
                response: productoAActualizar
            })
        } else {
            res.json({
                message: `El id ${id}, no es un dato valido para actualizar`
            })
        }
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }
})


productRouter.delete("/:id", verificarRol, async(req, res) => {
    const { id } = req.params
    try {
        productoAEliminar = await contenedorProducts.deleteByID(parseInt(id))
        res.json({
            message: productoAEliminar
        })
    } catch (error) {

    }
})



module.exports = productRouter