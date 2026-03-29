import { pdfjs } from 'react-pdf';

// Use unpkg CDN to load the worker, ensuring the version matches the installed pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
