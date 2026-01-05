import { useState } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfig({ title, message, onConfirm });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config.onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const DialogComponent = (
    <ConfirmDialog
      isOpen={isOpen}
      title={config.title}
      message={config.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { showConfirm, DialogComponent };
}
