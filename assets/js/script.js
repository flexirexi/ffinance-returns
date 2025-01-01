// JavaScript for Theme Toggle and Interactivity

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Funktion zum Setzen der CSS-Variablen basierend auf dem aktuellen Theme
function applyTheme(theme) {
    const nav = document.querySelector('nav');

    if (theme === 'bright') {
		
        root.style.setProperty('--primary-text', 'var(--secondary-text)');
        root.style.setProperty('--primary-bg', 'var(--secondary-bg)');
        root.style.setProperty('--gradient-color-1', '#f0f0f0');
        root.style.setProperty('--gradient-color-2', '#e0e0e0');
        root.style.setProperty('--gradient-color-3', '#d0d0d0');

        // Navbar remains primary-bg in bright mode
        if (nav) nav.style.background = 'var(--primary-bg)';
		console.log("Theme is now:   " + theme);
		console.log("primary-text: " + getComputedStyle(root).getPropertyValue("--primary-text").trim());
    } else {
        root.style.setProperty('--primary-text', '#ffffff');
        root.style.setProperty('--primary-bg', '#2e3b4e');
        root.style.setProperty('--gradient-color-1', '#1b2838');
        root.style.setProperty('--gradient-color-2', '#2e3b4e');
        root.style.setProperty('--gradient-color-3', '#34495e');

        // Navbar becomes transparent in dark mode
        if (nav) nav.style.background = 'transparent';
    }
}

// Load saved theme from local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    applyTheme(savedTheme);
} else {
    root.setAttribute('data-theme', 'dark'); // Default theme
    applyTheme('dark');
}

// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'bright' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme); // Aktualisiere die CSS-Variablen
    });
}

// Initialize charts (dummy data for line chart and histogram)
const initCharts = () => {
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const histogramCtx = document.getElementById('histogram').getContext('2d');

    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Monthly Returns',
                data: [3, 2, -1, 5, 4],
                borderColor: '#48C9B0',
                backgroundColor: 'rgba(72, 201, 176, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
			maintainAspectRatio: false, // Ermöglicht flexibles Skalieren
            plugins: {
                legend: { display: true },
            },
        },
    });

    new Chart(histogramCtx, {
        type: 'bar',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                label: 'Risk Distribution',
                data: [50, 30, 20],
                backgroundColor: ['#FFC44C', '#FFB84D', '#FF9F40'],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });
};

// Initialize charts after DOM content is loaded
document.addEventListener('DOMContentLoaded', initCharts);
