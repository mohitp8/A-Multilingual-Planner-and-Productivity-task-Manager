// Toast Notification System & Real-time Notifications for Hitmo Planner

class NotificationSystem {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.notifications = [];
        this.maxNotifications = 50;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
    }

    init() {
        this.startPolling();
        this.checkDeadlines();
    }

    connect() {
        // Notifications currently use local deadline polling. No second server is required.
        this.startPolling();
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            setTimeout(() => this.connect(), delay);
        } else {
            this.startPolling();
        }
    }

    sendAuth() {
        const user = window.authManager?.getUser?.();
        if (user?.id && this.ws && this.connected) {
            this.ws.send(JSON.stringify({ type: 'auth', userId: user.id }));
        }
    }

    startPolling() {
        setInterval(() => this.checkDeadlines(), 60000);
        setInterval(() => this.checkTaskUpdates(), 30000);
    }

    checkDeadlines() {
        const tasks = (typeof AppState !== 'undefined' && AppState.tasks) ? AppState.tasks : (window.tasks || []);
        if (!tasks || tasks.length === 0) return;

        const now = new Date();
        tasks.forEach(task => {
            if (task.completed || !task.deadline) return;

            const deadlineDate = new Date(task.deadline + 'T00:00:00');
            const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60);

            if (hoursUntilDeadline > 0 && hoursUntilDeadline <= 24) {
                const notificationKey = `deadline_${task.id}_${task.deadline}`;
                if (!this.hasShownNotification(notificationKey)) {
                    this.show({
                        type: 'deadline',
                        title: 'Deadline Approaching',
                        message: `"${task.title}" is due in ${Math.round(hoursUntilDeadline)} hours`,
                        priority: task.priority,
                        taskId: task.id,
                        sound: true
                    });
                    this.markNotificationShown(notificationKey);
                }
            }
        });
    }

    checkTaskUpdates() {}

    handleNotification(notification) {
        this.notifications.unshift(notification);
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }
        this.show(notification);
        this.updateBadge();
    }

    show(notification) {
        const { type = 'info', title = 'Hitmo Planner', message = '', sound = true } = notification;
        showToast(message, type, title);

        if (sound) {
            if (type === 'completed' && typeof suiiiSound !== 'undefined' && suiiiSound.playSuiiiEnhanced) {
                suiiiSound.playSuiiiEnhanced();
            } else if (typeof sfx !== 'undefined' && sfx.playClick) {
                sfx.playClick();
            }
        }
    }

    showToast(type, title, message, options = {}) {
        this.show({ type, title, message, ...options });
    }

    markNotificationShown(key) {
        const shown = JSON.parse(localStorage.getItem('hitmo_notifications_shown') || '{}');
        shown[key] = Date.now();
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        Object.keys(shown).forEach(k => {
            if (shown[k] < weekAgo) delete shown[k];
        });
        localStorage.setItem('hitmo_notifications_shown', JSON.stringify(shown));
    }

    hasShownNotification(key) {
        const shown = JSON.parse(localStorage.getItem('hitmo_notifications_shown') || '{}');
        const timestamp = shown[key];
        if (!timestamp) return false;
        const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
        return timestamp > dayAgo;
    }

    updateBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    send(type, title, message, options = {}) {
        this.show({
            type,
            title,
            message,
            timestamp: Date.now(),
            read: false,
            ...options
        });
    }

    clearAll() {
        this.notifications = [];
        this.updateBadge();
        const container = document.getElementById('toastContainer');
        if (container) container.innerHTML = '';
    }

    getAll() {
        return this.notifications;
    }
}

// Global instance
const notificationSystem = new NotificationSystem();

// Helper functions
function showNotification(message, type = 'info', title = 'Hitmo Planner') {
    notificationSystem.send(type, title, message, { sound: true });
}

function showToast(message, type = 'info', title = '') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed top-20 right-6 z-50 space-y-3 pointer-events-none flex flex-col items-end';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const iconMap = {
        success: 'check-circle',
        error: 'x-circle',
        info: 'info',
        warning: 'alert-circle',
        deadline: 'clock',
        completed: 'trophy',
        pomodoro: 'flame',
        export: 'download'
    };
    const borderMap = {
        success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200',
        completed: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200',
        error: 'border-rose-500/40 bg-rose-950/80 text-rose-200',
        warning: 'border-amber-500/40 bg-amber-950/80 text-amber-200',
        deadline: 'border-amber-500/40 bg-amber-950/80 text-amber-200',
        info: 'border-indigo-500/40 bg-slate-900/90 text-slate-200',
        pomodoro: 'border-cyan-500/40 bg-slate-900/90 text-cyan-200',
        export: 'border-cyan-500/40 bg-slate-900/90 text-cyan-200'
    };

    const iconColorMap = {
        success: 'text-emerald-400 bg-emerald-500/20',
        completed: 'text-emerald-400 bg-emerald-500/20',
        error: 'text-rose-400 bg-rose-500/20',
        warning: 'text-amber-400 bg-amber-500/20',
        deadline: 'text-amber-400 bg-amber-500/20',
        info: 'text-indigo-400 bg-indigo-500/20',
        pomodoro: 'text-cyan-400 bg-cyan-500/20',
        export: 'text-cyan-400 bg-cyan-500/20'
    };

    const styleClass = borderMap[type] || borderMap.info;
    const iconClass = iconColorMap[type] || iconColorMap.info;
    const iconName = iconMap[type] || 'bell';

    toast.className = `pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-x-12 opacity-0 max-w-sm w-full ${styleClass}`;
    toast.innerHTML = `
        <div class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0 pr-1">
            ${title ? `<h4 class="font-bold text-xs leading-tight mb-0.5">${title}</h4>` : ''}
            <p class="text-[11px] opacity-90 leading-snug break-words">${message}</p>
        </div>
        <button onclick="this.closest('.pointer-events-auto').remove()" class="shrink-0 text-slate-400 hover:text-white transition-colors p-0.5">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Trigger animation in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-12', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Auto-dismiss after 4.5s
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-12', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4500);
}
