import { VscWarning } from "react-icons/vsc";

export function ErrorAlert({ text }: { text: string }) {
  return (
    <div className="bg-red-900 rounded p-2">
      <span className="block text-neutral-300">
        <VscWarning className="inline" /> Error
      </span>
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}
