import { projectsData, servicesData, processData, testimonialsData, faqsData } from './data.js';
import CaseStudyModal from './modal.js';

document.addEventListener('DOMContentLoaded', () => {

  /* --- Custom Cursor (disabled on touch devices) --- */
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let attachCursorHoverListeners = () => {};

  if (!isTouch) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.append(cursorDot, cursorRing);

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rx = cx, ry = cy;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top = cy + 'px';
    });

    const animRing = () => {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    // Called once after all dynamic content (work items, cards, etc.) has been rendered.
    attachCursorHoverListeners = () => {
      document.querySelectorAll('a, button, .work-item, .svc-card, .testi-card, .faq-q, .wf-btn').forEach(el => {
        el.addEventListener('mouseenter', () => { cursorDot.classList.add('hovering'); cursorRing.classList.add('hovering'); });
        el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovering'); cursorRing.classList.remove('hovering'); });
      });
    };
  }

  /* --- Toast --- */
  window.showToast = (msg, duration = 3200) => {
    const wrap = document.getElementById('toast-container');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, duration);
  };

  /* --- Nav scroll + mobile toggle --- */
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    // Active nav
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop - 120;
      const bot = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bot) {
        navLinks.querySelectorAll('a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* --- Modal --- */
  const modal = new CaseStudyModal();

  /* --- Render Work Items (list style) --- */
  const workList = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.wf-btn');

  function renderWork(filter = 'all') {
    if (!workList) return;
    workList.innerHTML = '';
    const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter);

    filtered.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'work-item';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.dataset.id = p.id;

      el.innerHTML = `
        <span class="wi-num mono">${String(i + 1).padStart(2, '0')}</span>
        <div class="wi-info">
          <div class="wi-cat">${p.categoryLabel}</div>
          <div class="wi-title">${p.title}</div>
          <div class="wi-desc">${p.tagline}</div>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="wi-live" data-stop-propagation="true">View live site ↗</a>` : ''}
        </div>
        ${p.screenshot ? `<div class="wi-thumb-wrap"><img src="${p.screenshot}" alt="${p.title}" class="wi-thumb" loading="lazy" /></div>` : `
        <div class="wi-metrics">
          <div class="wi-metric">${p.metrics[0].value}</div>
          <div class="wi-metric-label">${p.metrics[0].label}</div>
        </div>`}
        <div class="wi-arrow">→</div>
      `;

      el.querySelector('[data-stop-propagation]')?.addEventListener('click', e => e.stopPropagation());
      el.addEventListener('click', () => modal.open(p.id));
      el.addEventListener('keydown', e => { if (e.key === 'Enter') modal.open(p.id); });
      workList.appendChild(el);
    });

    if (!filtered.length) {
      workList.innerHTML = `<p class="mono" style="padding: 32px 0; color: var(--mid);">No projects in this category yet.</p>`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWork(btn.dataset.filter);
    });
  });

  renderWork();

  /* --- Render Services --- */
  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid) {
    servicesGrid.innerHTML = servicesData.map(s => `
      <div class="svc-card">
        <div class="svc-num mono">${s.number}</div>
        <div class="svc-title">${s.title}</div>
        <div class="svc-desc">${s.description}</div>
        <div class="svc-tags">
          ${s.deliverables.slice(0, 4).map(d => `<span class="svc-tag">${d}</span>`).join('')}
        </div>
        <div class="svc-arrow">↗</div>
      </div>
    `).join('');
  }

  /* --- Render Process --- */
  const processEl = document.getElementById('process-timeline');
  if (processEl) {
    processEl.innerHTML = processData.map(p => `
      <div class="ps-card">
        <div class="ps-num">${p.step}</div>
        <div class="ps-left">
          <span class="ps-week">${p.duration}</span>
          <div class="ps-title">${p.title}</div>
          <div class="ps-sub">${p.subtitle}</div>
        </div>
        <div class="ps-right">
          <p class="ps-desc">${p.description}</p>
          <div class="ps-tasks">
            ${p.tasks.map(t => `<span class="ps-task">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* --- Render Testimonials --- */
  const testiGrid = document.getElementById('testimonials-track');
  if (testiGrid) {
    testiGrid.innerHTML = testimonialsData.map(t => `
      <div class="testi-card">
        <div class="testi-stars">${'★'.repeat(t.rating)}</div>
        <p class="testi-quote">"${t.quote}"</p>
        <div class="testi-author">
          <img src="${t.avatar}" alt="${t.name}" class="testi-avatar" loading="lazy" />
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-role">${t.role}, ${t.company}</div>
            <div class="testi-project">${t.project}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* --- Render FAQ --- */
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = faqsData.map((f, i) => `
      <div class="faq-item ${i === 0 ? 'active' : ''}">
        <div class="faq-q">
          <span class="faq-q-text">${f.question}</span>
          <span class="faq-icon-btn">+</span>
        </div>
        <div class="faq-a">${f.answer}</div>
      </div>
    `).join('');

    faqList.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasActive = item.classList.contains('active');
        faqList.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  }

  /* --- Back to top --- */
  document.getElementById('back-to-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // All dynamic sections are rendered above — now safe to bind cursor hover states.
  attachCursorHoverListeners();
});
