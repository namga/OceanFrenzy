(()=>{"use strict";
const canvas=document.getElementById("c"),ctx=canvas.getContext("2d");
let W=1280,H=720,portrait=false;
const WORLD_W=4800,WORLD_H=4200;
const camera={x:0,y:0};
const img={};
// Explicit runtime state: release builds run in strict mode.
let running=false,paused=false,over=false,stageWon=false,gameMode="survival",selectedStage=0,scene=0,last=performance.now();
let score=0,best=Number(localStorage.yumyBest||0),growth=.08,level=1,lives=3,combo=1,comboT=0,comboFlash=0,comboFlashT=0;
let survivalWave=1,waveScoreStart=0,waveGoal=3200,stageGoal=0,stageUnlocked=Math.max(1,Number(localStorage.yumyAdventureUnlocked||1)),stageCompleted=[];
try{stageCompleted=JSON.parse(localStorage.yumyAdventureCompleted||"[]")}catch{stageCompleted=[]}
let player={x:420,y:2100,vx:0,vy:0,r:28,face:1},target=null,pointer=null,activePointer=null;
let controlMode=localStorage.yumyControlMode||((navigator.maxTouchPoints||0)>0?"joystick":"swipe"),joystickVector={x:0,y:0},joystickPointer=null;
let fish=[],particles=[],bubbles=[],ambientCreatures=[],ambientSpawnT=8,spawnT=0;
let predatorSpawnT=0,predatorWarnCd=0,biteT=0,hitT=0;
let audioCtx=null,masterGain=null,musicGain=null,sfxGain=null,ambientAudio=null,chompAudio=null,gulpAudio=null,musicNodes=[];
let musicOn=localStorage.yumyMusicOn!=="0",sfxOn=localStorage.yumySfxOn!=="0",musicVolume=Number(localStorage.yumyMusicVolume||22)/100,sfxVolume=Number(localStorage.yumySfxVolume||95)/100;
let boostActive=false,boostTime=0,boostCooldown=0,boostNotice=0;
let activeSceneBg=null,activeSceneBgIndex=-1;
function sceneBackground(index){if(activeSceneBgIndex!==index){activeSceneBgIndex=index;activeSceneBg=new Image();activeSceneBg.decoding="async";activeSceneBg.src=`assets/stage_bg_${String(index+1).padStart(2,"0")}.jpg`;}return activeSceneBg;}
["reef_background.png","player_0.png","player_1.png","player_2.png","player_3.png","player_4.png","player_5.png","player_6.png","player_7.png","minnow.png","yellow-tang.png","blue-tang.png","clownfish.png","grouper.png","lionfish.png","shark.png","manta.png","seahorse.png","pufferfish.svg","butterflyfish.svg","angelfish.svg","manta_0.png","manta_1.png","manta_2.png","manta_3.png","manta_4.png","manta_5.png","shark_0.png","shark_1.png","shark_2.png","shark_3.png","shark_4.png","shark_5.png","shark_6.png","shark_7.png","grouper_closed.png","lionfish_closed.png","manta_closed.png","shark_closed.png","kelp_background.png","volcanic_background.png","abyss_background.png","turtle.png","whale.png","orca.png",...Array.from({length:8},(_,i)=>`turtle_swim_${i}.png`),...Array.from({length:8},(_,i)=>`whale_swim_${i}.png`),...Array.from({length:8},(_,i)=>`orca_swim_${i}.png`)].forEach(n=>{img[n]=new Image();img[n].src="assets/"+n});
const $=id=>document.getElementById(id);
const LANGS={
 vi:{tagline:"Khám phá đại dương · Ăn cá nhỏ hơn · Tránh kẻ săn mồi",survival:"SINH TỒN",survivalDesc:"Sống sót lâu nhất có thể. Không cần chọn bản đồ.",playNow:"CHƠI NGAY →",adventure:"PHIÊU LƯU",adventureDesc:"Khám phá từng vùng biển, hoàn thành mục tiêu để mở khóa màn mới.",chooseRegion:"CHỌN VÙNG BIỂN →",controlsHint:"🎮 Android: dùng joystick hoặc chọn vuốt màn hình trong Cài đặt · Máy tính: rê chuột để bơi",stageCount:"🌊 50 màn chơi · 50 vùng biển",oceanMap:"BẢN ĐỒ ĐẠI DƯƠNG",completed:"🟢 Hoàn thành",playable:"🟡 Có thể chơi",locked:"🔒 Chưa mở",startStage:"BẮT ĐẦU MÀN CHƠI",menu:"CÀI ĐẶT",gamePaused:"Trò chơi đang tạm dừng",resume:"TIẾP TỤC",settings:"CÀI ĐẶT",controlMode:"Kiểu điều khiển",joystick:"Joystick",swipe:"Vuốt màn hình",chooseModeStage:"CHỌN CHẾ ĐỘ / MÀN",language:"Ngôn ngữ",music:"Nhạc nền",musicVolume:"Âm lượng nhạc",soundEffects:"Hiệu ứng âm thanh",effectsVolume:"Âm lượng hiệu ứng",gameOver:"HẾT LƯỢT",playAgain:"CHƠI LẠI",score:"ĐIỂM",growth:"PHÁT TRIỂN",lives:"MẠNG",prey:"MỒI CÓ THỂ ĂN",survivalShort:"SINH TỒN",stage:"MÀN",notReady:"Chưa có mồi phù hợp",stageUnlocked:"màn chơi đã mở khóa",finished:"ĐÃ HOÀN THÀNH",ready:"SẴN SÀNG",notUnlocked:"CHƯA MỞ KHÓA",points:"điểm",stageComplete:"HOÀN THÀNH MÀN CHƠI!",waveComplete:"WAVE {n} HOÀN THÀNH!",continueNext:"TIẾP TỤC ĐẾN VÙNG BIỂN TIẾP THEO",nextStage:"MÀN TIẾP THEO",tryAgain:"THỬ LẠI",lostLife:"MẤT MỘT MẠNG · KÍCH THƯỚC GIẢM",eatenBy:"Bị cá săn mồi nuốt chửng",record:"Kỷ lục",level:"Cấp",adventureShort:"PHIÊU LƯU",wave:"ĐỢT",goal:"MỤC TIÊU"},
 en:{tagline:"Explore the ocean · Eat smaller fish · Avoid predators",survival:"SURVIVAL",survivalDesc:"Survive as long as you can. No map required.",playNow:"PLAY NOW →",adventure:"ADVENTURE",adventureDesc:"Explore ocean regions and complete goals to unlock new stages.",chooseRegion:"CHOOSE REGION →",controlsHint:"🎮 Android: use the joystick or choose swipe controls in Settings · Desktop: move the mouse",stageCount:"🌊 50 stages · 50 ocean regions",oceanMap:"OCEAN MAP",completed:"🟢 Completed",playable:"🟡 Available",locked:"🔒 Locked",startStage:"START STAGE",menu:"MENU",gamePaused:"Game paused",resume:"RESUME",settings:"SETTINGS",controlMode:"Control method",joystick:"Joystick",swipe:"Swipe screen",chooseModeStage:"CHOOSE MODE / STAGE",language:"Language",music:"Background music",musicVolume:"Music volume",soundEffects:"Sound effects",effectsVolume:"Effects volume",gameOver:"GAME OVER",playAgain:"PLAY AGAIN",score:"SCORE",growth:"GROWTH",lives:"LIVES",prey:"EDIBLE PREY",survivalShort:"SURVIVAL",stage:"STAGE",notReady:"No suitable prey yet",stageUnlocked:"stages unlocked",finished:"COMPLETED",ready:"READY",notUnlocked:"LOCKED",points:"points",stageComplete:"STAGE COMPLETE!",waveComplete:"WAVE {n} COMPLETE!",continueNext:"CONTINUE TO NEXT OCEAN",nextStage:"NEXT STAGE",tryAgain:"TRY AGAIN",lostLife:"LIFE LOST · SIZE REDUCED",eatenBy:"Eaten by a predator",record:"Record",level:"Level",adventureShort:"ADVENTURE",wave:"WAVE",goal:"GOAL"},
 zh:{tagline:"探索海洋 · 吃掉更小的鱼 · 躲避捕食者",survival:"生存模式",survivalDesc:"尽可能长时间生存，无需选择地图。",playNow:"立即开始 →",adventure:"冒险模式",adventureDesc:"探索海域并完成目标，解锁新关卡。",chooseRegion:"选择海域 →",controlsHint:"🖱️ 移动鼠标游动 · 按住左键加速5秒 · 安卓：触摸并拖动",stageCount:"🌊 50个关卡 · 50个海域",oceanMap:"海洋地图",completed:"🟢 已完成",playable:"🟡 可游玩",locked:"🔒 未解锁",startStage:"开始关卡",menu:"菜单",gamePaused:"游戏已暂停",resume:"继续游戏",settings:"设置",chooseModeStage:"选择模式 / 关卡",language:"语言",music:"背景音乐",musicVolume:"音乐音量",soundEffects:"音效",effectsVolume:"音效音量",gameOver:"游戏结束",playAgain:"重新开始",score:"分数",growth:"成长",lives:"生命",prey:"可吃的鱼",survivalShort:"生存",stage:"关卡",notReady:"暂无合适的猎物",stageUnlocked:"个关卡已解锁",finished:"已完成",ready:"可开始",notUnlocked:"未解锁",points:"分",stageComplete:"关卡完成！",waveComplete:"第 {n} 波完成！",continueNext:"前往下一个海域",nextStage:"下一关",tryAgain:"再试一次",lostLife:"失去一条生命 · 体型缩小",eatenBy:"被捕食者吃掉",record:"纪录",level:"等级",adventureShort:"冒险",wave:"波次",goal:"目标"},
 ko:{tagline:"바다 탐험 · 더 작은 물고기 먹기 · 포식자 피하기",survival:"생존",survivalDesc:"지도 선택 없이 최대한 오래 살아남으세요.",playNow:"바로 플레이 →",adventure:"모험",adventureDesc:"해역을 탐험하고 목표를 달성해 새 스테이지를 여세요.",chooseRegion:"해역 선택 →",controlsHint:"🖱️ 마우스 이동으로 수영 · 왼쪽 버튼 길게 눌러 5초 부스트 · Android: 터치 후 드래그",stageCount:"🌊 50개 스테이지 · 50개 해역",oceanMap:"바다 지도",completed:"🟢 완료",playable:"🟡 플레이 가능",locked:"🔒 잠김",startStage:"스테이지 시작",menu:"메뉴",gamePaused:"게임 일시정지",resume:"계속하기",settings:"설정",chooseModeStage:"모드 / 스테이지 선택",language:"언어",music:"배경 음악",musicVolume:"음악 볼륨",soundEffects:"효과음",effectsVolume:"효과음 볼륨",gameOver:"게임 종료",playAgain:"다시 플레이",score:"점수",growth:"성장",lives:"생명",prey:"먹을 수 있는 먹이",survivalShort:"생존",stage:"스테이지",notReady:"먹을 수 있는 먹이가 없습니다",stageUnlocked:"개 스테이지 잠금 해제",finished:"완료",ready:"준비",notUnlocked:"잠김",points:"점",stageComplete:"스테이지 완료!",waveComplete:"웨이브 {n} 완료!",continueNext:"다음 해역으로 계속",nextStage:"다음 스테이지",tryAgain:"다시 시도",lostLife:"생명 감소 · 크기 축소",eatenBy:"포식자에게 먹혔습니다",record:"기록",level:"레벨",adventureShort:"모험",wave:"웨이브",goal:"목표"},
 fr:{tagline:"Explorez l’océan · Mangez les petits poissons · Évitez les prédateurs",survival:"SURVIE",survivalDesc:"Survivez le plus longtemps possible, sans carte.",playNow:"JOUER →",adventure:"AVENTURE",adventureDesc:"Explorez les régions et atteignez les objectifs pour débloquer des niveaux.",chooseRegion:"CHOISIR UNE RÉGION →",controlsHint:"🖱️ Déplacez la souris · Maintenez le clic gauche : boost 5 s · Android : toucher-glisser",stageCount:"🌊 50 niveaux · 50 régions océaniques",oceanMap:"CARTE DE L’OCÉAN",completed:"🟢 Terminé",playable:"🟡 Disponible",locked:"🔒 Verrouillé",startStage:"COMMENCER LE NIVEAU",menu:"MENU",gamePaused:"Jeu en pause",resume:"REPRENDRE",settings:"PARAMÈTRES",chooseModeStage:"CHOISIR MODE / NIVEAU",language:"Langue",music:"Musique de fond",musicVolume:"Volume de la musique",soundEffects:"Effets sonores",effectsVolume:"Volume des effets",gameOver:"PARTIE TERMINÉE",playAgain:"REJOUER",score:"SCORE",growth:"CROISSANCE",lives:"VIES",prey:"PROIES COMESTIBLES",survivalShort:"SURVIE",stage:"NIVEAU",notReady:"Aucune proie adaptée",stageUnlocked:"niveaux débloqués",finished:"TERMINÉ",ready:"PRÊT",notUnlocked:"VERROUILLÉ",points:"points",stageComplete:"NIVEAU TERMINÉ !",waveComplete:"VAGUE {n} TERMINÉE !",continueNext:"CONTINUER VERS LA ZONE SUIVANTE",nextStage:"NIVEAU SUIVANT",tryAgain:"RÉESSAYER",lostLife:"VIE PERDUE · TAILLE RÉDUITE",eatenBy:"Dévoré par un prédateur",record:"Record",level:"Niveau",adventureShort:"AVENTURE",wave:"VAGUE",goal:"OBJECTIF"},
 de:{tagline:"Erkunde den Ozean · Fress kleinere Fische · Meide Räuber",survival:"ÜBERLEBEN",survivalDesc:"Überlebe so lange wie möglich. Keine Karte nötig.",playNow:"JETZT SPIELEN →",adventure:"ABENTEUER",adventureDesc:"Erkunde Meeresgebiete und erfülle Ziele, um neue Level freizuschalten.",chooseRegion:"GEBIET WÄHLEN →",controlsHint:"🖱️ Maus bewegen · Linke Taste halten: 5-Sekunden-Boost · Android: berühren und ziehen",stageCount:"🌊 50 Level · 50 Meeresgebiete",oceanMap:"OZEANKARTE",completed:"🟢 Abgeschlossen",playable:"🟡 Spielbar",locked:"🔒 Gesperrt",startStage:"LEVEL STARTEN",menu:"MENÜ",gamePaused:"Spiel pausiert",resume:"WEITERSPIELEN",settings:"EINSTELLUNGEN",chooseModeStage:"MODUS / LEVEL WÄHLEN",language:"Sprache",music:"Hintergrundmusik",musicVolume:"Musiklautstärke",soundEffects:"Soundeffekte",effectsVolume:"Effektlautstärke",gameOver:"SPIEL VORBEI",playAgain:"NOCHMAL SPIELEN",score:"PUNKTE",growth:"WACHSTUM",lives:"LEBEN",prey:"FRESSBARE BEUTE",survivalShort:"ÜBERLEBEN",stage:"LEVEL",notReady:"Noch keine passende Beute",stageUnlocked:"Level freigeschaltet",finished:"ABGESCHLOSSEN",ready:"BEREIT",notUnlocked:"GESPERRT",points:"Punkte",stageComplete:"LEVEL GESCHAFFT!",waveComplete:"WELLE {n} GESCHAFFT!",continueNext:"WEITER ZUM NÄCHSTEN MEERESGEBIET",nextStage:"NÄCHSTES LEVEL",tryAgain:"ERNEUT VERSUCHEN",lostLife:"LEBEN VERLOREN · KLEINER GEWORDEN",eatenBy:"Von einem Räuber gefressen",record:"Rekord",level:"Stufe",adventureShort:"ABENTEUER",wave:"WELLE",goal:"ZIEL"}
};
let language=["vi","en","zh","ko","fr","de"].includes(localStorage.yumyLanguage)?localStorage.yumyLanguage:"vi";
function tr(key){return (LANGS[language]&&LANGS[language][key])||LANGS.vi[key]||key}
// Apply the selected locale to every translated UI element before the first frame.
// Keep the selected locale applied before the first rendered frame.
function applyLanguage(){
  document.documentElement.lang=language;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.getAttribute("data-i18n");
    const value=tr(key);
    if(value!==key)el.textContent=value;
  });
  const menuButton=$("webMenuBtn");
  if(menuButton)menuButton.textContent=tr("menu");
  syncControlSettings();
  resizeGame();
}
const STAGE_NAMES={vi:["Rạn San Hô Bình Minh", "Bãi Cát Ngọc Trai", "Vịnh Cá Nhiệt Đới", "Đầm Phá Xanh", "Rừng Tảo Biển", "Thung Lũng Rong", "Vách Đá Sư Tử Biển", "Hang San Hô", "Miệng Núi Lửa", "Ống Khói Dung Nham", "Hang Dung Nham", "Lòng Chảo Tro", "Vực Thẳm Xanh", "Rãnh Đại Dương", "Thành Phố Phát Sáng", "Khu Vườn Ánh Sáng", "Vương Quốc Đại Dương", "Ngai Vàng Biển Sâu", "Đảo San Hô Tím", "Lagoon Ngọc Lục", "Rạn San Hô Cầu Vồng", "Vịnh Sứa Pha Lê", "Rừng Tảo Khổng Lồ", "Hẻm Núi Xanh", "Vườn Hải Quỳ", "Đảo Đá Núi Lửa", "Dòng Hải Lưu Bạc", "Hang Ngọc Trai", "Thung Lũng Cá Đuối", "Rạn San Hô Mặt Trăng", "Vực Xanh Thẳm", "Rừng Sứa Phát Quang", "Thành Phố Tàu Đắm", "Cổng Đá Đại Dương", "Vườn San Hô Vàng", "Biển Băng Xanh", "Hang Băng Pha Lê", "Miệng Phun Thủy Nhiệt", "Đồng Bằng Cát Trắng", "Rạn San Hô Đỏ", "Vịnh Cá Voi", "Vương Quốc Rong Biển", "Hẻm Vực Bóng Tối", "Đảo Núi Ngầm", "Thành Phố Ngọc Lam", "Rừng San Hô Đêm", "Dòng Chảy Sao Biển", "Cung Điện Biển Xanh", "Vực Thẳm Ánh Sao", "Bí Ẩn Đáy Đại Dương"],en:["Dawn Coral Reef", "Pearl Sandbar", "Tropical Fish Bay", "Blue Lagoon", "Kelp Forest", "Seaweed Valley", "Sea Lion Cliffs", "Coral Cavern", "Volcanic Crater", "Lava Chimneys", "Lava Cavern", "Ash Basin", "Blue Abyss", "Ocean Trench", "Glowing City", "Garden of Light", "Ocean Kingdom", "Deep Sea Throne", "Violet Coral Isle", "Emerald Lagoon", "Rainbow Reef", "Crystal Jelly Bay", "Giant Kelp Woods", "Azure Canyon", "Sea Anemone Garden", "Basalt Island", "Silver Current", "Pearl Grotto", "Manta Valley", "Moonlit Reef", "Midnight Blue Deep", "Luminous Jelly Forest", "Sunken Ship City", "Ocean Stone Gate", "Golden Coral Garden", "Blue Ice Sea", "Crystal Ice Cave", "Hydrothermal Vents", "White Sand Flats", "Red Coral Reef", "Whale Bay", "Seaweed Kingdom", "Shadow Chasm", "Undersea Volcano Isle", "Turquoise City", "Night Coral Woods", "Starfish Current", "Azure Palace", "Starlit Abyss", "Secrets of the Deep"],zh:["黎明珊瑚礁", "珍珠沙洲", "热带鱼湾", "蓝色泻湖", "海藻森林", "海藻山谷", "海狮峭壁", "珊瑚洞穴", "火山口", "熔岩烟囱", "熔岩洞穴", "灰烬盆地", "蓝色深渊", "海沟", "发光之城", "光之花园", "海洋王国", "深海王座", "紫珊瑚岛", "翡翠泻湖", "彩虹礁", "水晶水母湾", "巨型海藻林", "蔚蓝峡谷", "海葵花园", "玄武岩岛", "银色洋流", "珍珠洞穴", "蝠鲼山谷", "月光珊瑚礁", "午夜深蓝", "发光水母林", "沉船之城", "海洋石门", "金色珊瑚园", "蓝冰海域", "水晶冰洞", "热液喷口", "白沙平原", "红珊瑚礁", "鲸鱼湾", "海藻王国", "暗影深渊", "海底火山岛", "绿松石之城", "夜色珊瑚林", "海星洋流", "蔚蓝宫殿", "星光深渊", "深海之谜"],ko:["새벽 산호초", "진주 모래톱", "열대어 만", "푸른 석호", "켈프 숲", "해초 계곡", "바다사자 절벽", "산호 동굴", "화산 분화구", "용암 굴뚝", "용암 동굴", "재 분지", "푸른 심연", "해구", "빛나는 도시", "빛의 정원", "바다 왕국", "심해 왕좌", "보라 산호섬", "에메랄드 석호", "무지개 산호초", "수정 해파리 만", "거대 해초 숲", "푸른 협곡", "말미잘 정원", "현무암 섬", "은빛 해류", "진주 동굴", "가오리 계곡", "달빛 산호초", "한밤의 심해", "빛나는 해파리 숲", "침몰선 도시", "바다 돌문", "황금 산호 정원", "푸른 얼음 바다", "수정 얼음 동굴", "열수 분출구", "하얀 모래 평원", "붉은 산호초", "고래 만", "해초 왕국", "그림자 협곡", "해저 화산섬", "청록 도시", "밤의 산호 숲", "불가사리 해류", "푸른 궁전", "별빛 심연", "심해의 비밀"],fr:["Récif de l’aube", "Banc de perles", "Baie tropicale", "Lagon bleu", "Forêt de varech", "Vallée des algues", "Falaises des otaries", "Grotte corallienne", "Cratère volcanique", "Cheminées de lave", "Caverne de lave", "Bassin de cendres", "Abîme bleu", "Fosse océanique", "Cité lumineuse", "Jardin de lumière", "Royaume océanique", "Trône des abysses", "Île de corail violet", "Lagon émeraude", "Récif arc-en-ciel", "Baie des méduses de cristal", "Forêt de varech géant", "Canyon azur", "Jardin d’anémones", "Île basaltique", "Courant argenté", "Grotte des perles", "Vallée des raies", "Récif au clair de lune", "Profondeurs bleu nuit", "Forêt de méduses lumineuses", "Cité des épaves", "Porte de pierre océanique", "Jardin de corail doré", "Mer de glace bleue", "Grotte de cristal", "Sources hydrothermales", "Plaines de sable blanc", "Récif rouge", "Baie des baleines", "Royaume des algues", "Gouffre des ombres", "Île volcanique sous-marine", "Cité turquoise", "Forêt de corail nocturne", "Courant des étoiles de mer", "Palais azur", "Abîme étoilé", "Secrets des profondeurs"],de:["Korallenriff der Morgenröte", "Perlensandbank", "Tropische Fischbucht", "Blaue Lagune", "Tangwald", "Algental", "Seelöwenklippen", "Korallenhöhle", "Vulkankrater", "Lavaschlote", "Lavahöhle", "Aschebecken", "Blauer Abgrund", "Tiefseegraben", "Leuchtende Stadt", "Garten des Lichts", "Ozeankönigreich", "Thron der Tiefsee", "Violette Koralleninsel", "Smaragdlagune", "Regenbogenriff", "Kristallquallenbucht", "Riesentangwald", "Azurblauer Canyon", "Seeanemonengarten", "Basaltinsel", "Silberströmung", "Perlengrotte", "Rochen-Tal", "Mondscheinriff", "Mitternachtsblau", "Leuchtender Quallenwald", "Wrackstadt", "Ozean-Steintor", "Goldkorallengarten", "Blaues Eismeer", "Kristalleishöhle", "Hydrothermalquellen", "Weißsandebene", "Rotes Korallenriff", "Walbucht", "Tangreich", "Schattenschlucht", "Untersee-Vulkaninsel", "Türkise Stadt", "Nachtkorallenwald", "Seesternströmung", "Azurpalast", "Sternenabgrund", "Geheimnisse der Tiefsee"]};
const STAGE_DESC={vi:[["Bắt đầu hành trình giữa rạn san hô yên bình.", "Luồn qua bãi cát và những cụm san hô thấp.", "Đàn cá nhiệt đới đông hơn, hãy chọn mồi phù hợp.", "Dòng nước đổi hướng, điều khiển cá thật linh hoạt.", "Tảo biển dày đặc tạo nhiều nơi ẩn nấp.", "Cá săn mồi bắt đầu tuần tra quanh thung lũng.", "Vách đá là nơi trú ẩn của những kẻ săn mồi lớn.", "Các hang san hô có nhiều lối đi hẹp.", "Dòng nước nóng khiến cuộc săn trở nên nguy hiểm.", "Tránh những vùng dung nham và cá săn mồi nhanh.", "Hang sâu có tầm nhìn hạn chế và nhiều cá lớn.", "Đàn cá thưa hơn nhưng kẻ săn mồi nguy hiểm hơn.", "Ánh sáng yếu dần khi tiến vào vực thẳm.", "Những bóng đen lớn xuất hiện trong rãnh sâu.", "Sinh vật phát sáng làm thay đổi khung cảnh.", "Đàn cá phát quang di chuyển thành nhóm lớn.", "Thử thách cuối của vùng biển quen thuộc.", "Chinh phục ngai vàng ở tầng biển sâu.", "San hô tím tạo thành mê cung nhiều nhánh.", "Hồ nước xanh ngọc có dòng chảy mạnh.", "Rạn cầu vồng có nhiều đàn cá nhỏ và cá săn mồi.", "Sứa pha lê trôi chậm giữa vùng nước trong.", "Tảo khổng lồ che khuất tầm nhìn ở nhiều nơi.", "Hẻm núi xanh có dòng xoáy bất ngờ.", "Hải quỳ dày đặc, cá nhỏ thường ẩn bên trong.", "Đá núi lửa tạo địa hình gồ ghề.", "Dòng hải lưu bạc đẩy cá đi nhanh hơn.", "Hang ngọc trai có nhiều ngóc ngách tối.", "Cá đuối xuất hiện nhiều quanh thung lũng.", "Ánh trăng chiếu xuống rạn san hô ban đêm.", "Vực xanh thẳm có cá mập bơi nhanh hơn.", "Sứa phát quang tạo ánh sáng trong vùng tối.", "Xác tàu đắm là nơi trú ẩn của cá lớn.", "Cổng đá có những lối bơi hẹp cần né tránh.", "San hô vàng rực rỡ nhưng có nhiều kẻ săn mồi.", "Nước lạnh làm thay đổi nhịp di chuyển của đàn cá.", "Hang băng có những vách đá trơn và hẹp.", "Miệng phun thủy nhiệt tạo dòng nước nóng mạnh.", "Đồng bằng cát rộng nhưng ít nơi ẩn nấp.", "Rạn đỏ là vùng săn mồi đông đúc.", "Cá voi đi ngang qua, cá mập cũng xuất hiện nhiều hơn.", "Rong biển dày khiến các cuộc rượt đuổi khó đoán.", "Hẻm vực tối là thử thách dành cho cá đã lớn.", "Đảo núi ngầm có nhiều dòng nước xoáy.", "Thành phố ngọc lam có đàn cá đa dạng.", "Rừng san hô đêm có tầm nhìn hạn chế.", "Dòng chảy sao biển đẩy đàn cá theo từng đợt.", "Cung điện biển xanh là nơi tập trung cá săn mồi.", "Vực thẳm ánh sao có những kẻ săn mồi tốc độ cao.", "Vượt qua bí ẩn cuối cùng dưới đáy đại dương."]],en:["Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat.", "Explore a new ocean habitat."],zh:["探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。", "探索全新的海洋栖息地。"],ko:["새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요.", "새로운 바다 서식지를 탐험하세요."],fr:["Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin.", "Explorez un nouvel habitat marin."],de:["Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum.", "Erkunde einen neuen Meereslebensraum."]};
function stageName(i){return (STAGE_NAMES[language]||STAGE_NAMES.vi)[i]||`Stage ${i+1}`}
function stageDesc(i){return (STAGE_DESC[language]||STAGE_DESC.vi)[i]||STAGE_DESC.vi[i]}
function sceneName(i){return (SCENE_NAMES[language]||SCENE_NAMES.vi)[i]||scenes[i]?.name||""}
function stageSymbol(i){return ["🪸", "🏝️", "🐠", "🐚", "🌿", "🌱", "🦭", "🪨", "🌋", "♨️", "🔥", "🧱", "🌌", "🕳️", "✨", "🪼", "👑", "💎", "🪸", "🏝️", "🌈", "🪼", "🌿", "🏞️", "🪸", "🌋", "🌊", "🐚", "🦈", "🌙", "🌌", "🪼", "🚢", "🗿", "🪸", "🧊", "❄️", "♨️", "🏖️", "🪸", "🐋", "🌱", "🌑", "🌋", "💠", "🌌", "⭐", "🏰", "✨", "🐙"][i]||"🌊"}
const SCENE_NAMES={vi:STAGE_NAMES.vi.map(x=>x.toUpperCase()),en:STAGE_NAMES.en.map(x=>x.toUpperCase()),zh:STAGE_NAMES.zh,ko:STAGE_NAMES.ko,fr:STAGE_NAMES.fr.map(x=>x.toUpperCase()),de:STAGE_NAMES.de.map(x=>x.toUpperCase())};
const stages=Array.from({length:50},(_,i)=>({name:STAGE_NAMES.vi[i],scene:i,goal:Math.round(900+Math.pow(i,1.34)*470),desc:STAGE_DESC.vi[i]||"Vùng biển mới với thử thách khó hơn"}));
const palette=[
["#08a9c4","#064b9c","#ff9b62"],["#10b8c5","#07528d","#ffcf65"],["#087f83","#063c68","#9edb73"],["#176e94","#092d59","#ff9a65"],["#8c4b37","#182b55","#ff8a3d"],["#a34425","#160e28","#ff6b24"],["#173b77","#080f36","#7c9cff"],["#183e88","#120d45","#ff73df"],["#0b8794","#09294e","#ffe16b"],["#286c91","#10345d","#ff8fc7"]];
const scenes=Array.from({length:50},(_,i)=>{const p=palette[i%palette.length],h=(i*29+13)%360;return{name:STAGE_NAMES.vi[i].toUpperCase(),top:p[0],bottom:p[1],accent:p[2],bg:`stage_bg_${String(i+1).padStart(2,"0")}.jpg`,hue:(i*23)%360,variant:i};});
async function audioStart(){
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    if(!audioCtx){
      audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=1.0;masterGain.connect(audioCtx.destination);
      musicGain=audioCtx.createGain();musicGain.gain.value=musicOn?musicVolume:0;musicGain.connect(masterGain);
      sfxGain=audioCtx.createGain();sfxGain.gain.value=sfxOn?sfxVolume:0;sfxGain.connect(masterGain);
      // Bundled original audio files: seamless ocean ambience and organic bite/gulp SFX.
      ambientAudio=new Audio("assets/ocean_ambience.mp3");ambientAudio.loop=true;ambientAudio.preload="auto";ambientAudio.volume=musicOn?musicVolume:0;
      chompAudio=new Audio("assets/chomp.mp3");chompAudio.preload="auto";
      gulpAudio=new Audio("assets/gulp.mp3");gulpAudio.preload="auto";
      musicNodes=[];

    }
    if(audioCtx.state!=='running')await audioCtx.resume();
    if(ambientAudio&&musicOn){ambientAudio.volume=musicVolume;await ambientAudio.play().catch(()=>{});}
    applyAudioSettings();
    return audioCtx.state==='running';
  }catch(e){return false}
}
function applyAudioSettings(){
 if(audioCtx){const t=audioCtx.currentTime;if(musicGain)musicGain.gain.setTargetAtTime(0,t,.05);if(sfxGain)sfxGain.gain.setTargetAtTime(sfxOn?sfxVolume:0,t,.05)}
 if(ambientAudio){ambientAudio.volume=musicOn?musicVolume:0;if(musicOn&&running&&!paused)ambientAudio.play().catch(()=>{});else if(!musicOn)ambientAudio.pause();}
}
function syncAudioControls(){const m=$("musicToggle"),s=$("sfxToggle"),mv=$("musicVolume"),sv=$("sfxVolume");if(m)m.checked=musicOn;if(s)s.checked=sfxOn;if(mv)mv.value=Math.round(musicVolume*100);if(sv)sv.value=Math.round(sfxVolume*100)}
function syncControlSettings(){const el=$("controlModeSelect");if(el)el.value=controlMode;}
function updateJoystickVisibility(){const el=$("joystick");if(!el)return;const touch=(navigator.maxTouchPoints||0)>0||matchMedia("(pointer:coarse)").matches;el.classList.toggle("visible",running&&!paused&&!over&&controlMode==="joystick"&&touch);}

