const moment = require('moment');
const mongoosePagination = require('mongoose-pagination');
const fileMethods = require('./fileMethods');
var path = require('path');
var fs = require('fs');

function saveCollection(payload) {
	let repeatedValidateQuery = [];
	if (payload.requestData['email']) {
		payload.requestData['email'] = payload.requestData['email'].toLowerCase();
	}

	return new Promise((resolve, reject) => {
		// 1. Repeated fields
		if (payload['repeatedFieldsOr']) {
			payload.repeatedFieldsOr.forEach((element) => {
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
						msg: `the_${payload.collection.modelName.toLowerCase()}_already_exist`
					});
				} else {
					save(payload)
						.then((resp) => resolve(resp))
						.catch((err) => reject(err));
				}
			});
		} else if (payload['repeatedFieldsAnd']) {
			payload.repeatedFieldsAnd.forEach((element) => {
				let obj = new Object();
				obj[element] = payload.requestData[element];
				repeatedValidateQuery.push(obj);
			});

			payload.collection.find({}).and(repeatedValidateQuery).exec((err, dataBaseResp) => {
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
						msg: `the_${payload.collection.modelName.toLowerCase()}_already_exist`
					});
				} else {
					save(payload)
						.then((resp) => resolve(resp))
						.catch((err) => reject(err));
				}
			});
		}


		else {
			save(payload)
				.then((resp) => resolve(resp))
				.catch((err) => reject(err));
		}
	});
}

function save(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `save_${payload.collection.modelName.toLowerCase()}_successs`;
	const msgError = payload.errorMessage ? payload.errorMessage : `save_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		let objToSave = new payload.collection();
		// 1. Moment
		objToSave['createdAt'] = moment().toISOString();
		objToSave['updatedAt'] = moment().toISOString();

		// 2. Set values
		for (let field in payload.requestData) {
			objToSave[field] = payload.requestData[field];
		}
		// 3. Save
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
	const msgSuccess = payload.successMessage ? payload.successMessage : `find_${payload.collection.modelName.toLowerCase()}_success`;
	const msgError = payload.errorMessage ? payload.errorMessage : `find_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Collection validate
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Query validate
		const query = payload.query ? payload.query : {};
		// 3. Sort validate
		const sort = payload.sort ? payload.sort : '';
		// 4. Populate fields validate
		const populate = payload.populateFields ? payload.populateFields : '';
		// 5. Fields unselected validate
		const unselectFieldsQuery = new Object();
		if (payload.hasOwnProperty('unselectFields')) {
			payload.unselectFields.forEach((element) => {
				unselectFieldsQuery[element] = 0;
			});
		}

		if (payload.pagination) {
			// 6. Page validate
			const page = payload.pagination ? payload.pagination.page : 1;
			// 7. Items per page validate
			const itemsPerPage = payload.pagination ? payload.pagination.itemsPerPage : 10;
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
						data: dataBaseResp
					});
				});

		} else {
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
		}

	});
}

function findByIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `findbyid_${payload.collection.modelName.toLowerCase()}_success`;
	const msgError = payload.errorMessage ? payload.errorMessage : `findbyid_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Collection validate
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 1. Id required validate
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});
		// 3. Fields unselected validate
		let unselectFieldsQuery = new Object();
		if (payload.hasOwnProperty('unselectFields')) {
			payload.unselectFields.forEach((element) => {
				unselectFieldsQuery[element] = 0;
			});
		}
		// 4. Populate fields validate
		let populate = payload.populateFields ? payload.populateFields : '';
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
						msg: `the_id ${payload.id} does_not_exist`
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

function pushIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `update_${payload.collection.modelName.toLowerCase()}_success`;
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
						msg: `the_id ${payload.id} does_not_exist`
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

function pullIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_${payload.collection.modelName.toLowerCase()}_success`;
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
						msg: `the_id ${payload.id} does_not_exist`
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

function updateIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `update_${payload.collection.modelName.toLowerCase()}_success`;
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
					msg: `the_id ${payload.id} does_not_exist`
				});
			dataBaseResp.__v = undefined;
			// 3. Validar si vienen archivos
			if (payload.files === undefined || payload.files === null) {
				// 4. Asignar valores y guardar
				for (let element in payload.requestData) {
					if (payload.requestData[element]) {
						dataBaseResp[element] = payload.requestData[element];
					}
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

function updateManyIds(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `updated_ids_${payload.collection.modelName.toLowerCase()}_success`;
	const msgError = payload.errorMessage ? payload.errorMessage : `updated_ids_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		payload.collection.update(
			{ _id: { $in: payload.ids } },
			{ $set: payload.requestData },
			{ multi: true },
			(err, dataBaseResp) => {
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
			})
	})
}

function incIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `update_${payload.collection.modelName.toLowerCase()}_success`;
	const msgError = payload.errorMessage ? payload.errorMessage : `update_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Validar que venga el campo id
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});

		payload.collection.update(
			{ _id: payload.id },
			{ $inc: payload.inc },
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
						msg: `the_id ${payload.id} does_not_exist`
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

function deleteIdCollection(payload) {
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_${payload.collection.modelName.toLowerCase()}_success`;
	const msgError = payload.errorMessage ? payload.errorMessage : `delete_${payload.collection.modelName.toLowerCase()}_error`;
	return new Promise((resolve, reject) => {
		// 1. Collection validation
		if (!payload.collection)
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `invalid_collection`
			});
		// 2. Id required validation
		if (!payload.hasOwnProperty('id'))
			return reject({
				status: 'WARNING',
				code: 422,
				msg: `the_field id is_required`
			});
		// 3. Delete data
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
					msg: `the_id ${payload.id} does_not_exist`
				});
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
	const msgSuccess = payload.successMessage ? payload.successMessage : `delete_collection_${payload.collection.modelName.toLowerCase()}_success`;
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
	findByIdCollection,
	findCollection,
	updateIdCollection,
	deleteIdCollection,
	removeCollection,
	pushIdCollection,
	pullIdCollection,
	updateManyIds,
	incIdCollection
};