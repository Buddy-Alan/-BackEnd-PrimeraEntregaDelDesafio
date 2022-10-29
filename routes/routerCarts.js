const express = require("express")
const Cart = require("../cart")
const carritoRouter = express.Router();
const Contenedor = require("../getItems")
const carritoProductos = new Cart("carrito.txt")
const productosEnBD = new Contenedor("productos.txt")

//Funcion para actualizar el stock del producto
actualizarProducto = (productoaActualizar) => {
    productoaActualizar.stock = productoaActualizar.stock - 1
    productosEnBD.updateById(productoaActualizar.id, productoaActualizar)
}

//Funcion para  desestructurar el primer ingreso del producto al carrito
//Con el fin de que el stock sea 1
primerStock = (productoASacarPrimerStock) => {
    const { id, title, price, thumbnail, descripcion, timestamp, codigo } = productoASacarPrimerStock
    const newProduct = {
        id: id,
        timestamp: timestamp,
        title: title,
        descripcion: descripcion,
        codigo: codigo,
        price: price,
        thumbnail: thumbnail,
        stock: 1
    };
    return newProduct
}

//Crea un carrito y agrega UN DATO
carritoRouter.post("/", async(req, res) => {
    try {
        const productoByID = await productosEnBD.getByID(parseInt(req.body.id))
        if (productoByID != undefined) {
            if (productoByID.stock > 0) {
                const newCarrito = primerStock(productoByID)
                await carritoProductos.save(newCarrito)
                const todosLosCarritos = await carritoProductos.getAllCarritos()
                const carritoAMostrar = todosLosCarritos[todosLosCarritos.length - 1]
                res.json({
                    message: "Se agrego con exito!",
                    carritos: carritoAMostrar
                })
                actualizarProducto(productoByID)
            } else {
                res.json({
                    message: "No hay suficiente stock"
                })
            }
        } else {
            res.json({
                message: "El producto solicitado NO EXISTE"
            })
        }
    } catch (error) {
        console.log(error)
    }
})


//Obtengo todos los productos de ese carrito.
carritoRouter.get("/:id/productos", async(req, res) => {
    const idSolicitado = parseInt(req.params.id)
    try {
        const carritoByID = await carritoProductos.getCarritoByID(idSolicitado)
        switch (carritoByID) {
            case 1:
                res.json({
                    message: `El Carrito con id ${idSolicitado} no existe`
                });
                break;
            case 2:
                res.json({
                    message: `Actualmente no existe ningun carrito creado`
                });
                break;
            default:
                res.json({
                    message: `El carrito ${idSolicitado} tiene:`,
                    productos: carritoByID.productos
                })
        }
    } catch (error) {
        console.log(error)
    }
})

//Para actualizar und dato del carrito, o agregar items al carrito
carritoRouter.post("/:id/productos", async(req, res) => {
    const idSolicitado = parseInt(req.params.id)
    const idProducto = parseInt(req.body.id)
    try {
        const carritoByID = await carritoProductos.getCarritoByID(idSolicitado)
        switch (carritoByID) {
            case 1:
                res.json({
                    message: `El Carrito con id ${idSolicitado} no existe`
                });
                break;
            case 2:
                res.json({
                    message: `Actualmente no existe ningun carrito creado`
                });
                break;
            case undefined:
                res.json({
                    message: `El archivo esta vacio`
                })
                break;
            default:
                const productoByID = await productosEnBD.getByID(idProducto);
                if (productoByID != undefined) {
                    if (productoByID.stock > 0) {
                        const indexDelProducto = carritoByID.productos.findIndex(elemen => elemen.id === productoByID.id)
                        if (indexDelProducto != -1) {
                            carritoByID.productos[indexDelProducto].stock = carritoByID.productos[indexDelProducto].stock + 1
                            carritoProductos.updateCarritoByID(idSolicitado, carritoByID.productos)
                            res.json({
                                message: `Se actualizo el carrito ${idSolicitado} correctamente`,
                                productos: carritoByID.productos
                            })
                            actualizarProducto(productoByID)
                        } else {
                            const newProduct = primerStock(productoByID)
                            carritoByID.productos.push(newProduct)
                            carritoProductos.updateCarritoByID(idSolicitado, carritoByID.productos)
                            res.json({
                                message: `Se actualizo el carrito ${idSolicitado} correctamente`,
                                productos: carritoByID.productos
                            })
                            actualizarProducto(productoByID)
                        }
                    } else(
                        res.json({
                            message: `No hay suficiente stock del producto de id: ${productoByID.id}`
                        })
                    )
                } else {
                    res.json({
                        message: `El producto de id: ${idProducto}, no existe`
                    })
                }
        }
    } catch (error) {
        console.log(error)
    }
})

carritoRouter.delete("/:id", async(req, res) => {
    const { id } = req.params
    try {
        carritoAeliminar = await carritoProductos.deleteCarritoByID(parseInt(id))
        console.log(carritoAeliminar)
        if (carritoAeliminar == 1) {
            res.json({
                message: `El carrito de id : ${id} no existe`
            })
        } else if (carritoAeliminar == 2) {
            res.json({
                message: "El Archivo esta vacio"
            })
        } else {
            res.json({
                message: `Se elimino el carrito de id: ${id}`
            })
        }
    } catch (error) {}
})

carritoRouter.delete("/:id/productos/:id_prod", async(req, res) => {
    const idSolicitado = parseInt(req.params.id)
    const idProducto = parseInt(req.params.id_prod)
    try {
        const carritoByID = await carritoProductos.getCarritoByID(idSolicitado)
        switch (carritoByID) {
            case 1:
                res.json({
                    message: `El Carrito con id ${idSolicitado} no existe`
                });
                break;
            case 2:
                res.json({
                    message: `Actualmente no existe ningun carrito creado`
                });
                break;
            case undefined:
                res.json({
                    message: `El archivo esta vacio`
                })
            default:
                const indexProducto = carritoByID.productos.findIndex(elm => elm.id == idProducto)
                if (indexProducto != -1) {
                    const productosActualizados = carritoByID.productos.filter(elm => elm.id != idProducto)
                    carritoProductos.updateCarritoByID(idSolicitado, productosActualizados)
                    res.json({
                        message: "Se borro los datos correctamente"
                    })
                } else {
                    res.json({
                        message: "No esta el producto en el carrito"
                    })
                }

        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = carritoRouter