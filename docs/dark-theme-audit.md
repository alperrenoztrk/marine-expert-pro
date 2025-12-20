# Dark Theme Compatibility Audit

A review of the UI identified the following areas that currently ignore the dark theme palette and remain styled with light-only colors:

- **Göksel Hesaplamalar** (`src/pages/CelestialCalculations.tsx`): Tab headers and both calculation cards are set to `bg-white/80` and `bg-white/90` with white borders, leaving them bright in dark mode because no `dark:` overrides are provided.【F:src/pages/CelestialCalculations.tsx†L150-L183】
- **Meteoroloji Konu Anlatımı** (`src/pages/DetailedMeteorology.tsx`): The `getSafetyColor` helper returns only light badge styles (e.g., `bg-green-100 text-green-800`), so safety labels stay light on dark backgrounds.【F:src/pages/DetailedMeteorology.tsx†L396-L404】
- **Makine Hesaplamaları** (`src/pages/MachineCalculationsPage.tsx`): The outer `Card` uses a translucent white background and border without any dark theme variant, causing a stark light block in dark mode.【F:src/pages/MachineCalculationsPage.tsx†L10-L26】
- **Gemicilik Hesaplamaları** (`src/pages/SeamanshipCalculations.tsx`): All three cards and their result callouts rely on white or `blue-50` backgrounds with light text, lacking dark-theme alternatives.【F:src/pages/SeamanshipCalculations.tsx†L38-L150】
- **Hidrostatik Hesaplamalar** (`src/pages/Hydrostatics.tsx`): Draft survey and Bonjean results render inside `bg-gray-50` panels with gray headings, which do not adapt to dark mode.【F:src/pages/Hydrostatics.tsx†L250-L432】
- **SOLAS Yönetmelikleri** (`src/pages/Regulations.tsx`): Category badge colors default to light background/text combinations (e.g., `bg-blue-100 text-blue-800`) without `dark:` variants for most categories, leaving badges washed out on dark theme.【F:src/pages/Regulations.tsx†L281-L292】
- **COLREG Sunum Görüntüleyici** (`src/pages/COLREGPresentation.tsx`): The PDF viewer container is fixed to a white background with dark text styles and no dark-mode overrides.【F:src/pages/COLREGPresentation.tsx†L71-L94】
- **Dil Hata Ayıklama Aracı** (`src/components/ui/language-debug.tsx`): Stored language debug block uses `bg-gray-100` with no dark variant, making it bright in dark theme panels.【F:src/components/ui/language-debug.tsx†L100-L105】
- **Kalıcı AI Asistanı** (`src/components/PermanentAIAssistant.tsx`): The AI response panel uses a light gradient (`from-blue-50 to-indigo-50`) and light text without dark styling, so it clashes with dark backgrounds.【F:src/components/PermanentAIAssistant.tsx†L344-L350】

These areas need theme-aware styling (e.g., `dark:` Tailwind variants or CSS variables) to ensure consistent dark mode rendering.
