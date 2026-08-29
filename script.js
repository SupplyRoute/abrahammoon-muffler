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
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    menuButton.focus();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(form).get('email');
  formMessage.textContent = `${email} 주소로 출시 소식을 보내드릴게요. (현재는 데모입니다)`;
  form.reset();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
