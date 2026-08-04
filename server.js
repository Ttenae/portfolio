const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Path to our data file
const DATA_FILE = path.join(__dirname, 'projects.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const defaultProjects = [
    {
      id: 1,
      file: '001',
      title: 'ODA School Portal',
      subtitle: 'Student application & verification',
      desc: 'Registration system with email verification, role-based access, and Firebase integration in daily use at ODA Special Boarding School.',
      badge: 'production',
      type: ['education', 'portal'],
      tech: ['HTML/CSS', 'Firebase Auth', 'Firestore', 'EmailJS'],
      live: 'https://odaregistration.netlify.app/',
      github: '#',
      premium: true
    },
    {
      id: 2,
      file: '002',
      title: 'Fuel Control System',
      subtitle: 'Anti-corruption fleet monitor',
      desc: 'Fuel distribution dashboard with real-time tracking, AES-256 encryption, and live analytics built for Ethiopian government use.',
      badge: 'secure · advanced',
      type: ['gov', 'portal'],
      tech: ['Chart.js', 'Firebase', 'EmailJS', 'html2pdf'],
      live: 'https://fuelcontrolsystem.netlify.app/',
      github: '#',
      premium: true
    },
    {
      id: 3,
      file: '003',
      title: 'Rosemary Hotel',
      subtitle: 'Booking engine + admin dashboard',
      desc: 'Full hospitality system: a guest booking engine paired with a staff admin panel for revenue, booking trends, and room popularity insight.',
      badge: 'premium system',
      type: ['hotel', 'portal'],
      tech: ['HTML/CSS', 'Firebase', 'Analytics', 'Dashboard'],
      live: 'https://rosemaryhotel.netlify.app/',
      github: '#',
      premium: true
    },
    {
      id: 4,
      file: '004',
      title: 'Visit Ethiopia',
      subtitle: 'Tourism & culture showcase',
      desc: "Travel guide highlighting Ethiopia's heritage, UNESCO sites, and natural wonders built for inspiration and trip planning.",
      badge: 'standard',
      type: ['education'],
      tech: ['HTML5', 'CSS3', 'Vanilla JS'],
      live: 'https://beautyofethiopia.netlify.app/',
      github: '#',
      premium: false
    },
    {
      id: 5,
      file: '005',
      title: 'Canopy Hotel & Resort',
      subtitle: 'Corporate brochure + contact',
      desc: 'Brand presence for a 4-star hotel a clean, responsive site with an integrated contact form and location showcase.',
      badge: 'standard',
      type: ['hotel'],
      tech: ['HTML', 'CSS', 'Contact form'],
      live: 'https://www.canopyhotelandresort.com/',
      github: '#',
      premium: false
    },
    {
      id: 6,
      file: '006',
      title: 'Exam Portal (ODA)',
      subtitle: 'Student & teacher grade hub',
      desc: 'Role-based portal where students view results and teachers upload grades a clear academic workflow for ODA school.',
      badge: 'standard',
      type: ['education', 'portal'],
      tech: ['HTML', 'CSS', 'Firebase', 'Auth'],
      live: 'https://examportaloda.netlify.app/',
      github: '#',
      premium: false
    },
    {
      id: 7,
      file: '007',
      title: 'Rosemary Admin',
      subtitle: 'Hotel management dashboard',
      desc: 'Secure backend for Rosemary Hotel manage bookings, inquiries, and testimonials, and view performance metrics in real time.',
      badge: 'admin',
      type: ['hotel', 'portal'],
      tech: ['Dashboard', 'Firebase', 'Analytics'],
      live: 'https://rosemaryadmin.netlify.app/',
      github: '#',
      premium: true
    },
    {
      id: 8,
      file: '008',
      title: 'RAMODA · Brand',
      subtitle: 'Identity placeholder',
      desc: 'A minimal brand landing page clean and modern, ready for future expansion of the RAMODA identity.',
      badge: 'basic',
      type: ['education'],
      tech: ['HTML', 'CSS'],
      live: 'https://ramoda.netlify.app/',
      github: '#',
      premium: false
    }
  ];
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultProjects, null, 2));
  console.log('✅ Created default projects.json with 8 projects');
}

// Helper function to read projects
function getProjects() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write projects
function saveProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

// Helper to get next ID
function getNextId(projects) {
  const maxId = projects.reduce((max, p) => Math.max(max, p.id || 0), 0);
  return maxId + 1;
}

// API Routes

// GET all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// GET single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = getProjects();
    const id = parseInt(req.params.id);
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read project' });
  }
});

// POST new project
app.post('/api/projects', (req, res) => {
  try {
    const projects = getProjects();
    const { title, subtitle, desc, tech, live, github, type, badge, premium } = req.body;
    
    // Validate required fields
    if (!title || !desc) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const newProject = {
      id: getNextId(projects),
      file: String(getNextId(projects)).padStart(3, '0'),
      title: title.trim(),
      subtitle: subtitle || '',
      desc: desc.trim(),
      tech: tech || [],
      live: live || '',
      github: github || '',
      type: type || ['all'],
      badge: badge || 'standard',
      premium: !!premium
    };
    
    projects.push(newProject);
    saveProjects(projects);
    
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const projects = getProjects();
    const id = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const { title, subtitle, desc, tech, live, github, type, badge, premium } = req.body;
    
    projects[index] = {
      ...projects[index],
      title: title || projects[index].title,
      subtitle: subtitle || '',
      desc: desc || projects[index].desc,
      tech: tech || [],
      live: live || '',
      github: github || '',
      type: type || ['all'],
      badge: badge || 'standard',
      premium: !!premium
    };
    
    saveProjects(projects);
    res.json(projects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const projects = getProjects();
    const id = parseInt(req.params.id);
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    saveProjects(filteredProjects);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Serve admin page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${DATA_FILE}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/projects`);
  console.log(`📄 Admin panel: http://localhost:${PORT}`);
});