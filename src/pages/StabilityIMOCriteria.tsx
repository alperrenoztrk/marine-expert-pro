import { Shield, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StabilityIMOCriteriaPage() {
  const [gm, setGm] = useState<number>(0);
  const [area030, setArea030] = useState<number>(0);
  const [area040, setArea040] = useState<number>(0);
  const [area3040, setArea3040] = useState<number>(0);
  const [maxGZ, setMaxGZ] = useState<number>(0);
  const [angleMaxGZ, setAngleMaxGZ] = useState<number>(0);

  const checkIMOCriteria = () => {
    if (!gm || !area030 || !area040 || !area3040 || !maxGZ || !angleMaxGZ) return null;

    return {
      gmCheck: { pass: gm >= 0.15, value: gm, required: 0.15 },
      area030Check: { pass: area030 >= 0.055, value: area030, required: 0.055 },
      area040Check: { pass: area040 >= 0.09, value: area040, required: 0.09 },
      area3040Check: { pass: area3040 >= 0.03, value: area3040, required: 0.03 },
      maxGZCheck: { pass: maxGZ >= 0.20, value: maxGZ, required: 0.20 },
      angleMaxGZCheck: { pass: angleMaxGZ >= 30, value: angleMaxGZ, required: 30 },
    };
  };

  const results = checkIMOCriteria();

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            IMO Stability Criteria
          </CardTitle>
          <CardDescription>
            IMO stabilite kriterlerine uygunluğu kontrol edin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gm">GM (m)</Label>
              <Input
                id="gm"
                type="number"
                step="0.01"
                value={gm || ""}
                onChange={(e) => setGm(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area030">0-30° Altındaki Alan (m·rad)</Label>
              <Input
                id="area030"
                type="number"
                step="0.001"
                value={area030 || ""}
                onChange={(e) => setArea030(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area040">0-40° Altındaki Alan (m·rad)</Label>
              <Input
                id="area040"
                type="number"
                step="0.001"
                value={area040 || ""}
                onChange={(e) => setArea040(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area3040">30-40° Arası Alan (m·rad)</Label>
              <Input
                id="area3040"
                type="number"
                step="0.001"
                value={area3040 || ""}
                onChange={(e) => setArea3040(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGZ">Maksimum GZ (m)</Label>
              <Input
                id="maxGZ"
                type="number"
                step="0.01"
                value={maxGZ || ""}
                onChange={(e) => setMaxGZ(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="angleMaxGZ">Max GZ Açısı (derece)</Label>
              <Input
                id="angleMaxGZ"
                type="number"
                value={angleMaxGZ || ""}
                onChange={(e) => setAngleMaxGZ(parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          {results && (
            <div className="space-y-3 mt-6">
              <h4 className="font-semibold mb-3">IMO Kriter Kontrolü</h4>
              
              <Alert variant={results.gmCheck.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.gmCheck.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    GM ≥ {results.gmCheck.required} m: {results.gmCheck.value.toFixed(3)} m{" "}
                    {results.gmCheck.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>

              <Alert variant={results.area030Check.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.area030Check.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    0-30° Alan ≥ {results.area030Check.required} m·rad: {results.area030Check.value.toFixed(3)} m·rad{" "}
                    {results.area030Check.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>

              <Alert variant={results.area040Check.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.area040Check.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    0-40° Alan ≥ {results.area040Check.required} m·rad: {results.area040Check.value.toFixed(3)} m·rad{" "}
                    {results.area040Check.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>

              <Alert variant={results.area3040Check.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.area3040Check.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    30-40° Alan ≥ {results.area3040Check.required} m·rad: {results.area3040Check.value.toFixed(3)} m·rad{" "}
                    {results.area3040Check.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>

              <Alert variant={results.maxGZCheck.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.maxGZCheck.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    Max GZ ≥ {results.maxGZCheck.required} m: {results.maxGZCheck.value.toFixed(3)} m{" "}
                    {results.maxGZCheck.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>

              <Alert variant={results.angleMaxGZCheck.pass ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {results.angleMaxGZCheck.pass ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    Max GZ Açısı ≥ {results.angleMaxGZCheck.required}°: {results.angleMaxGZCheck.value.toFixed(1)}°{" "}
                    {results.angleMaxGZCheck.pass ? "✓" : "✗"}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
