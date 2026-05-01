// app.js

const STORAGE_KEY = 'consultation_requests';
const LANG_KEY = 'consultation_lang';
const NICKNAME_KEY = 'consultation_nickname';

let requests = [];
let currentLang = 'uk';
let currentNickname = '';

// DOM Elements
const elList = document.getElementById('request-list');
const elEmpty = document.getElementById('empty-state');
const elModal = document.getElementById('modal-form');
const elModalTitle = document.getElementById('modal-title');
const elForm = document.getElementById('request-form');
const elSubjectList = document.getElementById('filter-subject');
const btnLang = document.getElementById('btn-lang');
const inpNickname = document.getElementById('nickname-input');
const inpSearch = document.getElementById('search-input');

// Confirm Modal
const modalConfirm = document.getElementById('modal-confirm');
const confirmMessage = document.getElementById('confirm-message');
const btnConfirmOk = document.getElementById('btn-confirm-ok');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
const confirmOverlay = document.getElementById('confirm-overlay');

// Inputs
const inpId = document.getElementById('form-id');
const inpStatus = document.getElementById('form-status');
const inpAuthor = document.getElementById('form-author');
const inpSubject = document.getElementById('form-subject');
const inpTopic = document.getElementById('form-topic');
const inpDate = document.getElementById('form-date');
const inpTime = document.getElementById('form-time');

// Buttons
const btnSaveDraft = document.getElementById('btn-save-draft');
const btnSubmit = document.getElementById('btn-submit-request');
const btnTheme = document.getElementById('btn-theme');

