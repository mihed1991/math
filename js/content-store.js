(function () {
  const STORAGE_KEY = 'mathTutorLandingBlocksV1';
  const SETTINGS_KEY = 'mathTutorLandingSettingsV1';
  const defaultSettings = {
    siteName: 'Понимать математику',
    priceBadgePlan: 'four',
    priceBadgeText: 'Оптимальный вариант'
  };
  const BACKGROUNDS = [
    { value: '', label: 'Без изображения' },
    { value: 'ChatGPT Image 29 авг. 2026 г., 14_18_58.png', label: 'Преподаватель у доски' },
    { value: 'ChatGPT Image 29 авг. 2026 г., 14_36_10 (1).png', label: 'Объяснение у доски' },
    { value: 'ChatGPT Image 29 авг. 2026 г., 14_36_11 (2).png', label: 'Работа с учебниками' },
    { value: 'ChatGPT Image 29 авг. 2026 г., 14_36_11 (3).png', label: 'Онлайн-занятие' },
    { value: 'ChatGPT Image 29 авг. 2026 г., 14_36_20.png', label: 'Портрет у доски' }
  ];

  const defaults = [
    { id:'about', label:'01 / О занятиях', title:'Проблема часто не в математике', description:'Если пропустить одну важную тему, следующая становится сложнее. Сначала находим причину, а уже потом решаем задачи.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[1].value, builtIn:true },
    { id:'process', label:'02 / Путь к пониманию', title:'Как проходит занятие', description:'Разбираемся, объясняем, практикуемся и закрепляем тему в спокойном темпе.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[2].value, builtIn:true },
    { id:'format', label:'03 / Формат', title:'Выберите удобный формат', description:'Онлайн или офлайн — оба формата остаются индивидуальными и удобными для ученика.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[4].value, builtIn:true },
    { id:'approach', label:'04 / Подход', title:'Не просто решить задачу. А понять, почему она решается именно так.', description:'Цель занятия — понять ход решения и суметь повторить его самостоятельно.', phone:'', linkText:'', linkUrl:'', background:'', builtIn:true },
    { id:'goals', label:'05 / Цели', title:'Занятия подстраиваются под цель ученика', description:'План занятий зависит от уровня ученика и его конкретной цели.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[3].value, builtIn:true },
    { id:'price', label:'06 / Инвестиция в знания', title:'Стоимость занятий', description:'Выберите подходящий объём занятий. Тариф можно изменить позже.', phone:'', linkText:'', linkUrl:'', background:'', builtIn:true },
    { id:'tutor', label:'07 / О преподавателе', title:'О преподавателе', description:'Помогаю школьникам разобраться в математике без зубрёжки и страха ошибиться.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[5].value, builtIn:true },
    { id:'reviews', label:'08 / Отзывы', title:'Отзывы учеников', description:'Истории учеников и родителей о прогрессе и уверенности в математике.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[3].value, builtIn:true },
    { id:'faq', label:'09 / FAQ', title:'Частые вопросы', description:'Ответы о формате, уровне подготовки и организации занятий.', phone:'', linkText:'', linkUrl:'', background:BACKGROUNDS[2].value, builtIn:true },
    { id:'final', label:'√ Первое занятие', title:'Давайте разберём математику без стресса и зубрёжки', description:'Оставьте заявку — обсудим уровень ученика, цель занятий и подходящий формат.', phone:'+375 (00) 000-00-00', linkText:'Написать в Telegram', linkUrl:'https://t.me/', background:BACKGROUNDS[1].value, builtIn:true }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  const load = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : clone(defaults);
    } catch (_) {
      return clone(defaults);
    }
  };
  const save = blocks => localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  const reset = () => { localStorage.removeItem(STORAGE_KEY); return clone(defaults); };
  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...clone(defaultSettings), ...JSON.parse(stored) } : clone(defaultSettings);
    } catch (_) {
      return clone(defaultSettings);
    }
  };
  const saveSettings = settings => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...defaultSettings, ...settings }));
  const resetSettings = () => { localStorage.removeItem(SETTINGS_KEY); return clone(defaultSettings); };

  window.LandingContent = { STORAGE_KEY, SETTINGS_KEY, BACKGROUNDS, defaults:clone(defaults), defaultSettings:clone(defaultSettings), load, save, reset, loadSettings, saveSettings, resetSettings };
})();