function tone(freq,when,duration,volume,type='sine',endFreq=null){
  if(!audioCtx||!sfxGain||!sfxOn)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(30,freq),when);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),when+duration);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),when+.012);g.gain.exponentialRampToValueAtTime(.0001,when+duration);o.connect(g);g.connect(sfxGain);o.start(when);o.stop(when+duration+.02);
}
function noiseBurst(when,duration,volume,cutoff=1500){
  if(!audioCtx||!sfxGain||!sfxOn)return;const n=Math.max(64,Math.floor(audioCtx.sampleRate*duration)),b=audioCtx.createBuffer(1,n,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=cutoff;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+.006);g.gain.exponentialRampToValueAtTime(.0001,when+duration);src.connect(f);f.connect(g);g.connect(sfxGain);src.start(when);src.stop(when+duration+.015);
}
function playCue(kind,amount=1){
  if(!sfxOn||!audioCtx||audioCtx.state!=='running')return;const t=audioCtx.currentTime+.004,k=Math.max(.65,Math.min(1.45,amount));
  if(kind==='bite'){noiseBurst(t,.045,.23*k,2600);tone(155/k,t+.006,.13,.23*k,'sine',58/k);noiseBurst(t+.11,.07,.15*k,1250);tone(410,t+.18,.07,.065,'triangle',250);}
  else if(kind==='gulp'){tone(290,t,.12,.11,'sine',180);tone(190,t+.10,.16,.12,'sine',105);noiseBurst(t+.08,.09,.07,700);}
  else if(kind==='grow'){tone(330,t,.18,.08,'triangle',490);tone(495,t+.12,.24,.075,'sine',720);tone(660,t+.28,.3,.06,'sine',880);}
  else if(kind==='hurt'){noiseBurst(t,.19,.19,500);tone(115,t,.32,.18,'sawtooth',48);}
  else if(kind==='warning'){tone(520,t,.13,.07,'sine',390);tone(520,t+.22,.13,.07,'sine',390);tone(520,t+.44,.18,.08,'sine',330);}
  else if(kind==='stage'){tone(392,t,.16,.07,'triangle');tone(523,t+.16,.18,.08,'triangle');tone(659,t+.34,.32,.09,'sine');}
  else if(kind==='over'){tone(330,t,.25,.09,'triangle',240);tone(247,t+.23,.32,.09,'triangle',165);tone(165,t+.52,.55,.10,'sine',82);}
  else if(kind==='menu'){tone(480,t,.07,.035,'sine',620);}
}
async function playChomp(f){try{
 if(!sfxOn)return;await audioStart();const size=Math.max(.82,Math.min(1.35,(f?.r||35)/45));
 const bite=chompAudio?chompAudio.cloneNode():null,gulp=gulpAudio?gulpAudio.cloneNode():null;
 if(bite){bite.volume=Math.min(1,sfxVolume*(.78+size*.10));bite.playbackRate=Math.max(.82,Math.min(1.18,1.08-size*.08));bite.play().catch(()=>{});}
 if(gulp){gulp.volume=Math.min(1,sfxVolume*(.68+size*.10));gulp.playbackRate=Math.max(.86,Math.min(1.12,1.04-size*.05));setTimeout(()=>gulp.play().catch(()=>{}),210);}
 }catch(e){}}
