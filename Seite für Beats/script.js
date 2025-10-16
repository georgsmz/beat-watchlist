const form = document.getElementById('linkForm');
const cardsContainer = document.getElementById('cardsContainer');

// HTML escapen zum Schutz vor XSS
function escapeHtml(text) {
  const map = {
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Links laden
function loadLinks() {
  const links = JSON.parse(localStorage.getItem('savedLinks') || '[]');
  cardsContainer.innerHTML = '';

  links.forEach((link, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      ${link.image ? `<img src="${escapeHtml(link.image)}" alt="Vorschaubild" class="preview-image" />` : ''}
      <div class="card-content">
        <h3>${escapeHtml(link.title)}</h3>

        <div class="editable" data-index="${index}">
          <p><strong>BPM:</strong> <span class="bpm-text">${escapeHtml(link.bpm || '')}</span></p>
          <p><strong>Key:</strong> <span class="key-text">${escapeHtml(link.key || '')}</span></p>
        </div>

        <p class="link">
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-icon" title="Link öffnen" aria-label="Link öffnen">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffb3a7" viewBox="0 0 24 24" width="20" height="20">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h3v-2h-3a5.1 5.1 0 0 0 0 10.2h3v-2h-3a3.1 3.1 0 0 1-3.1-3.1zm4.9-1h5v2h-5v-2zm7.1-3h-3v2h3a3.1 3.1 0 0 1 0 6.2h-3v2h3a5.1 5.1 0 0 0 0-10.2z"/>
            </svg>
          </a>
        </p>
      </div>

      <button class="edit-btn" title="Bearbeiten" aria-label="Bearbeiten" onclick="editLink(${index}, this)"></button>
      <button class="delete-btn" title="Löschen" aria-label="Löschen" onclick="deleteLink(${index})"></button>
    `;

    cardsContainer.appendChild(card);
  });
}

// Link speichern
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const title = document.getElementById('title').value.trim();
  const bpm = document.getElementById('bpm').value.trim();
  const key = document.getElementById('key').value.trim();
  const image = document.getElementById('image').value.trim();

  const newLink = { url, title, bpm, key, image };
  const existingLinks = JSON.parse(localStorage.getItem('savedLinks') || '[]');
  existingLinks.push(newLink);
  localStorage.setItem('savedLinks', JSON.stringify(existingLinks));

  form.reset();
  loadLinks();
});

// Link löschen
function deleteLink(index) {
  const links = JSON.parse(localStorage.getItem('savedLinks') || '[]');
  links.splice(index, 1);
  localStorage.setItem('savedLinks', JSON.stringify(links));
  loadLinks();
}

// Link bearbeiten
function editLink(index, button) {
  const links = JSON.parse(localStorage.getItem('savedLinks') || '[]');
  const link = links[index];

  const cardContent = button.parentElement.querySelector('.editable');
  const bpmSpan = cardContent.querySelector('.bpm-text');
  const keySpan = cardContent.querySelector('.key-text');

  // Ersetze Text mit Input-Feldern
  bpmSpan.outerHTML = `<input type="text" class="edit-bpm" value="${escapeHtml(link.bpm || '')}" />`;
  keySpan.outerHTML = `<input type="text" class="edit-key" value="${escapeHtml(link.key || '')}" />`;

  // Ändere Edit-Button zu Save-Button
  button.innerHTML = '💾';
  button.title = 'Speichern';
  button.onclick = function () {
    const newBpm = cardContent.querySelector('.edit-bpm').value.trim();
    const newKey = cardContent.querySelector('.edit-key').value.trim();

    links[index].bpm = newBpm;
    links[index].key = newKey;

    localStorage.setItem('savedLinks', JSON.stringify(links));
    loadLinks();
  };
}

// JSON exportieren
function exportToFile() {
  const links = localStorage.getItem('savedLinks');
  if (!links || JSON.parse(links).length === 0) {
    alert("Keine Links zum Exportieren.");
    return;
  }

  const blob = new Blob([links], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "links.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Seite laden
window.addEventListener('load', loadLinks);
