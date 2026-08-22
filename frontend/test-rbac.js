import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:4173/app');
  await page.goto('http://localhost:4173/app', { waitUntil: 'networkidle0' });

  const roles = ['PUBLIC', 'RECEPTIONIST', 'PHYSICIAN', 'ADMIN'];
  
  for (const role of roles) {
    console.log(`Changing role to ${role}...`);
    await page.select('select', role);
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if the page is completely blank (no #root children)
    const rootHasChildren = await page.$eval('#root', el => el.children.length > 0);
    console.log(`Root has children for ${role}: ${rootHasChildren}`);
  }

  await browser.close();
})();
