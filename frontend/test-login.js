import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:4173/login');
  await page.goto('http://localhost:4173/login', { waitUntil: 'networkidle0' });

  console.log('Typing credentials...');
  await page.type('input[type="email"]', 'admin@clinica.com');
  await page.type('input[type="password"]', '123456');

  console.log('Submitting login...');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
  ]);

  await new Promise(r => setTimeout(r, 1000));
  
  const content = await page.content();
  const rootHasChildren = await page.$eval('#root', el => el.children.length > 0);
  console.log(`Root has children after login: ${rootHasChildren}`);
  
  if (content.includes('Agenda')) {
    console.log('SUCCESS: Navigated to Agenda.');
  } else {
    console.log('FAIL: Did not reach Agenda.');
  }

  await browser.close();
})();
