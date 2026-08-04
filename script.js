// تبديل الثيم (Dark/Light Mode)
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// التحقق من التفضيل المحفوظ
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });
}

function updateToggleIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// تأثير الرياح البنفسجية المتحركة
const canvas = document.getElementById('purpleWindCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.length = Math.random() * 90 + 30;
            this.speed = Math.random() * 1.8 + 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.speed * 1.2;
            this.y -= this.speed * 0.5;

            if (this.x > width || this.y < 0) {
                this.x = -this.length;
                this.y = Math.random() * height + 50;
            }
        }

        draw() {
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y + (this.length * 0.4));
            gradient.addColorStop(0, `rgba(167, 139, 250, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.length, this.y + (this.length * 0.4));
            ctx.stroke();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}