function resizeGame(){
 const root=document.getElementById("game"),rect=root.getBoundingClientRect();
 const rw=Math.max(1,rect.width||window.innerWidth),rh=Math.max(1,rect.height||window.innerHeight);
 const nextPortrait=rh>rw,nw=nextPortrait?720:1280,nh=Math.max(1,Math.round(nw*rh/rw));
 const sizeChanged=nw!==W||nh!==H||nextPortrait!==portrait;
 W=nw;H=nh;portrait=nextPortrait;
 if(sizeChanged){canvas.width=W;canvas.height=H;}
 const menu=$("webMenuBtn");
 // Keep the Settings/MENU pill out of the center of the landscape playfield.
 // Portrait keeps its own slot beside the HUD; landscape moves it to the far
 // right, just below the HUD row, where it cannot cover the score/lives cards.
 const sx=rw/W,sy=rh/H;
 const menuW=portrait?192:174,menuH=portrait?58:50;
 const menuX=portrait?510:Math.max(12,W-menuW-18),menuY=portrait?86:96;
 menu.style.position="absolute";
 menu.style.left=`${menuX*sx}px`;
 menu.style.top=`${menuY*sy}px`;
 menu.style.right="auto";
 menu.style.width=`${menuW*sx}px`;
 menu.style.height=`${menuH*sy}px`;
 menu.style.minWidth="0";
 menu.style.maxWidth=`${Math.max(0,rw-menuX*sx-8)}px`;
 menu.style.padding="0";
 menu.style.boxSizing="border-box";
 menu.style.overflow="hidden";
 menu.style.fontSize=`${Math.max(11,14*Math.min(sx,sy))}px`;
 menu.style.lineHeight="1";
 menu.style.whiteSpace="nowrap";
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
 ["pufferfish.svg",32,54,false,3,false,2],
 ["butterflyfish.svg",36,60,false,5,false,2],
 ["angelfish.svg",44,52,false,7,false,3],
 ["shark.png",88,38,true,8,false,5],
 ["orca.png",112,34,true,10,false,6]
];
function playerGrowthTier(){const r=player.r;return r>=115?5:r>=92?4:r>=72?3:r>=55?2:r>=40?1:0}
function spawn(pred=false){
 const progress=gameMode==="adventure"?Math.max(level,1+selectedStage*1.25):Math.max(level,1+(survivalWave-1)*1.4);
 let pool;
 if(pred){
  const stageIndex=gameMode==="adventure"?selectedStage:Math.max(0,survivalWave-1);
  pool=specs.filter(s=>s[3]&&s[4]<=progress);
  // Sharks are reserved for later, genuinely difficult stages; orcas arrive later still.
  pool=pool.filter(s=>s[0]!=="shark.png"||stageIndex>=8);
  pool=pool.filter(s=>s[0]!=="orca.png"||stageIndex>=12);
  if(!pool.length)pool=[specs[4]];
}
 else {pool=specs.filter(s=>!s[3]&&s[4]<=progress);if(progress>=3)pool.push(specs[4]);if(progress>=4)pool.push(specs[5]);if(progress>=5)pool.push(specs[6]);if(progress>=6)pool.push(specs[7]);if(progress>=8)pool.push(specs[8])}
 const s=pool[Math.floor(Math.random()*pool.length)],distX=pred?W*(.28+Math.random()*.24):W*.45+Math.random()*W*.35;
 let x=clamp(player.x+(Math.random()<.5?-distX:distX),80,WORLD_W-80),y=clamp(player.y+(Math.random()-.5)*H*(pred?1.0:1.7),100,WORLD_H-100),dir=Math.random()<.5?1:-1;
 const stageIndex=gameMode==="adventure"?selectedStage:Math.max(0,survivalWave-1);
 const difficulty=pred?1+Math.min(1.25,stageIndex*.026)+Math.min(.24,Math.max(0,level-1)*.012):1+Math.min(.24,stageIndex*.005);
 const swimSpeed=s[2]*difficulty;
 fish.push({name:s[0],r:s[1],speed:swimSpeed,baseSpeed:s[2],pred:s[3],unlock:s[4],sourceLeft:s[5],preyTier:s[6],x,y,dir,vx:dir*swimSpeed,vy:0,phase:Math.random()*7,school:Math.floor(Math.random()*5),turn:2+Math.random()*4,frame:0,clock:0,seed:Math.random()*10,attackState:"idle",attackTimer:0,attackCooldown:0,mouthOpen:0,preyTarget:null});
}
function spawnAmbientCreature(type){
 const dir=Math.random()<.5?1:-1;
 const x=dir>0?camera.x-W*.18:camera.x+W*1.18;
 const y=clamp(camera.y+H*(.20+Math.random()*.60),180,WORLD_H-180);
 const scale=type==="whale"?1.02+Math.random()*.16:type==="orca"?.92+Math.random()*.12:.92+Math.random()*.12;
 const speed=type==="turtle"?82+Math.random()*18:type==="whale"?96+Math.random()*20:112+Math.random()*24;
 ambientCreatures.push({type,x,y,dir,speed,phase:Math.random()*Math.PI*2,tailPhase:Math.random()*Math.PI*2,flipperPhase:Math.random()*Math.PI*2,turn:5+Math.random()*8,scale,age:0});
}
function updateAmbientCreatures(dt){
 ambientSpawnT-=dt;
 // Ambient animals live in world coordinates. Camera movement must not be
 // added to their positions; doing so makes them appear glued to the player.
 for(const a of ambientCreatures){
  a.age+=dt;
  a.phase+=dt;
  a.tailPhase+=dt*(2*Math.PI/(a.type==="whale"?3.6:2.9));
  a.flipperPhase+=dt*(2*Math.PI/(a.type==="turtle"?4.0:3.2));
  a.x+=a.dir*a.speed*dt;
  a.y+=Math.sin(a.phase*.72)*dt*(a.type==="whale"||a.type==="orca"?7:9);
  a.y=clamp(a.y,150,WORLD_H-150);
 }
 // One rare visitor at a time; keep a complete pass visible before the next.
 if(ambientSpawnT<=0&&ambientCreatures.length===0){
  const roll=Math.random();
  spawnAmbientCreature(roll<.42?"turtle":roll<.78?"whale":"orca");
  ambientSpawnT=18+Math.random()*10;
 }
 ambientCreatures=ambientCreatures.filter(a=>a.age<48&&a.x>camera.x-W*.30&&a.x<camera.x+W*1.30);
 if(ambientCreatures.length===0&&ambientSpawnT<0)ambientSpawnT=18+Math.random()*10;
}
function drawAmbientCreatures(){
 for(const a of ambientCreatures){
  const cycle=a.type==="whale"?a.tailPhase:a.type==="turtle"?a.flipperPhase:a.phase*(2*Math.PI/2.9);
  const frame=Math.floor((cycle/(2*Math.PI)*8)%8),im=img[`${a.type}_swim_${frame}.png`]||img[a.type+".png"];
  if(!im?.complete||!im.naturalWidth)continue;
  const whale=a.type==="whale",orca=a.type==="orca",base=whale?Math.min(W,H)*.56:orca?Math.min(W,H)*.44:Math.min(W,H)*.27,w=base*a.scale,h=w*im.height/im.width;
  const bob= Math.sin(a.phase*(whale||orca?1.05:1.35))*(whale||orca?7:5);
  ctx.save();
  ctx.translate(a.x,a.y+bob);
  ctx.scale(a.dir<0?-1:1,1);
  // Small synchronized body pitch makes the tail/flipper cycle read as swimming.
  ctx.rotate(Math.sin(a.phase*(whale||orca?1.45:1.8))*(whale||orca?.035:.045));
  ctx.scale(1+Math.sin(a.phase*2.2)*.012,1+Math.sin(a.phase*2.2+.7)*.018);
  ctx.globalAlpha=.98;
  ctx.drawImage(im,-w/2,-h/2,w,h);
  ctx.restore();
 }
}

