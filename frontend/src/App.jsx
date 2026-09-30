import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const demoJobs = [
  { _id:"job1", title:"Python Developer Intern", company:"TechNova Solutions", location:"Mumbai", type:"Internship", qualification:"B.Sc IT / BCA / B.Tech", skills:"Python, Django, SQL", experience:"Fresher", salary:"₹15,000/month", description:"Work with the development team to build web applications and APIs.", lastDate:"30/09/2026" },
  { _id:"job2", title:"Frontend Developer Intern", company:"WebCraft Technologies", location:"Pune", type:"Internship", qualification:"B.Sc IT / BCA / B.Tech", skills:"HTML, CSS, JavaScript, React", experience:"Fresher", salary:"₹18,000/month", description:"Create responsive user interfaces and learn React development.", lastDate:"05/10/2026" },
  { _id:"job3", title:"Java Developer - Fresher", company:"CodeBridge Pvt Ltd", location:"Mumbai", type:"Full Time", qualification:"B.Sc IT / BCA / B.Tech", skills:"Java, SQL, JDBC", experience:"Fresher", salary:"₹4 LPA", description:"Join the software team as a fresher Java developer.", lastDate:"10/10/2026" },
  { _id:"job4", title:"Data Analyst Intern", company:"InsightWorks", location:"Remote", type:"Internship", qualification:"Any Degree", skills:"Excel, SQL, Python", experience:"Fresher", salary:"₹12,000/month", description:"Assist the analytics team with reports, data cleaning and dashboards.", lastDate:"15/10/2026" }
];

function App() {
  const [page, setPage] = useState("home");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState(() => JSON.parse(localStorage.getItem("applications") || "[]"));
  const [student, setStudent] = useState(() => JSON.parse(localStorage.getItem("student") || "null"));
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  async function loadJobs() {
    try {
      const res = await axios.get(`${API}/jobs`);
      setJobs(res.data.length ? res.data : demoJobs);
    } catch {
      setJobs(demoJobs);
    }
  }

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  }

  async function apply(job) {
    const s = student || { name: "Demo Student", email: "student@example.com" };
    const already = applications.some(a => a.jobId === job._id && a.studentEmail === s.email);
    if (already) return showMessage("You already applied for this job.");
    const data = { studentName: s.name, studentEmail: s.email, jobId: job._id, jobTitle: job.title, company: job.company };
    try { await axios.post(`${API}/applications`, data); } catch {}
    setApplications([{ ...data, status:"Applied", appliedDate:new Date().toLocaleDateString("en-IN") }, ...applications]);
    showMessage("Application submitted successfully!");
    setPage("applications");
  }

  const filteredJobs = jobs.filter(j =>
    (j.title + " " + j.company + " " + j.skills + " " + j.location).toLowerCase().includes(search.toLowerCase()) &&
    (type === "All" || j.type === type)
  );

  return (
    <div>
      <nav className="navbar">
        <div className="brand" onClick={() => setPage("home")}>Career<span>Bridge</span></div>
        <div className="navlinks">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("jobs")}>Job Opportunities</button>
          <button onClick={() => setPage("applications")}>My Applications</button>
          <button onClick={() => setPage("company")}>Company</button>
          <button onClick={() => setPage("admin")}>Admin</button>
          <button className="loginBtn" onClick={() => setPage("login")}>{student ? "Profile" : "Student Login"}</button>
        </div>
      </nav>

      {message && <div className="toast">{message}</div>}

      {page === "home" && <Home setPage={setPage} jobs={jobs} />}
      {page === "jobs" && <Jobs jobs={filteredJobs} search={search} setSearch={setSearch} type={type} setType={setType} openJob={(j)=>{setSelectedJob(j);setPage("details")}} />}
      {page === "details" && selectedJob && <JobDetails job={selectedJob} apply={apply} back={()=>setPage("jobs")} />}
      {page === "applications" && <Applications applications={applications} />}
      {page === "login" && <Login setStudent={setStudent} setPage={setPage} />}
      {page === "register" && <Register setStudent={setStudent} setPage={setPage} />}
      {page === "company" && <Company jobs={jobs} setJobs={setJobs} showMessage={showMessage} />}
      {page === "admin" && <Admin jobs={jobs} applications={applications} />}
      {page === "profile" && <Profile student={student} />}

      <footer>© 2026 CareerBridge • MERN Placement Management System</footer>
    </div>
  );
}

