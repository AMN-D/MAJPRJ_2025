function downloadPDF() {
  const element = document.documentElement;

  const options = {
    filename: "my-document.pdf",
    margin: 1,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
}
