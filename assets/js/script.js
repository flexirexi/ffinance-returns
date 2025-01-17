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



function getParsingOptions() {
    // Dynamisch die ausgewählten Werte der Radiobuttons lesen
    const withHeaders = document.querySelector('input[name="withHeaders"]:checked').value === "yes";
    let separator = document.querySelector('input[name="separator"]:checked').value;
    separator = separator === "tab" ? "\t" : separator; 
    const decimals = document.querySelector('input[name="decimals"]:checked').value;
    const thousands = document.querySelector('input[name="thousands"]:checked').value;

    // Falls "Other" gewählt wurde, den Textinput verwenden
    const separatorOther = document.querySelector('input[name="separator-other"]').value.trim();
    const decimalsOther = document.querySelector('input[name="decimals-other"]').value.trim();
    const thousandsOther = document.querySelector('input[name="thousands-other"]').value.trim();

    // Logik, um "Other"-Werte zu berücksichtigen
    const finalSeparator = separator === "other" ? separatorOther : separator === "semicolon" ? ";" : separator === "comma" ? "," : separator;
    const finalDecimals = decimals === "other" ? decimalsOther : decimals === "dot" ? "." : ",";
    const finalThousands = thousands === "other" ? thousandsOther : thousands === "dot" ? "." : thousands === "comma" ? "," : thousands === "space" ? " " : "";

    // Optionen-Dictionary zurückgeben
    return {
        headers: withHeaders,     // true oder false
        sep: finalSeparator,     // Separator, z.B. ",", ";", etc.
        dec: finalDecimals,      // Dezimalzeichen, z.B. ".", ","
        thou: finalThousands,    // Tausendertrennzeichen, z.B. ".", ",", " " oder ""
    };
}

// Funktion, um den Spinner während des Parsing anzuzeigen
function toggleParseButtonSpinner(showSpinner) {
    const parseButton = document.getElementById("parse-csv-button");
    
    if (showSpinner) {
        parseButton.innerHTML = `<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Parsing...`;
        parseButton.disabled = true; // Deaktiviere den Button, um Mehrfachklicks zu vermeiden
    } else {
        parseButton.innerHTML = `<i class="fas fa-angle-double-down" style="margin: 0 15px;"></i> 
                                  PARSE FILE AGAIN   
                                  <i class="fas fa-angle-double-down" style="margin: 0 15px;"></i>`;
        parseButton.disabled = false; // Reaktiviere den Button
    }
}


/**
 * Formatiert einen Wert basierend auf Dezimal- und Tausendertrennzeichen.
 * Für die Vorschau wird der Wert standardisiert (Dezimalzeichen ".", keine Tausendertrennzeichen).
 */
function formatValue(value, decimals, thousands) {
    if (!value) return "";

    // Entferne Tausendertrennzeichen
    if (thousands) {
        const regex = new RegExp(`\\${thousands}`, "g");
        value = value.replace(regex, "");
    }

    // Ersetze Dezimaltrennzeichen durch "."
    if (decimals !== ".") {
        value = value.replace(decimals, ".");
    }

    return value;
}

/**
 * Wechselt die Ansichtmodus (Sichtbarkeit) der Elemente entweder zum Analysis-Modus oder zum Upload-Modus.
 * Upload Elemente verden versteckt, beim Analysieren der Daten. Analyse-Elemente werden versteckt beim Hochladen. 
 * @param {str} mode - wähle zwischen "analysis" und "upload"
 */
function viewMode(mode) {
    const sv_upload_process = document.getElementsByClassName("upload-process")[0];
    const sv_editor_container = document.getElementsByClassName("editor-container")[0];
    console.log("funzt");
    if (mode==="analysis") {
        sv_editor_container.classList.remove("hidden");
        sv_upload_process.classList.add("hide-me");
    } else if (mode ==="upload") {
        sv_editor_container.classList.add("hidden");
        sv_upload_process.classList.remove("hide-me");
    }
}

/**
 * Lädt den csv-String aus .raw final als List in das .dataSet Attribut zur effizienten Weiterverarbeitung
 * Initiiert alle Schritte zum Einladen des csv-Files als dataSet in das System
 * @param {DM.RawDataSet} rawDataSet - RawDataSet-Klasse mit csv und dazugehörigen parsing Parametern 
 */
