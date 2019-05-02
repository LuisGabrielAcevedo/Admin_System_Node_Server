'use strict'

// 1. Express
const express = require('express');
const app = express();

// 2. Libreria para trabajar con archivos
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// 3. Cargar rutas
const adminRoutes = require('./routes/admin');
const dataBaseRoutes = require('./routes/dataBase');
const countryRoutes = require('./routes/country');
const companyRoutes = require('./routes/company');
const userRoutes = require('./routes/user');
const applicationRoutes = require('./routes/application');
const permissionRoutes = require('./routes/permission');
const rolRoutes = require('./routes/rol');
const localRoutes = require('./routes/store');
const customerRoutes = require('./routes/customer');
const licenseRoutes = require('./routes/license');
const adminSystemRoutes = require('./routes/adminSystem');
const productTypeRoutes = require('./routes/product/productType');
const productCategoryRoutes = require('./routes/product/productCategory');
const productRoutes = require('./routes/product/product');
const brandRoutes = require('./routes/product/brand');
const vendorRoutes = require('./routes/product/vendor');
const orderRoutes = require('./routes/sale/order');
const orderItemRoutes = require('./routes/sale/orderItem');

// 4. Configuracion del body parser
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// 5. socket configuration
// const socketIO = require('socket.io');
// const http = require('http');
// const server = http.createServer(app);
// module.exports.io = socketIO(server);
// require('./sockets/sockets');

// server.listen(5000, (err) => {
//     if (err) throw new Error(err);
//     console.log(`Servidor de sockets funcionando correctamente por el puerto http://localhost:${ 5000 }`);
// });

// 6. Configuracion de las cabeceras para la comunicacion con angular
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, pincode');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// 7. Rutas base de funcionamiento
app.use('/api/v1', adminRoutes);
app.use('/api/v1', dataBaseRoutes);
app.use('/api/v1', countryRoutes);
app.use('/api/v1', companyRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', applicationRoutes);
app.use('/api/v1', permissionRoutes);
app.use('/api/v1', rolRoutes);
app.use('/api/v1', localRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1', licenseRoutes);
app.use('/api/v1', adminSystemRoutes);
app.use('/api/v1', productTypeRoutes);
app.use('/api/v1', productCategoryRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', brandRoutes);
app.use('/api/v1', vendorRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', orderItemRoutes);

// 8. Exportar app
module.exports = app;