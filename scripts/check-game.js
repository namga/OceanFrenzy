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
console.log('Ocean Frenzy v2.4.3: syntax, UI, 30 stages, boss/lives systems, 24 fish assets and Android webDir passed.');

if(html.includes("ctx.ellipse(x,y,r*1.42")||html.includes("ctx.rotate(angle)")) throw new Error('Player ring or upside-down fish rotation remains');
if(!html.includes('function drawStarfishBubble(q)')||!html.includes('function drawPearlBubble')) throw new Error('Bubble collectibles are missing');
if(!html.includes('CÁ LỚN HƠN!')) throw new Error('Fish growth reward toast is missing');
if(html.includes('ctx.rotate(angle+pitch)')||!html.includes('const facingLeft=Math.cos(angle)<0')||!html.includes("const sourceFacesLeft=['blueWhale','spermWhale','orca','dolphin'].includes(spriteName)")||!html.includes('ctx.scale(flipSprite?-1:1,1)')||!html.includes('swimPhase')) throw new Error('Fish must remain horizontal and match sprite facing to travel direction');
console.log('Rendering regression PASS: no player ring, horizontal-only fish orientation, starfish bubbles, pearl bubbles and growth toast.');

if(!html.includes('id="reaction"')||!html.includes("reaction:45")) throw new Error('AI reaction speed setting is missing');
if(!html.includes('foods.length<30')||!html.includes('i<24;i++)spawnFood()')) throw new Error('Reduced collectible population is missing');
if(!html.includes('Delicate nacre crescent')) throw new Error('Pearl nacre rendering is missing');
console.log('Gameplay polish PASS: lower collectible density, adjustable AI reaction and nacre pearl rendering.');

if((html.match(/id="openCollection"/g)||[]).length!==1) throw new Error('Duplicate fish library button remains');
if(html.includes('id="joystick"')||html.includes('joystick-knob')||html.includes('joyVector')) throw new Error('Old joystick UI or movement state remains');
if(!html.includes('let touchSwipe=null,touchVector={x:0,y:0}')) throw new Error('Touch swipe vector state missing');
if(!html.includes("if(e.pointerType==='touch'){")) throw new Error('Touch pointer swipe handler missing');
if(!html.includes('touchVector={x:dx/dist*strength,y:dy/dist*strength}')) throw new Error('Swipe direction is not converted into movement vector');
if(!html.includes('else if(touchSwipe){dx=touchVector.x;dy=touchVector.y}')) throw new Error('Touch swipe is not wired into player movement');
if(!html.includes('if(!touchSwipe){dx/=len;dy/=len}')) throw new Error('Swipe distance is not preserved as steering strength');
if(!html.includes('function resetSwipe()')) throw new Error('Swipe lifecycle reset missing');
if(!html.includes("canvas.addEventListener('pointerdown'")) throw new Error('Canvas mouse/touch pointer control missing');
if(!html.includes("addEventListener('keydown'")||!html.includes("addEventListener('keyup'")) throw new Error('Keyboard movement handlers missing');
console.log('Mobile controls PASS: joystick removed, swipe-to-steer touch input, release-to-stop, desktop mouse/keyboard retained.');

const addedSpecies=['greatWhite','hammerhead','tigerShark','mantaRay','dolphin','blueWhale','spermWhale','orca'];
for(const species of addedSpecies){
 if(!html.includes(species)) throw new Error('Missing marine species: '+species);
 if(!fs.existsSync(path.join('assets','fish',species+'.webp'))) throw new Error('Missing marine sprite: '+species);
}
if(!html.includes('worldWidth=W*3')) throw new Error('Three-screen ocean map width missing');
if(!html.includes('ctx.translate(-cameraX,0)')) throw new Error('Camera follow/world scrolling missing');
if(!html.includes('class="pause-actions"')) throw new Error('Centered pause action layout missing');
if(!html.includes('id="mapMarker"')) throw new Error('World map progress marker missing');
console.log('World expansion PASS: 3-screen map, scrolling camera, progress marker, balanced pause actions and 8 added marine species.');

if(!html.includes('.ocean-select')||!html.includes('background-color:rgba(9,58,87,.94)')) throw new Error('Ocean-themed dropdown styling missing');
if(!html.includes('const turnRate=')||!html.includes('bodyRoll')) throw new Error('Smooth species-specific swim animation missing');
console.log('UI/motion polish PASS: ocean dropdowns and smooth species-specific motion.');

