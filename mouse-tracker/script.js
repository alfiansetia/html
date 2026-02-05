const valX = document.getElementById('val-x');
const valY = document.getElementById('val-y');
const statusText = document.getElementById('status-text');
const badge = document.querySelector('.status-badge');
const blob = document.getElementById('blob');

window.addEventListener('mousemove', (event) => {
    // 1. Ambil koordinat mouse
    const x = event.clientX;
    const y = event.clientY;

    // 2. Update tampilan text
    valX.textContent = x;
    valY.textContent = y;

    // 3. Update status UI
    statusText.textContent = 'Mendeteksi pergerakan...';
    badge.classList.add('active');

    // 4. Efek visual - Blob mengikuti mouse secara halus
    // Kita berikan delay sedikit (melalui CSS transition) agar terlihat 'organik'
    blob.style.left = `${x}px`;
    blob.style.top = `${y}px`;
});

// Reset status jika mouse diam (opsional, untuk interaktivitas lebih)
let timeout;
window.addEventListener('mousemove', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        statusText.textContent = 'Mouse berhenti bergerak.';
        badge.classList.remove('active');
    }, 1000);
});
