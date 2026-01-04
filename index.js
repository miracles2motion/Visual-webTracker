const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // 1. Launch with extra safety flags
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  // 2. Set a standard desktop size
  await page.setViewport({ width: 1920, height: 1080 });

  // 3. Let's test with a SIMPLE site first
  const url = 'https://www.google.com'; 
  console.log(`📸 Capturing ${url}...`);

  // 4. Wait until network is idle AND wait 2 extra seconds
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const dir = './screenshots';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  // 5. Save as JPEG (Safer/Smaller)
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `test-google-${dateStr}-${Math.floor(Math.random() * 1000)}.jpg`;
  const filePath = path.join(dir, fileName);
  
  await page.screenshot({ 
    path: filePath, 
    fullPage: true,
    type: "jpeg",   // Switch to JPEG
    quality: 80     // Good balance of quality/size
  });

  console.log(`✅ Saved: ${filePath}`);
  await browser.close();
})();

