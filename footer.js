// footer.js - Общий футер для всех страниц
function initializeFooter() {
    // Удаляем все существующие футеры чтобы избежать дублирования
    const existingFooters = document.querySelectorAll('footer, .footer');
    existingFooters.forEach(footer => footer.remove());
    
    const footerHTML = `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <a href="index.html" class="logo">
                        <span>Great</span> Cinema
                    </a>
                    <p>Қазақстанның ең жақсы кинотеатр желісі. Сізге ең соңғы фильмдер мен ең жақсы тамашалау тәжірибесін ұсынамыз.</p>
                    <div class="social-links">
                        <a href="#"><i class="bi bi-facebook"></i></a>
                        <a href="#"><i class="bi bi-instagram"></i></a>
                        <a href="#"><i class="bi bi-twitter"></i></a>
                        <a href="#"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>Байланыс ақпараты</h3>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="bi bi-geo-alt"></i>
                            <span>Нұр-Сұлтан, Кабанбай батыр көш., 21</span>
                        </div>
                        <div class="contact-item">
                            <i class="bi bi-telephone"></i>
                            <span>+7 (7172) 123-456</span>
                        </div>
                        <div class="contact-item">
                            <i class="bi bi-envelope"></i>
                            <span>info@greatcinema.kz</span>
                        </div>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>Жылдам сілтемелер</h3>
                    <a href="index.html">Басты бет</a>
                    <a href="about.html">Біз туралы</a>
                    <a href="profile.html">Менің профилім</a>
                    <a href="#">Көмек орталығы</a>
                    <a href="#">Жиі қойылатын сұрақтар</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Great Cinema. Барлық құқықтар қорғалған.</p>
            </div>
        </footer>
    `;
    
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.addEventListener('DOMContentLoaded', initializeFooter);