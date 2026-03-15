import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box}
body,input,textarea,select,button{font-family:'Nunito',system-ui,sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:scale(.3) rotate(-8deg)}70%{transform:scale(1.12) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes glow{0%,100%{box-shadow:0 4px 20px rgba(232,107,79,.22)}50%{box-shadow:0 6px 36px rgba(232,107,79,.55)}}
@keyframes shimmer{0%,100%{opacity:.1}50%{opacity:.45}}
@keyframes heartFloat{0%{opacity:0;transform:scale(.3) translateY(0)}55%{opacity:1;transform:scale(1.1) translateY(-28px)}100%{opacity:0;transform:scale(.6) translateY(-60px)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes catSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes dogZoom{0%,44%{transform:scaleX(1)}50%{transform:scaleX(1) translateX(8px)}56%,100%{transform:scaleX(-1)}}
@keyframes rabbitBinky{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-22px) rotate(-18deg)}50%{transform:translateY(-14px) rotate(16deg)}75%{transform:translateY(-3px)}}
@keyframes birdBob{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-7px) rotate(-14deg)}65%{transform:translateY(-4px) rotate(12deg)}}
@keyframes pawPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25) rotate(18deg)}}
@keyframes sitterArm{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg) translateY(10px)}}
@keyframes orbitRise{0%{opacity:0;transform:translateY(42vh) scale(.86)}70%{opacity:.88}100%{opacity:1;transform:translateY(0) scale(1)}}
.fu{animation:fadeUp .38s ease both}
.fi{animation:fadeIn .3s ease both}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;border-radius:99px;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:99px;background:linear-gradient(135deg,#E86B4F,#F4A261);border:3px solid #fff;box-shadow:0 2px 10px rgba(232,107,79,.4);cursor:pointer}
`;

const P='#E86B4F', P2='#F4A261', SAGE='#52B788';
const CREAM='#FEFAF4', BORDER='#E8DDD2', MUTED='#9E8E80', DARK='#2D2015';
const grad = 'linear-gradient(135deg,#E86B4F,#F4A261)';
const sageGrad = 'linear-gradient(135deg,#52B788,#2D6A4F)';

const PET_MAP = { dog:'🐕', cat:'🐈', rabbit:'🐇', hamster:'🐹', bird:'🦜', other:'🐾' };
const PET_LABEL = { dog:'Собака', cat:'Кошка', rabbit:'Кролик', hamster:'Хомяк', bird:'Птица', other:'Другое' };
const PET_TYPES = Object.keys(PET_MAP).map(v => ({ v, e:PET_MAP[v], l:PET_LABEL[v] }));

const PET_ANIM = {
  cat: 'catSpin 2s linear infinite',
  dog: 'dogZoom 1.8s ease infinite',
  rabbit: 'rabbitBinky 1.5s ease infinite',
  hamster: 'catSpin 0.4s linear infinite',
  bird: 'birdBob 1.1s ease infinite',
  other: 'pawPulse 1.4s ease infinite',
};

const PET_QUIPS = {
  cat: ['Отлично. Один пушистый начальник зарегистрирован','Кошка отмечена. Готовьте диван','Наконец-то. Кто-то признал, что кот — главный'],
  dog: ['О, ну всё. Кто-то будет очень сильно любить всех подряд','Принято. Запускаю режим “гулять, бегать, обожать”','Собака. Значит в этой заявке будет много движения и счастья'],
  rabbit: ['Кролик. Срочно проверяем безопасность проводов','Кролик. Значит будет много ушей, скорости и внезапных исчезновений'],
  hamster: ['Хомяк. Маленький, а логистика как у склада','Хомяк. Кто-то здесь очень серьёзно относится к семечкам','Маленький клиент, большие амбиции'],
  bird: ['Птица? Значит будильник теперь пернатый','Птица отмечена. Готовим корм и уважение к вокалу','Птица. Значит кто-то здесь любит быть громким и красивым одновременно'],
  other: ['Я тут не просто так. Я тут с важной кошачьей экспертизой','Псс… давайте быстро сделаем тыгыдык по анкете','Это не я вращаюсь. Это Вселенная вращается вокруг меня'],
};

const START_LINES = [
  'Не обращайте внимания: это не я вращаюсь, а вселенная вокруг меня',
  'Сделаем вместе с тобой тыгыдык по заявке и опишем питомца',
  'Псс… давайте быстро сделаем тыгыдык по анкете',
  'Я тут не просто так. Я тут с важной кошачьей экспертизой',
];
const HOVER_LINES = [
  'Лапки убрали. Я ещё не подписывал согласие на поглаживание',
  'Слишком быстро. Попробуйте ещё раз. С едой',
  'Попытка контакта зафиксирована. Ухожу красиво',
];
const REASON_LINES = {
  vacation:'Отпуск — это серьёзная причина. Давайте найдём ситтера',
  trip:'Командировки случаются. Питомец должен жить спокойно',
  workday:'Понятно. Значит нужен кто-то надёжный',
  nomoves:'Некоторые звери предпочитают оставаться дома. Мудро',
};
const IDLE_LINES = [
  'Это не я вращаюсь. Это Земля',
  'Технически я здесь главный',
  'Это мой стартап',
  'Я вообще-то консультант по комфорту',
  'Это не я вращаюсь. Это Вселенная вращается вокруг меня',
];

function noDot(v=''){ return String(v).replace(/\.$/, ''); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] || ''; }
function getStepQuips(f, step){
  if(!f.petType) return START_LINES;
  if(step===1) return PET_QUIPS[f.petType] || PET_QUIPS.other;
  if(step===2){
    const lines=[];
    if(f.lastVet || f.vetName || f.vetPhone) lines.push('Так, клиника есть. Уже спокойнее даже мне','Вижу организованных людей. Редкость','Хорошо. Медицинская часть учтена','Отлично, у питомца есть план на случай форс-мажора');
    if(!f.noMeds || (f.meds||[]).length) lines.push('О. Таблетки. Начинается игра «поймай меня сначала»','Лекарства отмечены. Я уже подозрительно смотрю','Интересно. Таблетка будет спрятана в еде?','Так. Медицинский режим. Я заранее не согласен, но продолжайте','Ну всё. Пошла серьёзная сюжетная линия');
    return lines.length ? lines : ['Так, клиника есть. Уже спокойнее даже мне','Вижу организованных людей. Редкость'];
  }
  if(step===3){
    const lines=[];
    if(f.foodType || f.foodBrand || f.foodCustom) lines.push('Так. Корм записал. А ночные перекусы учтены?','Интересный пункт. Корм обычный… или тот, за который я вас прощу?','Отлично. Я так понимаю, дегустация входит в обязанности ситтера','Принято. Но если корм невкусный — я буду смотреть осуждающе','Корм принят. Я готов проверить качество','Так, питание пошло. Начинаю верить в эту операцию','Хорошо. Значит голодный бунт откладывается');
    if(f.sleep) lines.push('Диван отмечен. Я разрешу ситтеру иногда там сидеть','Хороший диван? Мне нужен мягкий. И желательно ваш','Записал: диван. Отлично. Территория уже почти моя','Диван принят. Осталось уточнить — где будет спать ситтер','Диван — это важно. Без него я превращаюсь в очень недовольного кота','Отлично. Стратегическая точка отдыха обнаружена','Мягкий диван? Так, сайт начинает мне нравиться','Лежак — это достойно. Скромно, но с уважением к комфорту','Клетка? Понял. Значит безопасность и режим без импровизации');
    if(f.petType==='dog' && f.walks) lines.push('Принято. У собаки будет карьера на свежем воздухе','Так. Гулять будем серьёзно','Прогулки есть. Радость официально утверждена','Хороший график. Я бы не пошёл, но поддерживаю');
    if(f.habits) lines.push('Игры? Хорошо. Я обычно выигрываю','Играть — это отлично. Главное — чтобы вы не уставали','Игры отмечены. Приготовьтесь проигрывать');
    return lines.length ? lines : PET_QUIPS[f.petType] || PET_QUIPS.other;
  }
  if(step===4) return ['Так… даты есть. Операция «спокойная поездка» начинается','План есть — уже хорошо. Я уважаю план и мягкие пледы','Даты записал. Найдём того, кто всё выдержит достойно'];
  if(step===5) return ['Так… миска, диван, врач. Картина становится обнадёживающей','Я почти перестал придираться. Почти','Ну всё. Похоже, вы реально стараетесь'];
  return PET_QUIPS[f.petType] || PET_QUIPS.other;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function Fld({ label, hint, err, req, children }) {
  return (
    <div style={{ marginBottom:13 }}>
      {label && <label style={{ display:'block', fontSize:12.5, fontWeight:700, color:'#666', marginBottom:3 }}>{label}{req && <span style={{ color:P, marginLeft:2 }}>*</span>}</label>}
      {hint && <p style={{ margin:'0 0 5px', fontSize:11.5, color:MUTED, lineHeight:1.4 }}>{hint}</p>}
      {children}
      {err && <p style={{ margin:'4px 0 0', fontSize:11.5, color:P, fontWeight:700 }}>{err}</p>}
    </div>
  );
}

function Inp({ v, c, ph, type='text', err, ...rest }) {
  return (
    <input
      value={v||''}
      onChange={e=>c(e.target.value)}
      placeholder={ph}
      type={type}
      {...rest}
      style={{
        width:'100%',
        padding:'10px 13px',
        borderRadius:10,
        border:`1.5px solid ${err?P:BORDER}`,
        fontSize:14,
        outline:'none',
        color:DARK,
        background:'#fff'
      }}
    />
  );
}

function Txt({ v, c, ph, rows=2 }) {
  return <textarea value={v||''} onChange={e=>c(e.target.value)} placeholder={ph} rows={rows}
    style={{ width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${BORDER}`, fontSize:14, outline:'none', resize:'vertical', color:DARK, lineHeight:1.5 }} />;
}

