import { Shield } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "KG ve KM değerlerim var. GM hesaplayıp IMO minimum kriteriyle karşılaştırır mısın?",
  "0-40° GZ eğrisi alanını hesaplamak için hangi adımları izlemeliyim?",
  "Serbest yüzey düzeltmesini (FSC) tank listesine nasıl uygularım?",
  "Tahıl yüklemesinde heeling momenti nasıl hesaplar ve GM'i nasıl doğrularım?",
  "Hasarlı stabilite için perdelenmemiş bölme su alırsa başlangıç açısını nasıl tahmin ederim?",
  "Rüzgar devrilme momentine karşı gerekli GM minimumunu nasıl bulurum?",
];

const systemPrompt = `Sen gemi stabilitesi konusunda uzman bir asistansın.
GM, GZ, KN tabloları, FSC, tahıl ve hasarlı stabilite hesapları ile IMO IS Code kriterleri hakkında detaylı bilgi verirsin.
Yanıtlarını Türkçe, maddeler halinde ve formülleri belirterek yaz; hesap adımlarını ve emniyet limitlerini vurgula.`;

export default function StabilityAssistantPage() {
  return (
    <AssistantInterface
      title="Stabilite Asistanı"
      subtitle="GM, GZ, FSC ve IMO kriterleri için hızlı rehber"
      badge="Stabilite Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Stabilite hesapları, FSC veya IMO kriterleriyle ilgili sorunuzu yazın..."
      icon={Shield}
      accentGradient="from-cyan-600 via-teal-600 to-emerald-600"
      iconColor="text-cyan-700 dark:text-cyan-400"
    />
  );
}

