const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("🚀 Launching Browser...");

  const browser = await puppeteer.launch({ 
    headless: true, // Use the standard headless mode
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--single-process', // Helps prevent crashes in CI/CD
      '--no-zygote'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 }); // Standard laptop size

  const url = 'https://www.linkedin.com/in/aigbomian-miracle-2050ba212'; 
  console.log(`📸 Capturing ${url}...`);

  try {
    // Wait for the network to be super quiet
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log("⚠️ Page load took too long, snapping anyway...");
  }

  const dir = './screenshots';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const fileName = `debug-google-${Date.now()}.jpg`;
  const filePath = path.join(dir, fileName);
  
  await page.screenshot({ 
    path: filePath, 
    fullPage: true,
    type: "jpeg",
    quality: 70
  });

  // VERIFY FILE SIZE
  const stats = fs.statSync(filePath);
  console.log(`✅ Saved: ${fileName}`);
  console.log(`📦 Size: ${stats.size} bytes`);

  await browser.close();
})();

