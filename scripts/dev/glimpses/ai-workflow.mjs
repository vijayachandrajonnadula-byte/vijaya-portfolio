// AI-assisted workflow: a small motion graphic built from the real phase names in
// src/data/workflowCaseStudy.ts (phase number + title, subset of the 13). A clay dot travels the line and
// each step lights. No tools, numbers or claims beyond what that data file says. Loops from empty line to empty line.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { record, repo, WORK, sleep } from './lib.mjs';

// Read the phase titles from the data file so the wording can never drift from the page.
const src = fs.readFileSync(path.join(repo, 'src', 'data', 'workflowCaseStudy.ts'), 'utf8');
const phases = [...src.matchAll(/num: '(\d+)',\s*id: '([^']+)',\s*title: '([^']+)'/g)].map((m) => ({ num: m[1], id: m[2], title: m[3] }));
const pick = ['research', 'design', 'branches', 'pr-workflow', 'ci', 'merge', 'deploy'];
const steps = pick.map((id) => phases.find((p) => p.id === id)).filter(Boolean);

const T = 8.2;
const html = `<!doctype html><meta charset=utf-8><style>
html,body{margin:0;background:#FAF9F7;overflow:hidden}
#s{position:relative;width:960px;height:600px;background:#FAF9F7;font-family:'Instrument Sans','Segoe UI',Arial,sans-serif;color:#17171A}
.k{position:absolute;left:60px;top:78px;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#1E3A6E;font-weight:600}
.h{position:absolute;left:60px;top:108px;width:840px;font-size:40px;line-height:1.15;font-weight:600;letter-spacing:-.01em}
.line{position:absolute;left:60px;top:329px;width:840px;height:4px;border-radius:2px;background:#E4E1DB}
.prog{position:absolute;left:95px;top:329px;height:4px;border-radius:2px;background:#1E3A6E;width:0}
.n{position:absolute;top:320px;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#FAF9F7;border:3px solid #CFCBC3;box-sizing:border-box;opacity:0}
.l{position:absolute;top:362px;width:130px;margin-left:-65px;text-align:center;opacity:0}
.l b{display:block;font-size:15px;letter-spacing:.08em;color:#1E3A6E;font-weight:600;margin-bottom:6px}
.l span{display:block;font-size:19px;line-height:1.25;font-weight:500}
.dot{position:absolute;top:322px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#E2705A;opacity:0;box-shadow:0 0 0 6px rgba(226,112,90,.22)}
</style><div id=s><div class=k>AI-assisted product build workflow</div><div class=h>From problem framing to deployed prototype</div>
<div class=line></div><div class=prog id=prog></div>
${steps.map((s, i) => `<div class=n id=n${i}></div><div class=l id=l${i}><b>${s.num}</b><span>${s.title.replace(/&/g, '&amp;')}</span></div>`).join('')}
<div class=dot id=dot></div></div><script>
const N=${steps.length}, T=${T};
const X=i=>95+i*(770/(N-1));
const c=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), e=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const G=3.1, SEG=0.62; // dot leaves the first step at G, one segment per step
function frame(t){
 const out=1-c((t-(T-.7))/.55); // everything fades back to the empty line at the end
 for(let i=0;i<N;i++){
  const a=c((t-(.45+i*.34))/.35);
  const l=document.getElementById('l'+i), n=document.getElementById('n'+i);
  const lit=t>=G+(i-0)*SEG-0.02+ (i? 0:0) ? 1:0;
  const arrive=G+i*SEG; const on=c((t-arrive)/.25);
  n.style.left=X(i)+'px'; l.style.left=X(i)+'px';
  n.style.opacity=a*out; l.style.opacity=(.3+.7*on)*a*out;
  n.style.background=on>0?'#1E3A6E':'#FAF9F7'; n.style.borderColor=on>0?'#1E3A6E':'#CFCBC3';
  n.style.transform='scale('+(1+.25*Math.sin(Math.PI*c((t-arrive)/.4))*(on>0?1:0))+')';
  l.style.transform='translateY('+(1-a)*8+'px)';
 }
 // dot position
 let x=X(0), vis=0;
 if(t>=G-.2){ vis=1; const q=(t-G)/SEG; const i=c(Math.floor(q),0,N-1); const f=e(c(q-i)); x=q>=N-1?X(N-1):X(i)+(X(Math.min(i+1,N-1))-X(i))*f; if(q<0)x=X(0)}
 const d=document.getElementById('dot'); d.style.left=x+'px'; d.style.opacity=vis*out*c((t-(G-.2))/.2);
 const pr=document.getElementById('prog'); pr.style.width=(t>=G?(x-95):0)+'px'; pr.style.opacity=out;
}
frame(0);
let t0=null;window.start=()=>{t0=performance.now();const f=n=>{const t=(n-t0)/1000;frame(Math.min(t,T));if(t<T+.2)requestAnimationFrame(f)};requestAnimationFrame(f)};
</script>`;
fs.mkdirSync(WORK, { recursive: true });
const file = path.join(WORK, 'ai-workflow.html');
fs.writeFileSync(file, html, 'utf8');
console.log('steps:', steps.map((s) => `${s.num} ${s.title}`).join(' | '));
await record('ai-workflow', {
  url: pathToFileURL(file).href,
  async run(page, t) {
    await sleep(400);
    await page.evaluate(() => window.start());
    t.mark();
    await sleep(T * 1000);
    t.end();
  },
});
