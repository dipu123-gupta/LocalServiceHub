import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

async function checkModule(modulePath) {
  try {
    const fileUrl = pathToFileURL(modulePath).href;
    console.log(`Checking ${fileUrl}...`);
    await import(fileUrl);
    console.log(`✅ Success: ${modulePath}`);
  } catch (err) {
    console.error(`❌ Error in ${modulePath}:`);
    console.error(err);
  }
}

async function runAudit() {
  const files = [
    './backend/utils/apiFeatures.js',
    './backend/utils/auditLogger.js',
    './backend/utils/pdfUtils.js',
    './backend/controllers/authController.js',
    './backend/controllers/serviceController.js',
    './backend/controllers/userController.js',
    './backend/controllers/bookingController.js',
    './backend/controllers/supportController.js'
  ];

  for (const file of files) {
    await checkModule(path.resolve(file));
  }
}

runAudit();
