(()=>{
const key='alu-lab-theme',system=window.matchMedia('(prefers-color-scheme: dark)');let saved=null;
try{saved=localStorage.getItem(key);}catch{}
let theme=saved==='dark'||saved==='light'?saved:(system.matches?'dark':'light');
const button=document.createElement('button');button.type='button';button.id='themeToggle';button.className='help';
function apply(){document.documentElement.dataset.theme=theme;button.textContent=theme==='dark'?'☀ Light':'☾ Dark';button.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');button.setAttribute('aria-pressed',String(theme==='dark'));}
apply();
function mount(){const header=document.querySelector('.app-frame > header');const actions=document.createElement('div');actions.className='header-actions';const help=header.querySelector('.help');actions.append(button);if(help)actions.append(help);header.append(actions);}
button.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';saved=theme;apply();try{localStorage.setItem(key,theme);}catch{}});
system.addEventListener('change',()=>{if(saved!=='dark'&&saved!=='light'){theme=system.matches?'dark':'light';apply();}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
