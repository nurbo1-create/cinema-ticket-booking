// auth.js - Система аутентификации
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('cinemaUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Форма входа
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Форма регистрации
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });
    }

    showTab(tabName) {
        // Скрыть все формы
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Убрать активный класс со всех вкладок
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Показать выбранную форму
        document.getElementById(tabName + 'Form').classList.add('active');
        
        // Активировать выбранную вкладку
        document.querySelectorAll('.auth-tab').forEach(tab => {
            if (tab.textContent === (tabName === 'login' ? 'Кіру' : 'Тіркелу')) {
                tab.classList.add('active');
            }
        });
    }

    register() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Валидация
        if (password !== confirmPassword) {
            alert('Құпиясөздер сәйкес келмейді!');
            return;
        }

        if (this.users.find(user => user.email === email)) {
            alert('Бұл email бойынша тіркелген пайдаланушы бар!');
            return;
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password, // В реальном проекте нужно хэшировать!
            registrationDate: new Date().toISOString(),
            tickets: []
        };

        this.users.push(newUser);
        localStorage.setItem('cinemaUsers', JSON.stringify(this.users));

        alert('Сіз сәтті тіркелдіңіз! Енді жүйеге кіре аласыз.');
        this.showTab('login');
    }

    login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Сәтті кірдіңіз!');
            window.location.href = 'index.html';
        } else {
            alert('Қате email немесе құпиясөз!');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    checkAuthState() {
        if (this.currentUser && window.location.pathname.includes('auth.html')) {
            window.location.href = 'index.html';
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    addTicketToUser(ticketData) {
        if (!this.currentUser) return false;

        const ticket = {
            id: Date.now(),
            ...ticketData,
            purchaseDate: new Date().toISOString()
        };

        this.currentUser.tickets.push(ticket);
        
        // Обновить в массиве пользователей
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('cinemaUsers', JSON.stringify(this.users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return true;
    }
}

// Глобальный экземпляр системы аутентификации
const authSystem = new AuthSystem();

// Глобальные функции для использования в HTML
function showTab(tabName) {
    authSystem.showTab(tabName);
}

function logout() {
    authSystem.logout();
}
// Добавить в auth.js
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}