const fs=require('fs'),path=require('path');
const html=fs.readFileSync('index.html','utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
if(!match) throw new Error('Game script not found');
new Function(match[1]);
const ids=['game','start','playBtn','settings','gameover','pause','levelComplete','modeSelect','difficultySelect','stageName','lives','collection','fishGrid','openCollection','closeCollection','swim','hunt','school','escape'];
for(const id of ids) if(!html.includes('id="'+id+'"')) throw new Error('Missing UI element: '+id);
if(!html.includes("addEventListener('click',start)")) throw new Error('Start button click handler missing');
if(!html.includes('level>=30')) throw new Error('30-stage campaign limit missing');
if(!html.includes('spawnBoss()')) throw new Error('Boss encounter system missing');
if(!html.includes('lives=Math.max(0,lives-1)')) throw new Error('Lives/respawn system missing');
const species=['clown','blueTang','yellowTang','angelfish','butterfly','moorishIdol','puffer','triggerfish','wrasse','royalGramma','sardine','parrot','barracuda','grouper','lionfish','shark'];
for(const name of species) for(const base of ['assets/fish','www/assets/fish']) if(!fs.existsSync(path.join(base,name+'.webp'))) throw new Error('Missing fish asset '+base+'/'+name);
if(!fs.readFileSync('www/index.html','utf8').includes('Full 3D Remake')) throw new Error('Capacitor web assets are not synced');
console.log('Ocean Frenzy v2.0.5: syntax, UI, 30 stages, boss/lives systems, 16 fish assets and Android webDir passed.');

if(html.includes("ctx.ellipse(x,y,r*1.42")||html.includes("ctx.rotate(angle)")) throw new Error('Player ring or upside-down fish rotation remains');
if(!html.includes('function drawStarfishBubble(q)')||!html.includes('function drawPearlBubble')) throw new Error('Bubble collectibles are missing');
if(!html.includes('CÁ LỚN HƠN!')) throw new Error('Fish growth reward toast is missing');
if(!html.includes("Math.cos(angle)<0?-1:1")) throw new Error('Fish horizontal-facing orientation fix is missing');
console.log('Rendering regression PASS: no player ring, upright facing fish, starfish bubbles, pearl bubbles and growth toast.');

if(!html.includes('id="reaction"')||!html.includes("reaction:45")) throw new Error('AI reaction speed setting is missing');
if(!html.includes('foods.length<30')||!html.includes('i<24;i++)spawnFood()')) throw new Error('Reduced collectible population is missing');
if(!html.includes('Delicate nacre crescent')) throw new Error('Pearl nacre rendering is missing');
console.log('Gameplay polish PASS: lower collectible density, adjustable AI reaction and nacre pearl rendering.');

if((html.match(/id="openCollection"/g)||[]).length!==1) throw new Error('Duplicate fish library button remains');
if(!html.includes('id="joystick"')||!html.includes('function resetJoystick()')) throw new Error('Mobile joystick UI or lifecycle reset missing');
if(!html.includes("else if(coarsePointer){dx=joyVector.x;dy=joyVector.y}")) throw new Error('Joystick is not wired into player movement');
if(!html.includes("@media(pointer:coarse){body.playing .joystick{display:block}")) throw new Error('Joystick is not restricted to touch devices');
if(!html.includes("if(e.pointerType==='touch')return;")) throw new Error('Touch pointer is not isolated from mouse/pen canvas control');
if(!html.includes("canvas.addEventListener('pointerdown'")) throw new Error('Canvas mouse/pen pointer control missing');
if(!html.includes("addEventListener('keydown'")||!html.includes("addEventListener('keyup'")) throw new Error('Keyboard movement handlers missing');
console.log('Mobile controls PASS: one fish library button, translucent touch joystick, touch vector movement and desktop mouse control.');
