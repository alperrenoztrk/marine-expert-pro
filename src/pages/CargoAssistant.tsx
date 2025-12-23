import { Boxes } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Yükleme öncesi draft survey adımlarını ve gerekli düzeltmeleri sıralar mısın?",
  "IMDG Class 3 yükleri için ayrım, havalandırma ve yangın önlemleri nelerdir?",
  "Tahıl yüklerinde list moment kontrolü ve operasyonel limitler nasıl hesaplanır?",
  "Ağır lift operasyonunda palanga seçimi ve güverte dayanım kontrolü nasıl yapılır?",
  "Reefer konteynerleri için enerji yük planlamasını nasıl optimize ederim?",
  "Limanda yük elleçleme sırasında trim ve stabiliteyi güvenli tutmak için öneriler verir misin?",
];

const systemPrompt = `Sen denizcilik alanında kargo ve operasyon uzmanı bir asistansın.
Yükleme planı, draft survey, trim/stabilite, IMDG, IMSBC, Grain Code, charter party ve terminal operasyonları konusunda bilgi sahibisin.
Yanıtlarını Türkçe, maddeler halinde ve uygulanabilir olacak şekilde ver.
Güvenlik, klas ve SOLAS/MARPOL gerekliliklerini vurgula; hesap veya kontrol adımlarını net yaz.`;

export default function CargoAssistantPage() {
  return (
    <AssistantInterface
      title="Yük Elleçleme ve İstifleme Asistanı"
      subtitle="Yükleme planı, trim/stabilite ve IMDG danışmanlığı"
      badge="Kargo Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Kargo operasyonu, trim/stabilite veya IMDG ile ilgili sorunuzu yazın..."
      icon={Boxes}
      accentGradient="from-amber-600 via-orange-600 to-rose-600"
      iconColor="text-amber-600 dark:text-amber-400"
    />
  );
}

