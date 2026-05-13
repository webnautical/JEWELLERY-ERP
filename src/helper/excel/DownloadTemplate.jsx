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
}) => {
    const downloadTemplate = () => {
        // Create empty row from headers
        const emptyRow = headers.reduce((acc, header) => {
            acc[header] = "";
            return acc;
        }, {});

        // Create worksheet with only headers
        const worksheet = XLSX.utils.json_to_sheet([emptyRow]);

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Append sheet
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Generate excel buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Save file
        const fileData = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
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