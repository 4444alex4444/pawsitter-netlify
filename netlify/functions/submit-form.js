function escapeMarkdown(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function listOrDash(values, mapper = (x) => x) {
  if (!Array.isArray(values) || values.length === 0) return '—';
  return values.map(mapper).join(', ');
}

function buildOwnerMessage(f) {
  const petIcons = { dog: '🐕', cat: '🐈', rabbit: '🐇', hamster: '🐹', bird: '🦜', other: '🐾' };
  const serviceType = f.serviceType === 'boarding' ? 'Передержка у ситтера' : 'Присмотр на дому';
  const vacc = f.vaccinated === 'yes' ? '✅ Привит' : f.vaccinated === 'partial' ? '⚠️ Частично' : '❌ Нет';
  const allergies = Array.isArray(f.allergies) && f.allergies.includes('__none')
    ? 'Нет'
    : listOrDash((f.allergies || []).filter((x) => x !== '__other' && x !== '__none'));
  const meds = f.noMeds
    ? 'Не принимает'
    : listOrDash((f.meds || []).map((m) => `${m.name || 'Без названия'} ${m.dose || ''}`.trim()));

  return [
    '🐾 *Новая заявка PawSitter*',
    '',
    `*Питомец:* ${escapeMarkdown(f.petName || '—')} ${petIcons[f.petType] || ''}`,
    `*Вид:* ${escapeMarkdown(f.petType || '—')}`,
    `*Порода:* ${escapeMarkdown(f.breed || '—')}`,
    `*Возраст:* ${escapeMarkdown(f.age ?? '—')} л.`,
    `*Вес:* ${escapeMarkdown(f.weight ?? '—')} кг`,
    `*Пол:* ${escapeMarkdown(f.gender === 'male' ? 'Мальчик' : f.gender === 'female' ? 'Девочка' : '—')}`,
    `*Вакцинация:* ${escapeMarkdown(vacc)}`,
    `*Аллергии:* ${escapeMarkdown(allergies === '—' && f.allergyCustom ? f.allergyCustom : allergies)}`,
    `*Лекарства:* ${escapeMarkdown(meds)}`,
    `*Хронические особенности:* ${escapeMarkdown(f.chronic || '—')}`,
    '',
    `*Даты:* ${escapeMarkdown(f.dateFrom || '—')} → ${escapeMarkdown(f.dateTo || '—')}`,
    `*Услуга:* ${escapeMarkdown(serviceType)}`,
    f.address ? `*Адрес:* ${escapeMarkdown(f.address)}` : null,
    '',
    `*Хозяин:* ${escapeMarkdown(f.ownerName || '—')}`,
    `*Телефон:* +7${escapeMarkdown(f.ownerPhone || '')}`,
    `*Email:* ${escapeMarkdown(f.ownerEmail || '—')}`,
    `*Экстренный контакт:* ${escapeMarkdown(f.emergName || '—')} (${escapeMarkdown(f.emergRel || '—')}) +7${escapeMarkdown(f.emergPhone || '')}`,
    `*Пожелания:* ${escapeMarkdown(f.wishes || '—')}`,
  ].filter(Boolean).join('\n');
}

function buildSitterMessage(sf) {
  return [
    '🧑 *Новая анкета ситтера PawSitter*',
    '',
    `*Имя:* ${escapeMarkdown(sf.name || '—')}`,
    `*Телефон:* +7${escapeMarkdown(sf.phone || '')}`,
    `*Email:* ${escapeMarkdown(sf.email || '—')}`,
    `*Город:* ${escapeMarkdown(sf.city || '—')}`,
    `*Питомцы:* ${escapeMarkdown(listOrDash(sf.petTypes))}`,
    `*Услуги:* ${escapeMarkdown(listOrDash(sf.services))}`,
    `*Опыт:* ${escapeMarkdown(sf.experience || '—')}`,
    `*Есть свои животные:* ${escapeMarkdown(sf.hasPets || '—')}`,
    `*Ветобразование:* ${escapeMarkdown(sf.hasVetEdu || '—')}`,
    `*Мотивация:* ${escapeMarkdown(sf.motivation || '—')}`,
    `*Рекомендации:* ${escapeMarkdown(sf.refs || '—')}`,
  ].join('\n');
}

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Не настроены переменные TELEGRAM_TOKEN и TELEGRAM_CHAT_ID в Netlify.');
    }

    const body = await request.json();
    const type = body?.type;
    const payload = body?.payload || {};

    let message = '';
    if (type === 'owner') {
      if (!payload.petName || !payload.petType || !payload.ownerName || String(payload.ownerPhone || '').replace(/\D/g, '').length < 10) {
        throw new Error('Форма заполнена не полностью.');
      }
      message = buildOwnerMessage(payload);
    } else if (type === 'sitter') {
      if (!payload.name || String(payload.phone || '').replace(/\D/g, '').length < 10) {
        throw new Error('Анкета ситтера заполнена не полностью.');
      }
      message = buildSitterMessage(payload);
    } else {
      throw new Error('Неизвестный тип заявки.');
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
              }),
    });

    const telegramData = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramData.ok) {
      throw new Error('Telegram не принял сообщение. Проверь токен бота, chat id и права бота.');
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message || 'Ошибка отправки' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