function reset(){updateJoystickVisibility();updateBoostButton();boostActive=false;boostTime=0;boostCooldown=0;boostNotice=0;audioStart().then(()=>playCue("stage"));score=0;stageWon=false;survivalWave=1;waveScoreStart=0;waveGoal=3200;stageGoal=gameMode==="adventure"?stages[selectedStage].goal:0;scene=gameMode==="adventure"?stages[selectedStage].scene:0;growth=.08;level=1;lives=3;combo=1;comboT=0;comboFlash=0;comboFlashT=0;player={x:420,y:WORLD_H*.5,vx:0,vy:0,r:28,face:1};target=null;camera.x=0;camera.y=clamp(player.y-H*.5,0,WORLD_H-H);fish=[];particles=[];ambientCreatures=[];ambientSpawnT=8+Math.random()*5;spawnT=0;const stageIndex=gameMode==="adventure"?selectedStage:Math.max(0,survivalWave-1);
const openingHunters=stageIndex>=40?6:stageIndex>=30?5:stageIndex>=20?4:stageIndex>=12?3:stageIndex>=6?2:1;
const hunterLatoval=Math.max(4.5,11-stageIndex*.38);
 predatorSpawnT=hunterLatoval*.55+Math.random()*2;for(let i=0;i<25;i++)spawn(false);for(let i=0;i<openingHunters;i++)spawn(true);running=true;paused=false;over=false;activePointer=null;$("webMenuBtn").style.display="block";updateJoystickVisibility();$("menu").classList.add("hidden");$("pause").classList.add("hidden");$("over").classList.add("hidden")}
