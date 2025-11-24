const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Mock data
let applications = [
    { id: 1, company: 'TechInnovate Solutions', industry: 'Technology', amount: 750000, status: 'pending', employees: 15, aiScore: 92 },
    { id: 2, company: 'GreenManufacturing Co', industry: 'Manufacturing', amount: 1200000, status: 'review', employees: 28, aiScore: 87 },
    { id: 3, company: 'Digital Services Hub', industry: 'Technology', amount: 450000, status: 'approved', employees: 8, aiScore: 95 },
    { id: 4, company: 'AgriFood Innovations', industry: 'Agriculture', amount: 980000, status: 'pending', employees: 22, aiScore: 89 }
];

let funds = [];
let metrics = {
    smmesFunded: 247,
    jobsCreated: 1847,
    averageROI: 2800000,
    pendingReviews: 18
};

// API Routes
app.get('/api/applications', (req, res) => {
    res.json(applications);
});

app.get('/api/applications/:id', (req, res) => {
    const app = applications.find(a => a.id === parseInt(req.params.id));
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
});

app.put('/api/applications/:id/status', (req, res) => {
    const app = applications.find(a => a.id === parseInt(req.params.id));
    if (!app) return res.status(404).json({ error: 'Application not found' });
    
    app.status = req.body.status;
    if (req.body.status === 'approved') metrics.smmesFunded++;
    if (req.body.status === 'pending') metrics.pendingReviews++;
    
    res.json(app);
});

app.get('/api/metrics', (req, res) => {
    res.json(metrics);
});

app.post('/api/funds', (req, res) => {
    const fund = {
        id: funds.length + 1,
        name: req.body.name,
        budget: req.body.budget,
        industry: req.body.industry,
        maxAmount: req.body.maxAmount,
        created: new Date()
    };
    funds.push(fund);
    res.json(fund);
});

app.get('/api/funds', (req, res) => {
    res.json(funds);
});

app.get('/api/recommendations', (req, res) => {
    const recommendations = applications
        .filter(app => app.status === 'pending')
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 3)
        .map(app => ({
            ...app,
            priority: app.aiScore > 90 ? 'high' : app.aiScore > 85 ? 'medium' : 'low'
        }));
    res.json(recommendations);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'donor-portal-functional.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});