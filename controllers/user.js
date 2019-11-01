const User = require("../models/user");
const UserConfigurations = require("../models/userConfigurations");
const UserInformation = require("../models/information");
const dataBase = require("../services/dataBaseMethods");
const fileMethods = require("../services/fileMethods");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const config = require("../config");
const tokenExpired = config.server.token.timeExpired * 60;
const secret = config.server.token.secret;
const jwt = require("jsonwebtoken");
const userMethods = require("../services/user");

// 0. User controller
function user(req, res) {
  res.status(200).send({ msg: "User controller works" });
}

// 1. Save user
async function saveUser(req, res) {
  try {
    // 1. Validate email repeated
    await userMethods.validateEmail(req.body.email);
    // 2. Password
    req.body.password = await userMethods.encryptPassword(req.body.password);
    // 3. Save userConfigurations
    const userConfigurations = await dataBase.saveCollection({
      requestData: req.body.userConfigurations,
      collection: UserConfigurations
    });
    // 4. Save userInformation
    const userInformation = await dataBase.saveCollection({
      requestData: req.body.userInformation,
      collection: UserInformation
    });
    req.body.userConfigurations = userConfigurations.data._id;
    req.body.userInformation = userInformation.data._id;
    // 5. Save User
    const resp = await dataBase.saveCollection({
      requestData: req.body,
      collection: User
    });
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 2. Get users
async function getUsers(req, res) {
  const payload = {
    collection: User,
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

// 3. find user
async function findUser(req, res) {
  const payload = {
    id: req.params.id,
    collection: User,
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

// 4. Update user
async function updateUser(req, res) {
  try {
    // 1. Update userConfigurations
    await dataBase.updateIdCollection({
      id: req.body.userConfigurations._id,
      requestData: req.body.userConfigurations,
      collection: UserConfigurations
    });
    // 2. Update userInformation
    await dataBase.updateIdCollection({
      id: req.body.userInformation._id,
      requestData: req.body.userInformation,
      collection: UserInformation
    });
    // 3. Update user
    const resp = await dataBase.updateIdCollection({
      id: req.params.id,
      collection: User,
      requestData: req.body
    });
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 5. Delete user
async function removeUser(req, res) {
  // 1. Update userConfigurations
  await dataBase.deleteIdCollection({
    id: req.body.userConfigurations._id,
    collection: UserConfigurations
  });
  // 2. Update userInformation
  await dataBase.deleteIdCollection({
    id: req.body.userInformation._id,
    collection: UserInformation
  });
  const payload = {
    id: req.params.id,
    collection: User,
    fileFields: ["profileImage"]
  };
  try {
    const resp = await dataBase.deleteIdCollection(payload);
    return res.status(resp.code).send(resp);
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 6. Get user images
async function getImage(req, res) {
  const payload = {
    id: req.params.id,
    fileName: req.params.file,
    path: "uploads/user"
  };
  try {
    const resp = await fileMethods.getFile(payload);
    return res.sendFile(path.resolve(resp.url));
  } catch (err) {
    return res.status(err.code).send(err);
  }
}

// 8. Login user
function userLogin(req, res) {
  const userfront = req.body;
  const email = userfront.email.toLowerCase();
  const password = userfront.password;
  User.findOne({ email: email })
    .populate([
      {
        path: "company",
        select: { _id: 1, name: 1 },
        populate: {
          path: "country",
          select: { _id: 1, name: 1 }
        }
      },
      {
        path: "application",
        select: { _id: 1, name: 1 }
      },
      {
        path: "profileImage",
        select: { url: 1 }
      },
      {
        path: "userConfigurations",
        select: { createdAt: 0, updatedAt: 0, deletedAt: 0, __v: 0 }
      },
      {
        path: "userInformation",
        select: { createdAt: 0, updatedAt: 0, deletedAt: 0, __v: 0 }
      }
    ])
    .exec((err, dataBaseResp) => {
      if (err)
        return res.status(500).send({
          status: "ERROR",
          code: 500,
          msg: `find_id_${User.modelName.toLowerCase()}_error`
        });
      if (!dataBaseResp)
        return res.status(404).send({
          status: "WARNING",
          code: 422,
          msg: `invalid_user`
        });
      bcrypt.compare(password, dataBaseResp.password, (err, check) => {
        if (!check)
          return res.status(404).send({
            status: "WARNING",
            code: 422,
            msg: `invalid_password`
          });

        dataBaseResp.password = undefined;
        dataBaseResp.__v = undefined;

        const newToken = jwt.sign({ dataBaseResp }, secret, {
          expiresIn: tokenExpired
        });
        dataBaseResp.token = newToken;
        return res.status(200).send({
          status: "OK",
          code: 200,
          msg: `auth_user_success`,
          data: dataBaseResp
        });
      });
    });
}

module.exports = {
  user,
  saveUser,
  getUsers,
  findUser,
  updateUser,
  removeUser,
  getImage,
  userLogin
};
