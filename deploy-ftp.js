import * as ftp from 'basic-ftp';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

// Helper function to ask questions in the console
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

async function deploy() {
  console.log('--- FTP Deployment Wizard ---');
  
  // Default configuration (users can customize this)
  let config = {
    host: 'ftp.jouwdomeinnaam.nl',
    user: 'gebruikersnaam',
    remotePath: '/public_html'
  };

  // Try to load local config if it exists
  const configPath = path.resolve('ftp-config.json');
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`Loaded configuration from ftp-config.json:`);
      console.log(`- Host: ${config.host}`);
      console.log(`- User: ${config.user}`);
      console.log(`- Remote Path: ${config.remotePath}`);
    } catch (e) {
      console.warn('Could not parse ftp-config.json, using defaults.');
    }
  } else {
    // Write a template config file for convenience
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Created a template ftp-config.json in the project root.');
    console.log('Please edit ftp-config.json with your bHosted details, then run deploy again.');
    return;
  }

  // Ask for password interactively
  const password = await askQuestion(`Enter FTP password for ${config.user}: `);
  if (!password) {
    console.error('Password cannot be empty.');
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log(`Connecting to ${config.host}...`);
    await client.access({
      host: config.host,
      user: config.user,
      password: password,
      secure: false // Set to true if bHosted supports FTPS (SSL/TLS)
    });

    console.log('Connection established.');
    
    // Ensure dist folder exists locally
    const localDist = path.resolve('dist');
    if (!fs.existsSync(localDist)) {
      console.error('Local dist/ directory not found. Please run "npm run build" first.');
      process.exit(1);
    }

    console.log(`Uploading local dist/ to remote ${config.remotePath}...`);
    await client.ensureDir(config.remotePath);
    await client.clearWorkingDir(); // Warn: This deletes files in the remote folder first to ensure a clean build
    await client.uploadFromDir(localDist);

    console.log('Deployment completed successfully!');
  } catch (err) {
    console.error('FTP Deployment failed:', err);
  } finally {
    client.close();
  }
}

deploy();
