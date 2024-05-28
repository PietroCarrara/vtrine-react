import { VscWarning } from "react-icons/vsc";

export function WarnAlert({ text }: { text: string }) {
  return (
    <div className="bg-yellow-900 rounded p-2">
      <span className="block text-neutral-300">
        <VscWarning className="inline" /> Warning
      </span>
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}
