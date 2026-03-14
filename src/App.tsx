import { useEffect, useMemo, useState } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
:root{
  --bg:#fffaf5;
  --card:#ffffff;
  --line:#eaded3;
  --ink:#2d2015;
  --muted:#8e7f74;
  --peach:#e86b4f;
  --peach2:#f4a261;
  --sage:#52b788;
  --mint:#e9fbf2;
  --lav:#f4edff;
  --sun:#fff3d5;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body,button,input,textarea,select{font-family:'Nunito',system-ui,sans-serif}
body{margin:0;background:var(--bg);color:var(--ink)}
a{text-decoration:none;color:inherit}
button,input,textarea,select{font:inherit}
button{cursor:pointer}
#root{min-height:100vh}
.container{max-width:1120px;margin:0 auto;padding:0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:26px;box-shadow:0 14px 40px rgba(74,39,14,.08)}
.grid{display:grid;gap:18px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes wag{0%,100%{transform:rotate(0)}25%{transform:rotate(8deg)}75%{transform:rotate(-8deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes spinMeme{0%{transform:perspective(500px) rotateY(0deg)}100%{transform:perspective(500px) rotateY(360deg)}}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes pawDrift{0%{opacity:0;transform:translateY(30px) rotate(-10deg)}20%{opacity:.22}100%{opacity:0;transform:translateY(-150px) rotate(14deg)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 10px 28px rgba(232,107,79,.24)}50%{box-shadow:0 16px 36px rgba(232,107,79,.36)}}
@keyframes jumpToArms{0%{transform:translate(0,0) scale(1)}40%{transform:translate(110px,-82px) scale(1.14)}100%{transform:translate(200px,-28px) scale(1)}}
@keyframes smilePop{0%,60%{transform:scale(.92);opacity:.72}100%{transform:scale(1);opacity:1}}
@keyframes heartBurst{0%{opacity:0;transform:translateY(0) scale(.5)}30%{opacity:1}100%{opacity:0;transform:translateY(-68px) scale(1.15)}}
@keyframes spinCoin{0%{transform:rotate(0)}100%{transform:rotate(1turn)}}
.paws-bg{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.paws-bg span{position:absolute;font-size:24px;opacity:0;animation:pawDrift 9s linear infinite;color:#e9cdbd}
.paws-bg span:nth-child(1){left:7%;bottom:-20px;animation-delay:0s}
.paws-bg span:nth-child(2){left:24%;bottom:-30px;animation-delay:2s}
.paws-bg span:nth-child(3){left:51%;bottom:-10px;animation-delay:5s}
.paws-bg span:nth-child(4){left:70%;bottom:-26px;animation-delay:1.5s}
.paws-bg span:nth-child(5){left:88%;bottom:-14px;animation-delay:3.5s}
.hero{position:relative;overflow:hidden;padding:22px 0 34px;background:linear-gradient(180deg,#fff8ef 0%,#fffdfb 66%,#fffaf5 100%)}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:800;color:var(--muted)}
.hero-grid{display:grid;grid-template-columns:1fr;gap:26px;align-items:center;padding-top:18px}
.hero h1{font-size:52px;line-height:1.02;margin:14px auto 12px;max-width:760px;text-align:center}
.hero p{font-size:17px;line-height:1.75;color:var(--muted);margin:0 auto 18px;max-width:700px;text-align:center}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin:22px 0 16px;justify-content:center}
.btn{border:none;border-radius:16px;padding:14px 20px;font-weight:900;transition:transform .18s ease,opacity .18s ease,box-shadow .18s ease;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.btn:hover{transform:translateY(-1px)}
.btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.btn-primary{color:#fff;background:linear-gradient(135deg,var(--peach),var(--peach2));animation:pulseGlow 2.8s ease infinite}
.btn-secondary{background:#fff;border:2px solid var(--line);color:var(--muted)}
.bullets{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;justify-content:center}
.bullet{padding:9px 13px;background:#fff;border:1px solid var(--line);border-radius:999px;font-size:13px;font-weight:800;color:#5f554d}
.hero-side{position:relative;min-height:430px}
.hero-stage{position:relative;padding:24px;border-radius:30px;background:radial-gradient(circle at top left,#fff 0%,#fff5ea 55%,#fef0e4 100%);border:1px solid var(--line);box-shadow:0 18px 48px rgba(65,28,8,.12);overflow:hidden;height:100%}
.hero-cloud{position:absolute;right:-80px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,#fff5f0 0%, rgba(255,245,240,0) 70%)}
.meme-pack{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:22px}
.pet-pill{position:relative;padding:16px;border-radius:24px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;gap:12px;min-height:110px}
.pet-icon{font-size:44px;filter:drop-shadow(0 5px 10px rgba(0,0,0,.12));flex-shrink:0}
.pet-icon.cat{animation:spinMeme 2.2s linear infinite}
.pet-icon.dog{animation:floaty 1.4s ease infinite}
.pet-icon.bird{animation:bob 1.2s ease infinite}
.pet-icon.hamster{animation:spinCoin 1.4s linear infinite}
.pet-face{display:inline-block;animation:blink 5.8s ease infinite;transform-origin:center}
.pet-pill h4{margin:0 0 3px;font-size:15px}
.pet-pill p{margin:0;font-size:12px;line-height:1.55;color:var(--muted)}

.hero-center{max-width:980px;margin:0 auto;text-align:center}
.hero-cat-wrap{display:flex;align-items:center;justify-content:center;gap:14px;margin:8px auto 16px;max-width:680px}
.hero-cat-spin{font-size:62px;line-height:1;filter:drop-shadow(0 8px 14px rgba(0,0,0,.16));animation:spinMeme 2.2s linear infinite;flex-shrink:0}
.hero-cat-bubble{position:relative;background:#fff;padding:14px 16px;border-radius:20px;border:1px solid var(--line);font-size:14px;font-weight:800;line-height:1.5;color:#5d5249;text-align:left;box-shadow:0 14px 32px rgba(73,38,11,.12)}
.hero-cat-bubble:after{content:'';position:absolute;left:24px;bottom:-7px;width:12px;height:12px;background:#fff;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg)}
.hero-orbit{display:grid;grid-template-columns:1fr minmax(280px,340px) 1fr;grid-template-areas:'. top .' 'left cta right' '. bottom .';gap:14px;align-items:center;max-width:980px;margin:26px auto 6px}
.hero-orbit .scenario{min-height:136px;text-align:left}
.hero-orbit .scenario:nth-child(1){grid-area:top}
.hero-orbit .scenario:nth-child(2){grid-area:left}
.hero-orbit .scenario:nth-child(3){grid-area:right}
.hero-orbit .scenario:nth-child(4){grid-area:bottom}
.hero-cta-center{grid-area:cta;display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px}
.hero-cta-center .btn-primary{width:100%;justify-content:center;padding:18px 28px;font-size:17px}
.hero-cta-center .micro{font-size:12px;color:var(--muted);font-weight:800}

.section{padding:62px 0;position:relative;z-index:1}
.section-title{text-align:center;max-width:760px;margin:0 auto 28px}
.section-title h2{font-size:34px;line-height:1.1;margin:0 0 8px}
.section-title p{margin:0;color:var(--muted);font-size:15px;line-height:1.75}
.scenarios{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.scenario{padding:18px;border-radius:24px;border:1px solid var(--line);background:#fff;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;cursor:pointer;text-align:left}
.scenario:hover{transform:translateY(-3px);border-color:#efb49d;box-shadow:0 16px 40px rgba(89,37,12,.08)}
.scenario .emoji{font-size:30px;margin-bottom:8px;display:block}
.scenario h3{font-size:16px;margin:0 0 6px}
.scenario p{margin:0;color:var(--muted);font-size:13px;line-height:1.65}
.how-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.how-card{padding:20px 18px;text-align:center}
.how-card .num{width:42px;height:42px;border-radius:999px;background:linear-gradient(135deg,var(--peach),var(--peach2));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;margin:0 auto 10px}
.how-card p{margin:0;color:var(--muted);font-size:14px;line-height:1.7}
.reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.review{padding:20px;background:#fff;border:1px solid var(--line);border-radius:24px}
.review p{margin:0 0 14px;color:#5b514a;line-height:1.72;font-size:14px}
.review small{color:var(--muted);font-weight:800}
.form-shell{max-width:760px;margin:0 auto;display:block}
.form-card{padding:20px}
.form-topbar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
.back{background:none;border:none;padding:0;color:var(--muted);font-weight:900}
.progress{height:8px;background:#f0e7de;border-radius:999px;overflow:hidden}
.progress>span{display:block;height:100%;background:linear-gradient(135deg,var(--peach),var(--peach2));border-radius:999px;transition:width .3s ease}
.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:12px 0 20px}
.step-dot{text-align:center}
.step-dot .ball{width:34px;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;margin:0 auto 4px;background:#f2ece6;color:#b8aba0;font-size:14px;font-weight:900}
.step-dot.active .ball,.step-dot.done .ball{background:linear-gradient(135deg,var(--peach),var(--peach2));color:#fff}
.step-dot span{font-size:11px;color:#b8aba0;font-weight:800}
.step-dot.active span{color:var(--peach)}
.fld{margin-bottom:14px}
.fld label{display:block;margin-bottom:6px;font-size:13px;font-weight:900;color:#65584d}
.fld small{display:block;margin-top:5px;color:var(--muted);font-size:11px;line-height:1.5}
.err{margin-top:6px;color:#d94b2e;font-size:12px;font-weight:800}
.input,.textarea,.select{width:100%;padding:13px 14px;border-radius:16px;border:1.5px solid var(--line);background:#fff;outline:none;color:var(--ink)}
.textarea{min-height:96px;resize:vertical;line-height:1.6}
.input:focus,.textarea:focus,.select:focus{border-color:#ef9e85;box-shadow:0 0 0 3px rgba(232,107,79,.09)}
.pet-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.pet-choice{padding:14px 10px;border-radius:18px;border:1.5px solid var(--line);background:#fff;text-align:center}
.pet-choice.active{border-color:var(--peach);background:#fff3ef}
.pet-choice div:first-child{font-size:32px;margin-bottom:5px}
.pet-choice.active .dog-badge{animation:wag 1.2s ease infinite;display:inline-block}
.pet-choice.active .cat-badge{animation:spinMeme 2s linear infinite;display:inline-block}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:10px 13px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:#6a5f56;font-weight:800;font-size:13px}
.chip.active{background:#fff0ea;border-color:var(--peach);color:var(--peach)}
.stepper{display:flex;align-items:center;gap:10px;background:#fff8f4;border:1px solid var(--line);padding:8px 10px;border-radius:16px}
.stepper button{width:34px;height:34px;border-radius:999px;border:1.5px solid var(--line);background:#fff;font-weight:900;color:#7e7268}
.stepper strong{flex:1;text-align:center;font-size:22px;color:var(--peach)}
.side-card{padding:18px;position:sticky;top:18px}
.side-card h3{margin:0 0 10px;font-size:18px}
.side-card p{margin:0 0 12px;color:var(--muted);font-size:14px;line-height:1.7}
.fact-list{display:grid;gap:10px;margin-top:10px}
.fact{padding:12px 13px;border-radius:18px;background:#fff;border:1px solid var(--line);font-size:13px;line-height:1.55;color:#5c524b}
.fact strong{display:block;color:var(--ink);margin-bottom:3px}
.mascot{position:sticky;top:20px;margin-top:14px;background:linear-gradient(160deg,#fff,#fff7ef);border:1px solid var(--line);border-radius:22px;padding:16px;text-align:center}
.mascot .pet{font-size:60px;display:inline-block;filter:drop-shadow(0 6px 12px rgba(0,0,0,.12));margin-bottom:6px}
.mascot .pet.cat{animation:spinMeme 2.2s linear infinite}
.mascot .pet.dog{animation:floaty 1.4s ease infinite}
.mascot .pet.bird{animation:bob 1.1s ease infinite}
.mascot .bubble{position:relative;background:#fff;padding:10px 12px;border-radius:16px;border:1px solid var(--line);font-size:13px;font-weight:800;color:#5d5249;line-height:1.6}
.mascot .bubble:after{content:'';position:absolute;bottom:-7px;left:26px;width:12px;height:12px;background:#fff;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg)}
.notice{padding:13px 14px;border-radius:18px;border:1px solid #f0c5b4;background:#fff6f2;color:#7b543e;font-size:13px;line-height:1.65}
.mascot-floating{position:fixed;right:18px;bottom:18px;z-index:80;display:flex;flex-direction:column;align-items:flex-end;gap:8px;max-width:240px}
.mascot-floating .bubble{position:relative;background:#fff;padding:12px 14px;border-radius:18px;border:1px solid var(--line);font-size:13px;font-weight:800;color:#5d5249;line-height:1.55;box-shadow:0 12px 32px rgba(73,38,11,.14)}
.mascot-floating .bubble:after{content:'';position:absolute;bottom:-7px;right:24px;width:12px;height:12px;background:#fff;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg)}
.mascot-floating .pet{font-size:62px;display:inline-block;filter:drop-shadow(0 8px 14px rgba(0,0,0,.18));user-select:none;transition:left .35s ease,top .35s ease,transform .25s ease;position:fixed;left:calc(var(--mx, 82) * 1vw);top:calc(var(--my, 68) * 1vh)}
.mascot-floating .pet.cat{animation:spinMeme 2.2s linear infinite}
.mascot-floating .pet.dog{animation:floaty 1.4s ease infinite}
.mascot-floating .pet.bird{animation:bob 1.1s ease infinite}
.mascot-floating .pet.rabbit{animation:floaty 1.2s ease infinite}
.mascot-floating .pet.hamster{animation:spinCoin 1.4s linear infinite}
.mascot-floating .pet.other{animation:bob 1.6s ease infinite}
.success-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:linear-gradient(180deg,#fff9f1 0%,#fff3eb 100%)}
.success-card{max-width:760px;width:100%;padding:28px}
.success-stage{position:relative;height:260px;border-radius:28px;background:linear-gradient(180deg,#fff 0%,#fff6ec 100%);border:1px solid var(--line);overflow:hidden;margin-bottom:18px}
.success-stage .ground{position:absolute;left:0;right:0;bottom:0;height:72px;background:linear-gradient(180deg,#e7f8ee,#d8f1e3)}
.owner,.sitter{position:absolute;bottom:48px;text-align:center}
.owner{left:48px}.sitter{right:42px}
.owner .face,.sitter .face{font-size:72px;display:block;animation:smilePop .9s ease forwards}
.owner small,.sitter small{display:block;margin-top:6px;color:var(--muted);font-weight:800}
.pet-jump{position:absolute;left:118px;bottom:56px;font-size:62px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.18));animation:jumpToArms 1.35s cubic-bezier(.27,.9,.34,1) forwards}
.hearts span{position:absolute;right:138px;bottom:130px;font-size:24px;opacity:0;animation:heartBurst 1.6s ease infinite}
.hearts span:nth-child(2){animation-delay:.18s}
.hearts span:nth-child(3){animation-delay:.38s}
.summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}
.summary .item{padding:14px;border-radius:20px;background:#fff;border:1px solid var(--line)}
.summary .item strong{display:block;color:var(--muted);font-size:12px;margin-bottom:3px}
.footer{padding:32px 0 50px;text-align:center;color:var(--muted);font-size:12px}
@media (max-width: 960px){
  .hero-grid,.form-shell{grid-template-columns:1fr}
  .hero h1{font-size:40px}
  .hero-side{min-height:auto}
  .scenarios{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hero-orbit{grid-template-columns:1fr;grid-template-areas:"top" "left" "cta" "right" "bottom";max-width:520px}
  .how-grid,.reviews{grid-template-columns:1fr}
}
@media (max-width: 680px){
  .container{padding:0 14px}
  .hero h1{font-size:33px}
  .hero-cat-wrap{flex-direction:column;align-items:center}
  .hero-cat-bubble{text-align:center}
  .hero-cat-bubble:after{left:50%;transform:translateX(-50%) rotate(45deg)}
  .meme-pack,.pet-grid,.summary{grid-template-columns:1fr}
  .scenarios{grid-template-columns:1fr}
  .steps{gap:4px}
  .step-dot span{font-size:9px}
  .owner{left:16px}.sitter{right:14px}
  .pet-jump{left:74px;font-size:54px}
  .mascot-floating{right:10px;bottom:10px;max-width:170px}
  .mascot-floating .bubble{font-size:12px;padding:10px 12px}
  .mascot-floating .pet{font-size:52px}
}
`;

const INIT = {
  petName: '', petType: '', breed: '', gender: '', age: 3, weight: 5,
  vaccinated: 'yes', neutered: '', chronic: '', allergies: [], allergyCustom: '',
  medsText: '', lastVet: '', vetName: '', vetPhone: '', noMeds: false, serviceType: 'boarding', address: '', walks: 2, visits: 1,
  birdCare: '', rabbitCare: '', feedTimes: [], foodType: '', foodBrand: '', forbidden: '',
  habits: '', sleep: 'couch', dateFrom: '', dateTo: '', reports: ['photo'], reportFreq: 1,
  wishes: '', ownerName: '', ownerPhone: '', ownerEmail: '', reachBy: 'telegram',
  emergName: '', emergRel: '', emergPhone: '', saveConsent: false,
};

const SAVE_KEY = 'pawsitter-v2';
const PETS = [
  { value: 'dog', emoji: '🐕', title: 'Собака', quip: 'Нужны прогулки, игры и понятный ритм дня' },
  { value: 'cat', emoji: '🐈', title: 'Кошка', quip: 'Чаще важны визиты, лоток и спокойная компания' },
  { value: 'bird', emoji: '🦜', title: 'Птица', quip: 'Корм, вода, клетка и безопасный режим' },
  { value: 'rabbit', emoji: '🐇', title: 'Кролик', quip: 'Сено, простор и бережный уход' },
  { value: 'hamster', emoji: '🐹', title: 'Хомяк', quip: 'Корм, вода и тихий ритуал без суеты' },
  { value: 'other', emoji: '🐾', title: 'Другой питомец', quip: 'Подстроим форму под ваш случай' },
];

const PET_MAP: Record<string, string> = Object.fromEntries(PETS.map((pet) => [pet.value, pet.emoji]));
const PET_LABEL: Record<string, string> = Object.fromEntries(PETS.map((pet) => [pet.value, pet.title]));
const STEP_META = [
  { icon: '🐾', title: 'Питомец' },
  { icon: '🧸', title: 'Уход' },
  { icon: '💊', title: 'Медицина' },
  { icon: '📅', title: 'Даты' },
  { icon: '📞', title: 'Контакты' },
];
const TIME_SLOTS = ['07:00', '08:00', '09:00', '12:00', '18:00', '20:00', '22:00'];
const REVIEW_DATA = [
  { name: 'Анна', pet: 'кот Плюш', text: 'Уехала на 9 дней и впервые не проверяла телефон в панике каждые полчаса. Мне присылали фото, а Плюш выглядел так, будто это его собственный spa-курорт.', city: 'Таллин' },
  { name: 'Игорь', pet: 'собака Руна', text: 'Очень зашла идея “ситтер под характер”. У нас тревожная собака, и ей правда нужен не просто человек с миской, а спокойный и надёжный спутник.', city: 'Рига' },
  { name: 'Марина', pet: 'попугай Киви', text: 'Для птиц почти никто не пишет внятно, а здесь сразу понятно, что учитываются клетка, режим и безопасность. Это редкость, честно.', city: 'Вильнюс' },
];
const SCENARIOS = [
  { icon: '✈️', title: 'Уезжаю в отпуск', text: 'Питомцу нужен человек, который присмотрит, покормит и пришлёт фото, пока вы ловите свой закат.', petType: 'cat', serviceType: 'inhome' },
  { icon: '💼', title: 'Командировка', text: 'Когда поездка короткая, а стресс от организации длиннее самой поездки.', petType: 'dog', serviceType: 'boarding' },
  { icon: '🕒', title: 'Длинный рабочий день', text: 'Собаку нужно выгулять, кошку навестить, а вас ещё никто не клонировал.', petType: 'dog', serviceType: 'inhome' },
  { icon: '🏡', title: 'Питомец не любит переезды', text: 'Остаётся дома, а забота приходит к нему сама. Никаких драм и чемоданов.', petType: 'cat', serviceType: 'inhome' },
];

function Card({ className = '', children }: any) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Field({ label, children, hint, error }: any) {
  return (
    <div className="fld">
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? <small>{hint}</small> : null}
      {error ? <div className="err">{error}</div> : null}
    </div>
  );
}

function ChipGroup({ value, onChange, options, multi = false }: { value: any; onChange: (v: any) => void; options: { value: string; label: string }[]; multi?: boolean }) {
  const current = Array.isArray(value) ? value : [];
  return (
    <div className="chips">
      {options.map((option) => {
        const active = multi ? current.includes(option.value) : value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`chip ${active ? 'active' : ''}`}
            onClick={() => {
              if (multi) {
                onChange(active ? current.filter((item) => item !== option.value) : [...current, option.value]);
              } else {
                onChange(option.value);
              }
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Stepper({ value, setValue, min, max }: { value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => setValue(Math.max(min, value - 1))}>−</button>
      <strong>{value}</strong>
      <button type="button" onClick={() => setValue(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function formatPhone(raw: string) {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 8);
  const d = digits.slice(8, 10);
  return [a, b, c, d].filter(Boolean).join('-');
}

function Hero({ onStart, onSitter }: { onStart: (cfg?: any) => void; onSitter: () => void }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-center">
          <span className="hero-badge">🐾 Забота без суеты, лишних экранов и тревожного «а всё ли я указал?»</span>
          <div className="hero-cat-wrap">
            <div className="hero-cat-spin">🐈</div>
            <div className="hero-cat-bubble">Не обращайте внимания. Это не я вращаюсь — это вселенная вокруг меня. Но если хотите, сделаем вместе с тобой тыгыдык по заявке и выберем питомца.</div>
          </div>
          <h1>Ваш питомец дома. Но не один.</h1>
          <p>Оставьте короткую заявку — и мы подберём заботливого ситтера так, чтобы питомцу было спокойно, а вам не пришлось вести отдельную спецоперацию в голове.</p>

          <div className="hero-orbit">
            <button className="scenario" type="button" onClick={() => onStart({ petType: 'cat', serviceType: 'inhome' })}>
              <span className="emoji">✈️</span>
              <h3>Уезжаю в отпуск</h3>
              <p>Питомец остаётся под присмотром, пока вы переключаетесь на отдых, а не на тревожное обновление чатов.</p>
            </button>
            <button className="scenario" type="button" onClick={() => onStart({ petType: 'dog', serviceType: 'inhome' })}>
              <span className="emoji">💼</span>
              <h3>Командировка или длинный день</h3>
              <p>Когда рабочий график плотный, а у собаки — свои взгляды на прогулки, еду и жизнь вообще.</p>
            </button>
            <div className="hero-cta-center">
              <button className="btn btn-primary" onClick={() => onStart()}>Оставить заявку 🐾</button>
              <div className="micro">Нажмите на кнопку или на любой повод вокруг — анкета откроется сразу.</div>
              <button className="btn btn-secondary" onClick={onSitter}>Стать ситтером</button>
            </div>
            <button className="scenario" type="button" onClick={() => onStart({ petType: 'dog', serviceType: 'inhome' })}>
              <span className="emoji">🕒</span>
              <h3>Длинный рабочий день</h3>
              <p>Нужно, чтобы кто-то покормил, навестил, выгулял и прислал фото, пока вы заняты человеческими квестами.</p>
            </button>
            <button className="scenario" type="button" onClick={() => onStart({ petType: 'cat', serviceType: 'inhome' })}>
              <span className="emoji">🏡</span>
              <h3>Питомец не любит переезды</h3>
              <p>Он остаётся у себя дома, а забота приходит к нему сама. Без чемоданов, драмы и лишнего стресса.</p>
            </button>
          </div>

          <div className="bullets">
            <span className="bullet">📸 Фото и видео-отчёты</span>
            <span className="bullet">🏠 Передержка или визиты домой</span>
            <span className="bullet">💛 Подбор под характер питомца</span>
            <span className="bullet">🧾 Заявка без лишней боли</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Landing({ onStart, onSitter }: { onStart: (cfg?: any) => void; onSitter: () => void }) {
  return (
    <div>
      <Hero onStart={onStart} onSitter={onSitter} />

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="section-title">
            <h2>Как это работает</h2>
            <p>Без цифровых квестов, где нужно страдать. Всё коротко, понятно и дружелюбно.</p>
          </div>
          <div className="how-grid">
            {[
              ['1', 'Расскажите о питомце', 'Форма подстраивается под вид животного — кошке не суём прогулки, птице не предлагаем поводок.'],
              ['2', 'Уточните ритм ухода', 'Корм, привычки, где спит, нужен ли врач, как часто присылать отчёты и что правда важно именно вашему зверю.'],
              ['3', 'Получите спокойствие', 'Заявка прилетает, ситтер подбирается, а в финале питомец уже прыгает в заботливые руки.'],
            ].map(([num, title, text]) => (
              <Card key={num} className="how-card">
                <div className="num">{num}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="section-title">
            <h2>Несколько голосов людей, которым это уже сняло тревогу</h2>
            <p>Нормальные человеческие истории, а не картонная фраза “всё было на высшем уровне”.</p>
          </div>
          <div className="reviews">
            {REVIEW_DATA.map((review) => (
              <div className="review" key={review.name + review.pet}>
                <div style={{ marginBottom: 10 }}>⭐⭐⭐⭐⭐</div>
                <p>“{review.text}”</p>
                <small>{review.name} · {review.pet} · {review.city}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="footer container">
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)', marginBottom: 6 }}>🐾 PawSitter</div>
        Сделано с теплом, дисциплиной и небольшим количеством мемной энергии.
      </div>
    </div>
  );
}


const DIALOGUES = {
  defaultCat: [
    'Не обращайте внимания. Это не я вращаюсь — это вселенная вокруг меня.',
    'Кручусь-верчусь, уровень сервиса оценить хочу.',
    'Всё нормально. Я просто в режиме красивой драматичности.',
    'Мур. Продолжайте. Я уже слегка заинтересован.',
    'Пока что выглядит прилично. Подозрительно, но прилично.'
  ],
  hoverCat: [
    'Ой. Лапки убрали.',
    'Вы меня не поймаете. Я тут на духовной скорости.',
    'Погладить меня решили? Смело.',
    'Слишком резкое проявление любви. Я перееду в другой угол.',
    'Попытка контакта зафиксирована. Ухожу красиво.'
  ],
  cat: [
    'Отлично. Один пушистый начальник зарегистрирован.',
    'Хорошо. Значит в доме уже есть маленький домашний тиран.',
    'А, кошка. Наконец-то серьёзная клиентура.',
    'Принято. Готовьте диван, тишину и уважение к личным границам.',
    'Кошка отмечена. Теперь всё официально.'
  ],
  dog: [
    'СОБАКА DETECTED. Сейчас будет много радости и лап.',
    'О, ну всё. Кто-то будет очень сильно любить всех подряд.',
    'Принято. Запускаю режим «гулять, бегать, обожать».',
    'Хорошо. Значит на сайте теперь официально есть энергия.',
    'Собака отмечена. Мячик где?'
  ],
  bird: [
    'Птица? Значит будильник теперь с крыльями.',
    'Чик-чирик, важный клиент на связи.',
    'Принято. Кто-то тут любит быть громким и красивым одновременно.',
    'Хорошо. Пернатый режим активирован.',
    'Птица отмечена. Готовим корм и уважение к вокалу.'
  ],
  rabbit: [
    'Кролик. Срочно проверяем безопасность проводов.',
    'Принято. Кто-то будет очень мило устраивать хаос.',
    'Хорошо. Вижу впереди уши, скорость и исчезающую зелень.',
    'Кролик отмечен. Морковь заносите аккуратно.',
    'О, пушистая молния на минималках.'
  ],
  hamster: [
    'Хомяк. Маленький, а логистика как у склада.',
    'Принято. Колесо уже морально раскручивается.',
    'Хорошо. Кто-то здесь очень серьёзно относится к семечкам.',
    'Хомяк отмечен. Запасы еды под охраной.',
    'Крошечный клиент, большие амбиции.'
  ],
  other: [
    'Необычный клиент отмечен. Мне уже интересно.',
    'Так. Здесь будет особый подход. Это я уважаю.',
    'Хорошо. Кто-то идёт вне шаблонов.',
    'Отлично. Индивидуальная история пошла.',
    'Люблю, когда клиент с сюрпризом.'
  ],
  food: [
    'Так. Корм записал. А ночные перекусы учтены?',
    'Интересный пункт. Корм обычный… или тот, за который я вас прощу?',
    'Отлично. Я так понимаю, дегустация входит в обязанности ситтера.',
    'Принято. Но если корм невкусный — я буду смотреть осуждающе.',
    'Хорошо. Значит голодный бунт откладывается.',
    'Корм есть. Уже звучит как план.',
    'Так, питание пошло. Начинаю верить в эту операцию.'
  ],
  couch: [
    'Диван отмечен. Я разрешу ситтеру иногда там сидеть.',
    'Хороший диван? Мне нужен мягкий. И желательно ваш.',
    'Записал: диван. Отлично. Территория уже почти моя.',
    'Диван принят. Осталось уточнить — где будет спать ситтер.',
    'Диван — это важно. Без него я превращаюсь в очень недовольного кота.',
    'Отлично. Стратегическая точка отдыха обнаружена.',
    'Мягкий диван? Так, сайт начинает мне нравиться.'
  ],
  sleep: [
    'Домик отмечен. Личный угол — дело серьёзное.',
    'Лежанка принята. Комфортный минимализм — тоже стиль.',
    'Записал место отдыха. Это уже разговор по делу.',
    'Хорошо. Значит будет где красиво свернуться.'
  ],
  meds: [
    'О. Таблетки. Начинается игра «поймай меня сначала».',
    'Лекарства отмечены. Я уже подозрительно смотрю.',
    'Интересно. Таблетка будет спрятана в еде?',
    'Ну всё. Пошла серьёзная сюжетная линия.',
    'Так. Медицинский режим. Я заранее не согласен, но продолжайте.'
  ],
  vet: [
    'Так, клиника есть. Уже спокойнее даже мне.',
    'Вижу организованных людей. Редкость.',
    'Хорошо. Здесь, похоже, умеют помнить важное.',
    'Записал врача. Это серьёзный подход, без шуток.',
    'Очень хорошо. Паника не входит в план.'
  ],
  walks: [
    'Прогулки есть. Радость официально утверждена.',
    'Так. Гулять будем серьёзно.',
    'Принято. У собаки будет карьера на свежем воздухе.',
    'Хороший график. Я бы не пошёл, но поддерживаю.',
    'Мячик морально готов.'
  ],
  dates: [
    'Даты стоят. Операция «всё под контролем» началась.',
    'Хорошо. План есть — уже красиво.',
    'Так, календарь собран. Продолжаем без суеты.',
    'Даты приняты. Мир становится чуть организованнее.',
    'Отлично. Теперь это не хаос, а сценарий.'
  ],
  final: [
    'Так… миска, диван, врач. Картина становится обнадёживающей.',
    'Ну всё. Похоже, вы реально стараетесь.',
    'Я почти перестал придираться. Почти.',
    'Анкета выглядит солидно. Даже неловко шутить.',
    'Выглядит очень даже прилично.'
  ],
  sent: [
    'Ну всё. Заявка улетела. Можно выдыхать.',
    'Хм. Этот человек выглядит достаточно тёплым.',
    'Ладно. Я одобряю этого ситтера.',
    'Красиво. Даже придраться пока не к чему.',
    'Пусть теперь всё идёт по плану и по миске.'
  ]
};

function pick<T>(arr:T[], seed:number){ return arr[seed % arr.length]; }

function PetMascot({ form, cue, finalMode = false }: { form: any; cue?: { key: string; nonce: number } | null; finalMode?: boolean }) {
  const petType = form.petType || 'cat';
  const pet = PET_MAP[petType] || '🐈';
  const petClass = petType || 'cat';
  const [seed, setSeed] = useState(0);
  const [pos, setPos] = useState({ x: 82, y: 68 });
  const [hoverMsg, setHoverMsg] = useState('');
  const [eventMsg, setEventMsg] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!cue?.key) return;
    const map: Record<string, string[]> = {
      petType: (DIALOGUES as any)[petType] || DIALOGUES.other,
      food: DIALOGUES.food,
      couch: DIALOGUES.couch,
      sleep: DIALOGUES.sleep,
      meds: DIALOGUES.meds,
      vet: DIALOGUES.vet,
      walks: DIALOGUES.walks,
      dates: DIALOGUES.dates,
      final: DIALOGUES.final,
      intro: DIALOGUES.defaultCat,
    };
    const arr = map[cue.key] || ((DIALOGUES as any)[petType] || DIALOGUES.defaultCat);
    setEventMsg(pick(arr, cue.nonce || seed));
    const t = setTimeout(() => setEventMsg(''), 3200);
    return () => clearTimeout(t);
  }, [cue, petType, seed]);

  const message = useMemo(() => {
    if (hoverMsg) return hoverMsg;
    if (eventMsg) return eventMsg;
    if (finalMode) return pick(DIALOGUES.sent, seed);
    if (!form.petType) return pick(DIALOGUES.defaultCat, seed);
    return pick((DIALOGUES as any)[petType] || DIALOGUES.other, seed);
  }, [form.petType, seed, hoverMsg, eventMsg, finalMode, petType]);

  useEffect(() => {
    if (!hoverMsg) return;
    const t = setTimeout(() => setHoverMsg(''), 2600);
    return () => clearTimeout(t);
  }, [hoverMsg]);

  function flee() {
    const x = 12 + Math.random() * 72;
    const y = 18 + Math.random() * 58;
    setPos({ x, y });
    if (!form.petType || petType === 'cat') setHoverMsg(pick(DIALOGUES.hoverCat, seed + 1));
  }

  return (
    <div className="mascot-floating" style={{ ['--mx' as any]: pos.x, ['--my' as any]: pos.y }}>
      <div className="bubble">{message}</div>
      <div className={`pet ${petClass}`} onMouseEnter={flee}>{pet}</div>
    </div>
  );
}

function OwnerForm({ form, setForm, onBack, onSubmit, busy, submitError, mascotCue, setMascotCue }: { form: any; setForm: any; onBack: () => void; onSubmit: () => void; busy: boolean; submitError: string; mascotCue: any; setMascotCue: (cue: any) => void }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (form.saveConsent) {
      const safe = {
        petName: form.petName, petType: form.petType, breed: form.breed, gender: form.gender, age: form.age,
        weight: form.weight, vaccinated: form.vaccinated, neutered: form.neutered, serviceType: form.serviceType,
        walks: form.walks, visits: form.visits, birdCare: form.birdCare, rabbitCare: form.rabbitCare,
        foodType: form.foodType, foodBrand: form.foodBrand, forbidden: form.forbidden, habits: form.habits,
        sleep: form.sleep, reports: form.reports, reportFreq: form.reportFreq, wishes: form.wishes,
        chronic: form.chronic, medsText: form.medsText, lastVet: form.lastVet, vetName: form.vetName, vetPhone: form.vetPhone
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(safe));
    }
  }, [form]);

  function cueFor(key: string, value: any) {
    if (key === 'petType' && value) return 'petType';
    if (['foodType', 'foodBrand', 'forbidden'].includes(key) && value) return 'food';
    if (key === 'sleep' && value) return value === 'couch' || value === 'bed' ? 'couch' : 'sleep';
    if (['chronic', 'medsText', 'allergyCustom'].includes(key) && value) return 'meds';
    if (['lastVet', 'vetName', 'vetPhone'].includes(key) && value) return 'vet';
    if (key === 'walks' && form.petType === 'dog') return 'walks';
    if ((key === 'dateFrom' || key === 'dateTo') && value) return 'dates';
    if (['ownerName', 'ownerPhone', 'emergName', 'emergPhone'].includes(key) && value) return 'final';
    return '';
  }

  function update(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    const cueKey = cueFor(key, value);
    if (cueKey) setMascotCue({ key: cueKey, nonce: Date.now() + Math.random() });
  }

  function validateCurrentStep() {
    const nextErrors: Record<string, string> = {};
    if (step === 1) {
      if (!form.petName.trim()) nextErrors.petName = 'Нужно имя питомца';
      if (!form.petType) nextErrors.petType = 'Выберите вид питомца';
    }
    if (step === 4) {
      if (!form.dateFrom) nextErrors.dateFrom = 'Укажите дату начала';
      if (!form.dateTo) nextErrors.dateTo = 'Укажите дату окончания';
    }
    if (step === 5) {
      if (!form.ownerName.trim()) nextErrors.ownerName = 'Нужно имя владельца';
      if (String(form.ownerPhone || '').replace(/\D/g, '').length < 10) nextErrors.ownerPhone = 'Нужно 10 цифр номера';
      if (String(form.emergPhone || '').replace(/\D/g, '').length < 10) nextErrors.emergPhone = 'Нужно 10 цифр номера';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function continueFlow() {
    if (!validateCurrentStep()) return;
    if (step < 5) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 3) setMascotCue({ key: 'meds', nonce: Date.now() + Math.random() });
      if (nextStep === 4) setMascotCue({ key: 'dates', nonce: Date.now() + Math.random() });
      if (nextStep === 5) setMascotCue({ key: 'final', nonce: Date.now() + Math.random() });
      return;
    }
    onSubmit();
  }

  return (
    <section className="section" style={{ paddingTop: 18 }}>
      <div className="container">
        <div className="form-shell">
          <PetMascot form={form} cue={mascotCue} />
          <Card className="form-card">
            <div className="form-topbar">
              <button className="back" type="button" onClick={onBack}>← На главную</button>
              <strong style={{ color: 'var(--peach)' }}>🐾 Заявка PawSitter</strong>
            </div>
            <div className="progress"><span style={{ width: `${(step / 5) * 100}%` }} /></div>
            <div className="steps">
              {STEP_META.map((item, index) => {
                const number = index + 1;
                const cls = number === step ? 'active' : number < step ? 'done' : '';
                return (
                  <div className={`step-dot ${cls}`} key={item.title}>
                    <div className="ball">{number < step ? '✓' : item.icon}</div>
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </div>

            {submitError ? <div className="notice" style={{ marginBottom: 14 }}>{submitError}</div> : null}

            {step === 1 ? (
              <div style={{ animation: 'fadeUp .25s ease' }}>
                <h2 style={{ marginTop: 0 }}>Кто у нас сегодня герой?</h2>
                <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Начинаем мягко: кто ваш питомец, как его зовут и какой у него базовый профиль.</p>
                <Field label="Кличка питомца" error={errors.petName}>
                  <input className="input" value={form.petName} onChange={(e) => update('petName', e.target.value)} placeholder="Барсик, Руна, Киви..." />
                </Field>
                <Field label="Вид питомца" error={errors.petType}>
                  <div className="pet-grid">
                    {PETS.map((pet) => {
                      const active = form.petType === pet.value;
                      const extraClass = pet.value === 'dog' ? 'dog-badge' : pet.value === 'cat' ? 'cat-badge' : '';
                      return (
                        <button key={pet.value} type="button" className={`pet-choice ${active ? 'active' : ''}`} onClick={() => update('petType', pet.value)}>
                          <div className={extraClass}>{pet.emoji}</div>
                          <strong style={{ display: 'block', marginBottom: 4 }}>{pet.title}</strong>
                          <small style={{ color: 'var(--muted)', lineHeight: 1.4 }}>{pet.quip}</small>
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Порода или тип">
                    <input className="input" value={form.breed} onChange={(e) => update('breed', e.target.value)} placeholder="Например: мейн-кун, корги, волнистый попугай" />
                  </Field>
                  <Field label="Пол">
                    <ChipGroup value={form.gender} onChange={(v) => update('gender', v)} options={[{ value: 'male', label: '♂ Мальчик' }, { value: 'female', label: '♀ Девочка' }]} />
                  </Field>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label={`Возраст: ${form.age} ${form.age === 1 ? 'год' : form.age < 5 ? 'года' : 'лет'}`}>
                    <input className="input" type="range" min={0} max={20} step={1} value={form.age} onChange={(e) => update('age', Number(e.target.value))} />
                  </Field>
                  <Field label={`Вес: ${form.weight} кг`}>
                    <input className="input" type="range" min={1} max={70} step={1} value={form.weight} onChange={(e) => update('weight', Number(e.target.value))} />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div style={{ animation: 'fadeUp .25s ease' }}>
                <h2 style={{ marginTop: 0 }}>Уход без глупостей</h2>
                <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Форма подстраивается под питомца: кошке не навязываем поводок, птице — количество прогулок, а место сна обсуждаем только здесь.</p>
                <Field label="Тип услуги">
                  <ChipGroup value={form.serviceType} onChange={(v) => update('serviceType', v)} options={[{ value: 'boarding', label: '🏡 Передержка у ситтера' }, { value: 'inhome', label: '🚪 Визиты к вам домой' }]} />
                </Field>
                {form.serviceType === 'inhome' ? (
                  <Field label="Адрес питомца" hint="Нужно только если ситтер будет приходить домой.">
                    <input className="input" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Улица, дом, квартира, важные детали" />
                  </Field>
                ) : null}
                <Field label="Чем кормим">
                  <ChipGroup value={form.foodType} onChange={(v) => update('foodType', v)} options={[{ value: 'dry', label: '🥣 Сухой корм' }, { value: 'wet', label: '🥫 Влажный корм' }, { value: 'mixed', label: '🍽 Смешанный' }, { value: 'custom', label: '🌿 Особый рацион' }]} />
                </Field>
                <Field label="Марка / описание корма">
                  <input className="input" value={form.foodBrand} onChange={(e) => update('foodBrand', e.target.value)} placeholder="Например: Royal Canin / домашний рацион / смесь зерна" />
                </Field>
                <Field label="Важные ограничения">
                  <input className="input" value={form.forbidden} onChange={(e) => update('forbidden', e.target.value)} placeholder="Что нельзя давать, чего боится, чего лучше избегать" />
                </Field>
                <Field label="Время кормлений">
                  <ChipGroup value={form.feedTimes} onChange={(v) => update('feedTimes', v)} options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))} multi />
                </Field>

                {form.petType === 'dog' ? (
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Field label={`Прогулок в день: ${form.walks}`} hint="Собакам это обычно критично.">
                      <Stepper value={form.walks} setValue={(v) => update('walks', v)} min={1} max={6} />
                    </Field>
                    <Field label="Характер на прогулке">
                      <input className="input" value={form.habits} onChange={(e) => update('habits', e.target.value)} placeholder="Тянет поводок, любит мяч, тревожится при громких звуках" />
                    </Field>
                  </div>
                ) : null}

                {form.petType === 'cat' ? (
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Field label={`Визитов в день: ${form.visits}`} hint="Для кошек чаще логичнее визиты, а не прогулки.">
                      <Stepper value={form.visits} setValue={(v) => update('visits', v)} min={1} max={4} />
                    </Field>
                    <Field label="Кошачьи особенности">
                      <input className="input" value={form.habits} onChange={(e) => update('habits', e.target.value)} placeholder="Лоток, любимый плед, прячется при гостях, любит сидеть у окна" />
                    </Field>
                  </div>
                ) : null}

                {form.petType === 'bird' ? (
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Field label="Уход за птицей">
                      <select className="select" value={form.birdCare} onChange={(e) => update('birdCare', e.target.value)}>
                        <option value="">Выберите важный сценарий</option>
                        <option value="basic">Корм, вода, клетка</option>
                        <option value="social">Нужно общение и мягкий контакт</option>
                        <option value="sensitive">Чувствительна к шуму и смене ритма</option>
                      </select>
                    </Field>
                    <Field label="Что важно помнить">
                      <input className="input" value={form.habits} onChange={(e) => update('habits', e.target.value)} placeholder="Накрывать клетку на ночь, не ставить у окна, не пугать резкими звуками" />
                    </Field>
                  </div>
                ) : null}

                {(form.petType === 'rabbit' || form.petType === 'hamster') ? (
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Field label="Режим ухода">
                      <select className="select" value={form.rabbitCare} onChange={(e) => update('rabbitCare', e.target.value)}>
                        <option value="">Выберите формат</option>
                        <option value="basic">Корм, вода, чистота</option>
                        <option value="play">Нужен короткий контакт и наблюдение</option>
                        <option value="sensitive">Чувствительный питомец, нужна тишина</option>
                      </select>
                    </Field>
                    <Field label="Что любит / чего боится">
                      <input className="input" value={form.habits} onChange={(e) => update('habits', e.target.value)} placeholder="Любимое сено, не трогать днём, не шуметь рядом" />
                    </Field>
                  </div>
                ) : null}

                {!['dog', 'cat', 'bird', 'rabbit', 'hamster'].includes(form.petType) ? (
                  <Field label="Особенности ухода">
                    <textarea className="textarea" value={form.habits} onChange={(e) => update('habits', e.target.value)} placeholder="Опишите, что важно для вашего питомца и какие ритуалы помогают ему чувствовать себя спокойно" />
                  </Field>
                ) : null}

                <Field label="Где любит спать / отдыхать">
                  <ChipGroup value={form.sleep} onChange={(v) => update('sleep', v)} options={[{ value: 'bed', label: '🛏 Кровать' }, { value: 'couch', label: '🛋 Диван' }, { value: 'house', label: '🏠 Домик / клетка' }, { value: 'floor', label: '🪵 Лежанка' }]} />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div style={{ animation: 'fadeUp .25s ease' }}>
                <h2 style={{ marginTop: 0 }}>Медицина и важные нюансы</h2>
                <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Здесь всё, что помогает ситтеру не гадать: состояние здоровья, лекарства, последний визит к врачу и кого набирать при странных симптомах.</p>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Вакцинация">
                    <ChipGroup value={form.vaccinated} onChange={(v) => update('vaccinated', v)} options={[{ value: 'yes', label: '✅ Привит' }, { value: 'partial', label: '⚠️ Частично' }, { value: 'no', label: '❌ Нет' }]} />
                  </Field>
                  <Field label="Стерилизован / кастрирован">
                    <ChipGroup value={form.neutered} onChange={(v) => update('neutered', v)} options={[{ value: 'yes', label: 'Да' }, { value: 'no', label: 'Нет' }]} />
                  </Field>
                </div>
                <Field label="Хронические состояния / важные комментарии">
                  <textarea className="textarea" value={form.chronic} onChange={(e) => update('chronic', e.target.value)} placeholder="Например: чувствительный ЖКТ, тревожность, аллергия, особенности поведения после стресса" />
                </Field>
                <Field label="Лекарства и как их давать">
                  <textarea className="textarea" value={form.medsText || ''} onChange={(e) => update('medsText', e.target.value)} placeholder="Что давать, в какое время и как это обычно удаётся без театральной борьбы" />
                </Field>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Последний визит к врачу">
                    <input className="input" type="month" value={form.lastVet || ''} onChange={(e) => update('lastVet', e.target.value)} />
                  </Field>
                  <Field label="Врач / клиника">
                    <input className="input" value={form.vetName || ''} onChange={(e) => update('vetName', e.target.value)} placeholder="Название клиники или имя врача" />
                  </Field>
                </div>
                <Field label="Телефон клиники / врача">
                  <input className="input" value={formatPhone(form.vetPhone || '')} onChange={(e) => update('vetPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="999-123-45-67" />
                </Field>
              </div>
            ) : null}

            {step === 4 ? (
              <div style={{ animation: 'fadeUp .25s ease' }}>
                <h2 style={{ marginTop: 0 }}>Когда и в каком ритме нужна помощь</h2>
                <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Тут указываем даты, отчёты и всё, что поможет подобрать человека без лишней суеты.</p>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Дата начала" error={errors.dateFrom}>
                    <input className="input" type="date" value={form.dateFrom} onChange={(e) => update('dateFrom', e.target.value)} />
                  </Field>
                  <Field label="Дата окончания" error={errors.dateTo}>
                    <input className="input" type="date" value={form.dateTo} onChange={(e) => update('dateTo', e.target.value)} />
                  </Field>
                </div>
                <Field label="Какой формат отчётов успокоит вас больше всего?">
                  <ChipGroup value={form.reports} onChange={(v) => update('reports', v)} options={[{ value: 'photo', label: '📸 Фото' }, { value: 'video', label: '🎥 Видео' }, { value: 'voice', label: '🎙 Голосовое' }, { value: 'call', label: '📞 Звонок' }]} multi />
                </Field>
                <Field label={`Частота отчётов: ${form.reportFreq} раз(а) в день`}>
                  <Stepper value={form.reportFreq} setValue={(v) => update('reportFreq', v)} min={1} max={4} />
                </Field>
                <Field label="Пожелания к ситтеру" hint="Например: опыт с тревожными собаками, без других животных дома, бережный подход к птицам.">
                  <textarea className="textarea" value={form.wishes} onChange={(e) => update('wishes', e.target.value)} placeholder="Здесь можно написать всё, что поможет подобрать “своего” человека." />
                </Field>
              </div>
            ) : null}

            {step === 5 ? (
              <div style={{ animation: 'fadeUp .25s ease' }}>
                <h2 style={{ marginTop: 0 }}>Кому мы пишем и кого будим при форс-мажоре</h2>
                <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Контакты — это не скучно, а фундамент доверия. Тут лучше без загадочности.</p>
                <Field label="Ваше имя" error={errors.ownerName}>
                  <input className="input" value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} placeholder="Например: Алексей" />
                </Field>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Телефон" error={errors.ownerPhone}>
                    <input className="input" value={formatPhone(form.ownerPhone)} onChange={(e) => update('ownerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="999-123-45-67" />
                  </Field>
                  <Field label="Email">
                    <input className="input" type="email" value={form.ownerEmail} onChange={(e) => update('ownerEmail', e.target.value)} placeholder="mail@example.com" />
                  </Field>
                </div>
                <Field label="Как удобнее связаться">
                  <ChipGroup value={form.reachBy} onChange={(v) => update('reachBy', v)} options={[{ value: 'telegram', label: '✈️ Telegram' }, { value: 'phone', label: '📞 Звонок' }, { value: 'whatsapp', label: '💬 WhatsApp' }, { value: 'any', label: '🔔 Любым способом' }]} />
                </Field>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Field label="Экстренный контакт: имя">
                    <input className="input" value={form.emergName} onChange={(e) => update('emergName', e.target.value)} placeholder="Кто сможет помочь, если вы в самолёте или без связи" />
                  </Field>
                  <Field label="Кем приходится">
                    <input className="input" value={form.emergRel} onChange={(e) => update('emergRel', e.target.value)} placeholder="Партнёр, мама, друг" />
                  </Field>
                </div>
                <Field label="Экстренный телефон" error={errors.emergPhone}>
                  <input className="input" value={formatPhone(form.emergPhone)} onChange={(e) => update('emergPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="999-123-45-67" />
                </Field>
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 12 }}>
                  <input type="checkbox" checked={form.saveConsent} onChange={(e) => update('saveConsent', e.target.checked)} style={{ marginTop: 4 }} />
                  <span style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>Сохранить часть данных о питомце в браузере, чтобы при следующей заявке не заполнять всё по новой.</span>
                </label>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {step > 1 ? <button className="btn btn-secondary" type="button" onClick={() => setStep((prev) => prev - 1)} style={{ flex: 1 }}>← Назад</button> : null}
              <button className="btn btn-primary" type="button" style={{ flex: step > 1 ? 1.4 : 1 }} onClick={continueFlow} disabled={busy}>
                {busy ? 'Отправляем...' : step < 5 ? 'Дальше →' : 'Отправить заявку 💌'}
              </button>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}


function SitterApply({ onBack }: { onBack: () => void }) {
  const [payload, setPayload] = useState({ name: '', phone: '', email: '', city: '', petTypes: [], services: [], experience: '', hasPets: '', hasVetEdu: '', motivation: '', refs: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function update(key: string, value: any) {
    setPayload((prev: any) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function submit() {
    if (!payload.name.trim()) return setError('Нужно имя.');
    if (String(payload.phone || '').replace(/\D/g, '').length < 10) return setError('Нужно 10 цифр телефона.');
    try {
      setBusy(true);
      const res = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sitter', payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить анкету');
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить анкету');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 18 }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <Card className="form-card">
          <div className="form-topbar">
            <button className="back" type="button" onClick={onBack}>← На главную</button>
            <strong style={{ color: 'var(--sage)' }}>🧑 Анкета ситтера</strong>
          </div>
          {!sent ? (
            <>
              <h2 style={{ marginTop: 0 }}>Хочу стать ситтером</h2>
              <p style={{ color: 'var(--muted)', marginTop: -4, lineHeight: 1.7 }}>Нам нужны люди, которые действительно любят животных, а не только умеют красиво написать “обожаю хвостиков” в анкете.</p>
              {error ? <div className="notice" style={{ marginBottom: 14 }}>{error}</div> : null}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Field label="Имя"><input className="input" value={payload.name} onChange={(e) => update('name', e.target.value)} /></Field>
                <Field label="Телефон"><input className="input" value={formatPhone(payload.phone)} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} /></Field>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Field label="Email"><input className="input" value={payload.email} onChange={(e) => update('email', e.target.value)} /></Field>
                <Field label="Город"><input className="input" value={payload.city} onChange={(e) => update('city', e.target.value)} /></Field>
              </div>
              <Field label="С какими питомцами готовы работать"><ChipGroup value={payload.petTypes} onChange={(v) => update('petTypes', v)} options={PETS.map((pet) => ({ value: pet.value, label: `${pet.emoji} ${pet.title}` }))} multi /></Field>
              <Field label="Какие услуги готовы оказывать"><ChipGroup value={payload.services} onChange={(v) => update('services', v)} options={[{ value: 'boarding', label: '🏡 Передержка' }, { value: 'inhome', label: '🚪 Визиты домой' }, { value: 'walks', label: '🐕 Выгул' }]} multi /></Field>
              <Field label="Опыт"><textarea className="textarea" value={payload.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Расскажите коротко, с какими животными уже был опыт и почему вам это нравится." /></Field>
              <Field label="Есть свои животные?"><input className="input" value={payload.hasPets} onChange={(e) => update('hasPets', e.target.value)} placeholder="Например: две кошки и попугай" /></Field>
              <Field label="Ветеринарное образование / курсы"><input className="input" value={payload.hasVetEdu} onChange={(e) => update('hasVetEdu', e.target.value)} placeholder="Если есть — отлично. Если нет — тоже можно честно написать." /></Field>
              <Field label="Почему хотите стать ситтером"><textarea className="textarea" value={payload.motivation} onChange={(e) => update('motivation', e.target.value)} /></Field>
              <Field label="Рекомендации / ссылки"><input className="input" value={payload.refs} onChange={(e) => update('refs', e.target.value)} placeholder="Можно просто текстом" /></Field>
              <button className="btn btn-primary" type="button" onClick={submit} disabled={busy}>{busy ? 'Отправляем...' : 'Отправить анкету 🐾'}</button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 68, marginBottom: 8 }}>🎉</div>
              <h2>Анкета улетела</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 18px' }}>Спасибо. Это уже выглядит как начало милой и полезной истории, а не как скучный HR-коридор.</p>
              <button className="btn btn-secondary" type="button" onClick={onBack}>Вернуться на главную</button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

function SendingScreen({ form }: { form: any }) {
  return (
    <div className="success-wrap">
      <Card className="success-card">
        <div className="success-stage">
          <div className="ground" />
          <div className="owner">
            <span className="face">😊</span>
            <small>Хозяин</small>
          </div>
          <div className="sitter">
            <span className="face">😊</span>
            <small>Ситтер</small>
          </div>
          <div className="pet-jump">{PET_MAP[form.petType] || '🐾'}</div>
          <div className="hearts">
            <span>💖</span>
            <span>💕</span>
            <span>💛</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px' }}>Питомец уже летит на ручки</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>Заявка отправляется. Сейчас всё произойдёт мягко и по плану — питомец уже летит в заботливые руки.</p>
        </div>
      </Card>
      <PetMascot form={form} cue={mascotCue} finalMode />
    </div>
  );
}

function Success({ form, reset }: { form: any; reset: () => void }) {
  return (
    <div className="success-wrap">
      <Card className="success-card">
        <div className="success-stage">
          <div className="ground" />
          <div className="owner">
            <span className="face">😊</span>
            <small>Владелец</small>
          </div>
          <div className="sitter">
            <span className="face">😊</span>
            <small>Ситтер</small>
          </div>
          <div className="pet-jump">{PET_MAP[form.petType] || '🐾'}</div>
          <div className="hearts">
            <span>💖</span>
            <span>💕</span>
            <span>💗</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 2 }}>🎉</div>
          <h2 style={{ margin: '0 0 8px' }}>Заявка принята</h2>
          <p style={{ margin: '0 auto 16px', color: 'var(--muted)', maxWidth: 560, lineHeight: 1.8 }}>Мы получили заявку и скоро свяжемся с вами. А питомец уже морально устроился в заботливых руках.</p>
        </div>
        <div className="summary">
          <div className="item"><strong>Питомец</strong>{form.petName || '—'} · {PET_LABEL[form.petType] || '—'}</div>
          <div className="item"><strong>Сценарий</strong>{form.serviceType === 'boarding' ? 'Передержка у ситтера' : 'Визиты домой'}</div>
          <div className="item"><strong>Даты</strong>{form.dateFrom || '—'} → {form.dateTo || '—'}</div>
          <div className="item"><strong>Контакт</strong>{form.ownerName || '—'} · +7 {formatPhone(form.ownerPhone)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" type="button" onClick={reset}>Оставить ещё заявку 🐾</button>
        </div>
      </Card>
      <PetMascot form={form} cue={mascotCue} finalMode />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'landing' | 'form' | 'sitter' | 'sending' | 'success'>('landing');
  const [form, setForm] = useState<any>(INIT);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mascotCue, setMascotCue] = useState<any>({ key: 'intro', nonce: Date.now() });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) setForm((prev: any) => ({ ...prev, ...JSON.parse(saved), ownerPhone: '', ownerEmail: '', emergPhone: '', emergName: '', emergRel: '' }));
    } catch {
      // noop
    }
  }, []);

  function startForm(prefill?: Partial<typeof INIT>) {
    setForm((prev: any) => ({ ...prev, ...prefill }));
    setMascotCue({ key: prefill?.petType ? 'petType' : 'intro', nonce: Date.now() + Math.random() });
    setSubmitError('');
    setView('form');
  }

  async function submitOwnerForm() {
    setBusy(true);
    setSubmitError('');
    setView('sending');
    try {
      const res = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'owner', payload: form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку');
      setTimeout(() => {
        setView('success');
        setBusy(false);
      }, 1450);
    } catch (err: any) {
      setBusy(false);
      setSubmitError(err?.message || 'Не удалось отправить заявку');
      setView('form');
    }
  }

  function reset() {
    setForm(INIT);
    setMascotCue({ key: 'intro', nonce: Date.now() + Math.random() });
    setView('landing');
    setSubmitError('');
    setBusy(false);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="paws-bg" aria-hidden="true">
        <span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span>
      </div>
      {view === 'landing' ? <Landing onStart={startForm} onSitter={() => setView('sitter')} /> : null}
      {view === 'form' ? <OwnerForm form={form} setForm={setForm} onBack={() => setView('landing')} onSubmit={submitOwnerForm} busy={busy} submitError={submitError} mascotCue={mascotCue} setMascotCue={setMascotCue} /> : null}
      {view === 'sitter' ? <SitterApply onBack={() => setView('landing')} /> : null}
      {view === 'sending' ? <SendingScreen form={form} /> : null}
      {view === 'success' ? <Success form={form} reset={reset} /> : null}
    </>
  );
}
