import { chromium } from 'playwright-core';
const M=390,D=1440;
const list = [
 ['01-family-home-nearest-stock','nhs-find-pharmacy','https://www.nhs.uk/service-search/pharmacy/find-a-pharmacy',M],
 ['01-family-home-nearest-stock','airbnb-home','https://www.airbnb.com',M],
 ['01-family-home-nearest-stock','govuk-tag-status-chips','https://design-system.service.gov.uk/components/tag/',M],
 ['02-centre-detail','govuk-summary-list','https://design-system.service.gov.uk/components/summary-list/',M],
 ['02-centre-detail','nhs-111-service-page','https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-use-111/',M],
 ['02-centre-detail','apple-health','https://www.apple.com/health/',M],
 ['03-report-no-stock','govuk-radios-reason-picker','https://design-system.service.gov.uk/components/radios/',M],
 ['03-report-no-stock','govuk-question-pages','https://design-system.service.gov.uk/patterns/question-pages/',M],
 ['03-report-no-stock','stripe-checkout-demo','https://checkout.stripe.dev/preview',M],
 ['04-receipt-confirmation','govuk-panel','https://design-system.service.gov.uk/components/panel/',M],
 ['04-receipt-confirmation','govuk-confirmation-pages','https://design-system.service.gov.uk/patterns/confirmation-pages/',M],
 ['05-centre-staff-post-stock','govuk-text-input-numeric','https://design-system.service.gov.uk/components/text-input/',M],
 ['05-centre-staff-post-stock','govuk-button','https://design-system.service.gov.uk/components/button/',M],
 ['06-public-dashboard','vercel-status','https://www.vercel-status.com',D],
 ['06-public-dashboard','github-status','https://www.githubstatus.com',D],
 ['06-public-dashboard','linear-status','https://linearstatus.com',D],
 ['06-public-dashboard','vercel-status-mobile','https://www.vercel-status.com',M],
 ['07-verify-proof','arkiv-tiramisu-explorer-tx','https://tiramisu.explorer.arkiv.network/tx/0xcebf5a21672a1a7d8c0c7879b090bdc7cb2020f9d5bff4447765752a51f283f9',D],
 ['07-verify-proof','etherscan-tx','https://etherscan.io/txs',D],
 ['07-verify-proof','arkiv-tiramisu-explorer-mobile','https://tiramisu.explorer.arkiv.network/tx/0xcebf5a21672a1a7d8c0c7879b090bdc7cb2020f9d5bff4447765752a51f283f9',M],
 ['08-empty-error-offline-loading','govuk-error-summary','https://design-system.service.gov.uk/components/error-summary/',M],
 ['08-empty-error-offline-loading','govuk-service-unavailable','https://design-system.service.gov.uk/patterns/service-unavailable-pages/',M],
 ['08-empty-error-offline-loading','linear-404','https://linear.app/this-page-does-not-exist',D],
 ['09-language-toggle','bbc-hindi','https://www.bbc.com/hindi',M],
 ['09-language-toggle','mygov-in','https://www.mygov.in',M],
 ['09-language-toggle','india-gov-in','https://www.india.gov.in',M],
 ['10-landing-about','linear','https://linear.app',D],
 ['10-landing-about','stripe','https://stripe.com',D],
 ['10-landing-about','raycast','https://www.raycast.com',D],
 ['10-landing-about','arc','https://arc.net',M],
 ['11-qr-poster-share-card','stripe-payment-links','https://stripe.com/payments/payment-links',D],
 ['11-qr-poster-share-card','linear-changelog-cards','https://linear.app/changelog',D],
 ['11-qr-poster-share-card','vercel-og-templates','https://vercel.com/templates',D],
];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args:['--no-sandbox'] });
for (const [d,n,u,w] of list) {
  const p = await b.newPage({ viewport:{width:w,height:w<400?844:900}, isMobile:w<400, hasTouch:w<400, userAgent: w<400?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
  try { const r = await p.goto(u,{waitUntil:'domcontentloaded',timeout:30000});
    await p.waitForTimeout(4000);
    const t = await p.title();
    const fs = await import('fs'); fs.mkdirSync(`/workspace/JeevanStock/inspiration/${d}`,{recursive:true});
    await p.screenshot({path:`/workspace/JeevanStock/inspiration/${d}/${n}-${w}.png`}); console.log('OK',d,n,w,r?.status(),JSON.stringify(t));
  } catch(e){ console.log('FAIL',d,n,w,e.message.slice(0,80)); }
  await p.close();
}
await b.close();
