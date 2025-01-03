// QR/Barcode Scanning using ZXing
const videoElement = document.getElementById("qr-video");
const scannedDataElement = document.getElementById("scanned-data");
const codeReader = new ZXing.BrowserBarcodeReader();

codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
    if (result) {
        scannedDataElement.textContent = result.text; // Display scanned data
    }
});

// Document Scanning using Tesseract.js
const fileInput = document.getElementById("file-input");
const extractedTextElement = document.getElementById("extracted-text");

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            Tesseract.recognize(reader.result, 'eng').then(({ data: { text } }) => {
                extractedTextElement.textContent = text; // Display extracted text
            });
        };
        reader.readAsDataURL(file);
    }
});

// Export to CSV
document.getElementById("export-csv").addEventListener("click", () => {
    const data = [
        ["Scanned Data", scannedDataElement.textContent],
        ["Extracted Text", extractedTextElement.textContent]
    ];
    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scanned_data.csv";
    link.click();
    URL.revokeObjectURL(url);
});

// Export to Excel
document.getElementById("export-excel").addEventListener("click", () => {
    const workbook = XLSX.utils.book_new();
    const data = [
        ["Scanned Data", scannedDataElement.textContent],
        ["Extracted Text", extractedTextElement.textContent]
    ];
    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "Scanned Data");
    XLSX.writeFile(workbook, "scanned_data.xlsx");
});
