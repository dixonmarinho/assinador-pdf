import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/src/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface PDFViewerProps {
  file: File | null;
  className?: string;
}

export function PDFViewer({ file, className }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages));
  }

  function changeScale(delta: number) {
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 3.0));
  }

  if (!file) {
    return (
      <div className={cn("flex items-center justify-center h-96 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300", className)}>
        <p className="text-slate-500">Nenhum arquivo selecionado</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <div className="flex items-center justify-between w-full max-w-3xl mb-4 p-2 bg-white rounded-lg shadow-sm border border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700">
            Página {pageNumber} de {numPages || '--'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => changeScale(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={() => changeScale(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-slate-50 rounded-lg border border-slate-200 overflow-auto flex justify-center p-4 min-h-[600px]">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
          loading={
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-10 w-10 border-2 border-slate-200 border-t-slate-800 rounded-full"
              />
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm text-slate-500 font-medium"
              >
                Carregando documento...
              </motion.p>
            </div>
          }
          error={(error) => (
            <div className="flex flex-col items-center justify-center h-96 text-red-500 gap-2 p-4 text-center">
              <p className="font-medium">Erro ao carregar PDF</p>
              <p className="text-sm text-slate-500">
                {error instanceof Error ? error.message : 'Verifique se o arquivo é válido.'}
              </p>
            </div>
          )}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
            loading={
              <div className="flex items-center justify-center h-[800px] w-full bg-white">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="h-full w-full bg-slate-100 animate-pulse"
                />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}
