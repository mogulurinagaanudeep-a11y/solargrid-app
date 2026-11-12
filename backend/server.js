import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://admin:admin1234@ac-k8azfe2-shard-00-00.j4vgwtj.mongodb.net:27017,ac-k8azfe2-shard-00-01.j4vgwtj.mongodb.net:27017,ac-k8azfe2-shard-00-02.j4vgwtj.mongodb.net:27017/solargrid?ssl=true&replicaSet=atlas-nwpj50-shard-0&authSource=admin")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Plan = mongoose.model("Plan", {
  owner: String,
  capacity: String,
  netCost: Number,
  unitsSaved: Number,
});

app.get("/plans", async (req, res) => res.json(await Plan.find()));
app.post("/plans", async (req, res) => res.json(await Plan.create(req.body)));
app.delete("/plans/:id", async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ deleted: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));