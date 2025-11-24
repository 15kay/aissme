// Shared functionality across all portal pages
class PortalManager {
    constructor() {
        this.initializeModals();
        this.bindEvents();
    }

    initializeModals() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modalContainer')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'modalContainer';
            modalContainer.innerHTML = `
                <div class="modal-overlay" id="modalOverlay">
                    <div class="modal-content" id="modalContent">
                        <div class="modal-header">
                            <h3 id="modalTitle">Modal Title</h3>
                            <button class="modal-close" onclick="portal.closeModal()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body" id="modalBody">
                            Modal content goes here
                        </div>
                        <div class="modal-footer" id="modalFooter">
                            <button class="btn btn-outline" onclick="portal.closeModal()">Cancel</button>
                            <button class="btn btn-primary" id="modalAction">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalContainer);
            this.addModalStyles();
        }
    }

    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay.active {
                display: flex;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                animation: modalSlideIn 0.3s ease;
            }
            @keyframes modalSlideIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .modal-header {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: #64748b;
                padding: 0.5rem;
                border-radius: 6px;
            }
            .modal-close:hover {
                background: #f1f5f9;
            }
            .modal-body {
                padding: 2rem;
            }
            .modal-footer {
                padding: 1.5rem 2rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .progress-modal {
                text-align: center;
            }
            .progress-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #1e40af;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 2rem auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .success-icon {
                width: 80px;
                height: 80px;
                background: #059669;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 2rem auto;
                font-size: 2rem;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showModal(title, content, actions = null) {
        const overlay = document.getElementById('modalOverlay');
        const titleEl = document.getElementById('modalTitle');
        const bodyEl = document.getElementById('modalBody');
        const footerEl = document.getElementById('modalFooter');

        titleEl.textContent = title;
        bodyEl.innerHTML = content;

        if (actions) {
            footerEl.innerHTML = actions;
        } else {
            footerEl.innerHTML = `
                <button class="btn btn-outline" onclick="portal.closeModal()">Close</button>
            `;
        }

        overlay.classList.add('active');
    }

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('active');
    }

    showProgressModal(title, message) {
        const content = `
            <div class="progress-modal">
                <div class="progress-spinner"></div>
                <h4>${message}</h4>
                <p style="color: #64748b; margin-top: 1rem;">Please wait...</p>
            </div>
        `;
        this.showModal(title, content, '');
    }

    showSuccessModal(title, message, callback = null) {
        const content = `
            <div class="progress-modal">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h4>${message}</h4>
            </div>
        `;
        const actions = `
            <button class="btn btn-primary" onclick="portal.closeModal(); ${callback ? callback + '()' : ''}">
                Continue
            </button>
        `;
        this.showModal(title, content, actions);
    }

    // Application Actions
    applyForFunding(funder, amount) {
        this.showProgressModal('Generating Application', 'AI is creating your funding application...');
        
        setTimeout(() => {
            this.showSuccessModal(
                'Application Generated',
                `Your ${funder} application for ${amount} has been generated successfully!`,
                'portal.viewApplication'
            );
        }, 2000);
    }

    viewApplication() {
        window.location.href = 'applications.html';
    }

    submitApplication(appId) {
        const content = `
            <div>
                <h4>Submit Application</h4>
                <p>Are you sure you want to submit this application? This action cannot be undone.</p>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <strong>Application ID:</strong> ${appId}<br>
                    <strong>Status:</strong> Ready for submission
                </div>
            </div>
        `;
        const actions = `
            <button class="btn btn-outline" onclick="portal.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="portal.confirmSubmission('${appId}')">
                <i class="fas fa-paper-plane"></i>
                Submit Application
            </button>
        `;
        this.showModal('Confirm Submission', content, actions);
    }

    confirmSubmission(appId) {
        this.showProgressModal('Submitting Application', 'Submitting your application...');
        
        setTimeout(() => {
            this.showSuccessModal(
                'Application Submitted',
                'Your application has been submitted successfully! You will receive a confirmation email shortly.'
            );
        }, 1500);
    }

    downloadDocument(docName) {
        this.showProgressModal('Preparing Download', 'Generating document...');
        
        setTimeout(() => {
            this.closeModal();
            // Simulate download
            const link = document.createElement('a');
            link.href = '#';
            link.download = docName;
            link.click();
            
            this.showSuccessModal('Download Ready', `${docName} has been downloaded to your device.`);
        }, 1000);
    }

    contactReviewer(reviewerName, email) {
        const content = `
            <div>
                <h4>Contact Reviewer</h4>
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; background: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                            ${reviewerName.charAt(0)}
                        </div>
                        <div>
                            <strong>${reviewerName}</strong><br>
                            <span style="color: #64748b;">${email}</span>
                        </div>
                    </div>
                    <p style="color: #64748b;">Senior Funding Analyst</p>
                </div>
                <textarea placeholder="Type your message here..." style="width: 100%; height: 100px; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; resize: vertical;"></textarea>
            </div>
        `;
        const actions = `
            <button class="btn btn-outline" onclick="portal.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="portal.sendMessage()">
                <i class="fas fa-paper-plane"></i>
                Send Message
            </button>
        `;
        this.showModal('Contact Reviewer', content, actions);
    }

    sendMessage() {
        this.showProgressModal('Sending Message', 'Sending your message...');
        
        setTimeout(() => {
            this.showSuccessModal(
                'Message Sent',
                'Your message has been sent successfully. You should receive a response within 24 hours.'
            );
        }, 1000);
    }

    editProfile() {
        const content = `
            <div>
                <h4>Edit Business Profile</h4>
                <p>Select which section you would like to update:</p>
                <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
                    <button class="btn btn-outline" onclick="portal.editSection('company')" style="justify-content: flex-start;">
                        <i class="fas fa-building"></i>
                        Company Information
                    </button>
                    <button class="btn btn-outline" onclick="portal.editSection('financial')" style="justify-content: flex-start;">
                        <i class="fas fa-chart-line"></i>
                        Financial Information
                    </button>
                    <button class="btn btn-outline" onclick="portal.editSection('documents')" style="justify-content: flex-start;">
                        <i class="fas fa-file-alt"></i>
                        Documents & Compliance
                    </button>
                    <button class="btn btn-outline" onclick="portal.editSection('preferences')" style="justify-content: flex-start;">
                        <i class="fas fa-cog"></i>
                        Funding Preferences
                    </button>
                </div>
            </div>
        `;
        this.showModal('Edit Profile', content, '');
    }

    editSection(section) {
        this.closeModal();
        const sectionNames = {
            company: 'Company Information',
            financial: 'Financial Information',
            documents: 'Documents & Compliance',
            preferences: 'Funding Preferences'
        };
        
        setTimeout(() => {
            this.showSuccessModal(
                'Edit Mode Activated',
                `You can now edit your ${sectionNames[section]}. Changes will be saved automatically.`
            );
        }, 300);
    }

    uploadDocument() {
        const content = `
            <div>
                <h4>Upload Documents</h4>
                <p>Select the type of document you want to upload:</p>
                <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
                    <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px dashed #e2e8f0; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-file-pdf" style="color: #dc2626;"></i>
                        <span>Financial Statements</span>
                        <input type="file" accept=".pdf,.xlsx,.xls" style="display: none;">
                    </label>
                    <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px dashed #e2e8f0; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-file-alt" style="color: #059669;"></i>
                        <span>Tax Certificates</span>
                        <input type="file" accept=".pdf" style="display: none;">
                    </label>
                    <label style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 2px dashed #e2e8f0; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-file-contract" style="color: #1e40af;"></i>
                        <span>Legal Documents</span>
                        <input type="file" accept=".pdf" style="display: none;">
                    </label>
                </div>
            </div>
        `;
        const actions = `
            <button class="btn btn-outline" onclick="portal.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="portal.processUpload()">
                <i class="fas fa-upload"></i>
                Upload Selected
            </button>
        `;
        this.showModal('Upload Documents', content, actions);
    }

    processUpload() {
        this.showProgressModal('Uploading Documents', 'Processing and validating your documents...');
        
        setTimeout(() => {
            this.showSuccessModal(
                'Upload Complete',
                'Your documents have been uploaded and validated successfully!'
            );
        }, 2000);
    }

    viewOpportunityDetails(title, details) {
        const content = `
            <div>
                <h4>${title}</h4>
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                    ${details}
                </div>
                <div style="margin: 1rem 0;">
                    <h5>Eligibility Criteria:</h5>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        <li>Registered South African business</li>
                        <li>Operational for minimum 12 months</li>
                        <li>Annual turnover requirements met</li>
                        <li>Tax compliance certificate valid</li>
                    </ul>
                </div>
            </div>
        `;
        const actions = `
            <button class="btn btn-outline" onclick="portal.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="portal.startApplication('${title}')">
                <i class="fas fa-rocket"></i>
                Start Application
            </button>
        `;
        this.showModal('Opportunity Details', content, actions);
    }

    startApplication(title) {
        this.closeModal();
        setTimeout(() => {
            this.applyForFunding(title, 'Amount TBD');
        }, 300);
    }
}

// Initialize portal manager
const portal = new PortalManager();

// Export for use in other scripts
window.portal = portal;