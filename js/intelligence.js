import {
    getRenderingEngine,
    getWebGLVendor,
    getWebGLRenderer
} from "./graphics.js";


function setNestedValue(object, path, value) {
    const parts = path.split(".");
    let current = object;

    for (let i = 0; i < parts.length - 1; i++) {
        if (
            !current[parts[i]] ||
            typeof current[parts[i]] !== "object"
        ) {
            current[parts[i]] = {};
        }

        current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
}


function getNestedValue(object, path) {
    return path.split(".").reduce(
        (current, key) => current?.[key],
        object
    );
}


function addPossiblyChanged(
    analysis,
    path,
    reason,
    confidence
) {
    analysis.possiblyChanged.push({
        path,
        reason,
        confidence
    });
}


function addLessConfident(
    analysis,
    report,
    path,
    reason,
    confidence
) {
    const value = getNestedValue(report, path);

    setNestedValue(
        analysis.lessConfident,
        path,
        {
            value,
            reason,
            confidence
        }
    );
}


function analyseBrowser(report, analysis) {
    const engine = getRenderingEngine();

    /*
     * Compare the engine detected from browser behaviour/
     * indicators against what the User-Agent claims.
     */

    if (
        engine === "Gecko" &&
        !/Firefox\//i.test(report.browser.userAgent)
    ) {
        addPossiblyChanged(
            analysis,
            "browser.userAgent",
            "Graphics/browser indicators suggest Gecko, but the User-Agent does not identify Firefox.",
            0.7
        );
    }

    if (
        engine === "Blink" &&
        !(
            /Chrome\//i.test(report.browser.userAgent) ||
            /Chromium\//i.test(report.browser.userAgent) ||
            /Edg\//i.test(report.browser.userAgent)
        )
    ) {
        addPossiblyChanged(
            analysis,
            "browser.userAgent",
            "Graphics/browser indicators suggest Blink, but the User-Agent does not identify a Chromium-based browser.",
            0.7
        );
    }

    if (
        engine === "WebKit" &&
        !/Safari\//i.test(report.browser.userAgent)
    ) {
        addPossiblyChanged(
            analysis,
            "browser.userAgent",
            "Graphics/browser indicators suggest WebKit, but the User-Agent does not identify Safari.",
            0.7
        );
    }
}


function analyseScreen(report, analysis) {
    if (
        report.screen.availWidth > report.screen.width
    ) {
        addLessConfident(
            analysis,
            report,
            "screen.availWidth",
            "Available width exceeds total screen width.",
            0.05
        );
    }

    if (
        report.screen.availHeight > report.screen.height
    ) {
        addLessConfident(
            analysis,
            report,
            "screen.availHeight",
            "Available height exceeds total screen height.",
            0.05
        );
    }

    /*
     * Firefox can alter screen availability values when
     * fingerprinting protection is enabled.
     */

    if (/Firefox\//i.test(report.browser.userAgent)) {
        addPossiblyChanged(
            analysis,
            "screen.availWidth",
            "Firefox may modify screen availability values as part of fingerprinting protection.",
            0.8
        );

        addPossiblyChanged(
            analysis,
            "screen.availHeight",
            "Firefox may modify screen availability values as part of fingerprinting protection.",
            0.8
        );
    }
}


function analyseGraphics(report, analysis) {
    const detectedEngine = getRenderingEngine();
    const webglVendor = getWebGLVendor();
    const webglRenderer = getWebGLRenderer();

    /*
     * Add graphics observations to inferred data.
     */

    analysis.inferred.renderingEngine = {
        value: detectedEngine,
        confidence:
            detectedEngine === "Unknown"
                ? 0.1
                : 0.85,
        evidence: [
            "Browser and rendering-engine indicators"
        ]
    };

    if (webglVendor) {
        analysis.inferred.graphicsVendor = {
            value: webglVendor,
            confidence: 0.9,
            evidence: [
                "WebGL VENDOR parameter"
            ]
        };
    }

    if (webglRenderer) {
        analysis.inferred.graphicsRenderer = {
            value: webglRenderer,
            confidence: 0.8,
            evidence: [
                "WebGL renderer information"
            ]
        };
    }

    /*
     * Compare the independently detected engine with
     * the engine reported by the collected graphics data.
     */

    const reportedEngine =
        report.device.graphics.renderingEngine;

    if (
        reportedEngine !== undefined &&
        reportedEngine !== detectedEngine
    ) {
        addPossiblyChanged(
            analysis,
            "device.graphics.renderingEngine",
            "Independent rendering-engine checks produced a different result.",
            0.75
        );
    }
}


function inferOperatingSystem(report, analysis) {
    const platform = report.browser.platform;
    const userAgent = report.browser.userAgent;

    if (
        platform === "Win32" ||
        /Windows NT/i.test(userAgent)
    ) {
        analysis.inferred.operatingSystem = {
            value: "Windows",
            confidence: 0.95,
            evidence: [
                "navigator.platform indicates Win32 or User-Agent indicates Windows"
            ]
        };

        return;
    }

    if (
        platform === "MacIntel" ||
        /Mac OS X/i.test(userAgent)
    ) {
        analysis.inferred.operatingSystem = {
            value: "macOS",
            confidence: 0.95,
            evidence: [
                "navigator.platform or User-Agent indicates macOS"
            ]
        };

        return;
    }

    if (/Linux/i.test(userAgent)) {
        analysis.inferred.operatingSystem = {
            value: "Linux",
            confidence: 0.9,
            evidence: [
                "User-Agent indicates Linux"
            ]
        };
    }
}


function inferDeviceCategory(report, analysis) {
    if (
        report.device.maxTouchPoints === 0 &&
        report.screen.width >= 1000
    ) {
        analysis.inferred.deviceCategory = {
            value: "Likely non-touch computer",
            confidence: 0.75,
            evidence: [
                "maxTouchPoints = 0",
                "Large display resolution"
            ]
        };
    }

    if (
        report.device.maxTouchPoints > 0
    ) {
        analysis.inferred.touchCapable = {
            value: true,
            confidence: 0.95,
            evidence: [
                "maxTouchPoints > 0"
            ]
        };
    }
}


export function analyseReport(report) {
    const analysis = {
        possiblyChanged: [],
        inferred: {},
        lessConfident: {}
    };

    analyseBrowser(report, analysis);
    analyseScreen(report, analysis);
    analyseGraphics(report, analysis);

    inferOperatingSystem(report, analysis);
    inferDeviceCategory(report, analysis);

    return analysis;
}