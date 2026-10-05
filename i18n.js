// Hitmo's Planner - Internationalization (i18n) Module
// Supports: English, Spanish, Portuguese, French, German, Arabic, Hindi, Chinese

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('hitmo_lang') || 'en';
        this.translations = {};
        this.rtlLanguages = [];
        this.loadTranslations();
        this.addRequiredLanguages();
    }

    loadTranslations() {
        this.translations = {
            en: {
                // Header & Navigation
                appTitle: "Hitmo's Planner",
                appSubtitle: "Executive Performance & Task Management",
                enterprise: "Enterprise",
                searchPlaceholder: "Search tasks... (Ctrl+K)",
                newTask: "New Task",

                // Views
                flowBoard: "Flow Board",
                tableView: "Table View",
                eisenhowerMatrix: "Eisenhower Matrix",
                calendar: "Calendar",
                performance: "Performance",

                // Kanban/Flow Board Columns
                toDo: "To Do",
                inProgress: "In Progress",
                completed: "Completed",

                // Categories
                allItems: "All Items",
                work: "Work & Strategy",
                study: "Technical & Study",
                personal: "Personal",
                finance: "Finance & Capital",
                health: "Fitness & Health",
                shopping: "Shopping",
                other: "Other",

                // Priorities
                urgent: "Urgent",
                high: "High",
                medium: "Medium",
                low: "Low",

                // Task Modal
                createTask: "Create Task",
                editTask: "Edit Task",
                taskTitle: "Title",
                taskTitlePlaceholder: "e.g., Deliver Quarterly Architecture Spec",
                description: "Details / Notes",
                descriptionPlaceholder: "Context, sub-items, or deliverables...",
                priority: "Priority",
                category: "Category",
                deadline: "Deadline",
                tags: "Tags",
                tagsPlaceholder: "strategy, backend",
                saveTask: "Save Task",
                cancel: "Cancel",

                // Actions
                edit: "Edit",
                delete: "Delete",
                markComplete: "Mark Complete",

                // Stats
                totalTasks: "Total Tasks",
                completedTasks: "Completed",
                pendingTasks: "Pending",
                overdueTasks: "Overdue",
                completion: "Completion",
                executionScore: "Execution Score",
                focusCycles: "Focus Cycles",
                doneCount: "Completed",

                // Pomodoro
                focusTimer: "Focus Timer",
                deepWorkInterval: "Deep Work Interval",
                start: "Start",
                pause: "Pause",
                reset: "Reset",

                // Assistant
                hitmoAssistant: "Hitmo Assistant",
                productivityIntelligence: "Productivity Intelligence",
                askAssistant: "Ask assistant or 'Add task: ...'",
                auditPerformance: "📊 Audit Performance",
                cr7Focus: "⚽ CR7 Focus",
                starkAdvice: "🦾 Stark Advice",
                fastTask: "➕ Fast Task",

                // Quotes
                quoteBadge: "⚽ CR7",
                starkBadge: "🦾 STARK",

                // Analytics
                categoryAllocation: "Category Allocation",
                priorityDistribution: "Priority Distribution",
                executiveAudit: "Executive Audit",
                highFocusVelocity: "High Focus Execution Velocity",
                systemCalibrated: "System is calibrated for maximum output and minimal friction.",

                // Messages
                taskCreated: "Task created successfully",
                taskUpdated: "Task updated successfully",
                taskDeleted: "Task deleted successfully",
                taskCompleted: "🎉 Task completed! SUIIIII!",
                confirmDelete: "Are you sure you want to delete this task?",

                // Authentication
                login: "Login",
                signup: "Sign Up",
                email: "Email Address",
                password: "Password",
                confirmPassword: "Confirm Password",
                forgotPassword: "Forgot Password?",
                dontHaveAccount: "Don't have an account?",
                alreadyHaveAccount: "Already have an account?",
                signIn: "Sign In",
                createAccount: "Create Account",
                logout: "Logout",
                welcome: "Welcome",

                // Notifications
                newNotification: "New Notification",
                taskDueSoon: "Task due soon",
                pomodoroCompleted: "Pomodoro completed",
                deadlineApproaching: "Deadline approaching",

                // Table View
                status: "Status",
                taskDescription: "Task Description",
                pomodoro: "Pomodoro",
                actions: "Actions",
                allPriorities: "All Priorities",
                exportCSV: "Export CSV",
                items: "items",

                // Calendar
                calendarSchedule: "Calendar Schedule",
                deadlinesMilestones: "Deadlines and milestone roadmap",

                // Matrix
                doFirst: "Do First (Urgent & Important)",
                schedule: "Schedule (Important, Not Urgent)",
                delegate: "Delegate (Urgent, Not Important)",
                eliminate: "Eliminate (Neither)",
                done: "Done",
            },

            es: {
                // Spanish translations
                appTitle: "Planificador de Hitmo",
                appSubtitle: "Gestión Ejecutiva de Rendimiento y Tareas",
                enterprise: "Empresarial",
                searchPlaceholder: "Buscar tareas... (Ctrl+K)",
                newTask: "Nueva Tarea",

                flowBoard: "Tablero de Flujo",
                tableView: "Vista de Tabla",
                eisenhowerMatrix: "Matriz de Eisenhower",
                calendar: "Calendario",
                performance: "Rendimiento",

                toDo: "Por Hacer",
                inProgress: "En Progreso",
                completed: "Completado",

                allItems: "Todos los Elementos",
                work: "Trabajo y Estrategia",
                study: "Técnico y Estudio",
                personal: "Personal",
                finance: "Finanzas y Capital",
                health: "Fitness y Salud",
                shopping: "Compras",
                other: "Otro",

                urgent: "Urgente",
                high: "Alta",
                medium: "Media",
                low: "Baja",

                createTask: "Crear Tarea",
                editTask: "Editar Tarea",
                taskTitle: "Título",
                taskTitlePlaceholder: "ej., Diseñar Spec de Arquitectura",
                description: "Detalles / Notas",
                descriptionPlaceholder: "Contexto, sub-tareas o entregables...",
                priority: "Prioridad",
                category: "Categoría",
                deadline: "Fecha Límite",
                tags: "Etiquetas",
                tagsPlaceholder: "estrategia, backend",
                saveTask: "Guardar Tarea",
                cancel: "Cancelar",

                edit: "Editar",
                delete: "Eliminar",
                markComplete: "Marcar como Completo",

                totalTasks: "Tareas Totales",
                completedTasks: "Completadas",
                pendingTasks: "Pendientes",
                overdueTasks: "Vencidas",
                completion: "Finalización",
                executionScore: "Puntuación de Ejecución",
                focusCycles: "Ciclos de Enfoque",
                doneCount: "Completadas",

                focusTimer: "Temporizador de Enfoque",
                deepWorkInterval: "Intervalo de Trabajo Profundo",
                start: "Iniciar",
                pause: "Pausar",
                reset: "Reiniciar",

                hitmoAssistant: "Asistente Hitmo",
                productivityIntelligence: "Inteligencia de Productividad",
                askAssistant: "Pregunta al asistente o 'Añadir tarea: ...'",
                auditPerformance: "📊 Auditar Rendimiento",
                cr7Focus: "⚽ Enfoque CR7",
                starkAdvice: "🦾 Consejo de Stark",
                fastTask: "➕ Tarea Rápida",

                categoryAllocation: "Asignación de Categorías",
                priorityDistribution: "Distribución de Prioridades",
                executiveAudit: "Auditoría Ejecutiva",
                highFocusVelocity: "Alta Velocidad de Ejecución Enfocada",
                systemCalibrated: "El sistema está calibrado para máxima producción y mínima fricción.",

                taskCreated: "Tarea creada con éxito",
                taskUpdated: "Tarea actualizada con éxito",
                taskDeleted: "Tarea eliminada con éxito",
                taskCompleted: "🎉 ¡Tarea completada! ¡SUIIIII!",
                confirmDelete: "¿Estás seguro de que quieres eliminar esta tarea?",

                login: "Iniciar Sesión",
                signup: "Registrarse",
                email: "Correo Electrónico",
                password: "Contraseña",
                confirmPassword: "Confirmar Contraseña",
                forgotPassword: "¿Olvidaste tu contraseña?",
                dontHaveAccount: "¿No tienes una cuenta?",
                alreadyHaveAccount: "¿Ya tienes una cuenta?",
                signIn: "Iniciar Sesión",
                createAccount: "Crear Cuenta",
                logout: "Cerrar Sesión",
                welcome: "Bienvenido",

                newNotification: "Nueva Notificación",
                taskDueSoon: "Tarea próxima a vencer",
                pomodoroCompleted: "Pomodoro completado",
                deadlineApproaching: "Fecha límite se acerca",

                status: "Estado",
                taskDescription: "Descripción de Tarea",
                pomodoro: "Pomodoro",
                actions: "Acciones",
                allPriorities: "Todas las Prioridades",
                exportCSV: "Exportar CSV",
                items: "elementos",

                calendarSchedule: "Calendario de Tareas",
                deadlinesMilestones: "Fechas límite y hoja de ruta",

                doFirst: "Hacer Primero (Urgente e Importante)",
                schedule: "Programar (Importante, No Urgente)",
                delegate: "Delegar (Urgente, No Importante)",
                eliminate: "Eliminar (Ninguno)",
                done: "Hecho",
            },

            pt: {
                // Portuguese translations
                appTitle: "Planejador do Hitmo",
                appSubtitle: "Gestão Executiva de Desempenho e Tarefas",
                enterprise: "Empresarial",
                searchPlaceholder: "Pesquisar tarefas... (Ctrl+K)",
                newTask: "Nova Tarefa",

                flowBoard: "Quadro de Fluxo",
                tableView: "Visualização de Tabela",
                eisenhowerMatrix: "Matriz de Eisenhower",
                calendar: "Calendário",
                performance: "Desempenho",

                toDo: "A Fazer",
                inProgress: "Em Progresso",
                completed: "Concluído",

                allItems: "Todos os Itens",
                work: "Trabalho e Estratégia",
                study: "Técnico e Estudo",
                personal: "Pessoal",
                finance: "Finanças e Capital",
                health: "Fitness e Saúde",
                shopping: "Compras",
                other: "Outro",

                urgent: "Urgente",
                high: "Alta",
                medium: "Média",
                low: "Baixa",

                createTask: "Criar Tarefa",
                editTask: "Editar Tarefa",
                taskTitle: "Título",
                taskTitlePlaceholder: "ex., Desenhar Spec de Arquitetura",
                description: "Detalhes / Notas",
                descriptionPlaceholder: "Contexto, sub-tarefas ou entregáveis...",
                priority: "Prioridade",
                category: "Categoria",
                deadline: "Prazo",
                tags: "Tags",
                tagsPlaceholder: "estratégia, backend",
                saveTask: "Salvar Tarefa",
                cancel: "Cancelar",

                edit: "Editar",
                delete: "Excluir",
                markComplete: "Marcar como Concluído",

                totalTasks: "Total de Tarefas",
                completedTasks: "Concluídas",
                pendingTasks: "Pendentes",
                overdueTasks: "Atrasadas",
                completion: "Conclusão",
                executionScore: "Pontuação de Execução",
                focusCycles: "Ciclos de Foco",
                doneCount: "Concluídas",

                focusTimer: "Temporizador de Foco",
                deepWorkInterval: "Intervalo de Trabalho Profundo",
                start: "Iniciar",
                pause: "Pausar",
                reset: "Reiniciar",

                hitmoAssistant: "Assistente Hitmo",
                productivityIntelligence: "Inteligência de Produtividade",
                askAssistant: "Pergunte ao assistente ou 'Adicionar tarefa: ...'",
                auditPerformance: "📊 Auditar Desempenho",
                cr7Focus: "⚽ Foco CR7",
                starkAdvice: "🦾 Conselho do Stark",
                fastTask: "➕ Tarefa Rápida",

                categoryAllocation: "Alocação de Categorias",
                priorityDistribution: "Distribuição de Prioridades",
                executiveAudit: "Auditoria Executiva",
                highFocusVelocity: "Alta Velocidade de Execução Focada",
                systemCalibrated: "O sistema está calibrado para máxima produção e mínimo atrito.",

                taskCreated: "Tarefa criada com sucesso",
                taskUpdated: "Tarefa atualizada com sucesso",
                taskDeleted: "Tarefa excluída com sucesso",
                taskCompleted: "🎉 Tarefa concluída! SUIIIII!",
                confirmDelete: "Tem certeza de que deseja excluir esta tarefa?",

                login: "Entrar",
                signup: "Cadastrar",
                email: "Endereço de Email",
                password: "Senha",
                confirmPassword: "Confirmar Senha",
                forgotPassword: "Esqueceu sua senha?",
                dontHaveAccount: "Não tem uma conta?",
                alreadyHaveAccount: "Já tem uma conta?",
                signIn: "Entrar",
                createAccount: "Criar Conta",
                logout: "Sair",
                welcome: "Bem-vindo",

                newNotification: "Nova Notificação",
                taskDueSoon: "Tarefa próxima do prazo",
                pomodoroCompleted: "Pomodoro concluído",
                deadlineApproaching: "Prazo se aproximando",

                status: "Estado",
                taskDescription: "Descrição da Tarefa",
                pomodoro: "Pomodoro",
                actions: "Ações",
                allPriorities: "Todas as Prioridades",
                exportCSV: "Exportar CSV",
                items: "itens",

                calendarSchedule: "Calendário de Tarefas",
                deadlinesMilestones: "Prazos e roadmap de marcos",

                doFirst: "Fazer Primeiro (Urgente e Importante)",
                schedule: "Agendar (Importante, Não Urgente)",
                delegate: "Delegar (Urgente, Não Importante)",
                eliminate: "Eliminar (Nenhum)",
                done: "Feito",
            },

            fr: {
                // French translations
                appTitle: "Planificateur de Hitmo",
                appSubtitle: "Gestion Exécutive des Performances et Tâches",
                enterprise: "Entreprise",
                searchPlaceholder: "Rechercher des tâches... (Ctrl+K)",
                newTask: "Nouvelle Tâche",

                flowBoard: "Tableau de Flux",
                tableView: "Vue Tableau",
                eisenhowerMatrix: "Matrice d'Eisenhower",
                calendar: "Calendrier",
                performance: "Performance",

                toDo: "À Faire",
                inProgress: "En Cours",
                completed: "Terminé",

                allItems: "Tous les Éléments",
                work: "Travail et Stratégie",
                study: "Technique et Étude",
                personal: "Personnel",
                finance: "Finance et Capital",
                health: "Fitness et Santé",
                shopping: "Achats",
                other: "Autre",

                urgent: "Urgent",
                high: "Élevée",
                medium: "Moyenne",
                low: "Basse",

                createTask: "Créer une Tâche",
                editTask: "Modifier la Tâche",
                taskTitle: "Titre",
                taskTitlePlaceholder: "ex., Concevoir Spec d'Architecture",
                description: "Détails / Notes",
                descriptionPlaceholder: "Contexte, sous-tâches ou livrables...",
                priority: "Priorité",
                category: "Catégorie",
                deadline: "Date Limite",
                tags: "Tags",
                tagsPlaceholder: "stratégie, backend",
                saveTask: "Enregistrer la Tâche",
                cancel: "Annuler",

                edit: "Modifier",
                delete: "Supprimer",
                markComplete: "Marquer comme Terminé",

                totalTasks: "Tâches Totales",
                completedTasks: "Terminées",
                pendingTasks: "En Attente",
                overdueTasks: "En Retard",
                completion: "Achèvement",
                executionScore: "Score d'Exécution",
                focusCycles: "Cycles de Concentration",
                doneCount: "Terminées",

                focusTimer: "Minuteur de Concentration",
                deepWorkInterval: "Intervalle de Travail Profond",
                start: "Démarrer",
                pause: "Pause",
                reset: "Réinitialiser",

                hitmoAssistant: "Assistant Hitmo",
                productivityIntelligence: "Intelligence de Productivité",
                askAssistant: "Demandez à l'assistant ou 'Ajouter une tâche: ...'",
                auditPerformance: "📊 Auditer la Performance",
                cr7Focus: "⚽ Concentration CR7",
                starkAdvice: "🦾 Conseil de Stark",
                fastTask: "➕ Tâche Rapide",

                categoryAllocation: "Allocation des Catégories",
                priorityDistribution: "Distribution des Priorités",
                executiveAudit: "Audit Exécutif",
                highFocusVelocity: "Haute Vitesse d'Exécution Focalisée",
                systemCalibrated: "Le système est calibré pour une production maximale et un minimum de friction.",

                taskCreated: "Tâche créée avec succès",
                taskUpdated: "Tâche mise à jour avec succès",
                taskDeleted: "Tâche supprimée avec succès",
                taskCompleted: "🎉 Tâche terminée ! SUIIIII !",
                confirmDelete: "Êtes-vous sûr de vouloir supprimer cette tâche ?",

                login: "Connexion",
                signup: "S'inscrire",
                email: "Adresse Email",
                password: "Mot de Passe",
                confirmPassword: "Confirmer le Mot de Passe",
                forgotPassword: "Mot de passe oublié ?",
                dontHaveAccount: "Vous n'avez pas de compte ?",
                alreadyHaveAccount: "Vous avez déjà un compte ?",
                signIn: "Se Connecter",
                createAccount: "Créer un Compte",
                logout: "Déconnexion",
                welcome: "Bienvenue",

                newNotification: "Nouvelle Notification",
                taskDueSoon: "Tâche bientôt due",
                pomodoroCompleted: "Pomodoro terminé",
                deadlineApproaching: "Date limite approche",

                status: "Statut",
                taskDescription: "Description de la Tâche",
                pomodoro: "Pomodoro",
                actions: "Actions",
                allPriorities: "Toutes les Priorités",
                exportCSV: "Exporter CSV",
                items: "éléments",

                calendarSchedule: "Calendrier des Tâches",
                deadlinesMilestones: "Échéances et feuille de route",

                doFirst: "Faire en Premier (Urgent et Important)",
                schedule: "Planifier (Important, Non Urgent)",
                delegate: "Déléguer (Urgent, Non Important)",
                eliminate: "Éliminer (Ni l'un ni l'autre)",
                done: "Fait",
            },

            de: {
                // German translations
                appTitle: "Hitmos Planer",
                appSubtitle: "Executive Leistungs- und Aufgabenverwaltung",
                enterprise: "Enterprise",
                searchPlaceholder: "Aufgaben suchen... (Strg+K)",
                newTask: "Neue Aufgabe",

                flowBoard: "Fluss-Board",
                tableView: "Tabellenansicht",
                eisenhowerMatrix: "Eisenhower-Matrix",
                calendar: "Kalender",
                performance: "Leistung",

                toDo: "Zu Erledigen",
                inProgress: "In Bearbeitung",
                completed: "Abgeschlossen",

                allItems: "Alle Elemente",
                work: "Arbeit & Strategie",
                study: "Technisch & Studium",
                personal: "Persönlich",
                finance: "Finanzen & Kapital",
                health: "Fitness & Gesundheit",
                shopping: "Einkaufen",
                other: "Andere",

                urgent: "Dringend",
                high: "Hoch",
                medium: "Mittel",
                low: "Niedrig",

                createTask: "Aufgabe Erstellen",
                editTask: "Aufgabe Bearbeiten",
                taskTitle: "Titel",
                taskTitlePlaceholder: "z.B., Architektur-Spec liefern",
                description: "Details / Notizen",
                descriptionPlaceholder: "Kontext, Unteraufgaben oder Liefergegenstände...",
                priority: "Priorität",
                category: "Kategorie",
                deadline: "Frist",
                tags: "Tags",
                tagsPlaceholder: "strategie, backend",
                saveTask: "Aufgabe Speichern",
                cancel: "Abbrechen",

                edit: "Bearbeiten",
                delete: "Löschen",
                markComplete: "Als Erledigt Markieren",

                totalTasks: "Gesamte Aufgaben",
                completedTasks: "Abgeschlossen",
                pendingTasks: "Ausstehend",
                overdueTasks: "Überfällig",
                completion: "Fertigstellung",
                executionScore: "Ausführungsbewertung",
                focusCycles: "Fokuszyklen",
                doneCount: "Abgeschlossen",

                focusTimer: "Fokus-Timer",
                deepWorkInterval: "Tiefarbeitsintervall",
                start: "Starten",
                pause: "Pause",
                reset: "Zurücksetzen",

                hitmoAssistant: "Hitmo-Assistent",
                productivityIntelligence: "Produktivitätsintelligenz",
                askAssistant: "Fragen Sie den Assistenten oder 'Aufgabe hinzufügen: ...'",
                auditPerformance: "📊 Leistung Prüfen",
                cr7Focus: "⚽ CR7-Fokus",
                starkAdvice: "🦾 Stark-Rat",
                fastTask: "➕ Schnelle Aufgabe",

                categoryAllocation: "Kategorienzuteilung",
                priorityDistribution: "Prioritätsverteilung",
                executiveAudit: "Executive Audit",
                highFocusVelocity: "Hohe Fokussierte Ausführungsgeschwindigkeit",
                systemCalibrated: "Das System ist auf maximale Ausgabe und minimale Reibung kalibriert.",

                taskCreated: "Aufgabe erfolgreich erstellt",
                taskUpdated: "Aufgabe erfolgreich aktualisiert",
                taskDeleted: "Aufgabe erfolgreich gelöscht",
                taskCompleted: "🎉 Aufgabe abgeschlossen! SUIIIII!",
                confirmDelete: "Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?",

                login: "Anmelden",
                signup: "Registrieren",
                email: "E-Mail-Adresse",
                password: "Passwort",
                confirmPassword: "Passwort Bestätigen",
                forgotPassword: "Passwort vergessen?",
                dontHaveAccount: "Haben Sie kein Konto?",
                alreadyHaveAccount: "Haben Sie bereits ein Konto?",
                signIn: "Anmelden",
                createAccount: "Konto Erstellen",
                logout: "Abmelden",
                welcome: "Willkommen",

                newNotification: "Neue Benachrichtigung",
                taskDueSoon: "Aufgabe bald fällig",
                pomodoroCompleted: "Pomodoro abgeschlossen",
                deadlineApproaching: "Frist nähert sich",

                status: "Status",
                taskDescription: "Aufgabenbeschreibung",
                pomodoro: "Pomodoro",
                actions: "Aktionen",
                allPriorities: "Alle Prioritäten",
                exportCSV: "CSV Exportieren",
                items: "Elemente",

                calendarSchedule: "Aufgabenkalender",
                deadlinesMilestones: "Fristen und Meilenstein-Roadmap",

                doFirst: "Zuerst Erledigen (Dringend & Wichtig)",
                schedule: "Planen (Wichtig, Nicht Dringend)",
                delegate: "Delegieren (Dringend, Nicht Wichtig)",
                eliminate: "Eliminieren (Keines)",
                done: "Erledigt",
            },

            ar: {
                // Arabic translations (RTL)
                appTitle: "مخطط هيتمو",
                appSubtitle: "إدارة الأداء والمهام التنفيذية",
                enterprise: "مؤسسة",
                searchPlaceholder: "...بحث عن المهام (Ctrl+K)",
                newTask: "مهمة جديدة",

                flowBoard: "لوحة التدفق",
                tableView: "عرض الجدول",
                eisenhowerMatrix: "مصفوفة أيزنهاور",
                calendar: "التقويم",
                performance: "الأداء",

                toDo: "للقيام به",
                inProgress: "قيد التنفيذ",
                completed: "مكتمل",

                allItems: "جميع العناصر",
                work: "عمل واستراتيجية",
                study: "تقني ودراسة",
                personal: "شخصي",
                finance: "مالية ورأس مال",
                health: "اللياقة والصحة",
                shopping: "تسوق",
                other: "أخرى",

                urgent: "عاجل",
                high: "عالية",
                medium: "متوسطة",
                low: "منخفضة",

                createTask: "إنشاء مهمة",
                editTask: "تحرير المهمة",
                taskTitle: "العنوان",
                taskTitlePlaceholder: "مثال: تقديم مواصفات البنية",
                description: "التفاصيل / الملاحظات",
                descriptionPlaceholder: "السياق أو المهام الفرعية أو النتائج...",
                priority: "الأولوية",
                category: "الفئة",
                deadline: "الموعد النهائي",
                tags: "الوسوم",
                tagsPlaceholder: "استراتيجية، خلفية",
                saveTask: "حفظ المهمة",
                cancel: "إلغاء",

                edit: "تحرير",
                delete: "حذف",
                markComplete: "وضع علامة كمكتمل",

                totalTasks: "إجمالي المهام",
                completedTasks: "مكتملة",
                pendingTasks: "معلقة",
                overdueTasks: "متأخرة",
                completion: "الإنجاز",
                executionScore: "نقاط التنفيذ",
                focusCycles: "دورات التركيز",
                doneCount: "مكتمل",

                focusTimer: "مؤقت التركيز",
                deepWorkInterval: "فترة العمل العميق",
                start: "بدء",
                pause: "إيقاف مؤقت",
                reset: "إعادة تعيين",

                hitmoAssistant: "مساعد هيتمو",
                productivityIntelligence: "ذكاء الإنتاجية",
                askAssistant: "...اسأل المساعد أو 'أضف مهمة",
                auditPerformance: "📊 تدقيق الأداء",
                cr7Focus: "⚽ تركيز CR7",
                starkAdvice: "🦾 نصيحة ستارك",
                fastTask: "➕ مهمة سريعة",

                categoryAllocation: "توزيع الفئات",
                priorityDistribution: "توزيع الأولويات",
                executiveAudit: "التدقيق التنفيذي",
                highFocusVelocity: "سرعة تنفيذ عالية التركيز",
                systemCalibrated: "تم معايرة النظام لتحقيق أقصى إنتاج وأقل احتكاك.",

                taskCreated: "تم إنشاء المهمة بنجاح",
                taskUpdated: "تم تحديث المهمة بنجاح",
                taskDeleted: "تم حذف المهمة بنجاح",
                taskCompleted: "🎉 !تم إكمال المهمة! سووي",
                confirmDelete: "هل أنت متأكد من حذف هذه المهمة؟",

                login: "تسجيل الدخول",
                signup: "التسجيل",
                email: "عنوان البريد الإلكتروني",
                password: "كلمة المرور",
                confirmPassword: "تأكيد كلمة المرور",
                forgotPassword: "نسيت كلمة المرور؟",
                dontHaveAccount: "ليس لديك حساب؟",
                alreadyHaveAccount: "هل لديك حساب بالفعل؟",
                signIn: "تسجيل الدخول",
                createAccount: "إنشاء حساب",
                logout: "تسجيل الخروج",
                welcome: "مرحباً",

                newNotification: "إشعار جديد",
                taskDueSoon: "المهمة مستحقة قريباً",
                pomodoroCompleted: "اكتمل البومودورو",
                deadlineApproaching: "الموعد النهائي يقترب",

                status: "الحالة",
                taskDescription: "وصف المهمة",
                pomodoro: "بومودورو",
                actions: "الإجراءات",
                allPriorities: "جميع الأولويات",
                exportCSV: "تصدير CSV",
                items: "عناصر",

                calendarSchedule: "تقويم المهام",
                deadlinesMilestones: "المواعيد النهائية وخارطة الطريق",

                doFirst: "افعل أولاً (عاجل ومهم)",
                schedule: "جدولة (مهم غير عاجل)",
                delegate: "تفويض (عاجل غير مهم)",
                eliminate: "إزالة (لا شيء)",
                done: "تم",
            }
        };
    }

    addRequiredLanguages() {
        const extra = {
            en: {
                workspace:'Workspace', categories:'Categories', language:'Language', profile:'Profile', settings:'Settings', adminDashboard:'Admin Dashboard', logout:'Logout', login:'Login', register:'Register', adminLogin:'Admin Login', userLogin:'User Login', fullName:'Full Name', save:'Save', saved:'Settings saved.', profileSaved:'Profile saved.', backDashboard:'Back to dashboard', theme:'Theme', dark:'Dark', light:'Light', interfaceLanguage:'Interface language', notificationsEnabled:'Notifications enabled', aiEnabled:'AI assistant enabled', administrator:'Administrator', administration:'Administration', restrictedAdmin:'Restricted administrator access', adminEmail:'Admin email', signInAdmin:'Sign in as Admin', backUserLogin:'Back to user login', users:'Users', tasks:'Tasks', created:'Created', systemHealthy:'System healthy', openApp:'Open App', name:'Name', role:'Role', userId:'User ID', timezone:'Timezone', noDeadline:'No deadline', focusSessions:'Focus Sessions', taskDetails:'Task Details', editTaskButton:'Edit Task', descriptionLabel:'Description', tagsLabel:'Tags', createdLabel:'Created', noTasks:'No tasks found.', task:'Task', selected:'selected', deleteTasksConfirm:'Delete selected tasks?', previousQuote:'Previous Quote', nextQuote:'Next Quote', randomQuote:'Random Quote', readAloud:'Read Aloud', autoPlay:'Toggle Auto Play', changeLanguage:'Change Language', toggleTheme:'Toggle Theme', voiceInput:'Voice Input', openFocusTimer:'Open focus timer', close:'Close', privacy:'Privacy', terms:'Terms', support:'Support', search:'Search', signOut:'Sign out', selectLanguage:'Select language', languageChanged:'Language changed to', invalidCredentials:'Invalid email or password.', accountCreated:'Account created successfully.', passwordsMismatch:'Passwords do not match.', connectionError:'Cannot connect to the server.', dashboard:'Dashboard', features:'Features', about:'About', english:'English', hindi:'हिन्दी', marathi:'मराठी', spanish:'Español', french:'Français', portuguese:'Português', assistantThinking:'Hitmo Assistant is thinking...', voiceEnabled:'Voice enabled', voiceDisabled:'Voice disabled', taskCreatedViaAI:'Task created successfully.', taskUpdatedViaAI:'Task updated successfully.', taskDeletedViaAI:'Task deleted successfully.', noOverdue:'No overdue tasks!', themeDark:'Dark', themeLight:'Light', languagePrompt:'Which language should I use?', currentLanguage:'Current language'
            },
            es: { workspace:'Espacio de trabajo', categories:'Categorías', language:'Idioma', profile:'Perfil', settings:'Configuración', adminDashboard:'Panel de administración', logout:'Cerrar sesión', login:'Iniciar sesión', register:'Registrarse', adminLogin:'Acceso de administrador', userLogin:'Acceso de usuario', fullName:'Nombre completo', save:'Guardar', saved:'Configuración guardada.', profileSaved:'Perfil guardado.', backDashboard:'Volver al panel', theme:'Tema', dark:'Oscuro', light:'Claro', interfaceLanguage:'Idioma de la interfaz', notificationsEnabled:'Notificaciones activadas', aiEnabled:'Asistente de IA activado', administrator:'Administrador', administration:'Administración', restrictedAdmin:'Acceso restringido de administrador', adminEmail:'Correo del administrador', signInAdmin:'Entrar como administrador', backUserLogin:'Volver al acceso de usuario', users:'Usuarios', tasks:'Tareas', created:'Creado', systemHealthy:'Sistema correcto', openApp:'Abrir aplicación', name:'Nombre', role:'Rol', userId:'ID de usuario', timezone:'Zona horaria', noDeadline:'Sin fecha límite', focusSessions:'Sesiones de enfoque', taskDetails:'Detalles de la tarea', editTaskButton:'Editar tarea', descriptionLabel:'Descripción', tagsLabel:'Etiquetas', createdLabel:'Creado', noTasks:'No hay tareas.', task:'Tarea', selected:'seleccionadas', deleteTasksConfirm:'¿Eliminar las tareas seleccionadas?', previousQuote:'Cita anterior', nextQuote:'Cita siguiente', randomQuote:'Cita aleatoria', readAloud:'Leer en voz alta', autoPlay:'Activar/desactivar reproducción', changeLanguage:'Cambiar idioma', toggleTheme:'Cambiar tema', voiceInput:'Entrada de voz', openFocusTimer:'Abrir temporizador', close:'Cerrar', privacy:'Privacidad', terms:'Términos', support:'Soporte', search:'Buscar', signOut:'Cerrar sesión', selectLanguage:'Seleccionar idioma', languageChanged:'Idioma cambiado a', invalidCredentials:'Correo o contraseña no válidos.', accountCreated:'Cuenta creada correctamente.', passwordsMismatch:'Las contraseñas no coinciden.', connectionError:'No se puede conectar con el servidor.', dashboard:'Panel', features:'Funciones', about:'Acerca de', english:'Inglés', hindi:'Hindi', marathi:'Maratí', spanish:'Español', french:'Francés', portuguese:'Portugués', assistantThinking:'El asistente Hitmo está pensando...', voiceEnabled:'Voz activada', voiceDisabled:'Voz desactivada', noOverdue:'¡No hay tareas vencidas!'
            },
            pt: { workspace:'Área de trabalho', categories:'Categorias', language:'Idioma', profile:'Perfil', settings:'Configurações', adminDashboard:'Painel administrativo', logout:'Sair', login:'Entrar', register:'Cadastrar', adminLogin:'Login do administrador', userLogin:'Login do usuário', fullName:'Nome completo', save:'Salvar', saved:'Configurações salvas.', profileSaved:'Perfil salvo.', backDashboard:'Voltar ao painel', theme:'Tema', dark:'Escuro', light:'Claro', interfaceLanguage:'Idioma da interface', notificationsEnabled:'Notificações ativadas', aiEnabled:'Assistente de IA ativado', administrator:'Administrador', administration:'Administração', restrictedAdmin:'Acesso restrito de administrador', adminEmail:'E-mail do administrador', signInAdmin:'Entrar como administrador', backUserLogin:'Voltar ao login do usuário', users:'Usuários', tasks:'Tarefas', created:'Criado', systemHealthy:'Sistema saudável', openApp:'Abrir aplicativo', name:'Nome', role:'Função', userId:'ID do usuário', timezone:'Fuso horário', noDeadline:'Sem prazo', focusSessions:'Sessões de foco', taskDetails:'Detalhes da tarefa', editTaskButton:'Editar tarefa', descriptionLabel:'Descrição', tagsLabel:'Tags', createdLabel:'Criado', noTasks:'Nenhuma tarefa encontrada.', task:'Tarefa', selected:'selecionadas', deleteTasksConfirm:'Excluir tarefas selecionadas?', previousQuote:'Citação anterior', nextQuote:'Próxima citação', randomQuote:'Citação aleatória', readAloud:'Ler em voz alta', autoPlay:'Alternar reprodução automática', changeLanguage:'Alterar idioma', toggleTheme:'Alterar tema', voiceInput:'Entrada de voz', openFocusTimer:'Abrir temporizador', close:'Fechar', privacy:'Privacidade', terms:'Termos', support:'Suporte', search:'Pesquisar', signOut:'Sair', selectLanguage:'Selecionar idioma', languageChanged:'Idioma alterado para', invalidCredentials:'E-mail ou senha inválidos.', accountCreated:'Conta criada com sucesso.', passwordsMismatch:'As senhas não coincidem.', connectionError:'Não foi possível conectar ao servidor.', dashboard:'Painel', features:'Recursos', about:'Sobre', english:'Inglês', hindi:'Hindi', marathi:'Marata', spanish:'Espanhol', french:'Francês', portuguese:'Português', assistantThinking:'O Assistente Hitmo está pensando...', voiceEnabled:'Voz ativada', voiceDisabled:'Voz desativada', noOverdue:'Nenhuma tarefa atrasada!'
            },
            fr: { workspace:'Espace de travail', categories:'Catégories', language:'Langue', profile:'Profil', settings:'Paramètres', adminDashboard:'Panneau admin', logout:'Déconnexion', login:'Connexion', register:'Créer un compte', adminLogin:'Connexion administrateur', userLogin:'Connexion utilisateur', fullName:'Nom complet', save:'Enregistrer', saved:'Paramètres enregistrés.', profileSaved:'Profil enregistré.', backDashboard:'Retour au tableau de bord', theme:'Thème', dark:'Sombre', light:'Clair', interfaceLanguage:'Langue de l’interface', notificationsEnabled:'Notifications activées', aiEnabled:'Assistant IA activé', administrator:'Administrateur', administration:'Administration', restrictedAdmin:'Accès administrateur restreint', adminEmail:'E-mail administrateur', signInAdmin:'Se connecter comme administrateur', backUserLogin:'Retour à la connexion utilisateur', users:'Utilisateurs', tasks:'Tâches', created:'Créé', systemHealthy:'Système opérationnel', openApp:'Ouvrir l’application', name:'Nom', role:'Rôle', userId:'ID utilisateur', timezone:'Fuseau horaire', noDeadline:'Aucune échéance', focusSessions:'Sessions de concentration', taskDetails:'Détails de la tâche', editTaskButton:'Modifier la tâche', descriptionLabel:'Description', tagsLabel:'Étiquettes', createdLabel:'Créé', noTasks:'Aucune tâche trouvée.', task:'Tâche', selected:'sélectionnées', deleteTasksConfirm:'Supprimer les tâches sélectionnées ?', previousQuote:'Citation précédente', nextQuote:'Citation suivante', randomQuote:'Citation aléatoire', readAloud:'Lire à voix haute', autoPlay:'Activer/désactiver la lecture', changeLanguage:'Changer de langue', toggleTheme:'Changer de thème', voiceInput:'Entrée vocale', openFocusTimer:'Ouvrir le minuteur', close:'Fermer', privacy:'Confidentialité', terms:'Conditions', support:'Support', search:'Rechercher', signOut:'Déconnexion', selectLanguage:'Choisir la langue', languageChanged:'Langue changée en', invalidCredentials:'E-mail ou mot de passe invalide.', accountCreated:'Compte créé avec succès.', passwordsMismatch:'Les mots de passe ne correspondent pas.', connectionError:'Impossible de se connecter au serveur.', dashboard:'Tableau de bord', features:'Fonctionnalités', about:'À propos', english:'Anglais', hindi:'Hindi', marathi:'Marathi', spanish:'Espagnol', french:'Français', portuguese:'Portugais', assistantThinking:'L’assistant Hitmo réfléchit...', voiceEnabled:'Voix activée', voiceDisabled:'Voix désactivée', noOverdue:'Aucune tâche en retard !'
            },
            hi: {
                appTitle:'हिटमो प्लानर', appSubtitle:'उत्पादकता और कार्य प्रबंधन', enterprise:'एंटरप्राइज़', searchPlaceholder:'कार्य खोजें... (Ctrl+K)', newTask:'नया कार्य', flowBoard:'फ्लो बोर्ड', tableView:'तालिका दृश्य', eisenhowerMatrix:'आइज़नहावर मैट्रिक्स', calendar:'कैलेंडर', performance:'प्रदर्शन', toDo:'करना है', inProgress:'प्रगति में', completed:'पूर्ण', allItems:'सभी आइटम', work:'कार्य और रणनीति', study:'तकनीकी और अध्ययन', personal:'व्यक्तिगत', finance:'वित्त और पूंजी', health:'फिटनेस और स्वास्थ्य', shopping:'खरीदारी', other:'अन्य', urgent:'अत्यावश्यक', high:'उच्च', medium:'मध्यम', low:'कम', createTask:'कार्य बनाएँ', editTask:'कार्य संपादित करें', taskTitle:'शीर्षक', taskTitlePlaceholder:'जैसे, आर्किटेक्चर स्पेक पूरा करें', description:'विवरण / नोट्स', descriptionPlaceholder:'संदर्भ, उप-कार्य या डिलिवरेबल्स...', priority:'प्राथमिकता', category:'श्रेणी', deadline:'अंतिम तिथि', tags:'टैग', tagsPlaceholder:'रणनीति, बैकएंड', saveTask:'कार्य सहेजें', cancel:'रद्द करें', edit:'संपादित करें', delete:'हटाएँ', markComplete:'पूर्ण चिह्नित करें', totalTasks:'कुल कार्य', completedTasks:'पूर्ण', pendingTasks:'लंबित', overdueTasks:'समय से बाहर', completion:'पूर्णता', executionScore:'निष्पादन स्कोर', focusCycles:'फोकस चक्र', doneCount:'पूर्ण', focusTimer:'फोकस टाइमर', deepWorkInterval:'डीप वर्क अंतराल', start:'शुरू', pause:'रोकें', reset:'रीसेट', hitmoAssistant:'हिटमो सहायक', productivityIntelligence:'उत्पादकता बुद्धिमत्ता', askAssistant:'सहायक से पूछें या "Add task: ..."', auditPerformance:'📊 प्रदर्शन जाँचें', cr7Focus:'⚽ CR7 फोकस', starkAdvice:'🦾 स्टार्क सलाह', fastTask:'➕ त्वरित कार्य', categoryAllocation:'श्रेणी वितरण', priorityDistribution:'प्राथमिकता वितरण', executiveAudit:'कार्यकारी ऑडिट', highFocusVelocity:'उच्च फोकस निष्पादन गति', systemCalibrated:'सिस्टम अधिकतम आउटपुट और न्यूनतम बाधा के लिए तैयार है।', taskCreated:'कार्य सफलतापूर्वक बनाया गया', taskUpdated:'कार्य सफलतापूर्वक अपडेट हुआ', taskDeleted:'कार्य सफलतापूर्वक हटाया गया', taskCompleted:'🎉 कार्य पूरा हुआ!', confirmDelete:'क्या आप यह कार्य हटाना चाहते हैं?', login:'लॉग इन', signup:'साइन अप', email:'ईमेल पता', password:'पासवर्ड', confirmPassword:'पासवर्ड की पुष्टि करें', forgotPassword:'पासवर्ड भूल गए?', dontHaveAccount:'खाता नहीं है?', alreadyHaveAccount:'पहले से खाता है?', signIn:'साइन इन', createAccount:'खाता बनाएँ', logout:'लॉग आउट', welcome:'स्वागत है', newNotification:'नई सूचना', taskDueSoon:'कार्य जल्द देय है', pomodoroCompleted:'पोमोडोरो पूरा हुआ', deadlineApproaching:'अंतिम तिथि पास है', status:'स्थिति', taskDescription:'कार्य विवरण', pomodoro:'पोमोडोरो', actions:'क्रियाएँ', allPriorities:'सभी प्राथमिकताएँ', exportCSV:'CSV निर्यात करें', items:'आइटम', calendarSchedule:'कैलेंडर शेड्यूल', deadlinesMilestones:'अंतिम तिथियाँ और माइलस्टोन', doFirst:'पहले करें', schedule:'शेड्यूल करें', delegate:'सौंपें', eliminate:'हटाएँ', done:'पूर्ण', workspace:'वर्कस्पेस', categories:'श्रेणियाँ', language:'भाषा', profile:'प्रोफ़ाइल', settings:'सेटिंग्स', adminDashboard:'एडमिन डैशबोर्ड', register:'पंजीकरण', adminLogin:'एडमिन लॉगिन', userLogin:'यूज़र लॉगिन', fullName:'पूरा नाम', save:'सहेजें', saved:'सेटिंग्स सहेजी गईं।', profileSaved:'प्रोफ़ाइल सहेजी गई।', backDashboard:'डैशबोर्ड पर वापस', theme:'थीम', dark:'डार्क', light:'लाइट', interfaceLanguage:'इंटरफ़ेस भाषा', notificationsEnabled:'सूचनाएँ सक्षम', aiEnabled:'AI सहायक सक्षम', administrator:'व्यवस्थापक', administration:'प्रशासन', restrictedAdmin:'सीमित व्यवस्थापक पहुँच', adminEmail:'एडमिन ईमेल', signInAdmin:'एडमिन के रूप में साइन इन', backUserLogin:'यूज़र लॉगिन पर वापस', users:'उपयोगकर्ता', tasks:'कार्य', created:'बनाया गया', systemHealthy:'सिस्टम ठीक है', openApp:'ऐप खोलें', name:'नाम', role:'भूमिका', userId:'यूज़र ID', timezone:'समय क्षेत्र', noDeadline:'कोई अंतिम तिथि नहीं', focusSessions:'फोकस सत्र', taskDetails:'कार्य विवरण', editTaskButton:'कार्य संपादित करें', descriptionLabel:'विवरण', tagsLabel:'टैग', createdLabel:'बनाया गया', noTasks:'कोई कार्य नहीं मिला।', task:'कार्य', selected:'चयनित', deleteTasksConfirm:'चयनित कार्य हटाएँ?', previousQuote:'पिछला उद्धरण', nextQuote:'अगला उद्धरण', randomQuote:'यादृच्छिक उद्धरण', readAloud:'जोर से पढ़ें', autoPlay:'ऑटो प्ले बदलें', changeLanguage:'भाषा बदलें', toggleTheme:'थीम बदलें', voiceInput:'वॉइस इनपुट', openFocusTimer:'फोकस टाइमर खोलें', close:'बंद करें', privacy:'गोपनीयता', terms:'शर्तें', support:'सहायता', search:'खोजें', signOut:'साइन आउट', selectLanguage:'भाषा चुनें', languageChanged:'भाषा बदलकर', english:'अंग्रेज़ी', hindi:'हिन्दी', marathi:'मराठी', spanish:'स्पेनिश', french:'फ़्रेंच', portuguese:'पुर्तगाली', assistantThinking:'हिटमो सहायक सोच रहा है...', voiceEnabled:'वॉइस सक्षम', voiceDisabled:'वॉइस बंद', noOverdue:'कोई लंबित समय-पार कार्य नहीं है!', dashboard:'डैशबोर्ड', features:'सुविधाएँ', about:'के बारे में'
            },
            mr: {
                appTitle:'हिटमो प्लॅनर', appSubtitle:'उत्पादकता आणि काम व्यवस्थापन', enterprise:'एंटरप्राइझ', searchPlaceholder:'कामे शोधा... (Ctrl+K)', newTask:'नवीन काम', flowBoard:'फ्लो बोर्ड', tableView:'टेबल दृश्य', eisenhowerMatrix:'आयझेनहॉवर मॅट्रिक्स', calendar:'कॅलेंडर', performance:'कामगिरी', toDo:'करायचे', inProgress:'प्रगतीपथावर', completed:'पूर्ण', allItems:'सर्व कामे', work:'काम आणि रणनीती', study:'तांत्रिक आणि अभ्यास', personal:'वैयक्तिक', finance:'अर्थ आणि भांडवल', health:'फिटनेस आणि आरोग्य', shopping:'खरेदी', other:'इतर', urgent:'तातडीचे', high:'उच्च', medium:'मध्यम', low:'कमी', createTask:'काम तयार करा', editTask:'काम संपादित करा', taskTitle:'शीर्षक', taskTitlePlaceholder:'उदा., आर्किटेक्चर स्पेक पूर्ण करा', description:'तपशील / नोंदी', descriptionPlaceholder:'संदर्भ, उप-कामे किंवा डिलिव्हरेबल्स...', priority:'प्राधान्य', category:'श्रेणी', deadline:'अंतिम तारीख', tags:'टॅग', tagsPlaceholder:'रणनीती, बॅकएंड', saveTask:'काम जतन करा', cancel:'रद्द करा', edit:'संपादित करा', delete:'हटवा', markComplete:'पूर्ण म्हणून चिन्हांकित करा', totalTasks:'एकूण कामे', completedTasks:'पूर्ण', pendingTasks:'प्रलंबित', overdueTasks:'मुदत संपलेली', completion:'पूर्णता', executionScore:'अंमलबजावणी गुण', focusCycles:'फोकस सायकल', doneCount:'पूर्ण', focusTimer:'फोकस टाइमर', deepWorkInterval:'डीप वर्क अंतराल', start:'सुरू', pause:'थांबवा', reset:'रीसेट', hitmoAssistant:'हिटमो सहाय्यक', productivityIntelligence:'उत्पादकता बुद्धिमत्ता', askAssistant:'सहाय्यकाला विचारा किंवा "Add task: ..."', auditPerformance:'📊 कामगिरी तपासा', cr7Focus:'⚽ CR7 फोकस', starkAdvice:'🦾 स्टार्कचा सल्ला', fastTask:'➕ झटपट काम', categoryAllocation:'श्रेणी वाटप', priorityDistribution:'प्राधान्य वितरण', executiveAudit:'कार्यकारी ऑडिट', highFocusVelocity:'उच्च फोकस अंमलबजावणी वेग', systemCalibrated:'सिस्टम जास्तीत जास्त आउटपुट आणि कमी अडथळ्यासाठी तयार आहे.', taskCreated:'काम यशस्वीरित्या तयार झाले', taskUpdated:'काम यशस्वीरित्या अपडेट झाले', taskDeleted:'काम यशस्वीरित्या हटवले', taskCompleted:'🎉 काम पूर्ण झाले!', confirmDelete:'हे काम हटवायचे का?', login:'लॉगिन', signup:'साइन अप', email:'ईमेल पत्ता', password:'पासवर्ड', confirmPassword:'पासवर्डची पुष्टी करा', forgotPassword:'पासवर्ड विसरलात?', dontHaveAccount:'खाते नाही?', alreadyHaveAccount:'आधीच खाते आहे?', signIn:'साइन इन', createAccount:'खाते तयार करा', logout:'लॉगआउट', welcome:'स्वागत आहे', newNotification:'नवीन सूचना', taskDueSoon:'कामाची मुदत जवळ आली आहे', pomodoroCompleted:'पोमोडोरो पूर्ण', deadlineApproaching:'अंतिम तारीख जवळ आली आहे', status:'स्थिती', taskDescription:'कामाचे वर्णन', pomodoro:'पोमोडोरो', actions:'क्रिया', allPriorities:'सर्व प्राधान्ये', exportCSV:'CSV निर्यात करा', items:'कामे', calendarSchedule:'कॅलेंडर वेळापत्रक', deadlinesMilestones:'अंतिम तारखा आणि माइलस्टोन्स', doFirst:'आधी करा', schedule:'वेळापत्रक करा', delegate:'सोपवा', eliminate:'काढून टाका', done:'पूर्ण', workspace:'वर्कस्पेस', categories:'श्रेणी', language:'भाषा', profile:'प्रोफाइल', settings:'सेटिंग्स', adminDashboard:'अॅडमिन डॅशबोर्ड', register:'नोंदणी', adminLogin:'अॅडमिन लॉगिन', userLogin:'वापरकर्ता लॉगिन', fullName:'पूर्ण नाव', save:'जतन करा', saved:'सेटिंग्स जतन केल्या.', profileSaved:'प्रोफाइल जतन झाले.', backDashboard:'डॅशबोर्डवर परत', theme:'थीम', dark:'डार्क', light:'लाइट', interfaceLanguage:'इंटरफेस भाषा', notificationsEnabled:'सूचना सक्षम', aiEnabled:'AI सहाय्यक सक्षम', administrator:'प्रशासक', administration:'प्रशासन', restrictedAdmin:'मर्यादित प्रशासक प्रवेश', adminEmail:'अॅडमिन ईमेल', signInAdmin:'अॅडमिन म्हणून साइन इन', backUserLogin:'वापरकर्ता लॉगिनवर परत', users:'वापरकर्ते', tasks:'कामे', created:'तयार केले', systemHealthy:'सिस्टम व्यवस्थित आहे', openApp:'अॅप उघडा', name:'नाव', role:'भूमिका', userId:'वापरकर्ता ID', timezone:'टाइमझोन', noDeadline:'अंतिम तारीख नाही', focusSessions:'फोकस सत्रे', taskDetails:'कामाचे तपशील', editTaskButton:'काम संपादित करा', descriptionLabel:'वर्णन', tagsLabel:'टॅग', createdLabel:'तयार केले', noTasks:'कोणतेही काम सापडले नाही.', task:'काम', selected:'निवडलेले', deleteTasksConfirm:'निवडलेली कामे हटवायची?', previousQuote:'मागील कोट', nextQuote:'पुढील कोट', randomQuote:'यादृच्छिक कोट', readAloud:'मोठ्याने वाचा', autoPlay:'ऑटो प्ले बदला', changeLanguage:'भाषा बदला', toggleTheme:'थीम बदला', voiceInput:'व्हॉइस इनपुट', openFocusTimer:'फोकस टाइमर उघडा', close:'बंद', privacy:'गोपनीयता', terms:'अटी', support:'मदत', search:'शोधा', signOut:'साइन आउट', selectLanguage:'भाषा निवडा', languageChanged:'भाषा बदलली:', english:'इंग्रजी', hindi:'हिंदी', marathi:'मराठी', spanish:'स्पॅनिश', french:'फ्रेंच', portuguese:'पोर्तुगीज', assistantThinking:'हिटमो सहाय्यक विचार करत आहे...', voiceEnabled:'व्हॉइस सुरू', voiceDisabled:'व्हॉइस बंद', noOverdue:'एकही मुदत संपलेले काम नाही!', dashboard:'डॅशबोर्ड', features:'वैशिष्ट्ये', about:'माहिती'
            }
        };
        for (const lang of ['en','es','pt','fr','hi','mr']) {
            this.translations[lang] = { ...(this.translations[lang] || this.translations.en), ...(extra[lang] || {}) };
        }
    }

    // Get translated text
    t(key) {
        const lang = this.translations[this.currentLang] || this.translations.en;
        return lang[key] || this.translations.en[key] || key;
    }

    // Change language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('hitmo_lang', lang);
            this.applyLanguage();
            this.updateDirection();
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Update text direction for RTL languages
    updateDirection() {
        const isRTL = this.rtlLanguages.includes(this.currentLang);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
    }

    // Apply translations to entire page
    applyLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update all placeholders with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });

        // Trigger custom event for dynamic content updates
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { lang: this.currentLang }
        }));
    }

    // Get supported languages
    getSupportedLanguages() {
        return [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'pt', name: 'Português', flag: '🇵🇹' }
        ];
    }
}

// Global instance
const i18n = new I18n();
