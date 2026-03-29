import { PDFDocument } from 'pdf-lib';

export async function embedSignature(
  pdfBytes: ArrayBuffer,
  signatureDataUrl: string, // Base64 Data URL from canvas
  pageIndex: number = -1 // Default to last page
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Extract base64 data
  const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
  
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  
  const pages = pdfDoc.getPages();
  // Default to the last page if pageIndex is -1
  const targetPageIndex = (pageIndex < 0 || pageIndex >= pages.length) ? pages.length - 1 : pageIndex;
  const page = pages[targetPageIndex];

  const { width } = page.getSize();
  
  // Scale signature to a reasonable size (e.g., 200px width)
  const targetWidth = 200;
  const scale = targetWidth / signatureImage.width;
  const sigDims = signatureImage.scale(scale);

  // Position at bottom center
  const centerX = (width / 2) - (sigDims.width / 2);
  const bottomY = 50; // 50 units from bottom

  page.drawImage(signatureImage, {
    x: centerX,
    y: bottomY,
    width: sigDims.width,
    height: sigDims.height,
  });

  const pdfBytesSaved = await pdfDoc.save();
  return pdfBytesSaved;
}
