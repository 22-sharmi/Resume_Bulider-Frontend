import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

export const generatePDF = async (resume) => {
  try {
    const content = document.getElementById('resume-content');
    if (!content) {
      throw new Error('Resume content element not found');
    }

    const dataUrl = await domtoimage.toPng(content);
    
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Error generating PDF:', error);
  }
};