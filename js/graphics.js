export function getWebGLInfo() {
    const canvas = document.createElement("canvas");

    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        return {
            supported: false
        };
    }

    const info = {
        supported: true,

        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(
            gl.SHADING_LANGUAGE_VERSION
        ),

        maxTextureSize: gl.getParameter(
            gl.MAX_TEXTURE_SIZE
        ),

        maxCubeMapTextureSize: gl.getParameter(
            gl.MAX_CUBE_MAP_TEXTURE_SIZE
        ),

        maxViewportDimensions: gl.getParameter(
            gl.MAX_VIEWPORT_DIMS
        ),

        maxVertexAttributes: gl.getParameter(
            gl.MAX_VERTEX_ATTRIBS
        ),

        maxVertexUniformVectors: gl.getParameter(
            gl.MAX_VERTEX_UNIFORM_VECTORS
        ),

        maxFragmentUniformVectors: gl.getParameter(
            gl.MAX_FRAGMENT_UNIFORM_VECTORS
        ),

        maxTextureImageUnits: gl.getParameter(
            gl.MAX_TEXTURE_IMAGE_UNITS
        ),

        maxCombinedTextureImageUnits: gl.getParameter(
            gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
        )
    };

    const debugInfo = gl.getExtension(
        "WEBGL_debug_renderer_info"
    );

    if (debugInfo) {
        info.unmaskedVendor = gl.getParameter(
            debugInfo.UNMASKED_VENDOR_WEBGL
        );

        info.unmaskedRenderer = gl.getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
        );
    }

    return info;
}


export function getRenderingEngine() {
    const userAgent = navigator.userAgent;

    /*
     * These are indicators rather than guaranteed proof.
     * Browser UA strings can be modified/spoofed.
     */

    if (/Firefox\//i.test(userAgent)) {
        return "Gecko";
    }

    if (/Edg\//i.test(userAgent)) {
        return "Blink";
    }

    if (
        /Chrome\//i.test(userAgent) ||
        /Chromium\//i.test(userAgent)
    ) {
        return "Blink";
    }

    if (
        /Safari\//i.test(userAgent) &&
        !/Chrome|Chromium|Edg\//i.test(userAgent)
    ) {
        return "WebKit";
    }

    return "Unknown";
}


export function getWebGLVendor() {
    const canvas = document.createElement("canvas");

    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        return null;
    }

    return gl.getParameter(gl.VENDOR);
}


export function getWebGLRenderer() {
    const canvas = document.createElement("canvas");

    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        return null;
    }

    const debugInfo = gl.getExtension(
        "WEBGL_debug_renderer_info"
    );

    if (debugInfo) {
        return gl.getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
        );
    }

    return gl.getParameter(gl.RENDERER);
}


export function getGraphicsInfo() {
    return {
        renderingEngine: getRenderingEngine(),
        webgl: getWebGLInfo()
    };
}