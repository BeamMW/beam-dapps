export const SVG = {
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
`
};
