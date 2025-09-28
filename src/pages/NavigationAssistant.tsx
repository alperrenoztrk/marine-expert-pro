import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Compass, MessageCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavigationAssistantPopup from "@/components/NavigationAssistantPopup";

export default function NavigationAssistantPage(){
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
    const canGoBack = (window.history?.length || 0) > 1 && location.key !== 'default';
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/navigation');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            <span data-translatable>Geri</span>
          </Button>
          <Link to="/navigation-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Geri</span>
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              <span data-translatable>Seyir Asistanı</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gerçek seyir asistanı ile hızlı hesap ve öneriler
          </p>
        </div>

        <Card className="shadow border border-emerald-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <MessageCircle className="h-5 w-5" />
              <span data-translatable>Sohbet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NavigationAssistantPopup variant="inline" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

