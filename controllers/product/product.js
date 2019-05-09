// Modelos
const Product = require('../../models/product/product');
const Company = require('../../models/company');
const ProductCategory = require('../../models/product/productCategory');
// Metodos de base de datos
const dataBase = require('../../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../../services/query');
// Metodos de validacion
const validation = require('../../services/validation');
// Metodos para manejar archivos
const fileMethods = require('../../services/fileMethods');
// Libreria para trabajar con ficheros
const path = require('path');

// 0. Funcion de prueba del controlador
function product(req, res) {
    res.status(200).send({ msg: 'Controlador productos funcionando' })
}
// 1. Guagar un producto
async function saveProduct(req, res) {
    const payload = {
        requiredFields: ['name', 'company', 'applicationCode', 'price', 'unit'],
        requestData: req.body,
        collection: Product,
        successMessage: 'Producto guardado con exito',
        errorMessage: 'Error guardando producto'
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Buscar productos
async function getProducts(req, res) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Product,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [
            {
                path: 'category',
                select: { name: 1 }
            },
            {
                path: 'company',
                select: { name: 1 }
            },
            {
                path: 'brand',
                select: { name: 1 }
            },
            {
                path: 'type',
                select: { name: 1 }
            },
            {
                path: 'profileImage',
                select: { url: 1 }
            }
        ],
        requiredFields: ['name', 'company', 'applicationCode', 'price', 'unit'],
        // filters: [
        //     {
        //         field: 'company',
        //         collection: Company
        //     },
        //     {
        //         field: 'category',
        //         collection: ProductCategory
        //     }
        // ],
        successMessage: 'Productos encontrados con exito',
        errorMessage: 'Error buscado productos'
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Actualizar un producto
async function updateProduct(req, res) {
    const payload = {
        id: req.params.id,
        collection: Product,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_PRODUCT',
        fileField: 'profileImage'
    }
    try {
        // await validation.body(Product, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Obtener la imagen del producto
async function getImage(req, res) {
    const payload = {
        id: req.params.id,
        fileName: req.params.file,
        path: 'uploads/product'
    }
    try {
        const resp = await fileMethods.getFile(payload);
        return res.sendFile(path.resolve(resp.url));
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


module.exports = {
    saveProduct,
    product,
    getProducts,
    updateProduct,
    getImage
}