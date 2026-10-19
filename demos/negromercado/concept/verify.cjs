// Local render check, equivalent to the Concept capture script, using available Node Playwright.
const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
(async()=>{const root=__dirname,out=path.join(root,'screens');fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({args:['--no-sandbox']});let report={method:'Chromium, offline setContent; all assets embedded',captures:[],interactions:[]};
for(const id of ['a','b'])for(const [label,width,height]of [['desktop-1440',1440,900],['mobile-390',390,844]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(fs.readFileSync(path.join(root,'directions',id,'index.html'),'utf8'),{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(850);
 const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(x=>!x.complete||!x.naturalWidth).length}));
 if(layout.scroll>width)errors.push('horizontal overflow');if(layout.brokenImages)errors.push('broken image');
 await page.screenshot({path:path.join(out,`${id}-${label}.png`),fullPage:true,animations:'disabled'});
 if(width===1440)await page.screenshot({path:path.join(out,`${id}-hero.png`),fullPage:false,animations:'disabled'});
 if(id==='a'){await page.getByRole('tab',{name:'Pastelería',exact:true}).click();if(!await page.getByRole('tabpanel').getByText('Alfajor de almendras',{exact:true}).isVisible())throw Error('Tab did not switch');await page.getByRole('tab',{name:'Pastelería',exact:true}).press('ArrowRight');if(await page.getByRole('tab',{name:'Vermú',exact:true}).getAttribute('aria-selected')!=='true')throw Error('Keyboard tabs');report.interactions.push(`${id}/${label}: click and keyboard tabs pass`)}
 else{await page.getByText('02 / Pastelería',{exact:true}).click();if(!await page.getByText(/Alfajor de almendras, muffin/).isVisible())throw Error('Accordion did not open');report.interactions.push(`${id}/${label}: accordion pass`)}
 if(width===390){await page.getByRole('button',{name:'Abrir navegación'}).click();if(await page.getByRole('button',{name:'Abrir navegación'}).getAttribute('aria-expanded')!=='true')throw Error('Mobile nav');await page.keyboard.press('Escape');if(await page.getByRole('button',{name:'Abrir navegación'}).getAttribute('aria-expanded')!=='false')throw Error('Nav Escape');report.interactions.push(`${id}: mobile menu and Escape pass`)}
 await page.emulateMedia({reducedMotion:'reduce'});const reduced=await page.locator('.reveal').first().evaluate(e=>getComputedStyle(e).animationName);if(reduced!=='none')errors.push('reduced motion');
 report.captures.push({id,viewport:label,...layout,errors});await context.close();}
await browser.close();report.status=report.captures.every(x=>!x.errors.length)?'pass':'fail';fs.writeFileSync(path.join(out,'capture-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.status!=='pass')process.exitCode=1;})();
