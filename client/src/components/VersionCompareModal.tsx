import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, ArrowLeftRight } from "lucide-react";

type Version = {
  id: number;
  versionNumber: number;
  exportedImageUrl: string | null;
  text: string | null;
  format: string;
  model: string;
  font: string;
  fontSize: number;
  tags: string | null;
  createdAt: Date;
};

type VersionCompareModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: Version[];
};

export default function VersionCompareModal({
  open,
  onOpenChange,
  versions,
}: VersionCompareModalProps) {
  const [leftVersionId, setLeftVersionId] = useState<string>(
    versions[0]?.id.toString() || ""
  );
  const [rightVersionId, setRightVersionId] = useState<string>(
    versions[1]?.id.toString() || ""
  );

  const leftVersion = versions.find((v) => v.id.toString() === leftVersionId);
  const rightVersion = versions.find((v) => v.id.toString() === rightVersionId);

  const swapVersions = () => {
    const temp = leftVersionId;
    setLeftVersionId(rightVersionId);
    setRightVersionId(temp);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comparar Versões</DialogTitle>
          <DialogDescription>
            Compare duas versões lado a lado para identificar diferenças visuais e de conteúdo
          </DialogDescription>
        </DialogHeader>

        {/* Seletores de versão */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end mb-4">
          <div>
            <Label htmlFor="left-version">Versão Esquerda</Label>
            <Select value={leftVersionId} onValueChange={setLeftVersionId}>
              <SelectTrigger id="left-version">
                <SelectValue placeholder="Selecione uma versão" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version, index) => (
                  <SelectItem key={version.id} value={version.id.toString()}>
                    Versão {version.versionNumber}
                    {index === 0 && " (Atual)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={swapVersions}
            className="mb-0"
            title="Trocar versões"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>

          <div>
            <Label htmlFor="right-version">Versão Direita</Label>
            <Select value={rightVersionId} onValueChange={setRightVersionId}>
              <SelectTrigger id="right-version">
                <SelectValue placeholder="Selecione uma versão" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version, index) => (
                  <SelectItem key={version.id} value={version.id.toString()}>
                    Versão {version.versionNumber}
                    {index === 0 && " (Atual)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparação lado a lado */}
        <div className="grid grid-cols-2 gap-6">
          {/* Versão Esquerda */}
          <div className="space-y-4">
            {leftVersion && (
              <>
                <div className="relative">
                  {leftVersion.exportedImageUrl ? (
                    <img
                      src={leftVersion.exportedImageUrl}
                      alt={`Versão ${leftVersion.versionNumber}`}
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                      <span className="text-6xl">✨</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Versão {leftVersion.versionNumber}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-2xl space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    {new Date(leftVersion.createdAt).toLocaleString("pt-BR")}
                  </div>
                  <div>
                    <strong className="text-slate-900">Texto:</strong>{" "}
                    <span className="text-slate-700">
                      {leftVersion.text || "Sem texto"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-slate-900">Formato:</strong>{" "}
                      <span className="text-slate-700">{leftVersion.format}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900">Modelo:</strong>{" "}
                      <span className="text-slate-700">{leftVersion.model}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-slate-900">Fonte:</strong>{" "}
                      <span className="text-slate-700">{leftVersion.font}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900">Tamanho:</strong>{" "}
                      <span className="text-slate-700">{leftVersion.fontSize}%</span>
                    </div>
                  </div>
                  {leftVersion.tags && (
                    <div>
                      <strong className="text-slate-900">Tags:</strong>{" "}
                      <span className="text-slate-700">{leftVersion.tags}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Versão Direita */}
          <div className="space-y-4">
            {rightVersion && (
              <>
                <div className="relative">
                  {rightVersion.exportedImageUrl ? (
                    <img
                      src={rightVersion.exportedImageUrl}
                      alt={`Versão ${rightVersion.versionNumber}`}
                      className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg border-2 border-accent/20"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                      <span className="text-6xl">✨</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Versão {rightVersion.versionNumber}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-2xl space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    {new Date(rightVersion.createdAt).toLocaleString("pt-BR")}
                  </div>
                  <div>
                    <strong className="text-slate-900">Texto:</strong>{" "}
                    <span className="text-slate-700">
                      {rightVersion.text || "Sem texto"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-slate-900">Formato:</strong>{" "}
                      <span className="text-slate-700">{rightVersion.format}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900">Modelo:</strong>{" "}
                      <span className="text-slate-700">{rightVersion.model}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-slate-900">Fonte:</strong>{" "}
                      <span className="text-slate-700">{rightVersion.font}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900">Tamanho:</strong>{" "}
                      <span className="text-slate-700">{rightVersion.fontSize}%</span>
                    </div>
                  </div>
                  {rightVersion.tags && (
                    <div>
                      <strong className="text-slate-900">Tags:</strong>{" "}
                      <span className="text-slate-700">{rightVersion.tags}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Diferenças destacadas */}
        {leftVersion && rightVersion && (
          <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <h4 className="font-semibold text-slate-900 mb-2">Diferenças Identificadas:</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              {leftVersion.text !== rightVersion.text && (
                <li>• Texto alterado</li>
              )}
              {leftVersion.format !== rightVersion.format && (
                <li>• Formato alterado: {leftVersion.format} → {rightVersion.format}</li>
              )}
              {leftVersion.model !== rightVersion.model && (
                <li>• Modelo alterado: {leftVersion.model} → {rightVersion.model}</li>
              )}
              {leftVersion.font !== rightVersion.font && (
                <li>• Fonte alterada: {leftVersion.font} → {rightVersion.font}</li>
              )}
              {leftVersion.fontSize !== rightVersion.fontSize && (
                <li>• Tamanho da fonte alterado: {leftVersion.fontSize}% → {rightVersion.fontSize}%</li>
              )}
              {leftVersion.tags !== rightVersion.tags && (
                <li>• Tags alteradas</li>
              )}
              {leftVersion.text === rightVersion.text &&
                leftVersion.format === rightVersion.format &&
                leftVersion.model === rightVersion.model &&
                leftVersion.font === rightVersion.font &&
                leftVersion.fontSize === rightVersion.fontSize &&
                leftVersion.tags === rightVersion.tags && (
                  <li className="text-green-600">✓ Nenhuma diferença detectada nos metadados</li>
                )}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
