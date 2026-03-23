const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civicai")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Routes (IMPORTANT: filename must match exactly)
const complaintRoutes = require("./routes/ComplaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});