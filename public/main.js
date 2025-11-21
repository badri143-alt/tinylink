/* main.js — improved frontend interactions */
const BASE_URL = window.location.origin;
document.getElementById('baseUrl').innerText = BASE_URL;

const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const t = $('toast');
  t.innerText = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2200);
};

async function fetchLinks() {
  const res = await fetch('/api/links');
  if (!res.ok) return [];
  return await res.json();
}

function shortUrl(code) {
  return `${BASE_URL}/${code}`;
}

function formatDate(ts) {
  return ts ? new Date(ts).toLocaleString() : '—';
}

/* Render single row */
function makeRow(l) {
  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50';
  tr.innerHTML = `
    <td class="p-2 align-top"><a class="text-blue-600 font-medium" href="${shortUrl(l.code)}" target="_blank">${l.code}</a></td>
    <td class="p-2 align-top"><div class="text-xs text-slate-500 truncate-2" title="${l.long_url}">${l.long_url}</div></td>
    <td class="p-2 text-center align-top">${l.clicks}</td>
    <td class="p-2 align-top">${formatDate(l.last_clicked)}</td>
    <td class="p-2 text-right align-top">
      <button data-code="${l.code}" class="copyBtn px-2 py-1 mr-2 text-xs bg-slate-100 rounded">Copy</button>
      <a class="px-2 py-1 mr-2 text-xs text-blue-600" href="/code.html?code=${l.code}">Stats</a>
      <button data-code="${l.code}" class="delBtn px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
    </td>
  `;
  return tr;
}

/* Render list */
async function loadAndRender() {
  const list = await fetchLinks();
  const tbody = $('linksBody');
  tbody.innerHTML = '';
  if (!list || list.length === 0) {
    $('emptyState').classList.remove('hidden');
    $('statTotal').innerText = 0;
    $('statClicks').innerText = 0;
    $('statRecent').innerText = '—';
    return;
  }
  $('emptyState').classList.add('hidden');

  // stats
  const total = list.length;
  const clicks = list.reduce((s, x) => s + (x.clicks || 0), 0);
  const recent = list.filter(x => x.last_clicked).sort((a,b) => new Date(b.last_clicked) - new Date(a.last_clicked))[0];
  $('statTotal').innerText = total;
  $('statClicks').innerText = clicks;
  $('statRecent').innerText = recent ? recent.code : '—';

  // search filter
  const q = $('search').value.trim().toLowerCase();
  const filtered = q ? list.filter(l => l.code.toLowerCase().includes(q) || l.long_url.toLowerCase().includes(q)) : list;

  for (const l of filtered) {
    tbody.appendChild(makeRow(l));
  }

  attachRowActions();
}

/* Row actions: copy + delete */
function attachRowActions() {
  document.querySelectorAll('.copyBtn').forEach(b => {
    b.onclick = () => {
      const code = b.dataset.code;
      navigator.clipboard.writeText(shortUrl(code));
      b.innerText = 'Copied';
      setTimeout(()=> b.innerText = 'Copy', 1200);
      toast('Copied short URL');
    };
  });
  document.querySelectorAll('.delBtn').forEach(b => {
    b.onclick = async () => {
      const code = b.dataset.code;
      if (!confirm(`Delete ${code}?`)) return;
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Deleted');
        await loadAndRender();
      } else {
        toast('Delete failed');
      }
    };
  });
}

/* Create form */
$('createForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = $('url').value.trim();
  const code = $('code').value.trim();
  const btn = $('createBtn');
  const urlErr = $('urlError');
  urlErr.classList.add('hidden');

  if (!url) { urlErr.innerText = 'URL required'; urlErr.classList.remove('hidden'); return; }
  // basic client-side validation
  try { new URL(url); } catch { urlErr.innerText = 'Invalid URL'; urlErr.classList.remove('hidden'); return; }

  btn.disabled = true;
  btn.classList.add('opacity-70');
  $('createMsg').innerText = 'Creating...';

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    });

    if (res.status === 201) {
      $('createMsg').innerText = 'Created';
      $('url').value = '';
      $('code').value = '';
      await loadAndRender();
      toast('Link created');
    } else {
      const err = await res.json();
      $('createMsg').innerText = err.error || 'Error';
      toast(err.error || 'Error creating link');
    }
  } catch (err) {
    $('createMsg').innerText = 'Network error';
    toast('Network error');
  } finally {
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    setTimeout(()=> $('createMsg').innerText = '', 2200);
  }
});

/* refresh + search */
$('refreshBtn').addEventListener('click', loadAndRender);
$('search').addEventListener('input', () => loadAndRender());

/* initial load */
loadAndRender();
