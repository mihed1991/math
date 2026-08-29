"use client";

import { FormEvent, useEffect, useState } from "react";

const prices = [
  { title: "Разовое занятие", time: "60 минут", price: "45 BYN", points: ["Индивидуальное занятие", "Разбор выбранной темы", "Материалы после занятия"] },
  { title: "4 занятия", time: "4 × 60 минут", price: "160 BYN", badge: "Оптимальный вариант", points: ["Индивидуальный план", "Последовательная работа", "Домашние задания", "Отслеживание прогресса"] },
  { title: "8 занятий", time: "8 × 60 минут", price: "300 BYN", points: ["Системная работа", "Индивидуальный план", "Корректировка программы", "Контроль прогресса"] },
];

const faq = ["С какого уровня можно начать?", "Можно ли заниматься только перед контрольной?", "Есть ли домашние задания?", "Что нужно для онлайн-занятия?", "Можно ли перейти с онлайн на офлайн?", "Сколько занятий нужно, чтобы увидеть результат?"];

function Arrow() { return <span aria-hidden="true">→</span>; }

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", grade: "", contact: "", format: "Онлайн", goal: "Повысить успеваемость", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.grade || !form.contact) { setStatus("error"); return; }
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 900));
    // Replace this adapter with Telegram Bot, Formspree, REST API, or another backend integration.
    setStatus("success");
  };

  return <main>
    <div className="cursor" aria-hidden="true">√</div>
    <header className={scrolled ? "header header--scrolled" : "header"}>
      <button className="logo" onClick={() => scrollTo("top")} aria-label="В начало страницы"><i>√</i> Понимать математику</button>
      <nav aria-label="Основная навигация">
        {[["О занятиях", "about"], ["Как проходит", "process"], ["Формат", "format"], ["Стоимость", "price"], ["Обо мне", "tutor"], ["FAQ", "faq"]].map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
      </nav>
      <button className="button button--small" onClick={() => setModal(true)}>Записаться <Arrow /></button>
      <button className="menu-toggle" aria-label="Открыть меню" aria-expanded={menu} onClick={() => setMenu(!menu)}><span /><span /></button>
      {menu && <div className="mobile-menu">{[["О занятиях", "about"], ["Как проходит", "process"], ["Формат", "format"], ["Стоимость", "price"], ["Обо мне", "tutor"], ["FAQ", "faq"]].map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}<button className="button" onClick={() => { setMenu(false); setModal(true); }}>Записаться <Arrow /></button></div>}
    </header>

    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/tutor-portrait.png"><source src="/hero-math.mp4" type="video/mp4" /></video>
      <div className="hero-shade" />
      <div className="hero-content container">
        <p className="eyebrow">√&nbsp; Индивидуальные занятия по математике</p>
        <h1>Математика,<br /><em>которую можно понять</em></h1>
        <p className="hero-copy">Индивидуальные занятия для школьников. Разбираем сложные темы, закрываем пробелы и учимся понимать математику, а не заучивать её.</p>
        <div className="actions"><button className="button" onClick={() => setModal(true)}>Записаться на занятие <Arrow /></button><button className="button button--ghost" onClick={() => scrollTo("process")}>Как проходят занятия</button></div>
        <div className="hero-meta"><span>√ Онлайн / Офлайн</span><span>× Индивидуально</span><span>π 60 минут</span></div>
      </div>
      <p className="hero-index">f(x) / 01</p>
    </section>

    <section className="section problem" id="about"><div className="container"><p className="section-number">01 / О занятиях</p><div className="split-heading"><h2>Проблема часто<br /><em>не в математике</em></h2><p>Если пропустить одну важную тему, следующая становится сложнее. Потом появляются новые пробелы — и в какой-то момент кажется, что математика просто «не даётся».</p></div><div className="problem-cards">{["Пробелы в базе", "Непонятное объяснение", "Страх задавать вопросы"].map((item, i) => <article key={item} className="problem-card"><span>0{i + 1}</span><h3>{item}</h3><b>{["a² + b²", "f(x)", "∞"][i]}</b></article>)}</div><p className="closing">На индивидуальных занятиях мы сначала <em>находим причину</em>, а уже потом решаем задачи.</p></div></section>

    <section className="section process" id="process"><div className="container"><p className="section-number">02 / Путь к пониманию</p><h2>Как проходит занятие</h2><div className="process-graph" aria-hidden="true"><svg viewBox="0 0 1200 130" preserveAspectRatio="none"><path d="M0,110 C110,110 105,18 220,24 S330,120 440,84 S550,10 660,20 S770,110 880,85 S1010,30 1200,50" /></svg></div><div className="steps">{[["Разбираемся", "Определяем, какие темы уже понятны, а где появились пробелы."], ["Объясняем", "Сложную тему разбираем простым языком и на понятных примерах."], ["Практикуемся", "Решаем задачи от простых к более сложным."], ["Закрепляем", "В конце ученик самостоятельно решает похожую задачу."]].map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section formats" id="format"><div className="container"><p className="section-number">03 / Формат</p><h2>Выберите удобный формат</h2><div className="format-grid">{[["Онлайн", "Из любой точки мира — в привычном ритме.", ["Видеосвязь и интерактивная доска", "Демонстрация решений", "Материалы после занятия", "Можно заниматься из любого города"]], ["Офлайн", "Встреча один на один — в спокойной атмосфере.", ["Личная встреча", "Бумажные и цифровые материалы", "Работа один на один", "Разбор школьных заданий"]]].map(([title, lead, points]) => <article key={title} className="format-card"><span className="format-symbol">{title === "Онлайн" ? "√" : "Δ"}</span><h3>{title}</h3><p>{lead}</p><ul>{(points as string[]).map(x => <li key={x}>√ {x}</li>)}</ul><button onClick={() => setModal(true)} className="text-link">Выбрать {title.toLowerCase()} <Arrow /></button></article>)}</div></div></section>

    <section className="portrait-section"><div className="portrait-media"><img src="/tutor-portrait.png" alt="Преподаватель математики у доски с формулами" /><span>π</span><span>x²</span></div><div className="portrait-copy"><p className="section-number">04 / Подход</p><h2>Не просто решить задачу.<br /><em>А понять, почему она решается именно так.</em></h2><p>Цель занятия — не получить ответ любой ценой. Важно, чтобы ученик понимал ход решения и мог повторить его самостоятельно.</p><div className="formula">y = ax² + bx + c</div></div></section>

    <section className="section goals"><div className="container"><p className="section-number">05 / Цели</p><div className="split-heading"><h2>Занятия подстраиваются<br /><em>под цель ученика</em></h2><p>Здесь нет одной программы для всех. План занятий зависит от уровня ученика и его цели.</p></div><div className="goal-grid">{["Повысить успеваемость", "Закрыть пробелы", "Подготовиться к контрольной", "Подготовиться к экзамену", "Разобрать сложную тему", "Стать увереннее в математике"].map((x, i) => <div key={x}><span>0{i + 1}</span>{x}<b>{["+", "×", "=", "π", "√", "∞"][i]}</b></div>)}</div></div></section>

    <section className="section pricing" id="price"><div className="container"><p className="section-number">06 / Инвестиция в знания</p><h2>Стоимость занятий</h2><div className="price-grid">{prices.map((plan) => <article key={plan.title} className={plan.badge ? "price-card featured" : "price-card"}>{plan.badge && <span className="badge">{plan.badge}</span>}<h3>{plan.title}</h3><p>{plan.time}</p><strong>{plan.price}</strong><ul>{plan.points.map(x => <li key={x}>√ {x}</li>)}</ul><button className="button button--wide" onClick={() => setModal(true)}>{plan.title === "Разовое занятие" ? "Записаться" : "Выбрать"} <Arrow /></button></article>)}</div></div></section>

    <section className="section tutor" id="tutor"><div className="container tutor-grid"><div><p className="section-number">07 / О преподавателе</p><h2>О преподавателе</h2><p className="large-copy">Помогаю школьникам разобраться в математике без зубрёжки и страха ошибиться. На занятиях важно не только получить правильный ответ, но и понять ход решения.</p><button className="text-link" onClick={() => setModal(true)}>Познакомиться и записаться <Arrow /></button></div><div className="stats">{[["7+", "лет опыта"], ["120+", "учеников"], ["онлайн", "и офлайн"], ["1:1", "индивидуально"]].map(([a,b]) => <div key={b}><strong>{a}</strong><span>{b}</span></div>)}</div></div></section>

    <section className="section reviews"><div className="container"><p className="section-number">08 / Отзывы</p><h2>Отзывы учеников</h2><div className="reviews-row">{[["Аня, 9 класс", "Наконец-то перестала бояться задач с параметрами. Всё объясняется спокойно и по шагам."], ["Марина, мама Артёма", "За два месяца сын стал увереннее, а оценки перестали быть источником тревоги."], ["Егор, 11 класс", "Понравилось, что мы не просто решали варианты, а разбирали, почему именно так."]].map(([name, quote]) => <figure key={name}><div>“</div><blockquote>{quote}</blockquote><figcaption>{name} <small>— временный отзыв</small></figcaption></figure>)}</div></div></section>

    <section className="section faq" id="faq"><div className="container narrow"><p className="section-number">09 / FAQ</p><h2>Частые вопросы</h2><div className="accordion">{faq.map((q, i) => <div className={openFaq === i ? "faq-item open" : "faq-item"} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>{q}<span>+</span></button><div className="faq-answer"><p>{i === 0 ? "Начать можно с любого уровня. На первой встрече спокойно определим, что уже получается и с чего лучше двигаться дальше." : "Да. Формат и количество занятий подбираются под вашу задачу — без обязательной долгой программы."}</p></div></div>)}</div></div></section>

    <section className="final-cta"><div className="container"><p className="section-number">√ Первое занятие</p><h2>Давайте разберём математику<br /><em>без стресса и зубрёжки</em></h2><p>Оставьте заявку — обсудим уровень ученика, цель занятий и подходящий формат.</p><button className="button" onClick={() => setModal(true)}>Записаться на первое занятие <Arrow /></button><div className="contact-links"><a href="#contact">Telegram</a><a href="#contact">WhatsApp</a><a href="tel:+375000000000">+375 (00) 000-00-00</a></div></div></section>
    <footer id="contact"><div className="container"><span className="logo"><i>√</i> Понимать математику</span><span>© 2026</span><div><a href="#contact">Telegram</a><a href="#contact">Instagram</a><a href="#contact">WhatsApp</a></div></div></footer>

    {modal && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal"><button className="close" onClick={() => { setModal(false); setStatus("idle"); }} aria-label="Закрыть">×</button>{status === "success" ? <div className="success"><span>√</span><h2>Заявка отправлена</h2><p>Спасибо! Я свяжусь с вами в ближайшее время.</p><button className="button" onClick={() => { setModal(false); setStatus("idle"); }}>Готово</button></div> : <form onSubmit={submit}><p className="section-number">Первое занятие</p><h2 id="form-title">Давайте познакомимся</h2><p>Оставьте контакты, и мы подберём удобное время.</p><div className="form-grid"><label>Имя<input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Как к вам обращаться" /></label><label>Класс ученика<input value={form.grade} onChange={e => setForm({...form,grade:e.target.value})} placeholder="Например, 8 класс" /></label><label className="full">Телефон / Telegram<input value={form.contact} onChange={e => setForm({...form,contact:e.target.value})} placeholder="+375… или @username" /></label><label>Формат<select value={form.format} onChange={e => setForm({...form,format:e.target.value})}><option>Онлайн</option><option>Офлайн</option></select></label><label>Цель<select value={form.goal} onChange={e => setForm({...form,goal:e.target.value})}><option>Повысить успеваемость</option><option>Закрыть пробелы</option><option>Подготовка к экзамену</option><option>Другое</option></select></label><label className="full">Комментарий<textarea value={form.comment} onChange={e => setForm({...form,comment:e.target.value})} placeholder="Расскажите немного о задаче" /></label></div>{status === "error" && <p className="form-error">Пожалуйста, заполните имя, класс и контакт для связи.</p>}<button className="button button--wide" disabled={status === "loading"}>{status === "loading" ? "Отправляем…" : <>Отправить заявку <Arrow /></>}</button></form>}</div></div>}
  </main>;
}