function Chips({ v, c, opts, multi=false }) {
  function handleClick(oval) {
    if (multi) {
      const cur = Array.isArray(v) ? v : [];
      c(cur.includes(oval) ? cur.filter(x=>x!==oval) : [...cur, oval]);
    } else { c(oval); }
  }
  const arr = Array.isArray(v) ? v : [];
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
      {opts.map(o => {
        const sel = multi ? arr.includes(o.v) : v===o.v;
        return <button key={o.v} onClick={()=>handleClick(o.v)}
          style={{ padding:'7px 13px', borderRadius:20, border:`2px solid ${sel?P:BORDER}`, background:sel?P:'#fff', color:sel?'#fff':'#777', fontWeight:700, fontSize:12.5, cursor:'pointer', transition:'all .18s' }}>{o.l}</button>;
      })}
    </div>
  );
}

function Stepper({ v, c, min=0, max=10, step=1 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, background:'#FFF8F5', borderRadius:12, padding:'6px 12px', border:`1px solid ${BORDER}` }}>
      <button onClick={()=>c(Math.max(min, Math.round((v-step)*10)/10))}
        style={{ width:32, height:32, borderRadius:99, border:`2px solid ${BORDER}`, background:'#fff', fontSize:18, cursor:'pointer', color:'#999', fontWeight:700, flexShrink:0 }}>−</button>
      <div style={{ flex:1, textAlign:'center', fontWeight:900, fontSize:19, color:P }}>{v}</div>
      <button onClick={()=>c(Math.min(max, Math.round((v+step)*10)/10))}
        style={{ width:32, height:32, borderRadius:99, border:`2px solid ${P}`, background:'#FFF0EE', fontSize:18, cursor:'pointer', color:P, fontWeight:700, flexShrink:0 }}>+</button>
    </div>
  );
}

function Slider({ v, c, min, max, step=1, unit='', marks }) {
  const pct = ((v-min)/(max-min))*100;
  return (
    <div>
      <div style={{ textAlign:'center', fontWeight:900, fontSize:18, color:P, marginBottom:5 }}>{v}{unit}</div>
      <input type='range' min={min} max={max} step={step} value={v} onChange={e=>c(+e.target.value)}
        style={{ background:`linear-gradient(90deg,${P} ${pct}%,${BORDER} ${pct}%)` }} />
      {marks && <div style={{ display:'flex', justifyContent:'space-between', marginTop:3, fontSize:11, color:'#CCC' }}>{marks.map((m,i)=><span key={i}>{m}</span>)}</div>}
    </div>
  );
}

// ── Non-linear Weight Slider ──────────────────────────────────────────────────
// Segments: [0.5,2] → pos 0–10%, [2,10] → pos 10–70%, [10,70] → pos 70–100%
function posToWeight(p) {
  if (p <= 10) return Math.round((0.5 + (p/10)*1.5) * 2) / 2;
  if (p <= 70) return Math.round((2 + ((p-10)/60)*8) * 2) / 2;
  return Math.round((10 + ((p-70)/30)*60) / 5) * 5;
}
function weightToPos(w) {
  if (w <= 2)  return ((w-0.5)/1.5)*10;
  if (w <= 10) return 10+((w-2)/8)*60;
  return 70+((w-10)/60)*30;
}
function WeightSlider({ v, c }) {
  const pos = weightToPos(v);
  return (
    <div>
      <div style={{ textAlign:'center', fontWeight:900, fontSize:18, color:P, marginBottom:5 }}>{v} кг</div>
      <div style={{ position:'relative' }}>
        <input type='range' min={0} max={100} step={0.2} value={pos}
          onChange={e => c(posToWeight(+e.target.value))}
          style={{ background:`linear-gradient(90deg,${P} ${pos}%,${BORDER} ${pos}%)` }} />
        {/* zone highlight bar */}
        <div style={{ position:'absolute', top:0, left:'10%', width:'60%', height:5, background:`${P}22`, borderRadius:99, pointerEvents:'none' }} />
      </div>
      <div style={{ position:'relative', height:20, marginTop:2 }}>
        {[{p:0,l:'0.5'},{p:10,l:'2 кг',hi:true},{p:70,l:'10 кг',hi:true},{p:100,l:'70'}].map((m,i)=>(
          <div key={i} style={{ position:'absolute', left:`${m.p}%`, transform:'translateX(-50%)', fontSize:10.5, color:m.hi?P:'#CCC', fontWeight:m.hi?800:400 }}>{m.l}</div>
        ))}
        <div style={{ position:'absolute', left:'40%', top:0, transform:'translateX(-50%)', fontSize:9.5, color:P, fontWeight:700, opacity:.5 }}>← популярный диапазон →</div>
      </div>
    </div>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:'#fff', borderRadius:20, padding:'22px 18px', boxShadow:'0 4px 28px rgba(80,30,10,.08)', border:`1px solid ${BORDER}`, ...style }}>{children}</div>;
}

function Btn({ children, onClick, variant='primary', disabled=false, style={} }) {
  const bg = variant==='sage'?sageGrad:variant==='outline'?'#fff':grad;
  const clr = variant==='outline'?MUTED:'#fff';
  const brd = variant==='outline'?`2px solid ${BORDER}`:'none';
  const anim = variant==='primary'&&!disabled?'glow 2.5s ease infinite':'none';
  return <button onClick={onClick} disabled={disabled}
    style={{ padding:'12px 20px', borderRadius:12, border:brd, background:disabled?'#EEE':bg, color:disabled?MUTED:clr, fontWeight:700, fontSize:14, cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:disabled?.5:1, animation:anim, ...style }}>{children}</button>;
}

