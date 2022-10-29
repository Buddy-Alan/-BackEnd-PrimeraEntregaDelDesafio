const fs = require("fs");

class Cart {

    constructor(nameFile) {
        this.nameFile = nameFile;
    }

    save = async(carritoNuevo) => {
            try {
                if (fs.existsSync(this.nameFile)) {
                    const contenidoDelArchivo = await fs.promises.readFile(this.nameFile, "utf-8");
                    if (contenidoDelArchivo) {
                        const carritoEnJSON = JSON.parse(contenidoDelArchivo)
                        console.log(carritoEnJSON.length)
                        if (carritoEnJSON.length == 0) {
                            const newCarrito = {
                                id: 1,
                                timestamp: new Date(),
                                productos: [carritoNuevo]
                            }
                            await fs.promises.writeFile(this.nameFile, JSON.stringify([newCarrito], null, 2))
                        }
                        const newCart = {
                            id: carritoEnJSON[carritoEnJSON.length - 1].id + 1,
                            timestamp: new Date(),
                            productos: [carritoNuevo]
                        }
                        carritoEnJSON.push(newCart)
                        await fs.promises.writeFile(this.nameFile, JSON.stringify(carritoEnJSON, null, 2))
                    } else {
                        const newCarrito = {
                            id: 1,
                            timestamp: new Date(),
                            productos: [carritoNuevo]
                        }
                        await fs.promises.writeFile(this.nameFile, JSON.stringify([newCarrito], null, 2))
                        console.log("Se carga el primer carrito")
                    }
                } else {
                    const newCarrito = {
                        id: 1,
                        timestamp: new Date(),
                        productos: [carritoNuevo]
                    }
                    await fs.promises.writeFile(this.nameFile, JSON.stringify([newCarrito], null, 2))
                }
            } catch (error) {
                console.log(error)
            }
        } //Fin del if de "Save"

    getCarritoByID = async(idDelCarrito) => {
        //Ver porque no me da los carritos
        try {
            if (fs.existsSync(this.nameFile)) {
                const contenidoDelArchivoDelCarrito = await fs.promises.readFile(this.nameFile, "utf-8")
                if (contenidoDelArchivoDelCarrito) {
                    const contenidoCarritoEnJSON = JSON.parse(contenidoDelArchivoDelCarrito)
                    const carritoSolicitado = contenidoCarritoEnJSON.find(item => item.id === idDelCarrito)
                    if (carritoSolicitado != undefined) {
                        return carritoSolicitado
                    } else {
                        return 1
                    }
                }
            } else {
                return 2
            }
        } catch (error) {
            console.log(error)
        }

    }




    getAllCarritos = async() => {
        try {
            if (fs.existsSync(this.nameFile)) {
                const contenidoDelArchivo = await fs.promises.readFile(this.nameFile, "utf-8")
                if (contenidoDelArchivo) {
                    const carritoEnJSON = JSON.parse(contenidoDelArchivo)
                    return carritoEnJSON
                } else("El archivo esta vacio")
            } else {
                console.log("El archivo no exise")
            }
        } catch (error) {
            console.log(error)
        }
    }

    //Actualizar update carrito by id

    updateCarritoByID = async(idCarrito, datoAActualizar) => {
        try {
            const contenidoCarrito = await this.getAllCarritos()
            const indexAActualizar = contenidoCarrito.findIndex(e => e.id === idCarrito)
            if (indexAActualizar == -1) {
                console.log("El id no existe")
            } else {
                if (datoAActualizar == "") {
                    await this.deleteCarritoByID(idCarrito)
                } else {
                    contenidoCarrito[indexAActualizar] = {
                        id: idCarrito,
                        horario: new Date(),
                        productos: datoAActualizar
                    }
                    fs.promises.writeFile(this.nameFile, JSON.stringify(contenidoCarrito, null, 2))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteCarritoByID = async(idAEliminar) => {
        try {
            if (fs.existsSync(this.nameFile)) {
                const todoLosCarritos = await this.getAllCarritos()
                const carritoAEliminar = await this.getCarritoByID(idAEliminar)
                if (todoLosCarritos.length != 0) {
                    if (carritoAEliminar != 1 && carritoAEliminar != 2) {
                        const carritoActualizado = todoLosCarritos.filter(elm => elm.id != carritoAEliminar.id)
                        await fs.promises.writeFile(this.nameFile, JSON.stringify(carritoActualizado, null, 2))
                    } else {
                        return 1
                    }
                } else {
                    return 2
                }
            } else {
                return 2
            }
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = Cart