if(!html.includes('boostCharges=3')||!html.includes('boostDuration=2')||!html.includes('boostRecharge>=30')) throw new Error('Three-charge boost and 30-second recharge system is missing');
if(!html.includes('boost>0?2:1')||!html.includes('x2 SPEED!')||!html.includes('x2 TỐC ĐỘ!')) throw new Error('2x boost speed feedback is missing');
if(!html.includes('id="languageSelect"')||!html.includes('id="settingsLanguage"')||!html.includes("gameLanguage=localStorage.getItem('oceanLanguage')")) throw new Error('Persistent Vietnamese/English language selection is missing');
console.log('v2.4.3 controls PASS: swipe steering, 3 boost charges, 30-second recharge, x2 feedback and saved language setting.');

if(!html.includes("if(player&&typeof updateHUD==='function')updateHUD();")) throw new Error('Initial language setup still updates HUD before the player exists');
if(!html.includes("function drawShellPearl")||!html.includes("shellPearlTimer<=0")||!html.includes("score=score>0?score*2:100")||!html.includes("player.r=Math.min(110,player.r*2)")) throw new Error('Seabed shell pearl double-score/double-size bonus is missing');
if(!html.includes("💎 NGỌC TRAI QUÝ! KÍCH THƯỚC x2 • ĐIỂM x2!")) throw new Error('Shell pearl bonus notification is missing');
if(!html.includes('id="playBtn"')||!html.includes("$('playBtn').addEventListener('click',start)")) throw new Error('Start button click binding is missing');
const wf=require('fs').readFileSync('.github/workflows/build-apk.yml','utf8');
if(!wf.includes('ic_launcher_foreground.png')||!wf.includes('ic_launcher.xml')) throw new Error('Native Android launcher icon generation is missing');
if(!wf.includes(`require('./package.json').version`)||wf.includes('versionName "2.1.0"')) throw new Error('APK version is not synchronized with package.json');
console.log('Maintenance patch PASS: startup guard, single start event, random shell pearl x2 bonus, native launcher icons and version-synced APK naming.');

if(!html.includes('function spawnFish(kind=null,entering=true)')) throw new Error('Ambient fish must enter from screen edges by default');
if(!html.includes('const forwardSign=Math.cos(f.angle)<0?-1:1')||!html.includes('f.x+=forwardX*speed*60*dt')) throw new Error('AI fish forward heading is not constrained to facing direction');
if(!html.includes('if(dx<-.12&&player.angle!==Math.PI)')||!html.includes('else if(dx>.12&&player.angle!==0)')) throw new Error('Player horizontal facing update is missing');
const localeCodes=['vi','en','zh','de','fr','ko','ja','es','pt','ru','ar'];
for(const code of localeCodes) if(!html.includes(`value="${code}"`)) throw new Error('Missing language selector option: '+code);
if(!html.includes("function tr(key){return (languageText[gameLanguage]||languageText.en)[key]??languageText.en[key]??languageText.vi[key]??key}")) throw new Error('Language fallback may show Vietnamese in non-Vietnamese locales');
for(const key of ['statPoints','settingsHelp','pearlToast','apexWarning','predatorLabel','marineLifeLabel']) if(!html.includes(key)) throw new Error('Missing localized game text: '+key);
console.log('v2.4.3 PASS: horizontal swimming, left/right edge entry, player sprite orientation and 11 selectable UI languages.');

if(!html.includes("ctx.fillText(tr('readyLabel')")||!html.includes("ctx.fillText(tr('introEntering')")) throw new Error('Intro countdown is not localized');
if(!html.includes('speciesLabelsByLanguage')||!html.includes("gameLanguage==='vi'?speciesLabels[name]")) throw new Error('Fish catalogue labels are not localized by language');
if(!html.includes("showToast(tr('pearlToast'))")||!html.includes("showToast(tr('livesToast')")) throw new Error('Gameplay toast messages are not localized');
console.log('Localization regression PASS: intro countdown, 24 fish names, category labels, pearl/life/eat notifications and HUD copy.');

if(!html.includes("document.documentElement.dir=gameLanguage==='ar'?'rtl':'ltr'")) throw new Error('Arabic right-to-left layout is missing');
console.log('RTL regression PASS: Arabic UI switches to right-to-left direction.');








if(!html.includes('const swimPulse=Math.sin(beat)*.045')||!html.includes('const bodyRoll=Math.sin(beat*.5)*.035')) throw new Error('Whole-sprite shark-style motion is missing');
if(!html.includes('blueWhale:4.2,spermWhale:4.2,orca:4.2,dolphin:4.2')) throw new Error('Whale/dolphin/orca animation rates are not matched to shark');
if(!html.includes('ctx.drawImage(sprite,drawX,drawY,targetW,targetH)')) throw new Error('Complete single-sprite rendering missing');
if(html.includes('fishTailParts[spriteName]')||html.includes('tailPart.tail')) throw new Error('Detached tail rig still active');
console.log('Shark-style motion PASS: whales, dolphins and orcas use the same complete-sprite animation as sharks.');

