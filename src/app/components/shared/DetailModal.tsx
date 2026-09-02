import { X } from "lucide-react";
import type { ReactNode } from "react";

export function DetailModal({
  open,
  title,
  icon,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {icon}
            <h3 className="text-gray-900 truncate">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function ViewField({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <span className="text-gray-400 text-xs">{label}</span>
      <div className="font-medium text-gray-800 mt-0.5 break-words">{children}</div>
    </div>
  );
}

export const actionBtn =
  "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors";
export const actionBtnDanger =
  "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors";
export const actionBtnWarn =
  "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors";
