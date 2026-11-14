
const vm=require('vm'),fs=require('fs');
const source=fs.readFileSync('index.html','utf8');
const a=source.indexOf('function moveFish(f,dt){');
const b=source.indexOf('function checkStage()',a);
const fn=source.slice(a,b).replace(/function moveFish\(f,dt\)\{/, 'globalThis.moveFish=function(f,dt){');
const ctx={Math,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),rand:(a,b)=>(a+b)/2,
  cfg:{escape:true,school:false,swim:65,reaction:45,difficulty:'Easy',hunt:70},
  player:{x:100,y:100,r:35},fish:[],H:600,W:800};
vm.createContext(ctx);vm.runInContext(fn,ctx);
const prey={x:140,y:100,r:12,kind:'prey',angle:0,speed:1,timer:5,fleeTimer:0,schoolId:0};
ctx.fish=[prey];for(let i=0;i<18;i++)ctx.moveFish(prey,.016);
if(!prey.fleeing)throw new Error('Prey did not enter flee state from larger player');
if(Math.cos(prey.angle)<=0)throw new Error('Prey did not turn away from player');
if(prey.x<=140)throw new Error('Prey did not move away from player');
const smallPred={x:200,y:100,r:20,kind:'pred',angle:0,speed:1,timer:5,fleeTimer:0,schoolId:1,alive:true};
const bigPred={x:240,y:100,r:38,kind:'pred',angle:Math.PI,speed:1,timer:5,fleeTimer:0,schoolId:2,alive:true};
ctx.player={x:20,y:100,r:12};ctx.fish=[smallPred,bigPred];for(let i=0;i<30;i++)ctx.moveFish(smallPred,.016);
if(!smallPred.fleeing)throw new Error('Smaller predator did not flee larger predator');
if(Math.cos(smallPred.angle)>=0)throw new Error('Smaller predator did not turn away from larger predator');
const harmless={x:100,y:100,r:12,kind:'prey',angle:0,speed:1,timer:5,fleeTimer:0,schoolId:0};
ctx.player={x:140,y:100,r:10};ctx.fish=[harmless];ctx.moveFish(harmless,.016);
if(harmless.fleeing)throw new Error('Fish fled from a smaller player unexpectedly');
ctx.cfg.escape=false;harmless.fleeing=true;harmless.fleeTimer=1;ctx.moveFish(harmless,.016);
if(harmless.fleeing||harmless.fleeTimer!==0)throw new Error('Escape toggle off did not clear flee state');
console.log('AI regression PASS: prey flees larger player; smaller predator flees larger predator; no false flee; toggle-off resets state.');
