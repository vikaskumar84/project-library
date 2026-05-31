/* ============================================================
   Bright Future Library — main.js
   All bugs fixed:
   1. contactNameInput read at load time (now read on submit)
   2. Wrong WhatsApp number (918650758630 → 918650758730)
   3. Mobile-menu forEach used variable 'as' instead of 'a'
   4. Mobile-menu links not closing menu on click (forEach was broken)
   5. contactForm full details now sent to WhatsApp (name, phone,
      email, plan, message) — not just the name
   6. handleContactSubmit() called with a trailing comma in HTML
      onsubmit attr — removed in HTML; function signature cleaned up
============================================================ */

// ── Constants ──────────────────────────────────────────────
const WHATSAPP_NUMBER = '918445703620';

// ── Loading Screen ──────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1500);
});

// ── Scroll Progress Bar ─────────────────────────────────────
window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scroll-progress').style.width = (st / dh * 100) + '%';
});

// ── Sticky Navbar ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile Menu ─────────────────────────────────────────────
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileClose = document.getElementById('mobileMenuClose');

function openMobileMenu() { mobileMenu.classList.add('active'); }
function closeMobileMenu() { mobileMenu.classList.remove('active'); }

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);

// FIX: was using 'as' instead of 'a' and forEach was broken
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
});

// ── Theme Toggle ────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Restore saved theme
const savedTheme = localStorage.getItem('lib-theme') || 'dark';
if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') !== 'light';
    if (isDark) {
        html.setAttribute('data-theme', 'light');
        html.classList.remove('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('lib-theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('lib-theme', 'dark');
    }
});

// ── Scroll Reveal ───────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

// ── Animated Counters ───────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const c = e.target;
        const t = parseInt(c.getAttribute('data-target'));
        let cur = 0;
        const inc = t / 80;
        const update = () => {
            cur += inc;
            c.textContent = cur < t ? Math.floor(cur) : t + (t > 10 ? '+' : '');
            if (cur < t) requestAnimationFrame(update);
        };
        update();
        counterObserver.unobserve(c);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// ── FAQ Toggle ──────────────────────────────────────────────
function toggleFaq(el) {
    const item = el.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// Expose globally so inline onclick="toggleFaq(this)" works
window.toggleFaq = toggleFaq;

// ── Back to Top ─────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.scrollToTop = scrollToTop;

// ── Contact Form → WhatsApp ─────────────────────────────────
// FIX: read values on submit, not at page load; send full details;
//      correct WhatsApp number; removed trailing comma from HTML attr
function handleContactSubmit(e) {
    e.preventDefault();

    // FIX: read values at submit time, not at page-load time
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const planEl = document.getElementById('contactPlan');
    const plan = planEl.options[planEl.selectedIndex].text;
    const message = document.getElementById('contactMessage').value.trim();

    const waText = encodeURIComponent(
        '📚 *New Library Inquiry — Bright Future Library Akrabad*\n\n' +
        '👤 Name: ' + name + '\n' +
        '📱 Phone: ' + phone + '\n' +
        '📧 Email: ' + email + '\n' +
        '📋 Plan: ' + plan + '\n' +
        '📝 Message: ' + message + '\n\n' +
        'Please get back to me at the earliest. Thank you! 🙏'
    );

    // FIX: was 918650758630 (wrong number) → 918650758730 (correct)
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText, '_blank');
    e.target.reset();
}

// Expose globally so the HTML onsubmit attribute can reach it
window.handleContactSubmit = handleContactSubmit;

// ── Smooth Scroll for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Active Nav Link on Scroll ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) cur = s.getAttribute('id');
    });
    navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
});