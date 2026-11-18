
import { useState, useEffect } from "react";
import "./App.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  status: "Applied",
  date: "",
  time: "",
  link: "",
};

export default function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("hiretrack_applications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  // Save applications in localStorage
  useEffect(() => {
    localStorage.setItem(
      "hiretrack_applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or update application
  const handleSubmit = (e) => {
    e.preventDefault();

    const newApplication = {
      ...form,
      id: editingId || Date.now(),
    };

    if (editingId) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingId ? newApplication : app
        )
      );

      alert("Application updated successfully!");
    } else {
      setApplications((prev) => [
        ...prev,
        newApplication,
      ]);

      alert("Application added successfully!");
    }

    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Open form for editing
  const handleEdit = (app) => {
    setForm({
      name: app.name || "",
      email: app.email || "",
      phone: app.phone || "",
      company: app.company || "",
      position: app.position || "",
      status: app.status || "Applied",
      date: app.date || "",
      time: app.time || "",
      link: app.link || "",
    });

    setEditingId(app.id);
    setShowForm(true);
  };

  // Delete application
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (confirmDelete) {
      setApplications((prev) =>
        prev.filter((app) => app.id !== id)
      );
    }
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  // Count applications
  const count = (status) =>
    applications.filter((app) => app.status === status).length;

  // Search and filter
  const filteredApplications = applications.filter((app) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (app.name || "").toLowerCase().includes(searchText) ||
      (app.company || "").toLowerCase().includes(searchText) ||
      (app.position || "").toLowerCase().includes(searchText) ||
      (app.email || "").toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || app.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Upcoming interviews
  const upcoming = applications
    .filter(
      (app) =>
        app.date &&
        app.status !== "Rejected"
    )
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    )
    .slice(0, 4);

  // Dashboard statistics
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: "▤",
      color: "blue",
    },
    {
      label: "Shortlisted",
      value: count("Shortlisted"),
      icon: "✦",
      color: "purple",
    },
    {
      label: "Selected",
      value: count("Selected"),
      icon: "✓",
      color: "green",
    },
    {
      label: "Rejected",
      value: count("Rejected"),
      icon: "×",
      color: "red",
    },
  ];

  // Application breakdown percentages
  const total = applications.length;

  const appliedPercent = total ? (count("Applied") / total) * 100 : 0;
  const shortlistedPercent = total ? (count("Shortlisted") / total) * 100 : 0;
  const selectedPercent = total ? (count("Selected") / total) * 100 : 0;
  const rejectedPercent = total ? (count("Rejected") / total) * 100 : 0;

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">H</div>
          <span>
            HireTrack<span className="brand-dot">.</span>
          </span>
        </div>

        <p className="side-heading">WORKSPACE</p>

        <nav>
          <a href="#dashboard" className="nav-item active">
            <span>▦</span> Dashboard
          </a>

          <a href="#applications" className="nav-item">
            <span>▤</span> Applications
          </a>

          <a href="#interviews" className="nav-item">
            <span>◷</span> Interviews
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">P</div>

            <div>
              <strong>My Profile</strong>
              <small>Job Seeker</small>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" id="dashboard">

        {/* HEADER */}
        <header className="topbar">

          <div>
            <p className="breadcrumb">
              Workspace / Dashboard
            </p>

            <h2>Dashboard</h2>
          </div>

          <button
            className="add-button"
            type="button"
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Add Application
          </button>

        </header>

        {/* WELCOME BANNER */}
        <section className="welcome-banner">

          <div>
            <p className="welcome-label">
              YOUR CAREER OVERVIEW
            </p>

            <h1>Welcome back! 👋</h1>

            <p>
              Keep track of your job search and stay one step ahead.
            </p>
          </div>

          <div className="banner-art">✦</div>

        </section>

        {/* STATISTICS */}
        <section className="stats-grid">

          {stats.map((item) => (
            <div className="stat-card" key={item.label}>

              <div className={`stat-icon ${item.color}`}>
                {item.icon}
              </div>

              <div>
                <p>{item.label}</p>
                <h2>{item.value}</h2>
              </div>

            </div>
          ))}

        </section>

        {/* DASHBOARD CARDS */}
        <div className="dashboard-grid">

          {/* APPLICATION OVERVIEW */}
          <section className="panel progress-panel">

            <div className="panel-heading">

              <div>
                <h3>Application Overview</h3>
                <p>Your current application progress</p>
              </div>

              <span className="mini-tag">All time</span>

            </div>

            <div className="progress-content">

              <div
                className="progress-circle"
                style={{
                  background: `conic-gradient(
                    #3975d8 0% ${appliedPercent}%,
                    #8555d5 ${appliedPercent}% ${appliedPercent + shortlistedPercent}%,
                    #159b70 ${appliedPercent + shortlistedPercent}% ${appliedPercent + shortlistedPercent + selectedPercent}%,
                    #e05c63 ${appliedPercent + shortlistedPercent + selectedPercent}% 100%
                  )`,
                }}
              >
                <div>
                  <strong>{applications.length}</strong>
                  <small>Total</small>
                </div>
              </div>

              <div className="progress-legend">

                {[
                  ["Applied", "applied"],
                  ["Shortlisted", "shortlisted"],
                  ["Selected", "selected"],
                  ["Rejected", "rejected"],
                ].map(([status, className]) => (
                  <div className="legend-row" key={status}>

                    <span className={`legend-dot ${className}`}></span>

                    <span>{status}</span>

                    <strong>{count(status)}</strong>

                  </div>
                ))}

              </div>

            </div>

          </section>

          {/* UPCOMING INTERVIEWS */}
          <section className="panel interview-panel" id="interviews">

            <div className="panel-heading">

              <div>
                <h3>Upcoming Interviews</h3>
                <p>Your scheduled interviews</p>
              </div>

              <span className="calendar-icon">▦</span>

            </div>

            {upcoming.length === 0 ? (

              <div className="empty-state">
                <div>◷</div>
                <p>No interviews scheduled yet.</p>
                <small>
                  Add an interview date to see it here.
                </small>
              </div>

            ) : (

              <div className="upcoming-list">

                {upcoming.map((app) => (

                  <div className="upcoming-item" key={app.id}>

                    <div className="date-box">

                      <strong>
                        {new Date(app.date + "T00:00:00").getDate()}
                      </strong>

                      <small>
                        {new Date(
                          app.date + "T00:00:00"
                        ).toLocaleString("en", {
                          month: "short",
                        })}
                      </small>

                    </div>

                    <div className="upcoming-info">
                      <strong>{app.position}</strong>
                      <small>{app.company}</small>
                      <small>{app.time || "Time not set"}</small>
                    </div>

                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noreferrer"
                        className="join-link"
                      >
                        Join ↗
                      </a>
                    )}

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (

          <section className="panel form-panel">

            <div className="panel-heading">

              <div>
                <h3>
                  {editingId
                    ? "Edit Application"
                    : "New Application"}
                </h3>

                <p>
                  Enter the details of your job application
                </p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="application-form"
            >

              <input
                name="name"
                type="text"
                placeholder="Candidate Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                name="company"
                type="text"
                placeholder="Company Name"
                value={form.company}
                onChange={handleChange}
                required
              />

              <input
                name="position"
                type="text"
                placeholder="Job Position"
                value={form.position}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />

              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
              />

              <input
                name="link"
                type="url"
                placeholder="Meeting Link (optional)"
                value={form.link}
                onChange={handleChange}
              />

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-button"
                >
                  {editingId
                    ? "Update Application"
                    : "Save Application"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* APPLICATION TABLE */}
        <section className="panel applications-panel" id="applications">

          <div className="panel-heading applications-heading">

            <div>
              <h3>Recent Applications</h3>
              <p>Manage and monitor your job applications</p>
            </div>

            <span className="application-count">
              {applications.length} applications
            </span>

          </div>

          {/* SEARCH AND FILTER */}
          <div className="table-controls">

            <input
              type="search"
              placeholder="Search company, name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>

          {/* TABLE */}
          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>COMPANY</th>
                  <th>POSITION</th>
                  <th>STATUS</th>
                  <th>INTERVIEW DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {filteredApplications.map((app) => (

                  <tr key={app.id}>

                    <td>
                      <div className="candidate-cell">

                        <div className="candidate-avatar">
                          {app.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{app.name}</strong>
                          <small>{app.email}</small>
                        </div>

                      </div>
                    </td>

                    <td>{app.company}</td>

                    <td>{app.position}</td>

                    <td>
                      <span
                        className={`status ${app.status.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td>
                      {app.date || "Not scheduled"}
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          onClick={() => handleEdit(app)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() => handleDelete(app.id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredApplications.length === 0 && (

              <div className="empty-table">
                <div>▤</div>
                <h3>No applications found</h3>
                <p>
                  Add a new application or change your search.
                </p>
              </div>

            )}

          </div>

        </section>

        <footer>
          © 2026 HireTrack. Smartly manage your career journey.
        </footer>

      </main>

    </div>
  );
}
