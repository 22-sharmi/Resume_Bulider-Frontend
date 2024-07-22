import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

export const generatePDF = async (resume) => {
  const content = document.getElementById('resume-content');
  
  const dataUrl = await domtoimage.toPng(content);
  
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(dataUrl);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('resume.pdf');
};