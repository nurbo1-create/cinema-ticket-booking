// admin.js - Логика админ-панели
class AdminPanel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('cinemaUsers')) || [];
        this.movies = JSON.parse(localStorage.getItem('cinemaMovies')) || this.getDefaultMovies();
        this.sessions = JSON.parse(localStorage.getItem('cinemaSessions')) || [];
        this.adminActivities = JSON.parse(localStorage.getItem('adminActivities')) || [];
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.loadDashboard();
        this.setupEventListeners();
        this.loadMoviesTable();
        this.loadSessionsTable();
        this.loadUsersTable();
        this.loadTicketsTable();
    }

    checkAdminAccess() {
        // Простая проверка доступа (в реальном проекте нужна proper аутентификация)
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Әкімші панеліне кіру үшін авторизация қажет!');
            window.location.href = 'auth.html';
            return;
        }
        
        document.getElementById('adminWelcome').textContent = `Қош келдіңіз, ${currentUser.name}!`;
    }

    getDefaultMovies() {
        return [
            {
                id: 1,
                title: "Jawan",
                genre: "Экшен",
                duration: 165,
                rating: "PG-13",
                description: "Экшен-триллер",
                poster: "img/jawan.jpg",
                status: "active"
            },
            {
                id: 2,
                title: "Gadar 2",
                genre: "Драма",
                duration: 120,
                rating: "PG-13",
                description: "Драматический фильм",
                poster: "img/Gadar2.jpg",
                status: "active"
            }
        ];
    }

    setupEventListeners() {
        // Форма добавления фильма
        document.getElementById('addMovieForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMovie();
        });

        // Форма добавления сеанса
        document.getElementById('addSessionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSession();
        });
    }

    loadDashboard() {
        // Статистика пользователей
        document.getElementById('totalUsers').textContent = this.users.length;
        
        // Статистика фильмов
        const activeMovies = this.movies.filter(movie => movie.status === 'active');
        document.getElementById('totalMovies').textContent = activeMovies.length;
        
        // Статистика билетов
        let totalTickets = 0;
        let totalRevenue = 0;
        
        this.users.forEach(user => {
            if (user.tickets) {
                totalTickets += user.tickets.length;
                user.tickets.forEach(ticket => {
                    totalRevenue += parseInt(ticket.price) || 0;
                });
            }
        });
        
        document.getElementById('totalTickets').textContent = totalTickets;
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' ₸';
        
        // Быстрая статистика
        document.getElementById('todayTickets').textContent = this.getTodayTickets();
        document.getElementById('weekRevenue').textContent = this.getWeekRevenue().toLocaleString() + ' ₸';
        document.getElementById('activeSessions').textContent = this.getActiveSessions();
        
        // Активность
        this.loadRecentActivity();
    }

    getTodayTickets() {
        const today = new Date().toDateString();
        let count = 0;
        
        this.users.forEach(user => {
            if (user.tickets) {
                user.tickets.forEach(ticket => {
                    const ticketDate = new Date(ticket.purchaseDate).toDateString();
                    if (ticketDate === today) {
                        count++;
                    }
                });
            }
        });
        
        return count;
    }

    getWeekRevenue() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        let revenue = 0;
        
        this.users.forEach(user => {
            if (user.tickets) {
                user.tickets.forEach(ticket => {
                    const ticketDate = new Date(ticket.purchaseDate);
                    if (ticketDate >= weekAgo) {
                        revenue += parseInt(ticket.price) || 0;
                    }
                });
            }
        });
        
        return revenue;
    }

    getActiveSessions() {
        const now = new Date();
        return this.sessions.filter(session => {
            const sessionDate = new Date(session.date + ' ' + session.time);
            return sessionDate > now;
        }).length;
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        
        if (this.adminActivities.length === 0) {
            // Создаем демо-активность
            this.adminActivities = [
                { action: 'Жаңа фильм қосылды: Jawan', time: new Date().toLocaleString('kk-KZ') },
                { action: 'Пайдаланушы тіркелді: John Doe', time: new Date(Date.now() - 3600000).toLocaleString('kk-KZ') },
                { action: 'Сеанс жасалды: Jawan - 19:00', time: new Date(Date.now() - 7200000).toLocaleString('kk-KZ') }
            ];
            localStorage.setItem('adminActivities', JSON.stringify(this.adminActivities));
        }
        
        activityContainer.innerHTML = this.adminActivities.map(activity => `
            <div class="activity-item">
                <div>${activity.action}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    loadMoviesTable() {
        const table = document.getElementById('moviesTable');
        table.innerHTML = this.movies.map(movie => `
            <tr>
                <td><img src="${movie.poster}" alt="${movie.title}" style="width: 40px; height: 50px; border-radius: 5px;"></td>
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${movie.duration} мин</td>
                <td>${movie.rating}</td>
                <td><span class="status-badge ${movie.status === 'active' ? 'status-active' : 'status-inactive'}">${movie.status === 'active' ? 'Белсенді' : 'Белсенді емес'}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="adminPanel.editMovie(${movie.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-delete" onclick="adminPanel.deleteMovie(${movie.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    loadSessionsTable() {
        const table = document.getElementById('sessionsTable');
        table.innerHTML = this.sessions.map(session => {
            const movie = this.movies.find(m => m.id === session.movieId);
            return `
                <tr>
                    <td>${movie ? movie.title : 'Белгісіз'}</td>
                    <td>${session.date}</td>
                    <td>${session.time}</td>
                    <td>${session.hall}</td>
                    <td>${session.availableSeats}</td>
                    <td>${session.price} ₸</td>
                    <td>
                        <button class="btn btn-edit"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-delete" onclick="adminPanel.deleteSession(${session.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Заполняем select фильмов для формы сеансов
        const movieSelect = document.getElementById('sessionMovie');
        movieSelect.innerHTML = '<option value="">Таңдаңыз</option>' + 
            this.movies.filter(movie => movie.status === 'active')
                .map(movie => `<option value="${movie.id}">${movie.title}</option>`)
                .join('');
    }

    loadUsersTable() {
        const table = document.getElementById('usersTable');
        table.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.registrationDate).toLocaleDateString('kk-KZ')}</td>
                <td>${user.tickets ? user.tickets.length : 0}</td>
                <td>${new Date().toLocaleDateString('kk-KZ')}</td>
                <td>
                    <button class="btn btn-edit"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-delete" onclick="adminPanel.deleteUser(${user.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    loadTicketsTable() {
        const table = document.getElementById('ticketsTable');
        let allTickets = [];
        
        this.users.forEach(user => {
            if (user.tickets) {
                user.tickets.forEach(ticket => {
                    allTickets.push({
                        ...ticket,
                        userName: user.name
                    });
                });
            }
        });
        
        table.innerHTML = allTickets.map(ticket => `
            <tr>
                <td>#${ticket.id}</td>
                <td>${ticket.movie}</td>
                <td>${ticket.userName}</td>
                <td>${ticket.date}</td>
                <td>${ticket.time}</td>
                <td>${ticket.seats}</td>
                <td>${ticket.price} ₸</td>
                <td><span class="status-badge status-active">Берілген</span></td>
            </tr>
        `).join('');
    }

    addMovie() {
        const movieData = {
            id: Date.now(),
            title: document.getElementById('movieTitle').value,
            genre: document.getElementById('movieGenre').value,
            duration: parseInt(document.getElementById('movieDuration').value),
            rating: document.getElementById('movieRating').value,
            description: document.getElementById('movieDescription').value,
            poster: document.getElementById('moviePoster').value || 'img/default.jpg',
            status: 'active'
        };

        this.movies.push(movieData);
        localStorage.setItem('cinemaMovies', JSON.stringify(this.movies));
        
        // Добавляем активность
        this.addActivity(`Жаңа фильм қосылды: ${movieData.title}`);
        
        // Обновляем таблицу
        this.loadMoviesTable();
        this.loadSessionsTable();
        
        // Скрываем форму и показываем уведомление
        this.hideMovieForm();
        alert('Фильм сәтті қосылды!');
    }

    addSession() {
        const sessionData = {
            id: Date.now(),
            movieId: parseInt(document.getElementById('sessionMovie').value),
            date: document.getElementById('sessionDate').value,
            time: document.getElementById('sessionTime').value,
            hall: document.getElementById('sessionHall').value,
            availableSeats: 100, // По умолчанию
            price: parseInt(document.getElementById('sessionPrice').value)
        };

        this.sessions.push(sessionData);
        localStorage.setItem('cinemaSessions', JSON.stringify(this.sessions));
        
        // Добавляем активность
        const movie = this.movies.find(m => m.id === sessionData.movieId);
        this.addActivity(`Сеанс жасалды: ${movie ? movie.title : 'Белгісіз'} - ${sessionData.time}`);
        
        // Обновляем таблицу
        this.loadSessionsTable();
        this.loadDashboard();
        
        // Скрываем форму и показываем уведомление
        this.hideSessionForm();
        alert('Сеанс сәтті қосылды!');
    }

    addActivity(action) {
        const activity = {
            action: action,
            time: new Date().toLocaleString('kk-KZ')
        };
        
        this.adminActivities.unshift(activity);
        if (this.adminActivities.length > 10) {
            this.adminActivities = this.adminActivities.slice(0, 10);
        }
        
        localStorage.setItem('adminActivities', JSON.stringify(this.adminActivities));
        this.loadRecentActivity();
    }

    deleteMovie(id) {
        if (confirm('Бұл фильмді жоюға сенімдісіз бе?')) {
            this.movies = this.movies.filter(movie => movie.id !== id);
            localStorage.setItem('cinemaMovies', JSON.stringify(this.movies));
            this.loadMoviesTable();
            this.addActivity(`Фильм жойылды: ID ${id}`);
        }
    }

    deleteSession(id) {
        if (confirm('Бұл сеансты жоюға сенімдісіз бе?')) {
            this.sessions = this.sessions.filter(session => session.id !== id);
            localStorage.setItem('cinemaSessions', JSON.stringify(this.sessions));
            this.loadSessionsTable();
            this.addActivity(`Сеанс жойылды: ID ${id}`);
        }
    }

    deleteUser(id) {
        if (confirm('Бұл пайдаланушыны жоюға сенімдісіз бе?')) {
            this.users = this.users.filter(user => user.id !== id);
            localStorage.setItem('cinemaUsers', JSON.stringify(this.users));
            this.loadUsersTable();
            this.loadDashboard();
            this.addActivity(`Пайдаланушы жойылды: ID ${id}`);
        }
    }
}

// Глобальные функции для взаимодействия с HTML
function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс со всех кнопок
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Активируем выбранную кнопку
    event.target.classList.add('active');
}

function showMovieForm() {
    document.getElementById('movieForm').style.display = 'block';
    document.getElementById('sessionForm').style.display = 'none';
    document.getElementById('quickStats').style.display = 'none';
}

function hideMovieForm() {
    document.getElementById('movieForm').style.display = 'none';
    document.getElementById('quickStats').style.display = 'block';
    document.getElementById('addMovieForm').reset();
}

function showSessionForm() {
    document.getElementById('sessionForm').style.display = 'block';
    document.getElementById('movieForm').style.display = 'none';
    document.getElementById('quickStats').style.display = 'none';
}

function hideSessionForm() {
    document.getElementById('sessionForm').style.display = 'none';
    document.getElementById('quickStats').style.display = 'block';
    document.getElementById('addSessionForm').reset();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Инициализация админ-панели
const adminPanel = new AdminPanel();