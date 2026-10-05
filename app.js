// TaskMaster Pro v3.0 - Frontend Application Core


// ==================== State Management ====================
const AppState = {
    tasks: [],
    currentCategory: 'ALL',
    currentPriority: 'ALL',
    searchQuery: '',
    currentView: 'board',
    draggedTaskId: null,
    calendarDate: new Date(),
    timerInterval: null,
    timerSeconds: 25 * 60,
    timerRunning: false,
    currentPomodoroTaskId: null,
    selectedTasks: new Set(),
    bulkMode: false,
    categoryChart: null,
    priorityChart: null,
    detailTaskId: null,
    sidebarOpen: false,
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth FIRST
    const isAuthenticated = await authManager.isAuthenticated();
    if (!isAuthenticated) {
        window.location.replace('/login.html');
        return;
    }

    // 2. Continue Init
    setupEventListeners();
    setupKeyboardShortcuts();
    renderAuthActions();
    await loadUserPreferences();
    initTheme();
    await loadTasks();

    if (typeof i18n !== 'undefined') i18n.applyLanguage();
    if (typeof quoteEngine !== 'undefined') quoteEngine.init();
    if (typeof hitmoAssistant !== 'undefined') hitmoAssistant.init();
    if (typeof notificationSystem !== 'undefined') notificationSystem.init();
    if (typeof suiiiSound !== 'undefined') suiiiSound.init();
    if (typeof voiceInput !== 'undefined' && voiceInput.isSupported()) {
        console.log('Voice input is supported');
    }
    if (window.lucide) lucide.createIcons();
});

// ==================== Event Listeners ====================
function setupEventListeners() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            AppState.searchQuery = e.target.value.toLowerCase();
            renderAllViews();
        }, 200));
    }

    window.addEventListener('languageChanged', () => {
        renderAllViews();
        renderAuthActions();
        updateUITranslations();
        try {
            if (typeof apiClient !== 'undefined' && typeof authManager !== 'undefined' && authManager.getUser()) {
                apiClient.request('/preferences', 'PUT', { language: i18n.getCurrentLanguage() }).catch(() => {});
            }
        } catch {}
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#languageMenu') && !e.target.closest('[onclick*="toggleLanguageMenu"]')) closeLanguageMenu();
        if (!e.target.closest('#userMenu') && !e.target.closest('[onclick*="toggleUserMenu"]')) closeUserMenu();
        if (AppState.detailTaskId && !e.target.closest('#taskDetailPanel') && !e.target.closest('.task-card')) {
            closeTaskDetail();
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const target = e.target;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch')?.focus();
        }
        if (e.key === 'Escape') {
            closeTaskModal();
            closeLanguageMenu();
            closeUserMenu();
            closeTaskDetail();
            closeTaskDetail();
            if (AppState.bulkMode) toggleBulkMode();
            if (AppState.sidebarOpen) toggleSidebar();
        }
        if (isInput) return;
        if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openTaskModal(); }
        if (e.key >= '1' && e.key <= '5') {
            const views = ['board', 'list', 'matrix', 'calendar', 'analytics'];
            switchView(views[parseInt(e.key) - 1]);
        }
        if (e.key === 'b' || e.key === 'B') { toggleBulkMode(); }
        if ((e.key === 'Delete' || e.key === 'Backspace') && AppState.bulkMode && AppState.selectedTasks.size > 0) {
            e.preventDefault();
            bulkDeleteSelected();
        }
    });
}

// ==================== Sidebar ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    AppState.sidebarOpen = !AppState.sidebarOpen;
    if (AppState.sidebarOpen) {
        sidebar?.classList.add('open');
        overlay?.classList.remove('hidden');
    } else {
        sidebar?.classList.remove('open');
        overlay?.classList.add('hidden');
    }
}

async function loadUserPreferences() {
    try {
        const prefs = await apiClient.request('/preferences');
        if (prefs?.language) localStorage.setItem('hitmo_lang', prefs.language);
        if (prefs?.theme) localStorage.setItem('theme', prefs.theme);
        if (typeof i18n !== 'undefined' && prefs?.language) i18n.setLanguage(prefs.language);
    } catch (err) {
        console.warn('Could not load user preferences:', err.message);
    }
}

// ==================== REST API Operations ====================
async function loadTasks() {
    try {
        const tasks = await apiClient.request('/tasks');
        if (tasks) {
            AppState.tasks = tasks;
            window.tasks = AppState.tasks;
            renderAllViews();
        }
    } catch (err) {
        console.error('Could not load tasks:', err);
        showNotification(err.message || 'Could not load tasks.', 'error', 'Tasks');
    }
}

