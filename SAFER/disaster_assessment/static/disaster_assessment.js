function downloadPDF() {
  const element = document.body; 
  const options = {
    filename: "my-document.pdf",
    margin: 0, 
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true }, 
    jsPDF: { unit: "px", format: "a4", orientation: "portrait" }, 
  };

  html2pdf().set(options).from(element).save();
}