function Home({setPage, jobs}) {
  return <main>
    <section className="hero">
      <div>
        <p className="tag">PLACEMENT & INTERNSHIP PORTAL</p>
        <h1>Find your next <span>opportunity.</span></h1>
        <p className="heroText">Connect students with internships, fresher jobs and companies through one simple placement platform.</p>
        <button className="primary" onClick={()=>setPage("jobs")}>Explore Opportunities →</button>
        <button className="secondary" onClick={()=>setPage("register")}>Create Student Account</button>
      </div>
      <div className="heroCard">
        <div className="miniIcon">💼</div>
        <h3>Opportunities for Freshers</h3>
        <p>Internships • Full Time • Remote</p>
        <div className="stats"><b>{jobs.length}+</b><small>active opportunities</small></div>
      </div>
    </section>
    <section className="section">
      <div className="sectionHead"><div><p className="tag">WHY CAREERBRIDGE?</p><h2>Everything in one place</h2></div></div>
      <div className="cards">
        <Info icon="🔎" title="Discover Jobs" text="Search internships and fresher opportunities by role, skills and location." />
        <Info icon="📝" title="Apply Easily" text="Keep your applications organized and check their status." />
        <Info icon="🏢" title="For Companies" text="Companies can post opportunities and manage applicants." />
      </div>
    </section>
  </main>
}

function Info({icon,title,text}) { return <div className="infoCard"><div className="infoIcon">{icon}</div><h3>{title}</h3><p>{text}</p></div> }

function Jobs({jobs, search, setSearch, type, setType, openJob}) {
  return <main className="section page">
    <p className="tag">OPPORTUNITIES</p><h2>Find your next job or internship</h2>
    <div className="filters">
      <input placeholder="Search role, company, skill..." value={search} onChange={e=>setSearch(e.target.value)} />
      <select value={type} onChange={e=>setType(e.target.value)}><option>All</option><option>Internship</option><option>Full Time</option></select>
    </div>
    <div className="jobGrid">{jobs.map(j=><JobCard key={j._id} job={j} openJob={openJob} />)}</div>
    {!jobs.length && <div className="empty">No opportunities found.</div>}
  </main>
}

function JobCard({job,openJob}) { return <div className="jobCard">
  <div className="companyLogo">{job.company.charAt(0)}</div>
  <div className="jobTop"><div><h3>{job.title}</h3><p className="company">{job.company}</p></div><span className="pill">{job.type}</span></div>
  <div className="meta"><span>📍 {job.location}</span><span>🎓 {job.qualification}</span><span>💰 {job.salary}</span></div>
  <p className="skills">{job.skills}</p>
  <button className="outline" onClick={()=>openJob(job)}>View Details →</button>
</div> }

function JobDetails({job,apply,back}) { return <main className="section page">
  <button className="back" onClick={back}>← Back to jobs</button>
  <div className="detail">
    <div className="detailHeader"><div className="bigLogo">{job.company.charAt(0)}</div><div><h1>{job.title}</h1><p className="company">{job.company} • {job.location}</p></div></div>
    <div className="detailGrid">
      <div><h3>Job Description</h3><p>{job.description}</p><h3>Skills Required</h3><p>{job.skills}</p></div>
      <aside><p><b>Job Type</b><br/>{job.type}</p><p><b>Qualification</b><br/>{job.qualification}</p><p><b>Experience</b><br/>{job.experience}</p><p><b>Salary</b><br/>{job.salary}</p><p><b>Last Date</b><br/>{job.lastDate}</p><button className="primary full" onClick={()=>apply(job)}>Apply Now</button></aside>
    </div>
  </div>
</main> }

function Applications({applications}) { return <main className="section page"><p className="tag">STUDENT AREA</p><h2>My Applications</h2>
  {!applications.length ? <div className="empty"><h3>No applications yet</h3><p>Explore opportunities and apply for a job.</p></div> :
  <div className="tableWrap"><table><thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead><tbody>{applications.map((a,i)=><tr key={i}><td>{a.jobTitle}</td><td>{a.company}</td><td>{a.appliedDate}</td><td><span className="status">{a.status}</span></td></tr>)}</tbody></table></div>}
</main> }

