import { getIP } from "./ip.js";
import { highlightObject } from "./json.js";
import { getGraphicsInfo } from "./graphics.js";
import { analyseReport } from "./intelligence.js";


const $ = (s, e = document) => e.querySelector(s);

const out = $("#output");


async function fetchIP() {
    return (await getIP()).ip;
}


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

            logicalCPUCoreCount:
                navigator.hardwareConcurrency,

            RAM:
                navigator.deviceMemory,

            maxTouchPoints:
                navigator.maxTouchPoints,

            timezone:
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone,

            locale:
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .locale,

            graphics: getGraphicsInfo()
        }
    };

    report.device.IPv4 = await fetchIP();

    return report;
}


async function startRecon() {
    try {
        out.innerText = "Collecting...";

        const report = await collectReport();

        /*
         * Intelligence receives the raw report and returns
         * analysis without modifying the original data.
         */

        report.intelligence = analyseReport(report);

        console.log(
            "collected at:",
            new Date().toISOString()
        );

        console.log(report);

        out.innerHTML = highlightObject(
            JSON.stringify(report, null, 2)
        );
    } catch (error) {
        console.error(error);

        out.innerText =
            `Recon failed: ${error.message}`;
    }
}


$("#start").addEventListener("click", startRecon);