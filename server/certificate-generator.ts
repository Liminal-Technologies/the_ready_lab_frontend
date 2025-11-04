import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import type { Certification, Track, Profile } from '../shared/schema';

export interface CertificateData {
  certification: Certification;
  track: Track;
  profile: Profile;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      const { certification, track, profile } = data;
      const issueDate = new Date(certification.issuedAt);
      const formattedDate = issueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Background color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // Border
      doc
        .strokeColor('#FDB022')
        .lineWidth(10)
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke();

      // Inner border
      doc
        .strokeColor('#333333')
        .lineWidth(2)
        .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
        .stroke();

      // Title
      doc
        .fillColor('#333333')
        .font('Helvetica-Bold')
        .fontSize(48)
        .text('CERTIFICATE', 0, 100, { align: 'center' });

      doc
        .fontSize(24)
        .text('OF COMPLETION', 0, 155, { align: 'center' });

      // Decorative line
      doc
        .strokeColor('#FDB022')
        .lineWidth(2)
        .moveTo(doc.page.width / 2 - 100, 200)
        .lineTo(doc.page.width / 2 + 100, 200)
        .stroke();

      // This certifies that
      doc
        .fillColor('#666666')
        .font('Helvetica')
        .fontSize(16)
        .text('This certifies that', 0, 230, { align: 'center' });

      // Student name
      doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(36)
        .text(profile.fullName || profile.email, 0, 270, { align: 'center' });

      // Has successfully completed
      doc
        .fillColor('#666666')
        .font('Helvetica')
        .fontSize(16)
        .text('has successfully completed', 0, 330, { align: 'center' });

      // Track title
      doc
        .fillColor('#FDB022')
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(track.title, 100, 370, { 
          align: 'center',
          width: doc.page.width - 200
        });

      // Track description (if short enough)
      if (track.description && track.description.length < 150) {
        doc
          .fillColor('#666666')
          .font('Helvetica')
          .fontSize(12)
          .text(track.description, 100, 420, {
            align: 'center',
            width: doc.page.width - 200
          });
      }

      // Date
      doc
        .fillColor('#333333')
        .font('Helvetica')
        .fontSize(14)
        .text(`Issued on ${formattedDate}`, 0, doc.page.height - 150, { align: 'center' });

      // Verification code
      doc
        .fillColor('#999999')
        .font('Helvetica')
        .fontSize(10)
        .text(`Verification Code: ${certification.verificationCode}`, 0, doc.page.height - 120, { align: 'center' });

      // Footer
      doc
        .fillColor('#666666')
        .fontSize(10)
        .text('The Ready Lab', 0, doc.page.height - 90, { align: 'center' });

      doc
        .fontSize(8)
        .text('Build the fundable business that funders actually want to back.', 0, doc.page.height - 75, { align: 'center' });

      // Signature line (left side)
      const signatureY = doc.page.height - 180;
      doc
        .strokeColor('#333333')
        .lineWidth(1)
        .moveTo(150, signatureY)
        .lineTo(350, signatureY)
        .stroke();

      doc
        .fillColor('#666666')
        .fontSize(10)
        .text('Instructor Signature', 150, signatureY + 10, { width: 200, align: 'center' });

      // Date line (right side)
      doc
        .strokeColor('#333333')
        .lineWidth(1)
        .moveTo(doc.page.width - 350, signatureY)
        .lineTo(doc.page.width - 150, signatureY)
        .stroke();

      doc
        .fillColor('#666666')
        .fontSize(10)
        .text('Date', doc.page.width - 350, signatureY + 10, { width: 200, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function streamCertificatePDF(data: CertificateData): PassThrough {
  const stream = new PassThrough();
  
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  doc.pipe(stream);

  const { certification, track, profile } = data;
  const issueDate = new Date(certification.issuedAt);
  const formattedDate = issueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

  // Border
  doc
    .strokeColor('#FDB022')
    .lineWidth(10)
    .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
    .stroke();

  // Inner border
  doc
    .strokeColor('#333333')
    .lineWidth(2)
    .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
    .stroke();

  // Title
  doc
    .fillColor('#333333')
    .font('Helvetica-Bold')
    .fontSize(48)
    .text('CERTIFICATE', 0, 100, { align: 'center' });

  doc
    .fontSize(24)
    .text('OF COMPLETION', 0, 155, { align: 'center' });

  // Decorative line
  doc
    .strokeColor('#FDB022')
    .lineWidth(2)
    .moveTo(doc.page.width / 2 - 100, 200)
    .lineTo(doc.page.width / 2 + 100, 200)
    .stroke();

  // This certifies that
  doc
    .fillColor('#666666')
    .font('Helvetica')
    .fontSize(16)
    .text('This certifies that', 0, 230, { align: 'center' });

  // Student name
  doc
    .fillColor('#000000')
    .font('Helvetica-Bold')
    .fontSize(36)
    .text(profile.fullName || profile.email, 0, 270, { align: 'center' });

  // Has successfully completed
  doc
    .fillColor('#666666')
    .font('Helvetica')
    .fontSize(16)
    .text('has successfully completed', 0, 330, { align: 'center' });

  // Track title
  doc
    .fillColor('#FDB022')
    .font('Helvetica-Bold')
    .fontSize(28)
    .text(track.title, 100, 370, { 
      align: 'center',
      width: doc.page.width - 200
    });

  // Track description (if short enough)
  if (track.description && track.description.length < 150) {
    doc
      .fillColor('#666666')
      .font('Helvetica')
      .fontSize(12)
      .text(track.description, 100, 420, {
        align: 'center',
        width: doc.page.width - 200
      });
  }

  // Date
  doc
    .fillColor('#333333')
    .font('Helvetica')
    .fontSize(14)
    .text(`Issued on ${formattedDate}`, 0, doc.page.height - 150, { align: 'center' });

  // Verification code
  doc
    .fillColor('#999999')
    .font('Helvetica')
    .fontSize(10)
    .text(`Verification Code: ${certification.verificationCode}`, 0, doc.page.height - 120, { align: 'center' });

  // Footer
  doc
    .fillColor('#666666')
    .fontSize(10)
    .text('The Ready Lab', 0, doc.page.height - 90, { align: 'center' });

  doc
    .fontSize(8)
    .text('Build the fundable business that funders actually want to back.', 0, doc.page.height - 75, { align: 'center' });

  // Signature line (left side)
  const signatureY = doc.page.height - 180;
  doc
    .strokeColor('#333333')
    .lineWidth(1)
    .moveTo(150, signatureY)
    .lineTo(350, signatureY)
    .stroke();

  doc
    .fillColor('#666666')
    .fontSize(10)
    .text('Instructor Signature', 150, signatureY + 10, { width: 200, align: 'center' });

  // Date line (right side)
  doc
    .strokeColor('#333333')
    .lineWidth(1)
    .moveTo(doc.page.width - 350, signatureY)
    .lineTo(doc.page.width - 150, signatureY)
    .stroke();

  doc
    .fillColor('#666666')
    .fontSize(10)
    .text('Date', doc.page.width - 350, signatureY + 10, { width: 200, align: 'center' });

  doc.end();

  return stream;
}
