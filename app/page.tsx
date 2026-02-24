"use client";
import { useState, useEffect, useRef } from "react";

const JOBS = [
  { id: 1, title: "Senior Product Designer", company: "Stripe", logo: "S", location: "Remote", type: "Full-time", salary: "$120k–$160k", category: "Design", tags: ["Figma", "Systems", "B2B"], hot: true, new: false, color: "#6772e5" },
  { id: 2, title: "Staff Frontend Engineer", company: "Linear", logo: "L", location: "San Francisco", type: "Full-time", salary: "$180k–$220k", category: "Engineering", tags: ["React", "TypeScript", "Perf"], hot: true, new: true, color: "#5e6ad2" },
  { id: 3, title: "Growth Marketing Lead", company: "Vercel", logo: "V", location: "Remote", type: "Full-time", salary: "$110k–$140k", category: "Marketing", tags: ["SEO", "Analytics", "GTM"], hot: false, new: true, color: "#000000" },
  { id: 4, title: "ML Research Engineer", company: "Cohere", logo: "C", location: "Toronto", type: "Full-time", salary: "$160k–$200k", category: "Engineering", tags: ["Python", "PyTorch", "LLMs"], hot: true, new: false, color: "#39c5bb" },
  { id: 5, title: "Head of Finance", company: "Ramp", logo: "R", location: "New York", type: "Full-time", salary: "$150k–$190k", category: "Finance", tags: ["FP&A", "GAAP", "M&A"], hot: false, new: false, color: "#FF6B35" },
  { id: 6, title: "Developer Advocate", company: "PlanetScale", logo: "P", location: "Remote", type: "Contract", salary: "$80k–$100k", category: "Engineering", tags: ["MySQL", "DevRel", "Content"], hot: false, new: true, color: "#9B59B6" },
  { id: 7, title: "Brand Designer", company: "Figma", logo: "F", location: "San Francisco", type: "Full-time", salary: "$130k–$160k", category: "Design", tags: ["Branding", "Motion", "UI"], hot: false, new: false, color: "#F24E1E" },
  { id: 8, title: "Product Manager, Platform", company: "Notion", logo: "N", location: "Remote", type: "Full-time", salary: "$130k–$170k", category: "Product", tags: ["Roadmap", "APIs", "B2B"], hot: true, new: false, color: "#000000" },
];

const CATEGORIES = ["All", "Engineering", "Design", "Marketing", "Finance", "Product"];
const TYPES = ["All", "Full-time", "Contract", "Internship", "Remote"];

const STATS = [
  { val: "12,400+", label: "Open Roles" },
  { val: "3,800+", label: "Companies" },
  { val: "94%", label: "Offer Rate" },
  { val: "18 days", label: "Avg. Time to Hire" },
];

const FEATURED_COMPANIES = [
  { name: "Stripe", logo: "S", color: "#6772e5", jobs: 14 },
  { name: "Linear", logo: "L", color: "#5e6ad2", jobs: 6 },
  { name: "Vercel", logo: "▲", color: "#000", jobs: 22 },
  { name: "Figma", logo: "F", color: "#F24E1E", jobs: 9 },
  { name: "Notion", logo: "N", color: "#000", jobs: 17 },
  { name: "Loom", logo: "L", color: "#625DF5", jobs: 5 },
];

