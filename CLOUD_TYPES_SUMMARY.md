# Cloud Types Summary - Bulut Türleri Özeti

This document summarizes all cloud types implemented in the Weather Calculations component.

## Low Clouds (Alçak Bulutlar) - 0-2000m

### CH 0: Stratus (St)
- **Description**: Low flat gray layer clouds and fog
- **Maritime Importance**: Poor visibility, risk of fog
- **Visibility**: Poor to very poor (1-5 nm)
- **Wind**: Light to moderate (5-15 knot)
- **Precipitation**: Light drizzle possible

### CH 1: Cumulus (Cu)
- **Description**: Fair weather puffy white clouds
- **Maritime Importance**: Good weather indicator
- **Visibility**: Excellent (10+ nm)
- **Wind**: Light to moderate (5-20 knot)
- **Precipitation**: None

### CH 2: Stratocumulus (Sc)
- **Description**: Low layered lumpy clouds
- **Maritime Importance**: Weather changing indicator
- **Visibility**: Moderate (5-10 nm)
- **Wind**: Moderate (10-25 knot)
- **Precipitation**: Light showers possible

### CH 3: Cumulonimbus (Cb)
- **Description**: Dangerous thunderstorm clouds with anvil shape
- **Maritime Importance**: ⚠️ EXTREME DANGER - Thunderstorms
- **Visibility**: Very poor (<2 nm)
- **Wind**: Severe gusts (30-60+ knot)
- **Precipitation**: Heavy rain, hail, lightning

## Medium Level Clouds (Orta Bulutlar) - 2000-6000m

### CH 4: Altocumulus (Ac)
- **Description**: Mid-level patchy clouds
- **Maritime Importance**: Weather change in 24-48 hours
- **Visibility**: Good (8-15 nm)
- **Wind**: Moderate (15-25 knot)
- **Precipitation**: Light showers if thickening

### CH 5: Altostratus (As)
- **Description**: Gray mid-level layer covering sun
- **Maritime Importance**: Systematic rain approaching
- **Visibility**: Moderate (5-10 nm)
- **Wind**: Strong (15-30 knot)
- **Precipitation**: Rain certain in 12-24 hours

### Special: Nimbostratus (Ns)
- **Description**: Dark rain-bearing cloud layer
- **Maritime Importance**: Continuous rain, poor visibility conditions
- **Visibility**: Very poor (1-3 nm)
- **Wind**: Moderate to strong (15-30 knot)
- **Precipitation**: Continuous, moderate to heavy

## High Clouds (Yüksek Bulutlar) - 6000-12000m

### CH 6-7: Cirrus (Ci)
- **Description**: High wispy ice crystal clouds
- **Maritime Importance**: Weather deterioration in 48-72 hours
- **Visibility**: Excellent (15+ nm)
- **Wind**: Light (5-15 knot)
- **Precipitation**: None, but approaching

### CH 7: Cirrus spissatus (Ci sp)
- **Description**: Thick dense cirrus clouds
- **Maritime Importance**: Approaching frontal system, weather deteriorating
- **Visibility**: Good but decreasing rapidly (10-15 nm)
- **Wind**: Strengthening (20-30 knot)
- **Precipitation**: Starts within 12-24 hours

### CH 8: Cirrocumulus (Cc)
- **Description**: High patchy mackerel sky ("Balık pulu")
- **Maritime Importance**: "Mackerel sky" - weather change
- **Visibility**: Good (10-20 nm)
- **Wind**: Increasing (15-25 knot)
- **Precipitation**: Within 24-48 hours

### CH 9: Cirrostratus (Cs)
- **Description**: High thin layer with sun/moon halo
- **Maritime Importance**: Sun/moon halo - storm approaching
- **Visibility**: Good but decreasing (8-15 nm)
- **Wind**: Strengthening (20-35 knot)
- **Precipitation**: Certain within 12-36 hours

## Special Cloud Formations (Özel Bulut Formasyonları)

### Mammatus
- **Description**: Pouch-like cloud formations
- **Maritime Importance**: ⚠️ Severe turbulence
- **Visibility**: Variable (1-5 nm)
- **Wind**: Very variable (0-50 knot)
- **Danger**: Sudden wind changes

### Wall Cloud (Duvar Bulutu)
- **Description**: Rotating wall, tornado precursor
- **Maritime Importance**: ⚠️ Tornado/waterspout danger
- **Visibility**: Very poor (<1 nm)
- **Wind**: Rotating, severe (40+ knot)
- **Danger**: Waterspout possibility

### Shelf Cloud (Raf Bulutu)
- **Description**: Squall line leading edge
- **Maritime Importance**: Squall line approaching
- **Visibility**: Rapidly decreasing (5→<1 nm)
- **Wind**: Sudden increase (15→40 knot)
- **Precipitation**: Starts suddenly, heavy

### Lenticular (Mercek Bulutu)
- **Description**: Mountain wave clouds, lens-shaped
- **Maritime Importance**: Strong wind waves
- **Visibility**: Good (10+ nm)
- **Wind**: Very strong upper winds
- **Note**: Caution near mountainous coasts

### Fog (Sis)
- **Description**: Ground level cloud reducing visibility
- **Maritime Importance**: ⚠️ Collision risk, navigation danger
- **Visibility**: Very dangerous (<0.5 nm)
- **Wind**: Generally calm (<5 knot)
- **Danger**: Use fog horn, monitor radar

### Towering Cumulus (TCu)
- **Description**: Tall developing cumulus, CB precursor
- **Maritime Importance**: Thunderstorm imminent
- **Visibility**: Good but variable (5-10 nm)
- **Wind**: Variable, sudden increases (10-30 knot)
- **Precipitation**: Heavy showers in 30-60 minutes

## Maritime Sayings (Denizcilerin Deyişleri)

- "Uskumru gökyüzü, denizci döver karısını" - Mackerel sky (Cirrocumulus) indicates bad weather approaching
- "Güneş halesi, fırtına habercisi" - Sun halo (Cirrostratus) predicts storm

## Safety Notes

1. Always monitor cloud development patterns
2. Multiple cloud types can indicate complex weather systems
3. Pay special attention to rapid cloud changes
4. Use all available weather information sources
5. When in doubt, seek safe harbor

## Image Sources

- Local images stored in `/src/assets/weather/`
- External images from NOAA Weather Service
- All images have fallback gradients for offline use