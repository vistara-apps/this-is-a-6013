import { cn } from "~/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "text" | "email" | "fileUpload";
  label?: string;
  error?: string;
}

export function Input({ 
  variant = "text", 
  label, 
  error, 
  className, 
  ...props 
}: InputProps) {
  const inputClasses = cn(
    "input-text",
    error && "border-red-500 ring-red-500/20",
    variant === "fileUpload" && "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[hsl(240,80%,45%)]",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <input
        type={variant === "fileUpload" ? "file" : variant}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ 
  label, 
  error, 
  className, 
  ...props 
}: TextareaProps) {
  const textareaClasses = cn(
    "input-text min-h-[100px] resize-vertical",
    error && "border-red-500 ring-red-500/20",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
