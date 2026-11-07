package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.ExpenseDTO;
import com.revanth.moneymanager.dto.IncomeDTO;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExcelService {

    private static final String[] HEADERS = {"S.No", "Name", "Category", "Amount", "Date"};
    private static final int[] WIDTHS = {2500, 9000, 7000, 4500, 4500};

    private record Line(String name, String category, BigDecimal amount, LocalDate date) {}

    public void writeIncomesToExcel(OutputStream os, List<IncomeDTO> incomes) throws IOException {
        write(os, "Incomes", incomes.stream()
                .map(i -> new Line(i.getName(), i.getCategoryName(), i.getAmount(), i.getDate()))
                .toList());
    }

    public void writeExpensesToExcel(OutputStream os, List<ExpenseDTO> expenses) throws IOException {
        write(os, "Expenses", expenses.stream()
                .map(e -> new Line(e.getName(), e.getCategoryName(), e.getAmount(), e.getDate()))
                .toList());
    }

    private void write(OutputStream os, String sheetName, List<Line> lines) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);

            CellStyle headerStyle = workbook.createCellStyle();
            Font bold = workbook.createFont();
            bold.setBold(true);
            headerStyle.setFont(bold);

            Row header = sheet.createRow(0);
            for (int c = 0; c < HEADERS.length; c++) {
                Cell cell = header.createCell(c);
                cell.setCellValue(HEADERS[c]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(c, WIDTHS[c]);
            }

            for (int i = 0; i < lines.size(); i++) {
                Line line = lines.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(orNA(line.name()));
                row.createCell(2).setCellValue(orNA(line.category()));
                row.createCell(3).setCellValue(line.amount() != null ? line.amount().doubleValue() : 0);
                row.createCell(4).setCellValue(line.date() != null ? line.date().toString() : "N/A");
            }
            workbook.write(os);
        }
    }

    private static String orNA(String value) {
        return value != null ? value : "N/A";
    }
}