// Generiert ein Dummy-Dataset
//export function generateDummyDataset() {
//    return [
//        { date: "2023-01-01", price: 1500, movements: "-", dividends: "-", index: 100.0 },
//        { date: "2023-01-02", price: 1520, movements: "+20", dividends: "-", index: 101.0 },
//    ];
//}

// Parst den Dateiinhalt basierend auf dem Typ (JSON oder CSV)
export function parseFileContent(content, fileType) {
    if (fileType.includes("json")) {
        return JSON.parse(content); // JSON-Datei
    } else if (fileType.includes("csv")) {
        return content; // kommt später: parseCSV(content); // CSV-Datei
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


// RawDataSet-Klasse
export class RawDataSet {
    constructor(raw) {
        this.raw = raw; // Rohdaten (z. B. CSV-String oder Array von Arrays)
        this.readCsvOptions = null; // Optionen für das Lesen und Verarbeiten von CSV-Daten (initial null)
        this.dataSet = null; // Verarbeitetes Dataset basierend auf raw und readCsvOptions (initial null)
    }

    // Methode, um die readCsvOptions zu setzen
    setReadCsvOptions(options) {
        this.readCsvOptions = options;
    }

    // Methode, um das dataSet basierend auf raw und readCsvOptions zu erstellen
    processRawData() {
        if (!this.readCsvOptions) {
            throw new Error("readCsvOptions müssen vor der Verarbeitung gesetzt werden.");
        }
        const rows = this.raw;
        const headers = this.readCsvOptions.headers;
        this.dataSet = rows.map(row =>
            headers.reduce((acc, header, index) => {
                acc[header] = row[index] || null;
                return acc;
            }, {})
        );
    }

    // Methode, um das Dataset in einen CSV-String zu konvertieren
    toCSV() {
        if (!this.dataSet) {
            throw new Error("Das Dataset ist noch nicht verarbeitet und kann nicht als CSV exportiert werden.");
        }
        const headerLine = `dateColumn,${Object.keys(this.dataSet[0]).join(",")}`;
        const rowsLines = this.dataSet.map(row => {
            const values = Object.values(row).map(value => (value === null ? "" : value));
            return values.join(",");
        });
        return [headerLine, ...rowsLines].join("\n");
    }

    // Dummy-Dataset generieren
    static generateDummyDataset() {
        const raw = [
            ["2023-01-31", 1535000, 100, null],
            ["2023-02-28", 1560000, 101.63, null],
            ["2023-03-31", 1627040, 104.23, 27040],
            ["2023-04-30", 1677040, 107.44, null],
            ["2023-05-31", 1700598, 108.95, null],
            ["2023-06-30", 1717119, 110.95, -14674],
            ["2023-07-31", 1709968, 110.48, null],
            ["2023-08-31", 1735062, 112.1, null],
            ["2023-09-30", 1687013, 112.55, -55000],
            ["2023-10-31", 1695656, 113.13, null],
            ["2023-11-30", 1688617, 112.66, null],
            ["2023-12-31", 1699799, 113.41, null],
            ["2024-01-31", 1714772, 114.41, null],
            ["2024-02-29", 1688167, 112.63, null],
            ["2024-03-31", 1750106, 110.61, null],
            ["2024-04-30", 1766539, 111.65, 92260],
            ["2024-05-31", 1759744, 111.22, null],
            ["2024-06-30", 1776384, 112.27, null],
            ["2024-07-31", 1855738, 110.98, null],
            ["2024-08-31", 1860775, 111.28, 99820],
            ["2024-09-30", 1931543, 110.19, null],
            ["2024-10-31", 1901629, 108.49, 88900],
            ["2024-11-30", 1929410, 110.07, null],
            ["2024-12-31", 1983306, 113.15, null],
        ];

        return new RawDataSet(raw); // Nur das raw-Attribut wird initialisiert
    }

}