import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadTemplate = ({
    headers = [],
    fileName = "template.xlsx",
    sheetName = "Sheet1",
    buttonText = "Download Template",
    className = "btn btn-success d-flex align-items-center gap-2",
    iconClass = "bi bi-download",
    dropdownColumns = [],
}) => {
    const downloadTemplate = () => {
        const workbook = XLSX.utils.book_new();

        // --- Main Sheet ---
        const emptyRow = headers.reduce((acc, header) => {
            acc[header] = "";
            return acc;
        }, {});
        const worksheet = XLSX.utils.json_to_sheet([emptyRow]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // --- Extra Sheets for Dropdowns ---
        dropdownColumns.forEach(({ sheetName: dropSheetName, values }) => {
            if (!values || values.length === 0) return;

            const dropSheet = XLSX.utils.aoa_to_sheet(values.map((v) => [v]));
            XLSX.utils.book_append_sheet(workbook, dropSheet, dropSheetName);
        });

        // --- Save ---
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(fileData, fileName);
    };

    return (
        <button onClick={downloadTemplate} className={className}>
            <i className={iconClass}></i>
            {buttonText}
        </button>
    );
};

export default DownloadTemplate;