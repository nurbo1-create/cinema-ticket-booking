// navigation.js - Общая навигация для всех страниц
function initializeNavigation() {
    // Удаляем все существующие навигации чтобы избежать дублирования
    const existingNavs = document.querySelectorAll('nav, .navbar');
    existingNavs.forEach(nav => nav.remove());
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const navHTML = `
        <nav class="navbar">
            <a href="index.html" class="logo">
                <span>Great</span> Cinema
            </a>
            <div class="nav-links">
                ${currentUser ? `
                    <span class="user-welcome">Қош келдіңіз, ${currentUser.name}!</span>
                    <a href="profile.html" class="nav-link">Профиль</a>
                    <a href="about.html" class="nav-link">Біз туралы</a>
                    <button class="btn-logout" onclick="logout()">
                        <i class="bi bi-box-arrow-right"></i> Шығу
                    </button>
                ` : `
                    <a href="auth.html" class="nav-link">Тіркелу/Кіру</a>
                    <a href="profile.html" class="nav-link">Профиль</a>
                    <a href="about.html" class="nav-link">Біз туралы</a>
                    <a href="index.html" class="nav-link">Басты бет</a>
                `}
            </div>
        </nav>
    `;
    
    // Вставляем навигацию в начало body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeNavigation);