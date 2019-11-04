const express = require("express");
const companyCtrl = require("../controllers/company");
const api = express.Router();
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/roles");
const queryMiddleware = require("../middlewares/query");
const validationsMiddleware = require("../middlewares/validations");
const compose = require("compose-middleware").compose;

// 0. Company controller
api.get("/companies/controller", companyCtrl.company);
// 1. Save company
api.post(
  "/companies",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
  ]),
  companyCtrl.saveCompany
);
// 2. Get comanies
api.get(
  "/companies",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
  ]),
  companyCtrl.getCompanies
);
// 3. Update company
api.put(
  "/companies/:id",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
  ]),
  companyCtrl.updateCompany
);
// 4. Delete company
api.delete(
  "/companies/:id/",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
  ]),
  companyCtrl.removeCompany
);
// 5. Get comany image
api.get("/companies/image/:id/:file", companyCtrl.getImage);
// 6. Get company
api.get(
  "/companies/:id",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
  ]),
  companyCtrl.findCompany
);
// 7. Save user images
api.put(
  "/companies/:id/images",
  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
  ]),
  companyCtrl.saveCompanyImages
);

module.exports = api;
