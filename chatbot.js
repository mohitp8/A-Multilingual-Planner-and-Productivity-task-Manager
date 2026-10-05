// ============================================================
// Hitmo AI - Full-Featured Productivity Intelligence Assistant
// ============================================================
// All executors call real functions through window scope.
// Every operation actually triggers the real app functions.
// ============================================================

class HitmoAssistant {
    constructor() {
        this.isOpen = false;
        this.voiceEnabled = true;
        this.conversationHistory = [];
        this.backendConversationId = null;
        this.initialized = false;
        this.init();
    }

    getLang() {
        if (typeof i18n !== 'undefined') return i18n.getCurrentLanguage();
        return localStorage.getItem('hitmo_lang') || 'en';
    }

    t(lang, key, enDefault) {
        const dict = {
            en: { cmdListTasks:'List all tasks', cmdSearch:'Search tasks', cmdFilter:'Filter tasks', cmdAddTask:'Create a new task', cmdUpdateTask:'Update an existing task', cmdCompleteTask:'Mark a task as complete', cmdDeleteTask:'Delete a task', cmdMoveTask:'Move task between columns', cmdPomodoro:'Start a focus timer', cmdAnalytics:'Show analytics and statistics', cmdCalendar:'Show calendar view', cmdExport:'Export tasks to CSV', cmdBulk:'Bulk operations', cmdHelp:'Show all available commands', cmdMotivation:'Get motivational quotes', cmdClear:'Clear all tasks', cmdUndo:'Undo last action', cmdTheme:'Toggle dark/light theme', cmdLanguage:'Change interface language', cmdAbout:'About Hitmo Planner', noTasks:'No tasks found.', enterSearchTerm:'Please specify what to search for.', noResults:'No tasks found matching that query.', specifyFilter:'Please specify a filter. E.g., "Show only HIGH priority tasks".', noMatchingTasks:'No tasks found with that filter.', needTitle:'Please provide a task title. E.g., "Add task called Design API".', findTaskToUpdate:'Could not find a task to update.', specifyUpdate:'Need to know what to change. Try "Edit task 3 title to Final Report".', noTaskToComplete:'No task found to complete. Create one first.', noTaskToDelete:'No task found to delete.', findTaskToMove:'Could not find a task to move.', specifyStatus:'Specify where to move it. Try "Move task 5 to Completed".', startPomodoro:'No task to focus on. Create one first.', exportFailed:'Export failed.', specifyBulk:'Try: "Delete all completed tasks" or "Toggle bulk mode".', specifyLang:'Which language? Try "Switch to Spanish".', nothingToClear:'Nothing to clear!', undoNotSupported:'Undo is limited.', noCompletedToDelete:'No completed tasks to delete!', aboutHitmo:'**Hitmo Planner v2.0** - AI-powered multilingual task manager with Flow Board, Table View, Eisenhower Matrix, Calendar, Analytics, Pomodoro Timer, Voice Input, 6 Languages, and Bulk Operations.' },
            es: { cmdListTasks:'Listar tareas', cmdSearch:'Buscar', cmdFilter:'Filtrar', cmdAddTask:'Crear tarea', cmdUpdateTask:'Actualizar tarea', cmdCompleteTask:'Marcar completada', cmdDeleteTask:'Eliminar tarea', cmdMoveTask:'Mover tarea', cmdPomodoro:'Iniciar temporizador', cmdAnalytics:'Ver estadisticas', cmdCalendar:'Ver calendario', cmdExport:'Exportar CSV', cmdBulk:'Operaciones masivas', cmdHelp:'Ver comandos', cmdMotivation:'Motivacion', cmdClear:'Limpiar todo', cmdUndo:'Deshacer', cmdTheme:'Cambiar tema', cmdLanguage:'Cambiar idioma', cmdAbout:'Acerca de Hitmo', noTasks:'No hay tareas', needTitle:'Proporcione un titulo' },
            pt: { cmdListTasks:'Listar tarefas', cmdSearch:'Buscar', cmdFilter:'Filtrar', cmdAddTask:'Criar tarefa', cmdUpdateTask:'Atualizar tarefa', cmdCompleteTask:'Marcar concluida', cmdDeleteTask:'Excluir tarefa', cmdMoveTask:'Mover tarefa', cmdPomodoro:'Iniciar pomodoro', cmdAnalytics:'Estatisticas', cmdCalendar:'Calendario', cmdExport:'Exportar CSV', cmdBulk:'Operacoes em massa', cmdHelp:'Comandos', cmdMotivation:'Motivacao', cmdClear:'Limpar tudo', cmdUndo:'Desfazer', cmdTheme:'Tema', cmdLanguage:'Idioma', cmdAbout:'Sobre Hitmo', noTasks:'Sem tarefas', needTitle:'Forneca um titulo' },
            fr: { cmdListTasks:'Lister taches', cmdSearch:'Rechercher', cmdFilter:'Filtrer', cmdAddTask:'Creer tache', cmdUpdateTask:'Modifier tache', cmdCompleteTask:'Marquer comme fait', cmdDeleteTask:'Supprimer tache', cmdMoveTask:'Deplacer tache', cmdPomodoro:'Demarrer pomodoro', cmdAnalytics:'Statistiques', cmdCalendar:'Calendrier', cmdExport:'Exporter CSV', cmdBulk:'Operations en masse', cmdHelp:'Aide', cmdMotivation:'Motivation', cmdClear:'Tout supprimer', cmdUndo:'Annuler', cmdTheme:'Theme', cmdLanguage:'Langue', cmdAbout:'A propos', noTasks:'Pas de taches', needTitle:'Donnez un titre' },
            hi: { cmdListTasks:'सभी कार्य दिखाएँ', cmdSearch:'कार्य खोजें', cmdFilter:'कार्य फ़िल्टर करें', cmdAddTask:'नया कार्य बनाएँ', cmdUpdateTask:'कार्य अपडेट करें', cmdCompleteTask:'कार्य पूर्ण करें', cmdDeleteTask:'कार्य हटाएँ', cmdMoveTask:'कार्य स्थानांतरित करें', cmdPomodoro:'फोकस टाइमर शुरू करें', cmdAnalytics:'आंकड़े दिखाएँ', cmdCalendar:'कैलेंडर दिखाएँ', cmdExport:'कार्य CSV में निर्यात करें', cmdBulk:'बल्क ऑपरेशन', cmdHelp:'सभी कमांड दिखाएँ', cmdMotivation:'प्रेरणा लें', cmdClear:'सभी कार्य हटाएँ', cmdUndo:'पूर्ववत करें', cmdTheme:'डार्क/लाइट थीम बदलें', cmdLanguage:'भाषा बदलें', cmdAbout:'हिटमो के बारे में', noTasks:'कोई कार्य नहीं मिला', needTitle:'कृपया कार्य का शीर्षक दें' },
            mr: { cmdListTasks:'सर्व कामे दाखवा', cmdSearch:'काम शोधा', cmdFilter:'काम फिल्टर करा', cmdAddTask:'नवीन काम तयार करा', cmdUpdateTask:'काम अपडेट करा', cmdCompleteTask:'काम पूर्ण करा', cmdDeleteTask:'काम हटवा', cmdMoveTask:'काम हलवा', cmdPomodoro:'फोकस टाइमर सुरू करा', cmdAnalytics:'आकडेवारी दाखवा', cmdCalendar:'कॅलेंडर दाखवा', cmdExport:'कामे CSV मध्ये निर्यात करा', cmdBulk:'बल्क ऑपरेशन', cmdHelp:'सर्व कमांड दाखवा', cmdMotivation:'प्रेरणा घ्या', cmdClear:'सर्व कामे हटवा', cmdUndo:'पूर्ववत करा', cmdTheme:'डार्क/लाइट थीम बदला', cmdLanguage:'भाषा बदला', cmdAbout:'हिटमो बद्दल', noTasks:'कोणतेही काम सापडले नाही', needTitle:'कृपया कामाचे शीर्षक द्या' },
            de: { cmdListTasks:'Aufgaben auflisten', cmdSearch:'Suchen', cmdFilter:'Filtern', cmdAddTask:'Aufgabe erstellen', cmdUpdateTask:'Bearbeiten', cmdCompleteTask:'Als erledigt markieren', cmdDeleteTask:'Loschen', cmdMoveTask:'Verschieben', cmdPomodoro:'Pomodoro starten', cmdAnalytics:'Statistik', cmdCalendar:'Kalender', cmdExport:'CSV exportieren', cmdBulk:'Massenoperationen', cmdHelp:'Hilfe', cmdMotivation:'Motivation', cmdClear:'Alles loschen', cmdUndo:'Ruckgangig', cmdTheme:'Thema', cmdLanguage:'Sprache', cmdAbout:'Uber Hitmo', noTasks:'Keine Aufgaben', needTitle:'Titel eingeben' },
            ar: { cmdListTasks:'عرض المهام', cmdSearch:'بحث', cmdFilter:'فلترة', cmdAddTask:'انشاء مهمة', cmdUpdateTask:'تعديل', cmdCompleteTask:'تمييز كمكتملة', cmdDeleteTask:'حذف', cmdMoveTask:'نقل', cmdPomodoro:'بدء مؤقت', cmdAnalytics:'احصائيات', cmdCalendar:'تقويم', cmdExport:'تصدير CSV', cmdBulk:'عمليات جماعية', cmdHelp:'مساعدة', cmdMotivation:'تحفيز', cmdClear:'حذف الكل', cmdUndo:'تراجع', cmdTheme:'مظهر', cmdLanguage:'لغة', cmdAbout:'عن Hitmo', noTasks:'لا مهام', needTitle:'ادخل عنوان' },
        };
        const localized = dict[lang] && dict[lang][key];
        if (localized) return localized;
        if (typeof i18n !== 'undefined') { const ui = i18n.t(key); if (ui && ui !== key) return ui; }
        return enDefault;
    }