async function saveTaskAPI(taskData, id = null) {
    if (window.sfx) sfx.playClick();
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/tasks/${id}` : '/tasks';
        const saved = await apiClient.request(url, method, taskData);
        if (saved) {
            if (id) {
                AppState.tasks = AppState.tasks.map(t => t.id === id ? saved : t);
            } else {
                AppState.tasks.push(saved);
            }
            window.tasks = AppState.tasks;
            renderAllViews();
            return saved;
        }
    } catch (err) {
        showNotification(err.message || 'Could not save task.', 'error', 'Tasks');
        throw err;
    }
}

async function deleteTaskAPI(id) {
    if (window.sfx) sfx.playClick();
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await apiClient.request(`/tasks/${id}`, 'DELETE');
        AppState.tasks = AppState.tasks.filter(t => t.id !== id);
    } catch (e) {
        showNotification(e.message || 'Could not delete task.', 'error', 'Tasks');
        return;
    }
    window.tasks = AppState.tasks;
    if (AppState.detailTaskId === id) closeTaskDetail();
    renderAllViews();
}

async function toggleTaskCompleteAPI(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    task.status = task.completed ? 'COMPLETED' : 'TODO';
    if (task.completed) {
        if (window.sfx) sfx.playComplete();
        if (typeof confetti !== 'undefined') confetti({ particleCount: 80, spread: 60, origin: { y: 0.85 } });
    } else { if (window.sfx) sfx.playClick(); }
    try {
        const saved = await apiClient.request(`/tasks/${id}`, 'PUT', task);
        Object.assign(task, saved);
    } catch (e) {
        task.completed = !task.completed;
        task.status = task.completed ? 'COMPLETED' : 'TODO';
        showNotification(e.message || 'Could not update task.', 'error', 'Tasks');
    }
    renderAllViews();
}

async function updateTaskStatusAPI(id, newStatus) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    task.status = newStatus;
    task.completed = (newStatus === 'COMPLETED');
    if (task.completed) {
        if (window.sfx) sfx.playComplete();
        if (typeof confetti !== 'undefined') confetti({ particleCount: 50, spread: 50 });
    } else { if (window.sfx) sfx.playClick(); }
    try {
        const saved = await apiClient.request(`/tasks/${id}`, 'PUT', task);
        Object.assign(task, saved);
    } catch (e) {
        showNotification(e.message || 'Could not update task.', 'error', 'Tasks');
    }
    renderAllViews();
}

// ==================== Bulk Operations ====================
function toggleBulkMode() {
    AppState.bulkMode = !AppState.bulkMode;
    AppState.selectedTasks.clear();
    updateBulkUI();
    renderAllViews();
}

function toggleTaskSelection(id, event) {
    if (!AppState.bulkMode) return;
    event?.stopPropagation();
    if (AppState.selectedTasks.has(id)) AppState.selectedTasks.delete(id);
    else AppState.selectedTasks.add(id);
    updateBulkUI();
    renderAllViews();
}

function selectAllTasks() {
    const filtered = getFilteredTasks();
    if (AppState.selectedTasks.size === filtered.length) AppState.selectedTasks.clear();
    else filtered.forEach(t => AppState.selectedTasks.add(t.id));
    updateBulkUI();
    renderAllViews();
}

function updateBulkUI() {
    let bulkBar = document.getElementById('bulkActionsBar');
    if (AppState.bulkMode) {
        if (!bulkBar) {
            bulkBar = document.createElement('div');
            bulkBar.id = 'bulkActionsBar';
            bulkBar.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-elevated rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4 animate-slideUp';
            bulkBar.innerHTML = `
                <button onclick="selectAllTasks()" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors" data-i18n="selectAll">Select All</button>
                <span id="bulkSelectedCount" class="text-xs font-mono text-slate-400">0 selected</span>
                <button onclick="bulkCompleteSelected()" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" data-i18n="completeSelected">Complete</button>
                <button onclick="bulkDeleteSelected()" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors" data-i18n="deleteSelected">${i18n?.t('delete') || 'Delete'}</button>
                <button onclick="toggleBulkMode()" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-colors" data-i18n="cancel">Cancel (Esc)</button>
            `;
            document.body.appendChild(bulkBar);
            if (window.lucide) lucide.createIcons();
        }
        bulkBar.classList.remove('hidden');
        document.getElementById('bulkSelectedCount').textContent = `${AppState.selectedTasks.size} ${i18n?.t('selected') || 'selected'}`;
    } else {
        if (bulkBar) bulkBar.classList.add('hidden');
    }
}

async function bulkDeleteSelected() {
    if (AppState.selectedTasks.size === 0) return;
    if (!confirm(i18n?.t('deleteTasksConfirm') || `Delete ${AppState.selectedTasks.size} tasks?`)) return;
    const ids = [...AppState.selectedTasks];
    for (const id of ids) {
        try { await apiClient.request(`/tasks/${id}`, 'DELETE'); } catch (e) { showNotification(e.message || 'Could not delete task.', 'error', 'Tasks'); }
    }
    AppState.tasks = AppState.tasks.filter(t => !AppState.selectedTasks.has(t.id));
    AppState.selectedTasks.clear();
    updateBulkUI();
    renderAllViews();
}

async function bulkCompleteSelected() {
    for (const id of AppState.selectedTasks) {
        const task = AppState.tasks.find(t => t.id === id);
        if (task && !task.completed) await toggleTaskCompleteAPI(id);
    }
    AppState.selectedTasks.clear();
    toggleBulkMode();
}

// ==================== Rendering System ====================
function renderAllViews() {
    updateMetrics();
    renderKanban();
    renderTable();
    renderMatrix();
    renderCalendar();
    renderAnalytics();
    if (window.lucide) lucide.createIcons();
}

function getFilteredTasks() {
    return AppState.tasks.filter(task => {
        const matchesCategory = AppState.currentCategory === 'ALL' || task.category === AppState.currentCategory;
        const matchesPriority = AppState.currentPriority === 'ALL' || task.priority === AppState.currentPriority;
        const matchesSearch = !AppState.searchQuery ||
            (task.title && task.title.toLowerCase().includes(AppState.searchQuery)) ||
            (task.description && task.description.toLowerCase().includes(AppState.searchQuery)) ||
            (task.tags && task.tags.toLowerCase().includes(AppState.searchQuery));
        return matchesCategory && matchesPriority && matchesSearch;
    });
}

// ==================== Metrics ====================
function updateMetrics() {
    const total = AppState.tasks.length;
    const completed = AppState.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = AppState.tasks.filter(t => isOverdue(t)).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const el = (id) => document.getElementById(id);
    const setText = (id, val) => { const e = el(id); if (e) e.innerText = val; };
    const setStyle = (id, prop, val) => { const e = el(id); if (e) e.style[prop] = val; };

    setText('statTotal', total);
    setText('statCompleted', completed);
    setText('statPending', pending);
    setText('statOverdue', overdue);
    setText('rateLabel', `${rate}%`);
    setStyle('progressBar', 'width', `${rate}%`);
    setText('doneCountText', completed);
    setText('totalCountText', total);
    setText('scoreValue', `${rate}%`);

    const totalPomodoros = AppState.tasks.reduce((sum, t) => sum + (t.pomodoroCount || 0), 0);
    setText('totalPomoValue', totalPomodoros);
    setText('boardCount', total);
    setText('listCount', total);
}

// ==================== Kanban Board ====================
function renderKanban() {
    const filtered = getFilteredTasks();
    const cols = {
        'TODO': document.getElementById('drop-TODO'),
        'IN_PROGRESS': document.getElementById('drop-IN_PROGRESS'),
        'COMPLETED': document.getElementById('drop-COMPLETED')
    };
    Object.keys(cols).forEach(k => { if (cols[k]) cols[k].innerHTML = ''; });
    const counts = { 'TODO': 0, 'IN_PROGRESS': 0, 'COMPLETED': 0 };

    filtered.forEach(task => {
        const status = task.status || (task.completed ? 'COMPLETED' : 'TODO');
        if (cols[status]) { counts[status]++; cols[status].appendChild(createTaskCard(task)); }
    });

    Object.keys(counts).forEach(k => { const el = document.getElementById(`colCount-${k}`); if (el) el.innerText = counts[k]; });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    const isSelected = AppState.selectedTasks.has(task.id);
    card.className = `task-card glass-card p-4 rounded-xl shadow-md hover:shadow-xl space-y-3 transition-all ${task.completed ? 'task-completed opacity-70' : ''} ${isSelected ? 'ring-2 ring-indigo-400' : ''}`;
    card.draggable = !AppState.bulkMode;
    card.id = `task-${task.id}`;
    card.classList.add(`priority-${(task.priority || 'medium').toLowerCase()}`);
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Task: ${task.title}`);

    card.addEventListener('dragstart', (e) => {
        if (AppState.bulkMode) { e.preventDefault(); return; }
        AppState.draggedTaskId = task.id;
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('click', (e) => {
        if (AppState.bulkMode) { toggleTaskSelection(task.id, e); return; }
        if (e.target.tagName === 'INPUT' || e.target.closest('button')) return;
        openTaskDetail(task.id);
    });

    const priorityBadge = getPriorityBadge(task.priority);
    const categoryBadge = getCategoryBadge(task.category);
    const overdue = isOverdue(task);

    card.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
                <input type="checkbox" ${task.completed ? 'checked' : ''} ${isSelected ? 'checked' : ''}
                    onchange="${AppState.bulkMode ? `toggleTaskSelection(${JSON.stringify(task.id)}, event)` : `toggleTaskCompleteAPI(${JSON.stringify(task.id)})`}"
                    class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                    aria-label="Mark task complete">
                <h4 class="task-title font-semibold text-xs text-slate-100">${escapeHtml(task.title)}</h4>
            </div>
            <div class="flex items-center gap-1">
                <button onclick="openPomodoroForTask(${JSON.stringify(task.id)})" title="Focus" aria-label="Start focus timer" class="p-1 hover:text-rose-400 text-slate-500 transition-colors">
                    <i data-lucide="flame" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="editTaskModal(${JSON.stringify(task.id)})" aria-label="Edit task" class="p-1 hover:text-cyan-400 text-slate-500 transition-colors">
                    <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="deleteTaskAPI(${JSON.stringify(task.id)})" aria-label="Delete task" class="p-1 hover:text-rose-400 text-slate-500 transition-colors">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
        ${task.description ? `<p class="text-[11px] text-slate-400 line-clamp-2">${escapeHtml(task.description)}</p>` : ''}
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/50">
            <div class="flex items-center gap-1.5">${categoryBadge} ${priorityBadge}</div>
            <div class="flex items-center gap-2">
                ${task.pomodoroCount > 0 ? `<span class="text-[10px] font-mono text-indigo-400 flex items-center gap-0.5"><i data-lucide="flame" class="w-3 h-3"></i>${task.pomodoroCount}</span>` : ''}
                ${task.deadline ? `<div class="flex items-center gap-1 text-[10px] ${overdue ? 'text-rose-400 font-bold' : 'text-slate-500'}"><i data-lucide="calendar" class="w-3 h-3"></i><span>${formatDate(task.deadline)}</span></div>` : ''}
            </div>
        </div>
    `;
    return card;
}

// ==================== Task Detail Panel ====================
function openTaskDetail(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    AppState.detailTaskId = id;
    let panel = document.getElementById('taskDetailPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'taskDetailPanel';
        panel.className = 'fixed inset-y-0 right-0 w-full sm:w-96 z-50 glass-elevated shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col';
        document.body.appendChild(panel);
    }
    const overdue = isOverdue(task);
    const tags = (task.tags || '').split(',').filter(t => t.trim());

    panel.innerHTML = `
        <div class="p-4 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-t-xl">
            <h3 class="text-sm font-bold text-white">${i18n?.t('taskDetails') || 'Task Details'}</h3>
            <button onclick="closeTaskDetail()" class="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white" aria-label="Close"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="flex-1 overflow-y-auto p-5 space-y-5">
            <div><h2 class="text-base font-bold text-white font-display">${escapeHtml(task.title)}</h2>
                <div class="flex items-center gap-2 mt-2">${getPriorityBadge(task.priority)} ${getCategoryBadge(task.category)}<span class="text-[10px] font-mono px-2 py-0.5 rounded ${task.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}">${task.status || 'TODO'}</span></div>
            </div>
            ${task.description ? `<div><label class="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">${i18n?.t('descriptionLabel') || 'Description'}</label><p class="text-xs text-slate-400 leading-relaxed">${escapeHtml(task.description)}</p></div>` : ''}
            <div class="grid grid-cols-2 gap-3">
                <div class="glass-card p-3 rounded-lg"><label class="text-[10px] font-mono text-slate-500 block mb-0.5">${i18n?.t('deadline') || 'Deadline'}</label><p class="text-xs font-semibold ${overdue ? 'text-rose-400' : 'text-slate-300'}">${task.deadline ? formatDate(task.deadline) : 'No deadline'}</p></div>
                <div class="glass-card p-3 rounded-lg"><label class="text-[10px] font-mono text-slate-500 block mb-0.5">${i18n?.t('focusSessions') || 'Focus Sessions'}</label><p class="text-xs font-semibold text-indigo-400">${task.pomodoroCount || 0} pomodoros</p></div>
            </div>
            ${tags.length > 0 ? `<div><label class="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">${i18n?.t('tagsLabel') || 'Tags'}</label><div class="flex flex-wrap gap-1.5">${tags.map(t => `<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">${escapeHtml(t.trim())}</span>`).join('')}</div></div>` : ''}
            <div class="glass-card p-3 rounded-lg"><label class="text-[10px] font-mono text-slate-500 block mb-1">${i18n?.t('createdLabel') || 'Created'}</label><p class="text-[11px] text-slate-500">Task #${task.id}</p></div>
        </div>
        <div class="p-4 border-t border-slate-700/50 flex items-center gap-2">
            <button onclick="editTaskModal(${JSON.stringify(task.id)}); closeTaskDetail();" class="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 transition-all">${i18n?.t('editTaskButton') || 'Edit Task'}</button>
            <button onclick="deleteTaskAPI(${JSON.stringify(task.id)})" class="px-3 py-2 rounded-lg border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-colors">${i18n?.t('delete') || 'Delete'}</button>
        </div>
    `;
    requestAnimationFrame(() => { panel.style.transform = 'translateX(0)'; });
    if (window.lucide) lucide.createIcons();
}

function closeTaskDetail() {
    AppState.detailTaskId = null;
    const panel = document.getElementById('taskDetailPanel');
    if (panel) { panel.style.transform = 'translateX(100%)'; setTimeout(() => panel.remove(), 300); }
}

// ==================== Drag & Drop ====================
function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function handleDrop(e, targetStatus) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (AppState.draggedTaskId) { updateTaskStatusAPI(AppState.draggedTaskId, targetStatus); AppState.draggedTaskId = null; }
}

// ==================== Table View ====================
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;
    const filtered = getFilteredTasks();
    tbody.innerHTML = '';
    const el = document.getElementById('tableResultsCount');
    if (el) el.innerText = `${filtered.length} ${i18n?.t('tasks') || 'tasks'}`;

    filtered.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-800/50 transition-colors ${task.completed ? 'opacity-50' : ''}`;
        const overdue = isOverdue(task);

        tr.innerHTML = `
            <td class="p-4 text-center"><input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompleteAPI(${JSON.stringify(task.id)})" class="w-4 h-4 rounded accent-emerald-500 cursor-pointer"></td>
            <td class="p-4"><div class="font-bold text-white ${task.completed ? 'line-through' : ''} cursor-pointer hover:text-indigo-400 transition-colors" onclick="openTaskDetail(${JSON.stringify(task.id)})">${escapeHtml(task.title)}</div>${task.description ? `<div class="text-[10px] text-slate-500 truncate max-w-xs">${escapeHtml(task.description)}</div>` : ''}</td>
            <td class="p-4">${getCategoryBadge(task.category)}</td>
            <td class="p-4">${getPriorityBadge(task.priority)}</td>
            <td class="p-4 font-mono text-[11px] ${overdue ? 'text-rose-400 font-bold' : 'text-slate-500'}">${task.deadline ? formatDate(task.deadline) : '-'}</td>
            <td class="p-4"><span class="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400"><i data-lucide="flame" class="w-3 h-3"></i> ${task.pomodoroCount || 0}</span></td>
            <td class="p-4 text-right"><div class="flex items-center justify-end gap-2">
                <button onclick="editTaskModal(${JSON.stringify(task.id)})" class="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-cyan-400 transition-colors" aria-label="Edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                <button onclick="deleteTaskAPI(${JSON.stringify(task.id)})" class="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-rose-400 transition-colors" aria-label="Delete"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
            </div></td>
        `;
        tbody.appendChild(tr);
    });
}

