import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface StrukSetorData {
  kodeSetor: string;
  tanggal: string;
  nasabah: {
    namaNasabah: string;
    alamat?: string;
    telp?: string;
  };
  status: string;
  totalBeratKg?: number;
  totalPoin?: number;
  estimasiTotalPoin?: number;
  catatan?: string;
  catatanAdmin?: string;
  detailSetors?: {
    namaKategori?: string;
    kategori?: string;
    beratKg?: number;
    berat?: number;
    poinPerKg?: number;
    subtotalPoin?: number;
    kategoriSampah?: {
      namaKategori: string;
      poinPerKg: number;
    };
  }[];
}

export interface StrukPenukaranData {
  kodePenukaran: string;
  tanggal: string;
  nasabah: {
    namaNasabah: string;
    telp?: string;
  };
  hadiah: {
    namaHadiah: string;
    poinDibutuhkan?: number;
    deskripsi?: string;
  };
  poinTerpakai: number;
  status: string;
  kodeVoucher?: string;
}

export function generateStrukSetorPDF(data: StrukSetorData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5", // Receipt friendly format
  });

  const primaryColor: [number, number, number] = [26, 71, 49]; // #1a4731
  const secondaryColor: [number, number, number] = [45, 122, 85]; // #2d7a55
  const accentGold: [number, number, number] = [217, 119, 6]; // #d97706

  // Top Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 148, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SMASH — BANK SAMPAH DIGITAL", 74, 10, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("STRUK BUKTI PENYETORAN SAMPAH DAUR ULANG", 74, 17, { align: "center" });

  // Receipt Info Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, 28, 128, 26, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("No. Transaksi:", 14, 34);
  doc.setFont("helvetica", "normal");
  doc.text(data.kodeSetor, 38, 34);

  doc.setFont("helvetica", "bold");
  doc.text("Tanggal Setor:", 14, 40);
  doc.setFont("helvetica", "normal");
  const formattedDate = new Date(data.tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(formattedDate, 38, 40);

  doc.setFont("helvetica", "bold");
  doc.text("Nama Nasabah:", 78, 34);
  doc.setFont("helvetica", "normal");
  doc.text(data.nasabah.namaNasabah || "Nasabah", 102, 34);

  doc.setFont("helvetica", "bold");
  doc.text("Status:", 78, 40);
  doc.setTextColor(22, 101, 52);
  doc.setFont("helvetica", "bold");
  doc.text("TERVERIFIKASI", 102, 40);

  if (data.nasabah.telp) {
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("No. Telepon:", 14, 46);
    doc.setFont("helvetica", "normal");
    doc.text(data.nasabah.telp, 38, 46);
  }

  // Items Table
  const items = data.detailSetors || [];
  const tableRows = items.map((item, idx) => {
    const nama = item.namaKategori || item.kategori || item.kategoriSampah?.namaKategori || "Sampah Daur Ulang";
    const berat = (item.beratKg ?? item.berat ?? 0).toFixed(1);
    const rate = item.poinPerKg ?? item.kategoriSampah?.poinPerKg ?? 10;
    const poin = item.subtotalPoin ?? Math.round(Number(berat) * rate);
    return [(idx + 1).toString(), nama, `${berat} kg`, `${rate} Poin/kg`, `+${poin} Poin`];
  });

  if (tableRows.length === 0) {
    tableRows.push(["1", "Setoran Sampah", `${(data.totalBeratKg || 0).toFixed(1)} kg`, "-", `+${data.totalPoin || 0} Poin`]);
  }

  autoTable(doc, {
    startY: 57,
    head: [["No", "Kategori Sampah", "Berat", "Tarif Nilai", "Subtotal Poin"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "center", cellWidth: 24 },
      4: { halign: "right", cellWidth: 24, fontStyle: "bold", textColor: [22, 101, 52] },
    },
    margin: { left: 10, right: 10 },
  });

  // Calculate position after table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 100;

  // Summary Box
  doc.setDrawColor(187, 247, 208);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(10, finalY + 4, 128, 22, 2, 2, "FD");

  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL BERAT FISIK:", 14, finalY + 11);
  doc.setFontSize(10);
  doc.text(`${(data.totalBeratKg || 0).toFixed(1)} kg`, 55, finalY + 11);

  doc.setFontSize(8.5);
  doc.setTextColor(...accentGold);
  doc.text("TOTAL POIN DISALURKAN:", 14, finalY + 19);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`+${(data.totalPoin || data.estimasiTotalPoin || 0).toLocaleString("id-ID")} POIN`, 62, finalY + 19);

  // Admin notes if available
  let noteY = finalY + 30;
  if (data.catatanAdmin) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.text(`Catatan Petugas: "${data.catatanAdmin}"`, 14, noteY);
    noteY += 6;
  }

  // Footer & Signature Area
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Struk ini adalah bukti resmi verifikasi transaksi Bank Sampah SMASH.", 74, 195, { align: "center" });
  doc.text("Terima kasih telah berkontribusi menjaga kelestarian lingkungan bersama kami.", 74, 199, { align: "center" });

  // Save PDF
  doc.save(`Struk-Setor-${data.kodeSetor}.pdf`);
}

