/**
 * CreatorPulse - Core Application Engine
 */

// Preset Creator Sample Data (Indian Influencer Context - ₹ INR)
const PRESET_DATA = {
    contentItems: [
        {
            id: 'c-101',
            title: 'Top 5 AI Chrome Extensions for Productivity ⚡',
            platform: 'Instagram',
            stage: 'Posted',
            reach: 84500,
            link: 'https://instagram.com/reel/C3_sample1',
            notes: 'Hook: Stop wasting 2 hours every day. Use trending audio #12.',
            createdAt: '2026-07-28'
        },
        {
            id: 'c-102',
            title: 'My Desk Setup Tour 2026 (Minimalist & RGB)',
            platform: 'YouTube',
            stage: 'Edited',
            reach: 0,
            link: '',
            notes: 'A-roll done, color grading finished. Need to render thumbnail.',
            createdAt: '2026-07-30'
        },
        {
            id: 'c-103',
            title: '3 Hidden iPhone Hacks You Didn\'t Know 📱',
            platform: 'Instagram',
            stage: 'Shot',
            reach: 0,
            link: '',
            notes: 'B-roll footage recorded in 4K 60fps. Ready for montage edit.',
            createdAt: '2026-08-01'
        },
        {
            id: 'c-104',
            title: 'How I Organize My Influencer Brand Deals & Invoices',
            platform: 'YouTube',
            stage: 'Idea',
            reach: 0,
            link: '',
            notes: 'Showcase Notion database setup & template for creator followers.',
            createdAt: '2026-08-02'
        },
        {
            id: 'c-105',
            title: 'Day in the Life of a Tech Content Creator ☕',
            platform: 'TikTok',
            stage: 'Posted',
            reach: 120000,
            link: 'https://tiktok.com/@creator/video/sample2',
            notes: 'Fast paced transitions, vlog style caption overlay.',
            createdAt: '2026-07-25'
        }
    ],
    collabItems: [
        {
            id: 'b-201',
            brand: 'Boat Audio',
            handle: '@boataudio.official',
            stage: 'Paid',
            rate: 45000,
            deliverables: '1 IG Reel + 2 Stories',
            paymentStatus: 'Paid',
            dueDate: '2026-07-30',
            notes: 'Campaign: Wireless Earbuds Launch. Payment received via UPI/NEFT.',
            createdAt: '2026-07-15'
        },
        {
            id: 'b-202',
            brand: 'Minimalist Skincare',
            handle: '@beminimalist__',
            stage: 'Invoiced',
            rate: 35000,
            deliverables: '1 IG Reel + Link in Bio',
            paymentStatus: 'Invoiced',
            dueDate: '2026-08-10',
            notes: 'Reel posted on July 29. Invoice sent to brand PR team on July 30.',
            createdAt: '2026-07-20'
        },
        {
            id: 'b-203',
            brand: 'Keychron Keyboards India',
            handle: '@keychron.in',
            stage: 'Deal Agreed',
            rate: 60000,
            deliverables: '1 Dedicated YT Video + 1 IG Reel',
            paymentStatus: 'Unpaid',
            dueDate: '2026-08-25',
            notes: 'DM agreed on rate ₹60k. Review sample unit arriving on Monday.',
            createdAt: '2026-07-28'
        },
        {
            id: 'b-204',
            brand: 'Kuku FM App',
            handle: '@kukufm_official',
            stage: 'Quote Given',
            rate: 28000,
            deliverables: '1 IG Reel Integration (60s)',
            paymentStatus: 'Unpaid',
            dueDate: '',
            notes: 'Sent quote of ₹28,000 via IG DM. Waiting for PR team approval.',
            createdAt: '2026-08-01'
        }
    ],
    sheetsScriptUrl: ''
};

// Application State Class
class CreatorPulseApp {
    constructor() {
        this.state = this.loadState();
        this.activeTab = 'dashboard';
        this.currentViewMode = 'board'; // 'board' or 'table'
        this.editingItemType = null; // 'content' or 'collab'

        this.initDOM();
        this.bindEvents();
        this.renderAll();
    }

