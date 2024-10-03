const port = 8080
const app = require("express")()
const swaggerUi = require("swagger-ui-express")
const swaggerDoc = require("./swagger.json")

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get("/games", (req, res) => {
    res.send(["Witcher 3", "Cybepunk 2077"])
})


app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})