const config = require('../config');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const Image = require('../models/image');
const dataBase = require('./dataBaseMethods');

function validateFile(id, type, file) {
	const imageExtensions = ['png', 'jpg', 'gif', 'svg', 'jpeg'];
	const videoExtensions = ['mp4'];
	const audioExtensions = ['mp3'];
	const types = ['IMAGE_ADMIN', 'IMAGE_USER', 'IMAGE_COMPANY', 'IMAGE_CUSTOMER', 'LOGO_COMPANY', 'IMAGE_PRODUCT'];
	return new Promise((resolve, reject) => {
		// 0. Validamos tipos validos
		if (!types.includes(type))
			return reject({
				msg:
					'El campo type es invalido. Los tipos validos son: IMAGE_ADMIN, IMAGE_USER, IMAGE_COMPANY, IMAGE_CUSTOMER, LOGO_COMPANY'
			});
		// 1. Recibimos el archivo lo separamos por punto
		const fileSplit = file.name.split('.');
		// 2. Tomamos la extension
		const fileExt = fileSplit[fileSplit.length - 1];
		// 3. Validamos la extension
		switch (type) {
			case 'IMAGE_ADMIN':
			case 'IMAGE_USER':
			case 'IMAGE_COMPANY':
			case 'IMAGE_CUSTOMER':
			case 'LOGO_COMPANY':
			case 'IMAGE_PRODUCT':
				if (!imageExtensions.includes(fileExt.toLowerCase()))
					return reject({
						msg:
							'La extension del archivo no es valida. Las extensiones validas son: png, jpg, gif, jpeg, svg'
					});
				break;
		}
		// 4. Cambiamos el nombre del archivo
		const fileName = `${id}${parseInt(Math.random() * (10000 - 5000) + 5000)}_${type}.${fileExt}`;
		// 5. Asignamos parametros
		let url = '';
		let pathToSave = '';
		let pathPreFormat, pathFormated, directory;
		switch (type) {
			case 'IMAGE_ADMIN':
				pathToSave = `uploads/admin`;
				url = `${config.server.urlApi}admins/image/${id}/${fileName}`;
				break;
			case 'IMAGE_CUSTOMER':
				pathToSave = `uploads/customer`;
				url = `${config.server.urlApi}customers/image/${id}/${fileName}`;
				break;
			case 'IMAGE_USER':
				pathToSave = `uploads/user`;
				url = `${config.server.urlApi}users/image/${id}/${fileName}`;
				break;
			case 'IMAGE_COMPANY':
				pathToSave = `uploads/company/image`;
				url = `${config.server.urlApi}companies/image/${id}/${fileName}`;
				break;
			case 'LOGO_COMPANY':
				pathToSave = `uploads/company/logo`;
				url = `${config.server.urlApi}companies/logo/${id}/${fileName}`;
				break;
			case 'IMAGE_PRODUCT':
				pathToSave = `uploads/product`;
				url = `${config.server.urlApi}products/image/${id}/${fileName}`;
				break;
		}
		pathPreFormat = `${__dirname}${pathToSave}/${id}`;
		pathFormated = pathPreFormat.split('services').join('');
		directory = path.normalize(pathFormated);
		return resolve({
			fileName: fileName,
			associatedId: id,
			type,
			url,
			path: pathToSave,
			directory
		});
	});
}

function verifyDirectory(directory) {
	return new Promise((resolve, reject) => {
		fs.stat(directory, (error) => {
			if (error) {
				if (error.code === 'ENOENT') {
					fs.mkdir(directory, (error) => {
						if (error) {
							reject({
								msg:
									'Error creando directorio nuevo, revisar las carpetas en /uploads del repositorio de la aplicacion'
							});
						} else {
							resolve({ directory: directory });
						}
					});
				} else {
					reject({ msg: 'Error verificancdo el tipo de error de existencia del directorio' });
				}
			} else {
				resolve({ directory: directory });
			}
		});
	});
}

function getFile(payload) {
	let url = `${payload.path}/${payload.id}/${payload.fileName}`;
	return new Promise((resolve, reject) => {
		// 1. Validar que venga el campo id
		if (!payload.hasOwnProperty('id') || !payload.hasOwnProperty('path') || !payload.hasOwnProperty('fileName'))
			return reject({
				status: 'ERROR',
				code: 500,
				msg: `Datos incompletos para mostrar obtener un archivo. El objeto debe tener los siguientes campos id, fileName y path. Ej: { id: req.params.id, fileName: req.params.file, path: 'uploads/admin'}`
			});
		fs.exists(url, function (exists) {
			if (exists) {
				resolve({ url: url });
			} else {
				reject({
					status: 'ERROR',
					code: 500,
					msg: 'El archivo no existe'
				});
			}
		});
	});
}

function saveImage(payload) {
	return new Promise((resolve, reject) => {
		// 1. Validar extension
		validateFile(payload.id, payload.type, payload.files.file)
			.then((fileExtensionResp) => {
				// 2. Verificar directorio
				verifyDirectory(fileExtensionResp.directory)
					.then(() => {
						// 3. Mover el archivo
						let newPath = `${fileExtensionResp.directory}/${fileExtensionResp.fileName}`;
						payload.files.file.mv(path.normalize(newPath), (err) => {
							if (err)
								reject({
									status: 'WARNING',
									code: 422,
									msg: `error_move_file ${path.normalize(newPath)}`
								});
							let objToSave = new Image();
							// 4. Setear el momento de registro
							objToSave['createdAt'] = moment().toISOString();
							objToSave['updatedAt'] = moment().toISOString();
					
							// 5. Asignar valores
							for (let field in fileExtensionResp) {
								objToSave[field] = fileExtensionResp[field];
							}
							// 6. Guardar imagen
							objToSave.save((err, dataBaseResp1) => {
								if (err)
									return reject({
										status: 'ERROR',
										code: 500,
										msg: msgError
									});
								dataBaseResp1.__v = undefined;
								return resolve(dataBaseResp1);
							});
						})
					})
					.catch((fileDirectoryError) => {
						reject({
							status: 'ERROR',
							code: 404,
							msg: fileDirectoryError.msg
						});
					});
			})
			.catch((fileExtensionError) => {
				reject({
					status: 'ERROR',
					code: 404,
					msg: fileExtensionError.msg
				});
			});
	})
}


module.exports = {
	validateFile,
	verifyDirectory,
	getFile,
	saveImage
};
