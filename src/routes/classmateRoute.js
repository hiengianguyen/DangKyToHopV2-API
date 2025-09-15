const { ClassmateController } = require("../apps/controllers/index");
const express = require("express");
const router = express.Router();

router.get("/students", ClassmateController.studentList);

module.exports = router;
