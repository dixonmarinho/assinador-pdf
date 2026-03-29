import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/src/components/ui/button';
import { X, Check, Eraser } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  if (!isOpen) return null;

  const clear = () => sigCanvas.current?.clear();

  const save = () => {
    if (sigCanvas.current) {
      // Get the signature as a PNG data URL
      // trim() removes whitespace around the signature
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-lg">Assinar Documento</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 bg-slate-50">
          <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: 'w-full h-64 cursor-crosshair',
              }}
              backgroundColor="rgba(255, 255, 255, 1)"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Desenhe sua assinatura acima
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white">
          <Button variant="outline" onClick={clear} className="text-slate-600">
            <Eraser className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={save}>
              <Check className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
