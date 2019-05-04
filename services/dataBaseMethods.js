// Libreria para registrar momento
const moment = require('moment');
// Libreria para la paginacion con mongoose
const mongoosePagination = require('mongoose-pagination');
// Metodos para trabajar con archivos
const fileMethods = require('./fileMethods');
// Libreria para acceder a la base de datos
const mongoose = require('mongoose');
// Librerias para trabajar con ficheros
var path = require('path');
var fs = require('fs');

function saveCollection(payload) {
	let repeatedValidateQuery = [];
	if (payload.requestData.hasOwnProperty('email')) {
		payload.requestData['email'] = payload.requestData['email'].toLowerCase();
	}

	return new Promise((resolve, reject) => {
		// 1. Validar campos repetidos
		if (payload.hasOwnProperty('repeatedFields')) {
			payload.repeatedFields.forEach((element) => {
				let obj = new Object();
				obj[element] = payload.requestData[element];
				repeatedValidateQuery.push(obj);
			});
			payload.collection.find({}).or(repeatedValidateQuery).exec((err, dataBaseResp) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: 'data_base_error_repeated_fields'
					});
				if (dataBaseResp && dataBaseResp.length >= 1) {
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `the_object_already_exist`
					});
				} else {
					save(payload)
						.then((resp) => {
							resolve(resp);
						})
						.catch((err) => {
							reject(err);
						});
				}
			});
		} else {
			save(payload)
				.then((resp) => {
					resolve(resp);
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
}

function save(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `save_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `save_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		let objToSave = new payload.collection();
		// 1. Setear el momento de registro
		objToSave['createdAt'] = moment().toISOString();
		objToSave['updatedAt'] = moment().toISOString();

		// 2. Asignar valores
		for (let field in payload.requestData) {
			objToSave[field] = payload.requestData[field];
		}
		// 3. Guardar objeto en la base de datos
		objToSave.save((err, dataBaseResp1) => {
			if (err)
				return reject({
					status: 'ERROR',
					code: 500,
					msg: msgError
				});
			dataBaseResp1.__v = undefined;
			return resolve({
				status: 'OK',
				code: 200,
				msg: msgSuccess,
				data: dataBaseResp1
			});
		});
	});
}

function findCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `find_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `find_${payload.collection.modelName.toLowerCase()}_error`;
	let tableFields = ['_id'];
	if (payload.tableFields) {
		tableFields = payload.tableFields;
	} else {
		for (const tableField in mongoose.modelSchemas[payload.collection.modelName].obj) {
			tableFields.push(tableField);
		}
	}
	return new Promise((resolve, reject) => {
		// 1. Validar coleccion
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Validar query
		let query = payload.query ? payload.query : {};
		// 3. Validar sort
		let sort = payload.sort ? payload.sort : '';
		// 4. Validar pagina
		let page = payload.page ? payload.page : 1;
		// 5. Validar items por pagina
		let itemsPerPage = payload.itemsPerPage ? payload.itemsPerPage : 10;
		// 6. Validar campos populados
		let populate = payload.populateFields ? payload.populateFields : '';
		// 7. Validar campos no selecionados
		let unselectFieldsQuery = new Object();
		if (payload.hasOwnProperty('unselectFields')) {
			payload.unselectFields.forEach((element) => {
				unselectFieldsQuery[element] = 0;
			});
		}
		if (payload.hasOwnProperty('filters')) {
			let promiseData = [];
			payload.filters.forEach(filter => {
				promiseData.push(getGroup(payload.collection, query, filter));
			})
			Promise.all(promiseData)
				.then(resp => {
					console.log(resp);
				})
				.catch(error => {
					console.log('hay error');
				})
		}
		payload.collection
			.find(query)
			.select(unselectFieldsQuery)
			.sort(sort)
			.populate(populate)
			.paginate(page, itemsPerPage, (err, dataBaseResp, totalItems) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: msgError
					});
				return resolve({
					status: 'OK',
					code: 200,
					msg: msgSuccess,
					totalItems: totalItems,
					totalPages: Math.ceil(totalItems / itemsPerPage),
					currentPage: page,
					itemsPerPage: itemsPerPage,
					// tableFields: tableFields,
					data: dataBaseResp
				});
			});
	});
}

function getGroup(collection, query, filter) {
	return new Promise((resolve, reject) => {
		collection.aggregate([
			{ $match: query },
			{
				$group: {
					_id: `$${filter.field}`,
					count: { $sum: 1 }
				}
			}
		]).exec((err, dataBaseResp) => {
			let promiseData = [];
			dataBaseResp.forEach(element => {
				promiseData.push(findByIdPromise(filter.collection, element._id, element.count));
			})
			Promise.all(promiseData)
				.then(resp => {
					resolve(resp);
				})
				.catch(error => {
					console.log('error');
				})
		});
	})
}

function findByIdPromise(collection, id, count) {
	return new Promise((resolve, reject) => {
		collection.findById(id).exec((err, dataBaseResp) => {
			resolve({
				_id: id,
				name: dataBaseResp.name,
				count: count
			})
		})
	})
}

function simpleSearch(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `find_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `find_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar query
		let query = payload.query ? payload.query : {};
		// 2. Validar sort
		let sort = payload.sort ? payload.sort : '';
		// 3. Validar campos no seleccionados
		let unselectFieldsQuery = new Object();
		if (payload.hasOwnProperty('unselectFields')) {
			payload.unselectFields.forEach((element) => {
				unselectFieldsQuery[element] = 0;
			});
		}
		// 4. Validar campos populados
		let populate = payload.populateFields ? payload.populateFields : '';
		payload.collection
			.find(query)
			.select(unselectFieldsQuery)
			.populate(populate)
			.sort(sort)
			.exec((err, dataBaseResp) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: msgError
					});
				return resolve({
					status: 'OK',
					code: 200,
					msg: msgSuccess,
					data: dataBaseResp
				});
			});
	});
}

function findCollectionId(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `findbyid_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `findbyid_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar coleccion
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});
		// 3. Validar si viene los campos a desmarcar
		let unselectFieldsQuery = new Object();
		if (payload.hasOwnProperty('unselectFields')) {
			payload.unselectFields.forEach((element) => {
				unselectFieldsQuery[element] = 0;
			});
		}
		// 4. Validar campos populados
		let populate = payload.populateFields ? payload.populateFields : '';
		// 5. Consulta a base de datos
		payload.collection
			.findById(payload.id)
			.select(unselectFieldsQuery)
			.populate(populate)
			.exec((err, dataBaseResp) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: msgError
					});
				if (!dataBaseResp)
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `the_id ${payload.id} does_not_exist. it_has_probably_already_been_eliminated`
					});
				return resolve({
					status: 'OK',
					code: 200,
					msg: msgSuccess,
					data: dataBaseResp
				});
			});
	});
}

function pushCollectionId(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `update_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `update_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});

		payload.collection.findByIdAndUpdate(
			payload.id,
			{ $push: payload.push },
			(err, dataBaseResp) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: msgError
					});
				if (!dataBaseResp)
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `the_id ${payload.id} does_not_exist. it_has_probably_already_been_eliminated`
					});
				return resolve({
					status: 'OK',
					code: 200,
					msg: msgSuccess,
					data: dataBaseResp
				});
			});

	});
}

function pullCollectionId(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `delete_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});

		payload.collection.findByIdAndUpdate(
			payload.id,
			{ $pull: payload.pull },
			(err, dataBaseResp) => {
				if (err)
					return reject({
						status: 'ERROR',
						code: 500,
						msg: msgError
					});
				if (!dataBaseResp)
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `the_id ${payload.id} does_not_exist. it_has_probably_already_been_eliminated`
					});
				return resolve({
					status: 'OK',
					code: 200,
					msg: msgSuccess,
					data: dataBaseResp
				});
			});

	});
}

function updateCollectionId(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `update_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `update_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});

		// 2. Buscar si el id es valido
		payload.collection.findById(payload.id).exec((err, dataBaseResp) => {
			if (err)
				return reject({
					status: 'ERROR',
					code: 500,
					msg: 'data_base_error'
				});
			if (!dataBaseResp)
				return reject({
					status: 'WARNING',
					code: 422,
					msg: `the_id ${payload.id} does_not_exist. it_has_probably_already_been_eliminated`
				});
			dataBaseResp.__v = undefined;
			// 3. Validar si vienen archivos
			if (payload.files === undefined || payload.files === null) {
				// 4. Asignar valores y guardar
				for (let element in payload.requestData) {
					if (payload.requestData.hasOwnProperty(element))
						dataBaseResp[element] = payload.requestData[element];
				}
				dataBaseResp['updatedAt'] = moment().toISOString();
				payload.collection.findByIdAndUpdate(dataBaseResp._id, dataBaseResp, (err, dataBaseResp1) => {
					if (err)
						return reject({
							status: 'WARNING',
							code: 422,
							msg: msgError
						});
					return resolve({
						status: 'OK',
						code: 200,
						msg: msgSuccess,
						data: dataBaseResp
					});
				});
			} else {
				if (!payload.files.hasOwnProperty('file'))
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `it_is_necessary_that_the_file_arrives_with_the_name_file`
					});
				if (!payload.hasOwnProperty('type'))
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `The_field_type_is_required_to_complete_the_update_process. Example: type: 'IMAGE_ADMIN' | type: 'IMAGE_USER' | type: 'IMAGE_COMPANY' `
					});
				if (!payload.hasOwnProperty('fileField'))
					return reject({
						status: 'WARNING',
						code: 422,
						msg: `The_field_fileField_is_required_to_complete_the_update_process. Example: fileField: 'profileImage'. Se refiere al campo donde va la imagen en el objeto`
					});
				fileMethods.saveImage(payload)
					.then(saveImageResp => {
						dataBaseResp[payload.fileField] = saveImageResp._id;
						payload.collection.findByIdAndUpdate(
							dataBaseResp._id,
							dataBaseResp,
							(err, dataBaseResp1) => {
								if (err)
									return reject({
										status: 'ERROR',
										code: 500,
										msg: msgError
									});
								return resolve({
									status: 'OK',
									code: 200,
									msg: msgSuccess,
									data: dataBaseResp
								});
							}
						);
					})
					.catch(saveImageError => {
						reject(saveImageError);
					})
			}
		});
	});
}

