const { RegisteredCombinationModel, FirestoreModel } = require("../models");
const { CollectionNameConstant } = require("../../constants");

class ClassmateController {
  constructor() {
    this.registeredCombinationsDbRef = new FirestoreModel(CollectionNameConstant.RegisteredCombinations, RegisteredCombinationModel);
    this.studentList = this.studentList.bind(this);
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
}

module.exports = new ClassmateController();
