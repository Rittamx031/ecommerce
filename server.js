const app = require("./src/app");
const PORT = process.env.PORT || 3000
const server = app.listen( PORT,  () =>{
    console.log(`Ecommerce server listening on ${PORT}`);    
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});