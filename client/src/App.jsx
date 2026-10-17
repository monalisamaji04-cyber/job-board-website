
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    skills: ""
  });

  async function loadJobs(query = "") {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error("Could not load jobs");

      setJobs(await response.json());
      setMessage("");
    } catch {
      setMessage("Could not connect to the server. Check the backend.");
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    await loadJobs(search);
  }

  async function handlePost(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setForm({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        description: "",
        skills: ""
      });

      setShowForm(false);
      setMessage("Job posted successfully!");
      await loadJobs(search);
    } catch (error) {
      setMessage(error.message || "Unable to post job.");
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">CareerConnect</a>
        <nav>
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <button onClick={() => setShowForm(!showForm)}>
            Post a Job
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</p>
          <h1>Find a job you'll love.</h1>
          <p>Discover opportunities and take the next step in your career.</p>

          <form className="search" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Job title, company, or location"
            />
            <button type="submit">Search Jobs</button>
          </form>
        </section>

        {showForm && (
          <section className="panel">
            <h2>Post a Job</h2>
            <form onSubmit={handlePost} className="job-form">
              <input
                required
                placeholder="Job title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <input
                required
                placeholder="Company"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
              />
              <input
                required
                placeholder="Location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
              <textarea
                placeholder="Job description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <input
                placeholder="Required skills"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
              />
              <button type="submit">Submit Job</button>
            </form>
          </section>
        )}

        <section className="jobs" id="jobs">
          <h2>Latest Job Openings</h2>
          <p>Explore opportunities that match your skills.</p>

          {message && <p role="status">{message}</p>}

          <div className="job-grid">
            {jobs.map(job => (
              <article className="job-card" key={job.id}>
                <span className="job-type">{job.type}</span>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p>📍 {job.location}</p>
                <p>{job.skills}</p>
                <button onClick={() => setSelectedJob(job)}>
                  View Details
                </button>
              </article>
            ))}
          </div>

          {jobs.length === 0 && <p>No jobs found. Try another search.</p>}
        </section>

        {selectedJob && (
          <div className="modal">
            <section className="panel">
              <button onClick={() => setSelectedJob(null)}>Close</button>
              <h2>{selectedJob.title}</h2>
              <h3>{selectedJob.company}</h3>
              <p>{selectedJob.location} · {selectedJob.type}</p>
              <p>{selectedJob.description}</p>
              <p>Skills: {selectedJob.skills}</p>
              <button onClick={() => alert("Application feature is coming next.")}>
                Apply Now
              </button>
            </section>
          </div>
        )}
      </main>

      <footer>
        <p>© 2026 CareerConnect. Built for job seekers and employers.</p>
      </footer>
    </div>
  );
}

export default App;
