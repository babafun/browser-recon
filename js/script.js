import {getIP} from "./ip.js";
import {highlightObject} from "./json.js";
const $ = (s, e = document) => e.querySelector(s);
const out = $("#output");
const report = {
    browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
        
    },
    screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        pixelRatio: devicePixelRatio
    },
    user: {
        IPv4: "not fetched"
    }

}

async function fetchIP(){
    return (await getIP()).ip;
}

async function startRecon(){
    report.user.IPv4 = await fetchIP();
    console.log("collected at:", new Date().toISOString());
    console.log(report);
    out.innerHTML = highlightObject(JSON.stringify(report, null, 2));
}

document.onload = async () => {await fetchIP();}
$("#start").addEventListener("click", startRecon)