function PhoneInp({ v='', c, err }) {
  const raw = String(v||'').replace(/\D/g,'').slice(0,10);
  const parts = [raw.slice(0,3),raw.slice(3,6),raw.slice(6,8),raw.slice(8,10)].filter(Boolean);
  const display = parts.join('-');
  const ok = raw.length===10;
  function handleChange(e) { c(e.target.value.replace(/\D/g,'').slice(0,10)); }
  return (
    <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${err?P:ok?SAGE:BORDER}`, borderRadius:10, background:'#fff', overflow:'hidden' }}>
      <span style={{ padding:'10px 3px 10px 12px', fontSize:14, fontWeight:800, color:DARK, flexShrink:0 }}>+7</span>
      <input value={display} onChange={handleChange} type='tel' maxLength={13} placeholder='999-123-45-67'
        style={{ flex:1, padding:'10px 6px', border:'none', fontSize:14, outline:'none', color:DARK, background:'transparent', minWidth:0 }} />
      <span style={{ padding:'0 10px', fontSize:13, fontWeight:700, color:ok?SAGE:MUTED, flexShrink:0 }}>{ok?'✓':raw.length+'/10'}</span>
    </div>
  );
}

const MONTHS_RU=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function VetDate({ c }) {
  const [mo,setMo]=useState(''); const [yr,setYr]=useState('');
  const now=new Date().getFullYear();
  const sel={padding:'9px 10px',borderRadius:9,border:`1.5px solid ${BORDER}`,fontSize:13,outline:'none',background:'#fff',color:DARK,width:'100%'};
  function update(nm,ny){setMo(nm);setYr(ny);c(nm&&ny?MONTHS_RU[+nm-1]+' '+ny:'');}
  return (
    <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:8 }}>
      <select value={mo} onChange={e=>update(e.target.value,yr)} style={sel}>
        <option value=''>Месяц визита</option>
        {MONTHS_RU.map((m,i)=><option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
      </select>
      <select value={yr} onChange={e=>update(mo,e.target.value)} style={sel}>
        <option value=''>Год</option>
        {Array.from({length:6},(_,i)=>now-i).map(y=><option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

const ALLERGENS=['Курица','Рыба','Говядина','Молочное','Яйца','Глютен','Пыльца','Пыль','Укусы насекомых','Химикаты'];
function AllergenPicker({ v=[], c, custom='', cCustom }) {
  const noA=v.includes('__none'); const showOther=v.includes('__other')&&!noA;
  function toggle(a){
    if(a==='__none'){c(noA?[]:['__none']);return;}
    const cur=v.filter(x=>x!=='__none');
    c(cur.includes(a)?cur.filter(x=>x!==a):[...cur,a]);
  }
  const cs=(active,green=false)=>({padding:'6px 10px',borderRadius:20,border:`1.5px solid ${active?(green?SAGE:P):BORDER}`,background:active?(green?'#ECFDF5':'#FFF0EE'):'#fff',color:active?(green?'#059669':P):'#888',fontWeight:700,fontSize:12,cursor:'pointer',transition:'all .15s'});
  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {ALLERGENS.map(a=><button key={a} onClick={()=>toggle(a)} style={cs(v.includes(a)&&!noA)}>{(v.includes(a)&&!noA)?'✓ ':''}{a}</button>)}
        <button onClick={()=>toggle('__other')} style={cs(showOther)}>{showOther?'✓ ':''}Другое</button>
        <button onClick={()=>toggle('__none')} style={cs(noA,true)}>{noA?'✓ ':''}Нет аллергий</button>
      </div>
      {showOther&&<div style={{ marginTop:8 }}><input autoFocus value={custom} onChange={e=>cCustom(e.target.value)} placeholder='Напишите аллерген...'
        style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:`1.5px solid ${P}`, fontSize:13, outline:'none', color:DARK }} /></div>}
    </div>
  );
}

const MED_SLOTS=['06:00','07:00','08:00','09:00','12:00','13:00','18:00','19:00','20:00','21:00','22:00'];
function MedsBuilder({ v=[], noMeds, c, cNo }) {
  function addMed(){c([...v,{name:'',dose:'',times:[]}]);}
  function removeMed(i){c(v.filter((_,j)=>j!==i));}
  function updateMed(i,k,val){c(v.map((m,j)=>j===i?{...m,[k]:val}:m));}
  function toggleTime(i,t){const cur=v[i].times||[];updateMed(i,'times',cur.includes(t)?cur.filter(x=>x!==t):[...cur,t]);}
  return (
    <div>
      {!noMeds&&v.map((med,i)=>(
        <div key={i} style={{ background:'#FFF8F5',borderRadius:12,padding:12,marginBottom:8,border:`1px solid ${BORDER}`,position:'relative',animation:'fadeIn .3s ease' }}>
          <button onClick={()=>removeMed(i)} style={{ position:'absolute',top:8,right:8,border:'none',background:'none',color:MUTED,fontSize:16,cursor:'pointer' }}>✕</button>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8 }}>
            <div><label style={{ fontSize:11.5,color:MUTED,fontWeight:700,display:'block',marginBottom:3 }}>Препарат</label>
              <input value={med.name} onChange={e=>updateMed(i,'name',e.target.value)} placeholder='Омепразол...'
                style={{ width:'100%',padding:'8px 10px',borderRadius:8,border:`1.5px solid ${BORDER}`,fontSize:13,outline:'none',color:DARK }} /></div>
            <div><label style={{ fontSize:11.5,color:MUTED,fontWeight:700,display:'block',marginBottom:3 }}>Дозировка</label>
              <input value={med.dose} onChange={e=>updateMed(i,'dose',e.target.value)} placeholder='5 мг / 1 табл.'
                style={{ width:'100%',padding:'8px 10px',borderRadius:8,border:`1.5px solid ${BORDER}`,fontSize:13,outline:'none',color:DARK }} /></div>
          </div>
          <label style={{ fontSize:11.5,color:MUTED,fontWeight:700,display:'block',marginBottom:5 }}>⏰ Время приёма</label>
          <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
            {MED_SLOTS.map(t=>{const on=(med.times||[]).includes(t);return(
              <button key={t} onClick={()=>toggleTime(i,t)}
                style={{ padding:'5px 8px',borderRadius:7,border:`1.5px solid ${on?P:BORDER}`,background:on?P:'#fff',color:on?'#fff':MUTED,fontWeight:700,fontSize:11.5,cursor:'pointer',transition:'all .15s' }}>{t}</button>
            );})}
          </div>
        </div>
      ))}
      <div style={{ display:'grid',gridTemplateColumns:noMeds?'1fr':'1fr 1fr',gap:8 }}>
        {!noMeds&&<button onClick={addMed} style={{ padding:'9px',borderRadius:10,border:`2px dashed ${BORDER}`,background:'#FFF8F5',color:P,fontWeight:700,cursor:'pointer',fontSize:12.5 }}>+ Добавить препарат</button>}
        <button onClick={()=>cNo(!noMeds)} style={{ padding:'9px',borderRadius:10,border:`2px solid ${noMeds?SAGE:BORDER}`,background:noMeds?'#ECFDF5':'#fff',color:noMeds?'#059669':MUTED,fontWeight:700,cursor:'pointer',fontSize:12.5,transition:'all .2s' }}>
          {noMeds?'✓ Лекарств нет':'Не принимает лекарств'}
        </button>
      </div>
    </div>
  );
}

const TIME_SLOTS=['06:00','07:00','08:00','09:00','12:00','13:00','17:00','18:00','19:00','20:00','21:00','22:00'];
function TimeGrid({ v=[], c }) {
  function toggle(t){const arr=v||[];c(arr.includes(t)?arr.filter(x=>x!==t):[...arr,t]);}
  return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
      {TIME_SLOTS.map(t=>{const on=(v||[]).includes(t);return(
        <button key={t} onClick={()=>toggle(t)}
          style={{ padding:'6px 9px',borderRadius:8,border:`1.5px solid ${on?P:BORDER}`,background:on?P:'#fff',color:on?'#fff':MUTED,fontWeight:700,fontSize:12,cursor:'pointer',transition:'all .18s' }}>{t}</button>
      );})}
    </div>
  );
}

const DRY_BRANDS=['Royal Canin','Hills Science','Purina Pro Plan','Brit Premium','Acana','Orijen','Monge','Другой'];
const WET_BRANDS=['Whiskas','Felix','Sheba','Gourmet','Pedigree','Cesar','Purina ONE','Другой'];
function FoodSection({ f, u }) {
  const brands = f.foodType==='dry'?DRY_BRANDS:WET_BRANDS;
  return (
    <div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12 }}>
        {[{v:'dry',e:'🥗',l:'Сухой корм'},{v:'wet',e:'🥫',l:'Влажный корм'}].map(t=>(
          <button key={t.v} onClick={()=>u('foodType',t.v)}
            style={{ padding:'12px 8px',borderRadius:13,border:`2px solid ${f.foodType===t.v?P:BORDER}`,background:f.foodType===t.v?'#FFF0EE':'#fff',cursor:'pointer',textAlign:'center',transition:'all .2s' }}>
            <div style={{ fontSize:26 }}>{t.e}</div>
            <div style={{ fontSize:12.5,fontWeight:700,color:f.foodType===t.v?P:'#888',marginTop:3 }}>{t.l}</div>
          </button>
        ))}
      </div>
      {f.foodType&&(
        <div className='fu'>
          <Fld label='Марка корма'>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:8 }}>
              {brands.map(b=>(
                <button key={b} onClick={()=>u('foodBrand',b)}
                  style={{ padding:'5px 10px',borderRadius:16,border:`1.5px solid ${f.foodBrand===b?P:BORDER}`,background:f.foodBrand===b?'#FFF0EE':'#fff',color:f.foodBrand===b?P:'#888',fontWeight:700,fontSize:12,cursor:'pointer' }}>{b}</button>
              ))}
            </div>
            {f.foodBrand==='Другой'&&<input value={f.foodCustom||''} onChange={e=>u('foodCustom',e.target.value)} placeholder='Марка корма...'
              style={{ width:'100%',padding:'9px 12px',borderRadius:9,border:`1.5px solid ${BORDER}`,fontSize:13,outline:'none',marginBottom:8 }} />}
          </Fld>
          {f.foodType==='dry'&&<Fld label={'Суточная порция: '+(f.foodGrams||100)+' г'}><Slider v={f.foodGrams||100} c={v=>u('foodGrams',v)} min={20} max={600} step={10} unit='г' marks={['20','200','400','600']} /></Fld>}
          {f.foodType==='wet'&&(
            <div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                <Fld label={'Утром: '+(f.wetMorning||1)+' пак.'}><Stepper v={f.wetMorning||1} c={v=>u('wetMorning',v)} min={0.5} max={4} step={0.5} /></Fld>
                <Fld label={'Вечером: '+(f.wetEvening||1)+' пак.'}><Stepper v={f.wetEvening||1} c={v=>u('wetEvening',v)} min={0.5} max={4} step={0.5} /></Fld>
              </div>
              <p style={{ fontSize:11.5,color:MUTED,margin:'4px 0 0' }}>1 пакетик ≈ 80 г</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PetGrid({ v, c, err }) {
  return (
    <div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9 }}>
        {PET_TYPES.map(t=>(
          <button key={t.v} onClick={()=>c(t.v)}
            style={{ padding:'12px 6px',borderRadius:13,border:`2px solid ${v===t.v?P:BORDER}`,background:v===t.v?'#FFF0EE':'#fff',cursor:'pointer',textAlign:'center',transition:'all .2s' }}>
            <div style={{ fontSize:28,display:'block',animation:v===t.v?(PET_ANIM[t.v]||'float 2s ease infinite'):'none' }}>{t.e}</div>
            <div style={{ fontSize:11.5,fontWeight:700,color:v===t.v?P:'#AAA',marginTop:3 }}>{t.l}</div>
          </button>
        ))}
      </div>
      {err&&<p style={{ margin:'5px 0 0',fontSize:12,color:P,fontWeight:700 }}>{err}</p>}
    </div>
  );
}

const STEP_BG={1:'#FFD580',2:'#90E0EF',3:'#C3F0CA',4:'#FFCBA4',5:'#E8CFFF'};
function PetMascot({ step, petType, tick, f }) {
  const em=PET_MAP[petType]; if(!em||em==='🐾') return null;
  const quips=getStepQuips(f, step);
  const msg=noDot(quips[tick%quips.length] || pick(quips) || '');
  const bg=STEP_BG[step]||BORDER;
  return (
    <div style={{ position:'fixed',bottom:90,right:14,zIndex:60,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,pointerEvents:'none' }}>
      <div key={tick} style={{ background:'rgba(255,255,255,.88)',borderRadius:14,padding:'7px 11px',boxShadow:'0 4px 18px rgba(80,30,10,.14)',fontSize:11.8,fontWeight:700,color:DARK,maxWidth:165,textAlign:'center',border:`1.5px solid ${bg}`,animation:'popIn .35s ease',position:'relative',opacity:.92 }}>
        {msg}
        <div style={{ position:'absolute',bottom:-7,right:16,width:13,height:13,background:'rgba(255,255,255,.88)',borderRight:`1.5px solid ${bg}`,borderBottom:`1.5px solid ${bg}`,transform:'rotate(45deg)' }} />
      </div>
      <div style={{ fontSize:44,animation:PET_ANIM[petType]||'float 2s ease infinite',filter:'drop-shadow(0 4px 12px rgba(0,0,0,.14))' }}>{em}</div>
    </div>
  );
}

function SHero({ em, title, sub }) {
  return (
    <div style={{ textAlign:'center',marginBottom:20 }}>
      <div style={{ fontSize:40,marginBottom:5,animation:'float 2s ease infinite' }}>{em}</div>
      <h2 style={{ margin:0,fontSize:18,color:DARK,fontWeight:900 }}>{title}</h2>
      <p style={{ margin:'5px 0 0',fontSize:12.5,color:MUTED }}>{sub}</p>
    </div>
  );
}

function S1({ f, u, e }) {
  return (
    <div className='fu'>
      <SHero em='🐾' title='Расскажите о питомце' sub='Начнём с самого главного!' />
      <Fld label='Кличка питомца' req err={e.petName}><Inp v={f.petName} c={v=>u('petName',v)} ph='Барсик, Рекс, Пуговка...' err={e.petName} /></Fld>
      <Fld label='Вид питомца' req err={e.petType}><PetGrid v={f.petType} c={v=>u('petType',v)} err={e.petType} /></Fld>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
        <Fld label='Порода'><Inp v={f.breed} c={v=>u('breed',v)} ph='Порода' /></Fld>
        <Fld label='Пол'><Chips v={f.gender} c={v=>u('gender',v)} opts={[{v:'male',l:'♂ Мальчик'},{v:'female',l:'♀ Девочка'}]} /></Fld>
      </div>
      <Fld label={'Возраст: '+f.age+' '+(f.age===1?'год':f.age<=4?'года':'лет')}>
        <Slider v={f.age} c={v=>u('age',v)} min={0} max={20} step={1} marks={['0','5','10','15','20+']} />
      </Fld>
      <Fld label='Вес'>
        <WeightSlider v={f.weight} c={v=>u('weight',v)} />
      </Fld>
    </div>
  );
}

function S2({ f, u }) {
  return (
    <div className='fu'>
      <SHero em='💊' title='Здоровье и медицина' sub='Давай поможем узнать лучше мои привычки! 🐾' />
      <Fld label='Вакцинация'><Chips v={f.vaccinated} c={v=>u('vaccinated',v)} opts={[{v:'yes',l:'✅ Привит'},{v:'partial',l:'⚠️ Частично'},{v:'no',l:'❌ Нет'}]} /></Fld>
      <Fld label='Стерилизован / кастрирован'><Chips v={f.neutered} c={v=>u('neutered',v)} opts={[{v:'yes',l:'Да'},{v:'no',l:'Нет'}]} /></Fld>
      <Fld label='Последний визит к ветеринару'><VetDate c={v=>u('lastVet',v)} /></Fld>
      <Fld label='Аллергии' hint='Выберите все подходящие варианты'>
        <AllergenPicker v={f.allergies||[]} c={v=>u('allergies',v)} custom={f.allergyCustom||''} cCustom={v=>u('allergyCustom',v)} />
      </Fld>
      <Fld label='Лекарства' hint='Добавьте каждый препарат отдельно'>
        <MedsBuilder v={f.meds||[]} noMeds={f.noMeds} c={v=>u('meds',v)} cNo={v=>u('noMeds',v)} />
      </Fld>
      <Fld label='Хронические заболевания'><Txt v={f.chronic||''} c={v=>u('chronic',v)} ph='Диабет, эпилепсия... / Здоров' /></Fld>
      <div style={{ background:'#FFF9E8',borderRadius:13,padding:13,border:'1px solid #FFE08A' }}>
        <div style={{ fontWeight:800,color:'#B07800',fontSize:12.5,marginBottom:8 }}>🏥 Ваш ветеринар (экстренная связь)</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          <Fld label='Врач / клиника'><Inp v={f.vetName||''} c={v=>u('vetName',v)} ph='Клиника «Айболит»' /></Fld>
          <Fld label='Телефон клиники'><PhoneInp v={f.vetPhone||''} c={v=>u('vetPhone',v)} /></Fld>
        </div>
      </div>
    </div>
  );
}

function S3({ f, u }) {
  return (
    <div className='fu'>
      <SHero em='🏠' title='Режим и уход' sub='Расскажите о привычках любимца' />
      <Fld label='Тип услуги' req>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:9 }}>
          {[{v:'boarding',e:'🏡',l:'Передержка у ситтера',d:'Питомец живёт в другом доме'},{v:'inhome',e:'🚪',l:'Присмотр у вас дома',d:'Ситтер приходит к вам'}].map(s=>(
            <button key={s.v} onClick={()=>u('serviceType',s.v)}
              style={{ padding:'13px 8px',borderRadius:13,border:`2px solid ${f.serviceType===s.v?P:BORDER}`,background:f.serviceType===s.v?'#FFF0EE':'#fff',cursor:'pointer',textAlign:'center',transition:'all .2s' }}>
              <div style={{ fontSize:28 }}>{s.e}</div>
              <div style={{ fontSize:12.5,fontWeight:800,color:f.serviceType===s.v?P:'#666',marginTop:4 }}>{s.l}</div>
              <div style={{ fontSize:11,color:MUTED,marginTop:2 }}>{s.d}</div>
            </button>
          ))}
        </div>
      </Fld>
      {f.serviceType==='inhome'&&(
        <div className='fu'>
          <Fld label='📍 Адрес питомца' req hint='Ситтер будет приходить по этому адресу'>
            <Inp v={f.address||''} c={v=>u('address',v)} ph='Улица, дом, квартира, домофон' />
          </Fld>
          <Fld label={'Визитов ситтера в день: '+(f.visits||2)}><Stepper v={f.visits||2} c={v=>u('visits',v)} min={1} max={4} /></Fld>
        </div>
      )}
      <Fld label='Время кормлений' hint='Нажмите нужное время'><TimeGrid v={f.feedTimes||[]} c={v=>u('feedTimes',v)} /></Fld>
      <Fld label='Питание'><FoodSection f={f} u={u} /></Fld>
      <Fld label='❌ Нельзя давать'><Inp v={f.forbidden||''} c={v=>u('forbidden',v)} ph='Молоко, кости, сладкое...' /></Fld>
      {f.petType==='dog' && <Fld label={'Прогулок в день: '+(f.walks||2)}><Stepper v={f.walks||2} c={v=>u('walks',v)} min={1} max={6} /></Fld>}
      <Fld label='Место для сна'>
        <Chips v={f.sleep} c={v=>u('sleep',v)} opts={[{v:'bed',l:'🛏 Кровать'},{v:'couch',l:'🛋 Диван'},{v:'floor',l:'🪵 Лежак'},{v:'kennel',l:'🏠 Клетка'}]} />
      </Fld>
      <Fld label='Характер и привычки'><Txt v={f.habits||''} c={v=>u('habits',v)} ph='Любит мячики, боится пылесоса...' rows={2} /></Fld>
    </div>
  );
}

function S4({ f, u, e }) {
  let days=0;
  if(f.dateFrom&&f.dateTo){const d=(new Date(f.dateTo)-new Date(f.dateFrom))/86400000;if(d>0)days=Math.round(d);}
  return (
    <div className='fu'>
      <SHero em='📅' title='Даты и пожелания' sub='Когда нужна наша помощь?' />
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
        <Fld label='Дата начала' req err={e.dateFrom}>
  <Inp
    v={f.dateFrom||''}
    c={v=>u('dateFrom',v)}
    type='date'
    err={e.dateFrom}
    min={new Date().toISOString().split('T')[0]}
  />
</Fld>

<Fld label='Дата окончания' req err={e.dateTo}>
  <Inp
    v={f.dateTo||''}
    c={v=>u('dateTo',v)}
    type='date'
    err={e.dateTo}
    min={f.dateFrom || new Date().toISOString().split('T')[0]}
  />
</Fld>
      </div>
      {days>0&&<div style={{ background:'linear-gradient(135deg,#FFF0EE,#FFE4DC)',borderRadius:12,padding:'11px 14px',marginBottom:4,textAlign:'center',border:'1px solid #FFCFC4' }}>
        <span style={{ fontSize:13.5,fontWeight:800,color:P }}>🗓 {days} {days===1?'день':days<5?'дня':'дней'} — мы позаботимся о вашем любимце!</span>
      </div>}
      <Fld label='Формат отчётов'>
        <Chips v={f.reports||[]} c={v=>u('reports',v)} opts={[{v:'photo',l:'📸 Фото'},{v:'video',l:'🎥 Видео'},{v:'call',l:'📞 Звонок'}]} multi />
      </Fld>
      <Fld label={'Частота отчётов: '+(f.reportFreq||1)+' раз в день'}><Stepper v={f.reportFreq||1} c={v=>u('reportFreq',v)} min={1} max={4} /></Fld>
      <Fld label='Пожелания к ситтеру'><Txt v={f.wishes||''} c={v=>u('wishes',v)} ph='Опыт с крупными собаками. Без других животных...' rows={2} /></Fld>
    </div>
  );
}

function S5({ f, u, e, onClear }) {
  return (
    <div className='fu'>
      <SHero em='📞' title='Ваши контакты' sub='Будем на связи в любой ситуации 💪' />
      <div style={{ background:'#F5F0FF',borderRadius:14,padding:14,border:'1px solid #DDD0FF',marginBottom:12 }}>
        <div style={{ fontWeight:800,color:'#7B5CB8',fontSize:12.5,marginBottom:10 }}>👤 Данные владельца</div>
        <Fld label='Имя и фамилия' req err={e.ownerName}><Inp v={f.ownerName||''} c={v=>u('ownerName',v)} ph='Ваше имя' err={e.ownerName} /></Fld>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          <Fld label='Телефон' req err={e.ownerPhone}><PhoneInp v={f.ownerPhone||''} c={v=>u('ownerPhone',v)} err={e.ownerPhone} /></Fld>
          <Fld label='Email'><Inp v={f.ownerEmail||''} c={v=>u('ownerEmail',v)} ph='email@mail.ru' type='email' /></Fld>
        </div>
        <Fld label='Как связаться во время поездки?'>
          <Chips v={f.reachBy} c={v=>u('reachBy',v)} opts={[{v:'phone',l:'📞 Звонок'},{v:'whatsapp',l:'💬 WhatsApp'},{v:'telegram',l:'✈️ Telegram'},{v:'any',l:'🔔 Любым'}]} />
        </Fld>
      </div>
      <div style={{ background:'#FFF4F4',borderRadius:14,padding:14,border:'1px solid #FFC9C9',marginBottom:12 }}>
        <div style={{ fontWeight:800,color:'#C0392B',fontSize:12.5,marginBottom:4 }}>🆘 Экстренный контакт</div>
        <p style={{ margin:'0 0 10px',fontSize:12,color:MUTED }}>Позвоним, если не сможем дозвониться до вас</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
          <Fld label='Имя' req err={e.emergName}>
  <Inp v={f.emergName||''} c={v=>u('emergName',v)} ph='Имя' err={e.emergName} />
</Fld>
          <Fld label='Кем приходится'><Inp v={f.emergRel||''} c={v=>u('emergRel',v)} ph='Мама, муж...' /></Fld>
        </div>
        <Fld label='Телефон' req err={e.emergPhone}><PhoneInp v={f.emergPhone||''} c={v=>u('emergPhone',v)} err={e.emergPhone} /></Fld>
      </div>
      <div style={{ background:'#F0FBF8',borderRadius:13,padding:13,border:`1px solid #A8E6CF` }}>
        <div style={{ fontWeight:800,color:SAGE,fontSize:12.5,marginBottom:8 }}>💾 Сохранить данные о питомце</div>
        <label style={{ display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',marginBottom:8 }}>
          <input type='checkbox' checked={f.saveConsent||false} onChange={ev=>u('saveConsent',ev.target.checked)} style={{ marginTop:2,flexShrink:0,width:16,height:16,accentColor:SAGE }} />
          <span style={{ fontSize:12,color:'#555',lineHeight:1.6 }}>Согласен на хранение данных о питомце в браузере. Контактные данные не сохраняются.</span>
        </label>
        {f.saveConsent&&<button onClick={onClear} style={{ padding:'5px 12px',borderRadius:8,border:`1px solid ${BORDER}`,background:'#fff',color:MUTED,fontSize:11.5,fontWeight:700,cursor:'pointer' }}>🗑 Удалить сохранённые данные</button>}
      </div>
    </div>
  );
}

function AnimScreen({ phase, f }) {
  const em=PET_MAP[f.petType]||'🐕';
  const nm=f.petName||'ваш питомец';
  const hearts=['❤️','💕','✨','🌟','💖','😊','🐾','🎉'];
  const msgs=[
    {msg:'Отправляем заявку...',sub:'Подбираем лучшего ситтера',c:'#C9B8FF'},
    {msg:nm+' собирается в гости! 🎒',sub:'Берёт любимую игрушку',c:'#FFD580'},
    {msg:'Ситтер ждёт с распростёртыми руками!',sub:'Тепло и безопасно 🏡',c:'#90E0EF'},
    {msg:nm+' счастлив! 💖',sub:'Лучший ситтер найден!',c:'#A8F0C8'},
    {msg:'Заявка принята! 🎉',sub:'Мы свяжемся в течение 30 минут',c:'#fff'},
  ];
  const cur=msgs[Math.min(phase,4)];
  const petLeft=phase>=3?'60%':phase>=2?'46%':'12%';
  const petBottom=phase===2?55:30;
  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(160deg,#1a1028,#0f1f3d,#0a2a4a)',padding:24,overflow:'hidden',position:'relative' }}>
      {Array.from({length:28}).map((_,i)=>(
        <div key={i} style={{ position:'fixed',left:(i*41%100)+'%',top:(i*57%100)+'%',width:2,height:2,background:'#fff',borderRadius:99,opacity:.1+i%4*.12,animation:`shimmer ${1.4+i%3*.5}s ease ${i%5*.3}s infinite` }} />
      ))}
      <div style={{ position:'relative',width:300,height:180,marginBottom:32,flexShrink:0 }}>
        <div style={{ position:'absolute',left:0,bottom:0,textAlign:'center',transition:'opacity 1.4s',opacity:phase>=3?.12:1 }}>
          <div style={{ fontSize:52 }}>{phase>=4?'😊':'🧍'}</div>
          <div style={{ fontSize:11,color:'#6677AA',marginTop:2 }}>Хозяин</div>
        </div>
        <div style={{ position:'absolute',left:petLeft,bottom:petBottom,transition:'left 1.4s cubic-bezier(.68,-.55,.27,1.4), bottom .7s ease',zIndex:2 }}>
          <div style={{ fontSize:50,animation:phase>=3?'bounce .6s ease infinite':phase>=1?'float .8s ease infinite':'none',transform:phase>=2?'scaleX(-1)':'scaleX(1)',transition:'transform .3s',filter:'drop-shadow(0 4px 12px rgba(0,0,0,.2))' }}>{em}</div>
          {phase>=3&&hearts.map((h,i)=>(
            <span key={i} style={{ position:'absolute',top:(-5-i*12)+'px',left:(i%2===0?-12:16)+'px',fontSize:(11+i*2)+'px',animation:`heartFloat ${.9+i*.15}s ease ${i*.13}s infinite`,opacity:0,display:'block' }}>{h}</span>
          ))}
        </div>
        <div style={{ position:'absolute',right:0,bottom:0,textAlign:'center',transition:'opacity .6s',opacity:phase>=1?1:.2 }}>
          {phase>=2&&<div style={{ position:'absolute',top:-24,left:-12,fontSize:28,animation:'sitterArm .9s ease infinite',transformOrigin:'80% 100%' }}>🤚</div>}
          <div style={{ fontSize:52 }}>{phase>=3?'😊':'🧑'}</div>
          <div style={{ fontSize:11,color:'#6677AA',marginTop:2 }}>Ситтер</div>
        </div>
      </div>
      <div key={phase} style={{ textAlign:'center',animation:'fadeUp .45s ease' }}>
        <div style={{ fontSize:18,color:cur.c,fontWeight:900,marginBottom:5 }}>{cur.msg}</div>
        <div style={{ fontSize:13,color:'#8899BB' }}>{cur.sub}</div>
        {phase<4&&<div style={{ display:'flex',gap:8,justifyContent:'center',marginTop:14 }}>
          {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:99,background:P,animation:`bounce .7s ease ${i*.22}s infinite` }} />)}
        </div>}
      </div>
    </div>
  );
}

