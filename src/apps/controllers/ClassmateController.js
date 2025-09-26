const { RegisteredCombinationModel, FirestoreModel, ClassesModel } = require("../models");
const { CollectionNameConstant } = require("../../constants");

class ClassmateController {
  constructor() {
    this.registeredCombinationsDbRef = new FirestoreModel(CollectionNameConstant.RegisteredCombinations, RegisteredCombinationModel);
    this.classesDbRef = new FirestoreModel(CollectionNameConstant.Classes, ClassesModel);
    this.studentList = this.studentList.bind(this);
    this.classes = this.classes.bind(this);
    this.createClass = this.createClass.bind(this);
    this.updateClass = this.updateClass.bind(this);
    this.studentAddClass = this.studentAddClass.bind(this);
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

  async studentAddClass(req, res, next) {
    const { studentId, classId } = req.body;

    try {
      const ok = await this.registeredCombinationsDbRef.updateItem(studentId, { classId: classId });
      if (ok) {
        return res.json({
          message: "Đã thêm học sinh vào lớp học"
        });
      } else {
        return res.json({
          message: "Có lỗi khi thêm học sinh vào lớp học"
        });
      }
    } catch {
      return res.json({
        message: "Có lỗi khi thêm học sinh vào lớp học"
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

  async updateClass(req, res, next) {
    const id = req.params.id;
    const { name, teacher, combination1, combination2 } = req.body;
    try {
      const ok = await this.classesDbRef.updateItem(id, {
        name,
        teacher,
        combination1,
        combination2
      });
      if (ok) {
        return res.json({
          isSuccess: true
        });
      } else {
        return res.json({
          isSuccess: true
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        isSuccess: false
      });
    }
  }

  async deleteClass(req, res, next) {
    const { id } = req.body;
    try {
      const ok = await this.classesDbRef.hardDeleteItem(id);
      if (ok) {
        return res.json({
          isSuccess: true
        });
      } else {
        return res.json({
          isSuccess: true
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        isSuccess: false
      });
    }
  }
}

module.exports = new ClassmateController();
