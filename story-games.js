'use strict';

function storyGame(){return episodeGames[state.age];}
function storyMarks(){const valid=new Set(storyGame().scenes.map(s=>s.id));return new Set((Array.isArray(state.gameMarks[state.age])?state.gameMarks[state.age]:[]).filter(id=>valid.has(id)));}
function storyChoose(choiceId){
  const scene=storyGame().scenes[simpleSession.round],choice=scene.choices.find(c=>c.id===choiceId);
  if(!choice)return;
  stopGameAudio();simpleSession.selected=choiceId;
  const marks=storyMarks(),newMark=choice.acceptable&&!marks.has(scene.id);
  if(choice.acceptable){marks.add(scene.id);state.gameMarks[state.age]=[...marks];persist();if(marks.size===3)complete('choices');}
  updateSimpleGame();
  if(newMark){confetti();playGameSound('correct');}else if(!choice.acceptable)playGameSound('encourage');
  const feedback=document.querySelector('#story-feedback');feedback?.focus({preventScroll:true});
}
function storyIllustration(scene){
  if(scene.id==='PP2'||scene.id==='CC3')return `<img class="story-art" src="${colourRoot}ages-${scene.id==='PP2'?'6-8':'9-12'}-preview.webp" alt="${scene.id==='PP2'?'Children inviting a classmate to a playground ball game':'Children reading and helping with books in a school library'}" width="440" height="625" decoding="async">`;
  if(scene.id==='PP1')return '<img class="story-art" src="assets/classroom-720.webp" alt="Teacher Abigail and children in their classroom" width="720" height="480" decoding="async">';
  const sceneArt={
    PP3:'<path d="M40 88h240v14H40zm22 14v63m195-63v63" fill="#c58e55"/><path d="m130 124 8 42h31l8-42z" fill="#b5e4df"/><path d="m152 125-7 16 12 5-5 19" fill="none" stroke="#5425bf" stroke-width="3"/><path d="M220 38h62v49h-62z" fill="#ffbf3f"/><path d="M210 88h81" stroke="#5425bf" stroke-width="4"/>',
    CC1:'<rect x="101" y="12" width="118" height="165" rx="19" fill="#fff9ed"/><rect x="111" y="30" width="98" height="128" rx="6" fill="#e9dcff"/><path d="M130 63h59m-59 33h38m-16 34h37" stroke="#8b6595" stroke-width="13" stroke-linecap="round"/><circle cx="160" cy="168" r="4" fill="#5425bf"/>',
    CC2:'<path d="M20 22h280v147H20z" fill="#e9dcff"/><path d="M45 45h58v124H45zm174 0h58v124h-58z" fill="#a4d8ca"/><path d="M123 53h74v42h-74z" fill="#fff9ed"/><path d="M35 169h250" stroke="#5425bf" stroke-width="5"/><path d="M134 121q26-20 52 0m-42 19h32" fill="none" stroke="#b18acb" stroke-width="8" stroke-linecap="round"/>'
  };
  const labels={PP3:'A cracked plastic cup on the floor beside a home table',CC1:'A fictional group chat on a phone, without any personal pictures or details',CC2:'A school corridor with classroom doors'};
  return `<svg class="story-art story-vector" viewBox="0 0 320 190" role="img" aria-label="${labels[scene.id]}"><rect width="320" height="190" rx="18" fill="#fff0d3"/><g stroke="#5425bf" stroke-width="2.5" stroke-linejoin="round">${sceneArt[scene.id]}</g></svg>`;
}
function storyPlay(){
  const game=storyGame(),s=simpleSession,scene=game.scenes[s.round],marks=storyMarks(),choice=scene.choices.find(c=>c.id===s.selected),all=marks.size===3;
  const reward=state.age==='6-8'?'Wisdom Stars':'Wisdom Marks';
  return `<p class="story-intro">${simpleText(game.intro)}</p><nav class="simple-trail story-trail" aria-label="Game scenes">${game.scenes.map((item,i)=>`<button data-simple="story-scene:${i}" aria-current="${s.round===i?'step':'false'}" ${i>s.round&&!marks.has(game.scenes[i-1].id)?'disabled':''} aria-label="Scene ${i+1}${marks.has(item.id)?', completed':''}"><span aria-hidden="true">${marks.has(item.id)?'★':i+1}</span><b>Scene ${i+1}</b></button>`).join('')}</nav><p class="story-rewards" aria-live="polite">${marks.size} of 3 ${reward}</p><div class="story-scene">${storyIllustration(scene)}<h4>${simpleText(scene.prompt)}</h4></div><div class="story-choices" role="group" aria-label="Choose a response">${scene.choices.map(c=>`<button data-simple="story-choice:${c.id}" aria-pressed="${s.selected===c.id}"><span aria-hidden="true">${c.id}</span>${simpleText(c.label)}</button>`).join('')}</div>${choice?`<div class="story-feedback ${choice.acceptable?'story-wise':'story-retry'}" id="story-feedback" tabindex="-1" role="region" aria-label="Your choice and what happens"><p>${simpleText(choice.outcome)}</p><p class="story-connection">${simpleText(scene.connection)}</p></div><div class="simple-pager">${simpleButton(state.age==='6-8'?'Try another way':'Try another path','story:retry','button outline')}${marks.has(scene.id)?simpleButton(s.round<2?'Next scene →':"Let's colour →",s.round<2?'story:next':'story:done'):''}</div>`:''}${all?`<div class="story-completion" role="status"><span aria-hidden="true">✦ ★ ✦</span><p>${simpleText(game.completion)}</p><span class="sr-only">Three out of three scenes completed.</span></div>${state.age==='9-12'?`<details class="simple-help"><summary>Think about it privately</summary><p>What advice will you think about more carefully this week?</p></details>`:''}<div class="simple-bottom">${simpleButton(state.age==='9-12'?'Finish adventure':"Let's colour →",'story:done')}</div>`:''}<details class="simple-help"><summary>Help for grown-ups</summary><p>${simpleText(scene.teacherNote)}</p></details>`;
}
