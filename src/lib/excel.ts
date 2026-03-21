import * as XLSX from "xlsx";

/**
 * Generates and downloads an Excel file from an array of objects.
 * @param data Array of objects (rows)
 * @param filename Name of the downloaded file (e.g., 'students.xlsx')
 * @param sheetName Name of the sheet inside the file
 */
export function downloadExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1"
) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the array of objects to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit columns based on content
  const colWidths = data.length > 0 ? Object.keys(data[0]).map(key => {
    const maxContentLength = Math.max(
      ...data.map(row => String(row[key] || "").length),
      key.length
    );
    return { wch: maxContentLength + 2 };
  }) : [];
  worksheet["!cols"] = colWidths;

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Trigger download (browser only)
  XLSX.writeFile(workbook, filename);
}
