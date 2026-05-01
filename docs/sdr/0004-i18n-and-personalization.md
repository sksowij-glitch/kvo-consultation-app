# 0004. i18n Implementation and User Personalization

## Context
The application needs to support multiple languages (Ukrainian and English) and provide a personalized experience for students without a backend authentication system.

## Decision
1.  **i18n**: We implemented a dictionary-based translation system within `app.js`. UI elements use `data-i18n` attributes for static text and a `t()` helper function for dynamic content.
2.  **Personalization**: A persistent "Nickname" field is added to the header. This nickname is stored in `localStorage` and automatically populates the `author` field of new consultation requests.
3.  **State Persistence**: Both the selected language and the nickname are persisted in `localStorage` to survive page reloads.

## Options Considered
- **External i18n Libraries (i18next)**: Too heavy for a simple Vanilla JS project.
- **URL-based Language (e.g., /en/)**: Not compatible with simple static hosting without complex routing.
- **Internal Dictionary (Chosen)**: Lightweight, easy to maintain, and fast.

## Consequences
- **Positive**: Zero external dependencies, instant language switching, improved UX through nickname persistence.
- **Negative**: Manual maintenance of the dictionary in the JS file.

## Requirements Touched
- FR-01: Nickname population.
- NFR-02: User experience.
- Bonus: Internationalization support.