// ==================== Eisenhower Matrix ====================
function renderMatrix() {
    const containers = { q1: { el: document.getElementById('matrix-q1'), count: 0 }, q2: { el: document.getElementById('matrix-q2'), count: 0 }, q3: { el: document.getElementById('matrix-q3'), count: 0 }, q4: { el: document.getElementById('matrix-q4'), count: 0 } };
    Object.values(containers).forEach(c => { if (c.el) c.el.innerHTML = ''; });

    AppState.tasks.filter(t => !t.completed).forEach(task => {
        const item = document.createElement('div');
        item.className = 'p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs cursor-pointer hover:border-indigo-500/30 hover:bg-slate-800 transition-all';
        item.onclick = () => openTaskDetail(task.id);
        item.setAttribute('role', 'listitem');
        item.innerHTML = `
            <span class="font-medium truncate mr-3 text-slate-200">${escapeHtml(task.title)}</span>
            <button onclick="event.stopPropagation(); toggleTaskCompleteAPI(${JSON.stringify(task.id)})" class="shrink-0 text-emerald-400 hover:text-emerald-300 text-[10px] px-2 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">${i18n?.t('done') || 'Done'}</button>
        `;
        let quadrant;
        if (task.priority === 'URGENT') quadrant = 'q1';
        else if (task.priority === 'HIGH') quadrant = 'q2';
        else if (task.priority === 'MEDIUM') quadrant = 'q3';
        else quadrant = 'q4';
        if (containers[quadrant].el) { containers[quadrant].el.appendChild(item); containers[quadrant].count++; }
    });

    Object.entries(containers).forEach(([key, val]) => { const el = document.getElementById(`matrix-${key}-count`); if (el) el.innerText = val.count; });
}

