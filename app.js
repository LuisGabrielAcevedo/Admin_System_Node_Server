"use strict";

// 1. Express
const express = require("express");
const app = express();

// 2. Files
const fileUpload = require("express-fileupload");
app.use(fileUpload());

// 3. Routes
const dataBaseRoutes = require("./routes/dataBase");
const countryRoutes = require("./routes/country");
const stateRoutes = require("./routes/state");
const companyRoutes = require("./routes/company");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");
const permissionRoutes = require("./routes/permission");
const rolRoutes = require("./routes/role");
const storeRoutes = require("./routes/store");
const customerRoutes = require("./routes/customer");
const licenseRoutes = require("./routes/license");
const adminSystemRoutes = require("./routes/adminSystem");
const productTypeRoutes = require("./routes/inventory/productType");
const productCategoryRoutes = require("./routes/inventory/productCategory");
const roomsRoutes = require("./routes/inventory/room");
const productRoutes = require("./routes/inventory/product");
const brandRoutes = require("./routes/inventory/brand");
const vendorRoutes = require("./routes/inventory/vendor");
const orderRoutes = require("./routes/sale/order");
const orderItemRoutes = require("./routes/sale/orderItem");
const followRoutes = require("./routes/follow");
const postRoutes = require("./routes/post/post");
const likeRoutes = require("./routes/post/like");
const commentRoutes = require("./routes/post/comment");

// 4. Body parser
const body_parser = require("body-parser");
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// 5. Cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, pincode"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// 6. Routes
app.use("/api/v1", dataBaseRoutes);
app.use("/api/v1", countryRoutes);
app.use("/api/v1", stateRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1", permissionRoutes);
app.use("/api/v1", rolRoutes);
app.use("/api/v1", storeRoutes);
app.use("/api/v1", customerRoutes);
app.use("/api/v1", licenseRoutes);
app.use("/api/v1", adminSystemRoutes);
app.use("/api/v1", productTypeRoutes);
app.use("/api/v1", productCategoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", brandRoutes);
app.use("/api/v1", vendorRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", orderItemRoutes);
app.use("/api/v1", followRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", likeRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", roomsRoutes);

// 7. sockets

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
require("./sockets/post")(io);

module.exports = server;
