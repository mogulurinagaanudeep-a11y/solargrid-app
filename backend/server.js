import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI =
  "mongodb+srv://admin:admin1234@cluster0.nlsatr6.mongodb.net/solargrid?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const Plan = mongoose.model("Plan", {
  owner: String,
  capacity: String,
  netCost: Number,
  unitsSaved: Number,
});

app.get("/plans", async (req, res) => {
  try {
    res.json(await Plan.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/plans", async (req, res) => {
  try {
    res.json(await Plan.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/plans/:id", async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));