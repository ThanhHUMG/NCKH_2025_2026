package com.nckh.htql_thi.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

public class ExcelDataGenerator {

    private static final String[] KHOA_NAMES = {"Công nghệ thông tin", "Kinh tế", "Ngoại ngữ", "Cơ khí", "Điện tử"};
    private static final Random random = new Random();

    public static void main(String[] args) throws IOException {
        generateKhoa();
        generateMonHoc(50);
        generateGiaoVien(20);  // 20 giáo viên theo yêu cầu
        generateSinhVien(200); // 200 sinh viên theo yêu cầu
        System.out.println("✅ Đã tạo xong các file Excel: 200 SV và 20 GV!");
    }

    private static void generateKhoa() throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Khoa");
        String[] headers = {"tenKhoa"};
        String[][] data = new String[KHOA_NAMES.length][1];
        for (int i = 0; i < KHOA_NAMES.length; i++) data[i][0] = KHOA_NAMES[i];
        writeData(workbook, sheet, headers, data, "01_Khoa_Test.xlsx");
    }

    private static void generateGiaoVien(int count) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("GiaoVien");
        // Thứ tự cột khớp với GiaoVienService: hoTen, namSinh, trinhDo, soDienThoai, email, diaChi, tenKhoa
        String[] headers = {"hoTen", "namSinh", "trinhDo", "soDienThoai", "email", "diaChi", "tenKhoa"};
        String[][] data = new String[count][7];
        
        for (int i = 0; i < count; i++) {
            data[i][0] = "Giảng viên Test " + (i + 1);
            data[i][1] = String.valueOf(1975 + (i % 20));
            data[i][2] = (i % 2 == 0) ? "Tiến sĩ" : "Thạc sĩ";
            data[i][3] = "0912" + String.format("%06d", i + 100);
            data[i][4] = "teacher" + (i + 1) + "@school.edu.vn";
            data[i][5] = "Khu tập thể giảng viên số " + (i + 1);
            data[i][6] = KHOA_NAMES[i % KHOA_NAMES.length];
        }
        writeData(workbook, sheet, headers, data, "02_GiaoVien_20.xlsx");
    }

    private static void generateSinhVien(int count) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("SinhVien");
        // Thứ tự cột khớp với SinhVienService: hoTen, namSinh, nienKhoa, soDienThoai, email, diaChi, tenKhoa
        String[] headers = {"hoTen", "namSinh", "nienKhoa", "soDienThoai", "email", "diaChi", "tenKhoa"};
        String[][] data = new String[count][7];
        
        for (int i = 0; i < count; i++) {
            data[i][0] = "Sinh viên Test " + (i + 1);
            data[i][1] = String.valueOf(2004 + (i % 3));
            data[i][2] = "K" + (60 + (i % 5));
            data[i][3] = "0333" + String.format("%06d", i + 100);
            data[i][4] = "student" + (i + 1) + "@student.edu.vn";
            data[i][5] = "Ký túc xá phòng " + (100 + i);
            data[i][6] = KHOA_NAMES[i % KHOA_NAMES.length];
        }
        writeData(workbook, sheet, headers, data, "03_SinhVien_200.xlsx");
    }

    private static void generateMonHoc(int count) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("MonHoc");
        String[] headers = {"tenMonHoc", "tinChi", "tenKhoa"};
        String[][] data = new String[count][3];
        for (int i = 0; i < count; i++) {
            data[i][0] = "Môn học chuyên ngành " + (i + 1);
            data[i][1] = String.valueOf((i % 2 == 0) ? 3 : 2);
            data[i][2] = KHOA_NAMES[i % KHOA_NAMES.length];
        }
        writeData(workbook, sheet, headers, data, "04_MonHoc_Test.xlsx");
    }

    private static void writeData(Workbook workbook, Sheet sheet, String[] headers, String[][] data, String fileName) throws IOException {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) headerRow.createCell(i).setCellValue(headers[i]);

        for (int i = 0; i < data.length; i++) {
            Row row = sheet.createRow(i + 1);
            for (int j = 0; j < data[i].length; j++) row.createCell(j).setCellValue(data[i][j]);
        }
        try (FileOutputStream fileOut = new FileOutputStream(fileName)) {
            workbook.write(fileOut);
        }
        workbook.close();
    }
}