import { useEffect } from "react";

export default function StabilityShearingBendingPage() {
  // Legacy page now redirects into central calculations tab without changing menu buttons
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/stability/calculations#shearBending");
    }
  }, []);
  return null;
}
