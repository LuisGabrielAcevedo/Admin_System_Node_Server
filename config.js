const config = {
    server: {
        port: process.env.PORT || 3500,
        name: 'Admin System Server',
        token: {
            secret: 'adminSystemServer',
            adminPassword: 'adminSystemServer596',
            timeExpired: 60000
        },
        // urlApi: 'http://localhost:3500/api/v1/',
        urlApi: 'https://adminsystemapi.herokuapp.com/api/v1/'
    },
    dataBase: {
        name: 'Admin System Server'
    }
}

module.exports = config;