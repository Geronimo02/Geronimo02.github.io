// Agregar aquí únicamente eventos confirmados. La fecha define si aparecen
// en "Por venir" o en "Lo que pasó" de forma automática.
// Ejemplo de formato (sin publicar datos de muestra):
// { title, date: 'AAAA-MM-DD', time: '20:00', category, description,
//   image: 'assets/afiche.jpg', imageAlt, url, linkLabel }
const events = [];

const today = new Date();
const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function createEventCard(event) {
  const article = document.createElement('article');
  article.className = 'event-card';

  if (event.image) {
    const image = document.createElement('img');
    image.src = event.image;
    image.alt = event.imageAlt || '';
    image.loading = 'lazy';
    article.append(image);
  } else {
    article.classList.add('event-card--text');
  }

  const content = document.createElement('div');
  const date = document.createElement('time');
  date.className = 'event-date';
  date.dateTime = event.date;
  date.textContent = dateFormatter.format(new Date(`${event.date}T12:00:00Z`)) + (event.time ? ` · ${event.time} hs` : '');
  content.append(date);

  const title = document.createElement('h4');
  title.textContent = event.title;
  content.append(title);

  if (event.category || event.description) {
    const description = document.createElement('p');
    description.textContent = [event.category, event.description].filter(Boolean).join(' · ');
    content.append(description);
  }

  if (event.url) {
    const link = document.createElement('a');
    link.className = 'event-link';
    link.href = event.url;
    link.textContent = event.linkLabel || 'Ver detalles ↗';
    if (/^https?:\/\//i.test(event.url)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    content.append(link);
  }

  article.append(content);
  return article;
}

const confirmedEvents = events.filter(event => event.title && /^\d{4}-\d{2}-\d{2}$/.test(event.date));
const upcoming = confirmedEvents.filter(event => event.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
const past = confirmedEvents.filter(event => event.date < todayKey).sort((a, b) => b.date.localeCompare(a.date));

for (const [kind, items] of [['upcoming', upcoming], ['past', past]]) {
  const list = document.getElementById(`events-${kind}`);
  const empty = document.getElementById(`events-${kind}-empty`);
  if (items.length) {
    list.append(...items.map(createEventCard));
    empty.hidden = true;
  }
}