    // Load from LocalStorage or fall back to preset
    loadState() {
        const saved = localStorage.getItem('creator_pulse_data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state:', e);
            }
        }
        return JSON.parse(JSON.stringify(PRESET_DATA));
    }

    // Save state to LocalStorage
    saveState() {
        localStorage.setItem('creator_pulse_data', JSON.stringify(this.state));
    }

    // Format number to Indian Rupee (₹ INR) currency string
    formatINR(amount) {
        const num = parseFloat(amount) || 0;
        return '₹' + num.toLocaleString('en-IN');
    }

    // Initialize DOM references
    initDOM() {
        // Tab Pages
        this.tabs = document.querySelectorAll('.tab-page');
        this.navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

        // Form Modals
        this.modalContent = document.getElementById('modal-content');
        this.modalCollab = document.getElementById('modal-collab');
        this.formContent = document.getElementById('form-content');
        this.formCollab = document.getElementById('form-collab');

        // Content Filters & Views
        this.contentSearch = document.getElementById('content-search');
        this.contentPlatformFilter = document.getElementById('content-platform-filter');
        this.contentStageFilter = document.getElementById('content-stage-filter');
        this.viewBoardBtn = document.getElementById('view-board-btn');
        this.viewTableBtn = document.getElementById('view-table-btn');
        this.contentBoardView = document.getElementById('content-board-view');
        this.contentTableView = document.getElementById('content-table-view');

        // Collabs Filters
        this.collabSearch = document.getElementById('collab-search');
        this.collabStageFilter = document.getElementById('collab-stage-filter');
        this.collabPaymentFilter = document.getElementById('collab-payment-filter');
    }

    // Attach Event Listeners
    bindEvents() {
        // Tab Navigation
        this.navItems.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Quick Create Buttons
        document.getElementById('btn-quick-add').addEventListener('click', () => this.openContentModal());
        document.getElementById('btn-header-add').addEventListener('click', () => this.openContentModal());
        document.getElementById('btn-add-content').addEventListener('click', () => this.openContentModal());
        document.getElementById('btn-add-collab').addEventListener('click', () => this.openCollabModal());

        // Toggle View (Board vs Table)
        this.viewBoardBtn.addEventListener('click', () => this.setContentViewMode('board'));
        this.viewTableBtn.addEventListener('click', () => this.setContentViewMode('table'));

        // Form Submissions
        this.formContent.addEventListener('submit', (e) => this.handleContentSubmit(e));
        this.formCollab.addEventListener('submit', (e) => this.handleCollabSubmit(e));

        // Filters Search Listeners
        this.contentSearch.addEventListener('input', () => this.renderContentStage());
        this.contentPlatformFilter.addEventListener('change', () => this.renderContentStage());
        this.contentStageFilter.addEventListener('change', () => this.renderContentStage());

        this.collabSearch.addEventListener('input', () => this.renderCollabs());
        this.collabStageFilter.addEventListener('change', () => this.renderCollabs());
        this.collabPaymentFilter.addEventListener('change', () => this.renderCollabs());

        // Sync & Backup Buttons
        document.getElementById('btn-export-sheets-csv')?.addEventListener('click', () => {
            SyncManager.exportContentCSV(this.state.contentItems);
        });
        document.getElementById('btn-export-notion-content')?.addEventListener('click', () => {
            SyncManager.exportContentCSV(this.state.contentItems);
        });
        document.getElementById('btn-export-notion-collabs')?.addEventListener('click', () => {
            SyncManager.exportCollabsCSV(this.state.collabItems);
        });
        document.getElementById('btn-export-json')?.addEventListener('click', () => {
            SyncManager.exportFullJSON(this.state);
        });

        // Load Preset Demo Data
        document.getElementById('btn-load-demo-data')?.addEventListener('click', () => {
            if (confirm('Reset tracker to preset sample data? Current items will be updated.')) {
                this.state = JSON.parse(JSON.stringify(PRESET_DATA));
                this.saveState();
                this.renderAll();
            }
        });

        // JSON File Import
        const jsonInput = document.getElementById('json-file-input');
        document.getElementById('btn-import-json')?.addEventListener('click', () => jsonInput?.click());
        jsonInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (imported.contentItems && imported.collabItems) {
                        this.state = imported;
                        this.saveState();
                        this.renderAll();
                        alert('Backup JSON imported successfully!');
                    } else {
                        alert('Invalid backup JSON format.');
                    }
                } catch (err) {
                    alert('Error reading JSON file.');
                }
            };
            reader.readAsText(file);
        });

        // Sheets Webhook URL Save
        const scriptUrlInput = document.getElementById('sheets-script-url');
        if (scriptUrlInput) {
            scriptUrlInput.value = this.state.sheetsScriptUrl || '';
            document.getElementById('btn-save-sheets-config')?.addEventListener('click', () => {
                this.state.sheetsScriptUrl = scriptUrlInput.value.trim();
                this.saveState();
                alert('Sheets URL configuration saved!');
            });
        }
        document.getElementById('btn-sync-status')?.addEventListener('click', () => {
            if (this.state.sheetsScriptUrl) {
                SyncManager.syncToGoogleSheets(this.state.sheetsScriptUrl, this.state);
            } else {
                this.switchTab('sync');
            }
        });
    }

    // Tab Switcher
    switchTab(tabId) {
        this.activeTab = tabId;
        this.tabs.forEach(t => t.classList.remove('active'));
        this.navItems.forEach(n => n.classList.remove('active'));

        const activePage = document.getElementById(`tab-${tabId}`);
        if (activePage) activePage.classList.add('active');

        document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(btn => btn.classList.add('active'));
        this.renderAll();
    }

    // Toggle Content View Mode (Kanban vs Table)
    setContentViewMode(mode) {
        this.currentViewMode = mode;
        if (mode === 'board') {
            this.viewBoardBtn.classList.add('active');
            this.viewTableBtn.classList.remove('active');
            this.contentBoardView.classList.remove('hide');
            this.contentTableView.classList.add('hide');
        } else {
            this.viewTableBtn.classList.add('active');
            this.viewBoardBtn.classList.remove('active');
            this.contentTableView.classList.remove('hide');
            this.contentBoardView.classList.add('hide');
        }
        this.renderContentStage();
    }

    // Render Master Method
    renderAll() {
        this.renderDashboardKPIs();
        this.renderContentStage();
        this.renderCollabs();
    }

    // 1. Dashboard KPI Calculations & Widgets
    renderDashboardKPIs() {
        const collabs = this.state.collabItems || [];
        const content = this.state.contentItems || [];

        // Pending & Paid Calculations (₹ INR)
        let pendingAmount = 0;
        let pendingCount = 0;
        let paidAmount = 0;
        let paidCount = 0;

        collabs.forEach(c => {
            const val = parseFloat(c.rate) || 0;
            if (c.paymentStatus === 'Paid') {
                paidAmount += val;
                paidCount++;
            } else {
                pendingAmount += val;
                pendingCount++;
            }
        });

        document.getElementById('stat-pending-payments').innerText = this.formatINR(pendingAmount);
        document.getElementById('stat-pending-count').innerText = `${pendingCount} pending invoices`;
        document.getElementById('stat-paid-amount').innerText = this.formatINR(paidAmount);
        document.getElementById('stat-paid-count').innerText = `${paidCount} paid deals`;

        // Content In Production & Total Reach
        const inProdCount = content.filter(item => item.stage !== 'Posted').length;
        const totalReach = content.reduce((sum, item) => sum + (parseInt(item.reach) || 0), 0);

        document.getElementById('stat-in-prod-count').innerText = inProdCount;
        document.getElementById('stat-total-reach').innerText = totalReach.toLocaleString('en-IN');

        // Content Stage Progress Bars
        const stageCounts = { Idea: 0, Shot: 0, Edited: 0, Posted: 0 };
        content.forEach(c => { if (stageCounts[c.stage] !== undefined) stageCounts[c.stage]++; });

        const totalItems = content.length || 1;
        ['idea', 'shot', 'edited', 'posted'].forEach(s => {
            const stageName = s.charAt(0).toUpperCase() + s.slice(1);
            const count = stageCounts[stageName] || 0;
            document.getElementById(`count-stage-${s}`).innerText = count;
            document.getElementById(`bar-stage-${s}`).style.width = `${(count / totalItems) * 100}%`;
        });

        // Active IG DM Collabs Widget List
        const dashCollabsList = document.getElementById('dash-collabs-list');
        if (dashCollabsList) {
            const activeCollabs = collabs.slice(0, 4);
            if (activeCollabs.length === 0) {
                dashCollabsList.innerHTML = '<p class="text-muted">No active brand collabs yet.</p>';
            } else {
                dashCollabsList.innerHTML = activeCollabs.map(item => `
                    <div class="item-card" onclick="app.openCollabModal('${item.id}')">
                        <div class="collab-header">
                            <div class="brand-info">
                                <h3>${this.escapeHTML(item.brand)}</h3>
                                <span class="ig-handle">${this.escapeHTML(item.handle || '')}</span>
                            </div>
                            <span class="collab-rate">${this.formatINR(item.rate)}</span>
                        </div>
                        <div class="status-badge-row">
                            <span class="status-badge ${this.getCollabStageClass(item.stage)}">${item.stage}</span>
                            <span class="status-badge ${item.paymentStatus === 'Paid' ? 'paid' : 'quote'}">${item.paymentStatus}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Recent Top Posts Widget List
        const recentPostsBox = document.getElementById('dash-recent-posts');
        if (recentPostsBox) {
            const postedItems = content.filter(c => c.stage === 'Posted').slice(0, 3);
            if (postedItems.length === 0) {
                recentPostsBox.innerHTML = '<p class="text-muted" style="font-size:12px">No posted content yet.</p>';
            } else {
                recentPostsBox.innerHTML = postedItems.map(item => `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05)">
                        <span>${this.getPlatformIcon(item.platform)} <strong>${this.escapeHTML(item.title)}</strong></span>
                        <span class="text-pink" style="font-weight:700">${(item.reach || 0).toLocaleString('en-IN')} views</span>
                    </div>
                `).join('');
            }
        }
    }

    // 2. Render Content Stage Pipeline
    renderContentStage() {
        const search = this.contentSearch.value.toLowerCase().trim();
        const platformFilter = this.contentPlatformFilter.value;
        const stageFilter = this.contentStageFilter.value;

        let filtered = (this.state.contentItems || []).filter(item => {
            const matchSearch = item.title.toLowerCase().includes(search) || (item.notes || '').toLowerCase().includes(search);
            const matchPlatform = platformFilter === 'all' || item.platform === platformFilter;
            const matchStage = stageFilter === 'all' || item.stage === stageFilter;
            return matchSearch && matchPlatform && matchStage;
        });

        // Clear Kanban columns
        ['Idea', 'Shot', 'Edited', 'Posted'].forEach(stage => {
            const container = document.getElementById(`cards-container-${stage.toLowerCase()}`);
            const countBadge = document.getElementById(`col-count-${stage.toLowerCase()}`);
            if (container) container.innerHTML = '';
            if (countBadge) countBadge.innerText = '0';
        });

        const columnCounts = { Idea: 0, Shot: 0, Edited: 0, Posted: 0 };
        const tableBody = document.getElementById('content-table-body');
        if (tableBody) tableBody.innerHTML = '';

        filtered.forEach(item => {
            columnCounts[item.stage] = (columnCounts[item.stage] || 0) + 1;

            // Render Kanban Card
            const container = document.getElementById(`cards-container-${item.stage.toLowerCase()}`);
            if (container) {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <span class="card-platform-tag platform-${item.platform.toLowerCase()}">
                        ${this.getPlatformIcon(item.platform)} ${item.platform}
                    </span>
                    <h4>${this.escapeHTML(item.title)}</h4>
                    ${item.notes ? `<p class="card-notes">${this.escapeHTML(item.notes)}</p>` : ''}
                    <div class="card-meta-row">
                        <select class="stage-select-mini" onchange="app.quickUpdateContentStage('${item.id}', this.value)">
                            <option value="Idea" ${item.stage === 'Idea' ? 'selected' : ''}>Idea</option>
                            <option value="Shot" ${item.stage === 'Shot' ? 'selected' : ''}>Shot</option>
                            <option value="Edited" ${item.stage === 'Edited' ? 'selected' : ''}>Edited</option>
                            <option value="Posted" ${item.stage === 'Posted' ? 'selected' : ''}>Posted</option>
                        </select>
                        <span style="font-weight:600; color:var(--accent-cyan)">
                            ${item.stage === 'Posted' ? `👁️ ${parseInt(item.reach || 0).toLocaleString('en-IN')}` : ''}
                        </span>
                    </div>
                `;
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'SELECT') this.openContentModal(item.id);
                });
                container.appendChild(card);
            }

            // Render Table Row
            if (tableBody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${this.escapeHTML(item.title)}</strong></td>
                    <td>${this.getPlatformIcon(item.platform)} ${item.platform}</td>
                    <td><span class="status-badge ${this.getContentStageClass(item.stage)}">${item.stage}</span></td>
                    <td>${(item.reach || 0).toLocaleString('en-IN')}</td>
                    <td>${item.link ? `<a href="${this.escapeHTML(item.link)}" target="_blank" class="text-pink">Open Link</a>` : '-'}</td>
                    <td>
                        <button class="btn-icon" onclick="app.openContentModal('${item.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon" onclick="app.deleteContentItem('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });

        // Update column badge counts
        ['Idea', 'Shot', 'Edited', 'Posted'].forEach(stage => {
            const countBadge = document.getElementById(`col-count-${stage.toLowerCase()}`);
            if (countBadge) countBadge.innerText = columnCounts[stage] || '0';
        });
    }

    // Quick inline update for Content Stage
    quickUpdateContentStage(id, newStage) {
        const item = this.state.contentItems.find(c => c.id === id);
        if (item) {
            item.stage = newStage;
            this.saveState();
            this.renderAll();
        }
    }

    // 3. Render Brand Collabs Tracker
    renderCollabs() {
        const search = this.collabSearch.value.toLowerCase().trim();
        const stageFilter = this.collabStageFilter.value;
        const paymentFilter = this.collabPaymentFilter.value;

        let filtered = (this.state.collabItems || []).filter(item => {
            const matchSearch = item.brand.toLowerCase().includes(search) || 
                                (item.handle || '').toLowerCase().includes(search) || 
                                (item.notes || '').toLowerCase().includes(search);
            const matchStage = stageFilter === 'all' || item.stage === stageFilter;
            const matchPayment = paymentFilter === 'all' || item.paymentStatus === paymentFilter;
            return matchSearch && matchStage && matchPayment;
        });

        // Render Summary Totals (₹ INR)
        let totalPipeline = 0;
        let totalPending = 0;
        let totalReceived = 0;

        (this.state.collabItems || []).forEach(item => {
            const rate = parseFloat(item.rate) || 0;
            totalPipeline += rate;
            if (item.paymentStatus === 'Paid') {
                totalReceived += rate;
            } else {
                totalPending += rate;
            }
        });

        document.getElementById('collab-total-pipeline').innerText = this.formatINR(totalPipeline);
        document.getElementById('collab-total-pending').innerText = this.formatINR(totalPending);
        document.getElementById('collab-total-received').innerText = this.formatINR(totalReceived);

        // Render Grid
        const grid = document.getElementById('collabs-grid');
        if (!grid) return;
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = '<p class="text-muted" style="grid-column: span 3; text-align:center; padding:40px">No brand collaborations match your filters.</p>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'collab-card glass';
            card.innerHTML = `
                <div class="collab-header">
                    <div class="brand-info">
                        <h3>${this.escapeHTML(item.brand)}</h3>
                        <span class="ig-handle"><i class="fa-brands fa-instagram"></i> ${this.escapeHTML(item.handle || '@dm')}</span>
                    </div>
                    <div class="collab-rate">${this.formatINR(item.rate)}</div>
                </div>

                <div class="status-badge-row">
                    <span class="status-badge ${this.getCollabStageClass(item.stage)}">${item.stage}</span>
                    <span class="status-badge ${item.paymentStatus === 'Paid' ? 'paid' : 'quote'}">${item.paymentStatus}</span>
                </div>

                <div class="collab-details">
                    <div><i class="fa-solid fa-box-open"></i> <strong>Deliverables:</strong> ${this.escapeHTML(item.deliverables || 'N/A')}</div>
                    <div><i class="fa-solid fa-calendar-days"></i> <strong>Due Date:</strong> ${item.dueDate || 'Not set'}</div>
                    ${item.notes ? `<div style="margin-top:6px"><i class="fa-solid fa-comment-dots"></i> <em>"${this.escapeHTML(item.notes)}"</em></div>` : ''}
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:12px; margin-top:12px">
                    <select class="stage-select-mini" onchange="app.quickUpdateCollabStage('${item.id}', this.value)">
                        <option value="DM Inquiry" ${item.stage === 'DM Inquiry' ? 'selected' : ''}>💬 DM Inquiry</option>
                        <option value="Quote Given" ${item.stage === 'Quote Given' ? 'selected' : ''}>💰 Quote Given</option>
                        <option value="Deal Agreed" ${item.stage === 'Deal Agreed' ? 'selected' : ''}>🤝 Deal Agreed</option>
                        <option value="Content Shot" ${item.stage === 'Content Shot' ? 'selected' : ''}>📹 Content Shot</option>
                        <option value="Invoiced" ${item.stage === 'Invoiced' ? 'selected' : ''}>📄 Invoiced</option>
                        <option value="Paid" ${item.stage === 'Paid' ? 'selected' : ''}>✅ Payment Received</option>
                    </select>

                    <div>
                        <button class="btn-icon" onclick="app.openCollabModal('${item.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon" onclick="app.deleteCollabItem('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    quickUpdateCollabStage(id, newStage) {
        const item = this.state.collabItems.find(c => c.id === id);
        if (item) {
            item.stage = newStage;
            if (newStage === 'Paid') item.paymentStatus = 'Paid';
            else if (newStage === 'Invoiced') item.paymentStatus = 'Invoiced';
            this.saveState();
            this.renderAll();
        }
    }

    // Modal Operations
    openContentModal(id = null) {
        document.getElementById('content-id').value = id || '';
        if (id) {
            const item = this.state.contentItems.find(c => c.id === id);
            if (item) {
                document.getElementById('modal-content-title').innerText = 'Edit Content Item';
                document.getElementById('content-title-input').value = item.title;
                document.getElementById('content-platform-input').value = item.platform;
                document.getElementById('content-stage-input').value = item.stage;
                document.getElementById('content-reach-input').value = item.reach || '';
                document.getElementById('content-link-input').value = item.link || '';
                document.getElementById('content-notes-input').value = item.notes || '';
            }
        } else {
            document.getElementById('modal-content-title').innerText = 'Add Content Idea';
            this.formContent.reset();
        }
        this.modalContent.classList.add('active');
    }

    openCollabModal(id = null) {
        document.getElementById('collab-id').value = id || '';
        if (id) {
            const item = this.state.collabItems.find(c => c.id === id);
            if (item) {
                document.getElementById('modal-collab-title').innerText = 'Edit Brand Collab';
                document.getElementById('collab-brand-input').value = item.brand;
                document.getElementById('collab-handle-input').value = item.handle || '';
                document.getElementById('collab-stage-input').value = item.stage;
                document.getElementById('collab-rate-input').value = item.rate;
                document.getElementById('collab-deliverables-input').value = item.deliverables || '';
                document.getElementById('collab-payment-status-input').value = item.paymentStatus;
                document.getElementById('collab-due-date-input').value = item.dueDate || '';
                document.getElementById('collab-notes-input').value = item.notes || '';
            }
        } else {
            document.getElementById('modal-collab-title').innerText = 'Add Brand Collaboration';
            this.formCollab.reset();
        }
        this.modalCollab.classList.add('active');
    }

    handleContentSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('content-id').value;
        const newItem = {
            id: id || 'c-' + Date.now(),
            title: document.getElementById('content-title-input').value.trim(),
            platform: document.getElementById('content-platform-input').value,
            stage: document.getElementById('content-stage-input').value,
            reach: parseInt(document.getElementById('content-reach-input').value) || 0,
            link: document.getElementById('content-link-input').value.trim(),
            notes: document.getElementById('content-notes-input').value.trim(),
            createdAt: new Date().toISOString().slice(0,10)
        };

        if (id) {
            const idx = this.state.contentItems.findIndex(c => c.id === id);
            if (idx !== -1) this.state.contentItems[idx] = newItem;
        } else {
            this.state.contentItems.unshift(newItem);
        }

        this.saveState();
        closeModal('modal-content');
        this.renderAll();
    }

    handleCollabSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('collab-id').value;
        const newItem = {
            id: id || 'b-' + Date.now(),
            brand: document.getElementById('collab-brand-input').value.trim(),
            handle: document.getElementById('collab-handle-input').value.trim(),
            stage: document.getElementById('collab-stage-input').value,
            rate: parseFloat(document.getElementById('collab-rate-input').value) || 0,
            deliverables: document.getElementById('collab-deliverables-input').value.trim(),
            paymentStatus: document.getElementById('collab-payment-status-input').value,
            dueDate: document.getElementById('collab-due-date-input').value,
            notes: document.getElementById('collab-notes-input').value.trim(),
            createdAt: new Date().toISOString().slice(0,10)
        };

        if (id) {
            const idx = this.state.collabItems.findIndex(c => c.id === id);
            if (idx !== -1) this.state.collabItems[idx] = newItem;
        } else {
            this.state.collabItems.unshift(newItem);
        }

        this.saveState();
        closeModal('modal-collab');
        this.renderAll();
    }

    deleteContentItem(id) {
        if (confirm('Delete this content item?')) {
            this.state.contentItems = this.state.contentItems.filter(c => c.id !== id);
            this.saveState();
            this.renderAll();
        }
    }

    deleteCollabItem(id) {
        if (confirm('Delete this brand collaboration?')) {
            this.state.collabItems = this.state.collabItems.filter(c => c.id !== id);
            this.saveState();
            this.renderAll();
        }
    }

    // Helper utilities
    getPlatformIcon(platform) {
        if (platform === 'Instagram') return '<i class="fa-brands fa-instagram text-pink"></i>';
        if (platform === 'YouTube') return '<i class="fa-brands fa-youtube" style="color:#EF4444"></i>';
        if (platform === 'TikTok') return '<i class="fa-brands fa-tiktok text-cyan"></i>';
        return '<i class="fa-solid fa-video"></i>';
    }

    getContentStageClass(stage) {
        return stage.toLowerCase();
    }

    getCollabStageClass(stage) {
        if (stage === 'DM Inquiry') return 'inquiry';
        if (stage === 'Quote Given') return 'quote';
        if (stage === 'Deal Agreed') return 'agreed';
        if (stage === 'Content Shot') return 'shot';
        if (stage === 'Invoiced') return 'invoiced';
        if (stage === 'Paid') return 'paid';
        return 'inquiry';
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
}

// Global modal close function
function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
}

// Global switchTab helper for onclick handlers
function switchTab(tabId) {
    if (window.app) window.app.switchTab(tabId);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CreatorPulseApp();
});
