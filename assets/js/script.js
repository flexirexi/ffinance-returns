import * as CManager from "./chartmanager.js";
import * as DM from "./datamanager.js";

// JavaScript for Theme Toggle and Interactivity
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');
const nav_header = document.getElementById("nav-header");
let lineChartPrice;
let barChartReturns;
let scrollTimeout;


// Funktion zum Setzen der CSS-Variablen basierend auf dem aktuellen Theme
function applyTheme(theme) {
    const nav = document.querySelector('nav');
	const toggle = document.getElementById("theme-toggle");
    const aside = document.getElementsByClassName("dataset-summary");

    if (theme === 'light mode') {
        root.style.setProperty('--primary-text', 'var(--secondary-text)');
        root.style.setProperty('--primary-bg', 'var(--secondary-bg)');
		root.style.setProperty('--primary-title', 'var(--secondary-title');
        root.style.setProperty("--primary-acc", "var(--secondary-acc");
        root.style.setProperty('--gradient-color-1', '#f0f0f0');
        root.style.setProperty('--gradient-color-2', '#e0e0e0');
        root.style.setProperty('--gradient-color-3', '#d0d0d0');
        root.style.setProperty("--glass", "#00000011");
        root.style.setProperty("--glass2", "#00000006");
        root.style.setProperty("--glass-color", "#2e8f853e");
		nav.classList.remove('scrolled'); // Zurück zum Standardzustand
		toggle.innerText = "dark mode";
		// Navbar remains primary-bg in bright mode
        if (nav) nav.style.background = '#2E3B4E';
        if (window.innerWidth < 768) {
            aside[0].style.background =  'linear-gradient(90deg, var(--dis-bg), var(--dis-bg), var(--dis-bg), var(--dis-bg))';
        } else {
            aside[0].style.background =  'linear-gradient(90deg, var(--glass), var(--glass), var(--glass), var(--glass2))';
        }
		
    } else {
        root.style.setProperty('--primary-text', '#dae6e5');
        root.style.setProperty('--primary-bg', '#2E3B4E');
		root.style.setProperty('--primary-title', '#2DC9BA');
        root.style.setProperty("--primary-acc", "#ffc44c");
        root.style.setProperty('--gradient-color-1', '#1B2838');
        root.style.setProperty('--gradient-color-2', '#2E3B4E');
        root.style.setProperty('--gradient-color-3', '#34495E');
        root.style.setProperty("--glass", "#00000000");
        root.style.setProperty("--glass2", "#00000000");
        root.style.setProperty("--glass-color", "#0b24225f");
		window.dispatchEvent(new Event("scroll"));
        toggle.innerText = "light mode";
		// Navbar becomes transparent in dark mode
        //if (nav) nav.style.backgroundColor = 'transparent';
		if (window.innerWidth < 768) {
            aside[0].style.background =  getComputedStyle(root).getPropertyValue('--primary-bg').trim();
        } else {
            aside[0].style.background =  "transparent";
        }
    }
}

//Initialize charts (dummy data for line chart and histogram)
// Später wird daraus: load data into the app...
const initCharts = () => {
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const histogramCtx = document.getElementById('histogram').getContext('2d');
    Chart.register(CManager.horizontalLinePlugin());
    Chart.register(CManager.verticalLinePlugin());

    let xValues = ['2023-01-31', '2023-02-28', '2023-03-31', '2023-04-30', '2023-05-31', '2023-06-30',  
        '2023-07-31', '2023-08-31', '2023-09-30', '2023-10-31', '2023-11-30', '2023-12-31',  
        '2024-01-31', '2024-02-29', '2024-03-31', '2024-04-30', '2024-05-31', '2024-06-30',  
        '2024-07-31', '2024-08-31', '2024-09-30', '2024-10-31', '2024-11-30', '2024-12-31'];

    let label1 = "Monetary Value (Net Assets)";
    let data1 = [1535000, 1560000, 1627040, 1677040, 1700598, 1717119, 1709968, 1735062, 
        1687013, 1695656, 1688617, 1699799, 1714772, 1688167, 1750106, 1766539, 
        1759744, 1776384, 1855738, 1860775, 1931543, 1901629, 1929410, 1983306];

    let label2 = "Indexed Value (Base 100)";
    let data2 = [100, 101.63, 104.23, 107.44, 108.95, 110.95, 110.48, 112.1, 112.55, 
        113.13, 112.66, 113.41, 114.41, 112.63, 110.61, 111.65, 111.22, 
        112.27, 110.98, 111.28, 110.19, 108.49, 110.07, 113.15];

    let label3 = "Movements";
    let data3 = [, , 27040, , , -14674, , , -55000, , , , , , 92260, 
        , , , 99820, , 88900, , , ];

    lineChartPrice = CManager.createLineChart(lineCtx, xValues, data1, label1, data2, label2, data3, label3);

    barChartReturns = new Chart(histogramCtx, {
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
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
            },
        },
    });

    CManager.updateChartColors(lineChartPrice, root);
    CManager.updateChartColors(barChartReturns, root);
};



