const app = require("./src/app");
const PORT = 3050
const server = app.listen( PORT,  () =>{
    console.log(`Ecommerce server listening on ${PORT}`);    
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});