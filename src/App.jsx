import { useState, useEffect } from "react";

export default function App() {
  const [owner, setOwner] = useState("");
  const [capacity, setCapacity] = useState("2 kW");
  const [bill, setBill] = useState("");
  const [plans, setPlans] = useState([]);

  const loadPlans = () =>
    fetch("https://solargrid-app.onrender.com/plans")
      .then((res) => res.json())
      .then(setPlans)
      .catch((err) => console.error("Fetch error:", err));

  useEffect(() => {
    loadPlans();
  }, []);

  const handleEstimate = async (e) => {
    e.preventDefault();
    const kw = parseInt(capacity);
    const grossCost = kw * 60000;
    const subsidy = kw === 1 ? 30000 : kw === 2 ? 60000 : 78000;
    const newPlan = {
      owner: owner || "Resident",
      capacity,
      netCost: grossCost - subsidy,
      unitsSaved: kw * 120,
    };

    await fetch("https://solargrid-app.onrender.com/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan),
    });

    setOwner("");
    setBill("");
    loadPlans();
  };

  const deletePlan = async (id) => {
    await fetch(`https://solargrid-app.onrender.com/plans/${id}`, { method: "DELETE" });
    loadPlans();
  };

  const totalUnits = plans.reduce((sum, p) => sum + (p.unitsSaved || 0), 0);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif", textAlign: "center", padding: 20, border: "1px solid #ddd", borderRadius: 10 }}>
      <h2>Rooftop Solar Subsidy Estimator</h2>
      <form onSubmit={handleEstimate} style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        <input placeholder="Owner Name" value={owner} onChange={(e) => setOwner(e.target.value)} required />
        <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
          <option>1 kW</option>
          <option>2 kW</option>
          <option>3 kW</option>
          <option>5 kW</option>
        </select>
        <input type="number" placeholder="Monthly Bill (₹)" value={bill} onChange={(e) => setBill(e.target.value)} required />
        <button type="submit">Estimate</button>
      </form>

      <h4>Total Green Units Generated: {totalUnits} kWh/mo</h4>

      {plans.map((p) => (
        <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottom: "1px solid #eee", textAlign: "left" }}>
          <div>
            <strong>{p.owner}</strong> ({p.capacity}) — Net Cost: <b>₹{p.netCost?.toLocaleString()}</b> | Yield: {p.unitsSaved} kWh/mo
          </div>
          <button onClick={() => deletePlan(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}