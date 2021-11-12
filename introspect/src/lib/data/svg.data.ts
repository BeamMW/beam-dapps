export default {
iconDrop: `
<svg width="89" height="99" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="c">
            <stop stop-color="#00FBEB" offset="0%"/>
            <stop stop-color="#00F6D2" offset="100%"/>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="94.702%" id="d">
            <stop stop-color="#FFF" offset="0%"/>
            <stop stop-color="#00446F" offset="100%"/>
        </linearGradient>
        <ellipse id="b" cx="44.5" cy="44" rx="31.5" ry="31"/>
        <filter x="-28.6%" y="-29%" width="157.1%" height="158.1%" filterUnits="objectBoundingBox" id="a">
            <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/>
            <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
            <feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
            <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.964705882 0 0 0 0 0.823529412 0 0 0 0.3 0" in="shadowBlurOuter1"/>
        </filter>
    </defs>
    <g id="iconDrop" fill="none" fill-rule="evenodd">
        <g>
            <use fill="#000" filter="url(#a)" xlink:href="#b"/>
            <ellipse stroke="url(#c)" stroke-width="3" fill-opacity=".1" fill="#00F6D2" cx="44.5" cy="44" rx="33" ry="32.5"/>
        </g>
        <path d="M12.286 63h18.428V19.703h9.715a1 1 0 0 0 .675-1.737L22.176.619a1 1 0 0 0-1.352 0L1.896 17.966a1 1 0 0 0 .675 1.737h9.715V63z" transform="translate(23 36)" fill="url(#d)" fill-rule="nonzero"/>
    </g>
</svg>
`,
  iconArrow: `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
<path d="M8.296 14c.38 0 .69-.314.69-.695V4.553s2.482 2.412 2.915 2.54c.432.129 1.178-.437 1.092-1.093-.085-.656-4.007-4-4.88-4C7.24 2 3.239 5.648 3.04 6.106c-.2.459.382 1.08 1 .987.617-.093 3.2-2.54 3.2-2.54v8.752a.69.69 0 0 0 .69.695h.366z" fill="#032E49" stroke="#032E49" stroke-width=".5" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
iconArrowDown: `<svg width="13" height="8" xmlns="http://www.w3.org/2000/svg">
<path d="M.719 2.363A.955.955 0 0 1 .728.979l.11-.104A1.06 1.06 0 0 1 2.28.892l4.27 4.174 4.156-4.34a.993.993 0 0 1 1.41-.027l.169.165a.975.975 0 0 1 .005 1.4L7.193 7.3a1.022 1.022 0 0 1-1.428-.002L.719 2.363z" fill="#BDBDBD" fill-rule="evenodd"/>
</svg>`,
iconDone: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="14px" height="12px" viewBox="0 0 14 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>icon-delete</title>
    <g id="v2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="settings-v3-beam-node" transform="translate(-794.000000, -581.000000)" fill="#032E49" fill-rule="nonzero">
            <g id="available" transform="translate(552.000000, 183.000000)">
                <g id="Group-3" transform="translate(211.000000, 385.000000)">
                    <g id="icon-done" transform="translate(30.000000, 11.000000)">
                        <path d="M14.5373916,3.03790577 C13.8294328,2.55227587 12.5315556,3.2523 11.953513,3.9313 L6.66015454,10.1382 L3.49655503,7.44069008 C2.81913951,6.86249008 2.11211589,6.76519008 1.5333735,7.44069008 C0.953231488,8.11759008 1.23943078,8.8558 1.91474687,9.4354 L5.78679238,12.7618 C6.08211196,13.0124 6.45231114,13.1517 6.83650651,13.1517 C6.8798947,13.1517 6.91978383,13.1503 6.96387183,13.1461 C7.38865614,13.1132 7.7868477,12.9109 8.06397223,12.5854 L14.4084444,5.1465 C14.9836878,4.4696 15.2453505,3.52353567 14.5373916,3.03790577 Z"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`,
iconCloseSmall: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>icon-close-small</title>
    <g id="v2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="icon-close-small" fill="#8DA1AD" fill-rule="nonzero">
            <path d="M6,0 C9.314,0 12,2.686 12,6 C12,9.314 9.314,12 6,12 C2.686,12 0,9.314 0,6 C0,2.686 2.686,0 6,0 Z M3.917,3.917 C3.687,4.147 3.687,4.52 3.917,4.75 L5.166,6 L3.916,7.25 C3.712,7.455 3.689,7.772 3.848,8.002 L3.917,8.083 C4.147,8.313 4.52,8.313 4.75,8.083 L6,6.833 L7.25,8.083 C7.48,8.313 7.853,8.313 8.083,8.083 C8.313,7.853 8.313,7.48 8.083,7.25 L6.833,6 L8.083,4.75 C8.288,4.545 8.311,4.228 8.152,3.998 L8.083,3.917 C7.853,3.687 7.48,3.687 7.25,3.917 L6,5.166 L4.75,3.916 C4.52,3.686 4.147,3.686 3.917,3.916 L3.917,3.917 Z" id="Shape"></path>
        </g>
    </g>
</svg>`,
iconCancel: `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
<path id='iconCancel' d="m9.426 8 4.279-4.278a1.009 1.009 0 0 0-1.427-1.427L8 6.575l-4.279-4.28a1.008 1.008 0 1 0-1.426 1.427L6.574 8l-4.279 4.28a1.009 1.009 0 0 0 1.426 1.426L8 9.426l4.278 4.28a1.008 1.008 0 1 0 1.427-1.427L9.426 8.001z" fill="#FFF" fill-rule="nonzero" opacity=".3"/>
</svg>
`,
iconFile: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="30px" height="39px" viewBox="0 0 30 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>icon-introspect_code_methods</title>
    <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.3">
        <g id="introspect_code_methods" transform="translate(-235.000000, -167.000000)" fill="#FFFFFF" fill-rule="nonzero">
            <g id="document" transform="translate(235.000000, 167.000000)">
                <path d="M20.6923077,11.4257812 C19.2077692,11.4257812 18,10.2298066 18,8.75976562 L18,0 L4.23076923,0 C1.89792308,0 0,1.87938867 0,4.18945312 L0,34.8105469 C0,37.1206113 1.89792308,39 4.23076923,39 L25.7692308,39 C28.1020769,39 30,37.1206113 30,34.8105469 L30,11.4257812 L20.6923077,11.4257812 Z" id="Shape"></path>
                <path d="M20.5,8.60449644 C20.5,8.8225771 20.6767119,9 20.8939186,9 L29.9,9 C29.6838175,8.59927579 29.405711,8.23122017 29.0715893,7.91378901 L21.4750272,0.69806379 C21.1802186,0.418047267 20.8518481,0.184462862 20.5,0 L20.5,8.60449644 L20.5,8.60449644 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`
};
