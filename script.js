const ORG = 'Forge-of-Ovorldule';
const PER_PAGE = 100;
const orgDescEl = document.getElementById('org-desc');
const trackEl = document.getElementById('marquee-track');
const searchInput = document.getElementById('search');

async function fetchJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

async function getRepoIcon(owner, repoName){
  // пробуем Icon.png
  try{
    const icon = await fetchJSON(`https://api.github.com/repos/${owner}/${repoName}/contents/Icon.png`);
    return icon.download_url;
  }catch{}
  // пробуем Real_Icon.png
  try{
    const icon2 = await fetchJSON(`https://api.github.com/repos/${owner}/${repoName}/contents/Real_Icon.png`);
    return icon2.download_url;
  }catch{}
  return null;
}

async function createRepoCard(repo){
  const iconUrl = await getRepoIcon(repo.owner.login, repo.name).catch(()=>null);
  const card = document.createElement('article');
  card.className='repo-card';

  const top=document.createElement('div');top.className='repo-top';
  const iconWrap=document.createElement('div');iconWrap.className='repo-icon';
  const img=document.createElement('img');img.alt=repo.name+' icon';img.loading='lazy';img.src=iconUrl||repo.owner.avatar_url;
  iconWrap.appendChild(img);

  const titleWrap=document.createElement('div');titleWrap.style.flex='1';
  const title=document.createElement('h3');title.className='repo-title';title.textContent=repo.name;
  const small=document.createElement('div');small.className='small-muted';small.textContent=repo.language||'';
  titleWrap.appendChild(title);titleWrap.appendChild(small);

  top.appendChild(iconWrap);top.appendChild(titleWrap);

  const desc=document.createElement('p');desc.className='repo-desc';desc.textContent=repo.description||'No description';

  const tagsWrap=document.createElement('div');tagsWrap.className='repo-tags';
  const starTag=document.createElement('span');starTag.className='tag star';starTag.textContent=`★ ${repo.stargazers_count}`;
  const forkTag=document.createElement('span');forkTag.className='tag fork';forkTag.textContent=`⑂ ${repo.forks_count}`;
  tagsWrap.appendChild(starTag);tagsWrap.appendChild(forkTag);

  const links=document.createElement('div');links.className='repo-links';
  const gh=document.createElement('a');gh.href=repo.html_url;gh.target='_blank';gh.rel='noopener';gh.textContent='GitHub';
  links.appendChild(gh);
  if(repo.homepage){
    const hp=document.createElement('a');hp.href=repo.homepage.startsWith('http')?repo.homepage:'https://'+repo.homepage;hp.target='_blank';hp.rel='noopener';hp.textContent='Website';links.appendChild(hp);
  }

  card.appendChild(top);card.appendChild(desc);card.appendChild(tagsWrap);card.appendChild(links);
  return card;
}

async function renderReposList(repos){
  trackEl.innerHTML='';
  const strip=document.createDocumentFragment();
  for(const r of repos){
    const card=await createRepoCard(r);
    strip.appendChild(card);
  }
  const containerA=document.createElement('div');containerA.style.display='flex';containerA.style.gap='18px';containerA.appendChild(strip);
  trackEl.appendChild(containerA);
  const containerB=containerA.cloneNode(true);
  trackEl.appendChild(containerB);
  initMarquee();
}

let pos=0,speed=50,lastTs=null,stripWidth=0,rafId=null;
function initMarquee(){
  cancelAnimationFrame(rafId);
  stripWidth=trackEl.scrollWidth/2||trackEl.scrollWidth;pos=0;lastTs=null;
  rafId=requestAnimationFrame(step);
}
function step(ts){
  if(!lastTs)lastTs=ts;const dt=(ts-lastTs)/1000;lastTs=ts;
  pos-=speed*dt;if(Math.abs(pos)>=stripWidth)pos+=stripWidth;
  trackEl.style.transform=`translateX(${pos}px)`;rafId=requestAnimationFrame(step);
}

async function loadAll(){
  try{const org=await fetchJSON(`https://api.github.com/orgs/${ORG}`);orgDescEl.textContent=org.description||'';}catch{orgDescEl.textContent='';}
  try{const res=await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=${PER_PAGE}`);let repos=await res.json();await renderReposList(repos);}catch{trackEl.textContent='Репозитории не загружены';}
}

searchInput.addEventListener('input',async()=>{
  const q=searchInput.value.trim().toLowerCase();
  const res=await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=${PER_PAGE}`);
  let repos=await res.json();
  if(q)repos=repos.filter(r=>r.name.toLowerCase().includes(q)||(r.description||'').toLowerCase().includes(q));
  await renderReposList(repos);
});

loadAll();
