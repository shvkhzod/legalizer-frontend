// /src/lib/utils/pdfGenerator.ts
import { jsPDF } from 'jspdf';
import type { ComplianceReport, ComplianceCheck } from './types';

/**
 * Generate and download a PDF report with modern dark design matching the website
 * @param report - The compliance report data
 */
export function generatePDF(report: ComplianceReport): void {
  const doc = new jsPDF();

  // Page settings
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = 0;

  // Dark theme colors matching website
  const colors = {
    dark: [2, 2, 2],           // #020202
    cardBg: [15, 15, 15],      // #0f0f0f (lighter dark for cards)
    border: [40, 40, 40],      // #282828
    primary: [34, 139, 255],   // #228bff
    white: [255, 255, 255],    // #ffffff
    gray: [156, 163, 175],     // #9ca3af
    lightGray: [229, 231, 235],// #e5e7eb
    green: [52, 199, 89],      // #34c759
    orange: [255, 159, 10],    // #ff9f0a
    red: [255, 59, 48]         // #ff3b30
  };

  // Helper to draw dark background on all pages
  const drawPageBackground = () => {
    doc.setFillColor(...colors.dark);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  // Helper to render text without weird spacing
  const renderText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 4): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = y;

    lines.forEach((line: string) => {
      // Render each line individually to avoid spacing issues
      doc.text(line.trim(), x, currentY, { align: 'left' });
      currentY += lineHeight;
    });

    return currentY;
  };

  // Initialize first page
  drawPageBackground();
  yPosition = margin;

  // Helper function to add new page
  const checkPageBreak = (neededSpace: number = 15) => {
    if (yPosition + neededSpace > pageHeight - margin - 10) {
      doc.addPage();
      drawPageBackground();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to draw rounded rectangle (card)
  const drawCard = (x: number, y: number, width: number, height: number, color: number[] = colors.cardBg) => {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, width, height, 3, 3, 'F');

    // Border
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');
  };

  // === HEADER SECTION ===
  // Blue gradient header bar
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Title
  doc.setTextColor(...colors.white);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Report', margin, 20);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 230, 255); // Light blue
  doc.text('AI-Powered Legal Compliance Analysis', margin, 30);

  yPosition = 55;

  // === WEBSITE INFO CARD ===
  checkPageBreak(35);
  const infoCardHeight = 30;
  drawCard(margin, yPosition, contentWidth, infoCardHeight);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Scanned URL:', margin + 5, yPosition + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.primary);
  renderText(report.scannedUrl, margin + 5, yPosition + 16, contentWidth - 10, 4);

  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  const scanDate = new Date(report.scanDate).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Scan Date: ${scanDate}`, margin + 5, yPosition + 25);

  yPosition += infoCardHeight + 10;

  // === SCORE CARD ===
  checkPageBreak(55);
  const scoreCardHeight = 50;

  // Score color based on value
  const scoreColor = report.overallScore > 85 ? colors.green :
                    report.overallScore > 60 ? colors.orange : colors.red;

  // Light background with score color tint
  const scoreBgColor = scoreColor.map(c => Math.min(c + 230, 255));
  drawCard(margin, yPosition, contentWidth, scoreCardHeight, [
    Math.floor((colors.cardBg[0] + scoreColor[0] * 0.1)),
    Math.floor((colors.cardBg[1] + scoreColor[1] * 0.1)),
    Math.floor((colors.cardBg[2] + scoreColor[2] * 0.1))
  ]);

  // Score title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Overall Compliance Score', margin + 5, yPosition + 12);

  // Large score number
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...scoreColor);
  doc.text(`${report.overallScore}`, pageWidth / 2 - 10, yPosition + 35, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(...colors.gray);
  doc.text('/100', pageWidth / 2 + 12, yPosition + 35);

  // Status badge
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...scoreColor);
  doc.text(report.overallStatus, pageWidth / 2, yPosition + 45, { align: 'center' });

  yPosition += scoreCardHeight + 12;

  // === EXECUTIVE SUMMARY ===
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 8;

  // Summary boxes
  const renderSummaryBox = (title: string, items: string[], color: number[], icon: string) => {
    if (items.length === 0) return;

    checkPageBreak(20 + items.length * 5);

    const boxHeight = 15 + items.length * 5;

    // Card background with subtle color tint
    drawCard(margin, yPosition, contentWidth, boxHeight, [
      Math.floor((colors.cardBg[0] + color[0] * 0.05)),
      Math.floor((colors.cardBg[1] + color[1] * 0.05)),
      Math.floor((colors.cardBg[2] + color[2] * 0.05))
    ]);

    // Left border accent
    doc.setFillColor(...color);
    doc.rect(margin, yPosition, 3, boxHeight, 'F');

    // Title with icon
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(`${icon} ${title}`, margin + 8, yPosition + 8);

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.lightGray);

    let itemY = yPosition + 14;
    items.forEach((item) => {
      itemY = renderText(`• ${item}`, margin + 8, itemY, contentWidth - 15, 4);
    });

    yPosition += boxHeight + 6;
  };

  renderSummaryBox('Strengths', report.summary.goodPoints, colors.green, '✓');
  renderSummaryBox('Warnings', report.summary.warnings, colors.orange, '⚠');
  renderSummaryBox('Critical Issues', report.summary.threats, colors.red, '✗');

  yPosition += 8;

  // === DETAILED FINDINGS ===
  checkPageBreak(25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Detailed Findings', margin, yPosition);
  yPosition += 10;

  // Function to render check sections
  const renderCheckSection = (title: string, checks: ComplianceCheck[]) => {
    if (checks.length === 0) return;

    checkPageBreak(20);

    // Section title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text(title, margin, yPosition);

    // Underline
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 2, margin + 50, yPosition + 2);

    yPosition += 8;

    // Render each check
    checks.forEach((check) => {
      const statusColor = getStatusColorArray(check.status);

      // Estimate card height
      const summaryLines = doc.splitTextToSize(check.summary, contentWidth - 16);
      const recLines = doc.splitTextToSize(check.recommendation, contentWidth - 16);
      const cardHeight = 25 + summaryLines.length * 3 + recLines.length * 3;

      checkPageBreak(cardHeight + 5);

      // Check card
      drawCard(margin, yPosition, contentWidth, cardHeight);

      // Status indicator bar
      doc.setFillColor(...statusColor);
      doc.rect(margin, yPosition, contentWidth, 3, 'F');

      // Check title
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.white);
      doc.text(check.title, margin + 5, yPosition + 10);

      // Status badge
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...statusColor);
      const statusWidth = doc.getTextWidth(check.status);

      // Status pill background
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2], 0.2);
      doc.roundedRect(pageWidth - margin - statusWidth - 8, yPosition + 5, statusWidth + 6, 6, 2, 2, 'F');
      doc.text(check.status, pageWidth - margin - statusWidth - 5, yPosition + 9);

      // Summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colors.lightGray);
      let textY = yPosition + 17;
      textY = renderText(check.summary, margin + 5, textY, contentWidth - 16, 3);
      textY += 3;

      // Recommendation
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(...colors.gray);
      renderText('💡 Recommendation: ' + check.recommendation, margin + 5, textY, contentWidth - 16, 3);

      yPosition += cardHeight + 5;
    });

    yPosition += 5;
  };

  // Render all sections
  renderCheckSection('Security', report.checks.security);
  renderCheckSection('Website Policies', report.checks.websitePolicies);
  renderCheckSection('Marketing Compliance', report.checks.marketing);
  renderCheckSection('Payment Processing', report.checks.payments);
  renderCheckSection('Member Data & Copyright', report.checks.memberData);

  // === FOOTER ON ALL PAGES ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(...colors.gray);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
    doc.text(
      'Generated by AI Legal Compliance Checker',
      pageWidth / 2,
      pageHeight - 3,
      { align: 'center' }
    );
  }

  // === DOWNLOAD ===
  const filename = `compliance-report-${new Date(report.scanDate).toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Get color array based on compliance status
 */
function getStatusColorArray(status: string): number[] {
  switch (status) {
    case 'Compliant':
      return [52, 199, 89]; // Green
    case 'Warning':
      return [255, 159, 10]; // Orange
    case 'Non-Compliant':
      return [255, 59, 48]; // Red
    case 'Info':
    default:
      return [34, 139, 255]; // Blue
  }
}