// Translations
const translations = {
  uk: {
    app_title: 'Консультації',
    ph_nickname: 'Ваш нікнейм',
    btn_reset: 'Скинути демо-дані',
    btn_new: 'Нова заявка',
    stat_total: 'Всього заявок',
    stat_pending: 'Очікують відповіді',
    stat_confirmed: 'Підтверджені',
    filter_all_status: 'Всі статуси',
    status_draft: 'Чернетки',
    status_submitted: 'Подані (очікують)',
    status_confirmed: 'Підтверджені',
    status_cancelled: 'Скасовані',
    filter_all_subjects: 'Всі предмети',
    sort_date_asc: 'Дата зустрічі (за зростанням)',
    sort_date_desc: 'Дата зустрічі (за спаданням)',
    sort_created_desc: 'Спочатку нові',
    sort_created_asc: 'Спочатку старі',
    empty_title: 'Заявок поки немає',
    empty_subtitle: 'Створіть свою першу заявку, щоб почати',
    modal_new_title: 'Нова заявка',
    modal_edit_title: 'Редагувати заявку',
    modal_view_title: 'Перегляд заявки',
    ph_search: 'Пошук...',
    lbl_author: 'Автор',
    ph_author: 'Автор не вказаний',
    lbl_subject: 'Предмет',
    ph_subject: 'Наприклад, Електродинаміка',
    lbl_topic: 'Тема запиту',
    ph_topic: 'Коротко опишіть питання (5-300 символів)',
    lbl_date: 'Бажана дата',
    lbl_time: 'Бажаний час (08:30 - 18:00)',
    btn_save_draft: 'Зберегти чернетку',
    btn_submit: 'Подати заявку',
    btn_edit: 'Редагувати',
    btn_view: 'Переглянути',
    btn_delete: 'Видалити',
    btn_confirm: 'Підтвердити',
    btn_reject: 'Відхилити',
    btn_cancel: 'Скасувати',
    subject_not_set: 'Предмет не вказано',
    topic_not_set: 'Без теми',
    time_not_set: 'Час не призначено',
    created_at: 'Створено',
    by_author: 'від',
    err_draft_empty: 'Для збереження чернетки заповніть хоча б одне поле.',
    err_subj_empty: 'Будь ласка, вкажіть предмет.',
    err_topic_empty: 'Будь ласка, опишіть тему запиту.',
    err_date_empty: 'Оберіть дату.',
    err_time_empty: 'Оберіть час.',
    err_topic_len: 'Опис проблеми має містити від 5 до 300 символів.',
    err_date_past: 'Дата консультації не може бути в минулому.',
    err_date_weekend: 'Консультації не проводяться у вихідні дні.',
    err_time_range: 'Час має бути в межах від 08:30 до 18:00.',
    toast_demo_loaded: 'Демо-дані успішно завантажені!',
    toast_fix_errors: 'Будь ласка, виправте помилки у формі',
    toast_created: 'Заявку успішно створено!',
    toast_saved: 'Зміни збережено!',
    toast_deleted: 'Заявку видалено',
    toast_status_changed: 'Статус змінено на',
    toast_nickname_saved: 'Нікнейм збережено!',
    confirm_demo: 'Увага! Всі поточні заявки будуть замінені демо-даними. Продовжити?',
    confirm_delete: 'Ви впевнені, що хочете видалити цю заявку?',
    val_Draft: 'Чернетка',
    val_Submitted: 'Подано',
    val_Confirmed: 'Підтверджено',
    val_Cancelled: 'Скасовано'
  },
  en: {
    app_title: 'Consultations',
    ph_nickname: 'Your nickname',
    btn_reset: 'Reset Demo Data',
    btn_new: 'New Request',
    stat_total: 'Total Requests',
    stat_pending: 'Pending',
    stat_confirmed: 'Confirmed',
    filter_all_status: 'All Statuses',
    status_draft: 'Drafts',
    status_submitted: 'Submitted (Pending)',
    status_confirmed: 'Confirmed',
    status_cancelled: 'Cancelled',
    filter_all_subjects: 'All Subjects',
    sort_date_asc: 'Meeting Date (Ascending)',
    sort_date_desc: 'Meeting Date (Descending)',
    sort_created_desc: 'Newest First',
    sort_created_asc: 'Oldest First',
    empty_title: 'No requests yet',
    empty_subtitle: 'Create your first request to get started',
    modal_new_title: 'New Request',
    modal_edit_title: 'Edit Request',
    modal_view_title: 'View Request',
    ph_search: 'Search...',
    lbl_author: 'Author',
    ph_author: 'Author not specified',
    lbl_subject: 'Subject',
    ph_subject: 'e.g. Electrodynamics',
    lbl_topic: 'Request Topic',
    ph_topic: 'Briefly describe your question (5-300 chars)',
    lbl_date: 'Preferred Date',
    lbl_time: 'Preferred Time (08:30 - 18:00)',
    btn_save_draft: 'Save Draft',
    btn_submit: 'Submit Request',
    btn_edit: 'Edit',
    btn_view: 'View',
    btn_delete: 'Delete',
    btn_confirm: 'Confirm',
    btn_reject: 'Reject',
    btn_cancel: 'Cancel',
    subject_not_set: 'Subject not set',
    topic_not_set: 'No topic',
    time_not_set: 'Time not set',
    created_at: 'Created',
    by_author: 'by',
    err_draft_empty: 'Please fill in at least one field to save a draft.',
    err_subj_empty: 'Please specify a subject.',
    err_topic_empty: 'Please describe the topic.',
    err_date_empty: 'Please select a date.',
    err_time_empty: 'Please select a time.',
    err_topic_len: 'Topic must be between 5 and 300 characters.',
    err_date_past: 'Consultation date cannot be in the past.',
    err_date_weekend: 'Consultations are not held on weekends.',
    err_time_range: 'Time must be between 08:30 and 18:00.',
    toast_demo_loaded: 'Demo data successfully loaded!',
    toast_fix_errors: 'Please fix the errors in the form',
    toast_created: 'Request created successfully!',
    toast_saved: 'Changes saved!',
    toast_deleted: 'Request deleted',
    toast_status_changed: 'Status changed to',
    toast_nickname_saved: 'Nickname saved!',
    confirm_demo: 'Warning! All current requests will be replaced with demo data. Continue?',
    confirm_delete: 'Are you sure you want to delete this request?',
    val_Draft: 'Draft',
    val_Submitted: 'Submitted',
    val_Confirmed: 'Confirmed',
    val_Cancelled: 'Cancelled'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNickname();
  initTheme();
  loadData();
  setupEventListeners();
  renderApp();
  if (window.lucide) {
    lucide.createIcons();
  }
});

// Localization
function initLanguage() {
  currentLang = localStorage.getItem(LANG_KEY) || 'uk';
  if (btnLang) btnLang.textContent = currentLang === 'uk' ? 'EN' : 'UK';
  translateDOM();
}