export function generateStrukPenukaranPDF(data: StrukPenukaranData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const primaryColor: [number, number, number] = [26, 71, 49]; // #1a4731
  const secondaryColor: [number, number, number] = [45, 122, 85]; // #2d7a55
  const accentGold: [number, number, number] = [217, 119, 6]; // #d97706

  // Top Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 148, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SMASH — BANK SAMPAH DIGITAL", 74, 10, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("BUKTI KLAIM REWARD & PENUKARAN VOUCHER", 74, 17, { align: "center" });

  // Info Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, 28, 128, 24, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("No. Penukaran:", 14, 34);
  doc.setFont("helvetica", "normal");
  doc.text(data.kodePenukaran, 38, 34);

  doc.setFont("helvetica", "bold");
  doc.text("Tanggal Klaim:", 14, 40);
  doc.setFont("helvetica", "normal");
  const formattedDate = new Date(data.tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(formattedDate, 38, 40);

  doc.setFont("helvetica", "bold");
  doc.text("Nama Nasabah:", 78, 34);
  doc.setFont("helvetica", "normal");
  doc.text(data.nasabah?.namaNasabah || "Nasabah", 102, 34);

  doc.setFont("helvetica", "bold");
  doc.text("Status:", 78, 40);
  doc.setTextColor(22, 101, 52);
  doc.setFont("helvetica", "bold");
  doc.text("BERHASIL / SELESAI", 102, 40);

  // Voucher Highlight Box
  doc.setDrawColor(134, 239, 172);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(10, 56, 128, 46, 3, 3, "FD");

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("KODE VOUCHER / KLAIM RESMI", 74, 63, { align: "center" });

  // Voucher Code Tag
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(24, 67, 100, 12, 2, 2, "FD");

  doc.setTextColor(22, 101, 52);
  doc.setFontSize(13);
  doc.setFont("courier", "bold");
  doc.text(data.kodeVoucher || `VCHR-${data.kodePenukaran}`, 74, 75, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.hadiah?.namaHadiah || "Hadiah Reward", 74, 86, { align: "center" });

  doc.setTextColor(...accentGold);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Poin Terpakai: ${data.poinTerpakai.toLocaleString("id-ID")} Poin`, 74, 94, { align: "center" });

  // Instructions & Terms
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Petunjuk Penggunaan Voucher:", 14, 110);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("1. Tunjukkan struk atau kode voucher ini kepada pihak penyedia / kasir mitra.", 14, 116);
  doc.text("2. Voucher hanya dapat diklaim satu kali dan tidak dapat diuangkan kembali.", 14, 122);
  doc.text("3. Simpan struk ini sebagai bukti sah penukaran saldo poin Bank Sampah SMASH.", 14, 128);

  // Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Struk ini diterbitkan secara otomatis oleh sistem Bank Sampah SMASH.", 74, 195, { align: "center" });
  doc.text("Terima kasih telah aktif menukarkan poin dan mendukung lingkungan hijau.", 74, 199, { align: "center" });

  // Save PDF
  doc.save(`Struk-Voucher-${data.kodePenukaran}.pdf`);
}
