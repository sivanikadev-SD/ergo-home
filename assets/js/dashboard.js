/**
 * ErgoHome - Dashboard JavaScript
 * Client Portal: Assessment questionnaire, 3D designs, shopping list
 * Version: 1.0.0
 */

'use strict';

/* ==========================================================================
   1. Dashboard Sidebar & Layout
   ========================================================================== */
const DashboardNav = {
  init() {
    const sidebar  = document.getElementById('dash-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay   = document.getElementById('dash-overlay');

    if (toggleBtn && sidebar) {
      // Remove any inline listener duplication by using a named handler flag
      if (!toggleBtn._dashBound) {
        toggleBtn._dashBound = true;
        toggleBtn.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          if (overlay) overlay.classList.toggle('active');
        });
      }
    }

    if (overlay && sidebar) {
      if (!overlay._dashBound) {
        overlay._dashBound = true;
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        });
      }
    }

    // Active link
    const path = window.location.hash || '#overview';
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === path);
    });

    // Hash-based section switching
    document.querySelectorAll('.sidebar-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').slice(1);
        DashboardSections.show(sectionId);
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
          sidebar?.classList.remove('open');
          overlay?.classList.remove('active');
        }
      });
    });
  }
};

/* ==========================================================================
   2. Dashboard Sections
   ========================================================================== */
const DashboardSections = {
  show(id) {
    document.querySelectorAll('.dashboard-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === id);
    });
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  init() {
    const hash = window.location.hash?.slice(1) || 'overview';
    this.show(hash);
  }
};

/* ==========================================================================
   3. Ergonomic Assessment Questionnaire
   ========================================================================== */
