import { Document, Paragraph, TextRun, Packer } from 'docx';

export async function generateDocx(contractText: string) {
  try {
    const lines = contractText.split('\n');
    
    const paragraphs = lines.map(line => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24,
            font: 'Arial',
          }),
        ],
        spacing: {
          after: 120,
        },
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Freelance_Contract.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    alert('Failed to generate Word document.');
  }
}