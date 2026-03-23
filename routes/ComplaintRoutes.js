const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
//const Complaint = require('../models/Complaint');

// Smart classification logic
function classifyComplaint(text) {
  text = text.toLowerCase();

  let category = "General";
  let priority = "Low";

  if (text.includes("water")) category = "Water";
  if (text.includes("road") || text.includes("pothole")) category = "Road";
  if (text.includes("electricity")) category = "Electricity";

  if (text.includes("urgent") || text.includes("accident")) {
    priority = "High";
  } else if (text.includes("leak") || text.includes("damage")) {
    priority = "Medium";
  }

  return { category, priority };
}

// POST complaint
router.post("/", async (req, res) => {
  const { text } = req.body;

  const { category, priority } = classifyComplaint(text);

  const newComplaint = new Complaint({
  text,
  category,
  priority,
  status: "Pending"
});

  await newComplaint.save();

  res.json(newComplaint);
});

// GET all complaints
router.get("/", async (req, res) => {
  const data = await Complaint.find();
  res.json(data);
});
// UPDATE complaint status
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const updated = await Complaint.findByIdAndUpdate(
    id,
    { status: "Resolved" },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;