// ==================== Calendar ====================
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('calendarMonthYear');
    if (!grid) return;
    grid.innerHTML = '';

    const year = AppState.calendarDate.getFullYear();
    const month = AppState.calendarDate.getMonth();
    const locale = ({en:'en-US',hi:'hi-IN',mr:'mr-IN',es:'es-ES',fr:'fr-FR',pt:'pt-BR'}[i18n?.getCurrentLanguage?.()] || 'en-US');
    const monthNames = Array.from({length:12},(_,m)=>new Intl.DateTimeFormat(locale,{month:'long'}).format(new Date(2020,m,1)));
    if (monthYear) monthYear.innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) { const cell = document.createElement('div'); cell.className = 'p-2 min-h-[80px] bg-slate-800/30 rounded-xl'; grid.appendChild(cell); }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTasks = AppState.tasks.filter(t => t.deadline === dateStr);
        const today = isToday(year, month, day);

        const cell = document.createElement('div');
        cell.className = `p-2 min-h-[80px] rounded-xl flex flex-col justify-between cursor-pointer transition-all border ${today ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-slate-800/30 border-slate-700/30 hover:border-indigo-500/30 hover:bg-slate-800/50'}`;
        cell.innerHTML = `
            <div class="flex justify-between items-center text-xs font-bold ${today ? 'text-indigo-400' : 'text-slate-500'}"><span>${day}</span>${dayTasks.length > 0 ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>' : ''}</div>
            <div class="space-y-1 mt-1">${dayTasks.map(t => `<div class="text-[9px] truncate px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold cursor-pointer hover:bg-indigo-500/20" onclick="openTaskDetail(${JSON.stringify(t.id)})" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>`).join('')}</div>
        `;
        grid.appendChild(cell);
    }
}

