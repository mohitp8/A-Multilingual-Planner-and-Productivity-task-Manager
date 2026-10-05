// Additional Helper Functions for Hitmo's Planner

// Compatibility helpers. Authentication is handled centrally by auth.js/app.js.
async function checkAuth() {
    return await authManager.isAuthenticated();
}

// Language Menu Toggle
function toggleLanguageMenu() {
    document.getElementById('languageMenu')?.classList.toggle('hidden');
}

function closeLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
    }
}

function changeLanguage(lang) {
    if (typeof i18n !== 'undefined') {
        i18n.setLanguage(lang);
        closeLanguageMenu();
        const langNames = { en: 'English', hi: 'हिन्दी', mr: 'मराठी', es: 'Español', fr: 'Français', pt: 'Português' };
        showNotification(`${i18n.t('languageChanged')} ${langNames[lang] || lang}`, 'info', i18n.t('language'));
        const select = document.getElementById('pageLanguage'); if (select) select.value = lang;
    }
}

// Update UI Translations
function updateUITranslations() {
    if (typeof i18n === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18n.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = i18n.t(key);
    });
}

// User menu is rendered by app.js from the authenticated user.
function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.add('hidden');
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('hidden');
}

// Notification wrapper (for toast system)
function showNotification(message, type = 'info', title = 'Hitmo Planner') {
    if (typeof notificationSystem !== 'undefined' && notificationSystem.send) {
        notificationSystem.send(type, message, title, { sound: false });
    }
}

// Voice Input Recording Styles
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    #voiceMicButton.recording,
    #assistantVoiceButton.recording {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        color: white !important;
        animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }
    .notification-toast {
        animation: slideInRight 0.3s ease-out;
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(400px); }
        to { opacity: 1; transform: translateX(0); }
    }
    /* Task detail panel transitions */
    #taskDetailPanel {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
`;
document.head.appendChild(voiceStyles);

// Export tasks as CSV (with tags & pomodoros)
function exportTasksCSV() {
    const headers = ['Title', 'Description', 'Priority', 'Category', 'Status', 'Deadline', 'Completed', 'Tags', 'Pomodoros'].join(',');
    const rows = AppState.tasks.map(t => {
        return [
            `"${(t.title || '').replace(/"/g, '""')}"`,
            `"${(t.description || '').replace(/"/g, '""')}"`,
            t.priority,
            t.category,
            t.status,
            t.deadline || '',
            t.completed ? 'Yes' : 'No',
            `"${(t.tags || '').replace(/"/g, '""')}"`,
            t.pomodoroCount || 0
        ].join(',');
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hitmo-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showNotification('Tasks exported successfully', 'info', 'Export');
}

console.log("Hitmo's Planner - Optimized Edition Loaded");
