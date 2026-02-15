// Login-Logik
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');
    
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem('authenticated', 'true');
            // Weiterleitung zur Prüfungsauswahl statt direkt zum Protokoll
            window.location.href = 'exam-selection.html';
        } else {
            errorMsg.textContent = 'Falsches Passwort';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.textContent = 'Fehler beim Login';
        errorMsg.style.display = 'block';
    }
});

// Enter-Taste im Passwort-Feld
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});
