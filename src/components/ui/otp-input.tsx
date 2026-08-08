import { useState } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  loading?: boolean;
}

export function OtpInput({ length = 6, onComplete, onResend, loading }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < length) {
      newOtp.push("");
    }
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 border-border bg-card text-center font-display text-lg font-extrabold text-foreground outline-none transition-all focus:border-crimson focus:shadow-[var(--shadow-glow)] sm:text-xl"
            disabled={loading}
          />
        ))}
      </div>
      {onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="mx-auto block text-xs font-extrabold text-crimson hover:text-crimson/80 disabled:opacity-50"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}