const AssessmentQuiz = {
  currentStep: 1,
  totalSteps: 6,
  answers: {},

  questions: {
    1: {
      title: 'Personal Profile',
      fields: [
        { id: 'q_name', label: 'Full Name', type: 'text', required: true },
        { id: 'q_email', label: 'Email Address', type: 'email', required: true },
        { id: 'q_role', label: 'Primary Job Role', type: 'select', options: ['Software Developer','Designer','Writer/Editor','Finance/Accounting','Manager','Other'] },
        { id: 'q_hours', label: 'Hours at desk per day', type: 'select', options: ['1-3 hours','4-6 hours','7-9 hours','10+ hours'] }
      ]
    },
    2: {
      title: 'Current Setup',
      fields: [
        { id: 'q_room_size', label: 'Room Size', type: 'select', options: ['Small (< 100 sq ft)','Medium (100-200 sq ft)','Large (> 200 sq ft)'] },
        { id: 'q_desk_type', label: 'Current Desk Type', type: 'select', options: ['None yet','Fixed height desk','Adjustable sit-stand','Corner desk','Small table'] },
        { id: 'q_budget', label: 'Budget Range', type: 'select', options: ['$500 - $1,000','$1,000 - $2,500','$2,500 - $5,000','$5,000 - $10,000','$10,000+'] }
      ]
    },
    3: {
      title: 'Comfort & Health',
      checks: [
        { id: 'p_neck', label: 'Neck / shoulder pain' },
        { id: 'p_back', label: 'Lower back pain' },
        { id: 'p_wrist', label: 'Wrist / hand discomfort' },
        { id: 'p_eye', label: 'Eye strain / headaches' },
        { id: 'p_hip', label: 'Hip / leg discomfort' },
        { id: 'p_focus', label: 'Difficulty focusing' }
      ]
    },
    4: {
      title: 'Equipment Preferences',
      checks: [
        { id: 'eq_standing', label: 'Standing desk converter' },
        { id: 'eq_monitor_arm', label: 'Monitor arm' },
        { id: 'eq_ergo_chair', label: 'Ergonomic chair' },
        { id: 'eq_keyboard', label: 'Ergonomic keyboard/mouse' },
        { id: 'eq_lighting', label: 'Desk / ambient lighting' },
        { id: 'eq_cable', label: 'Cable management' },
        { id: 'eq_storage', label: 'Additional storage' },
        { id: 'eq_acoustic', label: 'Acoustic panels' }
      ]
    },
    5: {
      title: 'Style Preferences',
      styles: ['Minimalist & Clean', 'Modern Industrial', 'Scandinavian Warm', 'Executive Professional', 'Creative & Colorful', 'Nature-Inspired', 'Tech / Gaming Setup']
    },
    6: {
      title: 'Additional Notes',
      fields: [
        { id: 'q_windows', label: 'Number of windows in room', type: 'select', options: ['None','1 window','2 windows','3+ windows'] },
        { id: 'q_noise', label: 'Noise level around workspace', type: 'select', options: ['Very quiet','Occasionally noisy','Often noisy','Always noisy'] },
        { id: 'q_notes', label: 'Any additional requirements or notes', type: 'textarea' }
      ]
    }
  },

  init() {
    const quizEl = document.getElementById('assessment-quiz');
    if (!quizEl) return;
    this.render();
    this.updateProgress();
  },

  render() {
    const quizEl = document.getElementById('assessment-quiz');
    if (!quizEl) return;

    const q = this.questions[this.currentStep];
    let html = `<div class="quiz-step animate-fade-in">`;
    html += `<h3 class="quiz-step-title">Step ${this.currentStep}: ${q.title}</h3>`;

    if (q.fields) {
      q.fields.forEach(f => {
        html += `<div class="form-group">`;
        html += `<label class="form-label" for="${f.id}">${f.label}${f.required ? '<span class="required">*</span>' : ''}</label>`;
        if (f.type === 'select') {
          html += `<select class="form-select" id="${f.id}" name="${f.id}">`;
          html += `<option value="">Select an option...</option>`;
          f.options.forEach(o => html += `<option value="${o}" ${this.answers[f.id] === o ? 'selected' : ''}>${o}</option>`);
          html += `</select>`;
        } else if (f.type === 'textarea') {
          html += `<textarea class="form-textarea" id="${f.id}" name="${f.id}" placeholder="Write here..." rows="4">${this.answers[f.id] || ''}</textarea>`;
        } else {
          html += `<input class="form-input" type="${f.type}" id="${f.id}" name="${f.id}" value="${this.answers[f.id] || ''}" ${f.required ? 'required' : ''}>`;
        }
        html += `</div>`;
      });
    }

    if (q.checks) {
      html += `<p class="form-label" style="margin-bottom:var(--sp-3)">Select all that apply:</p>`;
      html += `<div class="quiz-checks-grid">`;
      q.checks.forEach(c => {
        html += `<label class="quiz-check-card ${this.answers[c.id] ? 'checked' : ''}">
          <input type="checkbox" name="${c.id}" id="${c.id}" ${this.answers[c.id] ? 'checked' : ''} style="display:none">
          <i class="ri-checkbox-circle-line"></i>
          <span>${c.label}</span>
        </label>`;
      });
      html += `</div>`;
    }

    if (q.styles) {
      html += `<p class="form-label" style="margin-bottom:var(--sp-3)">Choose your preferred aesthetic:</p>`;
      html += `<div class="quiz-styles-grid">`;
      q.styles.forEach((s, i) => {
        const colors = ['#0ea472','#6040e8','#f59e0b','#1e40af','#f97316','#16a34a','#6d28d9'];
        html += `<button type="button" class="quiz-style-card ${this.answers['q_style'] === s ? 'selected' : ''}" 
          style="border-top: 4px solid ${colors[i % colors.length]}" onclick="AssessmentQuiz.selectStyle('${s}', this)">
          <b>${s}</b>
        </button>`;
      });
      html += `</div>`;
    }

    html += `<div class="quiz-nav">`;
    if (this.currentStep > 1) html += `<button type="button" class="btn btn--ghost" onclick="AssessmentQuiz.prev()"><i class="ri-arrow-left-line"></i> Back</button>`;
    else html += `<span></span>`;
    if (this.currentStep < this.totalSteps) {
      html += `<button type="button" class="btn btn--primary" onclick="AssessmentQuiz.next()">Next <i class="ri-arrow-right-line"></i></button>`;
    } else {
      html += `<button type="button" class="btn btn--primary" onclick="AssessmentQuiz.submit()"><i class="ri-send-plane-2-line"></i> Submit Assessment</button>`;
    }
    html += `</div>`;
    html += `</div>`;
    quizEl.innerHTML = html;

    // Bind checkbox cards
    quizEl.querySelectorAll('.quiz-check-card input').forEach(cb => {
      cb.addEventListener('change', () => {
        this.answers[cb.name] = cb.checked;
        cb.closest('.quiz-check-card').classList.toggle('checked', cb.checked);
      });
    });
  },

  selectStyle(style, btn) {
    this.answers['q_style'] = style;
    document.querySelectorAll('.quiz-style-card').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  },

  saveCurrentAnswers() {
    const q = this.questions[this.currentStep];
    if (q.fields) {
      q.fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) this.answers[f.id] = el.value;
      });
    }
    if (q.checks) {
      q.checks.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) this.answers[c.id] = el.checked;
      });
    }
  },

  next() {
    this.saveCurrentAnswers();
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.render();
      this.updateProgress();
    }
  },

  prev() {
    this.saveCurrentAnswers();
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
      this.updateProgress();
    }
  },

  updateProgress() {
    const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    const bar = document.querySelector('.quiz-progress-bar');
    const counter = document.querySelector('.quiz-step-counter');
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;

    // Update step indicators
    document.querySelectorAll('.step-num').forEach((el, i) => {
      const stepN = i + 1;
      el.closest('.step')?.classList.toggle('done', stepN < this.currentStep);
      el.closest('.step')?.classList.toggle('active', stepN === this.currentStep);
    });
  },

  async submit() {
    this.saveCurrentAnswers();
    const btn = document.querySelector('.quiz-nav .btn--primary');
    if (btn) { btn.classList.add('loading'); btn.disabled = true; }
    await new Promise(r => setTimeout(r, 2000));

    const quizEl = document.getElementById('assessment-quiz');
    quizEl.innerHTML = `
      <div class="quiz-success animate-fade-in" style="text-align:center;padding:var(--sp-12) var(--sp-6);">
        <div style="width:80px;height:80px;background:var(--color-primary-100);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto var(--sp-6)">
          <i class="ri-check-line" style="font-size:40px;color:var(--brand-primary)"></i>
        </div>
        <h3 style="margin-bottom:var(--sp-4);font-size:var(--text-2xl)">Assessment Complete!</h3>
        <p style="color:var(--text-secondary);max-width:50ch;margin:0 auto var(--sp-8)">
          Thank you! Our ergonomics team will review your responses and prepare a custom 3D design proposal within <strong>2-3 business days</strong>. You'll receive an email once it's ready.
        </p>
        <div style="display:flex;gap:var(--sp-4);justify-content:center;flex-wrap:wrap">
          <button class="btn btn--primary" onclick="DashboardSections.show('designs')"><i class="ri-layout-masonry-line"></i> View Sample Designs</button>
          <button class="btn btn--ghost" onclick="DashboardSections.show('overview')"><i class="ri-home-line"></i> Back to Overview</button>
        </div>
      </div>`;
  }
};

