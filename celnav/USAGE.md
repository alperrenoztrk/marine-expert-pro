# CelNav CLI Quick Start

Angles: decimal degrees (East + longitude). Times: decimal hours or HH:MM[:SS].

## Install/Run

```bash
python3 -m celnav --help
```

## Sun Sight (AM/PM)

```bash
python3 -m celnav sun \
  --lat 37 --lon 25 \
  --gha 55 --dec 23.4333 \
  --hs 60.7667 --ie -2 --height 2 \
  --pressure 1010 --temp 15 --limb LL \
  --sd-min 15.8 --parallax-min 0.1
```

Expected-like output:
```
LHA: 30.00000°  (30° 00.00′)
Hc: 60.91804°  (60° 55.08′)
Zn: 109.29366°  (109° 17.62′)
Ho: 60.98870°  (60° 59.32′)
Intercept: 4.24′ toward
```

## Noon Sight

```bash
python3 -m celnav noon \
  --hs-noon 76.1667 --ie -2 --height 2 \
  --pressure 1010 --temp 15 --limb LL \
  --sd-min 15.8 --parallax-min 0.1 \
  --dec 23.4333 --sun-dir south --utc-lan 10:38:00
```

Expected-like output:
```
Ho (noon): 76.40639°  (76° 24.38′)
Latitude: 37.02691°  (37° 01.61′)
Longitude (East +): 20.50000°  (20° 30.00′)
```

## Fix from Multiple Sights (Sun/Stars)

Prepare a JSON array of sights with corrected altitude `Ho` (degrees). Longitude is East positive.

Example file `sights.json`:

```json
[
  { "body": "sun",  "lat": 36.0, "lon": 25.0, "GHA": 150.3333, "dec": 10.25, "Ho": 45.2467 },
  { "body": "star", "lat": 36.0, "lon": 25.0, "GHA_aries": 200.1000, "star": "Sirius", "Ho": 20.1333 }
]
```

Run:

```bash
python3 -m celnav fix --file sights.json
```

Or inline JSON:

```bash
python3 -m celnav fix --json '[{"body":"sun","lat":36,"lon":25,"GHA":150.3333,"dec":10.25,"Ho":45.2467},{"body":"star","lat":36,"lon":25,"GHA_aries":200.1,"star":"Sirius","Ho":20.1333}]'
```

Expected-like output:

```
Fix Latitude: 36.01234°  (36° 00.74′)
Fix Longitude (East +): 24.98765°  (24° 59.26′)
RMS residual: 2.10′ over 2 sights
```

## Star Sight

```bash
python3 -m celnav star \
  --lat 37 --lon 25 \
  --gha 123.45 --dec -16.7167 \
  --hs 28.5 --ie 0.0 --height 2 \
  --pressure 1015 --temp 10
```

## Moon Sight

```bash
python3 -m celnav moon \
  --lat 37 --lon 25 \
  --gha 210.0 --dec -5.5 \
  --hs 34.2 --ie -1.5 --height 2 \
  --pressure 1012 --temp 12 \
  --limb LL --sd-min 15.4 --hp-min 57.0
```

## Time Conversions

```bash
python3 -m celnav convert --mode utc-to-lmt --utc 10:38 --lon 20.5
python3 -m celnav convert --mode lmt-to-utc --lmt 12.50 --lon 20.5
```

## Equation of Time

```bash
python3 -m celnav eot --doy 172
```