export default function JobPortal() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [applied, setApplied] = useState(new Set());
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyStep, setApplyStep] = useState(0);
  const [notification, setNotification] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredJobs = JOBS.filter((j) => {
    const matchCat = selectedCategory === "All" || j.category === selectedCategory;
    const matchType = selectedType === "All" || j.type === selectedType || (selectedType === "Remote" && j.location === "Remote");
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchType && matchSearch;
  });

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSavedJobs(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); showNotif("Removed from saved", "info"); }
      else { n.add(id); showNotif("Job saved!"); }
      return n;
    });
  };

  const handleApply = () => {
    if (!isLoggedIn) { setAuthMode("login"); return; }
    if (applyStep === 0) { setApplyStep(1); return; }
    setApplied(prev => new Set(prev).add(selectedJob.id));
    setApplyStep(0);
    setCoverLetter("");
    showNotif(`Applied to ${selectedJob.title} at ${selectedJob.company}! 🎉`);
    setSelectedJob(null);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Instrument Sans', sans-serif", background: "#fafaf8", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .fade-up { opacity: 0; transform: translateY(24px); animation: fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        
        .job-card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .job-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        
        .btn-primary { background: #1a1a1a; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; letter-spacing: -0.01em; }
        .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        
        .btn-outline { background: transparent; color: #1a1a1a; border: 1.5px solid #e5e5e0; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-outline:hover { border-color: #1a1a1a; background: #f5f5f2; }
        
        .input { width: 100%; padding: 12px 16px; border: 1.5px solid #e5e5e0; border-radius: 12px; font-size: 14px; outline: none; font-family: inherit; background: #fff; transition: border-color 0.2s; color: #1a1a1a; }
        .input:focus { border-color: #1a1a1a; }
        
        .nav-link { padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s; border: none; background: none; font-family: inherit; color: #555; }
        .nav-link:hover { background: #f0f0eb; color: #1a1a1a; }
        .nav-link.active { background: #1a1a1a; color: #fff; }
        
        .pill { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
        
        .cat-btn { padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1.5px solid #e5e5e0; background: #fff; transition: all 0.15s; font-family: inherit; color: #555; }
        .cat-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .cat-btn:hover:not(.active) { border-color: #999; color: #1a1a1a; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal { background: #fff; border-radius: 20px; box-shadow: 0 32px 80px rgba(0,0,0,0.15); max-width: 580px; width: 90%; max-height: 85vh; overflow-y: auto; animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        .save-btn { border: none; background: none; cursor: pointer; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .save-btn:hover { background: #f5f5f2; }
        
        .notif { position: fixed; top: 80px; right: 24px; z-index: 999; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500; animation: slideInRight 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        
        .hero-word { display: inline-block; transition: all 0.6s ease; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d5d5cf; border-radius: 3px; }
        
        textarea.input { resize: vertical; min-height: 120px; line-height: 1.6; }
      `}</style>

      {/* NOTIFICATION */}
      {notification && (
        <div className="notif" style={{ background: notification.type === "info" ? "#f5f5f2" : "#1a1a1a", color: notification.type === "info" ? "#555" : "#fff" }}>
          {notification.msg}
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,248,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8e8e2", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setActiveTab("home")}>
            <div style={{ width: 32, height: 32, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, letterSpacing: "-0.02em" }}>Hired.</span>
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {["home", "jobs", "companies", isLoggedIn ? "dashboard" : null].filter(Boolean).map(tab => (
              <button key={tab} className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isLoggedIn ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "#1a1a1a", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {userName?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="btn-outline" onClick={() => { setIsLoggedIn(false); setUserName(""); showNotif("Signed out", "info"); }}>Sign out</button>
              </div>
            ) : (
              <>
                <button className="btn-outline" onClick={() => setAuthMode("login")}>Sign in</button>
                <button className="btn-primary" onClick={() => setAuthMode("signup")}>Get hired →</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HOME */}
      {activeTab === "home" && (
        <div>
          {/* HERO */}
          <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
              <div>
                <div className={heroVisible ? "fade-up" : ""} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e5e5e0", borderRadius: 20, padding: "6px 14px", marginBottom: 28, fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.04em" }}>
                  <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
                  2,400+ new roles this week
                </div>

                <h1 className={heroVisible ? "fade-up stagger-1" : ""} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(44px, 5vw, 62px)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
                  Work that <span style={{ fontStyle: "italic", color: "#666" }}>actually</span><br />
                  excites you.
                </h1>

                <p className={heroVisible ? "fade-up stagger-2" : ""} style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
                  Curated opportunities from the world's most interesting companies. No noise, no spam — just roles worth your time.
                </p>

                <div className={heroVisible ? "fade-up stagger-3" : ""} style={{ display: "flex", gap: 10, marginBottom: 48 }}>
                  <button className="btn-primary" style={{ fontSize: 15, padding: "14px 28px" }} onClick={() => setActiveTab("jobs")}>
                    Explore jobs
                  </button>
                  <button className="btn-outline" style={{ padding: "14px 24px", fontSize: 14 }} onClick={() => setAuthMode("signup")}>
                    Post a role
                  </button>
                </div>

                {/* Stats */}
                <div className={heroVisible ? "fade-up stagger-4" : ""} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid #e8e8e2", paddingTop: 28 }}>
                  {STATS.map((s, i) => (
                    <div key={i} style={{ borderRight: i < 3 ? "1px solid #e8e8e2" : "none", paddingRight: 20, paddingLeft: i > 0 ? 20 : 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 2, fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: floating job cards */}
              <div className={heroVisible ? "fade-up stagger-2" : ""} style={{ position: "relative", height: 420 }}>
                {JOBS.slice(0, 3).map((job, i) => (
                  <div
                    key={job.id}
                    onClick={() => { setSelectedJob(job); setActiveTab("jobs"); }}
                    style={{
                      position: "absolute",
                      top: i === 0 ? 0 : i === 1 ? 140 : 280,
                      left: i === 1 ? 40 : 0,
                      right: i === 1 ? 0 : i === 2 ? 40 : 0,
                      background: "#fff",
                      border: "1.5px solid #e8e8e2",
                      borderRadius: 16,
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: i === 1 ? "0 8px 32px rgba(0,0,0,0.08)" : "0 2px 12px rgba(0,0,0,0.04)",
                      zIndex: i === 1 ? 2 : 1,
                    }}
                    className="job-card"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: job.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                        {job.logo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{job.company} · {job.location}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", whiteSpace: "nowrap" }}>{job.salary.split("–")[0]}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      {job.tags.slice(0, 2).map(t => (
                        <span key={t} className="pill" style={{ background: "#f5f5f2", color: "#555" }}>{t}</span>
                      ))}
                      {job.hot && <span className="pill" style={{ background: "#fff3f0", color: "#e55" }}>🔥 Hot</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Companies */}
          <section style={{ background: "#fff", borderTop: "1px solid #e8e8e2", borderBottom: "1px solid #e8e8e2", padding: "48px 24px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, letterSpacing: "-0.02em" }}>Hiring now</h2>
                <button className="btn-outline" onClick={() => setActiveTab("companies")}>See all companies</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
                {FEATURED_COMPANIES.map((co) => (
                  <div key={co.name} onClick={() => setActiveTab("companies")} style={{ background: "#fafaf8", border: "1.5px solid #e8e8e2", borderRadius: 14, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }} className="job-card">
                    <div style={{ width: 44, height: 44, background: co.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, margin: "0 auto 10px" }}>
                      {co.logo}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{co.name}</div>
                    <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 3 }}>{co.jobs} open roles</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ background: "#1a1a1a", borderRadius: 24, padding: "60px 48px", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#fff", letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Hiring great people?<br />
                  <span style={{ fontStyle: "italic", color: "#aaa" }}>We'll find them.</span>
                </h2>
                <p style={{ color: "#888", fontSize: 15, lineHeight: 1.6 }}>Post a job and reach thousands of qualified, motivated candidates.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
                <button style={{ background: "#fff", color: "#1a1a1a", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }} onClick={() => setAuthMode("signup")}>
                  Post a job — Free
                </button>
                <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}>No credit card required</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* JOBS PAGE */}
      {activeTab === "jobs" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          {/* Search */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Find your next role
            </h1>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input className="input" style={{ paddingLeft: 42 }} placeholder="Search roles, companies, skills..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#999", alignSelf: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</span>
              {CATEGORIES.map(c => (
                <button key={c} className={`cat-btn ${selectedCategory === c ? "active" : ""}`} onClick={() => setSelectedCategory(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#999", alignSelf: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</span>
            {TYPES.map(t => (
              <button key={t} className={`cat-btn ${selectedType === t ? "active" : ""}`} onClick={() => setSelectedType(t)}>{t}</button>
            ))}
          </div>

          {/* Results count */}
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20, fontWeight: 500 }}>
            {filteredJobs.length} role{filteredJobs.length !== 1 ? "s" : ""} found
          </div>

          {/* Job Grid */}
          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>No roles match your search</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Try different keywords or filters</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card"
                  onClick={() => setSelectedJob(job)}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e8e8e2",
                    borderRadius: 16,
                    padding: "22px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, background: job.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                        {job.logo}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13, color: "#888" }}>{job.company}</div>
                        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", marginTop: 1 }}>{job.title}</div>
                      </div>
                    </div>
                    <button className="save-btn" onClick={(e) => toggleSave(job.id, e)}>
                      <svg width="16" height="16" fill={savedJobs.has(job.id) ? "#1a1a1a" : "none"} viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="2">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888", marginBottom: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {job.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                      {job.type}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {job.tags.map(t => (
                      <span key={t} className="pill" style={{ background: "#f5f5f2", color: "#444" }}>{t}</span>
                    ))}
                    {job.new && <span className="pill" style={{ background: "#f0fff4", color: "#16a34a" }}>New</span>}
                    {job.hot && <span className="pill" style={{ background: "#fff3f0", color: "#dc2626" }}>🔥 Hot</span>}
                    {applied.has(job.id) && <span className="pill" style={{ background: "#f0f4ff", color: "#4338ca" }}>✓ Applied</span>}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f0f0eb" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{job.salary}</span>
                    <span style={{ fontSize: 12, color: "#aaa" }}>2d ago</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPANIES PAGE */}
      {activeTab === "companies" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: "-0.02em", marginBottom: 8 }}>Companies</h1>
          <p style={{ color: "#888", marginBottom: 36, fontSize: 15 }}>World-class teams building the future</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURED_COMPANIES.map((co) => (
              <div key={co.name} className="job-card" style={{ background: "#fff", border: "1.5px solid #e8e8e2", borderRadius: 18, padding: 28, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, background: co.color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22 }}>
                    {co.logo}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{co.name}</div>
                    <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginTop: 2 }}>{co.jobs} open roles</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 16 }}>
                  Building the infrastructure of the modern internet. Backed by top-tier investors.
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Series B", "500–1k", "🌍 Remote-first"].map(tag => (
                    <span key={tag} className="pill" style={{ background: "#f5f5f2", color: "#555" }}>{tag}</span>
                  ))}
                </div>
                <button className="btn-outline" style={{ width: "100%", marginTop: 18, textAlign: "center" }} onClick={() => { setSelectedCategory("All"); setActiveTab("jobs"); }}>
                  View {co.jobs} open roles
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && isLoggedIn && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Welcome back,</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: "-0.02em" }}>{userName || "there"} 👋</h1>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
            {[
              { label: "Applications", val: applied.size, icon: "📄", bg: "#f0f4ff", fg: "#4338ca" },
              { label: "Saved Jobs", val: savedJobs.size, icon: "🔖", bg: "#fff7f0", fg: "#ea580c" },
              { label: "Profile Views", val: 47, icon: "👁️", bg: "#f0fff4", fg: "#16a34a" },
              { label: "Interviews", val: 2, icon: "🎯", bg: "#fdf4ff", fg: "#9333ea" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", border: "1.5px solid #e8e8e2", borderRadius: 16, padding: "22px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, letterSpacing: "-0.02em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Applied jobs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "#fff", border: "1.5px solid #e8e8e2", borderRadius: 18, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Applications</h3>
                <span style={{ fontSize: 12, color: "#888" }}>{applied.size} total</span>
              </div>
              {applied.size === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                  <div style={{ fontSize: 13 }}>No applications yet</div>
                  <button className="btn-outline" style={{ marginTop: 14, fontSize: 13 }} onClick={() => setActiveTab("jobs")}>Browse jobs</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {JOBS.filter(j => applied.has(j.id)).map(job => (
                    <div key={job.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#fafaf8", borderRadius: 12 }}>
                      <div style={{ width: 36, height: 36, background: job.color, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{job.logo}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{job.company}</div>
                      </div>
                      <span className="pill" style={{ background: "#fff3f0", color: "#e55" }}>Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "#fff", border: "1.5px solid #e8e8e2", borderRadius: 18, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Saved Jobs</h3>
                <span style={{ fontSize: 12, color: "#888" }}>{savedJobs.size} saved</span>
              </div>
              {savedJobs.size === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔖</div>
                  <div style={{ fontSize: 13 }}>No saved jobs yet</div>
                  <button className="btn-outline" style={{ marginTop: 14, fontSize: 13 }} onClick={() => setActiveTab("jobs")}>Browse jobs</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {JOBS.filter(j => savedJobs.has(j.id)).map(job => (
                    <div key={job.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#fafaf8", borderRadius: 12 }}>
                      <div style={{ width: 36, height: 36, background: job.color, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{job.logo}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{job.company} · {job.salary}</div>
                      </div>
                      <button onClick={() => { setSelectedJob(job); setActiveTab("jobs"); }} style={{ fontSize: 12, color: "#555", background: "none", border: "1px solid #e5e5e0", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}>View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => { setSelectedJob(null); setApplyStep(0); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "28px 28px 0", borderBottom: "1px solid #f0f0eb", paddingBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, background: selectedJob.color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 24 }}>
                    {selectedJob.logo}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{selectedJob.company}</div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>{selectedJob.title}</h2>
                  </div>
                </div>
                <button onClick={() => { setSelectedJob(null); setApplyStep(0); }} style={{ background: "#f5f5f2", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 13, color: "#666" }}>
                <span>📍 {selectedJob.location}</span>
                <span>💼 {selectedJob.type}</span>
                <span>💰 {selectedJob.salary}</span>
                <span>📂 {selectedJob.category}</span>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                {selectedJob.tags.map(t => (
                  <span key={t} className="pill" style={{ background: "#f5f5f2", color: "#444" }}>{t}</span>
                ))}
                {selectedJob.new && <span className="pill" style={{ background: "#f0fff4", color: "#16a34a" }}>New</span>}
                {selectedJob.hot && <span className="pill" style={{ background: "#fff3f0", color: "#dc2626" }}>🔥 Hot</span>}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 28px" }}>
              {applyStep === 0 ? (
                <>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>About this role</h3>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 20 }}>
                    We're looking for an exceptional <strong>{selectedJob.title}</strong> to join the {selectedJob.company} team. You'll work on high-impact projects alongside some of the best minds in the industry, shaping products used by millions.
                  </p>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>What you'll do</h3>
                  <ul style={{ listStyle: "none", fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 20 }}>
                    {["Own end-to-end product decisions in your domain", "Collaborate closely with engineering, design, and data teams", "Define and track key metrics to measure success", "Mentor and grow team members around you"].map(item => (
                      <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#22c55e", marginTop: 3, flexShrink: 0 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Requirements</h3>
                  <ul style={{ listStyle: "none", fontSize: 14, color: "#555", lineHeight: 1.8 }}>
                    {[`5+ years of experience in ${selectedJob.category}`, ...selectedJob.tags.map(t => `Strong experience with ${t}`), "Exceptional communication skills"].map(item => (
                      <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#999", marginTop: 3, flexShrink: 0 }}>·</span> {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Apply to {selectedJob.company}</h3>
                  <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Your profile will be shared along with your message.</p>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Cover letter (optional)</label>
                  <textarea
                    className="input"
                    placeholder={`Tell ${selectedJob.company} why you're excited about this role...`}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                  />
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "0 28px 28px", display: "flex", gap: 10 }}>
              {applied.has(selectedJob.id) ? (
                <div style={{ flex: 1, background: "#f0fff4", borderRadius: 12, padding: "13px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#16a34a" }}>
                  ✓ Application submitted
                </div>
              ) : (
                <button className="btn-primary" style={{ flex: 1, textAlign: "center" }} onClick={handleApply}>
                  {applyStep === 0 ? "Apply now →" : "Submit application"}
                </button>
              )}
              <button className="save-btn" style={{ width: 46, height: 46, border: "1.5px solid #e5e5e0", borderRadius: 12 }} onClick={(e) => toggleSave(selectedJob.id, e)}>
                <svg width="18" height="18" fill={savedJobs.has(selectedJob.id) ? "#1a1a1a" : "none"} viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="2">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authMode && (
        <div className="modal-overlay" onClick={() => setAuthMode(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, letterSpacing: "-0.02em" }}>
                    {authMode === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                    {authMode === "login" ? "Sign in to continue" : "Join thousands of professionals"}
                  </p>
                </div>
                <button onClick={() => setAuthMode(null)} style={{ background: "#f5f5f2", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {authMode === "signup" && (
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7, color: "#444" }}>Full name</label>
                    <input className="input" placeholder="Alex Johnson" id="auth-name" />
                  </div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7, color: "#444" }}>Email</label>
                  <input className="input" type="email" placeholder="alex@example.com" id="auth-email" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7, color: "#444" }}>Password</label>
                  <input className="input" type="password" placeholder="••••••••" id="auth-password" />
                </div>

                <button className="btn-primary" style={{ width: "100%", marginTop: 6, padding: "14px", fontSize: 15 }} onClick={() => {
                  const nameEl = document.getElementById("auth-name");
                  const name = authMode === "signup" ? (nameEl?.value || "User") : "User";
                  setIsLoggedIn(true);
                  setUserName(name);
                  setAuthMode(null);
                  setActiveTab("dashboard");
                  showNotif(authMode === "login" ? "Welcome back! 👋" : "Account created! Welcome 🎉");
                }}>
                  {authMode === "login" ? "Sign in" : "Create account"}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#888" }}>
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <span style={{ color: "#1a1a1a", fontWeight: 600, cursor: "pointer" }} onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                  {authMode === "login" ? "Sign up" : "Sign in"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}