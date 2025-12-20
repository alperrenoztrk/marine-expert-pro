import { Wrench } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Ana makinede bir silindirin egzoz sıcaklığı diğerlerinden 50°C yüksek. Olası nedenler ve kontrol edilmesi gereken noktalar nelerdir?",
  "Son haftalarda SFOC değerlerimiz %5 arttı. Bu artışın olası nedenleri ve alınabilecek önlemler nelerdir?",
  "HT soğutma suyu sıcaklığı normalin üzerinde seyrediyor. Olası nedenler ve kontrol prosedürü nedir?",
  "Ana makinede anormal titreşim algılandı. Sistematik arıza tespit yaklaşımı ve kontrol edilecek noktalar nelerdir?",
  "Yakıt viskozitesi düşük ölçüldü. Separatör ve viskometre kontrolleri nasıl yapılmalı?",
  "Yedek dizel jeneratörde aşırı siyah duman var. Olası kök nedenleri ve ayar önerilerini paylaşır mısın?",
];

const systemPrompt = `Sen denizcilik alanında uzman bir makine mühendisi asistansın.
Gemi makineleri, yakıt ve yağlama sistemleri, soğutma, bakım planlama ve arıza tespiti konularında rehberlik verirsin.
Yanıtlarını Türkçe, maddeler halinde ve uygulanabilir şekilde yaz; güvenlik, MARPOL/SOLAS ve üretici talimatlarına uyumu vurgula.
Adım adım kontrol önerileri ve alarm eşikleri ekle.`;

export default function MachineAssistant() {
  return (
    <AssistantInterface
      title="Makine Asistanı"
      subtitle="Arıza tespiti, bakım önerileri ve teknik danışmanlık"
      badge="Makine Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Makine sistemi ile ilgili sorunuzu veya arızayı yazın..."
      icon={Wrench}
      accentGradient="from-slate-600 via-zinc-600 to-slate-800"
      iconColor="text-slate-700 dark:text-slate-300"
    />
  );
}