function popup(x,y,t,c="#fff1a6"){particles.push({x,y,t,c,life:1,max:1})}
function requiredPlayerRadius(f){return f.r*(f.pred?1.3:1.15)}
function canEatFish(f){
 if(!f||!Number.isFinite(f.r)||!Number.isFinite(f.preyTier))return false;
 // Only species explicitly assigned to the current feeding tier can be eaten.
 return playerGrowthTier()>=f.preyTier && player.r>=requiredPlayerRadius(f);
}
function currentPreyLabel(){
 const tier=playerGrowthTier(),names=specs.filter(s=>s[6]<=tier&&player.r>=s[1]*(s[3]?1.3:1.15)).map(s=>({"minnow.png":({vi:"Cá mồi",en:"Minnow",zh:"小鱼",ko:"작은 물고기",fr:"Petit poisson",de:"Kleinfisch"}[language]),"yellow-tang.png":({vi:"Cá vàng",en:"Yellow tang",zh:"黄高鳍刺尾鱼",ko:"옐로 탱",fr:"Chirurgien jaune",de:"Gelber Segelflossendoktor"}[language]),"blue-tang.png":({vi:"Cá xanh",en:"Blue tang",zh:"蓝吊",ko:"블루탱",fr:"Chirurgien bleu",de:"Paletten-Doktorfisch"}[language]),"clownfish.png":({vi:"Cá hề",en:"Clownfish",zh:"小丑鱼",ko:"흰동가리",fr:"Poisson-clown",de:"Clownfisch"}[language]),"grouper.png":({vi:"Cá mú",en:"Grouper",zh:"石斑鱼",ko:"바리",fr:"Mérou",de:"Zackenbarsch"}[language]),"lionfish.png":({vi:"Cá sư tử",en:"Lionfish",zh:"狮子鱼",ko:"쏠배감펭",fr:"Poisson-lion",de:"Rotfeuerfisch"}[language]),"manta.png":({vi:"Cá đuối",en:"Manta ray",zh:"蝠鲼",ko:"쥐가오리",fr:"Raie manta",de:"Mantarochen"}[language]),"seahorse.png":({vi:"Cá ngựa",en:"Seahorse",zh:"海马",ko:"해마",fr:"Hippocampe",de:"Seepferdchen"}[language]),"shark.png":({vi:"Cá mập",en:"Shark",zh:"鲨鱼",ko:"상어",fr:"Requin",de:"Hai"}[language]),"pufferfish.svg":({vi:"Cá nóc",en:"Pufferfish",zh:"河豚",ko:"복어",fr:"Poisson-globe",de:"Kugelfisch"}[language]),"butterflyfish.svg":({vi:"Cá bướm",en:"Butterflyfish",zh:"蝴蝶鱼",ko:"나비고기",fr:"Poisson-papillon",de:"Falterfisch"}[language]),"angelfish.svg":({vi:"Cá thiên thần",en:"Angelfish",zh:"神仙鱼",ko:"엔젤피시",fr:"Poisson-ange",de:"Kaiserfisch"}[language]),"orca.png":({vi:"Cá voi sát thủ",en:"Orca",zh:"虎鲸",ko:"범고래",fr:"Orque",de:"Schwertwal"}[language])}[s[0]]));
 return names.length?names.slice(-3).join(" · "):tr("notReady");
}
function currentPreySpecies(){
 const tier=playerGrowthTier();
 return specs.filter(s=>s[6]<=tier&&player.r>=s[1]*(s[3]?1.3:1.15)).slice(-4);
}
function drawPreyIcons(x,y,maxWidth,iconH=25){
 const list=currentPreySpecies();
 if(!list.length){ctx.fillStyle="#f1fcff";ctx.font="600 13px Lato";ctx.fillText(tr("notReady"),x,y+iconH*.72);return;}
 const gap=7,iconW=Math.min(43,(maxWidth-gap*(list.length-1))/list.length);
 list.forEach((sp,i)=>{
  const im=img[sp[0]];
  if(im?.complete&&im.naturalWidth){
   const ratio=im.width/im.height,w=Math.min(iconW,iconH*ratio),h=w/ratio;
   const cx=x+i*(iconW+gap)+iconW/2,cy=y+iconH/2;
   ctx.save();ctx.translate(cx,cy);if(sp[5])ctx.scale(-1,1);
   ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
  }
 });
}

function eat(i){const f=fish[i];if(!f||!canEatFish(f))return false;playChomp(f);
 // Combo is a rapid multi-bite chain, not a reward for eating one fish every few seconds.
 // The first fish is x1; only another fish eaten within 500 ms raises the chain to x2.
 const inRapidWindow=comboT>0;
 combo=inRapidWindow?Math.min(6,combo+1):1;
 const pts=Math.floor(25+f.r*1.8)*combo;
 score+=pts;best=Math.max(best,score);localStorage.yumyBest=best;
 comboT=.5;
 if(combo>=2){comboFlash=combo;comboFlashT=.95;}
 growth=Math.min(1,growth+.025+f.r/2600);player.r=Math.min(142,player.r+.42+f.r*.006);popup(f.x,f.y-38,"YUMMY","#ff1028");popup(f.x,f.y-8,"+"+pts,"#fff0a6");for(let n=0;n<7;n++)particles.push({x:f.x+(Math.random()-.5)*28,y:f.y+(Math.random()-.5)*24,t:"✦",c:"#ffe47a",life:.48,max:.48});biteT=.42;fish.splice(i,1);while(score>=level*650&&level<99){level++;playCue("grow");popup(player.x,player.y-70,"LEVEL "+level,"#aaff91")}if(gameMode==="adventure"&&score>=stageGoal)finishStage(true);else if(gameMode==="survival"&&score-waveScoreStart>=waveGoal)finishSurvivalWave();return true}