function changeMonth(delta) { AppState.calendarDate.setMonth(AppState.calendarDate.getMonth() + delta); renderCalendar(); }
function isToday(y, m, d) { const today = new Date(); return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d; }

// ==================== Analytics ====================
function renderAnalytics() {
    const categories = ['WORK', 'STUDY', 'PERSONAL', 'FINANCE', 'HEALTH', 'SHOPPING', 'OTHER'];
    const catCounts = categories.map(cat => AppState.tasks.filter(t => t.category === cat).length);
    const priorities = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    const priCounts = priorities.map(pri => AppState.tasks.filter(t => t.priority === pri).length);

    const catCtx = document.getElementById('categoryChart')?.getContext('2d');
    const priCtx = document.getElementById('priorityChart')?.getContext('2d');
    if (!catCtx || !priCtx) return;

    if (AppState.categoryChart) AppState.categoryChart.destroy();
    if (AppState.priorityChart) AppState.priorityChart.destroy();

    AppState.categoryChart = new Chart(catCtx, {
        type: 'doughnut',
        data: { labels: categories, datasets: [{ data: catCounts, backgroundColor: ['#6366f1', '#06b6d4', '#a855f7', '#f59e0b', '#10b981', '#ec4899', '#64748b'], borderWidth: 0, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, padding: 12, color: '#94a3b8' } } } }
    });

    AppState.priorityChart = new Chart(priCtx, {
        type: 'bar',
        data: { labels: priorities, datasets: [{ label: 'Tasks', data: priCounts, backgroundColor: ['#ef4444', '#f87171', '#fbbf24', '#34d399'], borderRadius: 8, borderSkipped: false }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 }, color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.06)' } }, x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } } } }
    });
}

