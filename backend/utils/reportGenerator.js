import PDFDocument from 'pdfkit';

export const generatePDFReport = async (analysis) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Title
            doc.fontSize(20).text('Data Analysis Report', { align: 'center' });
            doc.moveDown();

            // Summary
            doc.fontSize(16).text('Summary', { underline: true });
            doc.fontSize(12).text(analysis.summary || 'No summary available');
            doc.moveDown();

            // Key Insights
            doc.fontSize(16).text('Key Insights', { underline: true });
            if (analysis.keyInsights && analysis.keyInsights.length > 0) {
                analysis.keyInsights.forEach((insight, index) => {
                    doc.fontSize(12).text(`${index + 1}. ${insight}`);
                });
            }
            doc.moveDown();

            // Visualizations info
            doc.fontSize(16).text('Visualizations', { underline: true });
            if (analysis.visualizations && analysis.visualizations.length > 0) {
                analysis.visualizations.forEach((viz, index) => {
                    doc.fontSize(12).text(`${index + 1}. ${viz.title} (${viz.chartType})`);
                    doc.fontSize(10).text(`   ${viz.description}`);
                });
            }
            doc.moveDown();

            // Footer
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
