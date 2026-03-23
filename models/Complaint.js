const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  text: String,
  category: String,
  priority: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);