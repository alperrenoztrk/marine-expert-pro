import { CloudSun } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Rota üzerindeki METAREA yayınlarına göre önümüzdeki 72 saatte beklenen hava ve deniz durumu nedir?",
  "Beaufort 8 rüzgar ve 4-5 m dalga bekleniyor, rota optimizasyonu için önerin nedir?",
  "Barometrede hızlı düşüş gözleniyor. Olası hava sistemi ve alınacak önlemler nelerdir?",
  "Tropik siklon bölgesine yaklaşmadan güvenli kaçış rotası nasıl planlanır?",
  "Kış şartlarında buzlanma riski için operasyonel limitler ve kontrol listesi verebilir misin?",
  "Yoğun sis koşullarında köprüüstü alarm ve vardiya düzenini nasıl güncellemeliyim?",
];

const systemPrompt = `Sen denizcilik meteorolojisi konusunda uzman bir asistansın.
METAREA/SYNOP yayınları, Beaufort ve Douglas skalası, rota optimizasyonu, icing ve tropik siklon kaçış planları konusunda rehberlik edersin.
Yanıtlarını Türkçe, kısa maddelerle ve operasyonel tavsiyelerle ver.
Güvenlik önlemlerini, alarm eşiklerini ve gerekli raporlamaları (NAVTEX, MSI vb.) vurgula.`;

export default function MeteorologyAssistantPage() {
  return (
    <AssistantInterface
      title="Meteoroloji Asistanı"
      subtitle="Rota bazlı hava tavsiyeleri ve alarm eşikleri"
      badge="Meteoroloji Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Hava durumu, rota optimizasyonu veya alarm eşikleri hakkında sorunuzu yazın..."
      icon={CloudSun}
      accentGradient="from-sky-600 via-cyan-600 to-blue-600"
      iconColor="text-sky-600 dark:text-sky-400"
    />
  );
}