// ==================== Pomodoro Timer ====================
function togglePomodoroWidget() { if (window.sfx) sfx.playClick(); document.getElementById('pomodoroModal')?.classList.toggle('hidden'); }
function openPomodoroForTask(id) {
    AppState.currentPomodoroTaskId = id;
    const task = AppState.tasks.find(t => t.id === id);
    const modeEl = document.getElementById('timerMode');
    if (task && modeEl) modeEl.innerText = `Focusing: ${task.title}`;
    document.getElementById('pomodoroModal')?.classList.remove('hidden');
    if (!AppState.timerRunning) toggleTimer();
}
function toggleTimer() {
    if (window.sfx) sfx.playClick();
    const btn = document.getElementById('timerToggleBtn');
    const badge = document.getElementById('pomoBadge');
    if (AppState.timerRunning) {
        clearInterval(AppState.timerInterval); AppState.timerRunning = false;
        if (btn) btn.innerText = i18n?.t('start') || 'Start'; if (badge) badge.classList.add('hidden');
    } else {
        AppState.timerRunning = true;
        if (btn) btn.innerText = i18n?.t('pause') || 'Pause'; if (badge) badge.classList.remove('hidden');
        AppState.timerInterval = setInterval(() => {
            if (AppState.timerSeconds > 0) { AppState.timerSeconds--; updateTimerDisplay(); }
            else {
                clearInterval(AppState.timerInterval); AppState.timerRunning = false;
                if (btn) btn.innerText = i18n?.t('start') || 'Start'; if (badge) badge.classList.add('hidden');
                if (window.sfx) sfx.playTimerBell();
                if (typeof notificationSystem !== 'undefined') notificationSystem.send('pomodoro', 'Pomodoro Complete!', 'Great focus session!', { sound: false });
                if (AppState.currentPomodoroTaskId) {
                    const task = AppState.tasks.find(t => t.id === AppState.currentPomodoroTaskId);
                    if (task) { task.pomodoroCount = (task.pomodoroCount || 0) + 1; saveTaskAPI({ pomodoroCount: task.pomodoroCount }, task.id).catch(() => {}); }
                }
                resetTimer(); renderAllViews();
            }
        }, 1000);
    }
}
function resetTimer() {
    clearInterval(AppState.timerInterval); AppState.timerRunning = false;
    AppState.timerSeconds = 25 * 60; const btn = document.getElementById('timerToggleBtn');
    if (btn) btn.innerText = i18n?.t('start') || 'Start'; document.getElementById('pomoBadge')?.classList.add('hidden'); updateTimerDisplay();
}
function updateTimerDisplay() {
    const mins = Math.floor(AppState.timerSeconds / 60); const secs = AppState.timerSeconds % 60;
    const display = document.getElementById('timerDisplay');
    if (display) display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ==================== Modal Task Management ====================
function openTaskModal() {
    if (window.sfx) sfx.playClick();
    document.getElementById('modalTitle').innerText = i18n?.t('createTask') || 'Create Task';
    document.getElementById('taskForm').reset(); document.getElementById('taskId').value = '';
    document.getElementById('taskModal').classList.remove('hidden');
    document.getElementById('taskTitle').focus();
}
function editTaskModal(id) {
    if (window.sfx) sfx.playClick();
    const task = AppState.tasks.find(t => t.id === id); if (!task) return;
    document.getElementById('modalTitle').innerText = i18n?.t('editTask') || 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskDeadline').value = task.deadline || '';
    document.getElementById('taskTags').value = task.tags || '';
    document.getElementById('taskModal').classList.remove('hidden');
    document.getElementById('taskTitle').focus();
}
function closeTaskModal() { document.getElementById('taskModal')?.classList.add('hidden'); }
function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDesc').value,
        priority: document.getElementById('taskPriority').value,
        category: document.getElementById('taskCategory').value,
        deadline: document.getElementById('taskDeadline').value || null,
        tags: document.getElementById('taskTags').value,
        status: id ? (AppState.tasks.find(t => t.id == id)?.status || 'TODO') : 'TODO'
    };
    saveTaskAPI(taskData, id || null);
    closeTaskModal();
}

