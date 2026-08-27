import { projectsData } from './data.js';

class CaseStudyModal {
  constructor() {
    this.backdrop = document.getElementById('project-modal');
    this.content = document.getElementById('modal-content-container');
    this.closeBtn = document.getElementById('modal-close-btn');
    this._dragging = false;
    this._init();
  }

  _init() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', e => {
      if (e.target === this.backdrop) this.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.backdrop?.classList.contains('open')) this.close();
    });
  }

  open(id) {
    const p = projectsData.find(x => x.id === id);
    if (!p || !this.content) return;
    this._render(p);
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    this._initBA();
  }

  close() {
    this.backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  _render(p) {
    const metrics = p.metrics.map(m => `
      <div class="mc-metric">
        <div class="mc-metric-val">${m.value}</div>
        <div class="mc-metric-label">${m.label}</div>
      </div>
    `).join('');

    const techs = p.technologies.map(t => `<span class="mc-tag">${t}</span>`).join('');
    const deliverables = p.deliverables.map(d => `<span class="mc-tag">${d}</span>`).join('');

    let baHtml = '';
    if (p.beforeAfter) {
      baHtml = `
        <div class="mc-section">
          <div class="mc-section-title">Before &rarr; After</div>
          <div class="ba-wrap" id="ba-wrap">
            <div class="ba-before">
              <div style="font-family: var(--f-mono); font-size: 0.65rem; color: #ef4444; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">BEFORE</div>
              <div style="font-size: 0.9rem; color: rgba(245,243,239,0.5);">${p.beforeAfter.beforeTitle}</div>
            </div>
            <div class="ba-after" id="ba-after">
              <div style="font-family: var(--f-mono); font-size: 0.65rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">AFTER</div>
              <div style="font-size: 0.9rem; color: rgba(245,243,239,0.8);">${p.beforeAfter.afterTitle}</div>
            </div>
            <div class="ba-bar" id="ba-bar">
              <div class="ba-handle">â†”</div>
            </div>
          </div>
          <div class="mc-section-text" style="margin-top: 8px;">Drag the slider to compare the redesign.</div>
        </div>
      `;
    }

    this.content.innerHTML = `
      <div class="mc-cat">${p.categoryLabel} Â· ${p.year}</div>
      <h2 class="mc-title">${p.title}</h2>
      <p class="mc-tagline">${p.tagline}</p>

      ${p.screenshot ? `
      <div class="mc-screenshot-wrap">
        <img src="${p.screenshot}" alt="${p.title}" class="mc-screenshot" loading="lazy" />
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="mc-live-badge">View live site â†—</a>` : ''}
      </div>` : ''}

      <div class="mc-meta">
        <div class="mc-meta-item">
          <span class="mc-meta-label">Client</span>
          <span class="mc-meta-val">${p.client}</span>
        </div>
        <div class="mc-meta-item">
          <span class="mc-meta-label">My Role</span>
          <span class="mc-meta-val">${p.role}</span>
        </div>
        <div class="mc-meta-item">
          <span class="mc-meta-label">Duration</span>
          <span class="mc-meta-val">${p.duration}</span>
        </div>
        <div class="mc-meta-item">
          <span class="mc-meta-label">Year</span>
          <span class="mc-meta-val">${p.year}</span>
        </div>
      </div>

      <div class="mc-metrics-row">${metrics}</div>

      <div class="mc-section">
        <div class="mc-section-title">The Problem</div>
        <p class="mc-section-text">${p.challenge}</p>
      </div>

      <div class="mc-section">
        <div class="mc-section-title">What I Did</div>
        <p class="mc-section-text">${p.solution}</p>
      </div>

      ${baHtml}

      <div class="mc-section">
        <div class="mc-section-title">Deliverables</div>
        <div class="mc-tags" style="margin-top: 8px;">${deliverables}</div>
      </div>

      <div class="mc-section">
        <div class="mc-section-title">Built With</div>
        <div class="mc-tags" style="margin-top: 8px;">${techs}</div>
      </div>

      <div class="mc-cta">
        <a href="#contact" class="btn-main" data-close-modal="true">
          Start a similar project â†’
        </a>
      </div>
    `;

    // Close modal + scroll to contact when the CTA is clicked (no inline onclick, CSP-friendly)
    this.content.querySelector('[data-close-modal]')?.addEventListener('click', () => {
      this.close();
    });
  }

  _initBA() {
    const wrap = document.getElementById('ba-wrap');
    const after = document.getElementById('ba-after');
    const bar = document.getElementById('ba-bar');
    if (!wrap || !after || !bar) return;

    let isDragging = false;

    const update = (clientX) => {
      const rect = wrap.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      bar.style.left = `${pct}%`;
    };

    wrap.addEventListener('mousedown', e => { isDragging = true; update(e.clientX); });
    window.addEventListener('mousemove', e => { if (isDragging) update(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    wrap.addEventListener('touchstart', e => { isDragging = true; update(e.touches[0].clientX); });
    window.addEventListener('touchmove', e => { if (isDragging) update(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { isDragging = false; });
  }
}

export default CaseStudyModal;
