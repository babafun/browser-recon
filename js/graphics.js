export function getGraphicsInfo() {
    const canvas = document.createElement("canvas");

    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        return {
            webgl: {
                supported: false
            }
        };
    }

    const webgl = {
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
        maxTextureImageUnits: gl.getParameter(
            gl.MAX_TEXTURE_IMAGE_UNITS
        )
    };

    const debugInfo = gl.getExtension(
        "WEBGL_debug_renderer_info"
    );

    if (debugInfo) {
        webgl.unmaskedVendor = gl.getParameter(
            debugInfo.UNMASKED_VENDOR_WEBGL
        );

        webgl.unmaskedRenderer = gl.getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
        );
    }

    return webgl;
}