// ==================== Navigation & Filters ====================
function switchView(viewName) {
    if (window.sfx) sfx.playClick();
    AppState.currentView = viewName;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) { target.classList.remove('hidden'); target.classList.add('animate-fadeIn'); }
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-view') === viewName));
    if (viewName === 'analytics') renderAnalytics();
    if (viewName === 'calendar') renderCalendar();
    if (window.innerWidth <= 1024 && AppState.sidebarOpen) toggleSidebar();
}
function filterCategory(cat) {
    if (window.sfx) sfx.playClick();
    AppState.currentCategory = cat;
    document.querySelectorAll('.cat-filter').forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        btn.classList.toggle('active', btnCat === cat);
    });
    renderAllViews();
}
function filterPriority(pri) { AppState.currentPriority = pri; renderAllViews(); }

// ==================== Theme & Helpers ====================
function toggleTheme() {
    if (window.sfx) sfx.playClick();
    const html = document.documentElement;
    html.classList.toggle('dark');
    html.classList.toggle('light');
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    if (typeof apiClient !== 'undefined' && typeof authManager !== 'undefined' && authManager.getUser()) {
        apiClient.request('/preferences', 'PUT', { theme }).catch(() => {});
    }
}
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') { document.documentElement.classList.add('light'); document.documentElement.classList.remove('dark'); }
    else { document.documentElement.classList.add('dark'); document.documentElement.classList.remove('light'); }
}

