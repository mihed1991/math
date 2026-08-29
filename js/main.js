const contentStore = window.LandingContent;
const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const modal = document.querySelector('#booking-modal');
const form = document.querySelector('#booking-form');
const success = document.querySelector('.success');
const selectedPlanNote = document.querySelector('#selected-plan-note');
let selectedPlan = '';

const safeUrl = value => {
  if (!value) return '';
  try {
    const url = new URL(value, location.href);
    return ['http:','https:','mailto:'].includes(url.protocol) ? url.href : '';
  } catch (_) { return ''; }
};
const phoneHref = value => value ? `tel:${value.replace(/[^+\d]/g,'')}` : '';

function createManagedLinks(block, section) {
  section.querySelector('.admin-dynamic-links')?.remove();
  if (!block.phone && !block.linkUrl) return;
  const links = document.createElement('div');
  links.className = 'admin-dynamic-links';
  if (block.phone) {
    const phone = document.createElement('a');
    phone.className = 'button button--ghost';
    phone.href = phoneHref(block.phone);
    phone.textContent = block.phone;
    links.append(phone);
  }
  const validUrl = safeUrl(block.linkUrl);
  if (validUrl) {
    const link = document.createElement('a');
    link.className = 'button button--ghost';
    link.href = validUrl;
    link.target = validUrl.startsWith(location.origin) ? '_self' : '_blank';
    link.rel = 'noopener';
    link.textContent = block.linkText || 'Перейти →';
    links.append(link);
  }
  const container = section.querySelector('.container,.portrait-copy') || section;
  container.append(links);
  if (block.id === 'final') section.querySelector('.contacts')?.setAttribute('hidden','');
}

function updateBuiltInBlock(block, section) {
  const original = contentStore.defaults.find(item => item.id === block.id);
  const title = section.querySelector('h2');
  if (title && original && block.title !== original.title) title.textContent = block.title;
  const descriptionSelectors = { about:'.split > p',process:'.managed-summary',format:'.managed-summary',approach:'.portrait-copy > p:not(.label)',goals:'.split > p',price:'.managed-summary',tutor:'.large-copy',reviews:'.managed-summary',faq:'.managed-summary',final:'.container > p:not(.label)' };
  if (original && block.description !== original.description) {
    let description = section.querySelector(descriptionSelectors[block.id]);
    if (!description) {
      description = document.createElement('p');
      description.className = 'managed-summary';
      title?.insertAdjacentElement('afterend',description);
    }
    description.textContent = block.description;
  }
  if (block.background && original && block.background !== original.background) {
    section.style.backgroundImage = `url("${encodeURI(block.background)}")`;
    section.classList.add('image-section');
  }
  createManagedLinks(block,section);
}

function createCustomBlock(block) {
  const section = document.createElement('section');
  section.className = 'section image-section custom-content-block';
  section.dataset.blockId = block.id;
  section.id = block.id;
  if (block.background) section.style.backgroundImage = `url("${encodeURI(block.background)}")`;
  const container = document.createElement('div'); container.className = 'container';
  const label = document.createElement('p'); label.className = 'label'; label.textContent = block.label;
  const title = document.createElement('h2'); title.textContent = block.title;
  const description = document.createElement('p'); description.className = 'custom-block-copy'; description.textContent = block.description;
  container.append(label,title,description);
  section.append(container);
  createManagedLinks(block,section);
  return section;
}

function applyManagedContent() {
  if (!contentStore || !localStorage.getItem(contentStore.STORAGE_KEY)) return;
  const blocks = contentStore.load();
  const main = document.querySelector('main');
  const existing = new Map([...document.querySelectorAll('[data-block-id]')].map(section => [section.dataset.blockId,section]));
  const allowed = new Set(blocks.map(block => block.id));
  existing.forEach((section,id) => { if (!allowed.has(id)) section.remove(); });
  blocks.forEach(block => {
    let section = document.querySelector(`[data-block-id="${CSS.escape(block.id)}"]`);
    if (!section) section = createCustomBlock(block);
    else updateBuiltInBlock(block,section);
    main.append(section);
  });
}

