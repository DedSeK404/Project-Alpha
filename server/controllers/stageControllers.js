const companyModel = require("../models/companyModel");
const applicationModel = require("../models/applicationModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file"); // Allow single file uploads

const path = require("path");
const fs = require("fs");

module.exports.addCompany = async (req, res) => {
  try {
    const company = new companyModel({ ...req.body });
    await company.save();
    res.send({ msg: "company successfully added" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.getallCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find({});

    res.send({ companies });
  } catch (error) {
    res.send({ msg: error.message });
  }
};

module.exports.deleteCompany = async (req, res) => {
  const { companyID } = req.params;
  try {
    const company = await companyModel.findByIdAndDelete(companyID);
    if (!company) {
      return res.status(404).send({ msg: "Company not found" });
    }
    res.send({ msg: "Company deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.addApplication = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Error uploading file:", err);
        return res
          .status(400)
          .send({ msg: "Error uploading file", error: err });
      }

      const application = new applicationModel({ ...req.body });

      if (req.file) {
        application.file = req.file.path;
      }

      await application.save();

      res.send({ msg: "Application successfully submitted" });
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.getallApplications = async (req, res) => {
  try {
    const applications = await applicationModel.find({});

    res.send({ applications });
  } catch (error) {
    res.send({ msg: error.message });
  }
};

module.exports.updateApplication = async (req, res) => {
  try {
    const { idApplication } = req.body;
    const { status } = req.body;

    const application = await applicationModel.findByIdAndUpdate(
      idApplication,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.send({
      application: application,
      msg:
        status == "declined"
          ? "Application declined"
          : status == "approved"
          ? "Application approved"
          : "",
    });
  } catch (error) {
    res.send({ msg: error.message });
  }
};

module.exports.downloadApplicationReport = async (req, res) => {

  try {
    const { id } = req.params;
    const application = await applicationModel.findById(id);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }
    
    // Check if the application has a file
    if (!application.file) {
      return res.status(404).json({ msg: "No file found for the application" });
    }

    // Construct the file path
    const filePath = path.join(__dirname, "..", application.file);
  
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File not found" });
    }

    // Set appropriate headers for the file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(filePath)}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};