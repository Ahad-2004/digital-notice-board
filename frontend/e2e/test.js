const { Builder, By, until } = require('selenium-webdriver');
(async function(){
  const driver = await new Builder().forBrowser('chrome').build();
  try{
    await driver.get('http://localhost:5173');
    await driver.wait(until.titleContains('Digital Notice Board'), 5000).catch(()=>{});
    console.log('Opened frontend');
  }finally{
    await driver.quit();
  }
})();
