(()=>{"use strict";
const canvas=document.getElementById("c"),ctx=canvas.getContext("2d");
let W=1280,H=720,portrait=false;
const WORLD_W=4800,WORLD_H=2200;
const camera={x:0,y:0};
const img={};
["reef_background.png","player_0.png","player_1.png","player_2.png","player_3.png","player_4.png","player_5.png","player_6.png","player_7.png","minnow.png","yellow-tang.png","blue-tang.png","clownfish.png","grouper.png","lionfish.png","shark.png","manta.png","seahorse.png","manta_0.png","manta_1.png","manta_2.png","manta_3.png","manta_4.png","manta_5.png","shark_0.png","shark_1.png","shark_2.png","shark_3.png","shark_4.png","shark_5.png","shark_6.png","shark_7.png","kelp_background.png","volcanic_background.png","abyss_background.png"].forEach(n=>{img[n]=new Image();img[n].src="assets/"+n});
const $=id=>document.getElementById(id);
let running=false,paused=false,over=false,activePointer=null,score=0,best=+(localStorage.yumyBest||0),gameMode="survival",selectedStage=0,stageGoal=1200,stageUnlocked=+(localStorage.yumyAdventureUnlocked||1),stageCompleted=JSON.parse(localStorage.yumyAdventureCompleted||"[]"),stageWon=false,growth=.08,level=1,lives=3,combo=1,comboT=0,biteT=0,hitT=0,spawnT=0,last=0,fish=[],particles=[],bubbles=[],player={x:420,y:1100,vx:0,vy:0,r:28,face:1},target=null,pointer=null,audioCtx=null,biteNoiseBuffer=null,musicOn=(localStorage.yumyMusicOn!=="0"),sfxOn=(localStorage.yumySfxOn!=="0"),musicVolume=Math.max(0,Math.min(1,(+(localStorage.yumyMusicVolume??22))/100)),sfxVolume=Math.max(0,Math.min(1,(+(localStorage.yumySfxVolume??95))/100)),musicNodes=[],masterGain=null,musicGain=null,sfxGain=null,ambientSource=null,scene=0,survivalWave=1,waveScoreStart=0,waveGoal=3200,predatorWarnCd=0;
const stages=[
{name:"Rạn san hô",scene:0,goal:900,desc:"Khởi đầu êm đềm"},{name:"Bãi cát ngọc",scene:0,goal:1350,desc:"Luồn qua những cụm san hô"},
{name:"Vịnh cá nhiệt đới",scene:1,goal:1900,desc:"Đàn cá nhiều màu sắc"},{name:"Đầm phá xanh",scene:1,goal:2500,desc:"Dòng nước đổi chiều"},
{name:"Rừng tảo biển",scene:2,goal:3200,desc:"Ẩn mình giữa những tán tảo"},{name:"Thung lũng rong biển",scene:2,goal:4000,desc:"Kẻ săn mồi rình rập"},
{name:"Khu vực sư tử biển",scene:3,goal:4900,desc:"Cá săn mồi tuần tra"},{name:"Vách đá san hô",scene:3,goal:5900,desc:"Vùng nước nhiều hang hốc"},
{name:"Miệng núi lửa",scene:4,goal:7000,desc:"Dòng nước nóng nguy hiểm"},{name:"Ống khói dung nham",scene:4,goal:8200,desc:"Tránh vùng nước bỏng"},
{name:"Hang dung nham",scene:5,goal:9500,desc:"Cá săn mồi cỡ lớn"},{name:"Lòng chảo tro",scene:5,goal:10900,desc:"Tầm nhìn hạn chế"},
{name:"Vực thẳm xanh",scene:6,goal:12400,desc:"Ánh sáng dần biến mất"},{name:"Rãnh đại dương",scene:6,goal:14000,desc:"Những bóng đen khổng lồ"},
{name:"Thành phố phát sáng",scene:7,goal:15700,desc:"Sinh vật phát quang"},{name:"Khu vườn ánh sáng",scene:7,goal:17500,desc:"Đàn cá phát sáng bí ẩn"},
{name:"Vương quốc đại dương",scene:8,goal:19500,desc:"Thử thách cuối cùng"},{name:"Ngai vàng biển sâu",scene:8,goal:22000,desc:"Chinh phục vùng biển cuối"}
];
const scenes=[{name:"RẠN SAN HÔ",top:"#08a9c4",bottom:"#064b9c",accent:"#ff9b62"},{name:"VỊNH NHIỆT ĐỚI",top:"#10b8c5",bottom:"#07528d",accent:"#ffcf65"},{name:"RỪNG TẢO BIỂN",top:"#087f83",bottom:"#063c68",accent:"#9edb73"},{name:"RẠN SƯ TỬ BIỂN",top:"#176e94",bottom:"#092d59",accent:"#ff9a65"},{name:"MIỆNG NÚI LỬA",top:"#8c4b37",bottom:"#182b55",accent:"#ff8a3d"},{name:"HANG DUNG NHAM",top:"#a34425",bottom:"#160e28",accent:"#ff6b24"},{name:"VỰC THẲM XANH",top:"#173b77",bottom:"#080f36",accent:"#7c9cff"},{name:"THÀNH PHỐ PHÁT SÁNG",top:"#183e88",bottom:"#120d45",accent:"#ff73df"},{name:"VƯƠNG QUỐC ĐẠI DƯƠNG",top:"#0b8794",bottom:"#09294e",accent:"#ffe16b"}];
async function audioStart(){
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    if(!audioCtx){
      audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=.78;masterGain.connect(audioCtx.destination);
      musicGain=audioCtx.createGain();musicGain.gain.value=musicOn?musicVolume:0;musicGain.connect(masterGain);
      sfxGain=audioCtx.createGain();sfxGain.gain.value=sfxOn?sfxVolume:0;sfxGain.connect(masterGain);
      // Original YUMY ambient bed: soft filtered water noise and slow tonal movement.
      const len=audioCtx.sampleRate*4,buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate),data=buf.getChannelData(0);let z=0;
      for(let i=0;i<len;i++){z=z*.965+(Math.random()*2-1)*.035;data[i]=z*.42;}
      ambientSource=audioCtx.createBufferSource();ambientSource.buffer=buf;ambientSource.loop=true;
      const lp=audioCtx.createBiquadFilter(),amb=audioCtx.createGain(),lfo=audioCtx.createOscillator(),lfoG=audioCtx.createGain();
      lp.type='lowpass';lp.frequency.value=430;amb.gain.value=.22;lfo.frequency.value=.055;lfoG.gain.value=115;lfo.connect(lfoG);lfoG.connect(lp.frequency);
      ambientSource.connect(lp);lp.connect(amb);amb.connect(musicGain);ambientSource.start();lfo.start();musicNodes.push(ambientSource,lfo);
      // Gentle original two-note pulse, intentionally restrained under gameplay.
      const o1=audioCtx.createOscillator(),g1=audioCtx.createGain(),o2=audioCtx.createOscillator(),g2=audioCtx.createGain();
      o1.type='sine';o1.frequency.value=110;g1.gain.value=.035;o1.connect(g1);g1.connect(musicGain);o1.start();
      o2.type='triangle';o2.frequency.value=164.81;g2.gain.value=.012;o2.connect(g2);g2.connect(musicGain);o2.start();musicNodes.push(o1,g1,o2,g2);
    }
    if(audioCtx.state!=='running')await audioCtx.resume();
    applyAudioSettings();
    return audioCtx.state==='running';
  }catch(e){return false}
}
function applyAudioSettings(){if(!audioCtx)return;const t=audioCtx.currentTime;if(musicGain)musicGain.gain.setTargetAtTime(musicOn?musicVolume:0,t,.05);if(sfxGain)sfxGain.gain.setTargetAtTime(sfxOn?sfxVolume:0,t,.05)}
function syncAudioControls(){const m=$("musicToggle"),s=$("sfxToggle"),mv=$("musicVolume"),sv=$("sfxVolume");if(m)m.checked=musicOn;if(s)s.checked=sfxOn;if(mv)mv.value=Math.round(musicVolume*100);if(sv)sv.value=Math.round(sfxVolume*100)}
function tone(freq,when,duration,volume,type='sine',endFreq=null){
  if(!audioCtx||!sfxGain||!sfxOn)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(30,freq),when);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),when+duration);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),when+.012);g.gain.exponentialRampToValueAtTime(.0001,when+duration);o.connect(g);g.connect(sfxGain);o.start(when);o.stop(when+duration+.02);
}
function noiseBurst(when,duration,volume,cutoff=1500){
  if(!audioCtx||!sfxGain||!sfxOn)return;const n=Math.max(64,Math.floor(audioCtx.sampleRate*duration)),b=audioCtx.createBuffer(1,n,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=cutoff;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+.006);g.gain.exponentialRampToValueAtTime(.0001,when+duration);src.connect(f);f.connect(g);g.connect(sfxGain);src.start(when);src.stop(when+duration+.015);
}
function playCue(kind,amount=1){
  if(!sfxOn||!audioCtx||audioCtx.state!=='running')return;const t=audioCtx.currentTime+.004,k=Math.max(.65,Math.min(1.45,amount));
  if(kind==='bite'){noiseBurst(t,.045,.16*k,2600);tone(155/k,t+.006,.13,.16*k,'sine',58/k);noiseBurst(t+.11,.07,.10*k,1250);tone(410,t+.18,.07,.045,'triangle',250);}
  else if(kind==='gulp'){tone(290,t,.12,.07,'sine',180);tone(190,t+.10,.16,.08,'sine',105);noiseBurst(t+.08,.09,.045,700);}
  else if(kind==='grow'){tone(330,t,.18,.08,'triangle',490);tone(495,t+.12,.24,.075,'sine',720);tone(660,t+.28,.3,.06,'sine',880);}
  else if(kind==='hurt'){noiseBurst(t,.19,.19,500);tone(115,t,.32,.18,'sawtooth',48);}
  else if(kind==='warning'){tone(520,t,.13,.07,'sine',390);tone(520,t+.22,.13,.07,'sine',390);tone(520,t+.44,.18,.08,'sine',330);}
  else if(kind==='stage'){tone(392,t,.16,.07,'triangle');tone(523,t+.16,.18,.08,'triangle');tone(659,t+.34,.32,.09,'sine');}
  else if(kind==='over'){tone(330,t,.25,.09,'triangle',240);tone(247,t+.23,.32,.09,'triangle',165);tone(165,t+.52,.55,.10,'sine',82);}
  else if(kind==='menu'){tone(480,t,.07,.035,'sine',620);}
}
async function playChomp(f){try{if(!sfxOn)return;await audioStart();const size=Math.max(.8,Math.min(1.4,(f?.r||35)/45));playCue('bite',size);setTimeout(()=>playCue('gulp',size),145)}catch(e){}}
function resizeGame(){
 const root=document.getElementById("game"),rect=root.getBoundingClientRect();
 const rw=Math.max(1,rect.width||window.innerWidth),rh=Math.max(1,rect.height||window.innerHeight);
 const nextPortrait=rh>rw,nw=nextPortrait?720:1280,nh=Math.max(1,Math.round(nw*rh/rw));
 if(nw===W&&nh===H&&nextPortrait===portrait)return;
 W=nw;H=nh;portrait=nextPortrait;canvas.width=W;canvas.height=H;
 const menu=$("webMenuBtn");menu.style.top="10px";menu.style.right=portrait?"12px":"auto";menu.style.left=portrait?"auto":"12px";
 camera.x=clamp(camera.x,0,Math.max(0,WORLD_W-W));camera.y=clamp(camera.y,0,Math.max(0,WORLD_H-H));
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
resizeGame();window.addEventListener("resize",resizeGame);window.addEventListener("orientationchange",()=>setTimeout(resizeGame,160));if(window.visualViewport)window.visualViewport.addEventListener("resize",()=>setTimeout(resizeGame,80));
for(let i=0;i<90;i++)bubbles.push({x:Math.random()*WORLD_W,y:Math.random()*WORLD_H,r:2+Math.random()*7,s:10+Math.random()*22,a:.08+Math.random()*.2});
// Species rules: preyTier is the minimum player growth tier allowed to eat this species.
// Fish with predator=true remain dangerous until the same explicit size/tier gate is met.
// [name, logical radius, swim speed, predator, unlock progress, source art faces left, preyTier]
const specs=[
 ["minnow.png",14,82,false,1,false,0],
 ["yellow-tang.png",20,70,false,1,true,0],
 ["blue-tang.png",25,66,false,1,false,1],
 ["clownfish.png",30,58,false,1,false,1],
 ["grouper.png",56,48,true,1,false,3],
 ["lionfish.png",68,46,true,2,false,3],
 ["manta.png",72,43,true,5,false,4],
 ["seahorse.png",38,30,false,4,false,2],
 ["shark.png",88,38,true,8,false,5]
];
function playerGrowthTier(){const r=player.r;return r>=115?5:r>=92?4:r>=72?3:r>=55?2:r>=40?1:0}
function spawn(pred=false){
 const progress=gameMode==="adventure"?Math.max(level,1+selectedStage*1.25):Math.max(level,1+(survivalWave-1)*1.4);
 let pool;
 if(pred){pool=specs.filter(s=>s[3]&&s[4]<=progress);if(!pool.length)pool=[specs[4]]}
 else {pool=specs.filter(s=>!s[3]&&s[4]<=progress);if(progress>=3)pool.push(specs[4]);if(progress>=4)pool.push(specs[5]);if(progress>=5)pool.push(specs[6]);if(progress>=6)pool.push(specs[7]);if(progress>=8)pool.push(specs[8])}
 const s=pool[Math.floor(Math.random()*pool.length)],distX=W*.45+Math.random()*W*.35;
 let x=clamp(player.x+(Math.random()<.5?-distX:distX),80,WORLD_W-80),y=clamp(player.y+(Math.random()-.5)*H*1.7,100,WORLD_H-100),dir=Math.random()<.5?1:-1;
 fish.push({name:s[0],r:s[1],speed:s[2],pred:s[3],unlock:s[4],sourceLeft:s[5],preyTier:s[6],x,y,dir,vx:dir*s[2],vy:0,phase:Math.random()*7,school:Math.floor(Math.random()*5),turn:2+Math.random()*4,frame:0,clock:0,seed:Math.random()*10,attackState:"idle",attackTimer:0,attackCooldown:0,mouthOpen:0});
}
function reset(){audioStart().then(()=>playCue("stage"));score=0;stageWon=false;survivalWave=1;waveScoreStart=0;waveGoal=3200;stageGoal=gameMode==="adventure"?stages[selectedStage].goal:0;scene=gameMode==="adventure"?stages[selectedStage].scene:0;growth=.08;level=1;lives=3;combo=1;comboT=0;player={x:420,y:WORLD_H*.5,vx:0,vy:0,r:28,face:1};target=null;camera.x=0;camera.y=clamp(player.y-H*.5,0,WORLD_H-H);fish=[];particles=[];spawnT=0;for(let i=0;i<25;i++)spawn(false);for(let i=0;i<2;i++)spawn(true);running=true;paused=false;over=false;activePointer=null;$("webMenuBtn").style.display="block";$("menu").classList.add("hidden");$("pause").classList.add("hidden");$("over").classList.add("hidden")}
function popup(x,y,t,c="#fff1a6"){particles.push({x,y,t,c,life:1,max:1})}
function requiredPlayerRadius(f){return f.r*(f.pred?1.3:1.15)}
function canEatFish(f){
 if(!f||!Number.isFinite(f.r)||!Number.isFinite(f.preyTier))return false;
 // Only species explicitly assigned to the current feeding tier can be eaten.
 return playerGrowthTier()>=f.preyTier && player.r>=requiredPlayerRadius(f);
}
function currentPreyLabel(){
 const tier=playerGrowthTier(),names=specs.filter(s=>s[6]<=tier&&player.r>=s[1]*(s[3]?1.3:1.15)).map(s=>({"minnow.png":"Cá mồi","yellow-tang.png":"Cá vàng","blue-tang.png":"Cá xanh","clownfish.png":"Cá hề","grouper.png":"Cá mú","lionfish.png":"Cá sư tử","manta.png":"Cá đuối","seahorse.png":"Cá ngựa","shark.png":"Cá mập"}[s[0]]));
 return names.length?names.slice(-3).join(" · "):"Chưa có mồi phù hợp";
}
function eat(i){const f=fish[i];if(!f||!canEatFish(f))return false;playChomp(f);const pts=Math.floor(25+f.r*1.8)*combo;score+=pts;best=Math.max(best,score);localStorage.yumyBest=best;combo=Math.min(6,combo+1);comboT=2.4;growth=Math.min(1,growth+.025+f.r/2600);player.r=Math.min(142,player.r+.42+f.r*.006);popup(f.x,f.y-38,"Yumy","#7b1026");popup(f.x,f.y-8,"+"+pts,"#fff0a6");for(let n=0;n<7;n++)particles.push({x:f.x+(Math.random()-.5)*28,y:f.y+(Math.random()-.5)*24,t:"✦",c:"#ffe47a",life:.48,max:.48});biteT=.42;fish.splice(i,1);while(score>=level*650&&level<99){level++;playCue("grow");popup(player.x,player.y-70,"LEVEL "+level,"#aaff91")}if(gameMode==="adventure"&&score>=stageGoal)finishStage(true);else if(gameMode==="survival"&&score-waveScoreStart>=waveGoal)finishSurvivalWave();return true}
function showHome(){running=false;paused=false;over=false;activePointer=null;pointer=null;target=null;$("webMenuBtn").style.display="none";$("pause").classList.add("hidden");showPauseHome();$("over").classList.add("hidden");$("menu").classList.remove("hidden");$("homeView").classList.remove("hidden");$("mapView").classList.add("hidden");if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
function showAdventureMap(){gameMode="adventure";$("homeView").classList.add("hidden");$("mapView").classList.remove("hidden");$("menu").classList.remove("hidden");renderStages()}
function finishSurvivalWave(){if(over)return;playCue("stage");over=true;running=false;particles=[];stageWon=true;$("overTitle").textContent=`WAVE ${survivalWave} HOÀN THÀNH!`;$ ("result").textContent=`${scenes[scene].name} · ${score-waveScoreStart}/${waveGoal} điểm · Cấp ${level}`;$ ("again").textContent="TIẾP TỤC SANG VÙNG BIỂN MỚI";$("over").classList.remove("hidden")}
function nextSurvivalWave(){survivalWave++;waveScoreStart=score;waveGoal=Math.round(3200+survivalWave*1200);scene=(scene+1)%scenes.length;fish=[];for(let i=0;i<22+Math.min(12,survivalWave);i++)spawn(false);for(let i=0;i<Math.min(2+Math.floor(survivalWave/2),5);i++)spawn(true);over=false;running=true;stageWon=false;$("over").classList.add("hidden");popup(player.x,player.y-70,scenes[scene].name,"#aaff91")}
function finishStage(won){if(over)return;playCue(won?"stage":"over");over=true;running=false;particles=[];stageWon=won;if(won){stageUnlocked=Math.max(stageUnlocked,Math.min(stages.length,selectedStage+2));localStorage.yumyAdventureUnlocked=stageUnlocked;if(!stageCompleted.includes(selectedStage)){stageCompleted.push(selectedStage);localStorage.yumyAdventureCompleted=JSON.stringify(stageCompleted)}$("overTitle").textContent="HOÀN THÀNH MÀN!";$("result").textContent=`${stages[selectedStage].name} · ${score}/${stageGoal} điểm · Đã mở khóa màn ${Math.min(stages.length,selectedStage+2)}`;$("again").textContent=selectedStage<stages.length-1?"CHƠI MÀN TIẾP THEO":"CHƠI LẠI"}else{$("overTitle").textContent="HẾT LƯỢT";$("result").textContent=`${gameMode==="adventure"?`Màn ${selectedStage+1} · Mục tiêu ${stageGoal} điểm`:"Sinh tồn"} · Điểm: ${score}`;$("again").textContent="THỬ LẠI"}$("over").classList.remove("hidden")}
function hurt(predator){
 if(hitT>0||over)return;
 playCue("hurt");hitT=1.25;lives=Math.max(0,lives-1);combo=1;comboT=0;
 const oldR=player.r;player.r=Math.max(24,player.r*.88);growth=Math.max(0,growth-.10);
 const away=predator?Math.sign(player.x-predator.x)||-predator.dir:-player.face;
 player.vx+=away*250;player.vy+=(player.y-(predator?.y||player.y))*1.2;
 popup(player.x,player.y-34,"MẤT 1 MẠNG · NHỎ LẠI","#ff7777");
 if(predator){predator.attackState="recover";predator.attackTimer=.7;predator.attackCooldown=1.9;predator.mouthOpen=0;}
 if(lives<=0){particles=[];if(gameMode==="adventure")finishStage(false);else{playCue("over");over=true;running=false;particles=[];$ ("overTitle").textContent="HẾT LƯỢT";$ ("result").textContent=`Bị cá săn mồi nuốt chửng · Điểm: ${score} · Kỷ lục: ${best}`;$ ("again").textContent="CHƠI LẠI";$ ("over").classList.remove("hidden")}}
}
function playerMouth(){return{x:player.x+player.face*player.r*.78,y:player.y-player.r*.04}}
function fishMouth(f){return{x:f.x+f.dir*f.r*.82,y:f.y-f.r*.02}}
function mouthTouchesPlayer(f){const m=fishMouth(f),d=Math.hypot(player.x-m.x,player.y-m.y);return d<player.r*.78+f.r*.30}
function startPredatorAttack(f,playerOnFront){
 if(f.attackCooldown>0||f.attackState!=="idle")return;
 f.attackTargetX=player.x;f.attackTargetY=player.y;
 f.dir=Math.sign(player.x-f.x)||f.dir;
 f.attackState="turn";
 f.attackTimer=playerOnFront?.24:.42;
 f.mouthOpen=.08;f.jawPhase=0;
}

function update(dt){if(!running||paused)return;predatorWarnCd=Math.max(0,predatorWarnCd-dt);biteT=Math.max(0,biteT-dt);hitT=Math.max(0,hitT-dt);comboT=Math.max(0,comboT-dt);if(!comboT)combo=1;
// Drag-to-swim: the finger is a world-space destination; releasing it lets the fish coast to a stop.
if(target){const dx=target.x-player.x,dy=target.y-player.y,dist=Math.hypot(dx,dy),maxSpeed=390;if(dist>7){const desired=Math.min(maxSpeed,dist*2.65),ax=dx/dist*desired,ay=dy/dist*desired;player.vx+=(ax-player.vx)*Math.min(1,dt*5.8);player.vy+=(ay-player.vy)*Math.min(1,dt*5.8)}else{player.vx*=Math.max(0,1-dt*5);player.vy*=Math.max(0,1-dt*5)}}else{player.vx*=Math.max(0,1-dt*2.7);player.vy*=Math.max(0,1-dt*2.7)}
if(Math.abs(player.vx)>5)player.face=Math.sign(player.vx);player.x=clamp(player.x+player.vx*dt,player.r+30,WORLD_W-player.r-30);const verticalSafeTop=Math.max(player.r+35,portrait?220:120),verticalSafeBottom=Math.max(player.r+35,portrait?155:55);player.y=clamp(player.y+player.vy*dt,verticalSafeTop,WORLD_H-verticalSafeBottom);
// Camera eases after the fish, keeping it near the center while revealing a much larger ocean.
const desiredCamX=clamp(player.x-W*.5,0,WORLD_W-W),desiredCamY=clamp(player.y-H*.5,0,WORLD_H-H);camera.x+=(desiredCamX-camera.x)*Math.min(1,dt*3.8);camera.y+=(desiredCamY-camera.y)*Math.min(1,dt*3.8);
for(let i=fish.length-1;i>=0;i--){
 const f=fish[i],dx=player.x-f.x,dy=player.y-f.y,d=Math.hypot(dx,dy)||1;
 f.phase+=dt;f.turn-=dt;f.attackCooldown=Math.max(0,f.attackCooldown-dt);if(f.attackState==="turn")f.mouthOpen+=(.78-f.mouthOpen)*Math.min(1,dt*6.5);else if(f.attackState==="lunge")f.mouthOpen+=(1-f.mouthOpen)*Math.min(1,dt*10);else f.mouthOpen+=(0-f.mouthOpen)*Math.min(1,dt*8);
 if(f.attackState==="turn"){
   // A predator that was touched at the tail visibly turns first, then bites.
   f.dir=Math.sign(dx)||f.dir;f.mouthOpen+=(.82-f.mouthOpen)*Math.min(1,dt*7);f.attackTimer-=dt;
   f.vx+=(f.dir*f.speed*.42-f.vx)*Math.min(1,dt*8);
   f.vy+=(dy/d*f.speed*.30-f.vy)*Math.min(1,dt*5);
   if(f.attackTimer<=0){f.attackState="lunge";f.attackTimer=.82;f.mouthOpen=1;playCue("warning")}
 }else if(f.attackState==="lunge"){
   f.dir=Math.sign(dx)||f.dir;f.attackTimer-=dt;f.mouthOpen+=(1-f.mouthOpen)*Math.min(1,dt*12);const lungeSpeed=f.speed*3.15;
   f.vx+=(f.dir*lungeSpeed-f.vx)*Math.min(1,dt*9);f.vy+=(dy/d*lungeSpeed*1.05-f.vy)*Math.min(1,dt*8);f.mouthOpen=Math.max(f.mouthOpen,.96);
   // Test the mouth after this frame's movement; the body/tail never causes a bite by itself.
   const bitePoint=fishMouth(f),biteDist=Math.hypot(player.x-bitePoint.x,player.y-bitePoint.y);
   const mouthRadius=Math.max(16,f.r*.34);
   if(biteDist<player.r*.58+mouthRadius){hurt(f);}
   if(f.attackTimer<=0&&f.attackState==="lunge"){f.attackState="recover";f.attackTimer=.72;f.attackCooldown=1.35;f.mouthOpen=0}
 }else if(f.attackState==="recover"){
   f.attackTimer-=dt;const base=f.dir*f.speed*.55;f.vx+=(base-f.vx)*Math.min(1,dt*2.8);f.vy+=(Math.sin(f.phase)*f.speed*.15-f.vy)*Math.min(1,dt*2);
   if(f.attackTimer<=0)f.attackState="idle";
 }else{
   if(f.turn<=0){f.turn=2.4+Math.random()*4.5;if(Math.random()<.75)f.dir*=-1}
   let desiredVx=f.dir*f.speed*(f.name==="seahorse.png"?.52:1),desiredVy=Math.sin(f.phase*(f.name==="seahorse.png"?.82:1.25)+f.school)*f.speed*(f.name==="seahorse.png"?.52:.28);
   if(f.pred&&f.r>player.r*1.12&&d<520){desiredVx+=dx/d*f.speed*.9;desiredVy+=dy/d*f.speed*.72}
   else if(!f.pred&&f.r<player.r*.92&&d<260){desiredVx-=dx/d*f.speed*1.45;desiredVy-=dy/d*f.speed*1.15}
   f.vx+=(desiredVx-f.vx)*Math.min(1,dt*2.2);f.vy+=(desiredVy-f.vy)*Math.min(1,dt*2.0);
 }
 if(Math.abs(f.vx)>7)f.dir=Math.sign(f.vx);
 f.x+=f.vx*dt;f.y+=f.vy*dt;const margin=f.r*1.5+12;
 if(f.x<margin){f.x=margin;f.vx=Math.abs(f.vx);f.dir=1}else if(f.x>WORLD_W-margin){f.x=WORLD_W-margin;f.vx=-Math.abs(f.vx);f.dir=-1}
 f.y=clamp(f.y,f.r+28,WORLD_H-f.r-28);f.clock+=dt;if(f.clock>.18){f.clock=0;f.frame=(f.frame+1)%2}
 if(f.pred&&d<340&&predatorWarnCd<=0&&f.r>player.r*1.15){playCue("warning");predatorWarnCd=5.5}
 // Predators only bite from their mouth. If the player touches the tail/rear body,
 // the predator turns toward the player, opens its jaw, then lunges.
 const bodyTouch=Math.hypot(player.x-f.x,player.y-f.y)<player.r*.82+f.r*.78;
 if(f.pred&&f.r>player.r*1.08&&bodyTouch&&hitT<=0&&f.attackState==="idle"){
   const relativeFront=(player.x-f.x)*f.dir;
   const playerOnFront=relativeFront>f.r*.08;
   startPredatorAttack(f,playerOnFront);
 }
 // The player can only eat a valid species when its own mouth reaches the prey.
 if(!f.pred||canEatFish(f)){
   const pm=playerMouth(),mouthDist=Math.hypot(pm.x-f.x,pm.y-f.y);
   if(mouthDist<player.r*.24+f.r*.58&&canEatFish(f)){eat(i);continue;}
 }
 }
// Mild separation between nearby fish prevents unreadable sprite piles without rigid bouncing.
for(let a=0;a<fish.length;a++)for(let b=a+1;b<fish.length;b++){const fa=fish[a],fb=fish[b],sx=fb.x-fa.x,sy=fb.y-fa.y,sd=Math.hypot(sx,sy)||.001,gap=(fa.r+fb.r)*.92;if(sd<gap){const push=(gap-sd)*.055,ux=sx/sd,uy=sy/sd;fa.x-=ux*push;fa.y-=uy*push;fb.x+=ux*push;fb.y+=uy*push}}
spawnT+=dt;const maxFish=gameMode==="survival"?28:25,interval=gameMode==="survival"?3.0:2.7;if(spawnT>interval&&fish.length<maxFish){spawn(false);spawnT=0}if(level>=3&&fish.length<maxFish&&Math.random()<dt*.018)spawn(true);
for(const b of bubbles){b.y-=b.s*dt;if(b.y<0)b.y=WORLD_H;b.x+=Math.sin((b.y+b.r)*.002)*dt*4}for(const p of particles){p.y-=42*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);
// Recycle fish that have wandered far outside the camera's active neighborhood.
fish=fish.filter(f=>Math.abs(f.x-(camera.x+W*.5))<W*1.65&&Math.abs(f.y-(camera.y+H*.5))<H*1.65);
}
function drawFish(f){
 const mantaFrame=f.name==="manta.png"?Math.floor((f.phase*6.5)%6):0;const sharkFrame=f.name==="shark.png"?Math.floor((f.phase*10)%8):0;const im=f.name==="manta.png"?(img[`manta_${mantaFrame}.png`]||img["manta.png"]):f.name==="shark.png"?(img[`shark_${sharkFrame}.png`]||img["shark.png"]):img[f.name];if(!(im&&im.complete&&im.naturalWidth))return;
 const scale=f.name==="lionfish.png"||f.name==="manta.png"||f.name==="shark.png"?2.0:f.name==="grouper.png"?2.05:f.name==="minnow.png"?2.55:2.15;
 const w=f.r*scale,h=w*im.height/im.width,sourceLeft=f.sourceLeft,flip=sourceLeft?f.dir>0:f.dir<0;
 ctx.save();ctx.translate(f.x,f.y+Math.sin(f.phase*2+f.school)*(f.name==="manta.png"?5.2:f.name==="shark.png"?3.6:2.4));if(f.name==="shark.png")ctx.rotate(Math.sin(f.phase*10)*.012);ctx.scale(flip?-1:1,1);ctx.drawImage(im,-w/2,-h/2,w,h);
 // 0.7.9: do not paint a synthetic jaw over the fish artwork.
 // The previous Canvas overlay was detached from each species' muzzle and produced
 // oversized dark ovals and dangling strokes. Keep the original clean sprite intact.
 // Predator attack timing remains in update(); the bite is communicated by the
 // lunge and hit reaction until dedicated closed/open sprite pairs are authored.
 if(f.pred&&f.attackState==="lunge"){
   const pulse=1+Math.sin(Math.min(1,f.attackTimer/.82)*Math.PI)*.035;
   ctx.translate(f.dir*f.r*.035,0);
   ctx.scale(pulse,1/pulse);
 }
 ctx.restore();
}
function drawHeart(x,y,size,filled){ctx.save();ctx.translate(x,y);const k=size/18;ctx.scale(k,k);ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-18,-4,-10,-16,0,-8);ctx.bezierCurveTo(10,-16,18,-4,0,7);ctx.closePath();if(filled){ctx.fillStyle="#ff526d";ctx.fill();ctx.strokeStyle="#ffd7df";ctx.lineWidth=1.2;ctx.stroke()}else{ctx.strokeStyle="#9ab5c5";ctx.lineWidth=1.8;ctx.stroke()}ctx.restore()}
function draw(){ctx.clearRect(0,0,W,H);
// World-space pass: camera follows the player through the wide ocean.
ctx.save();ctx.translate(-camera.x,-camera.y);const bgNames=["reef_background.png","kelp_background.png","kelp_background.png","reef_background.png","volcanic_background.png","volcanic_background.png","abyss_background.png","abyss_background.png","reef_background.png"],bg=img[bgNames[scene]||"reef_background.png"];if(bg?.complete&&bg.naturalWidth){const bs=Math.max(WORLD_W/bg.width,WORLD_H/bg.height),bw=bg.width*bs,bh=bg.height*bs;ctx.drawImage(bg,(WORLD_W-bw)/2,(WORLD_H-bh)/2,bw,bh)}else{const gr=ctx.createLinearGradient(0,0,0,WORLD_H);gr.addColorStop(0,scenes[scene].top);gr.addColorStop(1,scenes[scene].bottom);ctx.fillStyle=gr;ctx.fillRect(0,0,WORLD_W,WORLD_H)}ctx.fillStyle=scenes[scene].bottom+"18";ctx.fillRect(camera.x,camera.y,W,H);for(const b of bubbles){if(b.x<camera.x-30||b.x>camera.x+W+30||b.y<camera.y-30||b.y>camera.y+H+30)continue;ctx.strokeStyle=`rgba(210,250,255,${b.a})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke()}fish.forEach(drawFish);const frame=biteT>0?Math.min(7,4+Math.floor((.34-biteT)/.085)):Math.floor(Date.now()/145)%4,pimg=img["player_"+frame+".png"];if(pimg?.complete&&pimg.naturalWidth){const w=Math.min(player.r*2.1,portrait?240:330),h=w*pimg.height/pimg.width;ctx.save();ctx.translate(player.x,player.y);ctx.scale(player.face<0?-1:1,1);ctx.drawImage(pimg,-w/2,-h/2,w,h);ctx.restore()}else{ctx.fillStyle="#ffcf47";ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill()}ctx.save();particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.c;ctx.font="bold 22px system-ui";ctx.textAlign="center";ctx.fillText(p.t,p.x,p.y)});ctx.restore();ctx.restore();
// HUD is drawn in screen coordinates and never inherits the camera transform.
const hudH=portrait?208:92;
// Portrait HUD redesign: clear cards and deliberate spacing; no inline SCORE/value collision.
if(portrait){
 const rr=(x,y,w,h,r,fill,stroke)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}};
 const bg=ctx.createLinearGradient(0,0,0,hudH);bg.addColorStop(0,"rgba(4,43,66,.97)");bg.addColorStop(1,"rgba(5,58,79,.91)");ctx.fillStyle=bg;ctx.fillRect(0,0,W,hudH);
 ctx.fillStyle="rgba(103,226,239,.55)";ctx.fillRect(0,hudH-2,W,2);
 ctx.fillStyle="#ffe35a";ctx.font="900 27px system-ui";ctx.fillText("YUMY",22,49);
 ctx.fillStyle="#bcebf1";ctx.font="11px system-ui";ctx.fillText("OCEAN ADVENTURE",24,66);
 // Score card
 rr(18,79,154,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32)");
 ctx.fillStyle="#bfeaf0";ctx.font="700 10px system-ui";ctx.fillText("SCORE",31,98);
 ctx.fillStyle="#fff5c9";ctx.font="900 27px system-ui";ctx.fillText(String(score),31,132,126);
 // Combo chip
 rr(183,91,76,43,13,"rgba(255,211,86,.16)","rgba(255,218,106,.5)");
 ctx.fillStyle="#ffdf69";ctx.font="900 22px system-ui";ctx.textAlign="center";ctx.fillText(combo+"×",221,120);ctx.textAlign="left";
 // Growth card
 rr(270,79,194,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32)");
 ctx.fillStyle="#d9f8fb";ctx.font="700 10px system-ui";ctx.fillText("GROWTH · LV "+level,284,99);
 rr(284,111,164,13,7,"rgba(1,34,54,.8)",null);rr(287,114,158*Math.max(0,Math.min(1,growth)),7,4,"#b7e74d",null);
 // Lives card
 rr(475,79,227,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32)");
 ctx.fillStyle="#d9f8fb";ctx.font="700 10px system-ui";ctx.fillText("MẠNG",490,99);
 for(let i=0;i<3;i++)drawHeart(510+i*48,124,20,i<lives);
 // Bottom info rail
 rr(18,157,684,39,12,"rgba(2,35,57,.54)","rgba(117,224,235,.2)");
 ctx.fillStyle="#9debf0";ctx.font="800 10px system-ui";ctx.fillText("MỒI CÓ THỂ ĂN",30,181);
 ctx.fillStyle="#f1fcff";ctx.font="600 12px system-ui";ctx.fillText(currentPreyLabel(),145,181,250);
 ctx.fillStyle="#e4faff";ctx.font="700 10px system-ui";ctx.textAlign="right";ctx.fillText(gameMode==="adventure"?"MÀN "+(selectedStage+1):"SURVIVAL",W-145,181);
 ctx.fillStyle=scenes[scene].accent;ctx.font="700 10px system-ui";ctx.fillText(scenes[scene].name,W-28,181,108);ctx.textAlign="left";
 ctx.font="13px system-ui";ctx.textAlign="right";ctx.fillStyle="rgba(232,250,255,.48)";ctx.fillText("YUMY OCEAN",W-18,H-18);ctx.textAlign="left";
}else{ctx.fillStyle="#052d45e8";ctx.fillRect(0,0,W,hudH);ctx.fillStyle="#ffe35a";ctx.font="bold 30px system-ui";ctx.fillText("YUMY",24,39);ctx.fillText("GROWTH",175,32);ctx.fillStyle="#16485b";ctx.fillRect(175,45,210,15);ctx.fillStyle="#b7e74d";ctx.fillRect(178,48,204*growth,9);ctx.fillText("SCORE",460,31);ctx.font="bold 27px system-ui";ctx.fillText(String(score),460,65);ctx.fillStyle="#ffe35a";ctx.fillText(combo+"×",590,58);ctx.fillStyle="#fff";ctx.font="bold 15px system-ui";ctx.fillText("MỒI CÓ THỂ ĂN",720,32);ctx.fillStyle="#b8f1f7";ctx.font="13px system-ui";ctx.fillText(currentPreyLabel(),720,62);for(let i=0;i<3;i++)drawHeart(1000+i*25,30,18,i<lives);ctx.fillStyle="#e4faff";ctx.font="16px system-ui";ctx.fillText(gameMode==="adventure"?`MÀN ${selectedStage+1} · ${score}/${stageGoal}`:`SURVIVAL · WAVE ${survivalWave} · LV ${level}`,1130,40);ctx.fillStyle=scenes[scene].accent;ctx.fillText(scenes[scene].name,1130,62);ctx.font="15px system-ui";ctx.fillText(gameMode==="adventure"?`ADVENTURE · ${stages[selectedStage].name} · ${score}/${stageGoal}`:`SURVIVAL · WAVE ${survivalWave} · MỤC TIÊU ${waveGoal-(score-waveScoreStart)}`,24,H-18)}if(hitT>0){ctx.fillStyle=`rgba(255,20,20,${hitT*.18})`;ctx.fillRect(0,hudH,W,H-hudH)}}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop)}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
function screenToWorld(p){return{x:clamp(p.x+camera.x,0,WORLD_W),y:clamp(p.y+camera.y,0,WORLD_H)}}
canvas.addEventListener("pointerdown",e=>{audioStart();e.preventDefault();canvas.setPointerCapture(e.pointerId);const q=point(e);if(!running||over)return;activePointer=e.pointerId;pointer=q;target=screenToWorld(q)});
canvas.addEventListener("pointermove",e=>{if(activePointer===e.pointerId&&running&&!paused){e.preventDefault();pointer=point(e);target=screenToWorld(pointer)}});
function endPointer(e){if(activePointer===e.pointerId){activePointer=null;pointer=null;target=null}}
canvas.addEventListener("pointerup",endPointer);canvas.addEventListener("pointercancel",endPointer);canvas.addEventListener("lostpointercapture",endPointer);
function showPauseHome(){$("pauseAudioView").classList.add("hidden");$("pauseHomeView").classList.remove("hidden");}
function showPauseAudio(){syncAudioControls();$("pauseHomeView").classList.add("hidden");$("pauseAudioView").classList.remove("hidden");}
function backOneScreen(){
  if(!$("pauseAudioView").classList.contains("hidden")){showPauseHome();return true;}
  if(!$("pause").classList.contains("hidden")&&paused){paused=false;$("pause").classList.add("hidden");showPauseHome();return true;}
  if(!$("mapView").classList.contains("hidden")) {showHome();return true;}
  return false;
}
function renderStages(){const grid=$("stageGrid");grid.innerHTML="";$("mapProgress").textContent=`${stageUnlocked} / ${stages.length} màn chơi đã mở khóa · ${stageCompleted.length} đã hoàn thành`;stages.forEach((st,i)=>{const unlocked=i+1<=stageUnlocked,done=stageCompleted.includes(i),b=document.createElement("button");b.type="button";b.className="stage-card map-node scene-"+st.scene+(unlocked?"":" locked")+(i===selectedStage?" active":"")+(done?" completed":"");b.disabled=!unlocked;b.setAttribute("aria-label",`Màn ${i+1}: ${st.name}, ${unlocked?"đã mở khóa":"đang khóa"}`);const symbols=["🪸","🏝️","🐠","🐚","🌿","🌱","🦁","🪨","🌋","♨️","🔥","🧱","🌌","🕳️","✨","🪼","👑","💎"];b.innerHTML=`<span class="node-top"><span class="node-number">${String(i+1).padStart(2,"0")}</span><span class="node-state">${done?"✓":unlocked?"●":"🔒"}</span></span><span class="node-icon">${symbols[i]}</span><b>${st.name}</b><small>${st.goal.toLocaleString("vi-VN")} điểm</small><em>${done?"ĐÃ HOÀN THÀNH":unlocked?"SẴN SÀNG":"CHƯA MỞ KHÓA"}</em>`;b.onclick=()=>{selectedStage=i;renderStages()};grid.appendChild(b)});const st=stages[selectedStage];$("stageDetails").innerHTML=`<b>${["🪸","🏝️","🐠","🐚","🌿","🌱","🦁","🪨","🌋","♨️","🔥","🧱","🌌","🕳️","✨","🪼","👑","💎"][selectedStage]} ${st.name}</b><span>${st.goal.toLocaleString("vi-VN")} điểm · ${st.desc}</span>`;$("mapStart").disabled=selectedStage+1>stageUnlocked}
$("webMenuBtn").onclick=()=>{if(!running||over)return;playCue("menu");paused=true;activePointer=null;target=null;particles=[];showPauseHome();$("pause").classList.remove("hidden")};$("survivalMode").onclick=()=>{audioStart().then(()=>playCue("menu"));gameMode="survival";selectedStage=0;audioStart();resizeGame();if(document.documentElement.requestFullscreen&&/Android|iPhone|iPad/i.test(navigator.userAgent))document.documentElement.requestFullscreen().catch(()=>{});reset()};
$("adventureMode").onclick=()=>{audioStart().then(()=>playCue("menu"));selectedStage=Math.max(0,Math.min(selectedStage,stageUnlocked-1));showAdventureMap()};$("mapBack").onclick=showHome;$("mapStart").onclick=()=>{if(selectedStage+1>stageUnlocked)return;gameMode="adventure";audioStart();resizeGame();if(document.documentElement.requestFullscreen&&/Android|iPhone|iPad/i.test(navigator.userAgent))document.documentElement.requestFullscreen().catch(()=>{});reset()};$("backToMenu").onclick=showHome;$("pauseToMenu").onclick=showHome;
$("again").onclick=()=>{if(gameMode==="survival"&&stageWon){nextSurvivalWave();return}if(gameMode==="adventure"&&stageWon&&selectedStage<stages.length-1){selectedStage++;showAdventureMap();return}reset()};
$("openAudioSettings").onclick=showPauseAudio;$("audioBack").onclick=showPauseHome;$("musicToggle").onchange=async e=>{musicOn=e.target.checked;localStorage.yumyMusicOn=musicOn?"1":"0";if(musicOn)await audioStart();applyAudioSettings()};$("sfxToggle").onchange=async e=>{sfxOn=e.target.checked;localStorage.yumySfxOn=sfxOn?"1":"0";if(sfxOn)await audioStart();applyAudioSettings()};$("musicVolume").oninput=e=>{musicVolume=+e.target.value/100;localStorage.yumyMusicVolume=e.target.value;applyAudioSettings()};$("sfxVolume").oninput=e=>{sfxVolume=+e.target.value/100;localStorage.yumySfxVolume=e.target.value;applyAudioSettings()};syncAudioControls();$("resume").onclick=()=>{paused=false;$("pause").classList.add("hidden");showPauseHome()};
// Android-style edge swipe: swipe from the left edge to the right to go back one screen.
let edgeStart=null;
document.addEventListener("pointerdown",e=>{if(e.clientX<=28&&e.pointerType!=="mouse"){edgeStart={x:e.clientX,y:e.clientY,id:e.pointerId};}},{capture:true,passive:true});
document.addEventListener("pointerup",e=>{if(!edgeStart||edgeStart.id!==e.pointerId)return;const dx=e.clientX-edgeStart.x,dy=Math.abs(e.clientY-edgeStart.y);if(dx>=72&&dy<Math.max(90,dx*.7)){if(backOneScreen())e.preventDefault();}edgeStart=null;},{capture:true});
document.addEventListener("pointercancel",()=>{edgeStart=null;},{capture:true});
window.addEventListener("keydown",e=>{if(e.code==="Escape"||e.code==="Backspace"){if(backOneScreen()){e.preventDefault();return;}if(running&&!over&&!paused){paused=true;showPauseHome();$("pause").classList.remove("hidden");e.preventDefault();}}});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});requestAnimationFrame(loop);
})();
