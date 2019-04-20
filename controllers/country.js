// Modelos
const Country = require('../models/country');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');

// 0. Funcion de prueba del controlador
function country(req, res) {
    res.status(200).send({ msg: 'Controlador de paises del sistema funcionando' })
}

// 1. Guardar un pais
async function saveCountry(req, res) {
    const payload = {
        requiredFields: ['name', 'nameInitials', 'capital', 'language', 'currency'],
        repeatedFields: ['name', 'nameInitials'],
        requestData: req.body,
        collection: Country,
        successMessage: 'Pais guardado con exito',
        errorMessage: `Error guardando pais`
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener Paises
async function getCountries(req, res) {
    const searchFields = ['name', 'capital', 'language'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};

    const payload = {
        collection: Country,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        requiredFields: ['name', 'nameInitials', 'capital', 'language', 'currency'],
        successMessage: 'Paises encontrados con exito',
        errorMessage: 'Error buscando Paises'
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 3. Buscar Paises
async function findCountries(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country,
        unselectFields: ['__v'],
        successMessage: 'Pais encontrado con exito',
        errorMessage: `Error buscando pais, el pais con id ${req.params.id} no existe`
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Actualizar informacion del Pais
async function updateCountry(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country,
        requestData: req.body,
        successMessage: 'Country actualizado con exito',
        errorMessage: 'Error actualizando country'
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}



// 5. Borrar un Pais
async function removeCountry(req, res) {
    const payload = {
        id: req.params.id,
        collection: Country,
        successMessage: 'Pais eliminado con exito',
        errorMessage: 'Error eliminando Pais'
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener paises buscador
async function simpleSearch(req, res) {
	const searchFields = ['name', 'capital', 'language'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
	const payload = {
		collection: Country,
		query: query,
		unselectFields: [ '__v' ],
		sort: req.query.sort ? req.query.sort : 'createdAt',
		successMessage: 'Paises encontrados con exito',
        errorMessage: 'Error buscando Paises'
	};
	try {
		const resp = await dataBase.simpleSearch(payload);
		return res.status(resp.code).send(resp);
	} catch (err) {
		return res.status(err.code).send(err);
	}
}

module.exports = {
    country,
    saveCountry,
    getCountries,
    findCountries,
    updateCountry,
    removeCountry,
    simpleSearch
}