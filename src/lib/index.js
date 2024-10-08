// pindah ke @ndiinginc/env
// require("./env.js");

// pindah ke @ndiinginc/cert
// require("./cert.js");

// pindah ke @ndiinginc/fetch
// require("./cookie-store.js");
// require("./fetch.js");
// require("./headers.js");
// require("./helper.js");
// require("./response.js");
// require("./request.js");
// require("./object-observer.js");

// pindah ke @ndiinginc/jwt
// require("./jwt.js");

// pindah ke @ndiinginc/otp
// require("./otp.js");

// pindah ke @ndiinginc/router
// require("./router.js");
// require("./middleware.js");

// require("./validation.js");

// {
//     const fs = require("fs");
//     const path = require("path");

//     function getCertsForHostname(domain = "localhost") {
//         let key;
//         let cert;

//         try {
//             key = fs.readFileSync(path.join(process.cwd(), "host.key"));
//             cert = fs.readFileSync(path.join(process.cwd(), "host.crt"));
//         } catch (error) {
//             const root = generateRootCA();
//             const host = generateCertsForHostname(domain, {
//                 key: root.privateKey,
//                 cert: root.certificate,
//             });

//             fs.writeFileSync(path.join(process.cwd(), "root.key"), root.privateKey);
//             fs.writeFileSync(path.join(process.cwd(), "root.crt"), root.certificate);

//             const dirname = path.join(process.cwd());
//             const filename = path.join(process.cwd(), "root.crt");

//             execSync(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd ${dirname} && certutil -enterprise -addstore -f root ${filename}'"`, { shell: true });

//             key = fs.writeFileSync(path.join(process.cwd(), "host.key"), host.privateKey);
//             cert = fs.writeFileSync(path.join(process.cwd(), "host.crt"), host.certificate);
//         }

//         return {
//             key,
//             cert,
//         };
//     }
// }

// {
//     const puppeteer = require("puppeteer-core"); // v23.0.0 or later

//     (async () => {
//         const browser = await puppeteer.launch({
//             executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//             args: [
//                 //
//                 "--window-position=-999999,-999999",
//             ],
//         });
//         const page = await browser.newPage();

//         await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36')
//         await page.evaluateOnNewDocument(() => {
//             delete navigator.__proto__.webdriver
//         })

//         const timeout = 5000;
//         page.setDefaultTimeout(timeout);

//         {
//             const targetPage = page;
//             await targetPage.setViewport({
//                 width: 1063,
//                 height: 736,
//             });
//         }
//         {
//             const targetPage = page;
//             const promises = [];
//             const startWaitingForEvents = () => {
//                 promises.push(targetPage.waitForNavigation());
//             };
//             startWaitingForEvents();
//             await targetPage.goto("https://bot.sannysoft.com/");
//             await Promise.all(promises);
//         }

//         await page.screenshot({path:'screenshot.png',fullPage:true});

//         await browser.close();
//     })().catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });
// }

// (async () => {
//     const CaptchaSolver = require('@ndiinginc/captcha-solver')

//     const cs = new CaptchaSolver()
//     const response = await cs.postIn({body:{resource:'https://griyabayar.com/interface/captcha.php?w=160&h=48'}})

//     console.log(response)
// })();
