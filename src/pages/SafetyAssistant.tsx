import { ShieldCheck } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Yıllık ISM iç denetimi öncesi hazırlık listesi ve doküman kontrolleri neler olmalı?",
  "Hot work permit verirken risk değerlendirmesi ve gaz ölçüm adımlarını sıralar mısın?",
  "MOB tatbikatı için köprüüstü ve güverte ekibine verilecek görevleri özetler misin?",
  "Risk assessment formunda frekans/şiddet matrisini nasıl puanlamalıyım?",
  "SOLAS gereği abandon ship tatbikatında dikkat edilmesi gereken kritik adımlar nelerdir?",
  "LOTO uygulanacak makine bakımında kilitleme/etiketleme adımlarını listeleyebilir misin?",
];

const systemPrompt = `Sen denizcilik güvenliği ve ISM/ISPS uyumu konusunda uzman bir asistansın.
Risk değerlendirme, tatbikat planlama, permit to work, LOTO ve iç denetim hazırlığı konularında rehberlik verirsin.
Yanıtlarını Türkçe, madde madde ve uygulanabilir şekilde yaz; SOLAS, ISM, ISPS ve şirket prosedürlerine uygun uyarıları ekle.`;

export default function SafetyAssistantPage() {
  return (
    <AssistantInterface
      title="Emniyet Asistanı"
      subtitle="Risk değerlendirme ve denetim hazırlığı için destek"
      badge="Emniyet Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Emniyet, denetim veya tatbikat planlamasıyla ilgili sorunuzu yazın..."
      icon={ShieldCheck}
      accentGradient="from-rose-600 via-orange-600 to-amber-600"
      iconColor="text-rose-600 dark:text-rose-400"
    />
  );
}

