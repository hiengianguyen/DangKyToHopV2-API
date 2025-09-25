const { RegisteredCombinationModel, FirestoreModel, ClassesModel } = require("../models");
const { CollectionNameConstant } = require("../../constants");

class ClassmateController {
  constructor() {
    this.registeredCombinationsDbRef = new FirestoreModel(CollectionNameConstant.RegisteredCombinations, RegisteredCombinationModel);
    this.classesDbRef = new FirestoreModel(CollectionNameConstant.Classes, ClassesModel);
    this.studentList = this.studentList.bind(this);
    this.classes = this.classes.bind(this);
    this.createClass = this.createClass.bind(this);
  }

  async studentList(req, res, next) {
    if (req?.cookies?.isLogin === "true") {
      const studentListApproved = await this.registeredCombinationsDbRef.getItemsByFilter({
        status: "approved"
      });

      return res.json({
        studentList: studentListApproved
      });
    } else {
      return res.json({
        redirect: "/auth/signin"
      });
    }
  }

  async classes(req, res, next) {
    if (req?.cookies?.isLogin === "true") {
      const classes = await this.classesDbRef.getAllItems({ fieldName: "name", type: "asc" });

      return res.json({
        classes: classes
      });
    } else {
      res.json({
        redirect: "/auth/signin"
      });
    }
  }

  async createClass(req, res, next) {
    const { name, teacher, combination1, combination2 } = req.body;
    const classModel = new ClassesModel(null, name, teacher, combination1, combination2, false);
    try {
      const ok = await this.classesDbRef.addItem(classModel);

      if (ok) {
        return res.json({
          isSuccess: true,
          message: "Tạo lớp học mới thành công!"
        });
      } else {
        return res.json({
          isSuccess: true,
          message: "Tạo lớp học mới thành công!"
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        isSuccess: false,
        message: "Có lỗi khi tạo lớp. Hảy thử lại"
      });
    }
  }
}

module.exports = new ClassmateController();
