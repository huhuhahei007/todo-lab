const $=s=>document.querySelector(s),board=$('#board'),notes=new Map(),views=new Map();
const key='todo-lab.whiteboard.v1';let color='yellow',dragging=null,unsaved=false;
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',5000);}
function save(){try{localStorage.setItem(key,JSON.stringify([...notes.values()]));unsaved=false;$('#status').textContent='● 已保存在此浏览器';$('#status').className='connected';}catch{unsaved=true;$('#status').textContent='保存失败';toast('浏览器无法保存，请保留此页面，避免丢失内容。');}}
function enqueue(m){if(m.type==='create'){if(notes.size>=200)return toast('白板最多容纳 200 张便利贴');notes.set(m.id,{...m,text:''});}else if(m.type==='delete'){notes.delete(m.id);views.get(m.id)?.remove();views.delete(m.id);}else{const n=notes.get(m.id);if(!n)return;for(const field of ['text','x','y'])if(m[field]!==undefined)n[field]=field==='text'?m[field]:Math.max(0,Math.min(field==='x'?1300:1000,m[field]));}if(notes.has(m.id))render(notes.get(m.id));counts();save();}
function render(n){let el=views.get(n.id);if(!el){el=document.createElement('article');el.className='note';el.innerHTML='<div class="handle" tabindex="0" role="button" aria-label="移动便利贴"><span>⠿ 拖动移动</span><button class="delete" aria-label="删除便利贴">×</button></div><textarea maxlength="2000" placeholder="写下一个想法…" aria-label="便利贴内容"></textarea>';board.append(el);views.set(n.id,el);
  const input=el.querySelector('textarea'),handle=el.querySelector('.handle');
  input.oninput=()=>enqueue({type:'patch',id:n.id,text:input.value});
  el.querySelector('.delete').onclick=()=>enqueue({type:'delete',id:n.id});
  handle.onkeydown=e=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(d){e.preventDefault();const current=notes.get(n.id);enqueue({type:'patch',id:n.id,x:current.x+d[0],y:current.y+d[1]});}};
  handle.onpointerdown=e=>{if(e.target.closest('button'))return;const current=notes.get(n.id);dragging={id:n.id,px:e.clientX,py:e.clientY,x:current.x,y:current.y};handle.setPointerCapture(e.pointerId);};
  handle.onpointermove=e=>{if(dragging?.id!==n.id)return;dragging.tx=Math.max(0,Math.min(1300,dragging.x+e.clientX-dragging.px));dragging.ty=Math.max(0,Math.min(1000,dragging.y+e.clientY-dragging.py));el.style.left=dragging.tx+'px';el.style.top=dragging.ty+'px';};
  const end=()=>{if(dragging?.id!==n.id)return;if(dragging.tx!==undefined)enqueue({type:'patch',id:n.id,x:dragging.tx,y:dragging.ty});dragging=null;};handle.onpointerup=end;handle.onpointercancel=end;
 }el.className='note '+n.color;if(dragging?.id!==n.id){el.style.left=n.x+'px';el.style.top=n.y+'px';}
 const input=el.querySelector('textarea');if(document.activeElement!==input)input.value=n.text;
}
function counts(){$('#count').textContent=notes.size+' 张便利贴';$('#empty').hidden=notes.size>0;}
$('#add').onclick=()=>{const viewport=$('.viewport');enqueue({type:'create',id:crypto.randomUUID(),color,x:Math.min(1300,viewport.scrollLeft+30+Math.random()*80),y:Math.min(1000,viewport.scrollTop+30+Math.random()*80)});};
document.querySelectorAll('.palette button').forEach(b=>b.onclick=()=>{color=b.dataset.color;document.querySelectorAll('.palette button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});});
try{const stored=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(stored))throw Error('invalid');for(const n of stored.slice(0,200)){if(typeof n.id==='string'&&typeof n.text==='string'&&Number.isFinite(n.x)&&Number.isFinite(n.y)&&['yellow','pink','blue','green'].includes(n.color)){n.x=Math.max(0,Math.min(1300,n.x));n.y=Math.max(0,Math.min(1000,n.y));notes.set(n.id,n);render(n);}}$('#status').textContent='● 已保存在此浏览器';$('#status').className='connected';}catch{unsaved=true;$('#status').textContent='无法读取保存内容';toast('保存内容无法读取，请勿清除浏览器数据。');$('#add').disabled=true;}
counts();window.addEventListener('beforeunload',e=>{if(unsaved){e.preventDefault();e.returnValue='';}});
