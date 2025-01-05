// Generiert ein Dummy-Dataset
export function generateDummyDataset() {
    return [
        { date: "2023-01-01", price: 1500, movements: "-", dividends: "-", index: 100.0 },
        { date: "2023-01-02", price: 1520, movements: "+20", dividends: "-", index: 101.0 },
    ];
}

// Parst den Dateiinhalt basierend auf dem Typ (JSON oder CSV)
export function parseFileContent(content, fileType) {
    if (fileType.includes("json")) {
        return JSON.parse(content); // JSON-Datei
    } else if (fileType.includes("csv")) {
        return parseCSV(content); // CSV-Datei
    } else {
        throw new Error("Unbekannter Dateityp.");
    }
}

// Konvertiert CSV-String zu einem JSON-Array
export function parseCSV(csv) {
    const rows = csv.split("\n");
    const headers = rows[0].split(",");

    return rows.slice(1).map((row) => {
        const values = row.split(",");
        return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim() || null;
            return obj;
        }, {});
    });
}
