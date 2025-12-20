import { ShipWheel } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Ağır hava koşullarında demirleme prosedürü ve kontrol listesi nedir?",
  "Güverte ekibinin vardiya planını SOLAS ve STCW'ye uygun nasıl düzenlerim?",
  "Permit to work sürecinde sıcak çalışma için hangi adımları uygulamalıyım?",
  "Yanaşma manevrasında halat dizilimi ve emniyetli çalışma mesafeleri nelerdir?",
  "Lashing ekipmanlarının günlük kontrolünde bakılması gereken kritik noktalar hangileri?",
  "ISM gereği haftalık tatbikat planını nasıl yapılandırmalıyım?",
];

const systemPrompt = `Sen denizcilik operasyonlarında gemicilik ve güverte yönetimi uzmanı bir asistansın.
Yanaşma-manavra, demirleme, izinli işler (PTW), vardiya düzeni, bakım ve ISM/SOLAS gereklilikleri hakkında rehberlik verirsin.
Yanıtlarını Türkçe, adım adım ve sahada uygulanabilir şekilde yaz; güvenlik uyarılarını ve ekipman kontrollerini vurgula.`;

export default function SeamanshipAssistantPage() {
  return (
    <AssistantInterface
      title="Gemicilik Asistanı"
      subtitle="Vardiya, bakım ve operasyonel güvenlik için rehber"
      badge="Gemicilik Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Gemicilik, operasyon veya PTW süreçleriyle ilgili sorunuzu yazın..."
      icon={ShipWheel}
      accentGradient="from-emerald-600 via-teal-600 to-blue-600"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
}

