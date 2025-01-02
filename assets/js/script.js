// JavaScript for Theme Toggle and Interactivity

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');

// Menü öffnen/schließen
menuButton.addEventListener('click', () => {
    
    // Wenn das Menü geschlossen wird, setze die ursprünglichen Farben zurück
    if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open'); // Schließt das Menü

    } else {
        navLinks.classList.toggle('open'); // Schaltet die 'open'-Klasse ein/aus
    }

});

// Menü ausblenden, wenn außerhalb geklickt wird
document.addEventListener('click', (e) => {
    // Überprüfe, ob der Klick NICHT auf das Menü oder den Button war
    if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        navLinks.classList.remove('open'); // Schließt das Menü

    }
});

// Funktion zum Setzen der CSS-Variablen basierend auf dem aktuellen Theme
function applyTheme(theme) {
    const nav = document.querySelector('nav');
	const toggle = document.getElementById("theme-toggle");

    if (theme === 'bright') {
		
        root.style.setProperty('--primary-text', 'var(--secondary-text)');
        root.style.setProperty('--primary-bg', 'var(--secondary-bg)');
		root.style.setProperty('--primary-title', 'var(--secondary-title')
        root.style.setProperty('--gradient-color-1', '#f0f0f0');
        root.style.setProperty('--gradient-color-2', '#e0e0e0');
        root.style.setProperty('--gradient-color-3', '#d0d0d0');
		nav.classList.remove('scrolled'); // Zurück zum Standardzustand
		toggle.innerText = "dark mode";
		// Navbar remains primary-bg in bright mode
        if (nav) nav.style.background = 'var(--primary-bg)';
		
		console.log("Theme is now:   " + theme);
		console.log("nav-text: " + getComputedStyle(root).getPropertyValue("--nav-text").trim());
    } else {
        root.style.setProperty('--primary-text', '#E9F4F3');
        root.style.setProperty('--primary-bg', '#2E3B4E');
		root.style.setProperty('--primary-title', '#F5F5F5')
        root.style.setProperty('--gradient-color-1', '#1B2838');
        root.style.setProperty('--gradient-color-2', '#2E3B4E');
        root.style.setProperty('--gradient-color-3', '#34495E');
		window.dispatchEvent(new Event("scroll"));
        toggle.innerText = "light mode";
		// Navbar becomes transparent in dark mode
        //if (nav) nav.style.backgroundColor = 'transparent';
		
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
        navLinks.classList.remove('open'); // Schließt das Menü

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

localStorage.setItem("theme", "dark");
// Initialize charts after DOM content is loaded
document.addEventListener('DOMContentLoaded', initCharts);

// Scroll-Event Listener für die Navigationsleiste
window.addEventListener('scroll', () => {
	const theme = localStorage.getItem('theme');

    navLinks.classList.remove('open'); // Schließt das Menü
	if (theme === "dark") {
		const nav = document.querySelector('nav');
		if (window.scrollY > 10) {
			//nav.classList.add('scrolled'); // Hintergrund und Blur hinzufügen
			nav.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
			nav.style.backgroundColor = 'rgba(30, 40, 50, 0.9)';
			nav.style.backdropFilter = "blur(3px)";
			
		} else {
			//nav.classList.remove('scrolled'); // Zurück zum Standardzustand
			nav.style.boxShadow = "none";
			nav.style.backgroundColor = 'transparent';
			nav.style.backdropFilter = "none";
		}		
	}

});
