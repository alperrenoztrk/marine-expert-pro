import React from 'react';
import Knot3DViewer from '@/components/Knot3DViewer';
import KnotBabylonViewer from '@/components/KnotBabylonViewer';

export default function SailorKnotsPage() {

  return (
    <div className="min-h-screen p-4 md:p-8" data-no-translate>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Gemici Bağları — 3D</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          3D (beta): Bowline, Sekizli ve Kazık bağında fizik tabanlı daha gerçekçi ip davranışı.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Three.js version */}
          <Knot3DViewer title="Bowline (İzbarço Bağı) — Three.js" knot="bowline" />
          <Knot3DViewer title="Figure-Eight (Sekizli Bağı) — Three.js" knot="figure-eight" />
          {/* Babylon.js version */}
          <KnotBabylonViewer title="Bowline (İzbarço Bağı) — Babylon" knot="bowline" />
          <KnotBabylonViewer title="Clove Hitch (Kazık Bağı) — Babylon" knot="clove-hitch" />
        </div>
      </div>
    </div>
  );
}
