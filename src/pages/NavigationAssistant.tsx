import { Compass } from "lucide-react";
import { AssistantInterface } from "@/components/AssistantInterface";

const quickPrompts = [
  "54°30'N 012°20'W noktası için manyetik sapma/variasyon ve deviasyon düzeltmesini nasıl uygularım?",
  "Rotada 2 knot iskele akıntı varsa 12 saatlik seyrin DR hesabını nasıl güncellerim?",
  "Atışlı rota (GC) ile loxodrom rotası arasındaki farkları ve hangi durumda hangisini seçmeliyim?",
  "Karmaşık bir trafik ayrım şeridinde COLREG'e uygun geçiş planını madde madde yazar mısın?",
  "ETA hesaplamak için rota uzunluğu, makine hızı ve beklenen karşı akıntıyı nasıl hesaba katmalıyım?",
  "Seyir fenerleri için görünürlük mesafesini coğrafi ve ışık mesafesiyle nasıl kontrol ederim?",
];

const systemPrompt = `Sen seyir ve köprüüstü operasyonları konusunda uzman bir asistansın.
Seyir hesaplamaları, rota planlama, akıntı ve rüzgar düzeltmeleri, ETA, COLREG uygulamaları ve seyir yardımcıları konusunda rehberlik verirsin.
Yanıtlarını Türkçe, maddeler halinde ve uygulanabilir şekilde yaz; kontrol adımlarını ve emniyet uyarılarını ekle.`;

export default function NavigationAssistantPage() {
  return (
    <AssistantInterface
      title="Seyir Asistanı"
      subtitle="Gerçek seyir asistanı ile hızlı hesap ve öneriler"
      badge="Seyir Asistanı"
      quickPrompts={quickPrompts}
      systemPrompt={systemPrompt}
      placeholder="Seyir hesapları, COLREG veya rota planıyla ilgili sorunuzu yazın..."
      icon={Compass}
      accentGradient="from-blue-600 to-indigo-600"
      iconColor="text-blue-600 dark:text-blue-400"
    />
  );
}