function SuccessScreen({ f, reset }) {
  const em=PET_MAP[f.petType]||'🐕';
  const phoneDisplay=f.ownerPhone?'+7 '+String(f.ownerPhone).replace(/(\d{3})(\d{3})(\d{2})(\d{2})/,'$1-$2-$3-$4'):'—';
  const rows=[['🐾 Питомец',[f.petName,f.breed].filter(Boolean).join(' — ')||'—'],['📅 Даты',f.dateFrom&&f.dateTo?f.dateFrom+' → '+f.dateTo:'—'],['🏡 Услуга',f.serviceType==='boarding'?'Передержка у ситтера':'Присмотр на дому'],['📞 Телефон',phoneDisplay]];
  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${CREAM},#FFF0E8)`,padding:20 }}>
      <Card style={{ maxWidth:400,width:'100%',textAlign:'center',animation:'fadeUp .5s ease' }}>
        <div style={{ fontSize:62,animation:'bounce 1.2s ease infinite' }}>{em}</div>
        <div style={{ fontSize:26,margin:'4px 0' }}>🎉</div>
        <h2 style={{ margin:'8px 0 6px',fontSize:20,color:DARK,fontWeight:900 }}>Заявка принята!</h2>
        <p style={{ color:MUTED,fontSize:13,lineHeight:1.7,marginBottom:14 }}>Подбираем ситтера для <b style={{ color:P }}>{f.petName||'вашего питомца'}</b>.<br />Ожидайте звонка в течение <b style={{ color:DARK }}>30 минут</b>.</p>
        <div style={{ background:'#FFF4F0',borderRadius:14,padding:'12px 15px',textAlign:'left',marginBottom:12,border:`1px solid ${BORDER}` }}>
          <div style={{ fontSize:12,fontWeight:800,color:P,marginBottom:7 }}>📋 Ваша заявка</div>
          {rows.map(r=><div key={r[0]} style={{ display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12.5 }}><span style={{ color:MUTED }}>{r[0]}</span><span style={{ color:'#555',fontWeight:700,textAlign:'right',maxWidth:'60%' }}>{r[1]}</span></div>)}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:14,fontSize:12,color:'#777' }}>
          {['🔒 Проверенные ситтеры','📍 Ситтер рядом с вами','💬 Связь 24/7','🏥 Ветеринарная поддержка'].map(t=>(
            <div key={t} style={{ background:'#F9F5F2',borderRadius:9,padding:'8px 6px' }}>{t}</div>
          ))}
        </div>
        <Btn onClick={reset} style={{ width:'100%' }}>Подать ещё одну заявку</Btn>
      </Card>
    </div>
  );
}

