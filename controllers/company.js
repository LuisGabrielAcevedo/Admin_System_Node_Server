// models
const Company = require('../models/company');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar archivos
const fileMethods = require('../services/fileMethods');
// Libreria para trabajar con ficheros
const path = require('path');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function company(req, res) {
	res.status(200).send({ msg: 'Controlador de empresas funcionando' });
}
// 1. Guardar empresa
async function saveCompany(req, res) {
	const payload = {
		requiredFields: [ 'country', 'name', 'application' ],
		repeatedFields: [ 'name' ],
		requestData: req.body,
		collection: Company
	};
	try {
		await validation.body(Company, req.body, 'POST');
		const resp = await dataBase.saveCollection(payload);
		return res.status(200).send(resp);
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

// 2. Obtener Empresas
async function getCompanies(req, res) {
	const searchFields = [ 'name' ];
	const query =
		req.query.search || req.query.filters
			? queryMethods.query(req.query.search, searchFields, req.query.filters)
			: {};

	const payload = {
		collection: Company,
		query: query,
		sort: req.query.sort ? req.query.sort : '-updatedAt',
		page: req.query.page ? Number(req.query.page) : 1,
		itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
		unselectFields: [ '__v' ],
		populateFields: [
			{
				path: 'country',
				select: { name: 1, _id: 1 }
			},
			{
				path: 'stores',
				select: { name: 1, _id: 1 }
			},
			{
				path: 'application',
				select: { name: 1, _id: 1 }
			},
			{
				path: 'admin',
				select: { firstName: 1, _id: 1, profileImage: 1 }
			},
			{
                path: 'profileImage',
                select: { url: 1 }
            }
		]
	};
	try {
		const resp = await dataBase.findCollection(payload);
		return res.status(resp.code).send(resp);
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

// 4. Actualizar una Empresa
async function updateCompany(req, res) {
	const payload = {
        id: req.params.id,
        collection: Company,
        requestData: req.body,
        files: req.files,
        type: 'IMAGE_COMPANY',
        fileField: 'profileImage'
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar una empresa
async function removeCompany(req, res) {
	const payload = {
		id: req.params.id,
		collection: Company,
		fileFields: [ 'profileImage', 'logo' ]
	};
	try {
		const resp = await dataBase.removeCollectionId(payload);
		return res.status(resp.code).send(resp);
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

// 6. Obtener la imagen de la empresa
async function getImage(req, res) {
	const payload = {
		id: req.params.id,
		fileName: req.params.file,
		path: 'uploads/company/image'
	};
	try {
		const resp = await fileMethods.getFile(payload);
		return res.sendFile(path.resolve(resp.url));
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

// 7. Obtener el logo de la empresa
async function getLogo(req, res) {
	const payload = {
		id: req.params.id,
		fileName: req.params.file,
		path: 'uploads/company/logo'
	};
	try {
		const resp = await fileMethods.getFile(payload);
		return res.sendFile(path.resolve(resp.url));
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

// 8. Obtener compañias buscador
async function simpleSearch(req, res) {
	const searchFields = [ 'name' ];
	const query =
		req.query.search || req.query.filters
			? queryMethods.query(req.query.search, searchFields, req.query.filters)
			: {};
	const payload = {
		collection: Company,
		query: query,
		unselectFields: [ '__v' ],
		populateFields: [
			{
				path: 'application',
				select: { name: 1, _id: 1, code: 1 }
			},
			{
                path: 'profileImage',
                select: { url: 1 }
            }
		],
		sort: req.query.sort ? req.query.sort : '-updatedAt'
	};
	try {
		const resp = await dataBase.simpleSearch(payload);
		return res.status(resp.code).send(resp);
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

module.exports = {
	company,
	saveCompany,
	updateCompany,
	removeCompany,
	getCompanies,
	getImage,
	getLogo,
	simpleSearch
};
