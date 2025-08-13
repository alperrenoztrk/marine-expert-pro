import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Brain, User, Bot, Loader2, ImageIcon, X, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { callStabilityAssistant, type AIMessage } from "@/services/aiClient";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
}

export default function StabilityAssistantPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben Stabilite Asistanınızım. Gemi stabilitesi, hidrostatik hesaplamalar, IMO kriterleri ve daha birçok konuda size yardımcı olabilirim. Görsel yükleyerek gemi planları, hesaplamalar veya diagramları analiz edebilirim. Hangi konuda yardıma ihtiyacınız var?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAndRequestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      return true; // Web doesn't need permission
    }

    try {
      const permissions = await CapacitorCamera.checkPermissions();
      
      if (permissions.photos !== 'granted') {
        const result = await CapacitorCamera.requestPermissions({
          permissions: ['photos']
        });
        
        if (result.photos !== 'granted') {
          toast({
            title: "İzin Gerekli",
            description: "Fotoğraf galerisine erişim için izin gereklidir.",
            variant: "destructive"
          });
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      toast({
        title: "İzin Hatası",
        description: "Galeri izni alınamadı.",
        variant: "destructive"
      });
      return false;
    }
  };

  const selectFromGallery = async () => {
    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) return;

    try {
      if (Capacitor.isNativePlatform()) {
        const images = await CapacitorCamera.pickImages({
          quality: 90,
          limit: 5
        });
        
        const base64Images = images.photos.map(photo => `data:image/jpeg;base64,${photo.webPath}`);
        setSelectedImages(prev => [...prev, ...base64Images]);
      } else {
        // Fallback to file input for web
        fileInputRef.current?.click();
      }
    } catch (error) {
      console.error('Gallery selection error:', error);
      toast({
        title: "Galeri Hatası",
        description: "Fotoğraf seçiminde hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const takePicture = async () => {
    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) return;

    try {
      if (Capacitor.isNativePlatform()) {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        
        if (image.dataUrl) {
          setSelectedImages(prev => [...prev, image.dataUrl!]);
        }
      } else {
        // Fallback to file input for web
        fileInputRef.current?.click();
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Kamera Hatası",
        description: "Fotoğraf çekiminde hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setSelectedImages(prev => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && selectedImages.length === 0) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage || "Görsel analizi",
      timestamp: new Date(),
      images: selectedImages.length > 0 ? [...selectedImages] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setSelectedImages([]);
    setIsLoading(true);

    try {
      // Prepare messages for AI API
      const aiMessages: AIMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        images: msg.images
      }));
      aiMessages.push({ 
        role: 'user', 
        content: inputMessage || "Bu görseli analiz et ve stabilite açısından değerlendir",
        images: selectedImages.length > 0 ? selectedImages : undefined
      });

      const response = await callStabilityAssistant(aiMessages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Brain className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg">Stabilite Asistanı</h1>
          <p className="text-sm text-muted-foreground">Maritime AI Assistant</p>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-white dark:bg-gray-800 border shadow-sm'
                }`}
              >
                {/* Display images if present */}
                {message.images && message.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {message.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Uploaded image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-gray-800 border shadow-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Düşünüyor...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="max-w-4xl mx-auto">
          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Selected ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            {Capacitor.isNativePlatform() ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={selectFromGallery}
                  disabled={isLoading}
                  className="h-[50px] px-4"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={takePicture}
                  disabled={isLoading}
                  className="h-[50px] px-4"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-[50px] px-4"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Stabilite hakkında soru sorun veya görsel yükleyin..."
                className="min-h-[50px] resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && selectedImages.length === 0) || isLoading}
              size="lg"
              className="h-[50px] px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("GM hesabı nasıl yapılır?")}
              disabled={isLoading}
            >
              GM Hesabı
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("IMO stabilite kriterlerini açıkla")}
              disabled={isLoading}
            >
              IMO Kriterleri
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("TPC nedir ve nasıl hesaplanır?")}
              disabled={isLoading}
            >
              TPC Hesabı
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Gemi stabilitesi nedir?")}
              disabled={isLoading}
            >
              Stabilite Nedir?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}