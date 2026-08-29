const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const form = document.querySelector('[data-signup-form]');
const formMessage = document.querySelector('[data-form-message]');

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
  header.classList.toggle('is-menu-open', !isOpen);
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    header.classList.remove('is-menu-open');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    header.classList.remove('is-menu-open');
    menuButton.focus();
  }
});

const revealElements = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email');
    formMessage.textContent = `${email} 주소로 출시 소식을 보내드릴게요. (현재는 데모입니다)`;
    form.reset();
  });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const storyList = document.querySelector('[data-story-list]');

const formatStoryDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value || '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const storyHref = (post) => post.url
  ? `story/${post.url}`
  : `story/post.html?id=${encodeURIComponent(post.id || '')}`;

const renderHomeStories = (posts) => {
  if (!storyList) return;
  const latestPosts = posts
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3);

  if (!latestPosts.length) {
    const message = document.createElement('p');
    message.className = 'journal-message';
    message.textContent = '첫 번째 이야기를 준비하고 있습니다.';
    storyList.replaceChildren(message);
    return;
  }

  const cards = latestPosts.map((post, index) => {
    const article = document.createElement('article');
    article.className = 'journal-item reveal is-visible';

    const meta = document.createElement('p');
    const time = document.createElement('time');
    time.dateTime = post.date || '';
    time.textContent = formatStoryDate(post.date);
    const number = document.createElement('span');
    number.textContent = `Story ${String(index + 1).padStart(2, '0')}`;
    meta.append(time, number);

    const heading = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = storyHref(post);
    titleLink.textContent = post.title || '(제목 없음)';
    heading.append(titleLink);

    const summary = document.createElement('p');
    summary.textContent = post.summary || '';

    const readLink = document.createElement('a');
    readLink.href = storyHref(post);
    readLink.textContent = '읽기 ↗';
    readLink.setAttribute('aria-label', `${post.title || '이야기'} 읽기`);

    article.append(meta, heading, summary, readLink);
    return article;
  });

  storyList.replaceChildren(...cards);
};

if (storyList) {
  fetch('story/posts.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`이야기 데이터를 불러오지 못했습니다: ${response.status}`);
      return response.json();
    })
    .then((posts) => renderHomeStories(Array.isArray(posts) ? posts : []))
    .catch((error) => {
      const message = document.createElement('p');
      message.className = 'journal-message';
      message.textContent = '이야기를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';
      storyList.replaceChildren(message);
      console.error(error);
    });
}
