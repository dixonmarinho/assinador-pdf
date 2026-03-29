import { useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { PDFViewer } from '@/src/components/PDFViewer';
import { SignatureModal } from '@/src/components/SignatureModal';
import { embedSignature } from '@/src/lib/pdf-utils';
import { Upload, FileText, Download, PenTool, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setSignedPdfUrl(null);
      } else {
        alert('Por favor, selecione um arquivo PDF.');
      }
    }
  };

  const handleSign = async (signatureDataUrl: string) => {
    if (!file) return;

    setIsSigning(false);
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      const signedPdfBytes = await embedSignature(fileBuffer, signatureDataUrl);
      
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSignedPdfUrl(url);
    } catch (error) {
      console.error('Erro ao assinar PDF:', error);
      alert('Ocorreu um erro ao assinar o documento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (signedPdfUrl) {
      const link = document.createElement('a');
      link.href = signedPdfUrl;
      link.download = `assinado_${file?.name || 'documento.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setFile(null);
    setSignedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Assinador PDF</h1>
          </div>
          
          {file && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">
                Novo Arquivo
              </Button>
              {!signedPdfUrl ? (
                <Button onClick={() => setIsSigning(true)} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Assinar Documento
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Assinado
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        {!file ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed border-slate-300 rounded-xl bg-white p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Envie seu documento PDF</h2>
            <p className="text-slate-500 mb-6 max-w-md">
              Arraste e solte seu arquivo aqui ou clique para selecionar.
              O processamento é feito localmente no seu navegador.
            </p>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button size="lg" onClick={() => fileInputRef.current?.click()}>
              Selecionar Arquivo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {signedPdfUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between text-green-800">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Documento assinado com sucesso!</p>
                    <p className="text-sm text-green-600">Seu arquivo está pronto para download.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleDownload} className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
                  Baixar Agora
                </Button>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <PDFViewer file={file} className="w-full" />
            </div>
          </div>
        )}
      </main>

      <SignatureModal
        isOpen={isSigning}
        onClose={() => setIsSigning(false)}
        onSave={handleSign}
      />
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