function toggleLanguage() {
  currentLang = currentLang === 'uk' ? 'en' : 'uk';
  localStorage.setItem(LANG_KEY, currentLang);
  if (btnLang) btnLang.textContent = currentLang === 'uk' ? 'EN' : 'UK';
  translateDOM();
  renderApp(); // re-render to update dynamic strings
}

function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
}

// Nickname
function initNickname() {
  currentNickname = localStorage.getItem(NICKNAME_KEY) || '';
  if (inpNickname) inpNickname.value = currentNickname;
}

if (inpNickname) {
  function saveNickname() {
    const newVal = inpNickname.value.trim();
    if (newVal !== currentNickname) {
      currentNickname = newVal;
      localStorage.setItem(NICKNAME_KEY, currentNickname);
      if (currentNickname) {
        showToast(t('toast_nickname_saved'), 'success');
      }
    }
  }

  inpNickname.addEventListener('blur', saveNickname);
  inpNickname.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      saveNickname();
      inpNickname.blur();
    }
  });
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ root: toast });

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// ASCII Animation
const asciiFrames = [
  String.raw`
       o_
      /|
      / \
   ==[__]==
  `,
  String.raw`
       \o_
        |
       / \
    ==[__]==
  `,
  String.raw`
        o_
      </|
       / \
     ==[__]==
  `
];

let asciiInterval = null;
let asciiIndex = 0;

function startAsciiAnimation() {
  if (asciiInterval) return;
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) return;
  canvas.textContent = asciiFrames[0];
  asciiInterval = setInterval(() => {
    canvas.textContent = asciiFrames[asciiIndex];
    asciiIndex = (asciiIndex + 1) % asciiFrames.length;
  }, 300);
}

function stopAsciiAnimation() {
  if (asciiInterval) {
    clearInterval(asciiInterval);
    asciiInterval = null;
  }
}

// Custom Confirm
let confirmCallback = null;

function customConfirm(message, callback) {
  if (confirmMessage) confirmMessage.textContent = message;
  confirmCallback = callback;
  if (modalConfirm) modalConfirm.classList.remove('hidden');
}

function closeConfirm() {
  if (modalConfirm) modalConfirm.classList.add('hidden');
  confirmCallback = null;
}

if (btnConfirmCancel) btnConfirmCancel.addEventListener('click', closeConfirm);
if (confirmOverlay) confirmOverlay.addEventListener('click', closeConfirm);
if (btnConfirmOk) {
  btnConfirmOk.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirm();
  });
}

// State Management
function initTheme() {
  const savedTheme = localStorage.getItem('consultation_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
  }
  const isDark = document.body.classList.contains('dark-theme');
  if (btnTheme) {
    btnTheme.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('consultation_theme', isDark ? 'dark' : 'light');
  if (btnTheme) {
    btnTheme.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
    if (window.lucide) lucide.createIcons({ root: btnTheme });
  }
}

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    requests = JSON.parse(data);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  renderApp();
}

function resetDemoData() {
  const demoData = [
    {
      "id": "1700000000001",
      "subject": "Електродинаміка",
      "topic": "Допоможіть розібратися з рівняннями Максвелла",
      "date": "2026-06-01",
      "time": "10:30",
      "status": "Submitted",
      "author": "JohnDoe",
      "createdAt": "2026-05-01T10:00:00.000Z",
      "updatedAt": "2026-05-01T10:00:00.000Z"
    },
    {
      "id": "1700000000002",
      "subject": "Схемотехніка",
      "topic": "Розрахунок підсилювача з урахуванням зворотного зв'язку",
      "date": "2026-06-05",
      "time": "14:00",
      "status": "Confirmed",
      "author": "Student123",
      "createdAt": "2026-04-28T09:15:00.000Z",
      "updatedAt": "2026-04-29T11:20:00.000Z"
    },
    {
      "id": "1700000000003",
      "subject": "Фізика НВЧ",
      "topic": "Питання по лабораторній роботі №3",
      "date": "2026-06-10",
      "time": "16:45",
      "status": "Draft",
      "author": "",
      "createdAt": "2026-05-01T12:00:00.000Z",
      "updatedAt": "2026-05-01T12:00:00.000Z"
    },
    {
      "id": "1700000000004",
      "subject": "Вища математика",
      "topic": "Не розумію тему: подвійні інтеграли",
      "date": "2026-06-12",
      "time": "09:00",
      "status": "Cancelled",
      "author": "MathGeek",
      "createdAt": "2026-04-25T08:00:00.000Z",
      "updatedAt": "2026-04-26T08:30:00.000Z"
    }
  ];
  requests = demoData;
  saveData();
  showToast(t('toast_demo_loaded'), 'success');
}

