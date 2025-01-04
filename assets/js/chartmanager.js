export function createLineChart(lineCtx, xValues, data1, label1, data2, label2, data3, label3) {
    let scale_min = Math.min(Math.min(...data1)/data1[0], Math.min(...data2)/data2[0]);
    let scale_max = Math.max(Math.max(...data1)/data1[0], Math.max(...data2)/data2[0]);
    
    [data1, label1] = bigNumbers(data1, label1);
    [data2, label2] = bigNumbers(data2, label2);
    

    return new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: xValues, // Datumswerte
                datasets: [
                    // Zeitreihe 1: Monetäre Wertentwicklung
                    {
                        label: label1,
                        data: data1, // Werte in Euro
                        borderColor: 'rgba(72, 201, 176, 1)', // Farbe der Linie
                        backgroundColor: 'rgba(72, 201, 176, 0.2)', // Fläche darunter
                        borderWidth: 1.4,
                        fill: true,
                        yAxisID: 'y', // Linke Skala
                        tension: 0, // Geschmeidige Kurve
                        pointRadius: 0,
                    },
                    // Zeitreihe 2: Indexierte Zeitreihe
                    {
                        label: label2,
                        data: data2, // Indexierte Werte
                        borderColor: 'rgb(255, 196, 76)', // Primary Accent Color
                        borderWidth: 2,
                        backgroundColor: 'transparent',
                        fill: false, // Keine Fläche
                        yAxisID: 'y1', // Rechte Skala
                        tension: 0,
                        pointRadius: 0,
                    },
                    // Zeitreihe 3: Movements als Balken
                    {
                        type: 'bar', // Balkendiagramm
                        label: label3,
                        data: data3, // Beispielwerte
                        fill: false,
                        backgroundColor: data3.map(value => value >= 0 ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)'),
                        borderWidth: 0, // Kein Rand
                        barThickness: 1, // Dünne Balken
                        yAxisID: 'y2',
                    },]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index', // Interaktion für alle Datensätze
                    intersect: false, // Keine direkten Schnitte erforderlich
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Date',
                        },
                        grid: {
                            drawOnChartArea: false,
                            drawTicks: false,
                            drawBorder: false,
                        },
                        ticks: {
                            color: 'rgba(148, 148, 148, 0.85)',
                            align: 'center', // Sorgt dafür, dass die Ticks genau auf die Gridlinien ausgerichtet sind
                            callback: function (value, index) {
                                return index % 3 === 0 ? this.getLabelForValue(value) : '';
                            },
                            autoSkip: false, // Deaktiviert automatisches Überspringen
                        },
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: label1,
                        },
                        grid: {
                            drawOnChartArea: true,
                            color: 'rgba(0, 0, 0, 0.65)',
                            lineWidth: 0.3,
                            drawTicks: false,
                            drawBorder: false,
                        },
                        ticks: {
                            color: 'rgba(148, 148, 148, 0.85)',
                        },
                        min: data1[0] * scale_min * 0.98,
                        max: data1[0] * scale_max * 1.09,
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: label2,
                        },
                        grid: {
                            drawOnChartArea: false,
                            drawTicks: false,
                            drawBorder: false,
                        },
                        ticks: {
                            color: 'rgba(148, 148, 148, 0.85)',
                        },
                        min: data2[0] * scale_min * 0.98,
                        max: data2[0] * scale_max * 1.09,
                    },
                    y2: {
                        type: 'linear',
                        position: 'none',
                        min: -50000, // ±10% der Skala
                        max: 1000000,
                        grid: {
    
                            color: (ctx) => {
                                return ctx.tick.value === 0 ? 'rgba(0, 0, 0, 0.27)' : 'rgba(255, 255, 255, 0)'; // 0-Linie hervorheben
                            },
                            lineWidth: (ctx) => {
                                return ctx.tick.value === 0 ? 2 : 0.5; // 0-Linie dicker machen
                            },
                        },
                        ticks: {
                            display: false, // Keine Skalierungen
                        },
                        title: {
                            display: false, // Kein Achsentitel
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom', // Legende oben platzieren
                    },
                    verticalLine: {
                        color: 'rgba(0, 0, 0, 0.98)', // Farbe der Linie
                        lineWidth: 0.8, // Breite der Linie
                    },
                    horizontalLine: { 
                        lines: [ { 
                            targetDatasetIndex: 0, // Erste Linie für Dataset 0 
                            color: 'rgba(0, 154, 123, 0.91)', // Farbe der Linie 
                            lineWidth: 0.7, // Breite der Linie 
                            lineDirection: 'left', // Optionen: 'full', 'right', 'left', 'middle' 
                        }, { 
                            targetDatasetIndex: 1, // Zweite Linie für Dataset 1 
                            color: 'rgba(177, 139, 0, 0.95)', // Farbe der Linie 
                            lineWidth: 0.7, // Breite der Linie 
                            lineDirection: 'right', // Optionen: 'full', 'right', 'left', 'middle' 
                        },], 
                    }, 
                    tooltip: {
                        yAlign: "bottom",
                        caretPadding: 550, // Optional: Abstand zwischen Tooltip und Punkt
                        mode: 'index', // Synchronisierter Tooltip
                        intersect: false,
                        callbacks: {
                            // Tooltip-Werte anpassen
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                                }
                                return label;
                            },
                        },
                    },
                    
                },
            },
        });
}

