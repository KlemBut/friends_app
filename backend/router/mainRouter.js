const express = require("express");
const router = express.Router();
const {
  getCities,
  registerUser,
  loginUser,
  getUser,
  logOut,
  getProfile,
  uploadPic,
  setFilter,
  filterUsers,
  likeUser,
  getHistory,
  removePic
} = require("../controller/mainController");
const { registerValidation } = require("../middleware/registerValidation");
const { loginValidation } = require("../middleware/loginValidation");
const { picValidation } = require("../middleware/pictureValidation");

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/getprofile", getProfile);
router.post("/uploadpic", picValidation, uploadPic);
router.post("/setfilter", setFilter);
router.post("/getfilteredusers", filterUsers);
router.post("/likeuser", likeUser);
router.post("/gethistory", getHistory);
router.post("/removepic", removePic);

router.get("/cities", getCities);
router.get("/getUser", getUser);
router.get("/logout", logOut);
module.exports = router;
