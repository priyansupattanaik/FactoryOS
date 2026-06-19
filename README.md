# FactoryOS

FactoryOS is a single-page manufacturing dashboard built with Vite, React, React Router, Tailwind CSS, Chart.js, Lucide icons, and a lightweight Node/Express upload API. The application still includes the original hard-coded operations dashboards, and now also includes an Excel/CSV upload workflow that parses workbook data and generates charts directly from the uploaded dataset.

## Verified Stack

- Runtime: Node.js with npm
- Build tool: Vite 5
- Upload API: Express 5
- UI framework: React 18
- Routing: `react-router-dom` 6 with nested routes
- Styling: Tailwind CSS with a class-based dark theme
- Charts: Chart.js via `react-chartjs-2`
- Icons: `lucide-react`
- File parsing: `xlsx` + `multer`
- Windows helper: `scripts/free-port.js` to terminate listeners on the preferred Vite ports before startup

## Verified Entry Points

- HTML shell: `index.html`
- React bootstrap: `src/main.jsx`
- Route graph: `src/App.jsx`
- Shared layout: `src/layouts/DashboardLayout.jsx`
- Shared chart registration: `src/chartSetup.js`
- Global styles: `src/index.css`
- Upload API server: `server/index.js`
- Windows launcher: `start_dashboard.bat`

## How To Run

### Standard npm flow

```powershell
npm install
npm run dev
```

What starts:

- frontend on [http://localhost:5173](http://localhost:5173)
- upload API on [http://localhost:3001/api/health](http://localhost:3001/api/health)

### Windows batch launcher

Run:

```powershell
.\start_dashboard.bat
```

What it does:

1. Verifies that `node` is installed.
2. Runs `npm install`.
3. Runs `npm run dev`, which starts both the Vite frontend and the upload API.

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

- A local upload/parsing API is implemented only for Excel/CSV ingestion.
- No persistence is implemented.
- No authentication is implemented.
- All dashboard values, charts, tables, and alerts are local in-component demo data.
- Dark mode is local UI state stored only in memory for the current session.
- `Manpower Entry`, `Export`, `Print`, `Save`, `Filter`, `Generate All`, and similar controls are presentational and do not execute external workflows.

## Excel Upload And Dynamic Charts

- Upload entry point: header button in `DashboardLayout`
- Supported file types: `.xlsx`, `.xls`, `.csv`
- Parse endpoint: `POST /api/uploads/parse`
- Health endpoint: `GET /api/health`
- Visualization page: `/reports`

Behavior:

1. The selected file is posted to the upload API as multipart form data.
2. The backend validates extension, size, headers, and structural integrity.
3. Each sheet is parsed into raw row arrays plus inferred column metadata.
4. The frontend keeps the parsed workbook payload separate from chart configuration state.
5. The Reports page infers a default chart, then lets the user override chart type, X axis, Y axis, and aggregation.
6. Aggregations are computed only from parsed workbook values. Missing values are skipped explicitly, never replaced with synthetic values.

## Merge Notes

This feature adds:

- `server/index.js` for upload parsing
- `/api` proxying in `vite.config.js`
- `src/components/FileUploadControl.jsx`
- `src/components/dataExplorer/*`
- `src/utils/dataExplorer.js`
- `Reports` page integration

If you are merging this into another branch, ensure `npm install` is rerun so `express`, `multer`, `xlsx`, and `concurrently` are present before starting the app.

## Audit Outcome

- No tracked source file was proven unused.
- `dist/` was identified as generated output, not source-of-truth application code.
- `node_modules/` was preserved because it is environment infrastructure required for local execution.
- One dead import was removed from `src/pages/Quality.jsx`.

## Documentation

For the full architecture, file classification, data flow, module-level behavior, and Mermaid diagrams, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).
