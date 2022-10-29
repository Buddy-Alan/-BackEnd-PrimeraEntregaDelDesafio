const express = require("express");
const app = express();
const productRouter = require("./routes/products");
const carritoRouter = require("./routes/routerCarts")

app.listen(8080, () => {
    console.log("server on port 8080")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verificarRol = ((req, res, next) => {
    const rol = "admin";
    console.log(rol + "En servidor")
    if (rol == "admin") {
        next()
    } else {
        res.json({
            message: "No pasas"
        })
    }
})

app.use("/api/productos", productRouter)

app.use("/api/carrito", carritoRouter)