function showHome(){running=false;paused=false;over=false;activePointer=null;pointer=null;target=null;joystickVector={x:0,y:0};updateJoystickVisibility();$("webMenuBtn").style.display="none";$("pause").classList.add("hidden");showPauseHome();$("over").classList.add("hidden");$("menu").classList.remove("hidden");$("homeView").classList.remove("hidden");$("mapView").classList.add("hidden");if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
function showAdventureMap(){gameMode="adventure";$("homeView").classList.add("hidden");$("mapView").classList.remove("hidden");$("menu").classList.remove("hidden");renderStages()}
function finishSurvivalWave(){if(over)return;playCue("stage");over=true;running=false;updateJoystickVisibility();particles=[];stageWon=true;$("overTitle").textContent=tr("waveComplete").replace("{n}",survivalWave);$ ("result").textContent=`${sceneName(scene)} · ${score-waveScoreStart}/${waveGoal} ${tr("points")} · ${tr("level")} ${level}`;$ ("again").textContent=tr("continueNext");$("over").classList.remove("hidden")}
function nextSurvivalWave(){survivalWave++;waveScoreStart=score;waveGoal=Math.round(3200+survivalWave*1200);scene=(scene+1)%scenes.length;fish=[];for(let i=0;i<22+Math.min(12,survivalWave);i++)spawn(false);for(let i=0;i<Math.min(2+Math.floor(survivalWave/2),5);i++)spawn(true);over=false;running=true;stageWon=false;updateJoystickVisibility();$("over").classList.add("hidden");popup(player.x,player.y-70,sceneName(scene),"#aaff91")}
function finishStage(won){if(over)return;playCue(won?"stage":"over");over=true;running=false;updateJoystickVisibility();particles=[];stageWon=won;if(won){stageUnlocked=Math.max(stageUnlocked,Math.min(stages.length,selectedStage+2));localStorage.yumyAdventureUnlocked=stageUnlocked;if(!stageCompleted.includes(selectedStage)){stageCompleted.push(selectedStage);localStorage.yumyAdventureCompleted=JSON.stringify(stageCompleted)}$("overTitle").textContent=tr("stageComplete");$("result").textContent=`${stageName(selectedStage)} · ${score}/${stageGoal} ${tr("points")} · ${tr("stage")} ${Math.min(stages.length,selectedStage+2)} ${tr("ready").toLowerCase()}`;$("again").textContent=selectedStage<stages.length-1?tr("nextStage"):tr("playAgain")}else{$("overTitle").textContent=tr("gameOver");$("result").textContent=`${gameMode==="adventure"?`${tr("stage")} ${selectedStage+1} · ${tr("goal")} ${stageGoal} ${tr("points")}`:tr("survival")} · Điểm: ${score}`;$("again").textContent=tr("tryAgain")}$("over").classList.remove("hidden")}
function hurt(predator){
 if(hitT>0||over)return;
 playCue("hurt");hitT=1.25;lives=Math.max(0,lives-1);combo=1;comboT=0;
 const oldR=player.r;player.r=Math.max(24,player.r*.88);growth=Math.max(0,growth-.10);
 const away=predator?Math.sign(player.x-predator.x)||-predator.dir:-player.face;
 player.vx+=away*250;player.vy+=(player.y-(predator?.y||player.y))*1.2;
 popup(player.x,player.y-34,tr("lostLife"),"#ff7777");
 if(predator){predator.attackState="recover";predator.attackTimer=.7;predator.attackCooldown=1.9;predator.mouthOpen=0;}
 if(lives<=0){particles=[];if(gameMode==="adventure")finishStage(false);else{playCue("over");over=true;running=false;updateJoystickVisibility();particles=[];$ ("overTitle").textContent=tr("gameOver");$ ("result").textContent=`${tr("eatenBy")} · ${tr("score")}: ${score} · ${tr("record")}: ${best}`;$ ("again").textContent=tr("playAgain");$ ("over").classList.remove("hidden")}}
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

// Predators also hunt smaller AI fish, not only the player. Each prey is
// approached from the head, followed by a short visible lunge and bite.
function findPredatorPrey(predator){
 let best=null,bestD=430;
 for(const candidate of fish){
  if(candidate===predator||candidate.eaten||candidate.r>=predator.r*.78)continue;
  if(candidate.pred&&candidate.r>=predator.r*.62)continue;
  if(fish.some(other=>other!==predator&&other.preyTarget===candidate&&other.attackState.startsWith("prey")))continue;
  const d=Math.hypot(candidate.x-predator.x,candidate.y-predator.y);
  if(d<bestD){best=candidate;bestD=d;}
 }
 return best;
}

function activateBoost(){
 if(!running||paused||over||boostActive||boostCooldown>0)return false;
 audioStart();boostActive=true;boostTime=5;boostCooldown=185;boostNotice=5;playCue("grow");updateBoostButton();return true;
}
function updateBoostButton(){
 const b=$("boostBtn"),label=$("boostBtnLabel");if(!b||!label)return;
 const touch=(navigator.maxTouchPoints||0)>0||matchMedia("(pointer:coarse)").matches;
 b.classList.toggle("visible",touch&&running&&!paused&&!over);
 b.classList.toggle("active",boostActive);b.classList.toggle("cooldown",!boostActive&&boostCooldown>0);
 b.disabled=boostActive||boostCooldown>0;
 label.textContent=boostActive?`${Math.ceil(boostTime)}s`:boostCooldown>0?`${Math.ceil(boostCooldown/60)}:${String(Math.ceil(boostCooldown%60)).padStart(2,"0")}`:"SẴN SÀNG";
 b.setAttribute("aria-label",boostActive?`Đang tăng tốc ${Math.ceil(boostTime)} giây`:boostCooldown>0?`Tăng tốc hồi sau ${Math.ceil(boostCooldown)} giây`:"Kích hoạt tăng tốc");
}
function update(dt){if(!running||paused)return;boostTime=Math.max(0,boostTime-dt);boostCooldown=Math.max(0,boostCooldown-dt);boostNotice=Math.max(0,boostNotice-dt);if(boostTime<=0)boostActive=false;updateBoostButton();predatorSpawnT=Math.max(0,predatorSpawnT-dt);predatorWarnCd=Math.max(0,predatorWarnCd-dt);biteT=Math.max(0,biteT-dt);hitT=Math.max(0,hitT-dt);comboT=Math.max(0,comboT-dt);comboFlashT=Math.max(0,comboFlashT-dt);if(!comboT)combo=1;
// Swipe mode steers toward the finger destination; joystick mode steers continuously by direction.
if(controlMode==="joystick"&&Math.hypot(joystickVector.x,joystickVector.y)>.08){const maxSpeed=390*(boostActive?1.5:1),mag=Math.min(1,Math.hypot(joystickVector.x,joystickVector.y)),ax=joystickVector.x/mag*maxSpeed*mag,ay=joystickVector.y/mag*maxSpeed*mag;player.vx+=(ax-player.vx)*Math.min(1,dt*6.5);player.vy+=(ay-player.vy)*Math.min(1,dt*6.5)}else if(controlMode==="swipe"&&target){const dx=target.x-player.x,dy=target.y-player.y,dist=Math.hypot(dx,dy),maxSpeed=390*(boostActive?1.5:1);if(dist>7){const desired=Math.min(maxSpeed,dist*2.65),ax=dx/dist*desired,ay=dy/dist*desired;player.vx+=(ax-player.vx)*Math.min(1,dt*5.8);player.vy+=(ay-player.vy)*Math.min(1,dt*5.8)}else{player.vx*=Math.max(0,1-dt*5);player.vy*=Math.max(0,1-dt*5)}}else{player.vx*=Math.max(0,1-dt*2.7);player.vy*=Math.max(0,1-dt*2.7)}
if(Math.abs(player.vx)>5)player.face=Math.sign(player.vx);
// Keep the complete player sprite inside the ocean bounds, not merely its
// collision circle (the old radius-only clamp allowed fins/tail to be cut off).
const playerImg=img["player_0.png"],playerDrawW=Math.min(player.r*2.1,portrait?240:330),playerHalfW=playerDrawW*.5;
const playerHalfH=playerImg?.naturalWidth?playerDrawW*playerImg.height/playerImg.width*.5:player.r*1.05;
player.x=clamp(player.x+player.vx*dt,playerHalfW+10,WORLD_W-playerHalfW-10);
player.y=clamp(player.y+player.vy*dt,playerHalfH+14,WORLD_H-playerHalfH-14);
// Camera eases after the fish, keeping it near the center while revealing a much larger ocean.
const desiredCamX=clamp(player.x-W*.5,0,WORLD_W-W),desiredCamY=clamp(player.y-H*.5,0,WORLD_H-H);camera.x+=(desiredCamX-camera.x)*Math.min(1,dt*3.8);camera.y+=(desiredCamY-camera.y)*Math.min(1,dt*3.8);
updateAmbientCreatures(dt);
for(let i=fish.length-1;i>=0;i--){
 const f=fish[i];if(f.eaten)continue;const dx=player.x-f.x,dy=player.y-f.y,d=Math.hypot(dx,dy)||1;
 f.phase+=dt;f.turn-=dt;f.attackCooldown=Math.max(0,f.attackCooldown-dt);if(f.attackState==="turn")f.mouthOpen+=(.78-f.mouthOpen)*Math.min(1,dt*6.5);else if(f.attackState==="lunge")f.mouthOpen+=(1-f.mouthOpen)*Math.min(1,dt*10);else f.mouthOpen+=(0-f.mouthOpen)*Math.min(1,dt*8);
 if(f.attackState==="turn"){
   // A predator that was touched at the tail visibly turns first, then bites.
   f.dir=Math.sign(dx)||f.dir;f.mouthOpen+=(.82-f.mouthOpen)*Math.min(1,dt*7);f.attackTimer-=dt;
   f.vx+=(f.dir*f.speed*.42-f.vx)*Math.min(1,dt*8);
   f.vy+=(dy/d*f.speed*.30-f.vy)*Math.min(1,dt*5);
   if(f.attackTimer<=0){f.attackState="lunge";f.attackTimer=.82;f.mouthOpen=1}
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
   if(f.attackTimer<=0){f.attackState="idle";f.preyTarget=null;}
 }else if(f.attackState==="preyTurn"||f.attackState==="preyLunge"){
   const prey=f.preyTarget;
   if(!prey||prey.eaten||!fish.includes(prey)){
     f.attackState="recover";f.attackTimer=.28;f.preyTarget=null;f.mouthOpen=0;
   }else{
     const pdx=prey.x-f.x,pdy=prey.y-f.y,pd=Math.hypot(pdx,pdy)||1;f.dir=Math.sign(pdx)||f.dir;
     if(f.attackState==="preyTurn"){
       f.attackTimer-=dt;f.mouthOpen+=(0-f.mouthOpen)*Math.min(1,dt*10);
       const speed=f.speed*1.25;f.vx+=(pdx/pd*speed-f.vx)*Math.min(1,dt*5);f.vy+=(pdy/pd*speed-f.vy)*Math.min(1,dt*5);
       if(f.attackTimer<=0){f.attackState="preyLunge";f.attackTimer=.72;f.mouthOpen=1;}
     }else{
       f.attackTimer-=dt;f.mouthOpen+=(1-f.mouthOpen)*Math.min(1,dt*14);
       const speed=f.speed*3.0;f.vx+=(pdx/pd*speed-f.vx)*Math.min(1,dt*8);f.vy+=(pdy/pd*speed-f.vy)*Math.min(1,dt*8);
       const mouth=fishMouth(f),biteDist=Math.hypot(prey.x-mouth.x,prey.y-mouth.y);
       if(biteDist<f.r*.42+prey.r*.42){
         prey.eaten=true;popup(prey.x,prey.y-18,"CHOMP!","#ffdf70");
         for(let n=0;n<5;n++)particles.push({x:prey.x+(Math.random()-.5)*22,y:prey.y+(Math.random()-.5)*18,t:"✦",c:"#ffe47a",life:.42,max:.42});
         f.attackState="recover";f.attackTimer=.58;f.attackCooldown=1.15;f.preyTarget=null;f.mouthOpen=0;
       }else if(f.attackTimer<=0){f.attackState="recover";f.attackTimer=.42;f.attackCooldown=.8;f.preyTarget=null;f.mouthOpen=0;}
     }
   }
 }else{
   if(f.pred&&f.attackCooldown<=0){const prey=findPredatorPrey(f);if(prey){f.preyTarget=prey;f.attackState="preyTurn";f.attackTimer=.2;f.dir=Math.sign(prey.x-f.x)||f.dir;}}
   if(f.turn<=0){f.turn=2.4+Math.random()*4.5;if(Math.random()<.75)f.dir*=-1}
   let desiredVx=f.dir*f.speed*(f.name==="seahorse.png"?.52:1),desiredVy=Math.sin(f.phase*(f.name==="seahorse.png"?.82:1.25)+f.school)*f.speed*(f.name==="seahorse.png"?.52:.28);
   if(f.pred&&f.r>player.r*1.12&&d<520){desiredVx+=dx/d*f.speed*.9;desiredVy+=dy/d*f.speed*.72}
   else if(!f.pred&&f.r<player.r*.92&&d<260){desiredVx-=dx/d*f.speed*1.45;desiredVy-=dy/d*f.speed*1.15}
   f.vx+=(desiredVx-f.vx)*Math.min(1,dt*2.2);f.vy+=(desiredVy-f.vy)*Math.min(1,dt*2.0);
 }
 if(Math.abs(f.vx)>7)f.dir=Math.sign(f.vx);
 f.x+=f.vx*dt;f.y+=f.vy*dt;const margin=f.r*1.5+12;
 if(f.x<margin){f.x=margin;f.vx=Math.abs(f.vx);f.dir=1}else if(f.x>WORLD_W-margin){f.x=WORLD_W-margin;f.vx=-Math.abs(f.vx);f.dir=-1}
 const fim=img[f.name],spriteW=f.r*(f.name==="lionfish.png"||f.name==="manta.png"||f.name==="shark.png"?2.0:f.name==="orca.png"?2.15:f.name==="grouper.png"?2.05:f.name==="minnow.png"?2.55:2.15),spriteHalfH=fim?.naturalWidth?spriteW*fim.height/fim.width*.5:f.r*.8;
 f.x=clamp(f.x,spriteW*.5+8,WORLD_W-spriteW*.5-8);f.y=clamp(f.y,spriteHalfH+10,WORLD_H-spriteHalfH-10);f.clock+=dt;if(f.clock>.18){f.clock=0;f.frame=(f.frame+1)%2}
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
 if(!f.eaten&&(!f.pred||canEatFish(f))){
   const pm=playerMouth(),mouthDist=Math.hypot(pm.x-f.x,pm.y-f.y);
   if(mouthDist<player.r*.24+f.r*.58&&canEatFish(f)){eat(i);continue;}
 }
 }
fish=fish.filter(f=>!f.eaten);
// Mild separation between nearby fish prevents unreadable sprite piles without rigid bouncing.
for(let a=0;a<fish.length;a++)for(let b=a+1;b<fish.length;b++){const fa=fish[a],fb=fish[b],sx=fb.x-fa.x,sy=fb.y-fa.y,sd=Math.hypot(sx,sy)||.001,gap=(fa.r+fb.r)*.92;if(sd<gap){const push=(gap-sd)*.055,ux=sx/sd,uy=sy/sd;fa.x-=ux*push;fa.y-=uy*push;fb.x+=ux*push;fb.y+=uy*push}}
spawnT+=dt;const maxFish=gameMode==="survival"?28:25,interval=gameMode==="survival"?3.0:2.7;if(spawnT>interval&&fish.length<maxFish){spawn(false);spawnT=0}
// Keep large hunters present throughout the stage; never let the opening pair
// be the only predators the player sees. Cap the active population for balance.
const stageIndex=gameMode==="adventure"?selectedStage:Math.max(0,survivalWave-1);
const predatorCap=stageIndex>=40?8:stageIndex>=30?7:stageIndex>=20?6:stageIndex>=12?5:stageIndex>=6?4:2;
const predatorCount=fish.reduce((n,f)=>n+(f.pred&&f.x>camera.x-W*.22&&f.x<camera.x+W*1.22&&f.y>camera.y-H*.22&&f.y<camera.y+H*1.22?1:0),0);
if(predatorSpawnT<=0&&predatorCount<predatorCap&&fish.length<maxFish){spawn(true);const interval=Math.max(3.2,11-stageIndex*.12);predatorSpawnT=interval+Math.random()*3;}
for(const b of bubbles){b.y-=b.s*dt;if(b.y<0)b.y=WORLD_H;b.x+=Math.sin((b.y+b.r)*.002)*dt*4}for(const p of particles){p.y-=42*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);
// Recycle fish that have wandered far outside the camera's active neighborhood.
fish=fish.filter(f=>Math.abs(f.x-(camera.x+W*.5))<W*1.65&&Math.abs(f.y-(camera.y+H*.5))<H*1.65);
}
function drawFish(f){
 const biting=f.pred&&(f.attackState==="lunge"||f.attackState==="preyLunge");
 const closedName=f.name.replace(".png","_closed.png");
 let im;
 if(f.pred&&!biting)im=img[closedName]||img[f.name];
 else if(f.name==="manta.png")im=img[`manta_${Math.floor((f.phase*6.5)%6)}.png`]||img[f.name];
 else if(f.name==="shark.png")im=img[`shark_${Math.floor((f.phase*10)%8)}.png`]||img[f.name];
 else if(f.name==="orca.png")im=img[`orca_swim_${Math.floor((f.phase*5.2)%8)}.png`]||img[f.name];
 else im=img[f.name];
 if(!(im&&im.complete&&im.naturalWidth))return;
 const scale=f.name==="lionfish.png"||f.name==="manta.png"||f.name==="shark.png"?2.0:f.name==="orca.png"?2.15:f.name==="grouper.png"?2.05:f.name==="minnow.png"?2.55:2.15;
 const w=f.r*scale,h=w*im.height/im.width,sourceLeft=f.sourceLeft,flip=sourceLeft?f.dir>0:f.dir<0;
 const bob=f.name==="manta.png"?5.2:f.name==="shark.png"||f.name==="orca.png"?4.4:f.name==="pufferfish.svg"?2.6:3.1;
 const swim=Math.sin(f.phase*8.2+f.school);
 const bodyRoll=Math.sin(f.phase*5.1+f.school)*(
   f.name==="lionfish.png"?.012:f.name==="grouper.png"?.022:f.name==="pufferfish.svg"?.018:.032
 );
 ctx.save();
 ctx.translate(f.x,f.y+Math.sin(f.phase*2+f.school)*bob);
 // Every ordinary fish now has a visible tail beat and a subtle body/f fin rhythm.
 // Shark and manta keep their dedicated multi-frame animations.
 ctx.rotate(bodyRoll);
 if(biting){const snap=1+Math.sin(Math.min(1,f.attackTimer/(f.attackState==="preyLunge"?.72:.82))*Math.PI)*.045;ctx.scale(snap,1/snap);}
 ctx.scale(flip?-1:1,1);
 if(f.name!=="manta.png"&&f.name!=="shark.png"&&f.name!=="orca.png"){
   const pivot=.245* w;
   const tailAngle=swim*(f.name==="lionfish.png"?.105:f.name==="grouper.png"?.145:.19)*(biting?.58:1);
   // Draw the body without its rear tail section.
   ctx.drawImage(im,.205*im.width,0,.795*im.width,im.height,
     -.5*w+.205*w,-.5*h,.795*w,h);
   // Draw the tail separately around its root to create a proper side-to-side swimming beat.
   ctx.save();
   ctx.translate(-.5*w+pivot,0);
   ctx.rotate(tailAngle);
   ctx.drawImage(im,0,0,.305*im.width,im.height,
     -pivot,-.5*h,.305*w,h);
   ctx.restore();
 }else{
   // Manta wing strokes and shark tail/body animation are supplied by their frame sequences.
   if(f.name==="manta.png"&&!biting)ctx.scale(1,1+Math.sin(f.phase*6.5)*.055);
   if((f.name==="shark.png"||f.name==="orca.png")&&!biting)ctx.rotate(Math.sin(f.phase*4.8)*.018);
   ctx.drawImage(im,-w/2,-h/2,w,h);
 }
 ctx.restore();
}

function drawStageEnvironment(index){
 const seed=index+17,rand=(n)=>{const x=Math.sin(seed*127.1+n*311.7)*43758.5453;return x-Math.floor(x)};
 const accent=scenes[index]?.accent||"#70d8df";
 ctx.save();ctx.globalAlpha=.22;ctx.strokeStyle=accent;ctx.fillStyle=accent;ctx.lineWidth=7;
 // Distinct coral/kelp silhouettes for every stage, anchored to the world floor and side ledges.
 for(let side=0;side<9;side++){
  const x=side*(WORLD_W/8)+(rand(side+1)-.5)*180,y=WORLD_H-30-rand(side+12)*120,h=180+rand(side+28)*440;
  ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-30,y-h*.28,x+35,y-h*.58,x+(rand(side+40)-.5)*120,y-h);ctx.stroke();
  for(let b=0;b<3;b++){const by=y-h*(.35+b*.18),bx=x+(rand(side*5+b+70)-.5)*75;ctx.beginPath();ctx.moveTo(x,by);ctx.quadraticCurveTo(bx-45,by-35,bx,by-82);ctx.quadraticCurveTo(bx+42,by-40,x,by);ctx.fill();}
 }
 // Removed oversized floating ellipse strokes that looked like stray curved lines.
 ctx.restore();
}
function drawHeart(x,y,size,filled){ctx.save();ctx.translate(x,y);const k=size/18;ctx.scale(k,k);ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-18,-4,-10,-16,0,-8);ctx.bezierCurveTo(10,-16,18,-4,0,7);ctx.closePath();if(filled){ctx.fillStyle="#ff526d";ctx.fill();ctx.strokeStyle="#ffd7df";ctx.lineWidth=1.2;ctx.stroke()}else{ctx.strokeStyle="#9ab5c5";ctx.lineWidth=1.8;ctx.stroke()}ctx.restore()}
function draw(){ctx.clearRect(0,0,W,H);
// World-space pass: camera follows the player through the wide ocean.
ctx.save();ctx.translate(-camera.x,-camera.y);const bg=sceneBackground(scene);if(bg?.complete&&bg.naturalWidth){const bs=Math.max(WORLD_W/bg.width,WORLD_H/bg.height),bw=bg.width*bs,bh=bg.height*bs;ctx.drawImage(bg,(WORLD_W-bw)/2,(WORLD_H-bh)/2,bw,bh)}else{const gr=ctx.createLinearGradient(0,0,0,WORLD_H);gr.addColorStop(0,scenes[scene].top);gr.addColorStop(1,scenes[scene].bottom);ctx.fillStyle=gr;ctx.fillRect(0,0,WORLD_W,WORLD_H)}ctx.fillStyle=scenes[scene].bottom+"18";ctx.fillRect(camera.x,camera.y,W,H);drawStageEnvironment(scene);for(const b of bubbles){if(b.x<camera.x-30||b.x>camera.x+W+30||b.y<camera.y-30||b.y>camera.y+H+30)continue;ctx.strokeStyle=`rgba(210,250,255,${b.a})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke()}drawAmbientCreatures();fish.forEach(drawFish);const biteFrames=[4,5,6,7,6,5,4],frame=biteT>0?biteFrames[Math.min(6,Math.floor((.42-biteT)/.06))]:Math.floor(Date.now()/145)%4,pimg=img["player_"+frame+".png"];if(pimg?.complete&&pimg.naturalWidth){const w=Math.min(player.r*2.1,portrait?240:330),h=w*pimg.height/pimg.width;ctx.save();ctx.translate(player.x,player.y);ctx.scale(player.face<0?-1:1,1);ctx.drawImage(pimg,-w/2,-h/2,w,h);ctx.restore()}else{ctx.fillStyle="#ffcf47";ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill()}ctx.save();particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.c;ctx.font="bold 22px Lato";ctx.textAlign="center";ctx.fillText(p.t,p.x,p.y)});ctx.restore();ctx.restore();
// HUD is drawn in screen coordinates and never inherits the camera transform.
const hudH=portrait?212:92;
// Portrait HUD redesign: clear cards and deliberate spacing; no inline SCORE/value collision.
if(portrait){
 const rr=(x,y,w,h,r,fill,stroke)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}};
 const bg=ctx.createLinearGradient(0,0,0,hudH);bg.addColorStop(0,"rgba(4,43,66,.97)");bg.addColorStop(1,"rgba(5,58,79,.91)");ctx.fillStyle=bg;ctx.fillRect(0,0,W,hudH);
 ctx.fillStyle="rgba(103,226,239,.55)";ctx.fillRect(0,hudH-2,W,2);
 ctx.fillStyle="#ffe35a";ctx.font="900 27px Lato";ctx.fillText("YUMY",22,49);
 ctx.fillStyle="#bcebf1";ctx.font="11px Lato";ctx.fillText("OCEAN ADVENTURE",24,66);
 // Score card
 rr(18,79,150,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32)");
 ctx.fillStyle="#bfeaf0";ctx.font="800 13px Lato";ctx.fillText(tr("score"),31,101);
 ctx.fillStyle="#fff5c9";ctx.font="900 30px Lato";ctx.fillText(String(score),31,135,122);
 // Combo is shown briefly as a large in-world callout, never as a permanent HUD chip.
 // Growth card
 rr(178,79,200,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32");
 ctx.fillStyle="#d9f8fb";ctx.font="800 13px Lato";ctx.fillText(tr("growth")+" · LV "+level,192,102);
 rr(192,116,172,14,7,"rgba(1,34,54,.8)",null);rr(195,119,166*Math.max(0,Math.min(1,growth)),8,4,"#b7e74d",null);
 // Lives card
 rr(388,79,106,68,14,"rgba(7,91,116,.72)","rgba(117,224,235,.32)");
 ctx.fillStyle="#d9f8fb";ctx.font="800 13px Lato";ctx.fillText(tr("lives"),400,102);
 for(let i=0;i<3;i++)drawHeart(404+i*27,124,18,i<lives);
 // Bottom info rail
 rr(18,162,684,42,12,"rgba(2,35,57,.62)","rgba(117,224,235,.25)");
 ctx.fillStyle="#9debf0";ctx.font="800 12px Lato";ctx.fillText(tr("prey"),30,188);
 drawPreyIcons(145,174,250,24);
 ctx.fillStyle=boostActive?"#ffe36a":"#b9eaf1";ctx.font="900 12px Lato";ctx.textAlign="right";ctx.fillText(boostActive?`BOOST ${Math.ceil(boostTime)}s`:boostCooldown>0?`BOOST ${Math.ceil(boostCooldown)}s`:"BOOST READY",W-145,188);
 ctx.fillStyle=scenes[scene].accent;ctx.font="700 10px Lato";ctx.fillText(sceneName(scene),W-28,188,108);ctx.textAlign="left";
 ctx.font="13px Lato";ctx.textAlign="right";ctx.fillStyle="rgba(232,250,255,.48)";ctx.fillText("YUMY OCEAN",W-18,H-18);ctx.textAlign="left";
}else{ctx.fillStyle="#052d45e8";ctx.fillRect(0,0,W,hudH);ctx.fillStyle="#ffe35a";ctx.font="bold 30px Lato";ctx.fillText("YUMY",24,39);ctx.fillText(tr("growth"),175,32);ctx.fillStyle="#16485b";ctx.fillRect(175,45,210,15);ctx.fillStyle="#b7e74d";ctx.fillRect(178,48,204*growth,9);ctx.fillText(tr("score"),460,31);ctx.font="bold 27px Lato";ctx.fillText(String(score),460,65);ctx.fillStyle="#fff";ctx.font="bold 15px Lato";ctx.fillText(tr("prey"),720,32);drawPreyIcons(720,43,235,28);for(let i=0;i<3;i++)drawHeart(1000+i*25,30,18,i<lives);ctx.fillStyle="#e4faff";ctx.font="700 13px Lato";ctx.textAlign="right";ctx.fillText(gameMode==="adventure"?`${tr("stage")} ${selectedStage+1} · ${score}/${stageGoal}`:`${tr("survivalShort")} · ${tr("wave")} ${survivalWave} · ${tr("level")} ${level}`,W-18,84,540);ctx.textAlign="left";ctx.fillStyle=boostActive?"#ffe36a":"#b9eaf1";ctx.font="800 12px Lato";ctx.textAlign="center";ctx.fillText(boostActive?`BOOST ${Math.ceil(boostTime)}s`:boostCooldown>0?`BOOST ${Math.ceil(boostCooldown)}s`:"BOOST READY",1025,61);ctx.textAlign="left";ctx.fillStyle=scenes[scene].accent;ctx.font="700 12px Lato";ctx.textAlign="left";ctx.font="15px Lato";ctx.fillText(gameMode==="adventure"?`${tr("adventureShort")} · ${stageName(selectedStage)} · ${score}/${stageGoal}`:`${tr("survivalShort")} · ${tr("wave")} ${survivalWave} · ${tr("goal")} ${waveGoal-(score-waveScoreStart)}`,24,H-18)}
if(comboFlashT>0&&comboFlash>=2){const a=Math.min(1,comboFlashT/.22);ctx.save();ctx.globalAlpha=a;ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`1000 ${Math.round(Math.min(58,W*.105))}px Lato`;ctx.lineWidth=7;ctx.strokeStyle="rgba(76,12,18,.78)";ctx.shadowColor="#ff3d35";ctx.shadowBlur=24;const label=`COMBO x${comboFlash}`;ctx.strokeText(label,W*.5,Math.max(hudH+75,H*.42));ctx.fillStyle="#fff36a";ctx.fillText(label,W*.5,Math.max(hudH+75,H*.42));ctx.restore();}
if(hitT>0){ctx.fillStyle=`rgba(255,20,20,${hitT*.18})`;ctx.fillRect(0,hudH,W,H-hudH)}}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop)}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
function screenToWorld(p){return{x:clamp(p.x+camera.x,0,WORLD_W),y:clamp(p.y+camera.y,0,WORLD_H)}}
canvas.addEventListener("pointerdown",e=>{
 if(e.pointerType==="mouse"){
  if(e.button===0&&running&&!paused&&!over){
   audioStart();
   activateBoost();
  }
  return; // Mouse movement alone steers; holding left mouse activates the timed boost.
 }
 if(!running||paused||over||controlMode==="joystick")return;
 audioStart();e.preventDefault();
 try{canvas.setPointerCapture(e.pointerId)}catch{}
 activePointer=e.pointerId;pointer=point(e);target=screenToWorld(pointer);
});
canvas.addEventListener("pointermove",e=>{
 if(!running||paused||over)return;
 if(controlMode==="joystick"&&e.pointerType!=="mouse")return;
 if(e.pointerType==="mouse"||activePointer===e.pointerId){
  e.preventDefault();pointer=point(e);target=screenToWorld(pointer);
 }
});
function endPointer(e){
 if(activePointer===e.pointerId){activePointer=null;pointer=null;target=null;}
}
canvas.addEventListener("pointerup",endPointer);canvas.addEventListener("pointercancel",endPointer);canvas.addEventListener("lostpointercapture",endPointer);
const joystick=$("joystick"),joystickThumb=$("joystickThumb");
function setJoystickFromEvent(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=Math.min(r.width,r.height)*.34,len=Math.hypot(dx,dy)||1,scale=Math.min(1,max/len);joystickVector={x:dx*scale/max,y:dy*scale/max};joystickThumb.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
function clearJoystick(e){if(joystickPointer!==null&&(!e||e.pointerId===joystickPointer)){joystickPointer=null;joystickVector={x:0,y:0};joystickThumb.style.transform="translate(0,0)";}}
joystick.addEventListener("pointerdown",e=>{if(!running||paused||over||controlMode!=="joystick")return;e.preventDefault();e.stopPropagation();audioStart();joystickPointer=e.pointerId;try{joystick.setPointerCapture(e.pointerId)}catch{}setJoystickFromEvent(e)});
joystick.addEventListener("pointermove",e=>{if(e.pointerId===joystickPointer){e.preventDefault();setJoystickFromEvent(e)}});
joystick.addEventListener("pointerup",clearJoystick);joystick.addEventListener("pointercancel",clearJoystick);joystick.addEventListener("lostpointercapture",clearJoystick);
$("boostBtn").addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();if(e.pointerType!=="mouse")activateBoost();});
$("boostBtn").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();activateBoost();});
function showPauseHome(){$("pauseAudioView").classList.add("hidden");$("pauseHomeView").classList.remove("hidden");}
function showPauseAudio(){syncAudioControls();syncControlSettings();$("pauseHomeView").classList.add("hidden");$("pauseAudioView").classList.remove("hidden");}
function backOneScreen(){
  if(!$("pauseAudioView").classList.contains("hidden")){showPauseHome();return true;}
  if(!$("pause").classList.contains("hidden")&&paused){paused=false;$("pause").classList.add("hidden");showPauseHome();return true;}
  if(!$("mapView").classList.contains("hidden")) {showHome();return true;}
  return false;
}
function renderStages(){const grid=$("stageGrid");grid.innerHTML="";$("mapProgress").textContent=`${stageUnlocked} / ${stages.length} ${tr("stageUnlocked")} · ${stageCompleted.length} ${tr("finished").toLowerCase()}`;stages.forEach((st,i)=>{const unlocked=i+1<=stageUnlocked,done=stageCompleted.includes(i),b=document.createElement("button");b.type="button";b.className="stage-card map-node scene-"+st.scene+(unlocked?"":" locked")+(i===selectedStage?" active":"")+(done?" completed":"");b.disabled=!unlocked;b.setAttribute("aria-label",`${tr("stage")} ${i+1}: ${stageName(i)}, ${unlocked?tr("ready"):tr("notUnlocked")}`);b.innerHTML=`<span class="node-top"><span class="node-number">${String(i+1).padStart(2,"0")}</span><span class="node-state">${done?"✓":unlocked?"●":"🔒"}</span></span><span class="node-icon">${stageSymbol(i)}</span><b>${stageName(i)}</b><small>${st.goal.toLocaleString()} ${tr("points")}</small><em>${done?tr("finished"):unlocked?tr("ready"):tr("notUnlocked")}</em>`;b.onclick=()=>{selectedStage=i;renderStages()};grid.appendChild(b)});const st=stages[selectedStage];$("stageDetails").innerHTML=`<b>${stageSymbol(selectedStage)} ${stageName(selectedStage)}</b><span>${st.goal.toLocaleString()} ${tr("points")} · ${stageDesc(selectedStage)}</span>`;$("mapStart").disabled=selectedStage+1>stageUnlocked}
$("webMenuBtn").onclick=()=>{if(!running||over)return;playCue("menu");paused=true;activePointer=null;target=null;joystickVector={x:0,y:0};updateJoystickVisibility();updateBoostButton();particles=[];showPauseHome();$("pause").classList.remove("hidden")};$("survivalMode").onclick=()=>{audioStart().then(()=>playCue("menu"));gameMode="survival";selectedStage=0;audioStart();resizeGame();if(document.documentElement.requestFullscreen&&/Android|iPhone|iPad/i.test(navigator.userAgent))document.documentElement.requestFullscreen().catch(()=>{});reset()};
$("adventureMode").onclick=()=>{audioStart().then(()=>playCue("menu"));selectedStage=Math.max(0,Math.min(selectedStage,stageUnlocked-1));showAdventureMap()};$("mapBack").onclick=showHome;$("mapStart").onclick=()=>{if(selectedStage+1>stageUnlocked)return;gameMode="adventure";audioStart();resizeGame();if(document.documentElement.requestFullscreen&&/Android|iPhone|iPad/i.test(navigator.userAgent))document.documentElement.requestFullscreen().catch(()=>{});reset()};$("backToMenu").onclick=showHome;$("pauseToMenu").onclick=showHome;
$("again").onclick=()=>{if(gameMode==="survival"&&stageWon){nextSurvivalWave();return}if(gameMode==="adventure"&&stageWon&&selectedStage<stages.length-1){selectedStage++;stageUnlocked=Math.max(stageUnlocked,selectedStage+1);localStorage.yumyAdventureUnlocked=stageUnlocked;reset();return}reset()};
$("openAudioSettings").onclick=showPauseAudio;$("controlModeSelect").onchange=e=>{controlMode=e.target.value==="swipe"?"swipe":"joystick";localStorage.yumyControlMode=controlMode;target=null;joystickVector={x:0,y:0};syncControlSettings();updateJoystickVisibility()};$("audioBack").onclick=showPauseHome;$("musicToggle").onchange=async e=>{musicOn=e.target.checked;localStorage.yumyMusicOn=musicOn?"1":"0";if(musicOn)await audioStart();applyAudioSettings()};$("sfxToggle").onchange=async e=>{sfxOn=e.target.checked;localStorage.yumySfxOn=sfxOn?"1":"0";if(sfxOn)await audioStart();applyAudioSettings()};$("musicVolume").oninput=e=>{musicVolume=+e.target.value/100;localStorage.yumyMusicVolume=e.target.value;applyAudioSettings()};$("sfxVolume").oninput=e=>{sfxVolume=+e.target.value/100;localStorage.yumySfxVolume=e.target.value;applyAudioSettings()};syncAudioControls();syncControlSettings();const changeLanguage=e=>{language=e.target.value;localStorage.yumyLanguage=language;applyLanguage();};$("languageSelect").onchange=changeLanguage;$("languageSelectHome").onchange=changeLanguage;applyLanguage();$("resume").onclick=()=>{paused=false;$("pause").classList.add("hidden");showPauseHome();updateJoystickVisibility();updateBoostButton()};
// Android-style edge swipe: swipe from the left edge to the right to go back one screen.
let edgeStart=null;
document.addEventListener("pointerdown",e=>{if(e.clientX<=28&&e.pointerType!=="mouse"){edgeStart={x:e.clientX,y:e.clientY,id:e.pointerId};}},{capture:true,passive:true});
document.addEventListener("pointerup",e=>{if(!edgeStart||edgeStart.id!==e.pointerId)return;const dx=e.clientX-edgeStart.x,dy=Math.abs(e.clientY-edgeStart.y);if(dx>=72&&dy<Math.max(90,dx*.7)){if(backOneScreen())e.preventDefault();}edgeStart=null;},{capture:true});
document.addEventListener("pointercancel",()=>{edgeStart=null;},{capture:true});
window.addEventListener("keydown",e=>{if(e.code==="Escape"||e.code==="Backspace"){if(backOneScreen()){e.preventDefault();return;}if(running&&!over&&!paused){paused=true;joystickVector={x:0,y:0};updateJoystickVisibility();showPauseHome();$("pause").classList.remove("hidden");e.preventDefault();}}});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});requestAnimationFrame(loop);
})();
