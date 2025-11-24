// API client for donor portal
class DonorAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Applications
    async getApplications() {
        return this.request('/applications');
    }

    async getApplication(id) {
        return this.request(`/applications/${id}`);
    }

    async updateApplicationStatus(id, status) {
        return this.request(`/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Metrics
    async getMetrics() {
        return this.request('/metrics');
    }

    // Funds
    async createFund(fundData) {
        return this.request('/funds', {
            method: 'POST',
            body: JSON.stringify(fundData)
        });
    }

    async getFunds() {
        return this.request('/funds');
    }

    // Recommendations
    async getRecommendations() {
        return this.request('/recommendations');
    }
}

// Initialize API client
const api = new DonorAPI();

// Enhanced functions with backend integration
async function loadApplications() {
    try {
        const applications = await api.getApplications();
        updateApplicationsUI(applications);
    } catch (error) {
        showNotification('Failed to load applications', 'error');
    }
}

async function updateApplicationStatus(id, status) {
    try {
        await api.updateApplicationStatus(id, status);
        showNotification(`Application ${status} successfully!`);
        loadApplications();
        loadMetrics();
    } catch (error) {
        showNotification('Failed to update application', 'error');
    }
}

async function loadMetrics() {
    try {
        const metrics = await api.getMetrics();
        updateMetricsUI(metrics);
    } catch (error) {
        showNotification('Failed to load metrics', 'error');
    }
}

async function createFund(formData) {
    try {
        const fund = await api.createFund(formData);
        showNotification('Fund created successfully!');
        return fund;
    } catch (error) {
        showNotification('Failed to create fund', 'error');
        throw error;
    }
}

async function loadRecommendations() {
    try {
        const recommendations = await api.getRecommendations();
        updateRecommendationsUI(recommendations);
    } catch (error) {
        showNotification('Failed to load recommendations', 'error');
    }
}

// UI Update functions
function updateApplicationsUI(applications) {
    const container = document.getElementById('applicationsList');
    if (!container) return;

    container.innerHTML = applications.map(app => `
        <div class="application-item" onclick="showApplicationDetails(${app.id})">
            <div class="application-info">
                <div class="company-avatar">${app.company.substring(0, 2).toUpperCase()}</div>
                <div class="application-details">
                    <h4>${app.company}</h4>
                    <p>${app.industry} • ${app.employees} employees</p>
                </div>
            </div>
            <div class="application-status">
                <div class="status-badge ${app.status}">${app.status.toUpperCase()}</div>
                <div class="amount-display">R${app.amount.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

function updateMetricsUI(metrics) {
    const elements = {
        smmesFunded: document.querySelector('.metric-card:nth-child(1) .metric-value'),
        jobsCreated: document.querySelector('.metric-card:nth-child(2) .metric-value'),
        averageROI: document.querySelector('.metric-card:nth-child(3) .metric-value'),
        pendingReviews: document.querySelector('.metric-card:nth-child(4) .metric-value')
    };

    if (elements.smmesFunded) elements.smmesFunded.textContent = metrics.smmesFunded;
    if (elements.jobsCreated) elements.jobsCreated.textContent = metrics.jobsCreated.toLocaleString();
    if (elements.averageROI) elements.averageROI.textContent = `R${(metrics.averageROI / 1000000).toFixed(1)}M`;
    if (elements.pendingReviews) elements.pendingReviews.textContent = metrics.pendingReviews;
}

function updateRecommendationsUI(recommendations) {
    const container = document.getElementById('recommendationsContent');
    if (!container) return;

    const priorityColors = { high: 'var(--success)', medium: 'var(--primary)', low: 'var(--warning)' };
    
    container.innerHTML = recommendations.map(rec => `
        <div style="background: var(--gray-50); border-radius: 16px; padding: 1.5rem; border-left: 4px solid ${priorityColors[rec.priority]};">
            <h4 style="color: ${priorityColors[rec.priority]}; margin-bottom: 0.5rem;">${rec.priority.toUpperCase()} Priority</h4>
            <p><strong>${rec.company}</strong> - ${rec.aiScore}% match score</p>
            <p style="font-size: 0.875rem; color: var(--gray-600);">R${rec.amount.toLocaleString()} requested</p>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
    loadMetrics();
});