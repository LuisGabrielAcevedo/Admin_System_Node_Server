const orderService = require('../../services/order');

// 0. Funcion de prueba del controlador
function order(req, res) {
    res.status(200).send({ msg: 'Controlador de ordenes del sistema funcionando' })
}

// 1. Guadar una orden
async function saveOrder(req, res) {

}

// 2. Borrar una orden
async function deleteOrder(req, res) {

}

// 3. Actualizar una orden 
async function updateOrder(req, res) {
    try {
        const resp = await orderService.updateOrderAction(req);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Buscar una orden una orden 
async function findOrder(req, res) {
}

// 5. Buscar todas las ordenes
async function findOrders(req, res) {
    try {
        const resp = await orderService.findOrdersAction(req);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    order,
    saveOrder,
    deleteOrder,
    updateOrder,
    findOrder,
    findOrders
}