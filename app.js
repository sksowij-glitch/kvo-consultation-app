// app.js

const STORAGE_KEY = 'consultation_requests';
let requests = [];

// DOM Elements
const elList = document.getElementById('request-list');
const elEmpty = document.getElementById('empty-state');
const elModal = document.getElementById('modal-form');
const elModalTitle = document.getElementById('modal-title');
const elForm = document.getElementById('request-form');
const elErrors = document.getElementById('form-errors');
const elSubjectList = document.getElementById('filter-subject');

// Inputs
const inpId = document.getElementById('form-id');
const inpStatus = document.getElementById('form-status');
const inpSubject = document.getElementById('form-subject');
const inpTopic = document.getElementById('form-topic');
const inpDate = document.getElementById('form-date');
const inpTime = document.getElementById('form-time');

// Buttons
const btnSaveDraft = document.getElementById('btn-save-draft');
const btnSubmit = document.getElementById('btn-submit-request');

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  renderApp();
});

// State Management
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

async function resetDemoData() {
  try {
    const response = await fetch('data/demo.json');
    if (response.ok) {
      requests = await response.json();
      saveData();
    } else {
      alert('Не вдалося завантажити демо-дані.');
    }
  } catch (error) {
    console.error('Error loading demo data:', error);
    alert('Помилка завантаження демо-даних.');
  }
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

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-confirmed').textContent = confirmed;
}

