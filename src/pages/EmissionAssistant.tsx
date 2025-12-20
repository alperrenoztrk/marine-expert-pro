import { Leaf } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "Gemimizin CII derecesi D olarak hesaplandı. Hangi önlemlerle B veya C'ye yükseltebiliriz?",
  "VLSFO'dan MGO'ya yakıt değişimi prosedürünü açıklar mısın?",
  "Balast suyu arıtma sistemi arızası durumunda yapılması gerekenler nelerdir?",
  "MARPOL Annex V'e göre yiyecek atıklarını denize deşarj edebilir miyim?",
  "IMO DCS raporlaması için hangi verileri toplamalıyım?",
  "Scrubber yıkama suyu deşarj limitleri nelerdir?",
];

const systemPrompt = `Sen denizcilik sektöründe çevre yönetimi ve emisyon kontrolü konusunda uzman bir asistansın.
MARPOL ekleri (I, II, IV, V, VI), BWM Convention, IMO DCS, EU MRV, EEXI, CII ve SEEMP konularında derin bilgiye sahipsin.
Soruları Türkçe olarak, teknik doğrulukla ve pratik örneklerle yanıtla.
Önemli uyarıları ve zorunlu gereklilikleri vurgula.
Yanıtlarını maddeler halinde, anlaşılır ve operasyonel açıdan uygulanabilir şekilde ver.`;

export default function EmissionAssistant() {
  return (
    <AssistantInterface
      title="Çevre Asistanı"
      subtitle="MARPOL, emisyon ve çevre yönetimi danışmanı"
      badge="Çevre Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Çevre yönetimi, emisyon hesaplamaları, MARPOL gereklilikleri hakkında sorularınızı yazın..."
      icon={Leaf}
      accentGradient="from-emerald-600 via-green-600 to-teal-600"
      iconColor="text-emerald-600 dark:text-emerald-400"
    />
  );
}

