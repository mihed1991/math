const content = window.LandingContent;
const adminAuth = window.AdminAuth;
const authScreen = document.querySelector('#auth-screen');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const passwordForm = document.querySelector('#password-form');
const passwordMessage = document.querySelector('#password-message');
const siteSettingsForm = document.querySelector('#site-settings-form');
const list = document.querySelector('#block-list');
const emptyState = document.querySelector('#empty-state');
const count = document.querySelector('#block-count');
const search = document.querySelector('#block-search');
const editor = document.querySelector('#block-editor');
const blockForm = document.querySelector('#block-form');
const editorTitle = document.querySelector('#editor-title');
const editorError = document.querySelector('#editor-error');
const backgroundSelect = blockForm.elements.background;
const toast = document.querySelector('#toast');
let blocks = content.load();
let siteSettings = content.loadSettings();

function unlockAdmin() {
  document.body.classList.remove('admin-locked');
  authScreen.hidden = true;
}

function renderSiteSettings() {
  siteSettingsForm.elements.siteName.value = siteSettings.siteName;
  siteSettingsForm.elements.sitePhone.value = siteSettings.sitePhone;
  siteSettingsForm.elements.priceBadgePlan.value = siteSettings.priceBadgePlan;
  siteSettingsForm.elements.priceBadgeText.value = siteSettings.priceBadgeText;
  document.querySelectorAll('.admin-site-name').forEach(element => { element.textContent = siteSettings.siteName; });
}
if (adminAuth.isAuthenticated()) unlockAdmin();

loginForm.addEventListener('submit',async event => {
  event.preventDefault();
  const submit = loginForm.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Проверяем…';
  const valid = await adminAuth.login(loginForm.elements.password.value);
  submit.disabled = false;
  submit.innerHTML = 'Войти <span>→</span>';
  if (!valid) {
    loginError.hidden = false;
    loginForm.elements.password.select();
    return;
  }
  loginError.hidden = true;
  unlockAdmin();
  showToast('Вход выполнен');
});

content.BACKGROUNDS.forEach(item => {
  const option = document.createElement('option');
  option.value = item.value;
  option.textContent = item.label;
  backgroundSelect.append(option);
});

const safeUrl = value => {
  if (!value) return '';
  try {
    const url = new URL(value, location.href);
    return ['http:','https:','mailto:'].includes(url.protocol) ? url.href : '';
  } catch (_) { return ''; }
};
const phoneHref = value => value ? `tel:${value.replace(/[^+\d]/g,'')}` : '';
const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
};
const persist = message => {
  content.save(blocks);
  render();
  showToast(message);
};

function createAction(label, className, handler, ariaLabel = label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', handler);
  return button;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = blocks.filter(block => `${block.label} ${block.title} ${block.description}`.toLowerCase().includes(query));
  list.replaceChildren();
  count.textContent = String(blocks.length);
  emptyState.hidden = visible.length !== 0;

  visible.forEach(block => {
    const actualIndex = blocks.findIndex(item => item.id === block.id);
    const article = document.createElement('article');
    article.className = 'block-card';
    const cover = document.createElement('div');
    cover.className = block.background ? 'block-cover' : 'block-cover block-cover--empty';
    if (block.background) cover.style.backgroundImage = `url("${block.background}")`;
    const body = document.createElement('div');
    body.className = 'block-body';
    const index = document.createElement('span');
    index.className = 'block-index';
    index.textContent = `${String(actualIndex + 1).padStart(2,'0')} / ${block.builtIn ? 'ОСНОВНОЙ' : 'ДОБАВЛЕННЫЙ'}`;
    const title = document.createElement('h3'); title.textContent = block.title;
    const description = document.createElement('p'); description.textContent = block.description;
    const meta = document.createElement('div'); meta.className = 'block-meta';
    [block.background ? 'Есть фон' : 'Без фона', block.builtIn ? 'Исходный блок' : 'Пользовательский'].forEach(text => { const chip=document.createElement('span'); chip.className='meta-chip'; chip.textContent=text; meta.append(chip); });
    const contacts = document.createElement('div'); contacts.className = 'block-contact';
    if (block.phone) { const phone=document.createElement('a'); phone.href=phoneHref(block.phone); phone.textContent=block.phone; contacts.append(phone); }
    if (block.linkUrl) { const link=document.createElement('a'); link.href=safeUrl(block.linkUrl) || '#'; link.target='_blank'; link.rel='noopener'; link.textContent=block.linkText || block.linkUrl; contacts.append(link); }
    const actions = document.createElement('div'); actions.className='block-actions';
    actions.append(
      createAction('Редактировать','control control--ghost',()=>openEditor(block.id)),
      createAction('↑','icon-control',()=>moveBlock(actualIndex,-1),'Переместить выше'),
      createAction('↓','icon-control',()=>moveBlock(actualIndex,1),'Переместить ниже'),
      createAction('×','icon-control danger-control',()=>deleteBlock(block.id),'Удалить блок')
    );
    body.append(index,title,description,meta,contacts,actions);
    article.append(cover,body);
    list.append(article);
  });
}