// Rendering
function renderApp() {
  updateStats();
  updateFilters();
  renderList();
}

function updateStats() {
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Submitted').length;
  const confirmed = requests.filter(r => r.status === 'Confirmed').length;

  const elTotal = document.getElementById('stat-total');
  const elPending = document.getElementById('stat-pending');
  const elConfirmed = document.getElementById('stat-confirmed');

  if (elTotal) elTotal.textContent = total;
  if (elPending) elPending.textContent = pending;
  if (elConfirmed) elConfirmed.textContent = confirmed;
}

function updateFilters() {
  const subjects = new Set(requests.map(r => r.subject).filter(Boolean));
  if (!elSubjectList) return;
  const currentVal = elSubjectList.value;

  elSubjectList.innerHTML = `<option value="All">${t('filter_all_subjects')}</option>`;
  subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    elSubjectList.appendChild(opt);
  });

  if (subjects.has(currentVal)) {
    elSubjectList.value = currentVal;
  }
}

function getFilteredAndSortedRequests() {
  const filterStatus = document.getElementById('filter-status') ? document.getElementById('filter-status').value : 'All';
  const filterSubject = elSubjectList ? elSubjectList.value : 'All';
  const sortBy = document.getElementById('sort-by') ? document.getElementById('sort-by').value : 'date-asc';
  const searchQuery = (inpSearch ? inpSearch.value.trim().toLowerCase() : '');

  let filtered = requests.filter(r => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSubject = filterSubject === 'All' || r.subject === filterSubject;
    
    let matchSearch = true;
    if (searchQuery) {
      const topicStr = (r.topic || '').toLowerCase();
      const subjectStr = (r.subject || '').toLowerCase();
      const authorStr = (r.author || '').toLowerCase();
      matchSearch = topicStr.includes(searchQuery) || subjectStr.includes(searchQuery) || authorStr.includes(searchQuery);
    }
    
    return matchStatus && matchSubject && matchSearch;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'date-asc') {
      return (a.date || '9999-99-99').localeCompare(b.date || '9999-99-99');
    }
    if (sortBy === 'date-desc') {
      return (b.date || '').localeCompare(a.date || '');
    }
    if (sortBy === 'created-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'created-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  return filtered;
}

function renderList() {
  if (!elList) return;
  const data = getFilteredAndSortedRequests();
  elList.innerHTML = '';

  if (data.length === 0) {
    elList.classList.add('hidden');
    if (elEmpty) elEmpty.classList.remove('hidden');
    startAsciiAnimation();
    return;
  }

  elList.classList.remove('hidden');
  if (elEmpty) elEmpty.classList.add('hidden');
  stopAsciiAnimation();

  data.forEach(req => {
    const card = document.createElement('div');
    card.className = 'request-card';

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <div>
        <div class="card-title">${escapeHTML(req.topic || t('topic_not_set'))}</div>
        <div class="card-subject">${escapeHTML(req.subject || t('subject_not_set'))}</div>
      </div>
      <span class="badge status-${req.status}">${t('val_' + req.status)}</span>
    `;
    card.appendChild(header);

    // Details
    const details = document.createElement('div');
    details.className = 'card-details';
    if (req.date && req.time) {
      details.innerHTML += `<div class="detail-item"><i data-lucide="calendar" style="width:14px;height:14px;"></i> ${req.date} &nbsp;<i data-lucide="clock" style="width:14px;height:14px;"></i> ${req.time}</div>`;
    } else {
      details.innerHTML += `<div class="detail-item"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${t('time_not_set')}</div>`;
    }

    let createdStr = `${t('created_at')}: ${new Date(req.createdAt).toLocaleDateString()}`;
    if (req.author) {
      createdStr += ` ${t('by_author')} ${escapeHTML(req.author)}`;
    }
    details.innerHTML += `<div class="detail-item">${createdStr}</div>`;

    card.appendChild(details);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    if (req.status === 'Draft') {
      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn btn-secondary';
      btnEdit.innerHTML = `<i data-lucide="edit-2" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_edit')}`;
      btnEdit.onclick = () => openModal(req);
      actions.appendChild(btnEdit);
    } else {
      const btnView = document.createElement('button');
      btnView.className = 'btn btn-secondary';
      btnView.innerHTML = `<i data-lucide="eye" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_view')}`;
      btnView.onclick = () => openModal(req);
      actions.appendChild(btnView);
    }

    if (req.status === 'Draft' || req.status === 'Cancelled') {
      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn btn-danger';
      btnDelete.innerHTML = `<i data-lucide="trash-2" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_delete')}`;
      btnDelete.onclick = () => deleteRequest(req.id);
      actions.appendChild(btnDelete);
    }

    // Teacher Simulation
    if (req.status === 'Submitted') {
      const btnConfirm = document.createElement('button');
      btnConfirm.className = 'btn btn-success';
      btnConfirm.innerHTML = `<i data-lucide="check" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_confirm')}`;
      btnConfirm.onclick = () => changeStatus(req.id, 'Confirmed');
      actions.appendChild(btnConfirm);

      const btnCancel = document.createElement('button');
      btnCancel.className = 'btn btn-danger';
      btnCancel.innerHTML = `<i data-lucide="x-circle" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_reject')}`;
      btnCancel.onclick = () => changeStatus(req.id, 'Cancelled');
      actions.appendChild(btnCancel);
    }

    if (req.status === 'Confirmed') {
      const btnCancel = document.createElement('button');
      btnCancel.className = 'btn btn-danger';
      btnCancel.innerHTML = `<i data-lucide="x-circle" style="width:16px;height:16px;margin-right:6px;"></i> ${t('btn_cancel')}`;
      btnCancel.onclick = () => changeStatus(req.id, 'Cancelled');
      actions.appendChild(btnCancel);
    }

    if (actions.children.length > 0) {
      card.appendChild(actions);
    }

    elList.appendChild(card);
  });

  if (window.lucide) {
    lucide.createIcons({ root: elList });
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Events
function setupEventListeners() {
  if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
  if (btnLang) btnLang.addEventListener('click', toggleLanguage);

  const btnNewReq = document.getElementById('btn-new-request');
  if (btnNewReq) btnNewReq.addEventListener('click', () => openModal());

  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      customConfirm(t('confirm_demo'), () => {
        resetDemoData();
      });
    });
  }

  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) filterStatus.addEventListener('change', renderList);

  const logoEl = document.querySelector('.logo');
  let logoClicks = 0;
  let currentEasterEggIndex = -1;
  if (logoEl) {
    logoEl.style.cursor = 'pointer';
    logoEl.addEventListener('click', () => {
      logoClicks++;
      if (logoClicks % 10 === 0) {
        currentEasterEggIndex = (currentEasterEggIndex + 1) % easterEggAnimations.length;
        activateEasterEgg(currentEasterEggIndex);
        const names = ['Донат найдено! 🍩', 'Матриця активована! 🖥️', 'Гра Життя запущена! 🦠'];
        showToast(names[currentEasterEggIndex], 'success');
      }
    });
  }

  if (elSubjectList) elSubjectList.addEventListener('change', renderList);

  const sortBy = document.getElementById('sort-by');
  if (sortBy) sortBy.addEventListener('change', renderList);

  if (inpSearch) inpSearch.addEventListener('input', renderList);

  if (btnSaveDraft) btnSaveDraft.addEventListener('click', () => saveForm('Draft'));

  if (elForm) {
    elForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveForm('Submitted');
    });
  }
}