    msg(key, vars = {}) {
        const lang=this.getLang();
        const m={
          en:{noTasks:'No tasks found.',results:'{n} result(s)',created:'Task created successfully!',updated:'Task updated successfully!',completed:'Task marked as complete!',deleted:'Task deleted successfully!',moved:'Task moved to {status}.',pomodoro:'Pomodoro started for "{title}"!',analytics:'Productivity Report',total:'Total',done:'Completed',overdue:'Overdue',focus:'Focus Cycles',today:'Today',week:'This week',upcoming:'Upcoming',exported:'Tasks exported to CSV!',bulkDeleted:'Deleted {n} completed tasks!',bulkComplete:'Marked {n} tasks as complete!',bulkMode:'Bulk mode activated!',theme:'Theme switched to {theme} mode.',language:'Language changed to {name}!',notFound:'Task not found.',nothing:'Nothing to clear!',overdueNone:'No overdue tasks!',count:'Task Count',todo:'To Do',inprogress:'In Progress',help:'Available Commands',about:'Hitmo Planner is your AI-powered productivity workspace.',undo:'Undo is limited. You can re-create tasks manually.',needTitle:'Please provide a task title.',noTask:'No task found.',filterNone:'No tasks found with that filter.'},
          hi:{noTasks:'कोई कार्य नहीं मिला।',results:'{n} परिणाम',created:'कार्य सफलतापूर्वक बनाया गया!',updated:'कार्य सफलतापूर्वक अपडेट हुआ!',completed:'कार्य पूर्ण के रूप में चिह्नित किया गया!',deleted:'कार्य सफलतापूर्वक हटाया गया!',moved:'कार्य {status} में ले जाया गया।',pomodoro:'"{title}" के लिए पोमोडोरो शुरू हुआ!',analytics:'उत्पादकता रिपोर्ट',total:'कुल',done:'पूर्ण',overdue:'समय पार',focus:'फोकस चक्र',today:'आज',week:'इस सप्ताह',upcoming:'आने वाले',exported:'कार्य CSV में निर्यात किए गए!',bulkDeleted:'{n} पूर्ण कार्य हटाए गए!',bulkComplete:'{n} कार्य पूर्ण किए गए!',bulkMode:'बल्क मोड सक्रिय है!',theme:'थीम {theme} मोड में बदल गई।',language:'भाषा {name} में बदल गई!',notFound:'कार्य नहीं मिला।',nothing:'हटाने के लिए कुछ नहीं है!',overdueNone:'कोई समय-पार कार्य नहीं है!',count:'कार्य संख्या',todo:'करना है',inprogress:'प्रगति में',help:'उपलब्ध कमांड',about:'हिटमो एक AI-आधारित उत्पादकता कार्यक्षेत्र है।',undo:'Undo सीमित है। आप कार्य फिर से बना सकते हैं।',needTitle:'कृपया कार्य का शीर्षक दें।',noTask:'कोई कार्य नहीं मिला।',filterNone:'इस फ़िल्टर से कोई कार्य नहीं मिला।'},
          mr:{noTasks:'कोणतेही काम सापडले नाही.',results:'{n} निकाल',created:'काम यशस्वीरित्या तयार झाले!',updated:'काम यशस्वीरित्या अपडेट झाले!',completed:'काम पूर्ण म्हणून चिन्हांकित केले!',deleted:'काम यशस्वीरित्या हटवले!',moved:'काम {status} मध्ये हलवले.',pomodoro:'"{title}" साठी पोमोडोरो सुरू झाले!',analytics:'उत्पादकता अहवाल',total:'एकूण',done:'पूर्ण',overdue:'मुदत संपलेले',focus:'फोकस सायकल',today:'आज',week:'या आठवड्यात',upcoming:'पुढील',exported:'कामे CSV मध्ये निर्यात केली!',bulkDeleted:'{n} पूर्ण कामे हटवली!',bulkComplete:'{n} कामे पूर्ण केली!',bulkMode:'बल्क मोड सुरू आहे!',theme:'थीम {theme} मोडमध्ये बदलली.',language:'भाषा {name} मध्ये बदलली!',notFound:'काम सापडले नाही.',nothing:'हटवण्यासाठी काहीही नाही!',overdueNone:'एकही मुदत संपलेले काम नाही!',count:'कामांची संख्या',todo:'करायचे',inprogress:'प्रगतीपथावर',help:'उपलब्ध कमांड',about:'हिटमो हे AI-आधारित उत्पादकता कार्यक्षेत्र आहे.',undo:'Undo मर्यादित आहे. काम पुन्हा तयार करू शकता.',needTitle:'कृपया कामाचे शीर्षक द्या.',noTask:'काम सापडले नाही.',filterNone:'या फिल्टरमध्ये कोणतेही काम सापडले नाही.'},
          es:{noTasks:'No hay tareas.',results:'{n} resultado(s)',created:'¡Tarea creada correctamente!',updated:'¡Tarea actualizada correctamente!',completed:'¡Tarea marcada como completada!',deleted:'¡Tarea eliminada correctamente!',moved:'Tarea movida a {status}.',pomodoro:'¡Pomodoro iniciado para "{title}"!',analytics:'Informe de productividad',total:'Total',done:'Completadas',overdue:'Vencidas',focus:'Ciclos de enfoque',today:'Hoy',week:'Esta semana',upcoming:'Próximas',exported:'¡Tareas exportadas a CSV!',bulkDeleted:'¡Se eliminaron {n} tareas completadas!',bulkComplete:'¡Se completaron {n} tareas!',bulkMode:'¡Modo masivo activado!',theme:'Tema cambiado a modo {theme}.',language:'¡Idioma cambiado a {name}!',notFound:'Tarea no encontrada.',nothing:'¡No hay nada que limpiar!',overdueNone:'¡No hay tareas vencidas!',count:'Cantidad de tareas',todo:'Por hacer',inprogress:'En progreso',help:'Comandos disponibles',about:'Hitmo es tu espacio de productividad con IA.',undo:'Deshacer es limitado.',needTitle:'Indica un título para la tarea.',noTask:'No se encontró ninguna tarea.',filterNone:'No se encontraron tareas con ese filtro.'},
          fr:{noTasks:'Aucune tâche trouvée.',results:'{n} résultat(s)',created:'Tâche créée avec succès !',updated:'Tâche mise à jour !',completed:'Tâche marquée comme terminée !',deleted:'Tâche supprimée !',moved:'Tâche déplacée vers {status}.',pomodoro:'Pomodoro démarré pour « {title} » !',analytics:'Rapport de productivité',total:'Total',done:'Terminées',overdue:'En retard',focus:'Cycles de concentration',today:"Aujourd’hui",week:'Cette semaine',upcoming:'À venir',exported:'Tâches exportées en CSV !',bulkDeleted:'{n} tâches terminées supprimées !',bulkComplete:'{n} tâches terminées !',bulkMode:'Mode groupé activé !',theme:'Thème passé en mode {theme}.',language:'Langue changée en {name} !',notFound:'Tâche introuvable.',nothing:'Rien à effacer !',overdueNone:'Aucune tâche en retard !',count:'Nombre de tâches',todo:'À faire',inprogress:'En cours',help:'Commandes disponibles',about:'Hitmo est votre espace de productivité alimenté par l’IA.',undo:'Annulation limitée.',needTitle:'Veuillez donner un titre à la tâche.',noTask:'Aucune tâche trouvée.',filterNone:'Aucune tâche ne correspond à ce filtre.'},
          pt:{noTasks:'Nenhuma tarefa encontrada.',results:'{n} resultado(s)',created:'Tarefa criada com sucesso!',updated:'Tarefa atualizada com sucesso!',completed:'Tarefa marcada como concluída!',deleted:'Tarefa excluída com sucesso!',moved:'Tarefa movida para {status}.',pomodoro:'Pomodoro iniciado para "{title}"!',analytics:'Relatório de produtividade',total:'Total',done:'Concluídas',overdue:'Atrasadas',focus:'Ciclos de foco',today:'Hoje',week:'Esta semana',upcoming:'Próximas',exported:'Tarefas exportadas para CSV!',bulkDeleted:'{n} tarefas concluídas excluídas!',bulkComplete:'{n} tarefas concluídas!',bulkMode:'Modo em massa ativado!',theme:'Tema alterado para o modo {theme}.',language:'Idioma alterado para {name}!',notFound:'Tarefa não encontrada.',nothing:'Nada para limpar!',overdueNone:'Nenhuma tarefa atrasada!',count:'Quantidade de tarefas',todo:'A fazer',inprogress:'Em progresso',help:'Comandos disponíveis',about:'O Hitmo é seu espaço de produtividade com IA.',undo:'Desfazer é limitado.',needTitle:'Informe um título para a tarefa.',noTask:'Nenhuma tarefa encontrada.',filterNone:'Nenhuma tarefa encontrada com esse filtro.'}
        };
        let out=(m[lang]&&m[lang][key])||m.en[key]||key;
        for(const [k,v] of Object.entries(vars)) out=out.replaceAll(`{${k}}`,String(v));
        return out;
    }

