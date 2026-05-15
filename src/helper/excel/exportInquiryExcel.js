
import * as XLSX from "xlsx";
export const exportInquiryExcel = (inquiries = []) => {
    const wb = XLSX.utils.book_new();
    const ws = {};

    // ── Helpers ──────────────────────────────────────────────────────────────
    const YELLOW = "#c3d40600";
    const ORANGE = "#f77c1000";
    const BLACK = "#FF000000";

    const cell = (value, bgColor = null, bold = false) => ({
        v: value ?? "",
        t: "s",
        s: {
            font: { name: "Arial", sz: 10, bold, color: { rgb: BLACK } },
            fill: bgColor ? { fgColor: { rgb: bgColor }, patternType: "solid" } : {},
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "FFD3D3D3" } },
                bottom: { style: "thin", color: { rgb: "FFD3D3D3" } },
                left: { style: "thin", color: { rgb: "FFD3D3D3" } },
                right: { style: "thin", color: { rgb: "FFD3D3D3" } },
            },
        },
    });

    // ── Build rows ────────────────────────────────────────────────────────────
    const aoa = []; // array of arrays (each inner = one row of cells)

    inquiries.forEach((inq) => {
        // ── SECTION 1: Sales Only ──────────────────────────────────────────────
        // Header row
        aoa.push([
            cell(inq.inquiry_code, null, true),
            cell("Material", YELLOW, true),
            cell("Stone", YELLOW, true),
            cell("Plating Thickness", YELLOW, true),
            cell("Upload Pics", YELLOW, true),
            cell(""), cell(""), cell(""), cell(""),
        ]);

        // Design rows (Sales)
        (inq.designs || []).forEach((d) => {
            aoa.push([
                cell(d.name, YELLOW),
                cell(d.material, YELLOW),
                cell(d.stone, YELLOW),
                cell(d.plating, YELLOW),
                cell(d.upload_pics, YELLOW),
                cell(""), cell(""), cell(""), cell(""),
            ]);
        });

        // Blank separator row
        aoa.push(Array(9).fill(cell("")));

        // ── SECTION 2: Sales + Costing ─────────────────────────────────────────
        // Top label row: inquiry code | Sales x3 | | Costing team x4
        aoa.push([
            cell(inq.inquiry_code, null, true),
            cell("Sales", YELLOW, true),
            cell("Sales", YELLOW, true),
            cell("Sales", YELLOW, true),
            cell("", YELLOW),
            cell("Costing team", ORANGE, true),
            cell("", ORANGE, true),
            cell("", ORANGE, true),
            cell("", ORANGE, true),
        ]);

        // Sub-header row
        aoa.push([
            cell("", null),
            cell("Material", YELLOW, true),
            cell("Stone", YELLOW, true),
            cell("Plating Thickness", YELLOW, true),
            cell("Upload Pics", YELLOW, true),
            cell("Weight", ORANGE, true),
            cell("Stone Cost", ORANGE, true),
            cell("Labour Cost", ORANGE, true),
            cell("Plating Cost", ORANGE, true),
        ]);

        // Costing design rows
        (inq.designs || []).forEach((d) => {
            aoa.push([
                cell(d.name, YELLOW),
                cell(d.material, YELLOW),
                cell(d.stone, YELLOW),
                cell(d.plating, YELLOW),
                cell(d.upload_pics, YELLOW),
                cell(d.weight ?? "—", ORANGE),
                cell(d.stone_cost ?? "—", ORANGE),
                cell(d.labour_cost ?? "—", ORANGE),
                cell(d.plating_cost ?? "—", ORANGE),
            ]);
        });

        // Two blank rows before next inquiry
        aoa.push(Array(9).fill(cell("")));
        aoa.push(Array(9).fill(cell("")));
    });

    // ── Write sheet ───────────────────────────────────────────────────────────
    const range = { s: { r: 0, c: 0 }, e: { r: aoa.length - 1, c: 8 } };
    aoa.forEach((row, r) =>
        row.forEach((cellObj, c) => {
            const addr = XLSX.utils.encode_cell({ r, c });
            ws[addr] = cellObj;
        })
    );
    ws["!ref"] = XLSX.utils.encode_range(range);
    ws["!cols"] = [
        { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 18 },
        { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    ];

    const fileName = inquiries.length === 1
        ? `${inquiries[0].inquiry_code}.xlsx`
        : "inquiry_export.xlsx";

    XLSX.utils.book_append_sheet(wb, ws, "Inquiry Export");
    XLSX.writeFile(wb, fileName);
};