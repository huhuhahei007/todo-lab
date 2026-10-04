'use strict';
const STORAGE_KEY = 'manmanlai.tasks.v1';
let tasks = [];
let filter = 'all';
const $ = (selector) => document.querySelector(selector);
const notice = $('#notice');
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(saved)) throw new Error('Invalid stored tasks');
  const ids = new Set();
  tasks = saved.filter(t => t && typeof t.id === 'string' && typeof t.text === 'string' && t.text.trim() && typeof t.done === 'boolean' && !ids.has(t.id) && ids.add(t.id)).map(t => ({id:t.id, text:t.text.slice(0,200), done:t.done}));
} catch {
  notice.textContent = '无法读取之前的清单，你仍然可以添加任务。';
}
$('#date').textContent = new Intl.DateTimeFormat('zh-CN', {month:'long', day:'numeric', weekday:'long'}).format(new Date());
function save() {
  try {localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); notice.textContent = '';}
  catch {notice.textContent = '浏览器暂时无法保存数据。关闭页面前，请保留重要任务。';}
}
function render() {
  const done = tasks.filter(t => t.done).length;
  const remaining = tasks.length - done;
  const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  $('#total').textContent = tasks.length;
  $('#pending').textContent = remaining;
  $('#completed').textContent = done;
  $('#percent').textContent = `${percent}%`;
  $('#progress').style.width = `${percent}%`;
  $('#progress-note').textContent = tasks.length && !remaining ? '今天的清单，全部完成！' : done ? '每一步，都在往前走' : '从一件小事开始';
  $('#remaining').textContent = `${remaining} 项待完成`;
  $('#clear').disabled = !done;
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  $('#task-list').replaceChildren();
  for (const task of visible) {
    const item = document.createElement('li');
    item.className = `task${task.done ? ' done' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `${task.done ? '标记为待完成' : '完成任务'}：${task.text}`);
    checkbox.addEventListener('change', () => {task.done = checkbox.checked; save(); render();});
    const label = document.createElement('span');
    label.className = 'task-text';
    label.textContent = task.text;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `删除任务：${task.text}`);
    remove.addEventListener('click', () => {tasks = tasks.filter(t => t.id !== task.id); save(); render();});
    item.append(checkbox, label, remove);
    $('#task-list').append(item);
  }
  $('#empty').hidden = visible.length > 0;
  const messages = filter === 'done' ? ['还没有完成的任务', '完成一件小事，就会出现在这里。'] : filter === 'active' && tasks.length ? ['待办清空，轻松一下', '所有任务都完成了，给自己一点休息时间。'] : ['给今天一个小目标', '在上方添加第一件事，一步一步慢慢来。'];
  $('#empty-title').textContent = messages[0];
  $('#empty-description').textContent = messages[1];
}
$('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#task-input');
  const text = input.value.trim();
  if (!text) {input.value = ''; input.focus(); return;}
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tasks.unshift({id, text, done:false});
  input.value = '';
  filter = 'all';
  updateFilters();
  save(); render(); input.focus();
});
function updateFilters() {document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {filter = button.dataset.filter; updateFilters(); render();}));
$('#clear').addEventListener('click', () => {tasks = tasks.filter(t => !t.done); save(); render();});
render();
