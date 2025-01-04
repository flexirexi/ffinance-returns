
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