// Modal Form Logic
function openModal(req = null) {
  clearErrors();

  if (req) {
    if (elModalTitle) elModalTitle.textContent = req.status === 'Draft' ? t('modal_edit_title') : t('modal_view_title');
    if (inpId) inpId.value = req.id;
    if (inpStatus) inpStatus.value = req.status;
    if (inpAuthor) inpAuthor.value = req.author || '';
    if (inpSubject) inpSubject.value = req.subject || '';
    if (inpTopic) inpTopic.value = req.topic || '';
    if (inpDate) inpDate.value = req.date || '';
    if (inpTime) inpTime.value = req.time || '';
  } else {
    if (elModalTitle) elModalTitle.textContent = t('modal_new_title');
    if (elForm) elForm.reset();
    if (inpId) inpId.value = '';
    if (inpStatus) inpStatus.value = 'Draft';
    if (inpAuthor) inpAuthor.value = currentNickname || '';
  }

  const isReadOnly = req && req.status !== 'Draft';
  if (inpSubject) inpSubject.disabled = isReadOnly;
  if (inpTopic) inpTopic.disabled = isReadOnly;
  if (inpDate) inpDate.disabled = isReadOnly;
  if (inpTime) inpTime.disabled = isReadOnly;

  if (isReadOnly) {
    if (btnSaveDraft) btnSaveDraft.classList.add('hidden');
    if (btnSubmit) btnSubmit.classList.add('hidden');
  } else {
    if (btnSaveDraft) btnSaveDraft.classList.remove('hidden');
    if (btnSubmit) btnSubmit.classList.remove('hidden');
  }

  if (elModal) elModal.classList.remove('hidden');
}

