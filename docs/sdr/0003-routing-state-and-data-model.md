# 0003. Routing, State, and Data Model

## Context
The application needs to switch between viewing a dashboard/list of requests and a form to create/edit a request, filtering and sorting data dynamically.

## Decision
We will use a single HTML file architecture where different "views" (List View, Form View) are toggled via CSS classes (`hidden`). State will be held in a central JavaScript object and synchronized with `localStorage` on any mutation.

## Options Considered
- **Client-side Router (History API / Hash routing)**: Would allow deep linking (e.g., `/request/123`), but adds complexity.
- **View Toggling via CSS**: Chosen. Simplest approach for an app with essentially two main screens (Dashboard vs Form).

## Data Model
- **Request Entity**:
  - `id`: string (UUID or timestamp-based)
  - `subject`: string
  - `topic`: string
  - `date`: string (YYYY-MM-DD)
  - `time`: string (HH:mm)
  - `status`: string ('Draft' | 'Submitted' | 'Confirmed' | 'Cancelled')
  - `createdAt`: ISO datetime string
  - `updatedAt`: ISO datetime string

## Consequences
- **Positive**: Extremely straightforward data flow.
- **Negative**: No deep linking to specific requests.

## Requirements Touched
- FR-01, FR-03, FR-04: Views for list and form.
- NFR-04: Instant filtering/sorting (done in-memory on the JS state array, then re-rendering).
