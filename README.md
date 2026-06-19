# FactoryOS

FactoryOS is a single-page manufacturing dashboard built with Vite, React, React Router, Tailwind CSS, Chart.js, and Lucide icons. The current implementation is a frontend-only dashboard shell with hard-coded demo data for production, downtime, maintenance, quality, grading, manpower, backlog, packing, SAP order visibility, and report generation views.

## Verified Stack

- Runtime: Node.js with npm
- Build tool: Vite 5
- UI framework: React 18
- Routing: `react-router-dom` 6 with nested routes
- Styling: Tailwind CSS with a class-based dark theme
- Charts: Chart.js via `react-chartjs-2`
- Icons: `lucide-react`
- Windows helper: `scripts/free-port.js` to terminate listeners on the preferred Vite ports before startup

## Verified Entry Points

- HTML shell: `index.html`
- React bootstrap: `src/main.jsx`
- Route graph: `src/App.jsx`
- Shared layout: `src/layouts/DashboardLayout.jsx`
- Shared chart registration: `src/chartSetup.js`
- Global styles: `src/index.css`
- Windows launcher: `start_dashboard.bat`

## How To Run

### Standard npm flow

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Windows batch launcher

Run:

```powershell
.\start_dashboard.bat
```

What it does:

1. Verifies that `node` is installed.
2. Runs `npm install`.
3. Runs `npm run dev`.

## Available Routes

- `/` - plant overview
- `/production` - production dashboard
- `/downtime` - downtime dashboard
- `/maintenance` - maintenance dashboard
- `/quality` - quality dashboard
- `/grading` - grading dashboard
- `/manpower` - manpower dashboard
- `/manpower/entry` - manpower entry form
- `/backlog` - backlog dashboard
- `/packing` - packing dashboard
- `/sap` - SAP integration dashboard
- `/reports` - reports center
- `*` - not found screen

## Current System Boundaries

- No backend API calls are implemented.
- No persistence is implemented.
- No authentication is implemented.
- All dashboard values, charts, tables, and alerts are local in-component demo data.
- Dark mode is local UI state stored only in memory for the current session.
- `Manpower Entry`, `Export`, `Print`, `Save`, `Filter`, `Generate All`, and similar controls are presentational and do not execute external workflows.

## Audit Outcome

- No tracked source file was proven unused.
- `dist/` was identified as generated output, not source-of-truth application code.
- `node_modules/` was preserved because it is environment infrastructure required for local execution.
- One dead import was removed from `src/pages/Quality.jsx`.

## Documentation

For the full architecture, file classification, data flow, module-level behavior, and Mermaid diagrams, see [PROJECT_DOCUMENTATION.md](/D:/My%20Creations/Forked/FactoryOS/FactoryOS/PROJECT_DOCUMENTATION.md).
