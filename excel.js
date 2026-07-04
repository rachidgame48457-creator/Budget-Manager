function exportExcel() {
  const transactions = getTransactions();

  const rows = transactions.map(t => ({
    Date: t.date,
    Description: t.desc,
    Categorie: t.category,
    Type: t.type,
    Montant: t.amount
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, "budget-report.xlsx");
}