const DEF_REVIEWS=[
  {name:'Светлана М.',pet:'Персик 🐈',rating:5,text:'Оставляла кота на 2 недели. Каждый день фото и видео — Персик мурчал и разлёгся на диване ситтера. Вернулась без капли тревоги!',city:'Москва'},
  {name:'Артём и Оля',pet:'Гуча 🐕',rating:5,text:'Наша собака очень тревожная. Ситтер Анна сразу нашла к ней подход — присылала смешные видосы, как Гуча бегает за мячом. Это магия!',city:'Санкт-Петербург'},
  {name:'Дмитрий К.',pet:'Нюша 🐇',rating:5,text:'Никогда не думал, что можно уехать и не переживать за кролика. Ситтер знал всё о кормлении. Вернулся — Нюша здорова!',city:'Екатеринбург'},
];

function Reviews({ reviews }) {
  return (
    <section style={{ padding:'60px 20px',background:'#fff' }}>
      <div style={{ maxWidth:1000,margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:36 }}>
          <div style={{ fontSize:36,marginBottom:8 }}>💬</div>
          <h2 style={{ fontSize:24,fontWeight:900,color:DARK,margin:'0 0 6px' }}>Что говорят владельцы</h2>
          <p style={{ color:MUTED,fontSize:14,margin:0 }}>Реальные истории счастливых питомцев и их хозяев</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
          {reviews.map((r,i)=>(
            <div key={i} style={{ background:CREAM,borderRadius:20,padding:20,border:`1px solid ${BORDER}` }}>
              <div style={{ fontSize:20,marginBottom:10 }}>{'⭐'.repeat(r.rating)}</div>
              <p style={{ fontSize:13.5,color:'#555',lineHeight:1.7,margin:'0 0 14px' }}>“{r.text}”</p>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:38,height:38,borderRadius:99,background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',fontWeight:800,flexShrink:0 }}>{r.name[0]}</div>
                <div><div style={{ fontWeight:800,fontSize:13,color:DARK }}>{r.name}</div><div style={{ fontSize:12,color:MUTED }}>{r.pet}{r.city?' · '+r.city:''}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REQS=[{e:'❤️',t:'Искренняя любовь к животным',d:'Не работа — призвание'},{e:'🧠',t:'Ответственность',d:'Следуете инструкциям, сообщаете об изменениях'},{e:'📱',t:'Активность в мессенджерах',d:'Ежедневные фото и видео — основа доверия'},{e:'🌟',t:'Рекомендации',d:'Отзывы знакомых — большой плюс'},{e:'🎓',t:'Ветеринарное образование',d:'Не обязательно, но весомое преимущество'},{e:'🏠',t:'Комфортное жильё',d:'Для передержки — достаточно пространства'}];
function SitterSection({ onApply }) {
  return (
    <section style={{ padding:'70px 20px',background:'linear-gradient(135deg,#F0FBF8,#E8F8FF)' }}>
      <div style={{ maxWidth:960,margin:'0 auto' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:40,alignItems:'start' }}>
          <div>
            <div style={{ fontSize:12,fontWeight:800,color:SAGE,letterSpacing:1,textTransform:'uppercase',marginBottom:8 }}>Для ситтеров</div>
            <h2 style={{ fontSize:24,fontWeight:900,color:DARK,margin:'0 0 14px',lineHeight:1.3 }}>Зарабатывайте, занимаясь любимым делом 🐾</h2>
            <p style={{ fontSize:14,color:MUTED,lineHeight:1.75,marginBottom:20 }}>Присоединяйтесь к команде PawSitter — помогайте питомцам чувствовать себя как дома.</p>
            <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginBottom:22 }}>
              {['🕒 Гибкий график','💰 Достойная оплата','🐶 Любимая работа','📈 Стабильный поток'].map(b=><div key={b} style={{ padding:'7px 12px',borderRadius:20,background:'#fff',border:`1px solid ${BORDER}`,fontSize:12.5,fontWeight:700,color:'#555' }}>{b}</div>)}
            </div>
            <button onClick={onApply} style={{ padding:'14px 28px',borderRadius:14,border:'none',background:sageGrad,color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer',boxShadow:'0 4px 20px rgba(82,183,136,.35)' }}>Хочу стать ситтером →</button>
          </div>
          <div>
            <h3 style={{ fontSize:14,fontWeight:800,color:DARK,marginBottom:12 }}>Что мы ценим:</h3>
            {REQS.map((r,i)=>(
              <div key={i} style={{ display:'flex',gap:11,alignItems:'flex-start',background:'#fff',borderRadius:13,padding:'11px 13px',border:`1px solid ${BORDER}`,marginBottom:8 }}>
                <div style={{ fontSize:20,flexShrink:0 }}>{r.e}</div>
                <div><div style={{ fontWeight:800,fontSize:13,color:DARK }}>{r.t}</div><div style={{ fontSize:12,color:MUTED,marginTop:2,lineHeight:1.5 }}>{r.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SitterApply({ onBack, onError }) {
  const [sf,setSf]=useState({name:'',phone:'',email:'',city:'',petTypes:[],services:[],experience:'',hasPets:'',hasVetEdu:'',motivation:'',refs:''});
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  function su(k,v){setSf(x=>({...x,[k]:v})); setError(''); onError('');}
  async function submitSitter(){
    if(!sf.name.trim()){ setError('Введите имя и фамилию'); return; }
    if(String(sf.phone||'').replace(/\D/g,'').length<10){ setError('Введите телефон полностью'); return; }
    try {
      setBusy(true);
      const res = await fetch('/api/submit-form', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type:'sitter', payload: sf })
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку');
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось отправить заявку';
      setError(msg);
      onError(msg);
    } finally {
      setBusy(false);
    }
  }
  if(sent) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,#F0FBF8,${CREAM})`,padding:20 }}>
      <Card style={{ maxWidth:380,width:'100%',textAlign:'center' }}>
        <div style={{ fontSize:60 }}>🎉</div>
        <h2 style={{ color:DARK,fontWeight:900 }}>Заявка отправлена!</h2>
        <p style={{ color:MUTED,fontSize:14,lineHeight:1.7 }}>Рассмотрим анкету в течение 2–3 рабочих дней и свяжемся для интервью.</p>
        <Btn onClick={onBack} variant='sage' style={{ width:'100%',marginTop:16 }}>← На главную</Btn>
      </Card>
    </div>
  );
  return (
    <div style={{ minHeight:'100vh',background:`linear-gradient(135deg,#F0FBF8,${CREAM})`,padding:'20px 14px 60px' }}>
      <div style={{ maxWidth:520,margin:'0 auto' }}>
        <button onClick={onBack} style={{ border:'none',background:'none',color:MUTED,cursor:'pointer',fontSize:14,fontWeight:700,marginBottom:12,padding:0 }}>← На главную</button>
        <Card>
          <div style={{ textAlign:'center',marginBottom:22 }}>
            <div style={{ fontSize:42 }}>🧑</div>
            <h2 style={{ margin:'8px 0 5px',fontSize:20,color:DARK,fontWeight:900 }}>Стать ситтером PawSitter</h2>
            <p style={{ color:MUTED,fontSize:13,margin:0 }}>Расскажите о себе — рады новым членам команды!</p>
          </div>
          <Fld label='Имя и фамилия' req><Inp v={sf.name} c={v=>su('name',v)} ph='Ваше имя' /></Fld>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            <Fld label='Телефон' req><PhoneInp v={sf.phone} c={v=>su('phone',v)} /></Fld>
            <Fld label='Email'><Inp v={sf.email} c={v=>su('email',v)} ph='email@mail.ru' type='email' /></Fld>
          </div>
          <Fld label='Ваш город'><Inp v={sf.city} c={v=>su('city',v)} ph='Москва, СПб...' /></Fld>
          <Fld label='С какими питомцами готовы работать?'><Chips v={sf.petTypes} c={v=>su('petTypes',v)} opts={PET_TYPES.map(t=>({v:t.v,l:t.e+' '+t.l}))} multi /></Fld>
          <Fld label='Тип услуг'><Chips v={sf.services} c={v=>su('services',v)} opts={[{v:'boarding',l:'🏡 Передержка у себя'},{v:'inhome',l:'🚪 Выезд к хозяевам'}]} multi /></Fld>
          <Fld label='Ваш опыт с животными'><Chips v={sf.experience} c={v=>su('experience',v)} opts={[{v:'none',l:'Начинающий'},{v:'some',l:'Есть опыт'},{v:'rich',l:'Богатый опыт'},{v:'pro',l:'Профессионал'}]} /></Fld>
          <Fld label='Есть свои животные?'><Chips v={sf.hasPets} c={v=>su('hasPets',v)} opts={[{v:'yes',l:'Да'},{v:'no',l:'Нет'}]} /></Fld>
          <Fld label='Ветеринарное образование?'><Chips v={sf.hasVetEdu} c={v=>su('hasVetEdu',v)} opts={[{v:'yes',l:'Есть'},{v:'partial',l:'Курсы'},{v:'no',l:'Нет'}]} /></Fld>
          <Fld label='Почему хотите стать ситтером?'><Txt v={sf.motivation} c={v=>su('motivation',v)} ph='Люблю животных с детства...' rows={3} /></Fld>
          <Fld label='Рекомендации'><Txt v={sf.refs} c={v=>su('refs',v)} ph='Имя, телефон или соцсети' rows={2} /></Fld>
          {error && <div style={{ background:'#FFF1F0', color:'#B42318', border:'1px solid #FECACA', borderRadius:12, padding:'10px 12px', fontSize:13, lineHeight:1.5, marginBottom:10 }}>⚠️ {error}</div>}
          <Btn onClick={submitSitter} disabled={busy} style={{ width:'100%',marginTop:6 }}>{busy?'Отправляем...':'Отправить заявку ситтера 🐾'}</Btn>
        </Card>
      </div>
    </div>
  );
}

function Landing({ onForm, onSitter, reviews }) {
  const [speech,setSpeech]=useState(noDot(pick(START_LINES)));
  const [catNudge,setCatNudge]=useState({x:0,y:0,rot:0});
  const [pushed,setPushed]=useState(null);
  const [entered,setEntered]=useState(false);
  const hoverCooldown=useRef(0);

  useEffect(()=>{
    const t=setTimeout(()=>setEntered(true),120);
    return ()=>clearTimeout(t);
  },[]);

  useEffect(()=>{
    const idle=setInterval(()=>{
      const now=Date.now();
      if(now-hoverCooldown.current<2800) return;
      setSpeech(noDot(pick(IDLE_LINES)));
    }, 16000);
    return ()=>clearInterval(idle);
  },[]);

  useEffect(()=>{
    const timer=setInterval(()=>{
      const index=Math.floor(Math.random()*4);
      setPushed(index);
      setSpeech(noDot(pick([
        'Псс… давайте быстро сделаем тыгыдык по анкете',
        'Это не я вращаюсь. Это Вселенная вращается вокруг меня'
      ])));
      setTimeout(()=>setPushed(null), 900);
    }, 9000);
    return ()=>clearInterval(timer);
  },[]);

  const reasons=[
    {icon:'✈️', title:['Уезжаете','в отпуск'], key:'vacation'},
    {icon:'💼', title:['Командировка','на несколько дней'], key:'trip'},
    {icon:'🕘', title:['Долгий','рабочий день'], key:'workday'},
    {icon:'🐾', title:['Питомец не любит','переезды'], key:'nomoves'},
  ];

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  function handleReason(reason){
    setSpeech(noDot(REASON_LINES[reason.key]||pick(START_LINES)));
    setTimeout(()=>onForm(),1400);
  }

  function handleCatMove(e){
    const now=Date.now();
    const card=e.currentTarget.getBoundingClientRect();
    const x=e.clientX-card.left;
    const y=e.clientY-card.top;

    const dx=x<card.width/2?120:-120;
    const dy=y<card.height/2?66:-66;
    const rot=dx>0?16:-16;

    setCatNudge({x:dx,y:dy,rot});

    if(now-hoverCooldown.current>2400){
      setSpeech(noDot(pick(HOVER_LINES)));
      hoverCooldown.current=now;
    }

    setTimeout(()=>setCatNudge({x:0,y:0,rot:0}),780);
  }

    const orbit = isMobile
    ? [
        { top:'300px', left:'10px' },
        { top:'320px', right:'10px' },
        { top:'620px', left:'12px' },
        { top:'640px', right:'12px' },
      ]
    : [
        { top:'clamp(72px, 10vh, 110px)', left:'clamp(12px, 4vw, 44px)' },
        { top:'clamp(86px, 12vh, 126px)', right:'clamp(12px, 4vw, 44px)' },
        { top:'clamp(330px, 54vh, 430px)', left:'clamp(18px, 6vw, 72px)' },
        { top:'clamp(346px, 56vh, 446px)', right:'clamp(18px, 6vw, 72px)' },
      ];

  return (
    <div style={{ background:CREAM, width:'100%', overflowX:'hidden', maxWidth:'100vw' }}>
      <section
        style={{
          padding:'22px 18px 18px',
          backgroundImage: "linear-gradient(150deg, rgba(255,248,240,.88) 0%, rgba(255,244,235,.82) 40%, rgba(240,248,245,.84) 100%), url('/pawsitter-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#FFF8F0',
          position:'relative',
          overflow:'hidden',
          overflowX:'clip',
          maxWidth:'100vw',
          minHeight:'min(84vh,680px)',
          
        }}
      >
        <div style={{ maxWidth:1060,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2 }}>
          <div
            style={{
              display:'inline-flex',
              alignItems:'center',
              gap:8,
              background:'rgba(255,255,255,.9)',
              borderRadius:99,
              padding:'6px 16px',
              fontSize:12.5,
              fontWeight:700,
              color:P,
              border:`1px solid ${BORDER}`,
              marginBottom:10,
              boxShadow:'0 2px 16px rgba(232,107,79,.08)'
            }}
          >
            🐾 Надёжная забота о питомцах
          </div>

          <h1
            style={{
              fontSize:'clamp(24px,4vw,34px)',
              fontWeight:900,
              color:DARK,
              lineHeight:1.14,
              margin:'0 0 8px'
            }}
          >
            Ваш питомец в надёжных и любящих руках
          </h1>

          <p
            style={{
              fontSize:'clamp(13px,1.45vw,15.5px)',
              color:MUTED,
              lineHeight:1.6,
              margin:'0 auto 10px',
              maxWidth:660
            }}
          >
            Проверенные ситтеры с душой позаботятся о вашем любимце — дома у ситтера или у вас. Фото каждый день. Спокойствие круглосуточно
          </p>

          <div
            style={{
              position:'relative',
              height:'clamp(420px,64vh,560px)',
              maxHeight:560,
              minHeight:420,
              margin:'0 auto 2px',
              maxWidth:1060
            }}
          >
            {reasons.map((r,i)=>{
              const wobble =
                i===0 ? 'float 7s ease-in-out infinite' :
                i===1 ? 'float 9s ease-in-out infinite' :
                i===2 ? 'float 8s ease-in-out infinite' :
                        'float 10s ease-in-out infinite';

              const pushedTransform = pushed===i ? ' translate(52px,-10px) rotate(8deg)' : '';
              const enterTransform = entered ? ' translateY(0px)' : ' translateY(42vh) scale(.86)';

              return (
                <button
                  key={r.key}
                  onClick={()=>handleReason(r)}
                  style={{
                    position:'absolute',
                    ...orbit[i],
                    width: isMobile
  ? 'min(42vw, 168px)'
  : (i===1||i===3 ? 'clamp(170px,19vw,208px)' : 'clamp(156px,18vw,194px)'),
                    willChange:'transform',
                    minHeight:94,
                    borderRadius:22,
                    border:`1px solid ${BORDER}`,
                    background:'rgba(255,255,255,.76)',
                    backdropFilter:'blur(6px)',
                    WebkitBackdropFilter:'blur(6px)',
                    boxShadow:'0 8px 24px rgba(80,30,10,.07)',
                    padding:'12px 14px',
                    cursor:'pointer',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'center',
                    gap:6,
                    opacity: entered ? .76 : 0,
                    transition:'transform .75s ease, opacity .7s ease',
                    animation:wobble,
                    transform: enterTransform + pushedTransform
                  }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.opacity='1';
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.opacity='.76';
                  }}
                >
                  <div style={{ fontSize:26 }}>{r.icon}</div>
                  <div style={{ fontSize:14,fontWeight:800,color:DARK,lineHeight:1.22 }}>
                    {r.title.map((line,idx)=><div key={idx}>{line}</div>)}
                  </div>
                </button>
              );
            })}

            <div
              style={{
                position:'absolute',
                left:'50%',
                top:'52%',
                transform:'translate(-50%,-50%)',
                width:'min(92vw,430px)',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                zIndex:3,
                pointerEvents:'none'
              }}
            >
              <div
                style={{
                  background:'rgba(255,255,255,.80)',
                  border:`1px solid ${BORDER}`,
                  borderRadius:16,
                  padding:'8px 12px',
                  fontSize:12.4,
                  fontWeight:700,
                  color:DARK,
                  maxWidth:272,
                  boxShadow:'0 4px 18px rgba(80,30,10,.10)',
                  marginTop:-38,
    marginBottom:50,
                  position:'relative',
                  opacity:.88,
                  pointerEvents:'auto'
                }}
              >
                {noDot(speech)}
                <div
                  style={{
                    position:'absolute',
                    bottom:-6,
                    left:'50%',
                    marginLeft:-6,
                    width:12,
                    height:12,
                    background:'rgba(255,255,255,.80)',
                    borderRight:`1px solid ${BORDER}`,
                    borderBottom:`1px solid ${BORDER}`,
                    transform:'rotate(45deg)'
                  }}
                />
              </div>

              <img
                src='/oiia-cat.gif'
                alt='oiia cat'
                onMouseMove={handleCatMove}
                onMouseEnter={handleCatMove}
                style={{
  width:'clamp(98px,12vw,126px)',
  height:'auto',
  transform:`translate(-50%,0) translate(${catNudge.x}px,${catNudge.y}px) rotate(${catNudge.rot}deg)`,
  transition:'transform .22s ease',
  filter:'drop-shadow(0 8px 14px rgba(0,0,0,.12))',
  position:'absolute',
  left:'48%',
  top:5,
  pointerEvents:'auto'
}}
              />

              <button
                onClick={onForm}
                style={{
                  padding:'22px 46px',
                  borderRadius:18,
                  border:'none',
                  marginTop: 90,
                  background:grad,
                  color:'#fff',
                  fontWeight:900,
                  fontSize:20,
                  cursor:'pointer',
                  boxShadow:'0 10px 30px rgba(232,107,79,.28)',
                  animation:'glow 2.5s ease infinite',
                  position:'relative',
                  zIndex:5,
                  pointerEvents:'auto'
                }}
              >
                Оставить заявку 🐾
              </button>
            </div>
            
          </div>
        </div>
      </section>

      <section style={{ padding:'52px 20px',background:'#fff',borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:840,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:34 }}>
            <h2 style={{ fontSize:24,fontWeight:900,color:DARK,margin:'0 0 6px' }}>Как это работает?</h2>
            <p style={{ color:MUTED,fontSize:14,margin:0 }}>Просто, прозрачно, с заботой</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:18 }}>
            {[{n:'01',e:'📋',t:'Заполните заявку',d:'Расскажите всё о питомце — здоровье, режим, привычки'},{n:'02',e:'🤝',t:'Подберём ситтера',d:'Свяжемся в течение 30 минут и предложим кандидатов'},{n:'03',e:'🐾',t:'Знакомство',d:'Ситтер познакомится с питомцем до начала ухода'},{n:'04',e:'📸',t:'Отдыхайте',d:'Ежедневные фото и видео. Ваш любимец счастлив!'}].map(s=>(
              <div key={s.n} style={{ textAlign:'center',padding:'18px 14px',borderRadius:16,background:CREAM,border:`1px solid ${BORDER}` }}>
                <div style={{ width:38,height:38,borderRadius:99,background:grad,color:'#fff',fontWeight:900,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px' }}>{s.n}</div>
                <div style={{ fontSize:30,marginBottom:8 }}>{s.e}</div>
                <div style={{ fontWeight:800,fontSize:13,color:DARK,marginBottom:5 }}>{s.t}</div>
                <div style={{ fontSize:12.5,color:MUTED,lineHeight:1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews reviews={reviews} />
      <SitterSection onApply={onSitter} />

      <footer style={{ background:DARK,padding:'28px 20px',textAlign:'center' }}>
        <div style={{ fontSize:19,fontWeight:900,color:'#fff',marginBottom:5 }}>🐾 PawSitter</div>
        <p style={{ color:'rgba(255,255,255,.3)',fontSize:12,margin:0 }}>Забота о питомцах с любовью · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

function WarnModal({ missing, onFill, onSkip }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(45,32,21,.5)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div style={{ background:'#fff',borderRadius:22,padding:24,maxWidth:360,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,.25)',animation:'popIn .3s ease' }}>
        <div style={{ textAlign:'center',marginBottom:14 }}>
          <div style={{ fontSize:40 }}>🐾</div>
          <h3 style={{ margin:'8px 0 5px',fontSize:16,color:DARK }}>Не все данные заполнены</h3>
          <p style={{ fontSize:13,color:MUTED,margin:0,lineHeight:1.6 }}>Это поможет ситтеру лучше ухаживать за питомцем:</p>
        </div>
        <div style={{ background:CREAM,borderRadius:12,padding:'8px 14px',marginBottom:16,border:`1px solid ${BORDER}` }}>
          {missing.map((m,i)=><div key={i} style={{ fontSize:13,color:'#555',padding:'5px 0',borderBottom:i<missing.length-1?`1px solid ${BORDER}`:'none' }}>{m}</div>)}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:8 }}>
          <Btn onClick={onFill} style={{ width:'100%' }}>← Вернуться</Btn>
          <Btn onClick={onSkip} variant='outline' style={{ width:'100%' }}>Пропустить</Btn>
        </div>
      </div>
    </div>
  );
}

const TABS=[{n:1,i:'🐾',t:'Питомец'},{n:2,i:'💊',t:'Здоровье'},{n:3,i:'🏠',t:'Уход'},{n:4,i:'📅',t:'Даты'},{n:5,i:'📞',t:'Контакты'}];
function FormWizard({ step, f, u, e, onNext, onBack, onClear, submitError }) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),3500);return()=>clearInterval(t);},[step]);
  return (
    <div style={{ minHeight:'100vh',background:`linear-gradient(135deg,${CREAM},#FFF0E8)` }}>
      <div style={{ maxWidth:520,margin:'0 auto',padding:'18px 14px 88px' }}>
        <button onClick={()=>onBack('home')} style={{ border:'none',background:'none',color:MUTED,cursor:'pointer',fontSize:14,fontWeight:700,marginBottom:10,padding:0 }}>← На главную</button>
        <div style={{ textAlign:'center',marginBottom:12 }}>
          <div style={{ fontSize:20,fontWeight:900,color:P }}>🐾 PawSitter</div>
          <div style={{ fontSize:11,color:'#CCC' }}>Заявка на уход за питомцем</div>
        </div>
        <div style={{ background:BORDER,borderRadius:99,height:5,marginBottom:8,overflow:'hidden' }}>
          <div style={{ background:grad,height:'100%',width:(step/5*100)+'%',borderRadius:99,transition:'width .4s ease' }} />
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
          {TABS.map(t=>(
            <div key={t.n} style={{ textAlign:'center',flex:1 }}>
              <div style={{ width:26,height:26,borderRadius:99,background:step>=t.n?P:'#EEE',color:step>=t.n?'#fff':'#CCC',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 2px',fontWeight:800,transition:'all .3s' }}>{step>t.n?'✓':t.i}</div>
              <div style={{ fontSize:9.5,color:step===t.n?P:'#CCC',fontWeight:step===t.n?800:400 }}>{t.t}</div>
            </div>
          ))}
        </div>
        <Card style={{ marginBottom:12 }}>
          {step===1&&<S1 f={f} u={u} e={e} />}
          {step===2&&<S2 f={f} u={u} e={e} />}
          {step===3&&<S3 f={f} u={u} e={e} />}
          {step===4&&<S4 f={f} u={u} e={e} />}
          {step===5&&<S5 f={f} u={u} e={e} onClear={onClear} />}
        </Card>
        <div style={{ display:'flex',gap:10 }}>
          {step>1&&<Btn onClick={()=>onBack('step')} variant='outline' style={{ flex:1 }}>← Назад</Btn>}
          <Btn onClick={onNext} style={{ flex:step>1?2:1 }}>{step<5?'Далее →':'🐾 Отправить заявку!'}</Btn>
        </div>
        <p style={{ textAlign:'center',fontSize:11,color:'#DDD',marginTop:10 }}>Шаг {step} из 5 · 🔒 Конфиденциально</p>
      </div>
      <PetMascot step={step} petType={f.petType} tick={tick} f={f} />
    </div>
  );
}

const INIT={ petName:'',petType:'',breed:'',gender:'',age:3,weight:5, vaccinated:'yes',neutered:'',lastVet:'',allergies:[],allergyCustom:'',meds:[],noMeds:false,chronic:'',vetName:'',vetPhone:'', serviceType:'boarding',address:'',feedTimes:[],foodType:'',foodBrand:'',foodCustom:'',foodGrams:100,wetMorning:1,wetEvening:1,forbidden:'',walks:2,visits:2,sleep:'couch',habits:'', dateFrom:'',dateTo:'',reports:[],reportFreq:1,wishes:'', ownerName:'',ownerPhone:'',ownerEmail:'',reachBy:'phone', emergName:'',emergPhone:'',emergRel:'',saveConsent:false };
const SAVE_KEY='pawsitter-v1';

export default function App() {
  const [view,setView]=useState('landing');
  const [step,setStep]=useState(1);
  const [phase,setPhase]=useState(0);
  const [f,setF]=useState(INIT);
  const [err,setErr]=useState({});
  const [warn,setWarn]=useState(null);
  const [reviews]=useState(DEF_REVIEWS);
  const [submitError,setSubmitError]=useState('');

  useEffect(()=>{
    try {
      const saved=localStorage.getItem(SAVE_KEY);
      if(saved){
        const parsed=JSON.parse(saved);
        setF(prev=>({...prev,...parsed,ownerPhone:'',ownerEmail:'',emergPhone:'',emergName:'',emergRel:'',saveConsent:false}));
      }
    } catch(_){}
  },[]);

  useEffect(()=>{
    if(!f.saveConsent) return;
    try {
      const safe={ petName:f.petName,petType:f.petType,breed:f.breed,gender:f.gender,age:f.age,weight:f.weight,vaccinated:f.vaccinated,neutered:f.neutered,allergies:f.allergies,allergyCustom:f.allergyCustom,meds:f.meds,noMeds:f.noMeds,chronic:f.chronic,vetName:f.vetName,serviceType:f.serviceType,foodType:f.foodType,foodBrand:f.foodBrand,foodGrams:f.foodGrams,wetMorning:f.wetMorning,wetEvening:f.wetEvening,forbidden:f.forbidden,walks:f.walks,sleep:f.sleep,habits:f.habits };
      localStorage.setItem(SAVE_KEY,JSON.stringify(safe));
    } catch(_){}
  },[f.saveConsent,f.petName,f.petType,f.breed,f.age,f.weight,f.vaccinated,f.neutered,f.allergies,f.meds,f.noMeds,f.chronic,f.foodType,f.foodBrand,f.foodGrams,f.wetMorning,f.wetEvening,f.walks,f.sleep,f.habits,f.serviceType]);

  function u(k,v){setF(prev=>({...prev,[k]:v}));setErr(prev=>({...prev,[k]:''}));setSubmitError('');}

  function validate(){
    const e={};
    if(step===1){if(!f.petName.trim())e.petName='Введите кличку';if(!f.petType)e.petType='Выберите вид питомца';}
    if(step===4){if(!f.dateFrom)e.dateFrom='Укажите дату';if(!f.dateTo)e.dateTo='Укажите дату';}
    if(step===5){
      if(!f.ownerName.trim()) e.ownerName='Введите имя';
      if(String(f.ownerPhone||'').replace(/\D/g,'').length<10) e.ownerPhone='Введите 10 цифр номера';
      if(!(f.emergName||'').trim()) e.emergName='Укажите имя экстренного контакта';
      if(String(f.emergPhone||'').replace(/\D/g,'').length<10) e.emergPhone='Введите 10 цифр номера';
    }
    setErr(e); return Object.keys(e).length===0;
  }

  function softWarn(){
    const m=[];
    if(step===2){if(!f.vaccinated)m.push('🐾 Статус вакцинации');if(!f.lastVet)m.push('🏥 Дата последнего визита к врачу');if(!(f.allergies||[]).length)m.push('⚠️ Информация об аллергиях');}
    if(step===3){if(!f.foodType)m.push('🍽 Тип корма и рацион');}
    return m;
  }

  function advance(){setWarn(null);if(step<5){setStep(s=>s+1);return;}submitForm();}
  function goNext(){if(!validate())return;const m=softWarn();if(m.length){setWarn(m);return;}advance();}

  async function submitForm(){
    setSubmitError('');
    setView('anim'); setPhase(0);
    const timers = [
      setTimeout(()=>setPhase(1),700),
      setTimeout(()=>setPhase(2),2300),
      setTimeout(()=>setPhase(3),3800),
      setTimeout(()=>setPhase(4),5400),
    ];

    try {
      const responsePromise = fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type:'owner', payload: f })
      }).then(async (res) => {
        const data = await res.json().catch(()=>({}));
        if(!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку');
        return data;
      });

      await Promise.all([
        responsePromise,
        new Promise(resolve => setTimeout(resolve, 4200)),
      ]);

      setPhase(4);
      setTimeout(()=>setView('success'), 350);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось отправить заявку';
      setSubmitError(msg);
      setView('form');
    } finally {
      timers.forEach(clearTimeout);
    }
  }

  function handleBack(type){setSubmitError(''); if(type==='step'&&step>1)setStep(s=>s-1);else{setView('landing');setStep(1);}}
  function clearSaved(){try{localStorage.removeItem(SAVE_KEY);}catch(_){}}

  return (
    <div>
      <style>{CSS}</style>
      {view==='landing'&&<Landing onForm={()=>{setView('form');setStep(1);setSubmitError('');}} onSitter={()=>{setView('sitter');setSubmitError('');}} reviews={reviews} />}
      {view==='form'&&<FormWizard step={step} f={f} u={u} e={err} onNext={goNext} onBack={handleBack} onClear={clearSaved} submitError={submitError} />}
      {view==='sitter'&&<SitterApply onBack={()=>setView('landing')} onError={setSubmitError} />}
      {view==='anim'&&<AnimScreen phase={phase} f={f} />}
      {view==='success'&&<SuccessScreen f={f} reset={()=>{setView('landing');setF(INIT);setStep(1);}} />}
      {warn&&<WarnModal missing={warn} onFill={()=>setWarn(null)} onSkip={advance} />}
    </div>
  );
}
