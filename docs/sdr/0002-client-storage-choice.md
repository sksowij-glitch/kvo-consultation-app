# 0002. Client Storage Choice

## Context
The system needs to save and manage user consultation requests across page reloads (FR-11), without a real server-side database.

## Decision
We will use browser `localStorage` as the primary persistence mechanism. A seed data payload (`data/demo.json`) will be provided to allow the user to reset the environment.

## Options Considered
- **In-memory**: Rejected, does not survive page reloads.
- **sessionStorage**: Rejected, data is lost when the tab is closed.
- **localStorage**: Chosen. Easy to implement synchronous API, persists across sessions, sufficient capacity (usually 5MB) for text-based consultation requests.
- **IndexedDB**: Rejected. Overkill for simple flat list of requests. We do not need complex queries or binary storage.

## Consequences
- **Positive**: Meets all FR-11 requirements trivially.
- **Negative**: Data is isolated to the specific browser and device. If the user clears browser data or uses incognito mode, their requests are lost (acknowledged in limitations).

## Requirements Touched
- FR-11: Data persistence.
- AC-04: Session recovery.
