import React, { useEffect, useMemo, useRef, useState } from "react";

type PetType = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "other" | "";

type ReasonKey = "vacation" | "trip" | "workday" | "no-moves";

type OwnerPayload = {
  petName: string;
  petType: PetType;
  breed: string;
  age: string;
  weight: string;
  gender: "male" | "female" | "";
  vaccinated: "yes" | "partial" | "no" | "";
  allergies: string[];
  allergyCustom: string;
  noMeds: boolean;
  meds: { name: string; dose: string }[];
  chronic: string;

  serviceType: "boarding" | "home" | "";
  dateFrom: string;
  dateTo: string;
  address: string;

  food: string;
  walking: string;
  sleepPlace: string;
  activity: string;
  vetClinic: string;
  vetPhone: string;
  wishes: string;

  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;

  emergName: string;
  emergRel: string;
  emergPhone: string;
};

const initialOwner: OwnerPayload = {
  petName: "",
  petType: "",
  breed: "",
  age: "",
  weight: "",
  gender: "",
  vaccinated: "",
  allergies: [],
  allergyCustom: "",
  noMeds: true,
  meds: [{ name: "", dose: "" }],
  chronic: "",

  serviceType: "",
  dateFrom: "",
  dateTo: "",
  address: "",

  food: "",
  walking: "",
  sleepPlace: "",
  activity: "",
  vetClinic: "",
  vetPhone: "",
  wishes: "",

  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",

  emergName: "",
  emergRel: "",
  emergPhone: "",
};

const startPhrases = [
  "Не обращайте внимания: это не я вращаюсь, а вселенная вокруг меня.",
  "Сделаем вместе с тобой тыгыдык по заявке и опишем питомца.",
  "Псс… давайте быстро сделаем тыгыдык по анкете.",
  "Я тут не просто так. Я тут с важной кошачьей экспертизой.",
];

const hoverPhrases = [
  "Лапки убрали. Я ещё не подписывал согласие на поглаживание.",
  "Слишком быстро. Попробуйте ещё раз. С едой.",
  "Попытка контакта зафиксирована. Ухожу красиво.",
];

const idlePhrases = [
  "Я просто проверяю, всё ли тут надёжно.",
  "Кошки обычно не доверяют людям. Но этих ситтеров я проверил.",
  "Иногда лучший отпуск — это спокойный питомец дома.",
  "Я тут с инспекцией.",
  "Технически я здесь главный.",
  "Это мой стартап.",
  "Я вообще-то консультант по комфорту.",
  "Это не я вращаюсь. Это Вселенная вращается вокруг меня.",
];

const petPhrases: Record<Exclude<PetType, "">, string[]> = {
  cat: [
    "Отлично. Один пушистый начальник зарегистрирован.",
    "Кошка отмечена. Готовьте диван.",
    "Наконец-то. Кто-то признал, что кот — главный.",
  ],
  dog: [
    "О, ну всё. Кто-то будет очень сильно любить всех подряд.",
    "Принято. Запускаю режим “гулять, бегать, обожать”.",
    "Собака. Значит в этой заявке будет много движения и счастья.",
  ],
  bird: [
    "Птица? Значит будильник теперь пернатый.",
    "Птица отмечена. Готовим корм и уважение к вокалу.",
    "Птица. Значит кто-то здесь любит быть громким и красивым одновременно.",
  ],
  rabbit: [
    "Кролик. Срочно проверяем безопасность проводов.",
    "Кролик. Значит будет много ушей, скорости и внезапных исчезновений.",
  ],
  hamster: [
    "Хомяк. Маленький, а логистика как у склада.",
    "Хомяк. Кто-то здесь очень серьёзно относится к семечкам.",
    "Маленький клиент, большие амбиции.",
  ],
  other: [
    "Интересный клиент. Уже уважаю индивидуальность.",
    "Отмечено. Подстроим всё под характер и привычки.",
    "Понял. Тут нужен персональный подход.",
  ],
};

