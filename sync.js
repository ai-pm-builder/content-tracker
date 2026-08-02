/**
 * CreatorPulse - Google Sheets & Notion Sync Module
 */

const SyncManager = {
    // Export Content Items to CSV for Notion or Google Sheets
    exportContentCSV(contentItems) {
        if (!contentItems || contentItems.length === 0) {
            alert('No content items available to export.');
            return;
        }

        const headers = ['ID', 'Title/Idea', 'Platform', 'Stage', 'Reach/Views', 'Post URL', 'Notes', 'Created Date'];
        const rows = contentItems.map(item => [
            item.id,
            `"${(item.title || '').replace(/"/g, '""')}"`,
            item.platform || 'Instagram',
            item.stage || 'Idea',
            item.reach || 0,
            `"${(item.link || '').replace(/"/g, '""')}"`,
            `"${(item.notes || '').replace(/"/g, '""')}"`,
            item.createdAt || ''
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        this.downloadFile(csvContent, 'CreatorPulse_Content_Stage.csv', 'text/csv');
    },

    // Export Collabs to CSV for Notion or Google Sheets with ₹ INR
    exportCollabsCSV(collabItems) {
        if (!collabItems || collabItems.length === 0) {
            alert('No collab items available to export.');
            return;
        }

        const headers = ['ID', 'Brand Name', 'IG Handle', 'Stage', 'Quoted Rate (INR)', 'Deliverables', 'Payment Status', 'Payment Due Date', 'Notes'];
        const rows = collabItems.map(item => [
            item.id,
            `"${(item.brand || '').replace(/"/g, '""')}"`,
            `"${(item.handle || '').replace(/"/g, '""')}"`,
            item.stage || 'DM Inquiry',
            item.rate || 0,
            `"${(item.deliverables || '').replace(/"/g, '""')}"`,
            item.paymentStatus || 'Unpaid',
            item.dueDate || '',
            `"${(item.notes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        this.downloadFile(csvContent, 'CreatorPulse_Brand_Collabs_INR.csv', 'text/csv');
    },

    // Save full JSON backup
    exportFullJSON(appState) {
        const jsonContent = JSON.stringify(appState, null, 2);
        this.downloadFile(jsonContent, `CreatorPulse_Backup_${new Date().toISOString().slice(0,10)}.json`, 'application/json');
    },

    // Send payload to Google Sheets Webhook / Apps Script URL
    async syncToGoogleSheets(scriptUrl, appState) {
        if (!scriptUrl) {
            alert('Please enter a valid Google Apps Script Webhook URL first.');
            return false;
        }

        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    currency: 'INR',
                    contentItems: appState.contentItems,
                    collabItems: appState.collabItems
                })
            });
            alert('Data synced to Google Sheets successfully!');
            return true;
        } catch (err) {
            console.error('Sheets Sync Error:', err);
            alert('Failed to connect to Google Apps Script. Check URL or network.');
            return false;
        }
    },

    // Helper to trigger file download in browser
    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.SyncManager = SyncManager;
