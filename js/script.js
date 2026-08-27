import { getIP } from "./ip.js";
import { highlightObject } from "./json.js";
import { getGraphicsInfo } from "./graphics.js";
const $ = (s, e = document) => e.querySelector(s);
const out = $("#output");
async function collectReport() {
    const report = {
        browser: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            primaryLanguage: navigator.language,
            languages: navigator.languages,
            cookiesEnabled: navigator.cookieEnabled,
            trackingAllowed: !navigator.doNotTrack,
            online: navigator.onLine
        },

        screen: {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            pixelRatio: devicePixelRatio,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        },

        device: {
            IPv4: "not fetched",
            logicalCPUCoreCount: navigator.hardwareConcurrency,
            RAM: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,

            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: Intl.DateTimeFormat().resolvedOptions().locale,

            graphics: {
                webgl: {
                }
            }
        },
        intelligence: {
            possiblyChanged: [], // reports on anything that could be slightly less confident
            inferred: {}, // inference
            lessConfident: {} // a copy of the entire report object but containing only the things that were removed due to extremely low confidence/clear impossibility in data (e.g. delete screen.availWidth and move it to intelligence.lessConfident.screen.availWidth)
        }
    };

    report.device.IPv4 = await fetchIP();
    report.device.graphics.webgl = getGraphicsInfo();
    return report;
}

async function fetchIP() {
    return (await getIP()).ip;
}

async function startRecon() {
    const report = await collectReport();

    console.log("collected at:", new Date().toISOString());
    console.log(report);

    out.innerHTML = highlightObject(
        JSON.stringify(report, null, 2)
    );
}

$("#start").addEventListener("click", startRecon);