import StabilityCalculatorWorkflow from "@/components/stability/StabilityCalculatorWorkflow";

export default function StabilityCalculatorPage() {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Kapsamlı Gemi Stabilite Hesaplayıcısı
          </h1>
          <p className="text-lg text-muted-foreground">
            Adım adım gemi stabilite analizi ve IMO kriter kontrolü
          </p>
        </div>

        <StabilityCalculatorWorkflow />
      </div>
    </div>
  );
}