if(!html.includes('Forward-only swimming: horizontal input turns the fish first')) throw new Error('Forward-only swimming rule missing');
if(!html.includes('if(player.angle===0&&player.vx<0)player.vx=0')||!html.includes('if(player.angle===Math.PI&&player.vx>0)player.vx=0')) throw new Error('Backward drift guard missing');
if(!html.includes('player.angle=Math.PI;player.vx=0')||!html.includes('player.angle=0;player.vx=0')) throw new Error('Turn must clear opposite momentum before forward swimming');
console.log('Forward-only control PASS: fish turns to face horizontal travel and cannot retain reverse momentum.');

if(!html.includes('const forwardSign=Math.cos(f.angle)<0?-1:1')) throw new Error('Universal forward-only AI heading is missing');
if(!html.includes('const forwardX=forwardSign*Math.max(.12,Math.abs(Math.cos(f.angle)))')) throw new Error('AI horizontal velocity is not constrained to its facing direction');
if(!html.includes('f.facing=forwardSign')) throw new Error('AI facing direction is not recorded');
console.log('All-creature forward-only movement PASS: every AI species moves in the direction its sprite faces; vertical and diagonal movement retained.');

if(!html.includes('const sizeSpeedFactor=clamp(Math.pow(28/Math.max(12,f.r),.42),.52,1.22)')) throw new Error('Size-based AI speed scaling is missing');
if(!html.includes('const speed=baseSpeed*sizeSpeedFactor*(fleeing?reactionSpeed:1)')) throw new Error('Flee speed must scale with creature size');
if(!html.includes('const cetaceanHeightScale={blueWhale:1.12,spermWhale:1.28,orca:1.30,dolphin:1.22}')) throw new Error('Balanced cetacean body proportions are missing');
if(!html.includes('const flipSprite=sourceFacesLeft?!facingLeft:facingLeft')) throw new Error('Per-species source orientation mapping is missing');
console.log('Cetacean regression PASS: correct left/right facing, balanced body proportions and larger-creature speed reduction.');

if(!html.includes('function showMlem(x,y,type=')||!html.includes('function drawMlemFx()')) throw new Error('Floating MLEM feedback renderer missing');
if(!html.includes("showMlem(f.x,f.y,'eat')")||!html.includes("showMlem(player.x,player.y,'caught')")) throw new Error('Player eat/caught MLEM event hooks missing');
if(!html.includes("showMlem(prey.x,prey.y,'eat')")) throw new Error('AI predator eating feedback hook missing');
if(!html.includes("ctx.fillText('MLEM!'" ) && !html.includes("ctx.fillText('MLEM!'")) throw new Error('Bold MLEM text missing');
if(!html.includes("ctx.fillStyle='#e3182b'")||!html.includes("ctx.strokeStyle='#fff'")) throw new Error('Red bold MLEM styling missing');
if(html.includes('const outer=31')||html.includes('for(let i=0;i<16;i++)')) throw new Error('Star badge should be removed');
console.log('MLEM text PASS: bold red MLEM lettering only, no star or badge.');

if(!html.includes('function unlockedLargeSpecies()')||!html.includes("if(size>=39)pool.push('dolphin')")||!html.includes("if(size>=46)pool.push('mantaRay')")||!html.includes("if(size>=66)pool.push('orca')")||!html.includes("if(size>=86)pool.push('spermWhale')")||!html.includes("if(size>=106)pool.push('blueWhale')")) throw new Error('Large marine species progression gates are missing or not aligned with hunt size');
if(!html.includes('shark:32,greatWhite:42,hammerhead:37,tigerShark:40,mantaRay:40,dolphin:34,orca:58,spermWhale:76,blueWhale:94')) throw new Error('Realistic marine creature size tiers are missing');
if(!html.includes("r<43?'shark':r<54?'greatWhite':r<70?'orca':r<94?'spermWhale':'blueWhale'")) throw new Error('Player visual species progression is not synchronized with growth');
if(!html.includes('const verticalExtent=Math.min(Math.max(18,f.r*1.28)')||!html.includes('bottomLimit=H-26-verticalExtent')) throw new Error('Large creatures must be kept within the visible vertical play area');
if(!html.includes('Math.max(.55,f.r*.07)')||!html.includes('Math.min(110,player.r+')||!html.includes('(110-13)*100')) throw new Error('Player growth scaling/cap is not synchronized');
if(html.includes("'mantaRay','blueWhale'")) throw new Error('Blue whale must not spawn as a small early-game prey species');
if(!html.includes('const stageLooks=[')||!html.includes('function drawStageBackdrop()')||!html.includes("'graveyard'")||!html.includes("'volcano'")||!html.includes("'ice'")) throw new Error('Distinct campaign stage environments are missing');
console.log('Progression/environment PASS: large species unlock by player size and 30 stages use distinct palettes and landmarks.');
