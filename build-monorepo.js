import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

console.log('Building workspaces...');
execSync('npm run build --workspaces', { stdio: 'inherit' });

const distRoot = path.join(__dirname, 'dist');

// Clear existing root dist folder
if (fs.existsSync(distRoot)) {
  fs.rmSync(distRoot, { recursive: true, force: true });
}
fs.mkdirSync(distRoot, { recursive: true });

// Copy portal assets to root of dist
console.log('Copying apps/portal/dist to dist root...');
fs.cpSync(path.join(__dirname, 'apps/portal/dist'), distRoot, { recursive: true });

// Copy sub-apps to their respective directories in dist
const subApps = ['fysiek_fabriek_portal', 'project_intake_scan', 'maatwerk_risico_scan'];

subApps.forEach(app => {
  console.log(`Copying apps/${app}/dist to dist/${app}...`);
  fs.cpSync(
    path.join(__dirname, `apps/${app}/dist`),
    path.join(distRoot, app),
    { recursive: true }
  );
});

console.log('Monorepo build completed successfully!');