function openEditor(id = '') {
  editorError.hidden = true;
  blockForm.reset();
  const block = blocks.find(item => item.id === id);
  editorTitle.textContent = block ? 'Редактировать блок' : 'Новый блок';
  if (block) Object.entries(block).forEach(([key,value]) => { if (blockForm.elements[key]) blockForm.elements[key].value = value ?? ''; });
  editor.classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(() => blockForm.elements.title.focus(), 70);
}
function closeEditor() { editor.classList.remove('open'); document.body.classList.remove('modal-open'); }
function moveBlock(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= blocks.length) return;
  [blocks[index],blocks[target]] = [blocks[target],blocks[index]];
  persist('Порядок блоков обновлён');
}
function deleteBlock(id) {
  const block = blocks.find(item => item.id === id);
  if (!block || !confirm(`Удалить блок «${block.title}»?`)) return;
  blocks = blocks.filter(item => item.id !== id);
  persist('Блок удалён, сетка перераспределена');
}

blockForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!blockForm.checkValidity()) { blockForm.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(blockForm));
  if (data.linkUrl && !safeUrl(data.linkUrl)) { editorError.textContent='Ссылка должна начинаться с http:// или https://'; editorError.hidden=false; return; }
  const existingIndex = blocks.findIndex(item => item.id === data.id);
  const base = existingIndex >= 0 ? blocks[existingIndex] : { id:`custom-${Date.now()}`, builtIn:false };
  const updated = { ...base, label:data.label.trim() || 'Новый блок', title:data.title.trim(), description:data.description.trim(), phone:data.phone.trim(), linkText:data.linkText.trim(), linkUrl:data.linkUrl.trim(), background:data.background };
  if (existingIndex >= 0) blocks[existingIndex] = updated; else blocks.push(updated);
  content.save(blocks);
  closeEditor();
  render();
  showToast(existingIndex >= 0 ? 'Изменения сохранены' : 'Новый блок добавлен');
});

document.querySelectorAll('#add-block,#add-block-secondary,#empty-add').forEach(button => button.addEventListener('click',()=>openEditor()));
document.querySelectorAll('.editor-close').forEach(button => button.addEventListener('click',closeEditor));
editor.addEventListener('click',event=>{ if(event.target===editor) closeEditor(); });
addEventListener('keydown',event=>{ if(event.key==='Escape') closeEditor(); });
search.addEventListener('input',render);
document.querySelector('#reset-blocks').addEventListener('click',()=>{ if(confirm('Вернуть исходные блоки, название и стикер?')){ blocks=content.reset(); siteSettings=content.resetSettings(); render(); renderSiteSettings(); showToast('Исходные настройки восстановлены'); } });
document.querySelector('#logout-button').addEventListener('click',()=>{ adminAuth.logout(); location.reload(); });
passwordForm.addEventListener('submit',async event => {
  event.preventDefault();
  const current = passwordForm.elements.currentPassword.value;
  const next = passwordForm.elements.newPassword.value;
  const confirmation = passwordForm.elements.confirmPassword.value;
  passwordMessage.hidden = false;
  passwordMessage.classList.remove('success');
  if (next !== confirmation) {
    passwordMessage.textContent = 'Новые пароли не совпадают.';
    return;
  }
  const result = await adminAuth.change(current,next);
  passwordMessage.textContent = result.message;
  passwordMessage.classList.toggle('success',result.ok);
  if (result.ok) { passwordForm.reset(); showToast('Пароль панели управления изменён'); }
});
siteSettingsForm.addEventListener('submit',event => {
  event.preventDefault();
  if (!siteSettingsForm.checkValidity()) { siteSettingsForm.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(siteSettingsForm));
  siteSettings = {
    siteName: data.siteName.trim(),
    sitePhone: data.sitePhone.trim(),
    priceBadgePlan: data.priceBadgePlan,
    priceBadgeText: data.priceBadgeText.trim()
  };
  content.saveSettings(siteSettings);
  renderSiteSettings();
  showToast('Название и стикер обновлены');
});
addEventListener('storage',event=>{ if(event.key===content.STORAGE_KEY){ blocks=content.load(); render(); } if(event.key===content.SETTINGS_KEY){ siteSettings=content.loadSettings(); renderSiteSettings(); } });
renderSiteSettings();
render();
