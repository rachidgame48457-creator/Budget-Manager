function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const transactions = getTransactions();
  const totals = calculateTotals(transactions);

  doc.setFontSize(18);
  doc.text("Budget Manager Pro Report", 20, 20);

  doc.setFontSize(12);
  doc.text("Solde: " + totals.balance + " DH", 20, 35);
  doc.text("Revenus: " + totals.income + " DH", 20, 45);
  doc.text("Depenses: " + totals.expense + " DH", 20, 55);

  let y = 75;
  doc.setFontSize(10);

  transactions.forEach((t, i) => {
    const line = `${i + 1}. ${t.date} | ${t.desc} | ${t.category} | ${t.type} | ${t.amount} DH`;
    doc.text(line, 20, y);
    y += 8;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("budget-report.pdf");
}