function loadDataSetIntoSystem(rawDataSet) {
    viewMode("analysis");
}


function createColumnsTable(rawDataSet, tableElement) {
    const buttonFinalLoad = document.getElementById("finalize-csv-button");

    // Verhindere doppelte Listener-Registrierungen
    if (!buttonFinalLoad.dataset.listenerAdded) {
        buttonFinalLoad.addEventListener("click", handleFinalizeClick);
        buttonFinalLoad.dataset.listenerAdded = "true"; // Markiere, dass der Listener bereits hinzugefügt wurde
    }

    // Tabelle bereinigen und neu erstellen
    const columnsEditor = document.getElementById("columnsEditor");
    tableElement.innerHTML = ""; // Tabelle leeren
    tableElement.classList.add("columns-table");

    // Optionen aus der RawDataSet-Instanz laden
    const options = rawDataSet.readCsvOptions;
    const separator = options.sep || ",";
    const withHeaders = options.headers || false;
    const decimals = options.dec || ".";
    const thousands = options.thou || "";

    // Rohdaten aus RawDataSet laden
    const rawRows = rawDataSet.raw.split("\n").filter(row => row.trim() !== "");
    const headers = withHeaders
        ? rawRows[0].split(separator).map(h => h.trim())
        : rawRows[0].split(separator).map((_, i) => `Column ${i + 1}`);

    // Tabellenkopf erstellen
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const columns = [
        { id: "th1", text: "Column", style: { textAlign: "right", padding: "7px", color: "var(--primary-title)" } },
        { id: "th2", text: "Identify as", style: { textAlign: "left", padding: "7px", color: "var(--primary-title)" } },
        { id: "th3", text: "Values preview", style: { textAlign: "left", padding: "7px", color: "var(--primary-title)" } },
        { id: "th4", text: "Comment after check", style: { textAlign: "left", padding: "7px", color: "var(--primary-title)", width: "350px" } },
    ];

    columns.forEach(column => {
        const th = document.createElement("th");
        th.id = column.id;
        th.textContent = column.text;
        Object.assign(th.style, column.style);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tableElement.appendChild(thead);

    // Tabelleninhalt erstellen
    const tbody = document.createElement("tbody");
    const dataRows = withHeaders ? rawRows.slice(1) : rawRows;

    headers.forEach((header, colIndex) => {
        const row = document.createElement("tr");

        // Spaltenname
        const columnCell = document.createElement("td");
        columnCell.textContent = header;
        columnCell.style.textAlign = "right";
        row.appendChild(columnCell);

        // Mapping-Dropdown
        const mappingCell = document.createElement("td");
        const select = document.createElement("select");
        select.id = `select${colIndex}`;
        select.innerHTML = `
            <option value="">Select...</option>
            <option value="dateColumnDMY">DATE DMY</option>
            <option value="dateColumnMDY">DATE MDY</option>
            <option value="dateColumnYMD">DATE YMD</option>
            <option value="priceColumn">Price (only once)</option>
            <option value="navColumn">Monetary Value/NAV (only once)</option>
            <option value="indexColumn">Indexed Value (only once)</option>
            <option value="movementsColumn">Movements (+/- values)</option>
            <option value="subscriptionsColumn">Subscriptions/pay-in (+ values)</option>
            <option value="redemptionsColumn">Redemptions/pay-out (+ values)</option>
            <option value="distributionColumn">Distribution/pay-out (+ values)</option>
        `;
        select.style.padding = "4px";
        select.style.width = "138px";
        mappingCell.appendChild(select);
        row.appendChild(mappingCell);

        // Spaltenwerte Vorschau
        const valueCell = document.createElement("td");
        const valuesPreview = dataRows
            .map(row => {
                const value = row.split(separator)[colIndex]?.trim() || "";
                return formatValue(value, decimals, thousands);
            })
            .slice(0, 5); // Nur die ersten 5 Werte
        valueCell.textContent = valuesPreview.join("; ") + " ...";
        valueCell.style.fontSize = "13px";
        valueCell.style.width = "250px";
        row.appendChild(valueCell);

        // Kommentarspalte
        const commentCell = document.createElement("td");
        commentCell.textContent = "";
        commentCell.style.fontSize = "14px";
        commentCell.style.width = "350px";
        row.appendChild(commentCell);

        tbody.appendChild(row);

        select.addEventListener("change", () => {
            console.log("VALIDATION PROCESS START -----");
            validateColumnsMeta(rawDataSet);
        });
    });

    tableElement.appendChild(tbody);

    // Abschnitt sichtbar machen
    //const columnsEditor = document.getElementById("columnsEditor");
    columnsEditor.appendChild(tableElement);
    columnsEditor.style.display = "block";

    function handleFinalizeClick() {
        if (!buttonFinalLoad.classList.contains("disabled")) {
            console.log("funzt mit Separator:   ", rawDataSet.readCsvOptions.sep);
            loadDataSetIntoSystem(rawDataSet);
        }
    }
}


/**
 * Validiert die Zuordnungen in der columnsEditorTable basierend auf den Dropdown-Werten.
 */
function validateColumnsMeta(rawDataSet) {
    const table = document.getElementById("columnsEditorTable");
    const rows = table.querySelectorAll("tbody tr");
    const usedColumns = {};
    const requiredColumns = ["priceColumn", "navColumn", "indexColumn"];
    const dateColumns = ["dateColumnDMY", "dateColumnMDY", "dateColumnYMD"];
    const buttonFinalLoad = document.getElementById("finalize-csv-button");
    let requiredCount = 0;
    let dateCount = 0;
    let allValid = true;
    buttonFinalLoad.classList.add("disabled");
    

    // Initialisiere die genutzten Spalten
    [...requiredColumns, ...dateColumns].forEach(column => usedColumns[column] = []);

    // Durchlaufe jede Zeile der Tabelle
    rows.forEach((row, rowIndex) => {
        const dropdown = row.querySelector("select");
        const commentCell = row.querySelector("td:last-child");
        const selectedColumn = dropdown.options[dropdown.selectedIndex].value;

        // Kommentar zurücksetzen
        commentCell.textContent = "";

        if (selectedColumn) {
            if (usedColumns[selectedColumn]) {
                usedColumns[selectedColumn].push(rowIndex);
            } else {
                usedColumns[selectedColumn] = [rowIndex];
            }

            // Prüfen, ob es sich um eine Required- oder Date-Column handelt
            if (requiredColumns.includes(selectedColumn)) requiredCount++;
            if (dateColumns.includes(selectedColumn)) dateCount++;

            // Validierung des eigenen Werts
            if (dateColumns.includes(selectedColumn)) {
                const format = selectedColumn.replace("dateColumn", "");
                const cellValue = row.querySelector("td:nth-child(2)")?.textContent.trim();
                if (cellValue && !rawDataSet.rawValidateDateColumn(rowIndex, format)) {
                    commentCell.textContent += "ERROR: Some Dates can't be parsed";
                    allValid = false;
                }
            }
        }
    });

       // Globale Validierungen
       Object.keys(usedColumns).forEach(column => {
        const indices = usedColumns[column];

        if (indices.length > 1) {
            // Bedingung 1: Duplicate error für Spalten, die maximal einmal vorkommen dürfen
            if ([...dateColumns, ...requiredColumns].includes(column)) {
                indices.forEach(index => {
                    const row = rows[index];
                    const commentCell = row.querySelector("td:last-child");
                    commentCell.textContent += "Error: Duplicate assignment not allowed. ";
                    allValid = false;
                });
            }
        }
    });

    // Zusätzliche Bedingung für Required- und Date-Spalten
    if (requiredCount > 1) {
        requiredColumns.forEach(column => {
            const indices = usedColumns[column] || [];
            indices.forEach(index => {
                const row = rows[index];
                const commentCell = row.querySelector("td:last-child");
                commentCell.textContent += "Error: Only one required column allowed: Price, Monetary or Indexed. ";
                allValid = false;
            });
        });
    }

    //Prüfen, ob requiredCount 0 ist
    if (requiredCount === 0) {
        allValid = false;
    }

    if (dateCount > 1) {
        dateColumns.forEach(column => {
            const indices = usedColumns[column] || [];
            indices.forEach(index => {
                const row = rows[index];
                const commentCell = row.querySelector("td:last-child");
                commentCell.textContent += "Error: Only one date column allowed. ";
                allValid = false;
            });
        });
    }

    // Gesamtergebnis zurückgeben
    console.log("PROCESS ENDED: VALIDATED?   ", allValid);
    if (allValid) {
        buttonFinalLoad.classList.remove("disabled");
    }

  
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
    const scrollableOpacity = document.querySelector(".scrollable-opacity");
    let initialBottom = 0;
    let isSwiping = false;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startY = 0;
    let currentY = 0;
    localStorage.setItem("onload", true);
    let rawDataSet = null;

    if (!scrollableOpacity) {
        console.error("Das Element mit der Klasse 'scrollable-opacity' wurde nicht gefunden.");
        return;
    }

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

    // Event-Listener für Drag-and-Drop
    uploadBox.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add("drag-over");
    });

    uploadBox.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove("drag-over");
    });

    uploadBox.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove("drag-over");

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]); // Nur die erste Datei verarbeiten
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



    const tbody = document.getElementById("editor-body");

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

    // Funktion zur Verarbeitung der hochgeladenen Datei
    function handleFileUpload(file) {
        const reader = new FileReader();

        // Datei einlesen
        reader.onload = (event) => {
            const fileContent = event.target.result;
            const fileType = file.type;

            try {
                // Datei parsen (JSON oder CSV)
                const parsedData = DM.parseFileContent(fileContent, fileType);
                console.log("Parsed Data:", parsedData);

                // RawDataSet initialisieren
                rawDataSet = new DM.RawDataSet(parsedData);

                // Tabelle anzeigen
                proceedToIdentifyColumns();
            } catch (error) {
                console.error("Fehler beim Verarbeiten der Datei:", error);
                alert("Die Datei konnte nicht verarbeitet werden. Bitte überprüfen Sie das Format.");
            }
        };

        // Datei lesen (als Text)
        reader.readAsText(file);
    }

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
        const table = document.getElementById("columnsEditorTable");
        const iconUploadSummary = document.getElementById("upload-icon-summary");
        const iconIdentifySummary = document.getElementById("identify-icon-summary");
        const headerPreview = document.getElementById("header-preview");
        const parseButton = document.getElementById("parse-csv-button");
        
        iconUploadSummary.classList.remove("fa-cog");
        iconUploadSummary.classList.remove("fa-spin");
        iconUploadSummary.style.animation = "unset";
        iconUploadSummary.classList.add("fa-check");

        iconIdentifySummary.style.display = "unset";

        uploadSection.removeAttribute("open");
        identifyColumnsSection.classList.remove("details-disabled");
        identifyColumnsSection.setAttribute("open", "");
        
        headerPreview.innerHTML = rawDataSet.getHeaderRaw();

        // Parsing-Optionen laden
        const options = getParsingOptions();
        rawDataSet.setReadCsvOptions(options);
        console.log("Parsing Options gesetzt:", options);

        // Tabelle mappen
        createColumnsTable(rawDataSet, table);
        
        // Event-Listener für den Parse-Button
        parseButton.addEventListener("click", async () => {
            const buttonFinalLoad = document.getElementById("finalize-csv-button"); 
            buttonFinalLoad.classList.add("disabled");
            // Spinner anzeigen
            toggleParseButtonSpinner(true);

            try {
                // Parsing-Optionen erneut setzen
                const options = getParsingOptions();
                rawDataSet.setReadCsvOptions(options);

                // Simuliere das Parsing (du kannst hier deinen echten Parsing-Code einfügen)
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simuliertes Warten (z.B. 2 Sekunden)

                // Tabelle neu generieren
                createColumnsTable(rawDataSet, document.getElementById("columnsEditorTable"));
                console.log("Parsing abgeschlossen. Optionen:", options);
            } catch (error) {
                console.error("Fehler beim Parsing:", error);
            } finally {
                // Spinner ausblenden
                toggleParseButtonSpinner(false);
            }
        });
    }



});