function Login({setStudent,setPage}) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  async function submit(e){e.preventDefault();let s={name:email.split("@")[0]||"Student",email,qualification:"B.Sc IT",skills:"HTML, CSS, JavaScript"};try{const r=await axios.post(`${API}/students/login`,{email,password});if(r.data.student)s=r.data.student}catch{} localStorage.setItem("student",JSON.stringify(s));setStudent(s);setPage("profile")}
  return <main className="auth"><form className="authBox" onSubmit={submit}><p className="tag">STUDENT PORTAL</p><h2>Welcome back</h2><input required type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary full">Login</button><p>New student? <button type="button" className="link" onClick={()=>setPage("register")}>Create account</button></p></form></main>
}

function Register({setStudent,setPage}) {
  const [form,setForm]=useState({name:"",email:"",password:"",qualification:"B.Sc IT",skills:""});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();try{await axios.post(`${API}/students/register`,form)}catch{}localStorage.setItem("student",JSON.stringify(form));setStudent(form);setPage("profile")}
  return <main className="auth"><form className="authBox" onSubmit={submit}><p className="tag">CREATE ACCOUNT</p><h2>Student Registration</h2>{["name","email","password","qualification","skills"].map(k=><input key={k} required name={k} type={k==="password"?"password":k==="email"?"email":"text"} placeholder={k[0].toUpperCase()+k.slice(1)} value={form[k]} onChange={change}/>)}<button className="primary full">Create Account</button></form></main>
}

function Profile({student}) { return <main className="section page"><p className="tag">MY PROFILE</p><h2>Student Profile</h2><div className="profileCard"><div className="avatar">{(student?.name||"S").charAt(0).toUpperCase()}</div><h2>{student?.name||"Student"}</h2><p>{student?.email||"student@example.com"}</p><div className="profileFields"><b>Qualification</b><span>{student?.qualification||"B.Sc IT"}</span><b>Skills</b><span>{student?.skills||"Add your skills"}</span></div></div></main> }

function Company({jobs,setJobs,showMessage}) {
  const [form,setForm]=useState({title:"",company:"",location:"Mumbai",type:"Internship",qualification:"B.Sc IT / BCA / B.Tech",skills:"",experience:"Fresher",salary:"",description:"",lastDate:""});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();let newJob={...form,_id:"local"+Date.now(),status:"Approved"};try{const r=await axios.post(`${API}/jobs`,form);newJob=r.data}catch{}setJobs([newJob,...jobs]);setForm({...form,title:"",skills:"",salary:"",description:"",lastDate:""});showMessage("Job posted successfully!")}
  return <main className="section page"><p className="tag">COMPANY PORTAL</p><h2>Post a Job Opportunity</h2><p className="muted">Companies can add internships and fresher opportunities for students.</p>
  <form className="postForm" onSubmit={submit}>{["title","company","location","qualification","skills","experience","salary","lastDate"].map(k=><input key={k} required name={k} placeholder={k==="lastDate"?"Last Date (DD/MM/YYYY)":k[0].toUpperCase()+k.slice(1)} value={form[k]} onChange={change}/>)}<select name="type" value={form.type} onChange={change}><option>Internship</option><option>Full Time</option></select><textarea required name="description" placeholder="Job description" value={form.description} onChange={change}/><button className="primary">Publish Job</button></form></main>
}

function Admin({jobs,applications}) { return <main className="section page"><p className="tag">ADMIN PANEL</p><h2>Placement Management Dashboard</h2><div className="adminGrid"><div><b>{jobs.length}</b><span>Active Jobs</span></div><div><b>{applications.length}</b><span>Applications</span></div><div><b>24</b><span>Students</span></div><div><b>8</b><span>Companies</span></div></div><div className="adminBox"><h3>System Flow</h3><p>Company posts job → Student views opportunity → Student applies → Company reviews → Interview → Selection.</p></div></main> }

export default App;
