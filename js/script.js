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
    }

}

function startRecon(){
    console.log("collected at:", new Date().toISOString());
    console.log(report);
    out.innerText = typeof report + (JSON.stringify(report, null, 2));
}