function applySiteSettings() {
  const settings = contentStore?.loadSettings?.() || contentStore?.defaultSettings;
  if (!settings) return;
  const finalBlock = contentStore.load().find(block => block.id === 'final');
  const sitePhone = finalBlock?.phone || '+375 (00) 000-00-00';
  document.querySelectorAll('.site-name').forEach(element => { element.textContent = settings.siteName; });
  document.querySelectorAll('[data-site-phone]').forEach(element => {
    element.textContent = sitePhone;
    element.href = phoneHref(sitePhone);
  });
  document.title = `${settings.siteName} — индивидуальные занятия`;
  document.querySelectorAll('.price-card .badge').forEach(badge => badge.remove());
  const badgeCard = settings.priceBadgePlan && document.querySelector(`.price-card[data-plan-id="${CSS.escape(settings.priceBadgePlan)}"]`);
  if (badgeCard && settings.priceBadgeText) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = settings.priceBadgeText;
    badgeCard.prepend(badge);
  }
}

applyManagedContent();
applySiteSettings();
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>24),{passive:true});
menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileMenu.classList.remove('open');document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false')}));

function openModal(){if(selectedPlan){selectedPlanNote.hidden=false;selectedPlanNote.textContent=`Выбранный тариф: ${selectedPlan}`}modal.classList.add('open');document.body.classList.add('modal-open');setTimeout(()=>form.querySelector('input').focus(),80)}
function closeModal(){modal.classList.remove('open');document.body.classList.remove('modal-open')}
document.addEventListener('click',event=>{if(event.target.closest('.js-open-modal'))openModal();if(event.target.closest('.modal-close,.js-close-modal'))closeModal()});
modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
form.addEventListener('submit',event=>{event.preventDefault();if(!form.checkValidity()){form.reportValidity();return}const submit=form.querySelector('[type="submit"]');submit.textContent='Отправляем…';submit.disabled=true;setTimeout(()=>{form.style.display='none';success.style.display='block'},650)});
document.addEventListener('click',event=>{const question=event.target.closest('.faq-question');if(!question)return;const item=question.closest('.faq-item');document.querySelectorAll('.faq-item.open').forEach(openItem=>{if(openItem!==item)openItem.classList.remove('open')});item.classList.toggle('open')});

const priceCards=[...document.querySelectorAll('.price-card')];
function selectPriceCard(card){priceCards.forEach(item=>{const selected=item===card;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));const button=item.querySelector('.button');if(button){if(!button.dataset.defaultText)button.dataset.defaultText=button.textContent.trim();button.textContent=selected?'Выбрано ✓':button.dataset.defaultText}});selectedPlan=`${card.querySelector('h3')?.textContent||''} — ${card.querySelector('strong')?.textContent||''}`}
priceCards.forEach(card=>{card.setAttribute('role','button');card.tabIndex=0;card.addEventListener('click',()=>selectPriceCard(card));card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPriceCard(card)}})});
if(priceCards.length)selectPriceCard(priceCards[0]);

const finePointer=matchMedia('(pointer:fine)');
const cursor=document.querySelector('.math-cursor');
const symbol=cursor.querySelector('.math-cursor-symbol');
let mouseX=-100,mouseY=-100,cursorX=-100,cursorY=-100,cursorReady=false;
function animateCursor(){cursorX+=(mouseX-cursorX)*.28;cursorY+=(mouseY-cursorY)*.28;cursor.style.transform=`translate3d(${cursorX-10}px,${cursorY-10}px,0)`;requestAnimationFrame(animateCursor)}
if(finePointer.matches){animateCursor();addEventListener('pointermove',event=>{mouseX=event.clientX;mouseY=event.clientY;if(!cursorReady){cursorReady=true;cursor.classList.add('visible');document.documentElement.classList.add('custom-cursor')}},{passive:true});addEventListener('pointerleave',()=>cursor.classList.remove('visible'));addEventListener('pointerenter',()=>{if(cursorReady)cursor.classList.add('visible')});document.addEventListener('pointerover',event=>{if(event.target.closest('a'))cursor.classList.add('hover-link');if(event.target.closest('button,.button')){cursor.classList.add('hover-action');symbol.textContent='→'}if(event.target.closest('.card'))cursor.classList.add('hover-card')});document.addEventListener('pointerout',event=>{const next=event.relatedTarget;if(!next?.closest?.('a'))cursor.classList.remove('hover-link');if(!next?.closest?.('button,.button')){cursor.classList.remove('hover-action');symbol.textContent='√'}if(!next?.closest?.('.card'))cursor.classList.remove('hover-card')})}
addEventListener('storage',event=>{if(event.key===contentStore?.STORAGE_KEY||event.key===contentStore?.SETTINGS_KEY)location.reload()});