export function updateChartColors(chart, root) {
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-title').trim();
    const primaryColorAcc = getComputedStyle(root).getPropertyValue("--primary-acc").trim();
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    if (chartArea && chart.config.type === "line") {
        // Erstelle einen Farbverlauf von oben nach unten
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, `${primaryColor}29`); // Farbe oben (volle Deckkraft)
        gradient.addColorStop(1, `${primaryColor}00`); // Transparent unten (0% Deckkraft)

        // Wende den Farbverlauf als Hintergrundfarbe an
        chart.data.datasets[0].backgroundColor = gradient;
    }

    if (chart.data.datasets[0]) {
        chart.data.datasets[0].borderColor = primaryColor
    }

    if (chart.data.datasets[1]) {
        chart.data.datasets[1].borderColor = primaryColorAcc;
    }
    //chart.data.datasets[0].backgroundColor = bgColor;
    chart.update();
}

export function horizontalLinePlugin() {
    return {
        id: 'horizontalLine',
        beforeDraw: (chart, args, options) => {
            const { ctx, chartArea } = chart;
    
            if (!chart._active || !chart._active.length || !options.lines) return;
    
            // Iteriere über alle Linien, die gezeichnet werden sollen
            options.lines.forEach((line) => {
                const activePoint = chart._active.find(
                    (item) => item.datasetIndex === line.targetDatasetIndex
                )?.element;
    
                if (!activePoint) return;
    
                const y = activePoint.y;
    
                let startX = chartArea.left;
                let endX = chartArea.right;
    
                if (line.lineDirection === 'right') {
                    startX = activePoint.x; // Linie startet am Punkt und geht nach rechts
                } else if (line.lineDirection === 'left') {
                    endX = activePoint.x; // Linie startet links und endet am Punkt
                } else if (line.lineDirection === 'middle') {
                    startX = activePoint.x - 50; // Beispiel: 50px links vom Punkt
                    endX = activePoint.x + 50; // Beispiel: 50px rechts vom Punkt
                }
    
                // Zeichnen der Linie
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash(line.lineDash || []); // Strichmuster (falls angegeben)
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
                ctx.lineWidth = line.lineWidth || 1;
                ctx.strokeStyle = line.color || 'rgba(0, 0, 0, 0.5)';
                ctx.stroke();
                ctx.restore();
            });
        },
    };
}

export function verticalLinePlugin() {
    return {
        id: 'verticalLine',
        beforeDraw: (chart, args, options) => {
            const { ctx, chartArea } = chart;

            if (!chart._active || !chart._active.length) return;

            // Aktives Element abrufen
            const activePoint = chart._active[0].element;

            if (!activePoint) return;

            const x = activePoint.x; // X-Koordinate des aktiven Punktes

            // Zeichnen der vertikalen Linie
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, activePoint.y); // Startpunkt (oben)
            ctx.lineTo(x, chartArea.bottom); // Endpunkt (unten)
            ctx.lineWidth = options.lineWidth || 1; // Breite der Linie
            ctx.strokeStyle = options.color || 'rgba(0, 0, 0, 0.5)'; // Farbe der Linie
            ctx.stroke();
            ctx.restore();
        },
    };
}

export function bigNumbers(data, label) {
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;
    let count = Math.floor(Math.abs(average)).toString().length;

    if (count < 4) {
        return [data, label];
    } else if (count < 7) {
        data = data.map(value => value /1000);
        label += " [in thousands]";
        return [data, label];
    } else if (count < 10) {
        data = data.map(value => value /1000000);
        label += " [in Mio.]";
        return [data, label];
    } else {
        data = data.map(value => value /1000000000);
        label += " [in Bn.]";
        return [data, label];
    }
}