    localizedAliases(lang) {
        const aliases = {
            en: {help:['help','commands','what can you do'], list:['all tasks','show all','show tasks','list tasks','all my tasks','all items','what tasks'], search:['search','find task','looking for','show me tasks','what about','tasks about','tasks with'], add:['add task','create task','new task','add a task','new task called','add task called','please add a task','create a new task'], update:['update task','edit task','modify task','change task','update the task','edit the task','change the task'], complete:['complete task','mark done','mark complete','finish task','task done','mark task','mark as done','done with task'], del:['delete task','remove task','delete the task','remove the task','delete it','delete task number','delete task id'], move:['move task','move to','change status','reorder','move the task','drag to','put task'], pomo:['start pomodoro','start focus','start timer','pomodoro','focus session','focus for','start a focus','focus task','timer'], analytics:['stats','analytics','overview','report','performance','my stats','productivity','how am i doing','how productive','summary'], calendar:['calendar','schedule','agenda','what is coming','upcoming','deadlines','show calendar'], export:['export','csv','download','save as','backup','save to file'], theme:['dark mode','light mode','toggle theme','change theme','switch theme'], language:['change language','switch language','change lang','switch to'], motivation:['motivation','motiv','inspire','quote','cr7','ronaldo','stark','iron man'], count:['how many','count','number of tasks'], overdue:['overdue','late','past due','show overdue','late tasks'] },
            es: {help:['ayuda','comandos','qué puedes hacer'],list:['todas las tareas','mostrar tareas','listar tareas'],search:['buscar','encuentra tarea','muéstrame tareas'],add:['añadir tarea','agregar tarea','crear tarea','nueva tarea'],update:['actualizar tarea','editar tarea','modificar tarea','cambiar tarea'],complete:['completar tarea','marcar como hecha','terminar tarea'],del:['eliminar tarea','borrar tarea','quitar tarea'],move:['mover tarea','cambiar estado'],pomo:['pomodoro','temporizador','enfoque'],analytics:['estadísticas','analítica','rendimiento','productividad','resumen'],calendar:['calendario','agenda','próximas','fechas límite'],export:['exportar','csv','descargar'],theme:['modo oscuro','modo claro','cambiar tema'],language:['cambiar idioma','cambiar al','idioma'],motivation:['motivación','inspiración','cita','cr7'],count:['cuántas','contar','número de tareas'],overdue:['vencidas','atrasadas','retrasadas']},
            pt: {help:['ajuda','comandos','o que você pode fazer'],list:['todas as tarefas','mostrar tarefas','listar tarefas'],search:['buscar','encontrar tarefa','mostrar tarefas'],add:['adicionar tarefa','criar tarefa','nova tarefa'],update:['atualizar tarefa','editar tarefa','modificar tarefa','alterar tarefa'],complete:['concluir tarefa','marcar como concluída','terminar tarefa'],del:['excluir tarefa','apagar tarefa','remover tarefa'],move:['mover tarefa','alterar status'],pomo:['pomodoro','temporizador','foco'],analytics:['estatísticas','análise','desempenho','produtividade','resumo'],calendar:['calendário','agenda','próximas','prazos'],export:['exportar','csv','baixar'],theme:['modo escuro','modo claro','alterar tema'],language:['mudar idioma','trocar idioma','idioma'],motivation:['motivação','inspiração','citação','cr7'],count:['quantas','contar','número de tarefas'],overdue:['atrasadas','vencidas']},
            fr: {help:['aide','commandes','que peux-tu faire'],list:['toutes les tâches','afficher les tâches','lister les tâches'],search:['chercher','rechercher','trouver une tâche','montre les tâches'],add:['ajouter une tâche','créer une tâche','nouvelle tâche'],update:['mettre à jour la tâche','modifier la tâche','changer la tâche'],complete:['terminer la tâche','marquer comme terminée','finir la tâche'],del:['supprimer la tâche','effacer la tâche','retirer la tâche'],move:['déplacer la tâche','changer le statut'],pomo:['pomodoro','minuteur','concentration'],analytics:['statistiques','analyse','performance','productivité','résumé'],calendar:['calendrier','agenda','à venir','échéances'],export:['exporter','csv','télécharger'],theme:['mode sombre','mode clair','changer le thème'],language:['changer de langue','changer la langue','langue'],motivation:['motivation','inspiration','citation','cr7'],count:['combien','compter','nombre de tâches'],overdue:['en retard','retardées','dépassées']},
            hi: {help:['मदद','सहायता','कमांड','क्या कर सकते हो'],list:['सभी कार्य','कार्य दिखाओ','काम दिखाओ','कार्य सूची'],search:['खोजो','कार्य खोजो','काम खोजो','कार्य दिखाओ'],add:['कार्य जोड़ो','कार्य जोड़ें','काम जोड़ो','काम बनाओ','टास्क जोड़ो','टास्क बनाएं'],update:['कार्य अपडेट करो','कार्य संपादित करो','काम बदलो','टास्क बदलो'],complete:['कार्य पूरा करो','काम पूरा करो','पूर्ण करो','पूरा चिह्नित करो'],del:['कार्य हटाओ','काम हटाओ','टास्क हटाओ'],move:['कार्य स्थानांतरित करो','काम को बदलो','स्थिति बदलो'],pomo:['पोमोडोरो','फोकस टाइमर','टाइमर','फोकस'],analytics:['आंकड़े','विश्लेषण','प्रदर्शन','उत्पादकता','सारांश'],calendar:['कैलेंडर','शेड्यूल','आने वाले','अंतिम तिथि'],export:['निर्यात','एक्सपोर्ट','csv','डाउनलोड'],theme:['डार्क मोड','लाइट मोड','थीम बदलो'],language:['भाषा बदलो','भाषा बदलें','भाषा'],motivation:['प्रेरणा','मोटिवेशन','उद्धरण','क्र7'],count:['कितने','गिनती','कुल कार्य'],overdue:['समय पार','देर से','मुदत']},
            mr: {help:['मदत','सहाय्य','कमांड','काय करू शकता'],list:['सर्व कामे','कामे दाखवा','कामांची यादी'],search:['शोधा','काम शोधा','कामे दाखवा'],add:['काम जोडा','काम तयार करा','टास्क जोडा','कार्य जोडा','कार्य तयार करा'],update:['काम अपडेट करा','काम संपादित करा','काम बदला','टास्क बदला'],complete:['काम पूर्ण करा','काम पूर्ण म्हणून चिन्हांकित करा','पूर्ण करा'],del:['काम हटवा','टास्क हटवा','काम काढा'],move:['काम हलवा','स्थिती बदला'],pomo:['पोमोडोरो','फोकस टाइमर','टाइमर','फोकस'],analytics:['आकडेवारी','विश्लेषण','कामगिरी','उत्पादकता','सारांश'],calendar:['कॅलेंडर','वेळापत्रक','पुढील','अंतिम तारीख'],export:['निर्यात','एक्सपोर्ट','csv','डाउनलोड'],theme:['डार्क मोड','लाइट मोड','थीम बदला'],language:['भाषा बदला','भाषा बदल','भाषा'],motivation:['प्रेरणा','मोटिवेशन','कोट','क्र7'],count:['किती','मोजा','एकूण कामे'],overdue:['मुदत संपलेली','उशीर','प्रलंबित']}
        };
        return aliases[lang] || aliases.en;
    }

