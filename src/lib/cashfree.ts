type CashfreeCheckout = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: string;
    onSuccess?: () => void;
    onFailure?: () => void;
  }) => void;
};

declare global {
  interface Window {
    Cashfree?: CashfreeCheckout;
  }
}

export async function loadCashfree(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Cashfree) return true;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v1/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
