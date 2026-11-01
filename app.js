'use strict';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const storageKey = 'bible-playroom-v1';
const curriculumProgressKey='episode-1:simple-r1';
const episodeOne = Object.freeze({id:'episode-1', number:1, title:'Choosing the Right Path', passage:'Psalm 1:1–2', videoId:'cLXBJJ4xHZ4', ages:['3-5','6-8','9-12']});
const ageGroups = {
  '3-5': {name:'Little Wonders', label:'Ages 3 to 5', minutes:20, home:8, support:'Explore with a grownup', choice:'Point, listen and choose a kind action together.', match:'Find three pairs of pictures with your grownup.', draw:'Draw or colour one way to show kindness today.'},
  '6-8': {name:'Curious Explorers', label:'Ages 6 to 8', minutes:30, home:12, support:'Play & learn with purpose', choice:'Little situations. Big chances to choose well.', match:'Turn, remember and find what belongs together.', draw:'Draw a kind choice you can make this week.'},
  '9-12': {name:'Deep Thinkers', label:'Ages 9 to 12', minutes:40, home:15, support:'Questions worth exploring', choice:'Weigh the advice. Explain the choice. Live it out.', match:'Connect six ideas with what they mean.', draw:'Illustrate a decision and the thinking behind it.'}
};
let persisted = {};
try { persisted = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { persisted = {}; }
const safeProgress={};for(const age of Object.keys(ageGroups)){safeProgress[age]=Array.isArray(persisted.completedByCurriculum?.[curriculumProgressKey]?.[age])?persisted.completedByCurriculum[curriculumProgressKey][age].filter(v=>['discover','choices','match','draw'].includes(v)):[];}
const state = {age:ageGroups[persisted.age] ? persisted.age : '6-8', saved:Array.isArray(persisted.saved)?persisted.saved.filter(v=>['choices','match','draw'].includes(v)):[], completed:safeProgress, filter:'all', savedOnly:false, setting:'church', sound:persisted.sound!==false, reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches};
state.gameMarks=Object.fromEntries(Object.keys(ageGroups).map(age=>[age,Array.isArray(persisted.gameMarksByCurriculum?.[curriculumProgressKey]?.[age])?[...persisted.gameMarksByCurriculum[curriculumProgressKey][age]]:[]]));
const dialog = $('#main-dialog');
let currentAction = '', returnFocus = null, toastTimeout, quiz = null, memory = null, draw = null;
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({age:state.age,saved:state.saved,completed:persisted.completed||{},completedByCurriculum:{...persisted.completedByCurriculum,[curriculumProgressKey]:state.completed},sound:state.sound,gameMarksByCurriculum:{...persisted.gameMarksByCurriculum,[curriculumProgressKey]:state.gameMarks}}));}catch{toast('Your browser could not save this change. You can still keep exploring.');}}
function toast(message){clearTimeout(toastTimeout);const el=$('#toast');el.textContent=message;el.classList.add('show');toastTimeout=setTimeout(()=>el.classList.remove('show'),3300);}
function safeText(value){const el=document.createElement('span');el.textContent=value;return el.innerHTML;}
function completed(id){return Boolean(state.completed[state.age]?.includes(id));}
function complete(id){const set=new Set(state.completed[state.age]||[]);set.add(id);state.completed[state.age]=[...set];persist();}
function ageLabel(){return ageGroups[state.age].label;}
function packURL(){return `assets/colouring/episode-1-simple-r1/ages-${state.age}-a4.pdf`;}
function updateAge(){
  $('#header-age').textContent=`Currently ${ageLabel().toLowerCase()}`;$('.age-button').setAttribute('aria-label',`Choose your age range, currently ${ageLabel().toLowerCase()}`);
  $$('.current-age-text').forEach(el=>el.textContent=ageLabel());
  $$('.age-card').forEach(el=>{const selected=el.dataset.age===state.age;el.setAttribute('aria-pressed',String(selected));$('.selected-age-label',el).textContent=selected?'Your room ✓':'Choose this room';});
  $('#age-status').textContent=`You’re exploring ${ageGroups[state.age].name}, ${ageLabel().toLowerCase()}. Lessons, games and printables will follow your choice.`;
  $('#lesson-duration').textContent='Learn at your pace';
  $('#choice-description').textContent=simpleCurriculum.groups[state.age].idea;
  $('.activity-card [data-action="choices"]').setAttribute('aria-label','Play '+simpleCurriculum.groups[state.age].gameTitle);
  $('.activity-card [data-action="choices"]').closest('article').querySelector('h3').textContent=simpleCurriculum.groups[state.age].gameTitle;
  $('[data-save="choices"]').setAttribute('aria-label',`${state.saved.includes('choices')?'Unsave':'Save'} ${simpleCurriculum.groups[state.age].gameTitle}`);
  $('#match-description').textContent=ageGroups[state.age].match;
  $('#draw-description').textContent=ageGroups[state.age].draw;
  $('#pack-download').href=packURL();
  updateSaved();
}
function chooseAge(age,close=true){if(!ageGroups[age])return;state.age=age;persist();updateAge();$('.site-header nav').classList.remove('mobile-open');$('.mobile-menu').setAttribute('aria-expanded','false');$('.mobile-menu').setAttribute('aria-label','Open navigation');if(close&&dialog.open)dialog.close();toast(`${ageGroups[age].name} is ready to explore.`);}
function updateSaved(){
  $$('[data-save]').forEach(el=>{const saved=state.saved.includes(el.dataset.save);el.setAttribute('aria-pressed',String(saved));el.textContent=saved?'♥':'♡';el.setAttribute('aria-label',`${saved?'Unsave':'Save'} ${$('h3',el.closest('article')).textContent}`);});
  let count=0;
  $$('.activity-card').forEach(el=>{const id=$('[data-save]',el).dataset.save;const show=(state.filter==='all'||el.dataset.category===state.filter)&&(!state.savedOnly||state.saved.includes(id));el.hidden=!show;if(show)count++;});
  $('#empty-activities').hidden=count>0;
  $('#empty-activities').textContent=state.savedOnly?'No saved activities in this view yet. Tap a heart on an activity to keep it here.':'No activities in this view.';
  $('#saved-toggle').setAttribute('aria-pressed',String(state.savedOnly));
  $('#saved-toggle').textContent=state.savedOnly?'← Show all activities':'♡ Show my saved activities';
}
function showDialog(action,content){
  stopEpisode();
  if(dialog.open)stopGameAudio();
  if(!dialog.open)returnFocus=document.activeElement;
  currentAction=action;
  $('#dialog-content').innerHTML=content;
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;
  const title=$('#dialog-title');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
}
function shell(title,kicker,body,intro=''){return `<div class="dialog-body"><p class="eyebrow green-text">${kicker}</p><h2 id="dialog-title">${title}</h2>${intro?`<p class="intro">${intro}</p>`:''}${body}</div>`;}
function showAges(){showDialog('ages',shell('Choose your age range.','THREE ROOMS. ONE BIG FAMILY.',`<div class="modal-age-grid">${Object.entries(ageGroups).map(([id,g])=>`<button class="modal-age" data-age="${id}" aria-pressed="${state.age===id}"><span class="pill">${g.label}</span><b>${g.name}</b><span>${g.support}</span></button>`).join('')}</div>`,'Tap an age range below. Your lessons, games and printable materials will all match your choice. You can change it at any time.'))}
function progressHTML(){return `<div class="lesson-progress" aria-label="Completed activities for this age group">${[['discover','Bible discovery'],['choices','Kind choices'],['match','Discovery match'],['draw','Create']].map(([id,label])=>`<span class="progress-chip ${completed(id)?'done':''}">${completed(id)?'✓':'○'} ${label}</span>`).join('')}</div>`;}

