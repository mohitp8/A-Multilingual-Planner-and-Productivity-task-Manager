# Hitmo Planner — Clean Multilingual Build v6

A multilingual productivity-management website with:

- Login / registration / logout
- Unique UUID per user
- Strict per-user database isolation
- Admin login and admin dashboard
- Task management with priority and categories
- Flow Board, Table View and Eisenhower Matrix
- Calendar and productivity analytics
- Pomodoro focus timer
- AI productivity assistant with persistent chat history
- Voice input/output where the browser supports it
- Multilingual website + AI assistant
- Dark and improved light themes
- SQLite persistence with no separate database installation

## Supported languages

The website and core AI assistant support exactly these six languages:

1. English
2. हिन्दी (Hindi)
3. मराठी (Marathi)
4. Español (Spanish)
5. Français (French)
6. Português (Portuguese)

The selected language is saved in the user's database preferences and restored after login.

## Architecture

```text
Browser
  ↓
Node.js 22+ server
  ├── Static frontend
  ├── Authentication
  ├── REST API
  ├── AI/task assistant logic
  └── SQLite database
          ↓
      data/hitmo.db
```

There is intentionally **one active application stack**. The old Java server, Prisma/PostgreSQL path, and duplicate API implementations are not required for this build.

## Requirements

- Node.js 22 or newer
- Modern browser

Check Node:

```bash
node -v
```

## Start on Windows

Double-click:

```text
start-planner.bat
```

The launcher checks port 3000 and starts the correct server. If Hitmo Planner is already running, it reuses it instead of starting a second copy.

Or run manually:

```bash
node server.js
```

Then open:

```text
http://localhost:3000/
```

The root URL opens the login page.

## Default administrator

On a fresh database the server creates:

```text
Email:    admin@hitmo.local
Password: Admin@12345
```

For real deployment, change these using `.env` or your hosting provider's environment variables:

```text
PORT=3000
HOST=127.0.0.1
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=use-a-strong-password
```

The project includes a dependency-free `.env` loader for local use.

## Authentication flow

```text
Open website
    ↓
Login / Register
    ↓
Authentication check
    ↓
Dashboard
```

Unauthenticated users cannot access private task APIs. Refreshing the page restores a valid session.

The authenticated header provides:

- User name
- Profile
- Settings
- Logout
- Admin Dashboard for administrators
- Language selector
- Theme toggle

## Per-user database isolation

Every account receives a UUID.

```text
users.id
   ↓
 ┌─────────────────────────────────────┐
 │                                     │
tasks.user_id                    chat_conversations.user_id
notifications.user_id            productivity_events.user_id
user_profiles.user_id            user_preferences.user_id
```

Backend queries are always scoped to the authenticated user. The frontend cannot select another user's ID to read or modify their data.

## Multilingual AI assistant

The AI assistant understands common productivity commands in all six supported languages. Examples include:

```text
English:  Show my tasks
Hindi:    कार्य दिखाओ
Marathi:  कामे दाखवा
Spanish:  mostrar tareas
French:   afficher les tâches
Portuguese: mostrar tarefas
```

It can perform supported actions such as:

- List tasks
- Search tasks
- Filter tasks
- Create tasks
- Update tasks
- Complete tasks
- Delete tasks
- Move tasks
- Start Pomodoro
- Show analytics
- Show calendar information
- Export CSV
- Change theme
- Change language

The selected language also controls the assistant's core response text and browser voice language where a matching speech voice is available.

## Light / dark theme

Dark mode remains the primary visual style.

The light mode was rebuilt to use the same design system with:

- softer neutral background
- readable dark text
- visible borders
- light glass cards
- usable inputs
- better navigation contrast
- improved dropdown visibility

Theme preference is stored per user and restored after login.

## Database

The database is created automatically at:

```text
data/hitmo.db
```

Do not delete this file if you want to keep your local accounts and tasks.

A fresh installation creates the schema automatically.

## Important development note

Do not run multiple copies of the server on port 3000. If the port is occupied, use:

```text
stop-planner.bat
```

and then start the application again.

## Production deployment

For a first deployment, use a Node.js hosting service that supports persistent disk storage if you want to keep SQLite.

The application listens on the `PORT` environment variable supplied by the host.

For a multi-instance production deployment, move the SQLite layer to a managed PostgreSQL database rather than running multiple application instances against one local SQLite file.
