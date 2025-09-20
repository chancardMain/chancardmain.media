// ========== CONFIG (редактируй тут ссылки/адреса) ==========
const OWNER = "chancard_"; // отображаемое имя
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // 1) загрузка bio из bio.txt (если он есть в репо), иначе из localStorage, иначе текст по умолчанию
  loadBio();

  // 2) подключаем кнопки копирования
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.getAttribute('data-copy');
      copyToClipboard(text);
    });
  });

  // также любые элементы с классом .copy-btn (краткий)
  document.querySelectorAll('.copy-btn').forEach(b => {
    b.addEventListener('click', () => copyToClipboard(b.dataset.copy));
  });

  // 3) редактирование bio локально
  const bioEl = document.getElementById('bio');
  const editBtn = document.getElementById('editBioBtn');
  const saveBtn = document.getElementById('saveBioBtn');
  const cancelBtn = document.getElementById('cancelBioBtn');

  editBtn.addEventListener('click', () => {
    bioEl.contentEditable = "true";
    bioEl.focus();
    editBtn.style.display = 'none';
    saveBtn.style.display = '';
    cancelBtn.style.display = '';
  });

  saveBtn.addEventListener('click', () => {
    bioEl.contentEditable = "false";
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    editBtn.style.display = '';
    localStorage.setItem('chancard_bio', bioEl.textContent.trim());
    showToast('Сохранено локально');
  });

  cancelBtn.addEventListener('click', () => {
    bioEl.contentEditable = "false";
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    editBtn.style.display = '';
    // восстановим из localStorage или заново загрузим
    const saved = localStorage.getItem('chancard_bio');
    if (saved) bioEl.textContent = saved;
    else loadBio(); // попытается снова
  });

  // 4) QR: если нет qr.png (404), создаём динамическую ссылку на Google Chart API (если не хочешь — удаляй)
  const qrImg = document.getElementById('qr');
  qrImg.onerror = () => {
    const url = location.href;
    const qrUrl = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent(url);
    qrImg.src = qrUrl;
  };
});

// ===== functions =====
async function loadBio() {
  const bioEl = document.getElementById('bio');
  try {
    const res = await fetch('bio.txt', {cache: "no-cache"});
    if (res.ok){
      const txt = (await res.text()).trim();
      bioEl.textContent = txt || 'Добавь короткий текст в bio.txt в корне репозитория.';
      return;
    }
    throw new Error('no bio.txt');
  } catch (e) {
    // fallback: localStorage или дефолт
    const saved = localStorage.getItem('chancard_bio');
    if (saved) bioEl.textContent = saved;
    else bioEl.textContent = 'Привет! Я ' + (typeof OWNER === 'string' ? OWNER : '') + ' — сюда можно добавить краткий текст. Редактируй bio.txt в репозитории или используй кнопку "Редактировать".';
  }
}

function showToast(text, ms = 1800){
  const t = document.getElementById('toast');
  t.textContent = text;
  t.style.display = 'block';
  clearTimeout(t._t);
  t._t = setTimeout(()=> t.style.display = 'none', ms);
}

function copyToClipboard(text){
  if (!text) { showToast('Пустой текст'); return; }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(()=> showToast('Скопировано: ' + text.slice(0,20) + (text.length>20?'…':'')))
      .catch(()=> fallbackCopy(text));
  } else fallbackCopy(text);
}

function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try{
    document.execCommand('copy');
    showToast('Скопировано (fallback)');
  } catch(e){
    alert('Не удалось скопировать: ' + text);
  }
  ta.remove();
}