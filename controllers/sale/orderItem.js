const orderService = require('../../services/order');

// 0. Funcion de prueba del controlador
async function orderItem(req, res) {
    res.status(200).send({ msg: 'Controlador de items de las ordenes del sistema funcionando' })
}

// 1. Guadar un order item
async function saveOrderItem(req, res) {
    try {
        const resp = await orderService.saveOrderItemAction(req, res);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Borrar un order item
async function deleteOrderItem(req, res) {
    try {
        const resp = await orderService.deleteOrderItemAction(req);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Actualizar un order item
async function updateOrderItem(req, res) {
    try {
        const resp = await orderService.updateOrderItemAction(req);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}


module.exports = {
    orderItem,
    saveOrderItem,
    deleteOrderItem,
    updateOrderItem
}