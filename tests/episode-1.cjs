const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const gameCode=read('game-content.js'),story=read('story-games.js');
const c=vm.createContext({});vm.runInContext(gameCode+';this.games=episodeGames',c);
let tested=0;
for(const [age,game]of Object.entries(c.games)){
 assert.equal(game.scenes.length,3);
 for(let round=0;round<3;round++)for(const choice of game.scenes[round].choices){
  const context=vm.createContext({state:{age,gameMarks:{}},simpleSession:{round,selected:null},stopGameAudio(){},updateSimpleGame(){},confetti(){},playGameSound(){},persist(){},complete(){},document:{querySelector:()=>null}});
  vm.runInContext(gameCode+'\n'+story,context);
  vm.runInContext('storyChoose('+JSON.stringify(choice.id)+')',context);
  assert.equal(vm.runInContext('storyMarks().size',context),choice.acceptable?1:0);
  assert.equal(context.simpleSession.selected,choice.id);
  if(choice.acceptable){vm.runInContext('storyChoose('+JSON.stringify(choice.id)+');storyChoose("A")',context);assert.equal(vm.runInContext('storyMarks().size',context),1);}
  tested++;
 }
 let completions=0;
 const context=vm.createContext({state:{age,gameMarks:{}},simpleSession:{round:0,selected:null},stopGameAudio(){},updateSimpleGame(){},confetti(){},playGameSound(){},persist(){},complete(){completions++},document:{querySelector:()=>null}});
 vm.runInContext(gameCode+'\n'+story,context);
 for(let round=0;round<3;round++){context.simpleSession.round=round;vm.runInContext('storyChoose("B")',context);if(age==='9-12')vm.runInContext('storyChoose("C")',context);}
 assert.equal(vm.runInContext('storyMarks().size',context),3);assert.ok(completions>0);
 assert.equal(new Set(context.state.gameMarks[age]).size,3);
}
const appPrefix=read('app.js').split('function toast(')[0];
for(const raw of ['broken json','{}',JSON.stringify({age:'9-12',completed:{'9-12':['choices']},saved:['draw'],sound:false,completedByCurriculum:{other:{'3-5':['draw']}}})]){
 let saved;
 const context=vm.createContext({document:{querySelector:()=>null},window:{matchMedia:()=>({matches:false})},localStorage:{getItem:()=>raw,setItem:(_,v)=>saved=JSON.parse(v)}});
 vm.runInContext(appPrefix,context);vm.runInContext('persist()',context);
 if(raw.includes('other')){assert.deepEqual(saved.completed,{'9-12':['choices']});assert.deepEqual(saved.saved,['draw']);assert.deepEqual(saved.completedByCurriculum.other,{'3-5':['draw']});assert.equal(saved.sound,false);}
}
const html=read('index.html');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=m[1];if(/^(https?:|data:|mailto:)/.test(url))continue;assert.ok(fs.existsSync(path.join(root,url.split('?')[0])),url);}
for(const age of ['3-5','6-8','9-12'])for(const suffix of ['-a4.pdf','-letter.pdf','-preview.webp','.png'])assert.ok(fs.statSync(path.join(root,'assets/colouring/episode-1-simple-r1/ages-'+age+suffix)).size>1000);
assert.ok(html.indexOf('game-content.js')<html.indexOf('app.js'));assert.ok(html.indexOf('story-games.js')<html.indexOf('simple-learning.js'));
assert.ok(!read('simple-learning.js').includes("if(step==='play'&&state.age!=='3-5')"));
console.log(`PASS: ${tested} authored responses, valid alternatives, retries, unique rewards, completion, legacy progress, asset paths and script order.`);