function getPriorityBadge(p) {
    const map = { 'URGENT': `<span class="badge badge-urgent">${i18n?.t('urgent') || 'Urgent'}</span>`, 'HIGH': `<span class="badge badge-high">${i18n?.t('high') || 'High'}</span>`, 'MEDIUM': `<span class="badge badge-medium">${i18n?.t('medium') || 'Medium'}</span>`, 'LOW': `<span class="badge badge-low">${i18n?.t('low') || 'Low'}</span>` };
    return map[p] || map['MEDIUM'];
}
function getCategoryBadge(c) {
    const map = { 'WORK': `<span class="badge badge-work">${i18n?.t('work') || 'Work'}</span>`, 'STUDY': `<span class="badge badge-study">${i18n?.t('study') || 'Study'}</span>`, 'PERSONAL': `<span class="badge badge-personal">${i18n?.t('personal') || 'Personal'}</span>`, 'FINANCE': `<span class="badge badge-finance">${i18n?.t('finance') || 'Finance'}</span>`, 'HEALTH': `<span class="badge badge-health">${i18n?.t('health') || 'Health'}</span>`, 'SHOPPING': `<span class="badge badge-personal">${i18n?.t('shopping') || 'Shopping'}</span>` };
    return map[c] || `<span class="badge" style="background:rgba(100,116,139,0.1);color:#94a3b8;border-color:rgba(100,116,139,0.15)">${i18n?.t('other') || 'Other'}</span>`;
}
function isOverdue(task) { if (task.completed || !task.deadline) return false; return new Date(task.deadline) < new Date(new Date().toDateString()); }
function formatDate(dStr) { const d = new Date(dStr + 'T00:00:00'); const locale = ({en:'en-US',hi:'hi-IN',mr:'mr-IN',es:'es-ES',fr:'fr-FR',pt:'pt-BR'}[i18n?.getCurrentLanguage?.()] || 'en-US'); return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }); }
function escapeHtml(text) { if (!text) return ''; const div = document.createElement('div'); div.appendChild(document.createTextNode(text)); return div.innerHTML; }

function exportTasksCSV() {
    if (window.sfx) sfx.playClick();
    const headers = ['Title,Description,Priority,Category,Status,Deadline,Tags,Pomodoros\n'];
    const rows = AppState.tasks.map(t => `"${(t.title||'').replace(/"/g,'""')}","${(t.description||'').replace(/"/g,'""')}","${t.priority}","${t.category}","${t.status}","${t.deadline||''}","${(t.tags||'').replace(/"/g,'""')}","${t.pomodoroCount||0}"`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `hitmo-tasks-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    if (typeof notificationSystem !== 'undefined') notificationSystem.send('export', 'Tasks Exported', 'CSV file downloaded successfully', { sound: false });
}

function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); }; }

// ==================== User UI ====================
function renderAuthActions() {
    const user = authManager.getUser();
    const container = document.getElementById('authActionsPlaceholder');
    container.innerHTML = '';

    if (user) {
        // Authenticated
        container.innerHTML = `
            <button onclick="openTaskModal()" class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all hover:scale-105" aria-label="Create new task">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span data-i18n="newTask">New Task</span>
            </button>
            <div class="relative">
                <button onclick="toggleUserMenu()" class="flex items-center gap-2 p-2 rounded-lg glass-card text-slate-400 hover:text-white transition-all hover:bg-slate-700/50">
                    <span class="text-xs font-semibold">Hi, ${user.name.split(' ')[0]} 👋</span>
                    <i data-lucide="chevron-down" class="w-3 h-3"></i>
                </button>
                <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 glass-elevated rounded-xl shadow-2xl py-2 z-50">
                    <div class="px-4 py-2 border-b border-slate-700/50">
                        <p class="text-xs font-bold text-white">${user.name}</p>
                        <p class="text-[10px] text-slate-400">${user.email}</p>
                    </div>
                    <a href="/profile.html" class="block w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800/50 transition-colors">${i18n?.t('profile') || 'Profile'}</a>
                    <a href="/settings.html" class="block w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800/50 transition-colors">${i18n?.t('settings') || 'Settings'}</a>
                    ${user.role === 'ADMIN' ? `<button onclick="window.location.href='/admin.html'" class="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800/50 transition-colors text-indigo-400">${i18n?.t('adminDashboard') || 'Admin Dashboard'}</button>` : ''}
                    <button onclick="authManager.logout()" class="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800/50 transition-colors text-rose-400">${i18n?.t('logout') || 'Logout'}</button>
                </div>
            </div>
        `;
    } else {
        // Not authenticated
        container.innerHTML = `
            <a href="login.html" class="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition-colors">${i18n?.t('login') || 'Login'}</a>
            <a href="register.html" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors">${i18n?.t('register') || 'Register'}</a>
        `;
    }
    if (window.lucide) lucide.createIcons();
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
}