function removeCollectionId(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `delete_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar coleccion
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});
		// 3. Borrar en base de datos
		payload.collection.findByIdAndRemove(payload.id, (err, dataBaseResp) => {
			if (err)
				return reject({
					status: 'ERROR',
					code: 500,
					msg: msgError
				});
			if (!dataBaseResp)
				return reject({
					status: 'WARNING',
					code: 422,
					msg: `the_id ${payload.id} does_not_exist. it_has_probably_already_been_eliminated`
				});
			// // 4. Borrar ficheros
			// if (payload.hasOwnProperty('fileFields')) {
			// 	payload.fileFields.forEach((fileField) => {
			// 		if (dataBaseResp[fileField].fileName) {
			// 			const currentPath = `${dataBaseResp[fileField].directory}/${dataBaseResp[fileField].fileName}`;
			// 			const curretPathFormated = path.normalize(currentPath);
			// 			fs.exists(curretPathFormated, function (exists) {
			// 				if (exists) fs.unlink(curretPathFormated);
			// 				fs.exists(dataBaseResp[fileField].directory, function (exists) {
			// 					if (exists) fs.rmdirSync(dataBaseResp[fileField].directory);
			// 				});
			// 			});
			// 		}
			// 	});
			// }
			dataBaseResp.__v = undefined;
			return resolve({
				status: 'OK',
				code: 200,
				msg: msgSuccess,
				data: dataBaseResp
			});
		});
	});
}

function removeCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_collection_${payload.collection.modelName.toLowerCase()}_succes`;
	const msgError = payload.errorMessage ? payload.errorMessage : `delete_collection_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar coleccion
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Borrar coleccion
		payload.collection.find({}).remove((err) => {
			if (err)
				return reject({
					status: 'ERROR',
					code: 500,
					msg: msgError
				});
			return resolve({
				status: 'OK',
				code: 200,
				msg: msgSuccess
			});
		});
	});
}

module.exports = {
	saveCollection,
	findCollectionId,
	findCollection,
	updateCollectionId,
	removeCollectionId,
	removeCollection,
	simpleSearch,
	pushCollectionId,
	pullCollectionId
};



// // 5. Validar extension
// fileMethods
// 	.validateFile(payload.id, payload.type, payload.files.file)
// 	.then((fileExtensionResp) => {
// 		// 6. Validar existencia del directorio
// 		fileMethods
// 			.verifyDirectory(fileExtensionResp.directory)
// 			.then(() => {
// 				// 7. Verificar si el archivo anterior existe
// 				if (dataBaseResp[payload.fileField].fileName) {
// 					const oldPath = `${fileExtensionResp.path}/${payload.id}/${dataBaseResp[
// 						payload.fileField
// 					].fileName}`;
// 					// 8. Eliminar archivo anterior
// 					fs.exists(path.normalize(oldPath), function (exists) {
// 						if (exists) {
// 							fs.unlink(path.normalize(oldPath));
// 						}
// 					});
// 				}
// 				// 9. Asignar nuevo archivo al objeto
// 				dataBaseResp[payload.fileField].fileName = fileExtensionResp.fileName;
// 				dataBaseResp[payload.fileField].url = fileExtensionResp.url;
// 				dataBaseResp[payload.fileField].directory = fileExtensionResp.directory;
// 				// 10 . Actualizar campos en el objeto
// 				for (let element in payload.requestData) {
// 					if (payload.requestData.hasOwnProperty(element))
// 						dataBaseResp[element] = payload.requestData[element];
// 				}
// 				// 11. Setear el momento de la actualizacion
// 				dataBaseResp['updatedAt'] = moment().toISOString();
// 				// 12. Mover archivo al directorio
// 				let newPath = `${fileExtensionResp.directory}/${fileExtensionResp.fileName}`;
// 				payload.files.file.mv(path.normalize(newPath), (err) => {
// 					if (err)
// 						reject({
// 							status: 'WARNING',
// 							code: 422,
// 							msg: `error_move_file ${path.normalize(newPath)}`
// 						});

// 				});
// 			})
// 			.catch((fileDirectoryError) => {
// 				reject({
// 					status: 'WARNING',
// 					code: 422,
// 					msg: fileDirectoryError.msg
// 				});
// 			});
// 	})
// 	.catch((fileExtensionError) => {
// 		reject({
// 			status: 'WARNING',
// 			code: 422,
// 			msg: fileExtensionError.msg
// 		});
// 	});