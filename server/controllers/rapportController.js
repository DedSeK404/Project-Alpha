const rapportModel = require("../models/rapportModel");

const fs = require("fs");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).array("files");

module.exports.createReport = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error uploading files", error: err });
      }
      const { student, application, rapport_status, message } = req.body;
      const parsedApplication = JSON.parse(application);
      const files = req.files.map((file) => file.path);

      // Check if a report already exists for the application
      const existingReport = await rapportModel.findOne({
        "application._id": parsedApplication._id,
      });
     
      if (existingReport) {
        // Update the existing report with new information
        existingReport.student = student;
        if (message !== "") {
          existingReport.message = message;
        } 
        existingReport.files = files;
        existingReport.rapport_status = rapport_status;
        await existingReport.save();
        res.json({ msg: "Le rapport a été mis à jour.", report: existingReport });
      } else {
        // Create a new report
        const newRapport = new rapportModel({
          student,
          files,
          application: parsedApplication,
          rapport_status,
          message,
          
        });
        await newRapport.save();
        res.json({ msg: "Le rapport a été créé avec succès.", report: newRapport });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports.downloadReport = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const report = await rapportModel.findById(id);
    if (!report) {
      return res.status(404).json({ msg: "Rapport introuvable." });
    }

    // Check if the report has files
    if (!report.files || report.files.length === 0) {
      return res.status(404).json({ msg: "Aucun fichier trouvé pour le rapport." });
    }

    // Find the file matching the provided filename
    const requestedFile = report.files.find(file => path.basename(file) === filename);
    if (!requestedFile) {
      return res.status(404).json({ msg: "Fichier introuvable" });
    }

    // Construct the file path
    const filePath = path.join(__dirname, "..", requestedFile);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "Fichier introuvable" });
    }

    // Set appropriate headers for the file download
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await rapportModel.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ msg: "Erreur interne du serveur" });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rapport_status, message, date_soutenance } = req.body;

    const existingReport = await rapportModel.findById(id);
    if (!existingReport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }

    if (rapport_status !== undefined) {
      existingReport.rapport_status = rapport_status;
    }

    if (message !== undefined) {
      existingReport.message.push(message);
    }
 
    if (date_soutenance !== undefined) {
      existingReport.date_soutenance = date_soutenance;
    }
    

    await existingReport.save();

    res.json({ msg: "Le rapport a été mis à jour avec succès.", report: existingReport });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
