const express = require("express");
const roomCtrl = require("../../controllers/inventory/room");
const api = express.Router();
const compose = require("compose-middleware").compose;
const queryMiddleware = require("../../middlewares/query");
const validationsMiddleware = require("../../middlewares/validations");

// 0. Room controller
api.get("/rooms/controller", roomCtrl.room);
// 1. Save room
api.post(
  "/rooms",
  compose([validationsMiddleware.validationsMiddlewareFunction]),
  roomCtrl.saveRoom
);
// 2. Get rooms
api.get(
  "/rooms",
  compose([queryMiddleware.queryMiddlewareFunction]),
  roomCtrl.getRooms
);
// 3. Find room
api.get(
  "/rooms/:id",
  compose([queryMiddleware.queryMiddlewareFunction]),
  roomCtrl.findRoom
);
// 4. Update room
api.put(
  "/rooms/:id",
  compose([validationsMiddleware.validationsMiddlewareFunction]),
  roomCtrl.updateRoom
);
// 5. Delete room
api.delete("/rooms/:id", compose([]), roomCtrl.deleteRoom);

module.exports = api;