function closeModal() {
  if (elModal) elModal.classList.add('hidden');
}

function clearErrors() {
  document.querySelectorAll('.error-text').forEach(el => {
    el.innerHTML = '';
    el.classList.add('hidden');
  });
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
}

function showError(inputId, errId, message) {
  const elErr = document.getElementById(errId);
  const elInp = document.getElementById(inputId);
  if (elErr) {
    elErr.innerHTML = `<i data-lucide="alert-triangle" style="width:14px;height:14px;"></i> ${message}`;
    elErr.classList.remove('hidden');
    if (window.lucide) lucide.createIcons({ root: elErr });
  }
  if (elInp) {
    elInp.classList.add('input-error');
  }
}

function validateForm(targetStatus) {
  clearErrors();
  let isValid = true;

  const subject = inpSubject ? inpSubject.value.trim() : '';
  const topic = inpTopic ? inpTopic.value.trim() : '';
  const date = inpDate ? inpDate.value : '';
  const time = inpTime ? inpTime.value : '';

  // BR-01: Draft requires at least one field
  if (targetStatus === 'Draft') {
    if (!subject && !topic && !date && !time) {
      showError('form-topic', 'err-topic', t('err_draft_empty'));
      isValid = false;
    }
    return isValid;
  }

  // Submitted requires all fields
  if (!subject) {
    showError('form-subject', 'err-subject', t('err_subj_empty'));
    isValid = false;
  }
  if (!topic) {
    showError('form-topic', 'err-topic', t('err_topic_empty'));
    isValid = false;
  }
  if (!date) {
    showError('form-date', 'err-date', t('err_date_empty'));
    isValid = false;
  }
  if (!time) {
    showError('form-time', 'err-time', t('err_time_empty'));
    isValid = false;
  }

  // BR-04: Topic length
  if (topic && (topic.length < 5 || topic.length > 300)) {
    showError('form-topic', 'err-topic', t('err_topic_len'));
    isValid = false;
  }

  if (date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    // BR-02: Past date
    if (selectedDate < today) {
      showError('form-date', 'err-date', t('err_date_past'));
      isValid = false;
    }

    // BR-02: Weekend
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      showError('form-date', 'err-date', t('err_date_weekend'));
      isValid = false;
    }
  }

  if (time) {
    // BR-03: Time 08:30 - 18:00
    const timeParts = time.split(':');
    const minutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    const minTime = 8 * 60 + 30; // 08:30
    const maxTime = 18 * 60;     // 18:00

    if (minutes < minTime || minutes > maxTime) {
      showError('form-time', 'err-time', t('err_time_range'));
      isValid = false;
    }
  }

  return isValid;
}

function saveForm(targetStatus) {
  if (!validateForm(targetStatus)) {
    showToast(t('toast_fix_errors'), 'error');
    return;
  }

  const id = (inpId && inpId.value) || Date.now().toString();
  const now = new Date().toISOString();

  let req = requests.find(r => r.id === id);
  const isNew = !req;
  if (isNew) {
    req = { id, createdAt: now };
    requests.push(req);
  }

  if (inpSubject) req.subject = inpSubject.value.trim();
  if (inpTopic) req.topic = inpTopic.value.trim();
  if (inpDate) req.date = inpDate.value;
  if (inpTime) req.time = inpTime.value;
  req.status = targetStatus;
  req.author = currentNickname;
  req.updatedAt = now;

  saveData();
  closeModal();
  showToast(isNew ? t('toast_created') : t('toast_saved'), 'success');
}

