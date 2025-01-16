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

    /**
     * Methode, um die readCsvOptions zu setzen
     * @param {object} options - sep (str), dec (str), headers (bool), thou (str) ...
     */
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

    /**
     * Gibt eine Liste aus, mit allen Werten aus dem .raw Attribute bei gegebener Spalte
     * @param {str} raw - .raw Attribut von der RawDataSet-Klasse oder ein csv-String
     * @param {int} colIndex - Spaltenindex, beginnend bei 0 
     * @param {boolean} removeHeader - entfernt Header aus zurückgegebener Liste
     * @param {object} options - options for {sep: "separator", headers: true, ...}
     */
    static rawGetColumnValues(raw, colIndex, removeHeader, options) {
        if (!raw) {
            throw new Error("Raw data is empty.");
        }

        // Zeilen aufteilen
        const rows = raw.split("\n").map(row => row.trim()).filter(row => row !== "");

        // Werte aus der Spalte mit `colIndex` extrahieren
        const columnValues = rows.map(row => {
            const cells = row.split(options.sep);
            return cells[colIndex] || null; // `null` für fehlende Werte
        });

        if (removeHeader) columnValues.shift();

        return columnValues;
    }

     /**
     * Prüft für eine bestimmte Spalte im .raw Attribut (also csv Datei) ob alle Werte als Datum nach einem bestimmten
     * Format geparsed werden können.
     * @param {int} colIndex - Index der Spalte im RawDataSet.raw Attribut (csv-File)
     * @param {string} format - Das erwartete Datumsformat (DMY, MDY, YMD).
     * @returns {boolean} True, wenn alle Werte der gewünschten Spalte in Datum umgewandelt werden können.
     */
     rawValidateDateColumn(colIndex, format) {
        // Regex-Muster für die Formate
        let dateCol = RawDataSet.rawGetColumnValues(this.raw, colIndex, true, this.readCsvOptions);

        for (let index = 0; index < dateCol.length; index++) {
            let value = dateCol[index];
            if (!RawDataSet.isValidDate(value, format)) {
                console.log("DATE ERROR:    " + value + " at index:  " + index);
                return false; // Beendet die gesamte Funktion
            }
        }
        
        console.log("DATE COLUMN CORRECT! ------------")
        return true;
    }


    // ...

    /**
     * Prüft, ob ein Wert ein gültiges Datum im angegebenen Format ist.
     * @param {string} value - Der zu überprüfende Wert.
     * @param {string} format - Das erwartete Datumsformat (DMY, MDY, YMD).
     * @returns {boolean} True, wenn das Datum gültig ist.
     */
    static isValidDate(value, format) {
        if (!value) return false;

        // Regex-Muster für die Formate
        const patterns = {
            DMY: /^(0?[1-9]|[12][0-9]|3[01])[./-](0?[1-9]|1[0-2])[./-](\d{4}|\d{2})$/,
            MDY: /^(0?[1-9]|1[0-2])[./-](0?[1-9]|[12][0-9]|3[01])[./-](\d{4}|\d{2})$/,
            YMD: /^(\d{4}|\d{2})[./-](0?[1-9]|1[0-2])[./-](0?[1-9]|[12][0-9]|3[01])$/
        };

        const regex = patterns[format];
        if (!regex) return false;

        const match = value.match(regex);
        if (!match) return false;

        let day, month, year;

        if (format === "DMY") {
            [day, month, year] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        } else if (format === "MDY") {
            [month, day, year] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        } else if (format === "YMD") {
            [year, month, day] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        }

        // Jahr anpassen, wenn es nur 2-stellig ist
        if (year < 100) year += 2000;

        // Überprüfen, ob das Datum existiert
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }


    /**
     * Methode, um die ersten 5 Werte jeder Spalte im .raw Attribut zu extrahieren.
     * @returns {Object} Ein Dictionary mit Headern als Keys und den ersten 5 Werten als Array.
     */
    getHeader() {
        if (!this.raw) {
            throw new Error("No raw data available.");
        }

        // CSV in Zeilen aufteilen
        const rows = this.raw.split("\n").filter(row => row.trim() !== "");
        
        // Header extrahieren
        const headers = rows[0].split(",").map(header => header.trim());
        
        // Datenzeilen extrahieren
        const dataRows = rows.slice(1);

        // Ergebnis-Dictionary erstellen
        const result = {};

        headers.forEach((header, index) => {
            const values = dataRows
                .map(row => row.split(",")[index]?.trim()) // Werte der jeweiligen Spalte
                .slice(0, 5); // Nur die ersten 5 Werte
            result[header] = values;
        });

        return result;
    }

    /**
     * Methode, um die ersten 5 Werte jeder Spalte im .raw Attribut zu extrahieren.
     * @returns {String} Ein String mit Headern ersten 5 Linien.
     */
    getHeaderRaw() {
        if (!this.raw) {
            throw new Error("No raw data available.");
        }

        const rows = this.raw.split("\n");
        const firstRows = rows.slice(0,6).join("\n");
        return firstRows;
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

    /**
     * Generiert ein Dummy-Dataset für Testzwecke.
     * @returns {RawDataSet} Instanz mit Dummy-Daten
     */
    static generateDummyDataset() {
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
        let data3 = [null, null, 27040, null, null, -14674, null, null, -55000, null, null, null, null, null, 92260, 
            null, null, null, 99820, null, 88900, null, null, null];

        // Erstelle den CSV-Header
        const header = `dateColumn,${label1},${label2},${label3}`;

        // Erstelle die Zeilen basierend auf den Daten
        const rows = xValues.map((date, index) => {
            const value1 = data1[index] || "";
            const value2 = data2[index] || "";
            const value3 = data3[index] || "";
            return `${date},${value1},${value2},${value3}`;
        });

        // Kombiniere Header und Zeilen in einen CSV-String
        const raw = [header, ...rows].join("\n");

        return new RawDataSet(raw); // raw wird als String initialisiert
    }

}