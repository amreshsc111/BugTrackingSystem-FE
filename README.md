# BugTrackingSystem — Client

Frontend client for the BugTrackingSystem application. This repository contains the web UI that communicates with the backend API to create, view, and manage bug reports.

Repository: https://github.com/amreshsc111/BugTrackingSystem-FE  
Local clone: `D:\Projects\BugTrackingSystem\client` (branch: `master`)

## Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn
- Git

## Quick start
1. Clone (if needed) and open the client folder:
   - git clone https://github.com/amreshsc111/BugTrackingSystem-FE.git
   - cd client
2. Install dependencies:
   - `npm install` or `yarn`
3. Start the dev server:
   - `npm run dev` or `npm start` (check `package.json` for exact script)
4. Open the app in a browser at the port shown in the terminal (commonly `http://localhost:3000`).

## Build
- Production build: `npm run build`
- Output folder is typically `build/` or `dist/` depending on framework/tooling.

## Configuration / Environment
Create a `.env` or `.env.local` in the project root with keys used by this project. Common names:
- `VITE_API_URL` or `REACT_APP_API_URL` — backend API base URL
- Any other keys required by the frontend framework in use

Adjust names to match this repo's configuration.

## Scripts
Check `package.json` for available scripts. Typical scripts:
- `dev` / `start` — run dev server
- `build` — produce production artifacts
- `test` — run tests
- `lint` — run linters

## API
The frontend expects a backend API that exposes endpoints for creating, listing, updating, and closing bug reports. Set the API base URL via the environment key used in this project.

## Testing & Linting
- Run tests: `npm test`
- Run lint: `npm run lint`
Adjust commands to match `package.json`.

## Deployment
Build with `npm run build` and deploy the resulting `build/` or `dist/` folder to your static host (Vercel, Netlify, Azure Static Web Apps, S3+CloudFront, etc.).

## Contributing
- Create feature branches from `master`.
- Write clear commit messages.
- Open pull requests and include tests for new features or bug fixes.
- Update this README when adding or changing scripts, env keys, or deployment steps.

## Troubleshooting
- If the dev server port is in use, change the port via env or CLI options.
- If dependencies fail, try removing `node_modules` and reinstalling: `rm -rf node_modules && npm install`.

## To Do
- Add Admin Control
- Integrate CI/CD