function deleteRequest(id) {
  customConfirm(t('confirm_delete'), () => {
    requests = requests.filter(r => r.id !== id);
    saveData();
    showToast(t('toast_deleted'), 'success');
  });
}

function changeStatus(id, newStatus) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    saveData();
    showToast(`${t('toast_status_changed')} "${t('val_' + newStatus)}"`, 'success');
  }
}

// Easter Eggs
const easterEggAnimations = [
  // 0: Spinning Donut
  (canvas) => {
    let A = 0, B = 0;
    const chars = '.,-~:;=!*#$@';
    function frame() {
      if (!document.getElementById('easter-egg-canvas')) return;
      const b = [], z = [];
      A += 0.04; B += 0.02;
      const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
      for (let k = 0; k < 1760; k++) { b[k] = k % 80 === 79 ? '\n' : ' '; z[k] = 0; }
      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i), cp = Math.cos(i),
            h = ct + 2, D = 1 / (sp * h * sA + st * cA + 5),
            tx = sp * h * cA - st * sA;
          const x = 0 | (40 + 30 * D * (cp * h * cB - tx * sB)),
            y = 0 | (12 + 15 * D * (cp * h * sB + tx * cB)),
            o = x + 80 * y,
            N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
          if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) { z[o] = D; b[o] = chars[N > 0 ? N : 0]; }
        }
      }
      canvas.textContent = b.join('');
      requestAnimationFrame(frame);
    }
    frame();
  },
  // 1: Matrix Digital Rain
  (canvas) => {
    const cols = 30, rows = 22;
    const drops = Array.from({length: cols}, () => (Math.random() * rows) | 0);
    const grid = Array.from({length: rows}, () => Array(cols).fill(' '));
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01234567';
    function frame() {
      if (!document.getElementById('easter-egg-canvas')) return;
      for (let col = 0; col < cols; col++) {
        const row = drops[col];
        grid[row][col] = katakana[(Math.random() * katakana.length) | 0];
        if (row < rows - 1) grid[row + 1][col] = katakana[(Math.random() * katakana.length) | 0];
        if (Math.random() > 0.95) drops[col] = 0;
        else drops[col] = (drops[col] + 1) % rows;
      }
      canvas.textContent = grid.map(r => r.join(' ')).join('\n');
      setTimeout(() => requestAnimationFrame(frame), 80);
    }
    frame();
  },
  // 2: Conway's Game of Life
  (canvas) => {
    const W = 60, H = 20;
    let grid = Array.from({length: H}, () =>
      Array.from({length: W}, () => Math.random() > 0.72 ? 1 : 0)
    );
    function neighbors(g, r, c) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0)
            n += (g[(r + dr + H) % H]?.[(c + dc + W) % W] || 0);
      return n;
    }
    function frame() {
      if (!document.getElementById('easter-egg-canvas')) return;
      const next = Array.from({length: H}, (_, r) =>
        Array.from({length: W}, (_, c) => {
          const n = neighbors(grid, r, c);
          return grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        })
      );
      grid = next;
      canvas.textContent = grid.map(r => r.map(c => c ? '#' : '·').join('')).join('\n');
      setTimeout(() => requestAnimationFrame(frame), 120);
    }
    frame();
  }
];

let easterEggAnimId = null;

function activateEasterEgg(index) {
  const old = document.getElementById('easter-egg-canvas');
  if (old) old.remove();

  const canvas = document.createElement('pre');
  canvas.id = 'easter-egg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '50%';
  canvas.style.left = '5%';
  canvas.style.transform = 'translateY(-50%)';
  canvas.style.fontFamily = 'monospace';
  canvas.style.fontSize = '13px';
  canvas.style.lineHeight = '1.2';
  canvas.style.color = 'var(--primary)';
  canvas.style.opacity = '0';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  canvas.style.transition = 'opacity 0.8s ease';
  document.body.appendChild(canvas);
  setTimeout(() => { canvas.style.opacity = '0.25'; }, 50);

  easterEggAnimations[index](canvas);
}
