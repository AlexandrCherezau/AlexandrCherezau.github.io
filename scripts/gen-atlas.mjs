// Renders the keycap legend atlas (4x4 glyphs, white on transparent) in Chromium.
// Output: tmp/glyphs.png -> converted to public/3d/glyphs.webp by `npm run assets:atlas`.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

export const GLYPHS = ["</>", "TG", "AI", "{ }", "↵", "₽", "Ж", "#", "@", "API", "SQL", "py", "/", "Esc", "Ё", "%"];

const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600&display=block" rel="stylesheet">
</head><body style="margin:0;background:transparent"><canvas id=c width=1024 height=1024></canvas>
<script>
async function draw(glyphs){
  await document.fonts.load('600 100px Unbounded', 'ЖЁ₽</>');
  const c=document.getElementById('c'), x=c.getContext('2d');
  x.clearRect(0,0,1024,1024); x.fillStyle='#fff'; x.textAlign='center'; x.textBaseline='middle';
  glyphs.forEach((g,i)=>{
    const cx=(i%4)*256+128, cy=Math.floor(i/4)*256+128;
    let size = g.length>=3 ? 70 : g.length===2 ? 92 : 130;
    x.font='600 '+size+'px Unbounded';
    while (x.measureText(g).width > 200) { size-=4; x.font='600 '+size+'px Unbounded'; }
    x.fillText(g,cx,cy+size*0.04);
  });
  return c.toDataURL('image/png');
}
</script></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
const dataUrl = await page.evaluate((g) => window.draw(g), GLYPHS);
writeFileSync("tmp/glyphs.png", Buffer.from(dataUrl.split(",")[1], "base64"));
await browser.close();
console.log("tmp/glyphs.png written");
