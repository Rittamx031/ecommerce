const app = require("./src/app");

const PORT = 3050;

const server = app.listen(PORT, ()=> {
    console.log(`Starting server on port ${PORT}`);
})