function disableScroll() {
    console.log("disable scroll");
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll'); // Für den gesamten Dokumentbereich
}

function enableScroll() {
    console.log("enable scroll");
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll'); // Für den gesamten Dokumentbereich
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const aside = document.querySelector('.dataset-summary');
    const showAsideButton = document.getElementById('show-aside');
    const closeAsideButton = document.getElementById('close-aside');
    const slideView = document.getElementById("slideView");
    const actionButton = document.querySelector('.action-button');
    const actionLink = document.getElementById("action-link");
    const handleContainer = document.getElementById('handle-container');
    const uploadBox = document.getElementById("uploadBox");
    const fileInput = document.getElementById("fileInput");
    const useDummy = document.getElementById("useDummy");
    const editorCont = document.querySelector(".editor-container");
    const identifyColumnsSection = document.getElementById("identifyColumns");
    const uploadSection = document.getElementById("upload-details");
    const columnsEditor = document.getElementById("columnsEditor");
    let initialBottom = 0;
    let isSwiping = false;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startY = 0;
    let currentY = 0;
    localStorage.setItem("onload", true);
    let rawDataSet = null;

    editorCont.classList.add("hidden");
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

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark mode' ? 'light mode' : 'dark mode';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme); // Aktualisiere die CSS-Variablen
        navLinks.classList.remove('open'); // Schließt das Menü

        //Aktualisiere die Farben der Charts
        CManager.updateChartColors(lineChartPrice, root);
        CManager.updateChartColors(barChartReturns, root);
    });

    // Scroll-Event Listener für die Navigationsleiste
    window.addEventListener('scroll', () => {
        const theme = localStorage.getItem('theme');
        
        //erst am ende des scrollens ausführen:
        clearTimeout(scrollTimeout); // Lösche vorherigen Timeout
        scrollTimeout = setTimeout(() => {
            //console.log("should end onload now ..");
            localStorage.removeItem("onload");
        }, 200); 
        const nav_header = document.getElementById("nav-header");
        
        if (localStorage.getItem("onload") == null) {
            //console.log("scroll event should work now");
            if (window.scrollY > 10) {
                nav_header.classList.remove("hidden");
            } else {
                nav_header.classList.add("hidden");
            }
            
            if (theme === "dark mode" ) {
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

        }
        navLinks.classList.remove('open'); // Schließt das Menü
    });

    // Aside: Öffnen
    showAsideButton.addEventListener('click', function(event) {
        event.preventDefault();
        navLinks.classList.remove('open');
        aside.classList.add('active');
        disableScroll();
    });

    // Aside: Schließen
    closeAsideButton.addEventListener('click', () => {
        aside.classList.remove('active');
        enableScroll();
    });

    // Aside: Touchstart-Event
    aside.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        currentX = 0;
        aside.style.transition = "none"; // Transition während des Swipens deaktivieren
    });

    // Aside: Touchmove-Event
    aside.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;

        if (window.innerWidth < 768) {
            currentX = e.touches[0].clientX - startX;
        }
        if (currentX < 0) currentX = 0; // Verhindert Bewegung nach links
        aside.style.transform = `translateX(${currentX}px)`;
    });

    // Aside: Touchend-Event
    aside.addEventListener("touchend", () => {
        isSwiping = false;

        // Wenn genug geswiped wurde, schließe das Aside
        if(window.innerWidth < 768) {
            if (currentX > 100) {
                aside.style.transform = ""; // Rücksetzen von transform
                aside.classList.remove("active");
                enableScroll();
            } else {
                // Zurück zur Ausgangsposition
                aside.style.transition = "transform 0.3s ease-in-out"; // Transition wieder aktivieren
                aside.style.transform = "translateX(0)";
                disableScroll();
            }
        }
    });


    // SlideView: Funktion zum Öffnen des Slide-Views
    function openSlideView() {
        slideView.style.bottom = "0"; // Schiebt das Slide-View in den sichtbaren Bereich
        if (window.innerWidth < 768) {
            actionButton.style.display = "none";
        } else {
            actionButton.style.top = "54px";
            actionLink.className="fas fa-chevron-down"
        }
        disableScroll();
    }

    // SlideView: Funktion zum Schließen des Slide-Views
    function closeSlideView() {
        enableScroll();
        actionButton.style.display = "flex";
        actionButton.style.top = "unset";
        slideView.style.bottom = "-100%"; // Schiebt das Slide-View aus dem Bildschirm
        actionLink.classList = "fas fa-plus";
    }

    // SlideView: Event für Swipen nach unten
    handleContainer.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        isSwiping = true;
        const computedStyle = window.getComputedStyle(slideView);
        initialBottom = parseInt(computedStyle.bottom, 10); // Aktuelle Position speichern
        slideView.style.transition = "none"; // Deaktiviere die Transition während der Bewegung
    });
    
    handleContainer.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
    
        currentY = e.touches[0].clientY - startY;
    
        // Berechne die neue Position
        const newBottom = Math.max(-window.innerHeight, initialBottom - currentY);
        slideView.style.bottom = `${newBottom}px`;
    });
    
    handleContainer.addEventListener("touchend", () => {
        isSwiping = false;
        slideView.style.transition = "bottom 0.3s ease-in-out"; // Transition wieder aktivieren
    
        // Entscheide basierend auf der Endposition
        if (currentY > 100) {
            closeSlideView();
        } else {
            slideView.style.bottom = "0"; // Zurück zur Originalposition
            disableScroll();
        }
    });

    // SlideView: Beispiel für das Öffnen des Slide-Views
    actionButton.addEventListener('click', () => {
        //Checke, ob die slideview gerade ausgeklappt ist
        if (slideView.style.bottom === "0px") {
            console.log("close slideview......");
            closeSlideView();
            enableScroll();
        } else {
            console.log("OPEN slideview.....");
            openSlideView();
            disableScroll();
        }
    });

    //SlideView Drag mit der Maus:
    handleContainer.addEventListener('mousedown', (e) => {
        startY = e.clientY; // Initiale Y-Position
        isDragging = true;
        document.body.style.userSelect = "none"; // Deaktiviert Textauswahl
        slideView.style.transition = "none"; // Transition während des Ziehens deaktivieren
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentY = e.clientY - startY; // Differenz berechnen

        if (currentY > 0) { // Erlaubt nur Bewegung nach unten
            slideView.style.bottom = `-${currentY}px`;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = ""; // Textauswahl wieder aktivieren
        slideView.style.transition = "bottom 0.3s ease-in-out"; // Transition wieder aktivieren

        // Schließen, wenn genug nach unten gezogen wurde
        if (currentY > window.innerHeight * 0.3) {
            slideView.style.bottom = "-100%"; // Komplett ausblenden
            closeSlideView();
        } else {
            slideView.style.bottom = "0"; // Zurück zur Originalposition
        }
    });

    // Überwache Fenstergröße und entferne "active", wenn Desktop-Modus aktiv wird
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) { // Passe die Breite an deine Media Query an
            aside.classList.remove('active');
            document.body.style.overflow = "";
            if(localStorage.getItem("theme")==="light mode") {
                aside.style.background =  'linear-gradient(90deg, var(--glass), var(--glass), var(--glass), var(--glass2))';
            } else {
                aside.style.background = "transparent";
            }
        } else {
            if(localStorage.getItem("theme")==="light mode") {
                aside.style.background =  'linear-gradient(90deg, var(--dis-bg), var(--dis-bg), var(--dis-bg), var(--dis-bg))';
            } else {
                aside.style.background = getComputedStyle(root).getPropertyValue('--primary-bg').trim();
            }
        }
    });

    // Schließen bei Klick außerhalb des Aside
    document.addEventListener('click', (event) => {
        if (!aside.contains(event.target) && !showAsideButton.contains(event.target) && !slideView.contains(event.target)) {
            aside.classList.remove('active');
        }
    });
    
    // Load saved theme from local storage
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        applyTheme(savedTheme);
    } else {
        root.setAttribute('data-theme', 'dark mode'); // Default theme
        localStorage.setItem("theme", "dark mode");
        console.log("no current theme - set to dark mode");
        applyTheme('dark mode');
    }

    //localStorage.setItem("theme", "dark mode");
    // Initialize charts after DOM content is loaded
    initCharts();
    
    //beim Neuladen der Seite: nav-header grundsätzlich verbergen(in css), dann scroll-event auslösen
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, 10);



    const tbody = document.querySelector("table tbody");

    const generateRandomValue = (min, max) => {
        return (Math.random() * (max - min) + min).toFixed(2);
    };

    for (let i = 1; i <= 100; i++) {
        const row = document.createElement("tr");

        // Date column
        const dateCell = document.createElement("td");
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);
        dateCell.textContent = currentDate.toISOString().split("T")[0];
        dateCell.classList.add("bold");
        row.appendChild(dateCell);

        // Price column
        const priceCell = document.createElement("td");
        priceCell.textContent = generateRandomValue(50, 500);
        row.appendChild(priceCell);

        // Movements column
        const movementCell = document.createElement("td");
        movementCell.textContent = i % 5 === 0 ? generateRandomValue(-50, 50) : "-";
        row.appendChild(movementCell);

        // Dividends column
        const dividendCell = document.createElement("td");
        dividendCell.textContent = i % 10 === 0 ? generateRandomValue(0.1, 5) : "-";
        row.appendChild(dividendCell);

        // Indexed column
        const indexCell = document.createElement("td");
        indexCell.textContent = (100 + i).toFixed(2);
        row.appendChild(indexCell);

        tbody.appendChild(row);
    }



    // Öffne den Datei-Upload-Dialog
    uploadBox.addEventListener("click", () => {
        fileInput.click();
    });

    // Verarbeite die hochgeladene Datei
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                try {
                    //const raw = content.split("\n").map(line => line.split(","));
                    rawDataSet = new DM.RawDataSet(content);
                    console.log("Hochgeladene Rohdaten:", rawDataSet.raw);
    
                    // Setze die Header aus der ersten Zeile und verarbeite die Daten
                    //rawDataSet.setReadCsvOptions({
                    //    headers: raw.shift(), // Die erste Zeile sind die Header
                    //});
                    //rawDataSet.processRawData();
                    //console.log("Verarbeitetes Dataset:", rawDataSet.dataSet);
                    //console.log("Hochgeladene Daten als CSV:", rawDataSet.toCSV());
                    
                    proceedToIdentifyColumns(rawDataSet);
                } catch (error) {
                    console.error("Fehler beim Verarbeiten der Datei:", error.message);
                }
            };

            reader.readAsText(file);
        }
    });

    // Dummy-Daten laden
    useDummy.addEventListener("click", (event) => {
        event.stopPropagation(); // Verhindert, dass das Klick-Ereignis auf die Upload-Box propagiert
        rawDataSet = DM.RawDataSet.generateDummyDataset();
        console.log("Dummy-Daten geladen:", rawDataSet.raw);

        // Setze readCsvOptions und verarbeite das Dataset SPÄTER:
        //rawDataSet.setReadCsvOptions({
        //    headers: ["dateColumn", "Monetary Value (Net Assets)", "Indexed Value (Base 100)", "Movements"],
        //});
        //rawDataSet.processRawData();
        //console.log("Verarbeitetes Dataset:", rawDataSet.dataSet);
        //console.log("Dummy-Daten als CSV:", rawDataSet.toCSV());
        
        proceedToIdentifyColumns(rawDataSet);
    });
    
    // Zeige die zweite Phase (Identify Columns) an
    function proceedToIdentifyColumns() {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const iconUploadSummary = document.getElementById("upload-icon-summary");
        const iconIdentifySummary = document.getElementById("identify-icon-summary");

        iconUploadSummary.classList.remove("fa-spinner");
        iconUploadSummary.classList.remove("fa-spin");
        iconUploadSummary.classList.add("fa-check");

        iconIdentifySummary.style.display = "unset";


        uploadSection.removeAttribute("open");
        identifyColumnsSection.classList.remove("details-disabled");
        identifyColumnsSection.setAttribute("open", "");
        console.log("RawDataSet zur Identifizierung bereit:", rawDataSet);

        columnsEditor.innerHTML = "";

        // Tabelle erstellen
        table.classList.add("columns-table");



        const headerRow = document.createElement("tr");

        const th1 = document.createElement("th");
        th1.id = "th1";
        th1.textContent = "Column";
        th1.style.textAlign = "right";
        th1.style.padding = "13px";
        th1.style.color = "var(--primary-title)";
        if (window.innerWidth < 768) {
            th1.style.width = "20px";
        } else {
            th1.style.maxWidth = "130px";
        }

        const th2 = document.createElement("th");
        th2.id = "th2";
        th2.textContent = "Mapped to";
        th2.style.textAlign = "left";
        th2.style.padding = "10px";
        th2.style.color = "var(--primary-title)";

        const th3 = document.createElement("th");
        th3.id = "th3";
        th3.textContent = "Values preview"
        th3.style.textAlign = "left";
        th3.style.padding = "10px";
        th3.style.color = "var(--primary-title";
        
        const th4 = document.createElement("th");
        th4.id = "th4";
        th4.textContent = "Comment after check";
        th4.style.textAlign = "left";
        th4.style.padding = "10px";
        th4.style.color = "var(--primary-title)";
        th4.style.width = "350px";


        // Füge die Header-Zellen zur Zeile hinzu
        headerRow.appendChild(th1);
        headerRow.appendChild(th2);
        headerRow.appendChild(th3);
        headerRow.appendChild(th4);

        // Füge die Zeile zum Tabellenkopf hinzu
        thead.appendChild(headerRow);
        

        // Füge den Tabellenkopf zur Tabelle hinzu
        table.appendChild(thead);

        // Tabelleninhalt basierend auf den Headern im CSV-String hinzufügen
        const tbody = document.createElement("tbody");
        const datasetHeading = rawDataSet.getHeader();
        if (rawDataSet.raw) {
            // Parse raw CSV to get headers
            const headers = rawDataSet.raw.split("\n")[0].split(",");
            
            headers.forEach(header => {
                const row = document.createElement("tr");

                // Spaltenname
                const columnCell = document.createElement("td");
                columnCell.textContent = header.trim();
                row.appendChild(columnCell);
                columnCell.style.textAlign = "right";
                if (window.innerWidth < 768) {
                    columnCell.style.width = "20px";
                } else {
                    columnCell.style.width = "130px";
                }

                // Mapping Dropdown
                const mappingCell = document.createElement("td");
                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Select...</option>
                    <option value="dateColumn">Date</option>
                    <option value="valueColumn1">Net Assets</option>
                    <option value="valueColumn2">Indexed Value</option>
                    <option value="movements">Movements</option>
                    <option value="skip">Skip Column</option>
                `;
                select.style.padding = "1px";
                select.style.width = "138px";
                mappingCell.appendChild(select);
                row.appendChild(mappingCell);
                mappingCell.style.width = "120px";

                //Spaltenwerte Preview
                const valueCell = document.createElement("td");
                valueCell.textContent = datasetHeading[header.trim()].join("; ") + " ...";
                row.appendChild(valueCell);
                valueCell.style.fontSize = "13px";
                valueCell.style.width = "250px";

                const commentCell = document.createElement("td");
                commentCell.textContent = "";
                row.appendChild(commentCell);
                commentCell.style.fontSize = "14px";
                commentCell.style.Width = "350px";

                tbody.appendChild(row);
            });
        } else {
            const emptyRow = document.createElement("tr");
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = 2;
            emptyCell.textContent = "No columns found.";
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        }

        table.appendChild(tbody);
        table.style.backgroundColor = "#00000022";
        table.style.padding = "5px 10px 5px 0";
        if (window.innerWidth > 768) {
            table.style.width = "100%";
        } else {
            table.style.width = "800px";
        }
        table.style.borderCollapse = "collapsed";
        table.style.border = "none";
        //table.style.margin = "10px auto";
        columnsEditor.appendChild(table);

        // Abschnitt sichtbar machen
        columnsEditor.style.display = "block";
        

    }

});