function updateFilters() {
  const subjects = new Set(requests.map(r => r.subject).filter(Boolean));
  const currentVal = elSubjectList.value;
  
  elSubjectList.innerHTML = '<option value="All">Всі предмети</option>';
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
  const filterStatus = document.getElementById('filter-status').value;
  const filterSubject = elSubjectList.value;
  const sortBy = document.getElementById('sort-by').value;

  let filtered = requests.filter(r => {
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchSubject = filterSubject === 'All' || r.subject === filterSubject;
    return matchStatus && matchSubject;
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
  const data = getFilteredAndSortedRequests();
  elList.innerHTML = '';

  if (data.length === 0) {
    elList.classList.add('hidden');
    elEmpty.classList.remove('hidden');
    return;
  }

  elList.classList.remove('hidden');
  elEmpty.classList.add('hidden');

  data.forEach(req => {
    const card = document.createElement('div');
    card.className = 'request-card';
    
    // Header
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <div>
        <div class="card-title">${escapeHTML(req.topic || 'Без теми')}</div>
        <div class="card-subject">${escapeHTML(req.subject || 'Предмет не вказано')}</div>
      </div>
      <span class="badge status-${req.status}">${getStatusLabel(req.status)}</span>
    `;
    card.appendChild(header);

    // Details
    const details = document.createElement('div');
    details.className = 'card-details';
    if (req.date && req.time) {
      details.innerHTML += `<div class="detail-item">📅 ${req.date} 🕒 ${req.time}</div>`;
    } else {
      details.innerHTML += `<div class="detail-item">🕒 Час не призначено</div>`;
    }
    details.innerHTML += `<div class="detail-item">Створено: ${new Date(req.createdAt).toLocaleDateString()}</div>`;
    card.appendChild(details);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    if (req.status === 'Draft') {
      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn btn-secondary';
      btnEdit.textContent = 'Редагувати';
      btnEdit.onclick = () => openModal(req);
      actions.appendChild(btnEdit);
    } else {
      const btnView = document.createElement('button');
      btnView.className = 'btn btn-secondary';
      btnView.textContent = 'Переглянути';
      btnView.onclick = () => openModal(req);
      actions.appendChild(btnView);
    }

    if (req.status === 'Draft' || req.status === 'Cancelled') {
      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn btn-danger';
      btnDelete.textContent = 'Видалити';
      btnDelete.onclick = () => deleteRequest(req.id);
      actions.appendChild(btnDelete);
    }

    // Teacher Simulation
    if (req.status === 'Submitted') {
      const btnConfirm = document.createElement('button');
      btnConfirm.className = 'btn btn-success';
      btnConfirm.textContent = 'Підтвердити зустріч';
      btnConfirm.onclick = () => changeStatus(req.id, 'Confirmed');
      actions.appendChild(btnConfirm);

      const btnCancel = document.createElement('button');
      btnCancel.className = 'btn btn-danger';
      btnCancel.textContent = 'Відхилити';
      btnCancel.onclick = () => changeStatus(req.id, 'Cancelled');
      actions.appendChild(btnCancel);
    }

    if (req.status === 'Confirmed') {
      const btnCancel = document.createElement('button');
      btnCancel.className = 'btn btn-danger';
      btnCancel.textContent = 'Скасувати зустріч';
      btnCancel.onclick = () => changeStatus(req.id, 'Cancelled');
      actions.appendChild(btnCancel);
    }

    if (actions.children.length > 0) {
      card.appendChild(actions);
    }

    elList.appendChild(card);
  });
}

function getStatusLabel(status) {
  const map = {
    'Draft': 'Чернетка',
    'Submitted': 'Подано',
    'Confirmed': 'Підтверджено',
    'Cancelled': 'Скасовано'
  };
  return map[status] || status;
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
  document.getElementById('btn-new-request').addEventListener('click', () => openModal());
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', closeModal);
  
  document.getElementById('btn-reset').addEventListener('click', () => {
    if(confirm('Увага! Всі поточні заявки будуть замінені демо-даними. Продовжити?')) {
      resetDemoData();
    }
  });

  document.getElementById('filter-status').addEventListener('change', renderList);
  document.getElementById('filter-subject').addEventListener('change', renderList);
  document.getElementById('sort-by').addEventListener('change', renderList);

  btnSaveDraft.addEventListener('click', () => saveForm('Draft'));
  
  elForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveForm('Submitted');
  });
}

// Modal Form Logic
function openModal(req = null) {
  elErrors.classList.add('hidden');
  elErrors.textContent = '';
  
  if (req) {
    elModalTitle.textContent = req.status === 'Draft' ? 'Редагувати заявку' : 'Перегляд заявки';
    inpId.value = req.id;
    inpStatus.value = req.status;
    inpSubject.value = req.subject || '';
    inpTopic.value = req.topic || '';
    inpDate.value = req.date || '';
    inpTime.value = req.time || '';
  } else {
    elModalTitle.textContent = 'Нова заявка';
    elForm.reset();
    inpId.value = '';
    inpStatus.value = 'Draft';
  }

  const isReadOnly = req && req.status !== 'Draft';
  inpSubject.disabled = isReadOnly;
  inpTopic.disabled = isReadOnly;
  inpDate.disabled = isReadOnly;
  inpTime.disabled = isReadOnly;
  
  if (isReadOnly) {
    btnSaveDraft.classList.add('hidden');
    btnSubmit.classList.add('hidden');
  } else {
    btnSaveDraft.classList.remove('hidden');
    btnSubmit.classList.remove('hidden');
  }

  elModal.classList.remove('hidden');
}

function closeModal() {
  elModal.classList.add('hidden');
}

function validateForm(targetStatus) {
  const errors = [];
  
  const subject = inpSubject.value.trim();
  const topic = inpTopic.value.trim();
  const date = inpDate.value;
  const time = inpTime.value;

  // BR-01: Draft requires at least one field
  if (targetStatus === 'Draft') {
    if (!subject && !topic && !date && !time) {
      errors.push('Для збереження чернетки заповніть хоча б одне поле.');
    }
    return errors;
  }

  // Submitted requires all fields
  if (!subject || !topic || !date || !time) {
    errors.push('Будь ласка, заповніть усі обов\'язкові поля для подачі заявки.');
  }

  // BR-04: Topic length
  if (topic && (topic.length < 5 || topic.length > 300)) {
    errors.push('Опис проблеми має містити від 5 до 300 символів.');
  }

  if (date) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(date);
    
    // BR-02: Past date
    if (selectedDate < today) {
      errors.push('Дата консультації не може бути в минулому.');
    }

    // BR-02: Weekend
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      errors.push('Консультації не проводяться у вихідні дні. Оберіть будній день.');
    }
  }

  if (time) {
    // BR-03: Time 08:30 - 18:00
    const timeParts = time.split(':');
    const minutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    const minTime = 8 * 60 + 30; // 08:30
    const maxTime = 18 * 60;     // 18:00

    if (minutes < minTime || minutes > maxTime) {
      errors.push('Час консультації має бути в межах від 08:30 до 18:00.');
    }
  }

  return errors;
}

function saveForm(targetStatus) {
  const errors = validateForm(targetStatus);
  if (errors.length > 0) {
    elErrors.textContent = errors.join('\n');
    elErrors.classList.remove('hidden');
    return;
  }

  const id = inpId.value || Date.now().toString();
  const now = new Date().toISOString();
  
  let req = requests.find(r => r.id === id);
  if (!req) {
    req = { id, createdAt: now };
    requests.push(req);
  }

  req.subject = inpSubject.value.trim();
  req.topic = inpTopic.value.trim();
  req.date = inpDate.value;
  req.time = inpTime.value;
  req.status = targetStatus;
  req.updatedAt = now;

  saveData();
  closeModal();
}

function deleteRequest(id) {
  if (confirm('Ви впевнені, що хочете видалити цю заявку?')) {
    requests = requests.filter(r => r.id !== id);
    saveData();
  }
}

function changeStatus(id, newStatus) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    saveData();
  }
}
