const Room = require("../../models/inventory/room");
const dataBase = require("../../services/dataBaseMethods");

// 0. Room controller
function room(req, res) {
  res.status(200).send({ msg: "Room controller works" });
}

// 1. Save room
async function saveRoom(req, res) {
  const payload = {
    requestData: req.body,
    collection: Room
  };
  try {
    const resp = await dataBase.saveCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 2. Get rooms
async function getRooms(req, res) {
  const payload = {
    collection: Room,
    query: req.query.query,
    sort: req.query.sort,
    pagination: req.query.pagination,
    unselectFields: ["__v"],
    populateFields: req.query.populate
  };
  try {
    const resp = await dataBase.findCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 3. Find room
async function findRoom(req, res) {
  const payload = {
    id: req.params.id,
    collection: Room,
    unselectFields: ["__v"],
    populateFields: req.query.populate
  };
  try {
    const resp = await dataBase.findByIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 4. Update room
async function updateRoom(req, res) {
  const payload = {
    id: req.params.id,
    collection: Room,
    requestData: req.body
  };
  try {
    const resp = await dataBase.updateIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 4. Delete room
async function deleteRoom(req, res) {
  const payload = {
    id: req.params.id,
    collection: Room
  };
  try {
    const resp = await dataBase.deleteIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

module.exports = {
  room,
  saveRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  findRoom
};