/* ==========================================================================
   4. 3D Room Design Viewer
   ========================================================================== */
const DesignViewer = {
  currentDesign: 0,
  designs: [
    { id: 1, name: 'Minimalist Standing Office', style: 'Minimalist', status: 'Pending Approval', score: 94, features: ['Electric sit-stand desk','Ultra-wide monitor setup','LED ambient lighting','Cable management system','Ergonomic mesh chair'], color: '#0ea472' },
    { id: 2, name: 'Scandinavian Warm Studio', style: 'Scandinavian', status: 'Under Review', score: 88, features: ['L-shaped birch wood desk','Biophilic wall plants','Warm white lighting','Drawers + open shelving','Lumbar-support chair'], color: '#f59e0b' },
    { id: 3, name: 'Executive Power Suite', style: 'Executive', status: 'Draft', score: 91, features: ['Premium leather chair','Dual monitor arms','Built-in cable tray','Floor-to-ceiling bookcase','Soundproofing panels'], color: '#6040e8' }
  ],

  init() {
    this.render();
  },

  render() {
    const el = document.getElementById('design-viewer');
    if (!el) return;

    const d = this.designs[this.currentDesign];
    el.querySelector('.design-name').textContent = d.name;
    el.querySelector('.design-style').textContent = d.style;
    el.querySelector('.design-score').textContent = d.score + '%';
    el.querySelector('.design-status').textContent = d.status;
    el.querySelector('.design-features').innerHTML = d.features.map(f => `<li><i class="ri-check-line" style="color:${d.color}"></i>${f}</li>`).join('');

    // Update thumbnail highlights
    el.querySelectorAll('.design-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === this.currentDesign);
    });

    // Update 3D placeholder color
    const preview = el.querySelector('.design-3d-preview');
    if (preview) preview.style.setProperty('--design-color', d.color);
  },

  select(index) {
    this.currentDesign = index;
    this.render();
  },

  approve() {
    const d = this.designs[this.currentDesign];
    d.status = 'Approved';
    this.render();
    window.ErgoHome?.Toast.show(`Design "${d.name}" approved! We'll start procurement.`, 'success');
  },

  requestRevision() {
    const msg = prompt('Please describe the revisions needed:');
    if (msg) window.ErgoHome?.Toast.show('Revision request sent to your design consultant.', 'info');
  }
};

