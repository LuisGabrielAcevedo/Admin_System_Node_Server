'use strict'
const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');

// const { ApolloServer } = require('apollo-server-express');
// const { typeDefs } = require('./graphql/schema');
// const { resolvers } = require('./graphql/resolvers');

Promise.all([
	serverConection(), 
	dataBaseConection(), 
	// apolloServerConection()
])
	.then(resp => {
		console.log(resp[0].msg);
		console.log(resp[1].msg);
		// console.log(resp[2].msg);
	})
	.catch(error => { console.log(error) })

// 1. Iniciar el servidor
function serverConection() {
	return new Promise((resolve, reject) => {
		app.listen(config.server.port, (err, resp) => {
			if (err) reject({ msg: 'Error de conexión, servidor' })
			resolve({ msg: `Servidor (${config.server.name}) funcionando correctamente por el puerto http://localhost:${config.server.port}` })
		})
	})
}

// 2. Conectar la base de datos de mongodb
function dataBaseConection() {
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://musicaga:aero2020.@ds139844.mlab.com:39844/adminsystemdb', { useNewUrlParser: true }, (err, res) => {
			if (err) reject({ msg: 'Error de conexión, base de datos' })
			// Eliminar warning de mongoose
			// mongoose.Promise = global.Promise
			// mongoose.set('setFindAndModify', false);
			//
			resolve({ msg: `Base de datos (${config.dataBase.name}) funcionando correctamente` })
		})
	})
}

// // 3. Iniciar apollo server
// function apolloServerConection() {
// 	return new Promise((resolve, reject) => {
// 		const server = new ApolloServer({ typeDefs, resolvers })
// 		server.applyMiddleware({ app });
// 		resolve({ msg: `Apollo server funcionando correctamente en: http://localhost:${config.server.port}${server.graphqlPath} ` })
// 	})
// }

