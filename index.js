const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // CHANGE THIS URL BELOW
  const url = 'https://miracles2motion.netlify.app'; 
  console.log(`📸 Capturing ${url}...`);

  await page.goto(url, { waitUntil: 'networkidle2' });

  const dir = './screenshots';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  const dateStr = new Date().toISOString().split('T')[0]; 
  // Adds a random number so you can take multiple shots in one day
  const fileName = `screenshot-${dateStr}-${Math.floor(Math.random() * 1000)}.png`;
  const filePath = path.join(dir, fileName);

  await page.screenshot({ path: filePath, fullPage: true });

  console.log(`✅ Saved: ${filePath}`);
  await browser.close();
})();