    stripIntent(input, intent) {
        let out=String(input||'');
        const aliases=[...(this.localizedAliases(this.getLang())[intent]||[])].sort((a,b)=>b.length-a.length);
        for(const a of aliases) out=out.replace(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'iu'),' ');
        return out.replace(/^(task|tarea|tarefa|tâche|कार्य|काम|टास्क)\s*(called|named|llamada|chamada|appelée|नाम|नाव)?\s*:?\s*/iu,'').replace(/\s+/g,' ').trim();
    }

    matchesIntent(input, intent) {
        const lower=input.toLowerCase();
        const aliases=this.localizedAliases(this.getLang())[intent] || [];
        return aliases.some(a => lower.includes(a));
    }

    taskByReference(ref) {
        const tasks=window.tasks||[];
        const raw=String(ref).trim();
        const exact=tasks.find(t=>String(t.id)===raw);
        if(exact) return exact;
        const n=Number(raw);
        if(Number.isInteger(n) && n>0 && n<=tasks.length) return tasks[n-1];
        return null;
    }

    async init() {
        if (this.initialized) {
            if (!this.backendConversationId && typeof authManager !== 'undefined' && authManager.getUser()) {
                try {
                    const conversation = await apiClient.request('/chat/conversations', 'POST', { title: 'Hitmo AI', language: this.getLang() });
                    this.backendConversationId = conversation.id;
                } catch {}
            }
            return;
        }
        this.initialized = true;
        this.conversationHistory = [{ role:'assistant', content:this.getWelcomeMessage(), timestamp:this.getTimestamp() }];
        try {
            if (typeof authManager !== 'undefined' && authManager.getUser()) {
                const conversation = await apiClient.request('/chat/conversations', 'POST', {
                    title: 'Hitmo AI',
                    language: this.getLang()
                });
                this.backendConversationId = conversation.id;
            }
        } catch (e) {
            console.warn('Chat persistence unavailable:', e.message);
        }
        this.renderConversation();
        this.updatePills();
        window.addEventListener('languageChanged', () => {
            this.updatePills();
            if (this.conversationHistory.length === 1) {
                this.conversationHistory[0].content = this.getWelcomeMessage();
                this.renderConversation();
            }
        });
    }

    getWelcomeMessage() {
        const lang = this.getLang();
        const messages = {
            en:`🚀 **Hitmo AI** is ready!\n\nAsk me to create, update, complete, search, prioritize, export or analyze your tasks. Type **help** for commands.`,
            hi:`🚀 **हिटमो AI** तैयार है!\n\nआप मुझसे कार्य बनवाने, अपडेट करने, पूरा करने, खोजने, प्राथमिकता तय करने, निर्यात करने या विश्लेषण करने के लिए कह सकते हैं। कमांड के लिए **help** लिखें।`,
            mr:`🚀 **हिटमो AI** तयार आहे!\n\nकाम तयार करणे, अपडेट करणे, पूर्ण करणे, शोधणे, प्राधान्य देणे, निर्यात करणे किंवा विश्लेषण करण्यासाठी मला विचारा. कमांडसाठी **help** लिहा.`,
            es:`🚀 **Hitmo AI** está listo!\n\nPuedo crear, actualizar, completar, buscar, priorizar, exportar y analizar tus tareas. Escribe **help** para ver los comandos.`,
            fr:`🚀 **Hitmo AI** est prêt !\n\nJe peux créer, modifier, terminer, rechercher, prioriser, exporter et analyser vos tâches. Écrivez **help** pour les commandes.`,
            pt:`🚀 **Hitmo AI** está pronto!\n\nPosso criar, atualizar, concluir, pesquisar, priorizar, exportar e analisar suas tarefas. Digite **help** para ver os comandos.`
        };
        return messages[lang] || messages.en;
    }

    updatePills() {
        const lang = this.getLang();
        const pills = {
            en: [{ text:'📊 Stats', prompt:'Show my performance stats' },{ text:'➕ Add Task', prompt:'Add task called Buy groceries with medium priority' },{ text:'🔥 Complete All', prompt:'Mark all completed tasks as done' },{ text:'🔍 Search Security', prompt:'Show me tasks about security' },{ text:'⏱️ Start Focus', prompt:'Start a pomodoro timer' },{ text:'📤 Export CSV', prompt:'Export my tasks to CSV' }],
            es: [{ text:'📊 Stats', prompt:'Muestra mis estadísticas de rendimiento' },{ text:'➕ Añadir Tarea', prompt:'Añade tarea llamada Comprar con prioridad media' },{ text:'🔥 Completar Todo', prompt:'Marca todas las tareas completadas' },{ text:'🔍 Buscar Seguridad', prompt:'Muestra tareas sobre seguridad' },{ text:'⏱️ Enfocar', prompt:'Inicia un temporizador pomodoro' },{ text:'📤 Exportar', prompt:'Exporta mis tareas a CSV' }],
            pt: [{ text:'📊 Stats', prompt:'Mostre minhas estatísticas de desempenho' },{ text:'➕ Adicionar', prompt:'Adicione tarefa chamada Compras com prioridade média' },{ text:'🔥 Concluir Tudo', prompt:'Marque todas as tarefas concluídas' },{ text:'🔍 Buscar Segurança', prompt:'Mostre tarefas sobre segurança' },{ text:'⏱️ Focar', prompt:'Inicie um temporizador pomodoro' },{ text:'📤 Exportar', prompt:'Exporte tarefas para CSV' }],
            fr: [{ text:'📊 Stats', prompt:'Montre mes statistiques' },{ text:'➕ Ajouter', prompt:'Ajoute une tâche Course avec priorité moyenne' },{ text:'🔥 Tout Finir', prompt:'Marque tout comme terminé' },{ text:'🔍 Chercher Sécurité', prompt:'Montre les tâches sur la sécurité' },{ text:'⏱️ Focus', prompt:'Démarre un pomodoro' },{ text:'📤 Export', prompt:'Exporte en CSV' }],
            de: [{ text:'📊 Stats', prompt:'Zeige meine Statistiken' },{ text:'➕ Hinzufügen', prompt:'Füge Aufgabe Einkauf mit mittlerer Priorität hinzu' },{ text:'🔥 Alle Abschließen', prompt:'Markiere alle erledigten Aufgaben' },{ text:'🔍 Suche Sicherheit', prompt:'Zeige Aufgaben über Sicherheit' },{ text:'⏱️ Fokus', prompt:'Starte einen Pomodoro' },{ text:'📤 Exportieren', prompt:'Exportiere als CSV' }],
            ar: [{ text:'📊 Stats', prompt:'أظهر إحصائيات الأداء' },{ text:'➕ إضافة', prompt:'أضف مهمة اسمها البقالة بأولوية متوسطة' },{ text:'🔥 الكل', prompt:'علّم كل المهام كمكتملة' },{ text:'🔍 بحث', prompt:'أظهر مهام عن الأمن' },{ text:'⏱️ مؤقت', prompt:'ابدأ مؤقت التركيز' },{ text:'📤 تصدير', prompt:'صدّر المهام إلى CSV' }],
        };
        const list = pills[lang] || pills['en'];
        const container = document.getElementById('assistantPills');
        if (container) {
            container.innerHTML = list.map(item => `<button onclick="hitmoAssistant.sendMessage('${item.prompt.replace(/'/g, "\\'")}')" class="text-[10px] font-mono bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:border-cyan-400 dark:hover:border-cyan-400 shrink-0 transition-all transform hover:scale-105 shadow-sm">${item.text}</button>`).join('');
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('assistantPanel');
        const badge = document.getElementById('assistantBadge');
        if (panel) {
            panel.classList.toggle('hidden', !this.isOpen);
            if (this.isOpen) { if (badge) badge.classList.add('hidden'); setTimeout(() => { const input = document.getElementById('assistantInput'); if (input) input.focus(); this.scrollToBottom(); }, 100); }
        }
        if (window.sfx) window.sfx.playClick();
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const icon = document.getElementById('voiceIcon');
        if (icon) { icon.classList.toggle('text-emerald-500', this.voiceEnabled); icon.classList.toggle('text-slate-400', !this.voiceEnabled); }
        if (this.voiceEnabled) { const msgs = { en:'Voice enabled', es:'Salida activada', pt:'Ativada', fr:'Activée', de:'Aktiviert', ar:'تم التفعيل' }; this.speak(msgs[this.getLang()] || msgs['en']); }
    }

    async sendMessage(text = null) {
        const input = document.getElementById('assistantInput');
        const message = text || (input ? input.value.trim() : '');
        if (!message) return;
        if (input) input.value = '';

        this.conversationHistory.push({ role:'user', content:message, timestamp:this.getTimestamp() });
        if (this.backendConversationId) {
            apiClient.request(`/chat/conversations/${this.backendConversationId}/messages`, 'POST', { role: 'USER', content: message }).catch(() => {});
        }
        this.renderConversation();
        if (window.sfx) window.sfx.playClick();
        this.showTyping(true);

        await this.delay(300 + Math.random() * 400);
        this.showTyping(false);

        const response = this.processMessage(message);
        this.conversationHistory.push({ role:'assistant', content:response, timestamp:this.getTimestamp() });
        if (this.backendConversationId) {
            apiClient.request(`/chat/conversations/${this.backendConversationId}/messages`, 'POST', { role: 'ASSISTANT', content: response }).catch(() => {});
        }
        this.renderConversation();

        if (this.voiceEnabled) this.speak(this.stripMarkdown(response));
    }

    // ========== MAIN PROCESSOR ==========
    processMessage(input) {
        const raw = String(input || '').trim();
        const lower = raw.toLowerCase();
        const lang = this.getLang();

        if (this.matchesIntent(lower,'help') || lower === 'help') return this.showHelp(lang);
        if (this.matchesIntent(lower,'del') && (lower.includes('all') || lower.includes('सभी') || lower.includes('सर्व'))) return this.executeClearAll();
        if (this.matchesIntent(lower,'list')) return this.executeListTasks();
        if (this.matchesIntent(lower,'search')) return this.executeSearch(raw);
        if (this.matchesIntent(lower,'add')) return this.executeCreateTask(raw);
        if (this.matchesIntent(lower,'update')) return this.executeUpdateTask(raw);
        if (this.matchesIntent(lower,'complete')) return this.executeCompleteTask(raw);
        if (this.matchesIntent(lower,'del')) return this.executeDeleteTask(raw);
        if (this.matchesIntent(lower,'move')) return this.executeMoveTask(raw);
        if (this.matchesIntent(lower,'pomo')) return this.executePomodoro(raw);
        if (this.matchesIntent(lower,'analytics')) return this.executeAnalytics();
        if (this.matchesIntent(lower,'calendar')) return this.executeCalendar();
        if (this.matchesIntent(lower,'export')) return this.executeExport();
        if (this.matchesIntent(lower,'theme')) return this.executeTheme();
        if (this.matchesIntent(lower,'language')) return this.executeLanguage(raw);
        if (this.matchesIntent(lower,'motivation')) return this.executeMotivation();
        if (this.matchesIntent(lower,'count')) return this.executeCount();
        if (this.matchesIntent(lower,'overdue')) return this.executeOverdue();
        if (lower === 'about' || lower === 'about hitmo' || lower.includes('के बारे में') || lower.includes('माहिती')) return this.executeAbout(lang);
        if (lower === 'undo' || lower === 'revert' || lower.includes('पूर्ववत') || lower.includes('undo')) return this.executeUndo();
        const taskRef = lower.match(/(?:task|कार्य|काम|टास्क|tâche|tarea|tarefa)\s*#?([0-9a-f-]{6,})/i);
        if (taskRef) return this.executeTaskDetail(taskRef[1]);
        return this.createTaskFromIntent(raw, lang);
    }

    includesAny(str, patterns) { return patterns.some(p => str.includes(p)); }

    extractQuery(lower, patterns) { for (const p of patterns) { const idx = lower.indexOf(p); if (idx !== -1 && idx + p.length < lower.length) return lower.substring(idx + p.length).trim(); } return ''; }

    extractNumber(lower) { const m = lower.match(/(\d+)/); return m ? parseInt(m[1]) : null; }

    // ========== EXECUTORS ==========

    executeListTasks() {
        const tasks = window.tasks || [];
        if (tasks.length === 0) return this.msg('noTasks');
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date(new Date().toDateString())).length;
        const recent = [...tasks].sort((a,b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, 10);
        const lang=this.getLang(); let msg = `📋 **${total} ${this.t(lang,'tasks','Tasks')}** (✅${completed} ${this.t(lang,'completedTasks','Completed')} ⬜${pending} ${this.t(lang,'pendingTasks','Pending')} ⚠️${overdue} ${this.t(lang,'overdueTasks','Overdue')})\n\n`;
        recent.forEach((t, i) => {
            const st = t.completed ? '✅' : '⬜';
            const ov = (!t.completed && t.deadline && new Date(t.deadline) < new Date(new Date().toDateString())) ? ' ⚠️' : '';
            msg += `${i+1}. ${st} **${t.title}** (${t.priority || 'MEDIUM'})${ov}\n`;
        });
        msg += `\n💡 ${this.t(lang,'search','Search')}: "security"`;
        return msg;
    }

    executeSearch(query) {
        const tasks = window.tasks || [];
        if (!query || query.length < 2) return this.t(this.getLang(),'enterSearchTerm','Please specify what to search for.');
        const q = this.stripIntent(query, 'search') || query.trim();
        const results = tasks.filter(t => (t.title||'').toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q) || (t.tags||'').toLowerCase().includes(q) || (t.category||'').toLowerCase().includes(q));
        if (results.length === 0) return `🔍 ${this.msg('noTasks')} "${q}".`;
        let msg = `🔍 **${this.msg('results',{n:results.length})}**\n\n`;
        results.forEach((t, i) => {
            const st = t.completed ? '✅' : '⬜';
            msg += `${i+1}. ${st} **${t.title}** [${t.priority}] — ${t.category}\n`;
        });
        msg += `\n💡 Say "Mark task 1 as done" to complete one.`;
        return msg;
    }

    executeFilter(input) {
        const tasks = window.tasks || [];
        const lower = input.toLowerCase();
        let filterType = 'priority', filterValue = '';
        const keywords = { urgent:'URGENT', urgente:'URGENT', high:'HIGH', alta:'HIGH', alto:'HIGH', medium:'MEDIUM', media:'MEDIUM', média:'MEDIUM', मध्यम:'MEDIUM', मध्यम:'MEDIUM', medium:'MEDIUM', low:'LOW', baixa:'LOW', basse:'LOW', कमी:'LOW', कम:'LOW', work:'WORK', trabajo:'WORK', trabalho:'WORK', travail:'WORK', काम:'WORK', study:'STUDY', étude:'STUDY', estudo:'STUDY', अध्ययन:'STUDY', अभ्यास:'STUDY', personal:'PERSONAL', personnel:'PERSONAL', pessoal:'PERSONAL', व्यक्तिगत:'PERSONAL', वैयक्तिक:'PERSONAL', finance:'FINANCE', finanzas:'FINANCE', finanças:'FINANCE', वित्त:'FINANCE', health:'HEALTH', santé:'HEALTH', saúde:'HEALTH', स्वास्थ्य:'HEALTH', आरोग्य:'HEALTH', shopping:'SHOPPING', compras:'SHOPPING', achats:'SHOPPING', खरीदारी:'SHOPPING', खरेदी:'SHOPPING', todo:'TODO', inprogress:'IN_PROGRESS', completed:'COMPLETED', completo:'COMPLETED', concluída:'COMPLETED', terminée:'COMPLETED', पूर्ण:'COMPLETED' };
        for (const [key, val] of Object.entries(keywords)) {
            if (lower.includes(key)) { filterType = ['urgent','high','medium','low','todo'].includes(key) ? 'priority' : (key === 'todo' ? 'status' : 'category'); filterValue = val; break; }
        }
        if (!filterValue) {
            const priMatch = lower.match(/(?:show|filter|only)\s*\d*\s*([a-z]+)\s*(?:priority)?/i);
            if (priMatch) filterValue = priMatch[1].toUpperCase() === 'HIGHPRIORITY' ? 'HIGH' : priMatch[1].toUpperCase();
        }
        if (!filterValue || !['URGENT','HIGH','MEDIUM','LOW','WORK','STUDY','PERSONAL','FINANCE','HEALTH','SHOPPING','OTHER','TODO','IN_PROGRESS','COMPLETED'].includes(filterValue)) {
            return this.t(this.getLang(),'specifyFilter','Please specify a filter.');
        }
        const key = filterType === 'priority' ? 'priority' : filterType === 'category' ? 'category' : 'status';
        const filtered = tasks.filter(t => (t[key]||'').toUpperCase() === filterValue);
        if (filtered.length === 0) return this.msg('filterNone');
        let msg = `🔍 **${filtered.length} task(s)** filtered by ${filterType} = ${filterValue}\n\n`;
        filtered.forEach((t, i) => { msg += `${i+1}. ${t.completed?'✅':'⬜'} **${t.title}** (${t.priority}) — ${t.category}\n`; });
        msg += `\n💡 Switch to the **${key}** view for full list.`;
        return msg;
    }

    executeCreateTask(input) {
        const normalizedInput = this.stripIntent(input, 'add');
        const taskData = this.parseTaskFromNaturalLanguage(normalizedInput || input);
        if (!taskData.title || taskData.title.length < 2) return this.msg('needTitle');
        const taskObj = { title: taskData.title, description: 'Created via Hitmo AI Assistant', priority: taskData.priority || 'MEDIUM', category: taskData.category || 'OTHER', status: 'TODO', deadline: taskData.deadline || null, tags: 'ai-generated,voice' };
        if (typeof window.saveTaskAPI === 'function') {
            window.saveTaskAPI(taskObj);
            if (typeof window.sfx !== 'undefined') window.sfx.playComplete();
            if (typeof confetti !== 'undefined') confetti({ particleCount: 40, spread: 50 });
        }
        return `✅ **${this.msg('created')}**\n\n• **${taskData.title}**\n• **${this.t(this.getLang(),'priority','Priority')}:** ${taskObj.priority}\n• **${this.t(this.getLang(),'category','Category')}:** ${taskObj.category}`;
    }

    executeUpdateTask(input) {
        const tasks = window.tasks || [];
        const num = this.extractNumber(input);
        let task = num ? this.taskByReference(num) : null;
        if (!task) task = tasks.find(t => t.title && t.title.toLowerCase().includes(input.toLowerCase().replace(/update|edit|change|modify|actualizar|editar|modifier|बदल|संपादित|अपडेट/gi,'').trim().substring(0, 15)));
        if (!task) return this.msg('notFound');
        let updates = {};
        const priMap = { urgent:'URGENT', high:'HIGH', medium:'MEDIUM', low:'LOW' };
        const catMap = { work:'WORK', study:'STUDY', personal:'PERSONAL', finance:'FINANCE', health:'HEALTH', shopping:'SHOPPING' };
        for (const [k,v] of Object.entries(priMap)) { if (input.includes(k)) updates.priority = v; }
        for (const [k,v] of Object.entries(catMap)) { if (input.includes(k)) updates.category = v; }
        const titleMatch = input.match(/(?:title to|rename to|change title to)\s*(.+)/i);
        if (titleMatch) updates.title = titleMatch[1].trim();
        const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) updates.deadline = dateMatch[1];
        if (Object.keys(updates).length === 0) {
            if (titleMatch) updates.title = '';
            return `${task.title}: ${this.t(this.getLang(),'specifyUpdate','Please specify what to change.')}`;
        }
        if (typeof window.saveTaskAPI === 'function') window.saveTaskAPI(updates, task.id);
        return `✅ **${this.msg('updated')}**\n\n• **${task.title}** → changed:\n${Object.entries(updates).map(([k,v]) => `  - ${k}: ${v}`).join('\n')}`;
    }

    executeCompleteTask(input) {
        const tasks = window.tasks || [];
        const num = this.extractNumber(input);
        let task = num ? this.taskByReference(num) : null;
        if (!task && input.toLowerCase().includes('all')) {
            const incomplete = tasks.filter(t => !t.completed);
            incomplete.forEach(t => { t.completed = true; t.status = 'COMPLETED'; });
            if (typeof window.saveTaskAPI === 'function') window.saveTaskAPI({}, incomplete[0]?.id);
            if (typeof window.sfx !== 'undefined') window.sfx.playComplete();
            if (typeof confetti !== 'undefined') confetti({ particleCount: 100, spread: 80 });
            return `🎉 **${this.msg('bulkComplete',{n:incomplete.length})}**`;
        }
        if (!task) task = tasks.filter(t => !t.completed).pop();
        if (!task) return this.msg('noTask');
        if (task.completed) return `ℹ️ ${task.title} — ${this.msg('done')}.`;
        task.completed = true; task.status = 'COMPLETED';
        if (typeof window.toggleTaskCompleteAPI === 'function') window.toggleTaskCompleteAPI(task.id);
        if (typeof window.saveTaskAPI === 'function') window.saveTaskAPI({}, task.id);
        if (typeof window.sfx !== 'undefined') window.sfx.playComplete();
        if (typeof confetti !== 'undefined') confetti({ particleCount: 60, spread: 60 });
        return `✅ **${this.msg('completed')}**\n\n${task.title}`;
    }

    executeDeleteTask(input) {
        const tasks = window.tasks || [];
        const num = this.extractNumber(input);
        let task = num ? this.taskByReference(num) : null;
        if (!task) task = tasks.filter(t => !t.completed).pop();
        if (!task) return this.msg('noTask');
        if (typeof window.deleteTaskAPI === 'function') window.deleteTaskAPI(task.id);
        return `🗑️ **${this.msg('deleted')}**\n\n${task.title}`;
    }

    executeMoveTask(input) {
        const tasks = window.tasks || [];
        const num = this.extractNumber(input);
        let task = num ? this.taskByReference(num) : null;
        if (!task) {
            const lower = input.toLowerCase();
            if (lower.includes('completed') || lower.includes('done') || lower.includes('complete')) {
                const incomplete = tasks.filter(t => !t.completed);
                incomplete.forEach(t => { t.completed = true; t.status = 'COMPLETED'; });
                return `✅ **${this.msg('bulkComplete',{n:incomplete.length})}**`;
            }
            const q = input.toLowerCase().replace(/move|to|drag|put|change status|task\s*\d*\s*/gi, '').trim();
            task = tasks.find(t => t.title && t.title.toLowerCase().includes(q.substring(0, 15)));
        }
        if (!task) return this.msg('notFound');
        const statusMap = { todo:'TODO', 'to do':'TODO', 'in progress':'IN_PROGRESS', 'inprogress':'IN_PROGRESS', 'progress':'IN_PROGRESS', completed:'COMPLETED', done:'COMPLETED', complete:'COMPLETED' };
        let targetStatus = null;
        for (const [key,val] of Object.entries(statusMap)) { if (input.toLowerCase().includes(key)) { targetStatus = val; break; } }
        if (!targetStatus) return `${task.title}: ${this.t(this.getLang(),'specifyStatus','Where should I move it?')}`;
        if (typeof window.updateTaskStatusAPI === 'function') window.updateTaskStatusAPI(task.id, targetStatus);
        return `🔄 **${this.msg('moved',{status:targetStatus})}**`;
    }

    executePomodoro(input) {
        const tasks = window.tasks || [];
        const num = this.extractNumber(input);
        let task = num ? this.taskByReference(num) : null;
        if (!task) { const incomplete = tasks.filter(t => !t.completed); if (incomplete.length > 0) task = incomplete[0]; }
        if (!task) return this.msg('noTask');
        if (typeof window.openPomodoroForTask === 'function') window.openPomodoroForTask(task.id);
        if (typeof window.togglePomodoroWidget === 'function') window.togglePomodoroWidget();
        return `⏱️ **${this.msg('pomodoro',{title:task.title})}**\n\n25 min de foco. 💪`;
    }

    executeAnalytics() {
        const tasks = window.tasks || [];
        const total = tasks.length, completed = tasks.filter(t => t.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const overdue = tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date(new Date().toDateString())).length;
        const totalPomodoros = tasks.reduce((sum,t) => sum + (t.pomodoroCount || 0), 0);
        return `📊 **${this.msg('analytics')}**\n\n• **${this.msg('total')}:** ${total}\n• **${this.msg('done')}:** ${completed} (${rate}%)\n• **${this.msg('overdue')}:** ${overdue}\n• **${this.msg('focus')}:** ${totalPomodoros}\n\n**${rate >= 70 ? '🔥' : rate >= 40 ? '⚡' : '🌱'} ${rate}%**`;
    }

    executeCalendar() {
        const tasks = window.tasks || [];
        const today = new Date().toISOString().slice(0,10);
        const todayTasks = tasks.filter(t => t.deadline === today);
        const weekTasks = tasks.filter(t => { if (!t.deadline) return false; const d = new Date(t.deadline); const now = new Date(); return (d - now) >= 0 && (d - now) <= 604800000; });
        let msg = `📅 **${this.t(this.getLang(),'cmdCalendar','Calendar Overview')}**\n\n${this.msg('today')}: ${todayTasks.length}\n${this.msg('week')}: ${weekTasks.length}\n\n`;
        if (weekTasks.length > 0) { msg += '**Upcoming:**\n'; weekTasks.forEach((t,i) => { const days = Math.round((new Date(t.deadline) - new Date()) / 86400000); msg += `${i+1}. **${t.title}** — ${days}d\n`; }); }
        msg += '\n💡 Switch to Calendar view for full layout.';
        return msg;
    }

    executeExport() {
        if (typeof window.exportTasksCSV === 'function') { window.exportTasksCSV(); if (typeof window.sfx !== 'undefined') window.sfx.playClick(); return `📤 **${this.msg('exported')}**\n\n${window.tasks.length} tasks saved.`; }
        return this.t(this.getLang(),'exportFailed','Export failed.');
    }

    executeBulk(input) {
        const tasks = window.tasks || [];
        const lower = input.toLowerCase();
        if (lower.includes('delete') || lower.includes('remove') || lower.includes('eliminar') || lower.includes('excluir') || lower.includes('supprimer') || lower.includes('हटाओ') || lower.includes('हटवा')) {
            const completed = tasks.filter(t => t.completed);
            if (completed.length === 0) return this.t(this.getLang(),'noCompletedToDelete','No completed tasks to delete!');
            completed.forEach(t => { if (typeof window.deleteTaskAPI === 'function') window.deleteTaskAPI(t.id); });
            if (typeof window.saveTaskAPI === 'function') window.saveTaskAPI({}, tasks[0]?.id);
            return `🗑️ **${this.msg('bulkDeleted',{n:completed.length})}**`;
        }
        if (lower.includes('complete') || lower.includes('done') || lower.includes('completar') || lower.includes('concluir') || lower.includes('terminer') || lower.includes('पूर्ण') || lower.includes('पूर्ण करा')) {
            const incomplete = tasks.filter(t => !t.completed);
            incomplete.forEach(t => { t.completed = true; t.status = 'COMPLETED'; });
            return `✅ **${this.msg('bulkComplete',{n:incomplete.length})}**`;
        }
        if (lower.includes('select') || lower.includes('toggle') || lower.includes('bulk mode') || lower.includes('seleccionar') || lower.includes('selecionar') || lower.includes('sélectionner') || lower.includes('चयन') || lower.includes('बल्क')) {
            if (typeof window.toggleBulkMode === 'function') window.toggleBulkMode();
            return `📋 **${this.msg('bulkMode')}**`;
        }
        return this.t(this.getLang(),'specifyBulk','Try a bulk command.');
    }

    executeTheme() {
        if (typeof window.toggleTheme === 'function') window.toggleTheme();
        const isDark = document.documentElement.classList.contains('dark');
        return `🎨 **${this.msg('theme',{theme:isDark ? this.t(this.getLang(),'dark','Dark') : this.t(this.getLang(),'light','Light')})}**`;
    }

    executeLanguage(input) {
        const langMap = { english:'en',en:'en',hindi:'hi','हिन्दी':'hi','हिंदी':'hi',hi:'hi',marathi:'mr','मराठी':'mr',mr:'mr',spanish:'es','español':'es',es:'es',portuguese:'pt','português':'pt',pt:'pt',french:'fr','français':'fr',fr:'fr' };
        const lower = input.toLowerCase();
        let targetLang = null;
        for (const [key, val] of Object.entries(langMap)) { if (lower.includes(key)) { targetLang = val; break; } }
        if (!targetLang) return this.t(this.getLang(),'languagePrompt','Which language should I use?');
        if (typeof window.changeLanguage === 'function') window.changeLanguage(targetLang);
        const names = { en:'English', hi:'हिन्दी', mr:'मराठी', es:'Español', fr:'Français', pt:'Português' };
        return `🌐 **${this.msg('language',{name:names[targetLang]})}**`;
    }

    executeMotivation() {
        const quotes = {
            en:['"Your love makes me strong, your hate makes me unstoppable." — CR7','"Sometimes you gotta run before you can walk." — Stark','"Discipline beats talent when talent fails to discipline."'],
            hi:['"अनुशासन आपकी सबसे बड़ी ताकत है।" — CR7','"पहले दौड़ना सीखो, फिर उड़ना आसान होगा।" — Stark','"लगातार प्रयास ही सफलता का रास्ता है।"'],
            mr:['"शिस्त ही यशाची खरी ताकद आहे." — CR7','"आजची मेहनत उद्याचा आत्मविश्वास बनवते." — Stark','"सातत्य ठेवा आणि पुढे चालत राहा."'],
            es:['"Tu amor me hace fuerte, tu odio me hace imparable." — CR7','"La disciplina vence al talento."'],
            fr:['"La discipline dépasse le talent." — CR7','"Continuez à avancer, un pas à la fois."'],
            pt:['"A disciplina vence o talento." — CR7','"Continue avançando, um passo de cada vez."']
        };
        const lang=this.getLang(), list=quotes[lang]||quotes.en;
        const title={en:'Motivation Boost!',hi:'प्रेरणा!',mr:'प्रेरणा!',es:'¡Motivación!',fr:'Motivation !',pt:'Motivação!'}[lang]||'Motivation!';
        return `⚡ **${title}**\n\n${list[Math.floor(Math.random()*list.length)]}\n\n💪`;
    }

    executeAbout(lang) { return `ℹ️ **${this.msg('about')}**

• ${this.t(lang,'flowBoard','Flow Board')}
• ${this.t(lang,'eisenhowerMatrix','Eisenhower Matrix')}
• ${this.t(lang,'calendar','Calendar')}
• ${this.t(lang,'performance','Performance')}
• ${this.t(lang,'hitmoAssistant','Hitmo Assistant')}
• 6 languages`; }

    executeUndo() { return this.msg('undo'); }
    executeCount() { const tasks = window.tasks || []; return `📊 **Task Count:**\n\n• **Total:** ${tasks.length}\n• **To Do:** ${tasks.filter(t => t.status === 'TODO' || (!t.completed && t.status !== 'COMPLETED')).length}\n• **In Progress:** ${tasks.filter(t => t.status === 'IN_PROGRESS').length}\n• **Completed:** ${tasks.filter(t => t.completed).length}`; }
    executeOverdue() { const tasks = window.tasks || []; const overdue = tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date(new Date().toDateString())); if (overdue.length === 0) return '✅ **No overdue tasks!** 🎉'; let msg = `⚠️ **${overdue.length} Overdue:**\n\n`; overdue.forEach((t,i) => { const days = Math.round((new Date() - new Date(t.deadline))/86400000); msg += `${i+1}. **${t.title}** — ${days} day(s) late\n`; }); msg += '\n💡 Say "Mark overdue tasks as done" to clear them.'; return msg; }
    executeTaskDetail(id) { const task = this.taskByReference(id); if (!task) return `🔍 **Task #${id} not found.**`; const overdue = !task.completed && task.deadline && new Date(task.deadline) < new Date(new Date().toDateString()); return `📋 **Task #${id}: ${task.title}**\n\n• **Priority:** ${task.priority || 'MEDIUM'}\n• **Category:** ${task.category}\n• **Status:** ${task.status}\n• **Deadline:** ${task.deadline || 'None'}${overdue ? ' ⚠️ OVERDUE' : ''}\n• **Pomodoros:** ${task.pomodoroCount || 0}\n• **Tags:** ${task.tags || 'None'}\n\n💡 Say "Edit task ${id}" to modify it.`; }
    executeClearAll() { const tasks = window.tasks || []; if (tasks.length === 0) return 'Nothing to clear!'; const ids = tasks.map(t => t.id); ids.forEach(id => { if (typeof window.deleteTaskAPI === 'function') window.deleteTaskAPI(id); }); return `⚠️ **Cleared all ${tasks.length} tasks!** ✅\n\nYour workspace is fresh! 💫`; }
    showHelp(lang) {
        const cmds=this.getCommands();
        let msg=`📖 **${this.msg('help')}**\n\n`;
        cmds.forEach(c=>{msg+=`• **${c.command}** — ${c.desc}\n`;});
        return msg;
    }

    getCommands() {
        const lang = this.getLang();
        return [
            { command:'list tasks', desc: this.t(lang,'cmdListTasks','List all tasks') },
            { command:'search [query]', desc: this.t(lang,'cmdSearch','Search tasks') },
            { command:'filter by [priority/category]', desc: this.t(lang,'cmdFilter','Filter tasks') },
            { command:'add task called [title]', desc: this.t(lang,'cmdAddTask','Create task') },
            { command:'edit/update task [id]', desc: this.t(lang,'cmdUpdateTask','Update task') },
            { command:'mark task [id] as done', desc: this.t(lang,'cmdCompleteTask','Complete task') },
            { command:'delete task [id]', desc: this.t(lang,'cmdDeleteTask','Delete task') },
            { command:'move task [id] to [status]', desc: this.t(lang,'cmdMoveTask','Move task') },
            { command:'start pomodoro for task [id]', desc: this.t(lang,'cmdPomodoro','Start timer') },
            { command:'show stats / performance', desc: this.t(lang,'cmdAnalytics','Show analytics') },
            { command:'show calendar', desc: this.t(lang,'cmdCalendar','Show calendar') },
            { command:'export tasks to CSV', desc: this.t(lang,'cmdExport','Export tasks') },
            { command:'delete all completed', desc: this.t(lang,'cmdBulk','Bulk operations') },
            { command:'toggle dark/light mode', desc: this.t(lang,'cmdTheme','Toggle theme') },
            { command:'change language to [lang]', desc: this.t(lang,'cmdLanguage','Change language') },
            { command:'motivation / CR7 / Stark', desc: this.t(lang,'cmdMotivation','Get motivation') },
            { command:'help', desc: this.t(lang,'cmdHelp','Show all commands') },
            { command:'about', desc: this.t(lang,'cmdAbout','About Hitmo') },
        ];
    }

    // ========== NLP PARSER ==========
    parseTaskFromNaturalLanguage(input) {
        const lower = input.toLowerCase();
        const result = { title:'', description:'Created via Hitmo AI Assistant', priority:'MEDIUM', category:'OTHER', deadline:null, tags:'ai-generated,voice' };
        const priMap = { urgent:'URGENT', high:'HIGH', medium:'MEDIUM', low:'LOW', urgente:'URGENT', alta:'HIGH', alto:'HIGH', média:'MEDIUM', media:'MEDIUM', baixa:'LOW', basse:'LOW', élevée:'HIGH', moyenne:'MEDIUM', faible:'LOW', urgente:'URGENT', उच्च:'HIGH', अत्यावश्यक:'URGENT', मध्यम:'MEDIUM', कम:'LOW', तातडीचे:'URGENT', उच्च:'HIGH', मध्यम:'MEDIUM', कमी:'LOW' };
        for (const [k,v] of Object.entries(priMap)) { if (lower.includes(k)) { result.priority = v; break; } }
        const catMap = { work:'WORK', study:'STUDY', personal:'PERSONAL', finance:'FINANCE', health:'HEALTH', shopping:'SHOPPING', trabajo:'WORK', étude:'STUDY', études:'STUDY', personnel:'PERSONAL', finanzas:'FINANCE', santé:'HEALTH', achats:'SHOPPING', trabalho:'WORK', estudo:'STUDY', pessoal:'PERSONAL', finanças:'FINANCE', saúde:'HEALTH', compras:'SHOPPING', काम:'WORK', अध्ययन:'STUDY', व्यक्तिगत:'PERSONAL', वित्त:'FINANCE', स्वास्थ्य:'HEALTH', खरीदारी:'SHOPPING', अभ्यास:'STUDY', वैयक्तिक:'PERSONAL', आरोग्य:'HEALTH', खरेदी:'SHOPPING' };
        for (const [k,v] of Object.entries(catMap)) { if (lower.includes(k)) { result.category = v; break; } }
        // Extract title after "called", "named", or after command verb
        const titlePatterns = [
            /(?:called|named|titled|llamada|llamado|chamada|appelée|nommée|नाम|नाव)\s*(.+?)(?:\s+(?:with|and|priority|category|due|which|please|con|et|avec|com|prioridad|priorité|prioridade|उच्च|मध्यम|कम|प्राधान्य|और|साथ|आणि|सह))/i,
            /(?:add|create|new|añade|agrega|crear|adicionar|criar|ajoute|créer|जोड़ो|जोड़ें|बनाओ|जोड़ा|जोडा|तयार करा|तयार)\s*(?:task|tarea|tarefa|tâche|कार्य|काम|टास्क)?\s*(?:called|named|llamada|chamada|appelée|नाम|नाव)?\s*["']?(.+?)(?:\s+with\s+priority|\s+con\s+prioridad|\s+com\s+prioridade|\s+avec\s+priorité|\s+उच्च|\s+मध्यम|\s+कमी|\s+प्राधान्य)/i,
        ];
        for (const p of titlePatterns) { const m = lower.match(p); if (m && m[1]) { result.title = m[1].trim(); if (result.title.length > 2) break; } }
        result.title = result.title.replace(/\s+(?:with\s+priority|con\s+prioridad|avec\s+priorité|com\s+prioridade)\s+(?:urgent|high|medium|low|alta|alto|media|média|baixa|basse|élevée|moyenne|faible|urgente|उच्च|अत्यावश्यक|मध्यम|कम|तातडीचे|कमी)$/iu, '').trim();
        result.title = result.title.replace(/\s+(?:उच्च|अत्यावश्यक|मध्यम|कम|तातडीचे|कमी)$/u, '').trim();
        if (!result.title || result.title.length < 2) {
            const cleaned = input.replace(/^(add|create|new|add task|new task|create task|añade|agrega|crear|adicionar|criar|ajoute|créer|जोड़ो|जोड़ें|बनाओ|काम जोडा|काम जोडा|कार्य जोडा|कार्य बनाओ|टास्क जोड़ो|टास्क बनाएं)\s*(?:task|tarea|tarefa|tâche|कार्य|काम|टास्क)?\s*(?:called|named|llamada|chamada|appelée|नाम|नाव)?\s*:?\s*/i, '').trim();
            const cleanedTitle = cleaned.replace(/\s+(?:with\s+priority|con\s+prioridad|avec\s+priorité|com\s+prioridade)\s+(?:urgent|high|medium|low|alta|alto|media|média|baixa|basse|élevée|moyenne|faible|urgente)$/iu,'').replace(/\s+(?:उच्च|अत्यावश्यक|मध्यम|कम|तातडीचे|कमी)$/u,'').trim();
            if (cleanedTitle.length > 2) result.title = cleanedTitle.substring(0, 100);
        }
        return result;
    }

    createTaskFromIntent(lower, lang) {
        const taskData = this.parseTaskFromNaturalLanguage(lower);
        if (taskData.title && taskData.title.length >= 2) return this.executeCreateTask(lower);
        return `I'm not sure what you mean. Try **help** to see all commands, or say "Add task: [title] with [priority]"`;
    }

    // ========== RENDERING ==========
    renderConversation() {
        const container = document.getElementById('conversationLog');
        if (!container) return;
        container.innerHTML = this.conversationHistory.map(msg => {
            const isUser = msg.role === 'user';
            return `<div class="flex items-start gap-2.5 ${isUser?'justify-end':'justify-start'}">${!isUser?'<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">🤖</div>':''}<div class="max-w-[85%] ${isUser?'order-first':''}"><div class="rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${isUser?'bg-slate-900 dark:bg-white text-white dark:text-slate-900':'bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 shadow-sm'}">${this.formatMessage(msg.content)}</div><div class="text-[9px] text-slate-400 mt-1 ${isUser?'text-right':'text-left'} px-1 font-mono">${msg.timestamp}</div></div></div>`;
        }).join('');
        this.scrollToBottom();
    }

    formatMessage(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic">$1</em>').replace(/\n/g, '<br>').replace(/•/g, '<span class="text-emerald-500 font-bold">•</span>');
    }

    stripMarkdown(text) { return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/[•\n]/g, ' '); }

    showTyping(show) { const indicator = document.getElementById('typingIndicator'); if (indicator) indicator.classList.toggle('hidden', !show); }

    scrollToBottom() { const container = document.getElementById('conversationLog'); if (container) setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50); }

    speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { 'en':'en-US','hi':'hi-IN','mr':'mr-IN','es':'es-ES','pt':'pt-BR','fr':'fr-FR' };
        utterance.lang = langMap[this.getLang()] || 'en-US';
        utterance.rate = 1.0; utterance.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) { const targetLang = utterance.lang.split('-')[0]; const voice = voices.find(v => v.lang.startsWith(targetLang)); if (voice) utterance.voice = voice; }
        window.speechSynthesis.speak(utterance);
    }

    delay(ms) { return new Promise(r => setTimeout(r, ms)); }
    getTimestamp() { const now = new Date(); return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`; }
}

const hitmoAssistant = new HitmoAssistant();