const foodPhrases = [
  "Так. Корм записал. А ночные перекусы учтены?",
  "Интересный пункт. Корм обычный… или тот, за который я вас прощу?",
  "Отлично. Я так понимаю, дегустация входит в обязанности ситтера.",
  "Принято. Но если корм невкусный — я буду смотреть осуждающе.",
  "Корм принят. Я готов проверить качество.",
  "Так, питание пошло. Начинаю верить в эту операцию.",
  "Хорошо. Значит голодный бунт откладывается.",
];

const sleepPhrases = [
  "Диван отмечен. Я разрешу ситтеру иногда там сидеть.",
  "Хороший диван? Мне нужен мягкий. И желательно ваш.",
  "Записал: диван. Отлично. Территория уже почти моя.",
  "Диван принят. Осталось уточнить — где будет спать ситтер.",
  "Диван — это важно. Без него я превращаюсь в очень недовольного кота.",
  "Отлично. Стратегическая точка отдыха обнаружена.",
  "Мягкий диван? Так, сайт начинает мне нравиться.",
  "Лежак — это достойно. Скромно, но с уважением к комфорту.",
  "Клетка? Понял. Значит безопасность и режим без импровизации.",
];

const medsPhrases = [
  "О. Таблетки. Начинается игра «поймай меня сначала».",
  "Лекарства отмечены. Я уже подозрительно смотрю.",
  "Интересно. Таблетка будет спрятана в еде?",
  "Так. Медицинский режим. Я заранее не согласен, но продолжайте.",
  "Ну всё. Пошла серьёзная сюжетная линия.",
];

const vetPhrases = [
  "Так, клиника есть. Уже спокойнее даже мне.",
  "Вижу организованных людей. Редкость.",
  "Хорошо. Медицинская часть учтена.",
  "Отлично, у питомца есть план на случай форс-мажора.",
];

const activityPhrases = [
  "Игры? Хорошо. Я обычно выигрываю.",
  "Играть — это отлично. Главное — чтобы вы не уставали.",
  "Игры отмечены. Приготовьтесь проигрывать.",
];

const walkingPhrases = [
  "Принято. У собаки будет карьера на свежем воздухе.",
  "Так. Гулять будем серьёзно.",
  "Прогулки есть. Радость официально утверждена.",
  "Хороший график. Я бы не пошёл, но поддерживаю.",
];

const datePhrases = [
  "Так… даты есть. Операция «спокойная поездка» начинается.",
  "План есть — уже хорошо. Я уважаю план и мягкие пледы.",
  "Даты записал. Найдём того, кто всё выдержит достойно.",
];

const beforeSubmitPhrases = [
  "Так… миска, диван, врач. Картина становится обнадёживающей.",
  "Я почти перестал придираться. Почти.",
  "Ну всё. Похоже, вы реально стараетесь.",
];

const afterSubmitPhrases = [
  "Ну всё. Заявка улетела. Можно выдыхать.",
  "Хм. Этот человек выглядит достаточно тёплым.",
  "Ладно. Я одобряю этого ситтера.",
  "Теперь можно спокойно планировать поездку.",
];