/* ==========================================================================
   5. Shopping List Manager
   ========================================================================== */
const ShoppingList = {
  items: [
    { id: 1, name: 'FlexiPro Electric Sit-Stand Desk', category: 'Furniture', price: 649, approved: false, priority: 'Essential', vendor: 'ErgoHome Partners', img: '🖥️' },
    { id: 2, name: 'HumanScale Freedom Chair', category: 'Seating', price: 1199, approved: false, priority: 'Essential', vendor: 'ErgoHome Partners', img: '🪑' },
    { id: 3, name: 'Dell UltraSharp 34" Curved Monitor', category: 'Electronics', price: 899, approved: false, priority: 'Recommended', vendor: 'Dell', img: '🖥️' },
    { id: 4, name: 'Ergotron LX Monitor Arm', category: 'Accessories', price: 189, approved: false, priority: 'Recommended', vendor: 'Ergotron', img: '🦾' },
    { id: 5, name: 'Logitech MX Keys Keyboard', category: 'Electronics', price: 119, approved: false, priority: 'Recommended', vendor: 'Logitech', img: '⌨️' },
    { id: 6, name: 'BenQ ScreenBar Halo Light', category: 'Lighting', price: 229, approved: false, priority: 'Optional', vendor: 'BenQ', img: '💡' },
    { id: 7, name: 'Cable Management Spine Kit', category: 'Accessories', price: 49, approved: false, priority: 'Optional', vendor: 'OmniMount', img: '🔌' },
    { id: 8, name: 'Ergonomic Footrest', category: 'Accessories', price: 69, approved: false, priority: 'Optional', vendor: 'ErgoHome Partners', img: '🦵' }
  ],

  init() {
    this.render();
  },

  render() {
    const listEl = document.getElementById('shopping-list');
    if (!listEl) return;

    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    const approved = this.items.filter(i => i.approved).reduce((sum, item) => sum + item.price, 0);

    listEl.querySelector('.list-total').textContent = '$' + total.toLocaleString();
    listEl.querySelector('.list-approved-total').textContent = '$' + approved.toLocaleString();
    listEl.querySelector('.approved-count').textContent = this.items.filter(i => i.approved).length;

    const tbody = listEl.querySelector('.shopping-tbody');
    if (tbody) {
      tbody.innerHTML = this.items.map(item => `
        <tr class="${item.approved ? 'item-approved' : ''}">
          <td><span style="font-size:24px">${item.img}</span></td>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-vendor" style="font-size:var(--text-xs);color:var(--text-muted)">${item.vendor}</div>
          </td>
          <td><span class="badge badge--neutral">${item.category}</span></td>
          <td><span class="badge ${item.priority === 'Essential' ? 'badge--primary' : item.priority === 'Recommended' ? 'badge--warning' : 'badge--neutral'}">${item.priority}</span></td>
          <td><strong>$${item.price.toLocaleString()}</strong></td>
          <td>
            <label class="form-check" style="margin:0">
              <input type="checkbox" ${item.approved ? 'checked' : ''} onchange="ShoppingList.toggle(${item.id}, this.checked)">
              <span class="form-check-label">${item.approved ? 'Approved' : 'Approve'}</span>
            </label>
          </td>
        </tr>
      `).join('');
    }
  },

  toggle(id, approved) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.approved = approved;
      this.render();
      if (approved) window.ErgoHome?.Toast.show(`"${item.name}" approved!`, 'success');
    }
  },

  approveAll() {
    this.items.forEach(i => i.approved = true);
    this.render();
    window.ErgoHome?.Toast.show('All items approved! Your order will be processed shortly.', 'success');
  },

  exportList() {
    const approved = this.items.filter(i => i.approved);
    if (!approved.length) {
      window.ErgoHome?.Toast.show('Please approve at least one item first.', 'warning');
      return;
    }

    let csv = 'Item,Category,Priority,Price,Vendor\n';
    approved.forEach(item => {
      csv += `"${item.name}","${item.category}","${item.priority}","$${item.price}","${item.vendor}"\n`;
    });
    csv += `\nTotal Approved,,,,,$${approved.reduce((s, i) => s + i.price, 0).toLocaleString()}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ergohome-approved-list.csv';
    a.click();
    window.ErgoHome?.Toast.show('Shopping list exported as CSV.', 'success');
  }
};

/* ==========================================================================
   6. Dashboard Stats Charts (simple SVG bars)
   ========================================================================== */
const DashboardCharts = {
  init() {
    this.renderProgressRings();
  },

  renderProgressRings() {
    document.querySelectorAll('[data-progress-ring]').forEach(el => {
      const value = parseInt(el.getAttribute('data-progress-ring'));
      const r = 40, cx = 50, cy = 50;
      const circumference = 2 * Math.PI * r;
      const offset = circumference - (value / 100) * circumference;
      const color = value >= 80 ? '#0ea472' : value >= 60 ? '#f59e0b' : '#f43f5e';

      el.innerHTML = `
        <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border-color)" stroke-width="8"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="8"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
            stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"
            style="transition:stroke-dashoffset 1.2s ease">
          </circle>
          <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
            font-size="18" font-weight="700" fill="var(--text-primary)">${value}%</text>
        </svg>`;

      // Animate
      setTimeout(() => {
        el.querySelector('circle:nth-child(2)').style.strokeDashoffset = offset;
      }, 100);
    });
  }
};

/* ==========================================================================
   7. Notifications Panel
   ========================================================================== */
const Notifications = {
  items: [
    { id: 1, text: 'Your assessment has been received by the team.', time: '2 hours ago', read: false, icon: 'ri-survey-line', color: '#0ea472' },
    { id: 2, text: 'Design proposal #1 is ready for review.', time: '1 day ago', read: false, icon: 'ri-layout-masonry-line', color: '#6040e8' },
    { id: 3, text: 'Your consultation is scheduled for March 22.', time: '2 days ago', read: true, icon: 'ri-calendar-check-line', color: '#f59e0b' }
  ],

  init() {
    this.updateBadge();
    this.bindDropdown();
  },

  updateBadge() {
    const unread = this.items.filter(i => !i.read).length;
    const badge = document.querySelector('.notif-badge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread ? 'flex' : 'none';
    }
  },

  bindDropdown() {
    const btn = document.querySelector('.notif-btn');
    const dropdown = document.querySelector('.notif-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) this.renderDropdown(dropdown);
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', e => e.stopPropagation());
  },

  renderDropdown(dropdown) {
    dropdown.innerHTML = `
      <div class="notif-header"><strong>Notifications</strong><button onclick="Notifications.markAllRead()" class="btn btn--sm btn--ghost">Mark all read</button></div>
      ${this.items.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="Notifications.markRead(${n.id})">
          <div class="notif-icon" style="background:${n.color}20;color:${n.color}"><i class="${n.icon}"></i></div>
          <div><p style="font-size:var(--text-sm)">${n.text}</p><span style="font-size:var(--text-xs);color:var(--text-muted)">${n.time}</span></div>
        </div>`).join('')}
    `;
  },

  markRead(id) {
    const n = this.items.find(i => i.id === id);
    if (n) n.read = true;
    this.updateBadge();
  },

  markAllRead() {
    this.items.forEach(i => i.read = true);
    this.updateBadge();
    document.querySelector('.notif-dropdown')?.classList.remove('open');
  }
};

/* ==========================================================================
   8. Initialize Dashboard
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.dashboard-layout')) return;

  DashboardNav.init();
  DashboardSections.init();
  AssessmentQuiz.init();
  DesignViewer.init();
  ShoppingList.init();
  DashboardCharts.init();
  Notifications.init();
});

// Expose globally for inline onclick handlers
window.AssessmentQuiz = AssessmentQuiz;
window.DashboardSections = DashboardSections;
window.DesignViewer = DesignViewer;
window.ShoppingList = ShoppingList;
window.Notifications = Notifications;
