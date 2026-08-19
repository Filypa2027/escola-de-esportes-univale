import type { Status } from "../data/mockData";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    ATIVO: { label: "Ativo", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    INATIVO: { label: "Inativo", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    DELETADO: { label: "Excluído", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  }[status];

  const px = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${px} ${config.bg} ${config.text} ${textSize} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
