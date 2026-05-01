# 0001. Stack Choice

## Context
We are implementing a Consultation Request System that must be deployable on GitHub Pages as a static application. The requirements (NFR-01) specify an SPA or static site, and do not mandate any complex multi-view state or heavy UI components that strictly require a framework.

## Decision
We will use Vanilla HTML, CSS, and JavaScript (ES6+). No build step (like Vite or Webpack) and no UI framework (like React or Vue) will be used.

## Options Considered
- **Vanilla HTML/CSS/JS**: Simplest, no build step, perfectly fits a single-page CRUD app with minimal state.
- **Vite + React**: Overkill for this application, would require setting up build pipelines and dependency management.
- **Vite + Vanilla JS**: Offers module bundling and modern dev server, but still introduces a build step which is unnecessary for a lightweight single-file logic app.

## Consequences
- **Positive**: Zero configuration, instant deployment to GitHub Pages via static file serving.
- **Negative**: Manual DOM manipulation and state synchronization, but acceptable given the small scope.

## Requirements Touched
- NFR-01: Type of application.
- NFR-02: Adaptability (Vanilla CSS will handle mobile responsiveness).
