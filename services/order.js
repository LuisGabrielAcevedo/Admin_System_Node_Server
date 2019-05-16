// Modelos
const Order = require('../models/sale/order');
const OrderItem = require('../models/sale/orderItem');
// Metodos de validacion
const validation = require('./validation');
// Metodos para manejar archivos
const dataBase = require('./dataBaseMethods');
const queryMethods = require('./query');

async function saveOrderAction(req) {

}

async function deleteOrderAction(req) {

}

async function updateOrderAction(req) {
    // orden sin customer, cambiar despues
    let payload;
    if (req.params.id !== 'null') {
        payload = {
            id: req.params.id,
            collection: Order,
            requestData: req.body
        }
    } else {
        if (req.tokenVerified.company) {
            req.body.company = req.tokenVerified.company._id
            req.body.user = req.tokenVerified._id
        }
        payload = {
            collection: Order,
            requestData: req.body
        }
    }
    try {
        // await validation.body(OrderItem, req.body);
        const resp = req.params.id !== 'null' ? await dataBase.updateIdCollection(payload) : await dataBase.saveCollection(payload);
        const orderFinal = await calculateAccountsAction(resp.data._id);
        resp.data = orderFinal;
        return resp;
    } catch (e) {
        return e;
    }
}

async function saveOrderItemAction(req) {
    try {
        if (req.tokenVerified.company) {
            req.body.company = req.tokenVerified.company._id
        }
        // await validation.body(OrderItem, req.body, 'POST');
        const orderItemResp = await dataBase.saveCollection({
            requestData: req.body,
            collection: OrderItem
        });
        const orderId = req.params.orderId;
        let order = null;
        if (orderId) {
            order = await dataBase.pushCollectionId({
                id: orderId,
                collection: Order,
                push: { orderItems: orderItemResp.data._id }
            });
        } else {
            const orderItems = [];
            orderItems.push(orderItemResp.data._id);
            const newOrder = {
                user: req.tokenVerified._id,
                orderItems: orderItems,
                company: req.tokenVerified.company._id
            }
            // await validation.body(Order, newOrder, 'POST');
            order = await dataBase.saveCollection({
                collection: Order,
                requestData: newOrder
            });
        }
        const orderFinal = await calculateAccountsAction(order.data._id);
        order.data = orderFinal;
        return order;
    } catch (e) {
        return e;
    }
}

async function deleteOrderItemAction(req) {
    try {
        const order = await dataBase.pullCollectionId({
            id: req.params.orderId,
            collection: Order,
            pull: { orderItems: req.params.id }
        });
        const orderFinal = await calculateAccountsAction(req.params.orderId);
        order.data = orderFinal;
        return order;
    } catch (e) {
        return e;
    }
}

async function updateOrderItemAction(req) {
    const payload = {
        id: req.params.id,
        collection: OrderItem,
        requestData: req.body
    }
    try {
        // await validation.body(OrderItem, req.body);
        const resp = await dataBase.updateIdCollection(payload);
        const orderFinal = await calculateAccountsAction(req.params.orderId);
        resp.data = orderFinal;
        return resp;
    } catch (e) {
        return e;
    }
}

async function findOrderAction(req) {
    try {
        const resp = await dataBase.findCollection(payload);
        return resp;
    } catch (err) {
        return e;
    }
}

async function findOrdersAction(req) {
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['status'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Order,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updateAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [
            {
                path: 'orderItems',
                select: { quantity: 1, _id: 1 },
                populate: {
                    path: 'product',
                    select: { name: 1, _id: 1, price: 1, profileImage: 1 },
                }
            },
            {
                path: 'customer',
                select: { firstName: 1, lastName: 1, profileImage: 1, _id: 1 },
            },
            {
                path: 'company',
                select: { name: 1 }
            }
        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return resp;
    } catch (e) {
        return e;
    }
}

async function findOrdersSearchAction(req) {
    const searchFields = ['status', 'customer'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Order,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updateAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [
            {
                path: 'orderItems',
                select: { quantity: 1, _id: 1 },
                populate: {
                    path: 'product',
                    select: { name: 1, _id: 1, price: 1, profileImage: 1 },
                }
            },
            {
                path: 'customer',
                select: { firstName: 1, lastName: 1, profileImage: 1, _id: 1 },
            },
            {
                path: 'user',
                select: { firstName: 1, lastName: 1, profileImage: 1, _id: 1 },
            },
            {
                path: 'company',
                select: { name: 1 }
            }
        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return resp;
    } catch (err) {
        return err;
    }
}

async function paidOrderAction(req) {
    try {
        const order = await calculateAccountsAction(req.params.id);
        order.paymentMethods = req.body.paymentMethods;
        order.status = 'PAID';
        const updateOrder = await dataBase.updateIdCollection({
            id: order.id,
            collection: Order,
            requestData: order
        })
        return updateOrder;

    } catch (e) {
        return e;
    }
}

async function cancelOrderAction(req) {
    try {
        console.log(req.params.id);
    } catch (e) {
        return e;
    }
}

async function calculateAccountsAction(orderId) {
    return new Promise((resolve, reject) => {
        const payload = {
            id: orderId,
            collection: Order,
            unselectFields: ['__v', 'password'],
            populateFields: [
                {
                    path: 'orderItems',
                    select: { quantity: 1, _id: 1 },
                    populate: {
                        path: 'product',
                        select: { name: 1, _id: 1, price: 1, profileImage: 1 },
                    }
                },
                {
                    path: 'customer',
                    select: { firstName: 1, lastName: 1, profileImage: 1, _id: 1 },
                }
            ]
        }
        dataBase.findByIdCollection(payload)
            .then(resp => {
                let subtotal = 0;
                let tax = 0;
                resp.data.orderItems = resp.data.orderItems.map(orderItem => {
                    subtotal = subtotal + orderItem.product.price * orderItem.quantity;
                    orderItem.subtotal = orderItem.product.price * orderItem.quantity
                    return orderItem;
                })
                const total = subtotal + tax;
                resp.data.tax = tax;
                resp.data.subtotal = subtotal;
                resp.data.total = total;
                resolve(resp.data);
            })
            .catch(error => {
                reject(error);
            })
    })
}

module.exports = {
    saveOrderAction,
    deleteOrderAction,
    updateOrderAction,
    saveOrderItemAction,
    deleteOrderItemAction,
    updateOrderItemAction,
    findOrderAction,
    findOrdersAction,
    paidOrderAction,
    cancelOrderAction,
    findOrdersSearchAction
}