# Hitmo Planner v6 changes

## Multilingual
- Added exactly six supported languages: English, Hindi, Marathi, Spanish, French, Portuguese.
- Added language selector to dashboard and standalone pages.
- Saved language preference per user in SQLite.
- Added Hindi and Marathi translations across the main application UI.
- Added multilingual labels for profile, settings, admin, login and registration pages.
- Added multilingual AI command recognition for common productivity commands.
- Added multilingual AI responses for core task, analytics, calendar, theme, language and motivation flows.
- Added Hindi/Marathi/Spanish/French/Portuguese browser voice locale mappings.

## Reliability fixes
- Fixed UUID task IDs being incorrectly converted with parseInt().
- Fixed inline task buttons so UUIDs are passed safely.
- Fixed bulk delete to use the real authenticated task API.
- Fixed Pomodoro persistence with a real backend endpoint.
- Fixed calendar date formatting for the selected language.
- Fixed category filter selection after language changes.
- Fixed language menu functionality.
- Fixed user preference restoration after login.
- Fixed theme persistence per user.
- Added /dashboard and /admin/dashboard route aliases.

## UI
- Improved light mode using the same design tokens as dark mode.
- Improved card, input, sidebar and text contrast in light mode.
- Added language controls to auth/profile/admin/settings pages.

## Deployment
- Kept the single Node.js + SQLite architecture.
- Added a dependency-free .env loader.
- Kept the Windows startup/port handling scripts.