const reasonCards: {
  key: ReasonKey;
  title: string;
  icon: string;
  phrase: string;
}[] = [
  {
    key: "vacation",
    title: "Уезжаете\nв отпуск",
    icon: "✈️",
    phrase: "Отпуск — серьёзная причина. Давайте найдём ситтера.",
  },
  {
    key: "trip",
    title: "Командировка\nна несколько дней",
    icon: "💼",
    phrase: "Командировки случаются. Питомец должен жить спокойно.",
  },
  {
    key: "workday",
    title: "Долгий\nрабочий день",
    icon: "🕘",
    phrase: "Понимаю. Значит нужен кто-то надёжный.",
  },
  {
    key: "no-moves",
    title: "Питомец не любит\nпереезды",
    icon: "🐾",
    phrase: "Некоторые звери предпочитают оставаться дома. Мудро.",
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fieldStyle(full = false): React.CSSProperties {
  return {
    width: full ? "100%" : "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #e3d6c8",
    background: "rgba(255,255,255,0.92)",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  };
}

function sectionTitleStyle(): React.CSSProperties {
  return {
    fontSize: 18,
    fontWeight: 800,
    color: "#2e2018",
    margin: "0 0 14px",
  };
}

function labelStyle(): React.CSSProperties {
  return {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    color: "#5a463b",
  };
}

function cardButton(selected: boolean): React.CSSProperties {
  return {
    borderRadius: 18,
    padding: "14px 16px",
    border: selected ? "2px solid #ff8e5c" : "1px solid #e9ddd2",
    background: selected ? "rgba(255,142,92,0.12)" : "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 700,
    color: "#2e2018",
    transition: "all .25s ease",
    minHeight: 70,
  };
}

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [speech, setSpeech] = useState<string>(pick(startPhrases));
  const [owner, setOwner] = useState<OwnerPayload>(initialOwner);
  const [pushIndex, setPushIndex] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState("");

  const [catBaseRotation, setCatBaseRotation] = useState(0);
  const [catSpinning, setCatSpinning] = useState(false);
  const [catRotDuringSpin, setCatRotDuringSpin] = useState(0);

  const [look, setLook] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const triggeredRef = useRef<Record<string, boolean>>({});

  const orbitConfigs = useMemo(
    () => [
      {
        radiusX: 250,
        radiusY: 165,
        speed: 0.00022,
        phase: -Math.PI * 0.65,
        bobAmp: 8,
        bobSpeed: 0.0016,
      },
      {
        radiusX: 290,
        radiusY: 145,
        speed: 0.00028,
        phase: -Math.PI * 0.1,
        bobAmp: 4,
        bobSpeed: 0.0011,
      },
      {
        radiusX: 265,
        radiusY: 190,
        speed: 0.00019,
        phase: Math.PI * 0.55,
        bobAmp: 10,
        bobSpeed: 0.0014,
      },
      {
        radiusX: 300,
        radiusY: 175,
        speed: 0.00024,
        phase: Math.PI * 0.95,
        bobAmp: 6,
        bobSpeed: 0.0019,
      },
    ],
    []
  );

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setTime(Date.now()), 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setLook({
        x: Math.max(-8, Math.min(8, dx * 18)),
        y: Math.max(-6, Math.min(6, dy * 14)),
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const idle = setInterval(() => {
      setSpeech((prev) => {
        const next = pick(idlePhrases);
        return next === prev ? pick(idlePhrases) : next;
      });
    }, 15000);
    return () => clearInterval(idle);
  }, []);

  useEffect(() => {
    const spinCycle = () => {
      setCatSpinning(true);
      setCatRotDuringSpin(0);

      const spinStart = performance.now();
      const spinDuration = 1700;
      const extraRotation = 580;

      let raf = 0;
      const step = (now: number) => {
        const p = Math.min(1, (now - spinStart) / spinDuration);
        const eased = p < 0.08 ? 0 : p;
        setCatRotDuringSpin(extraRotation * eased);
        if (p < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setCatBaseRotation((r) => r + extraRotation);
          setCatRotDuringSpin(0);
          setCatSpinning(false);
        }
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    };

    let cleanup: (() => void) | undefined;
    const interval = setInterval(() => {
      cleanup = spinCycle();
    }, 4200);

    cleanup = spinCycle();

    return () => {
      clearInterval(interval);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const index = Math.floor(Math.random() * reasonCards.length);
      setPushIndex(index);
      setTimeout(() => setPushIndex(null), 700);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const openForm = (phrase?: string) => {
    setShowForm(true);
    if (phrase) setSpeech(phrase);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const onReasonClick = (reason: (typeof reasonCards)[number]) => {
    openForm(reason.phrase);
  };

  const onCatHover = () => {
    setSpeech(pick(hoverPhrases));
  };

  const updateOwner = <K extends keyof OwnerPayload>(key: K, value: OwnerPayload[K]) => {
    setOwner((prev) => ({ ...prev, [key]: value }));
  };

  const triggerOnce = (key: string, phrases: string[]) => {
    if (triggeredRef.current[key]) return;
    triggeredRef.current[key] = true;
    setSpeech(pick(phrases));
  };

  useEffect(() => {
    if (owner.petType) {
      triggerOnce(`pet:${owner.petType}`, petPhrases[owner.petType as Exclude<PetType, "">] || idlePhrases);
    }
  }, [owner.petType]);

  useEffect(() => {
    if (owner.food.trim().length >= 4) {
      triggerOnce("food", foodPhrases);
    }
  }, [owner.food]);

  useEffect(() => {
    if (owner.sleepPlace.trim().length >= 3) {
      triggerOnce("sleepPlace", sleepPhrases);
    }
  }, [owner.sleepPlace]);

  useEffect(() => {
    if (!owner.noMeds || owner.chronic.trim().length > 2) {
      triggerOnce("meds", medsPhrases);
    }
  }, [owner.noMeds, owner.chronic]);

  useEffect(() => {
    if (owner.vetClinic.trim().length > 1 || owner.vetPhone.trim().length >= 6) {
      triggerOnce("vet", vetPhrases);
    }
  }, [owner.vetClinic, owner.vetPhone]);

  useEffect(() => {
    if (owner.activity.trim().length > 2) {
      triggerOnce("activity", activityPhrases);
    }
  }, [owner.activity]);

  useEffect(() => {
    if (owner.petType === "dog" && owner.walking.trim().length > 1) {
      triggerOnce("walking", walkingPhrases);
    }
  }, [owner.petType, owner.walking]);

  useEffect(() => {
    if (owner.dateFrom || owner.dateTo) {
      triggerOnce("dates", datePhrases);
    }
  }, [owner.dateFrom, owner.dateTo]);

  const validate = () => {
    if (!owner.petName || !owner.petType || !owner.ownerName) {
      return "Пожалуйста, заполните имя питомца, тип питомца и имя владельца.";
    }
    if (String(owner.ownerPhone || "").replace(/\D/g, "").length < 10) {
      return "Телефон владельца выглядит неполным.";
    }
    if (!owner.serviceType) {
      return "Выберите формат услуги.";
    }
    if (!owner.dateFrom || !owner.dateTo) {
      return "Укажите даты.";
    }
    return "";
  };

  const submitOwner = async () => {
    const error = validate();
    if (error) {
      setSubmitError(error);
      setSpeech("Тут не хватает пары важных деталей. Я пока не могу это красиво одобрить.");
      return;
    }

    setSubmitError("");
    setSubmitState("submitting");
    setSpeech(pick(beforeSubmitPhrases));

    try {
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "owner", payload: owner }),
      });

      const data = await response.json().catch(() => ({ ok: false, error: "Некорректный ответ сервера." }));

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Не удалось отправить заявку.");
      }

      setSubmitState("success");
      setSpeech(pick(afterSubmitPhrases));
    } catch (e: any) {
      setSubmitState("idle");
      setSubmitError(e?.message || "Ошибка отправки.");
      setSpeech("Я бы с радостью сказал, что всё улетело, но сервер сейчас драматизирует.");
    }
  };

  const heroCardStyle = (index: number): React.CSSProperties => {
    const cfg = orbitConfigs[index];
    const angle = time * cfg.speed + cfg.phase;
    const bob = Math.sin(time * cfg.bobSpeed + index) * cfg.bobAmp;
    const x = Math.cos(angle) * cfg.radiusX;
    const y = Math.sin(angle) * cfg.radiusY + bob;

    const pushed = pushIndex === index;
    const pushX = pushed ? 60 : 0;
    const pushRot = pushed ? 8 : 0;

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${x + pushX}px), calc(-50% + ${y}px)) rotate(${pushRot}deg) scale(${
        pushed ? 1.03 : 1
      })`,
      transition: pushed ? "transform 0.6s ease" : "transform 0.18s linear",
      width: 178,
      minHeight: 106,
      borderRadius: 22,
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      boxShadow: "0 10px 28px rgba(58,35,24,0.08)",
      border: "1px solid rgba(235,220,207,0.9)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      cursor: "pointer",
      userSelect: "none",
      textAlign: "center",
      padding: "16px 14px",
      opacity: 0.78,
    };
  };

  const catRotation = catBaseRotation + catRotDuringSpin;
  const catTransform = `translate(${look.x}px, ${look.y}px) rotate(${catRotation}deg)`;

  return (
    <div style={styles.page}>
      <section ref={heroRef} style={styles.hero}>
        <div style={styles.heroBadge}>🐾 Надёжная забота о питомцах</div>

        <h1 style={styles.heroTitle}>Ваш питомец в надёжных и любящих руках</h1>

        <p style={styles.heroSubtitle}>
          Проверенные ситтеры с душой позаботятся о любимце дома у ситтера или у вас.
          Фото каждый день. Спокойствие круглосуточно.
        </p>

        <div style={styles.orbitWrap}>
          {reasonCards.map((reason, i) => (
            <div
              key={reason.key}
              style={heroCardStyle(i)}
              onClick={() => onReasonClick(reason)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "1";
                (e.currentTarget as HTMLDivElement).style.zIndex = "4";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "0.78";
                (e.currentTarget as HTMLDivElement).style.zIndex = "1";
              }}
            >
              <div style={{ fontSize: 26 }}>{reason.icon}</div>
              <div style={styles.reasonText}>
                {reason.title.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          ))}

          <div style={styles.centerCluster}>
            <div style={styles.speechBubble}>{speech}</div>

            <div style={styles.catZone}>
              <img
                src="/oiia-cat.gif"
                alt="OIIA cat"
                onMouseEnter={onCatHover}
                style={{
                  ...styles.cat,
                  transform: catTransform,
                }}
              />
            </div>

            <button style={styles.mainCta} onClick={() => openForm("Сделаем вместе с тобой тыгыдык по заявке и опишем питомца.")}>
              Оставить заявку
            </button>
          </div>

          <button style={styles.sitterCta}>Стать ситтером →</button>
        </div>
      </section>

      <section ref={formRef} style={styles.formSection}>
        <div style={styles.formCard}>
          <div style={styles.formTopLine}>
            <div style={styles.formPaw}>🐾</div>
            <div>
              <div style={styles.formEyebrow}>Заявка PawSitter</div>
              <h2 style={styles.formTitle}>Опишем питомца спокойно и по делу</h2>
            </div>
          </div>

          {submitState === "success" ? (
            <div style={styles.successCard}>
              <div style={{ fontSize: 48 }}>💌</div>
              <div style={styles.successTitle}>Заявка отправлена</div>
              <div style={styles.successText}>
                Мы уже передали её дальше. Можно выдыхать и спокойно планировать дела.
              </div>
            </div>
          ) : (
            <>
              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Питомец</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Кличка питомца</label>
                    <input
                      style={fieldStyle()}
                      value={owner.petName}
                      onChange={(e) => updateOwner("petName", e.target.value)}
                      placeholder="Барсик, Руна, Киви..."
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Тип питомца</label>
                    <select
                      style={fieldStyle()}
                      value={owner.petType}
                      onChange={(e) => updateOwner("petType", e.target.value as PetType)}
                    >
                      <option value="">Выберите</option>
                      <option value="dog">Собака</option>
                      <option value="cat">Кошка</option>
                      <option value="bird">Птица</option>
                      <option value="rabbit">Кролик</option>
                      <option value="hamster">Хомяк / мелкий питомец</option>
                      <option value="other">Другой питомец</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle()}>Порода / вид</label>
                    <input
                      style={fieldStyle()}
                      value={owner.breed}
                      onChange={(e) => updateOwner("breed", e.target.value)}
                      placeholder="Например, корги / британец / волнистый попугай"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Возраст</label>
                    <input
                      style={fieldStyle()}
                      value={owner.age}
                      onChange={(e) => updateOwner("age", e.target.value)}
                      placeholder="Например, 3"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Вес</label>
                    <input
                      style={fieldStyle()}
                      value={owner.weight}
                      onChange={(e) => updateOwner("weight", e.target.value)}
                      placeholder="Например, 5.2"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Пол</label>
                    <select
                      style={fieldStyle()}
                      value={owner.gender}
                      onChange={(e) => updateOwner("gender", e.target.value as "male" | "female" | "")}
                    >
                      <option value="">Выберите</option>
                      <option value="male">Мальчик</option>
                      <option value="female">Девочка</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Здоровье и безопасность</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Вакцинация</label>
                    <select
                      style={fieldStyle()}
                      value={owner.vaccinated}
                      onChange={(e) => updateOwner("vaccinated", e.target.value as OwnerPayload["vaccinated"])}
                    >
                      <option value="">Выберите</option>
                      <option value="yes">Да</option>
                      <option value="partial">Частично</option>
                      <option value="no">Нет</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle()}>Хронические особенности</label>
                    <input
                      style={fieldStyle()}
                      value={owner.chronic}
                      onChange={(e) => updateOwner("chronic", e.target.value)}
                      placeholder="Если есть"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Есть ли лекарства?</label>
                    <div style={styles.choiceRow}>
                      <button
                        type="button"
                        style={cardButton(owner.noMeds)}
                        onClick={() => updateOwner("noMeds", true)}
                      >
                        Нет, лекарства не нужны
                      </button>
                      <button
                        type="button"
                        style={cardButton(!owner.noMeds)}
                        onClick={() => updateOwner("noMeds", false)}
                      >
                        Да, есть лекарства
                      </button>
                    </div>
                  </div>

                  {!owner.noMeds && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={styles.grid2}>
                        <div>
                          <label style={labelStyle()}>Название лекарства</label>
                          <input
                            style={fieldStyle()}
                            value={owner.meds[0]?.name || ""}
                            onChange={(e) =>
                              updateOwner("meds", [{ ...owner.meds[0], name: e.target.value, dose: owner.meds[0]?.dose || "" }])
                            }
                            placeholder="Например, таблетки / капли"
                          />
                        </div>
                        <div>
                          <label style={labelStyle()}>Дозировка / комментарий</label>
                          <input
                            style={fieldStyle()}
                            value={owner.meds[0]?.dose || ""}
                            onChange={(e) =>
                              updateOwner("meds", [{ ...owner.meds[0], dose: e.target.value, name: owner.meds[0]?.name || "" }])
                            }
                            placeholder="Например, 2 раза в день"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={labelStyle()}>Ветклиника</label>
                    <input
                      style={fieldStyle()}
                      value={owner.vetClinic}
                      onChange={(e) => updateOwner("vetClinic", e.target.value)}
                      placeholder="Если есть любимая клиника"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Телефон ветклиники</label>
                    <input
                      style={fieldStyle()}
                      value={owner.vetPhone}
                      onChange={(e) => updateOwner("vetPhone", e.target.value)}
                      placeholder="+7..."
                    />
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Уход</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Тип услуги</label>
                    <select
                      style={fieldStyle()}
                      value={owner.serviceType}
                      onChange={(e) => updateOwner("serviceType", e.target.value as OwnerPayload["serviceType"])}
                    >
                      <option value="">Выберите</option>
                      <option value="boarding">Передержка у ситтера</option>
                      <option value="home">Присмотр на дому</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle()}>Питание / корм</label>
                    <input
                      style={fieldStyle()}
                      value={owner.food}
                      onChange={(e) => updateOwner("food", e.target.value)}
                      placeholder="Что ест, как часто, есть ли особенности"
                    />
                  </div>

                  {owner.petType === "dog" && (
                    <div>
                      <label style={labelStyle()}>Прогулки</label>
                      <input
                        style={fieldStyle()}
                        value={owner.walking}
                        onChange={(e) => updateOwner("walking", e.target.value)}
                        placeholder="Например, 2 раза в день по 30 минут"
                      />
                    </div>
                  )}

                  <div>
                    <label style={labelStyle()}>Игры / активность</label>
                    <input
                      style={fieldStyle()}
                      value={owner.activity}
                      onChange={(e) => updateOwner("activity", e.target.value)}
                      placeholder="Любит играть, бегать, сидеть тихо..."
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Где спит / отдыхает</label>
                    <input
                      style={fieldStyle(true)}
                      value={owner.sleepPlace}
                      onChange={(e) => updateOwner("sleepPlace", e.target.value)}
                      placeholder="Диван, лежак, клетка, домик..."
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Пожелания</label>
                    <textarea
                      style={{ ...fieldStyle(true), minHeight: 110, resize: "vertical" }}
                      value={owner.wishes}
                      onChange={(e) => updateOwner("wishes", e.target.value)}
                      placeholder="Любимые ритуалы, привычки, что важно учесть"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Даты и место</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Дата начала</label>
                    <input
                      type="date"
                      style={fieldStyle()}
                      value={owner.dateFrom}
                      onChange={(e) => updateOwner("dateFrom", e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Дата окончания</label>
                    <input
                      type="date"
                      style={fieldStyle()}
                      value={owner.dateTo}
                      onChange={(e) => updateOwner("dateTo", e.target.value)}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Адрес / район</label>
                    <input
                      style={fieldStyle(true)}
                      value={owner.address}
                      onChange={(e) => updateOwner("address", e.target.value)}
                      placeholder="Если нужен присмотр на дому или важен район"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Контакты владельца</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Имя владельца</label>
                    <input
                      style={fieldStyle()}
                      value={owner.ownerName}
                      onChange={(e) => updateOwner("ownerName", e.target.value)}
                      placeholder="Как к вам обращаться"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Телефон</label>
                    <input
                      style={fieldStyle()}
                      value={owner.ownerPhone}
                      onChange={(e) => updateOwner("ownerPhone", e.target.value)}
                      placeholder="+7..."
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Email</label>
                    <input
                      style={fieldStyle(true)}
                      value={owner.ownerEmail}
                      onChange={(e) => updateOwner("ownerEmail", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={sectionTitleStyle()}>Экстренный контакт</div>
                <div style={styles.grid2}>
                  <div>
                    <label style={labelStyle()}>Имя</label>
                    <input
                      style={fieldStyle()}
                      value={owner.emergName}
                      onChange={(e) => updateOwner("emergName", e.target.value)}
                      placeholder="Если понадобится связаться"
                    />
                  </div>

                  <div>
                    <label style={labelStyle()}>Кем приходится</label>
                    <input
                      style={fieldStyle()}
                      value={owner.emergRel}
                      onChange={(e) => updateOwner("emergRel", e.target.value)}
                      placeholder="Друг, родственник..."
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle()}>Телефон</label>
                    <input
                      style={fieldStyle(true)}
                      value={owner.emergPhone}
                      onChange={(e) => updateOwner("emergPhone", e.target.value)}
                      placeholder="+7..."
                    />
                  </div>
                </div>
              </div>

              {submitError && <div style={styles.errorBox}>{submitError}</div>}

              <div style={styles.submitRow}>
                <button
                  style={{
                    ...styles.submitButton,
                    opacity: submitState === "submitting" ? 0.7 : 1,
                    cursor: submitState === "submitting" ? "default" : "pointer",
                  }}
                  onClick={submitOwner}
                  disabled={submitState === "submitting"}
                >
                  {submitState === "submitting" ? "Отправляем..." : "Отправить заявку"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6efe7 0%, #f3ede6 52%, #eef3ef 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#2a1f19",
  },

  hero: {
    minHeight: "100vh",
    padding: "48px 20px 32px",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  },

  heroBadge: {
    width: "fit-content",
    margin: "0 auto 28px",
    padding: "12px 20px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #e6d9cc",
    boxShadow: "0 6px 18px rgba(71,47,31,0.05)",
    fontWeight: 700,
    color: "#db7c59",
  },

  heroTitle: {
    margin: "0 auto 20px",
    textAlign: "center",
    maxWidth: 860,
    fontSize: "clamp(40px, 6vw, 74px)",
    lineHeight: 1.03,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#271a13",
  },

  heroSubtitle: {
    maxWidth: 820,
    margin: "0 auto 34px",
    textAlign: "center",
    color: "#8f8177",
    fontSize: "clamp(18px, 2vw, 22px)",
    lineHeight: 1.7,
  },

  orbitWrap: {
    position: "relative",
    maxWidth: 1080,
    margin: "0 auto",
    minHeight: 640,
  },

  centerCluster: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },

  speechBubble: {
    maxWidth: 430,
    textAlign: "center",
    padding: "18px 22px",
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #eadfd5",
    borderRadius: 26,
    boxShadow: "0 14px 30px rgba(56,34,22,0.08)",
    fontWeight: 800,
    fontSize: 18,
    lineHeight: 1.45,
    marginBottom: 12,
    position: "relative",
    pointerEvents: "auto",
  },

  catZone: {
    width: 180,
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    pointerEvents: "auto",
  },

  cat: {
    width: 124,
    height: 124,
    objectFit: "contain",
    transformOrigin: "center center",
    transition: "transform 0.08s linear",
    filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.12))",
    userSelect: "none",
  },

  mainCta: {
    pointerEvents: "auto",
    border: "none",
    background: "linear-gradient(135deg, #ff8b5c 0%, #f3a757 100%)",
    color: "white",
    fontWeight: 900,
    fontSize: 20,
    padding: "22px 46px",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    cursor: "pointer",
  },

  sitterCta: {
    position: "absolute",
    right: 20,
    bottom: 12,
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.86)",
    color: "#6d594c",
    fontWeight: 800,
    fontSize: 17,
    padding: "14px 20px",
    borderRadius: 18,
    cursor: "pointer",
    opacity: 0.72,
    zIndex: 5,
  },

  reasonText: {
    fontWeight: 800,
    fontSize: 17,
    lineHeight: 1.28,
    color: "#382821",
  },

  formSection: {
    padding: "12px 16px 80px",
  },

  formCard: {
    maxWidth: 980,
    margin: "0 auto",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid #eee0d4",
    borderRadius: 28,
    boxShadow: "0 18px 46px rgba(65,42,28,0.07)",
    padding: 24,
  },

  formTopLine: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },

  formPaw: {
    width: 52,
    height: 52,
    display: "grid",
    placeItems: "center",
    fontSize: 26,
    borderRadius: 16,
    background: "rgba(255,143,96,0.14)",
  },

  formEyebrow: {
    fontSize: 13,
    fontWeight: 800,
    color: "#d46f48",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: 4,
  },

  formTitle: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.15,
    color: "#291b15",
  },

  section: {
    background: "rgba(252,248,244,0.78)",
    border: "1px solid #f0e2d6",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },

  choiceRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },

  submitRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 24,
  },

  submitButton: {
    border: "none",
    background: "linear-gradient(135deg, #ff8b5c 0%, #f3a757 100%)",
    color: "white",
    fontWeight: 900,
    fontSize: 18,
    padding: "18px 34px",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
  },

  errorBox: {
    marginTop: 10,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(255,90,90,0.08)",
    border: "1px solid rgba(255,110,110,0.2)",
    color: "#8b2e2e",
    fontWeight: 700,
  },

  successCard: {
    textAlign: "center",
    padding: "48px 20px 38px",
    borderRadius: 24,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #efe0d4",
  },

  successTitle: {
    fontSize: 30,
    fontWeight: 900,
    marginTop: 12,
    marginBottom: 10,
  },

  successText: {
    maxWidth: 620,
    margin: "0 auto",
    color: "#76645a",
    fontSize: 18,
    lineHeight: 1.7,
  },
};
