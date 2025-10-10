import React from 'react';
import { Link } from 'react-router-dom';
import KnotViewer from '@/components/KnotViewer';
import Knot3DViewer from '@/components/Knot3DViewer';
import KnotBabylonViewer from '@/components/KnotBabylonViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Import raw SVGs so we can inject and control animations
import bowlineSvg from '@/assets/knots/authentic/bowline-authentic.svg?raw';
import cloveHitchSvg from '@/assets/knots/authentic/clove-hitch-authentic.svg?raw';
import reefKnotSvg from '@/assets/knots/authentic/reef-knot-authentic.svg?raw';
import figureEightSvg from '@/assets/knots/authentic/figure-eight-authentic.svg?raw';
import anchorBendSvg from '@/assets/knots/authentic/anchor-bend-authentic.svg?raw';
import sheetBendSvg from '@/assets/knots/authentic/sheet-bend-authentic.svg?raw';
import carrickBendSvg from '@/assets/knots/authentic/carrick-bend-authentic.svg?raw';
import cleatHitchSvg from '@/assets/knots/authentic/cleat-hitch-authentic.svg?raw';
import chainKnotSvg from '@/assets/knots/authentic/chain-knot-authentic.svg?raw';
import fishermansKnotSvg from '@/assets/knots/authentic/fishermans-knot-authentic.svg?raw';
import overhandKnotSvg from '@/assets/knots/authentic/overhand-knot-authentic.svg?raw';
import rollingHitchSvg from '@/assets/knots/authentic/rolling-hitch-authentic.svg?raw';
import roundTurnSvg from '@/assets/knots/authentic/round-turn-authentic.svg?raw';
import timberHitchSvg from '@/assets/knots/authentic/timber-hitch-authentic.svg?raw';

export default function SailorKnotsPage() {
  const [mode3D, setMode3D] = React.useState(false);
  const knots = [
    { title: 'Bowline (İzbarço Bağı)', svg: bowlineSvg },
    { title: 'Clove Hitch (Kazık Bağı)', svg: cloveHitchSvg },
    { title: 'Reef Knot (Camadan Bağı)', svg: reefKnotSvg },
    { title: 'Figure-Eight (Sekizli Bağı)', svg: figureEightSvg },
    { title: 'Anchor Bend (Kanca Bağı)', svg: anchorBendSvg },
    { title: 'Sheet Bend (Dülger Bağı)', svg: sheetBendSvg },
    { title: 'Carrick Bend (Kral Bağı)', svg: carrickBendSvg },
    { title: 'Cleat Hitch (Palamar Bağı)', svg: cleatHitchSvg },
    { title: 'Chain Knot (Zincir Bağı)', svg: chainKnotSvg },
    { title: "Fisherman's Knot (Balıkçı Düğümü)", svg: fishermansKnotSvg },
    { title: 'Overhand Knot (Basit Düğüm)', svg: overhandKnotSvg },
    { title: 'Rolling Hitch (Sürme Bağı)', svg: rollingHitchSvg },
    { title: 'Round Turn (Bir Tur Bağı)', svg: roundTurnSvg },
    { title: 'Timber Hitch (Kütük Bağı)', svg: timberHitchSvg },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" data-no-translate>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/seamanship-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Gemici Bağları (Animasyonlu)</h1>
          <div className="flex items-center gap-2">
            <Button variant={mode3D ? 'secondary' : 'outline'} size="sm" onClick={() => setMode3D(false)}>2D SVG</Button>
            <Button variant={mode3D ? 'outline' : 'secondary'} size="sm" onClick={() => setMode3D(true)}>3D (Beta)</Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {mode3D
            ? '3D (beta): Bowline, Sekizli ve Kazık bağında fizik tabanlı daha gerçekçi ip davranışı.'
            : '2D SVG: Eğitim amaçlı animasyonlar. Geliştirilmiş hız ve gerçekçilik seçenekleri mevcut.'}
        </p>

        {mode3D ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Three.js version */}
            <Knot3DViewer title="Bowline (İzbarço Bağı) — Three.js" knot="bowline" />
            <Knot3DViewer title="Figure-Eight (Sekizli Bağı) — Three.js" knot="figure-eight" />
            {/* Babylon.js version */}
            <KnotBabylonViewer title="Bowline (İzbarço Bağı) — Babylon" knot="bowline" />
            <KnotBabylonViewer title="Clove Hitch (Kazık Bağı) — Babylon" knot="clove-hitch" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knots.map((k) => (
              <KnotViewer key={k.title} title={k.title} svgHtml={k.svg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