function showLesson(tab='discover'){simpleReset('mean');renderSimpleLesson('mean',tab==='teacher'||tab==='guide');}
function startQuiz(){simpleReset('play');renderSimpleLesson('play');}

function shuffle(a){const copy=[...a];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
const pairSets={
 '3-5':[['📖','Bible','📖','Bible'],['🤝','Helping','🤝','Helping'],['♥','Kindness','♥','Kindness']],
 '6-8':[['📖','God’s teaching','📖','Read & learn'],['🤝','A kind action','🤝','Help someone'],['💭','Think carefully','💭','Pause & consider'],['🙋','Ask for help','🙋','A trusted grownup']],
 '9-12':[['🧭','Wise advice','🧭','Guidance worth weighing'],['📖','Delight','📖','Joy in God’s teaching'],['💭','Reflect','💭','Think carefully'],['🤝','Kindness','🤝','Care shown in action'],['🌱','A habit','🌱','A small repeated practice'],['🔎','Discern','🔎','Consider a message’s effects']]
};
function startMatch(){const pairs=pairSets[state.age];const cards=shuffle(pairs.flatMap((p,pair)=>[{pair,icon:p[0],text:p[1]},{pair,icon:p[2],text:p[3]}]));memory={cards,open:[],matched:new Set(),moves:0,locked:false};
showDialog('match',shell('A little noticing goes a long way.','PLAY · BIBLE DISCOVERY MATCH',`<div class="game-toolbar"><span class="pill">${ageLabel()} · ${pairs.length} pairs</span>${soundControl()}</div><p class="intro" style="margin-top:18px">${state.age==='3-5'?'Turn over two cards. Find the pictures that match. A grownup can name the pictures with you.':state.age==='9-12'?'Match each idea with its meaning. Remember where you saw it, and talk about how the ideas connect to Psalm 1:1–2.':'Find the idea and the action that belong together. The picture helps you make the connection.'}</p><div class="match-grid" id="memory-grid">${cards.map((_,i)=>`<button class="memory-card face-down" data-memory="${i}" aria-label="Card ${i+1}. Turn over."></button>`).join('')}</div><p id="memory-status" class="game-status" aria-live="polite">Choose your first card.</p><div id="memory-finish" hidden><button class="button dark" data-action="draw">Make something next ↗</button></div><button class="text-button" data-action="match">Start a fresh game ↻</button><p class="game-caption">Take your time. There’s no timer and no limit on tries.</p>`));}
function renderMemoryCard(index,reveal){const card=memory.cards[index],el=$(`[data-memory="${index}"]`);if(!el)return;el.classList.toggle('face-down',!reveal);el.classList.toggle('is-open',reveal);el.innerHTML=reveal?`${card.icon}<span>${card.text}</span>`:'';el.setAttribute('aria-label',reveal?`${card.text}. Card ${index+1}.`:`Card ${index+1}. Turn over.`);el.setAttribute('aria-pressed',String(reveal));}
function turnCard(index){if(!memory||memory.locked||memory.matched.has(index)||memory.open.includes(index))return;renderMemoryCard(index,true);memory.open.push(index);if(memory.open.length===1){$('#memory-status').textContent='Now choose a second card.';return;}memory.moves++;const [a,b]=memory.open;if(memory.cards[a].pair===memory.cards[b].pair){memory.matched.add(a);memory.matched.add(b);[a,b].forEach(i=>{$(`[data-memory="${i}"]`).classList.add('is-matched');$(`[data-memory="${i}"]`).disabled=true;});memory.open=[];confetti($(`[data-memory="${index}"]`));playGameSound('correct');const found=memory.matched.size/2,total=memory.cards.length/2;$('#memory-status').textContent=`A pair! ${found} of ${total} pairs discovered.`;if(found===total){complete('match');$('#memory-status').textContent='You found every connection. Tell someone about one of them!';$('#memory-finish').hidden=false;confetti();}}else{memory.locked=true;playGameSound('encourage');$('#memory-status').textContent='That’s okay, my friend. Notice these two, then have another try.';const currentMemory=memory;setTimeout(()=>{if(memory!==currentMemory||currentAction!=='match')return;[a,b].forEach(i=>renderMemoryCard(i,false));memory.open=[];memory.locked=false;$('#memory-status').textContent='Choose two more cards. You’re learning where they are.';},1400);}}

function startDraw(){showDialog('draw',shell('Make room for your imagination.','CREATE · MY LITTLE MASTERPIECE',`<span class="pill">${ageLabel()}</span><p class="canvas-prompt">${ageGroups[state.age].draw} ${state.age==='9-12'?'You could make a comic or decision map. Explain your thinking to a grownup.':'Your marks and ideas are welcome here.'}</p><div class="draw-toolbar" role="group" aria-label="Drawing tools">${[['#402623','Brown'],['#ed713a','Orange'],['#ffbf3f','Yellow'],['#40835e','Green'],['#e48ba4','Pink'],['#8b6595','Purple']].map(([color,name],i)=>`<button class="swatch" style="background:${color}" data-colour="${color}" aria-label="${name} pencil" aria-pressed="${i===0}"></button>`).join('')}<button class="draw-tool" data-draw-tool="eraser" aria-pressed="false">Eraser</button><button class="draw-tool" data-draw-tool="undo">Undo</button><label>Size <input id="brush-size" type="range" min="3" max="36" value="8" aria-label="Pencil size"></label></div><div class="canvas-wrap"><canvas id="drawing-canvas" width="1000" height="625" tabindex="0" aria-label="Drawing area. Use a mouse, pen or finger to draw. Printable alternatives are available below.">Your browser does not support drawing here. Download the printable activity instead.</canvas></div><div class="draw-actions"><button class="button dark" data-draw-tool="download">Save my picture ↓</button><button class="button outline" data-draw-tool="template">Colour a Bible</button><button class="button outline" data-draw-tool="clear">Fresh page</button><a class="text-button" href="${packURL()}" download>Print an activity ↓</a></div><p class="game-caption">Pictures are saved to your device, not uploaded. A grownup can help with downloads. A fresh page clears this drawing.</p>`));
const canvas=$('#drawing-canvas'),ctx=canvas.getContext('2d');draw={canvas,ctx,color:'#402623',size:8,eraser:false,active:false,undo:[]};ctx.fillStyle='white';ctx.fillRect(0,0,1000,625);ctx.lineCap='round';ctx.lineJoin='round';
const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};
canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();pushUndo();draw.active=true;canvas.setPointerCapture(e.pointerId);const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineWidth=draw.eraser?draw.size*3:draw.size;ctx.strokeStyle=draw.eraser?'#ffffff':draw.color;ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke();});
canvas.addEventListener('pointermove',e=>{if(!draw.active)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();});
const end=()=>{if(draw)draw.active=false;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);$('#brush-size').addEventListener('input',e=>draw.size=Number(e.target.value));}
function pushUndo(){if(!draw)return;draw.undo.push(draw.ctx.getImageData(0,0,1000,625));if(draw.undo.length>15)draw.undo.shift();}
function templateDrawing(){pushUndo();const c=draw.ctx;c.fillStyle='white';c.fillRect(0,0,1000,625);c.strokeStyle='#402623';c.lineWidth=5;c.beginPath();c.moveTo(210,175);c.quadraticCurveTo(350,125,500,185);c.quadraticCurveTo(650,125,790,175);c.lineTo(790,465);c.quadraticCurveTo(645,420,500,475);c.quadraticCurveTo(355,420,210,465);c.closePath();c.stroke();c.beginPath();c.moveTo(500,185);c.lineTo(500,475);c.stroke();c.lineWidth=4;for(let y=225;y<390;y+=42){c.beginPath();c.moveTo(255,y);c.quadraticCurveTo(350,y-22,450,y+3);c.moveTo(550,y+3);c.quadraticCurveTo(650,y-22,745,y);c.stroke();}c.beginPath();c.arc(805,95,29,0,Math.PI*2);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(805+43*Math.cos(a),95+43*Math.sin(a));c.lineTo(805+60*Math.cos(a),95+60*Math.sin(a));c.stroke();}c.font='26px Nunito, sans-serif';c.textAlign='center';c.fillStyle='#402623';c.fillText('God’s teaching helps us grow.',500,555);toast('Add your colours to this Bible.');}
function drawAction(tool){if(!draw)return;if(tool==='eraser'){draw.eraser=!draw.eraser;$('[data-draw-tool="eraser"]').setAttribute('aria-pressed',String(draw.eraser));}else if(tool==='undo'){const prev=draw.undo.pop();if(prev)draw.ctx.putImageData(prev,0,0);else toast('Your page is already at the beginning.');}else if(tool==='clear'){pushUndo();draw.ctx.fillStyle='white';draw.ctx.fillRect(0,0,1000,625);toast('A fresh page for your next idea.');}else if(tool==='template'){templateDrawing();}else if(tool==='download'){draw.canvas.toBlob(blob=>{if(!blob){toast('This browser could not save the picture. Try printing your activity instead.');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`my-bible-playroom-picture-${state.age}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);complete('draw');toast('Your picture is ready to save on this device.');},'image/png');}}

const friends={Mirielle:{css:'mirielle',description:'You’ll recognise Mirielle in her pink dress. She is one of the five familiar friends learning alongside Teacher Abigail.'},Leroy:{css:'leroy',description:'You’ll recognise Leroy in his checked shirt. He joins the friends as they explore God’s Word together.'},Hadassah:{css:'hadassah',description:'You’ll recognise Hadassah in her white daisy dress. She is part of our familiar Bible Playroom family.'},EastWood:{css:'eastwood',description:'You’ll recognise EastWood in his cream checked shirt and brown trousers. He learns alongside Abigail and the friends.'},Spendylove:{css:'spendylove',description:'You’ll recognise Spendylove in her yellow dress. She joins the friends in their Bible discoveries.'}};
function showFriend(name){const f=friends[name];if(!f)return;showDialog('friend',shell(`Hello, ${name}!`,'MEET THE BIBLE PLAYROOM FRIENDS',`<div class="friend-modal"><span class="portrait portrait-${f.css}" role="img" aria-label="${name}, the approved cartoon character"></span><div><p>${f.description}</p><p style="margin-top:16px">Bring your own questions and ideas. There’s a place for you in the playroom too.</p><button class="button dark" style="margin-top:22px" data-action="lesson">Join the Bible discovery ↗</button></div></div>`));}
function showAbout(){showDialog('about',shell('Faith. Friendship. A little fun.','WELCOME TO THE BIBLE PLAYROOM',`<div class="lesson-panel"><h3>One passage. A whole week to explore.</h3><p>Teacher Abigail and five familiar friends help bring Bible learning into everyday life. We’re making a home for episodes, matching teaching guides, games and printable activities.</p><h4>Three age groups</h4><p>Little Wonders, ages 3 to 5; Curious Explorers, ages 6 to 8; and Deep Thinkers, ages 9 to 12. The same Bible topic is adapted to how children listen, read, reason and create.</p><h4>The Friday rhythm</h4><p>Each finished video direction will shape its matching learning materials. New episode packs are intended to arrive on Fridays. Episode 1, Choosing the Right Path, is live with the Psalm 1:1–2 lessons for all three groups. New episodes and materials appear after review and approval.</p><h4>On screen and around the table</h4><p>Play a short activity here, or take a printable into your family time or Sunday school class. The starter packs are available without payment.</p></div><button class="button dark" data-action="ages">Find your age group ↗</button>`));}
function showPrivacy(){showDialog('privacy',shell('A little space. Thoughtfully kept.','PRIVACY & PLAYROOM SETTINGS',`<p class="intro">These learning activities do not ask children for a name, email address, photo or account. We do not add our own advertising or analytics scripts. The YouTube player loads only when you choose to watch an episode.</p><div class="privacy-setting"><h3>What stays on this device</h3><p>Your selected age group, favourite activities and completed activities are stored in this browser. They do not sync to other devices. Drawings stay in the current activity until you save them to your device or close the page.</p><p>The hosting service may process technical requests to deliver this site. This site’s current access setting is managed by its owner.</p><button class="danger-button" id="clear-progress">Clear this browser’s playroom data</button></div><div class="privacy-setting"><h3>Watching an episode</h3><p>Choosing Watch connects to YouTube’s privacy enhanced embedded player. YouTube then handles video playback under its own terms and privacy settings. A grownup can also open the episode directly on YouTube.</p></div><div class="privacy-setting"><h3>Motion that feels comfortable</h3><p>Animations follow your device’s reduced motion setting. You can also pause decorative motion here.</p><button class="button outline" id="motion-toggle" aria-pressed="${state.reducedMotion}">${state.reducedMotion?'Turn decorative motion on':'Pause decorative motion'}</button></div>`));}
// Every correct answer gets a small celebration, including inside the native dialog's top layer.
function confetti(anchor){
 if(state.reducedMotion)return;
 const host=dialog.open?$('.dialog-shell'):document.body;
 host.querySelectorAll('.confetti-dot').forEach(el=>el.remove());
 const rect=anchor?.getBoundingClientRect();
 const x=rect?rect.left+rect.width/2:window.innerWidth/2;
 const y=rect?rect.top+rect.height/2:window.innerHeight*.45;
 const dialogRect=dialog.getBoundingClientRect();
 const left=dialog.open?x-dialogRect.left+dialog.scrollLeft:x;
 const top=dialog.open?y-dialogRect.top+dialog.scrollTop:y;
 const colors=['#ffda35','#ff9dcc','#b8ed79','#ff773b','#a78bfa'];
 for(let i=0;i<32;i++){
  const el=document.createElement('i');el.className='confetti-dot answer-confetti';el.setAttribute('aria-hidden','true');
  el.style.cssText=`position:${dialog.open?'absolute':'fixed'};left:${left}px;top:${top}px;background:${colors[i%colors.length]};--x:${(Math.random()-.5)*420}px;--y:${-160+Math.random()*340}px;--r:${Math.random()*720-360}deg;`;
  host.appendChild(el);setTimeout(()=>el.remove(),1200);
 }
}
let gameAudioContext=null;
const activeTones=new Set();
let encouragementAudio=null;
// Teacher Abigail's selected Ainsley voice, hosted with the learning materials.
const abigailEncouragementURL='assets/audio/abigail-encouragement.mp3';
function soundControl(){return `<button class="game-sound-control" data-game-sound aria-pressed="${state.sound}" aria-label="${state.sound?'Mute game sounds':'Turn game sounds on'}">${state.sound?'♪ Sound on':'♪ Sound off'}</button>`;}
function encouragementHTML(){return `<div class="feedback try teacher-encouragement"><span class="teacher-avatar"><img src="assets/classroom-720.webp" alt="Teacher Abigail" decoding="async"></span><div><b>A little encouragement from Teacher Abigail</b><p>That’s okay, my friend. Take your time. Let’s think about it together. Which action shows care and helps us learn?</p><span>Have another try. You’re still learning!</span></div></div>`;}
function stopGameAudio(){
 for(const oscillator of activeTones){try{oscillator.stop();}catch{}}activeTones.clear();
 if(encouragementAudio){encouragementAudio.pause();encouragementAudio.currentTime=0;}
 if(gameAudioContext&&gameAudioContext.state==='running')gameAudioContext.suspend().catch(()=>{});
}
function playGameSound(kind){
 if(!state.sound)return;
 for(const oscillator of activeTones){try{oscillator.stop();}catch{}}activeTones.clear();
 if(encouragementAudio){encouragementAudio.pause();encouragementAudio.currentTime=0;}
 if(kind==='encourage'&&abigailEncouragementURL){
  encouragementAudio=encouragementAudio||$('#abigail-voice');encouragementAudio.volume=.65;
  encouragementAudio.play().catch(()=>playToneSequence(kind));return;
 }
 playToneSequence(kind);
}
function playToneSequence(kind){
 try{
  const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;
  gameAudioContext=gameAudioContext||new AudioEngine();
  const context=gameAudioContext;
  const ring=()=>{
   if(!state.sound)return;
   const now=context.currentTime;
   const notes=kind==='correct'?[[523.25,0],[659.25,.1],[783.99,.2],[1046.5,.32]]:[[392,0],[523.25,.17]];
   for(const [frequency,offset] of notes){
    const oscillator=context.createOscillator(),gain=context.createGain();
    activeTones.add(oscillator);oscillator.onended=()=>activeTones.delete(oscillator);
    oscillator.type='sine';oscillator.frequency.value=frequency;oscillator.connect(gain);gain.connect(context.destination);
    const start=now+offset,duration=kind==='correct'?.24:.3;
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.075,start+.018);gain.gain.exponentialRampToValueAtTime(.001,start+duration);
    oscillator.start(start);oscillator.stop(start+duration+.02);
   }
  };
  if(context.state==='suspended')context.resume().then(ring).catch(()=>{});else ring();
 }catch{/* The visual feedback remains available when audio is unavailable. */}
}
function toggleGameSound(){
 state.sound=!state.sound;persist();if(!state.sound)stopGameAudio();
 $$('[data-game-sound]').forEach(el=>{el.setAttribute('aria-pressed',String(state.sound));el.setAttribute('aria-label',state.sound?'Mute game sounds':'Turn game sounds on');el.textContent=state.sound?'♪ Sound on':'♪ Sound off';});
 if(state.sound)playGameSound('correct');
}

function action(name){if(name==='episode'){openEpisode();return;}if(name==='play-episode'){playEpisode();return;}if(name==='ages')showAges();else if(name==='lesson')showLesson();else if(name==='guide')showLesson(state.setting==='home'?'home':'teacher');else if(name==='choices')startQuiz();else if(name==='match')startMatch();else if(name==='draw')startDraw();else if(name==='about')showAbout();else if(name==='privacy')showPrivacy();else if(name==='motion'){state.reducedMotion=!state.reducedMotion;applyMotion();toast(state.reducedMotion?'Decorative motion paused.':'Let’s bring the playroom to life.');}else if(name==='download'){const a=document.createElement('a');a.href=packURL();a.download=`bible-playroom-episode-1-colouring-${state.age}.pdf`;a.click();toast(`Opening the ${ageLabel().toLowerCase()} colouring page.`);}}
document.addEventListener('click',e=>{
 const episodeAge=e.target.closest('[data-episode-age]');if(episodeAge){chooseAge(episodeAge.dataset.episodeAge,false);showLesson();return;}
 if(e.target.closest('[data-game-sound]')){toggleGameSound();return;}
 const a=e.target.closest('[data-action]');if(a){action(a.dataset.action);return;}
 const age=e.target.closest('[data-age]');if(age){chooseAge(age.dataset.age);return;}
 const save=e.target.closest('[data-save]');if(save){const id=save.dataset.save;const i=state.saved.indexOf(id);if(i<0){state.saved.push(id);toast('Saved on this device.');}else{state.saved.splice(i,1);toast('Removed from your saved activities.');}persist();updateSaved();return;}
 const filter=e.target.closest('[data-filter]');if(filter){state.filter=filter.dataset.filter;$$('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===filter)));updateSaved();return;}
 const setting=e.target.closest('[data-setting]');if(setting){state.setting=setting.dataset.setting;$$('[data-setting]').forEach(el=>el.setAttribute('aria-pressed',String(el===setting)));$('#setting-copy').innerHTML=state.setting==='home'?'<h3>A small moment, made meaningful.</h3><p>Read a little, wonder together and try one activity. Open the short answer hints whenever you need a little help.</p>':'<h3>A little preparation. A meaningful class.</h3><p>Read the prepared explanation aloud. Open an answer hint only when you need it, then explore the game and colouring page together.</p>';return;}
 const friend=e.target.closest('[data-friend]');if(friend){showFriend(friend.dataset.friend);return;}
 const tab=e.target.closest('[data-lesson-tab]');if(tab){showLesson(tab.dataset.lessonTab);return;}
 const card=e.target.closest('[data-memory]');if(card){turnCard(Number(card.dataset.memory));return;}
 const swatch=e.target.closest('[data-colour]');if(swatch&&draw){draw.color=swatch.dataset.colour;draw.eraser=false;$$('[data-colour]').forEach(el=>el.setAttribute('aria-pressed',String(el===swatch)));$('[data-draw-tool="eraser"]').setAttribute('aria-pressed','false');return;}
 const drawTool=e.target.closest('[data-draw-tool]');if(drawTool){drawAction(drawTool.dataset.drawTool);return;}
 if(e.target.closest('[data-mark-discovery]')){complete('discover');confetti();showLesson();toast('Bible discovery marked complete for this age group.');return;}
 if(e.target.closest('#clear-progress')){state.saved=[];state.completed={};persisted.completed={};persisted.completedByCurriculum={};persist();updateSaved();toast('Saved activities and progress cleared from this browser.');return;}
 if(e.target.closest('#motion-toggle')){state.reducedMotion=!state.reducedMotion;applyMotion();e.target.setAttribute('aria-pressed',String(state.reducedMotion));e.target.textContent=state.reducedMotion?'Turn decorative motion on':'Pause decorative motion';return;}
});
$('#saved-toggle').addEventListener('click',()=>{state.savedOnly=!state.savedOnly;updateSaved();});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{if(dialog.open)return;stopGameAudio();dialog.querySelectorAll('.confetti-dot').forEach(el=>el.remove());currentAction='';memory=null;draw=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
$('.mobile-menu').addEventListener('click',()=>{const nav=$('.site-header nav'),open=nav.classList.toggle('mobile-open');$('.mobile-menu').setAttribute('aria-expanded',String(open));$('.mobile-menu').setAttribute('aria-label',open?'Close navigation':'Open navigation');});
$$('.site-header nav a').forEach(a=>a.addEventListener('click',()=>{$('.site-header nav').classList.remove('mobile-open');$('.mobile-menu').setAttribute('aria-expanded','false');$('.mobile-menu').setAttribute('aria-label','Open navigation');}));
function applyMotion(){
 document.documentElement.classList.toggle('js-motion',!state.reducedMotion);
 $$('.motion-control').forEach(el=>{el.setAttribute('aria-pressed',String(state.reducedMotion));el.setAttribute('aria-label',state.reducedMotion?'Resume decorative motion':'Pause decorative motion');el.innerHTML=`<span aria-hidden="true">${state.reducedMotion?'▷':'Ⅱ'}</span>`;});
 if(state.reducedMotion){$$('.reveal').forEach(el=>el.classList.add('visible'));$('.hero-art').style.removeProperty('--lean-x');$('.hero-art').style.removeProperty('--lean-y');}
}
// A slight pointer response adds depth while keeping the learning controls steady.
const stage=$('.hero-art');
stage.addEventListener('pointermove',e=>{if(state.reducedMotion||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();stage.style.setProperty('--lean-x',`${((e.clientX-r.left)/r.width-.5)*10}px`);stage.style.setProperty('--lean-y',`${((e.clientY-r.top)/r.height-.5)*7}px`);});
stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--lean-x','0px');stage.style.setProperty('--lean-y','0px');});
applyMotion();
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}else{$$('.reveal').forEach(el=>el.classList.add('visible'));}
$('#year').textContent=new Date().getFullYear();updateAge();updateSaved();

// Keep decorative loops quiet when their section is off screen or the tab is hidden.
if ('IntersectionObserver' in window) {
 const motionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('motion-asleep', !entry.isIntersecting));
 }, {rootMargin:'80px'});
 document.querySelectorAll('.hero-shell, .word-ribbon, .world-photo, .friday-banner').forEach(el => motionObserver.observe(el));
}
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('page-asleep', document.hidden));

// The approved episode loads on demand. No YouTube iframe or player script runs at page load.
const episodePosterHTML = $('#episode-player').innerHTML;
function stopEpisode(){
 const player=$('#episode-player');
 if(player?.querySelector('iframe')){player.innerHTML=episodePosterHTML;$('.episode-player-note').textContent='Tap to load the YouTube player. Watch with a grownup, then explore together.';}
}
function playEpisode(){
 const player=$('#episode-player');
 if(player.querySelector('iframe'))return;
 stopGameAudio();
 const frame=document.createElement('iframe');
 frame.src=`https://www.youtube-nocookie.com/embed/${episodeOne.videoId}?playsinline=1&rel=0&autoplay=1`;
 frame.title=`Episode 1: ${episodeOne.title} | The Bible Playroom`;
 frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
 frame.allowFullscreen=true;
 frame.referrerPolicy='strict-origin-when-cross-origin';
 player.replaceChildren(frame);
 $('.episode-player-note').textContent='YouTube player · Watch with a grownup, then explore the matching lesson.';
}
function openEpisode(){
 if(dialog.open)dialog.close();
 playEpisode();
 $('#episode-1').scrollIntoView({behavior:state.reducedMotion?'auto':'smooth',block:'start'});
 requestAnimationFrame(()=>{$('#episode-player iframe')?.focus({preventScroll:true});});
}
