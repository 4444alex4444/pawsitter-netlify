function escapeText(value = '') {
  return String(value ?? '');
}

function listOrDash(values, mapper = (x) => x) {
  if (!Array.isArray(values) || values.length === 0) return '—';
  return values.map(mapper).join(', ');
}

function buildOwnerMessage(f) {
  const petIcons = {
    dog: '🐕',
    cat: '🐈',
    rabbit: '🐇',
    hamster: '🐹',
    bird: '🦜',
    other: '🐾',
  };

  const serviceType =
    f.serviceType === 'boarding' ? 'Передержка у ситтера' : 'Присмотр на дому';

  const vacc =
    f.vaccinated === 'yes'
      ? '✅ Привит'
      : f.vaccinated === 'partial'
        ? '⚠️ Частично'
        : '❌ Нет';

  const allergies =
    Array.isArray(f.allergies) && f.allergies.includes('__none')
      ? 'Нет'
      : listOrDash((f.allergies || []).filter((x) => x !== '__other' && x !== '__none'));

  const meds = f.noMeds
    ? 'Не принимает'
    : listOrDash((f.meds || []).map((m) => `${m.name || 'Без названия'} ${m.dose || ''}`.trim()));

  return [
    '🐾 Новая заявка PawSitter',
    '',
    `Питомец: ${escapeText(f.petName || '—')} ${petIcons[f.petType] || ''}`,
    `Вид: ${escapeText(f.petType || '—')}`,
    `Порода: ${escapeText(f.breed || '—')}`,
    `Возраст: ${escapeText(f.age ?? '—')} л.`,
    `Вес: ${escapeText(f.weight ?? '—')} кг`,
    `Пол: ${escapeText(
      f.gender === 'male' ? 'Мальчик' : f.gender === 'female' ? 'Девочка' : '—'
    )}`,
    `Вакцинация: ${escapeText(vacc)}`,
    `Аллергии: ${escapeText(allergies === '—' && f.allergyCustom ? f.allergyCustom : allergies)}`,
    `Лекарства: ${escapeText(meds)}`,
    `Хронические особенности: ${escapeText(f.chronic || '—')}`,
    '',
    `Даты: ${escapeText(f.dateFrom || '—')} → ${escapeText(f.dateTo || '—')}`,
    `Услуга: ${escapeText(serviceType)}`,
    f.address ? `Адрес: ${escapeText(f.address)}` : null,
    '',
    `Хозяин: ${escapeText(f.ownerName || '—')}`,
    `Телефон: +7${escapeText(f.ownerPhone || '')}`,
    `Email: ${escapeText(f.ownerEmail || '—')}`,
    `Экстренный контакт: ${escapeText(f.emergName || '—')} (${escapeText(
      f.emergRel || '—'
    )}) +7${escapeText(f.emergPhone || '')}`,
    `Пожелания: ${escapeText(f.wishes || '—')}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function buildSitterMessage(sf) {
  return [
    '🧑 Новая анкета ситтера PawSitter',
    '',
    `Имя: ${escapeText(sf.name || '—')}`,
    `Телефон: +7${escapeText(sf.phone || '')}`,
    `Email: ${escapeText(sf.email || '—')}`,
    `Город: ${escapeText(sf.city || '—')}`,
    `Питомцы: ${escapeText(listOrDash(sf.petTypes))}`,
    `Услуги: ${escapeText(listOrDash(sf.services))}`,
    `Опыт: ${escapeText(sf.experience || '—')}`,
    `Есть свои животные: ${escapeText(sf.hasPets || '—')}`,
    `Ветобразование: ${escapeText(sf.hasVetEdu || '—')}`,
    `Мотивация: ${escapeText(sf.motivation || '—')}`,
    `Рекомендации: ${escapeText(sf.refs || '—')}`,
  ].join('\n');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function GET() {
  return json({ ok: true, route: 'submit-form' });
}

export async function POST(request) {
  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      return json(
        { ok: false, error: 'Не настроены переменные TELEGRAM_TOKEN и TELEGRAM_CHAT_ID в Vercel.' },
        500
      );
    }

    const body = await request.json();
    const type = body?.type;
    const payload = body?.payload || {};

    let message = '';

    if (type === 'owner') {
      if (
        !payload.petName ||
        !payload.petType ||
        !payload.ownerName ||
        String(payload.ownerPhone || '').replace(/\D/g, '').length < 10
      ) {
        return json({ ok: false, error: 'Форма заполнена не полностью.' }, 400);
      }
      message = buildOwnerMessage(payload);
    } else if (type === 'sitter') {
      if (!payload.name || String(payload.phone || '').replace(/\D/g, '').length < 10) {
        return json({ ok: false, error: 'Анкета ситтера заполнена не полностью.' }, 400);
      }
      message = buildSitterMessage(payload);
    } else {
      return json({ ok: false, error: 'Неизвестный тип заявки.' }, 400);
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      return json(
        {
          ok: false,
          error: 'Telegram не принял сообщение. Проверь токен бота, chat id и права бота.',
          telegram: telegramData,
        },
        502
      );
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: error?.message || 'Ошибка отправки' }, 500);
  }
}
