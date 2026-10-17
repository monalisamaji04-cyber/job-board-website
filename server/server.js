
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Kolkata",
    type: "Full-time",
    description: "Build user-friendly web applications.",
    skills: "React, JavaScript, CSS"
  },
  {
    id: 2,
    title: "Java Developer",
    company: "Code Works",
    location: "Bengaluru",
    type: "Internship",
    description: "Develop and maintain Java applications.",
    skills: "Java, SQL, DSA"
  }
];

app.get("/", (req, res) => {
  res.send("Job Board API is running!");
});

app.get("/api/jobs", (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  const results = jobs.filter(job =>
    job.title.toLowerCase().includes(search) ||
    job.company.toLowerCase().includes(search) ||
    job.location.toLowerCase().includes(search)
  );

  res.json(results);
});

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find(
    item => item.id === Number(req.params.id)
  );

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
});

app.post("/api/jobs", (req, res) => {
  const { title, company, location, type, description, skills } =
    req.body;

  if (!title || !company || !location) {
    return res.status(400).json({
      message: "Title, company, and location are required."
    });
  }

  const newJob = {
    id: Date.now(),
    title,
    company,
    location,
    type: type || "Full-time",
    description: description || "",
    skills: skills || ""
  };

  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Job Board API running on port ${PORT}`);
});
