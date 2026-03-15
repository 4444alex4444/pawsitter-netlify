import { useState, useEffect, useRef } from "react"

const REASONS = [
  "Уезжаете в отпуск",
  "Командировка на несколько дней",
  "Долгий рабочий день",
  "Питомец не любит переезды"
]

const HOVER_LINES = [
  "Эй, осторожно",
  "Щекотно лапам",
  "Я тут главный наблюдатель",
  "Сейчас сбегу"
]

const PUSH_LINES = [
  "Слишком близко летает",
  "Проверяю орбиту",
  "Так лучше"
]

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function noDot(t: string) {
  return t.replace(/\.$/, "")
}

export default function App() {
  const [screen, setScreen] = useState<"landing"|"form"|"sitter">("landing")

  if (screen === "form") return <FormWizard onBack={()=>setScreen("landing")} />
  if (screen === "sitter") return <SitterApply onBack={()=>setScreen("landing")} />

  return <Landing onForm={()=>setScreen("form")} onSitter={()=>setScreen("sitter")} />
}

function Landing({ onForm, onSitter }) {

  const [speech,setSpeech] = useState("Я слежу за порядком")
  const [catPos,setCatPos] = useState({x:0,y:0})
  const [pushed,setPushed] = useState<number|null>(null)

  const lastHover = useRef(0)

  function handleMove(e:any){

    const now = Date.now()

    if(now-lastHover.current > 2500){
      setSpeech(noDot(pick(HOVER_LINES)))
      lastHover.current = now
    }

    const dx = (Math.random()*240-120)
    const dy = (Math.random()*120-60)

    setCatPos({x:dx,y:dy})
  }

  useEffect(()=>{

    const id = setInterval(()=>{

      const i = Math.floor(Math.random()*4)
      setPushed(i)
      setSpeech(noDot(pick(PUSH_LINES)))

      setTimeout(()=>setPushed(null),800)

    },9000)

    return ()=>clearInterval(id)

  },[])

  return (

  <div style={{minHeight:"100vh",overflow:"hidden",position:"relative"}}>

    <h1 style={{textAlign:"center",marginTop:40}}>
      Найдём заботливого ситтера для вашего питомца
    </h1>

    <div style={{textAlign:"center",marginTop:20}}>

      <button onClick={onForm}
      style={{padding:"22px 46px",fontSize:20}}>
      Оставить заявку
      </button>

    </div>

    <img
      src="/oiia-cat.gif"
      onMouseMove={handleMove}
      style={{
        position:"absolute",
        left:"50%",
        top:"50%",
        width:120,
        transform:`translate(-50%,-50%) translate(${catPos.x}px,${catPos.y}px)`
      }}
    />

    <div style={{
      position:"absolute",
      left:"50%",
      top:"50%",
      transform:"translate(-50%,60px)",
      background:"white",
      padding:10,
      opacity:0.85
    }}>
      {speech}
    </div>

    {REASONS.map((r,i)=>{

      const orbit = [
        {top:"10%",left:"5%"},
        {top:"15%",right:"5%"},
        {bottom:"10%",left:"6%"},
        {bottom:"14%",right:"7%"}
      ][i]

      return (
      <div key={i}
      style={{
        position:"absolute",
        ...orbit,
        opacity:0.75,
        transform:pushed===i?"translate(60px) rotate(8deg)":"none",
        transition:"transform 0.6s"
      }}>
        {r}
      </div>)
    })}

    <button
    onClick={onSitter}
    style={{
      position:"absolute",
      right:30,
      bottom:30
    }}>
      Стать ситтером
    </button>

  </div>)
}

function FormWizard({ onBack }){

  const [step,setStep]=useState(1)
  const [data,setData]=useState({})

  function submit(){

    fetch("/api/submit-form",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({type:"owner",payload:data})
    })

  }

  return (
  <div>

    <button onClick={onBack}>Назад</button>

    <h2>Шаг {step}</h2>

    {step<5 && <button onClick={()=>setStep(step+1)}>Далее</button>}

    {step===5 && <button onClick={submit}>Отправить</button>}

  </div>)
}

function SitterApply({ onBack }){

  const [name,setName]=useState("")
  const [phone,setPhone]=useState("")

  function submit(){

    fetch("/api/submit-form",{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        type:"sitter",
        payload:{name,phone}
      })
    })

  }

  return (
  <div>

    <button onClick={onBack}>Назад</button>

    <h2>Анкета ситтера</h2>

    <input placeholder="Имя"
      value={name}
      onChange={e=>setName(e.target.value)}
    />

    <input placeholder="Телефон"
      value={phone}
      onChange={e=>setPhone(e.target.value)}
    />

    <button onClick={submit}>
      Отправить
    </button>

  </div>)
}
