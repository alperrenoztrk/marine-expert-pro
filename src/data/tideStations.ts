export type TideStation = {
  id: string;
  name: string;
  region: string;
  highTideOffset: number;
  tidalRange: string;
  factor: number;
  rangeM: number | null;
  timezoneLabel: string;
  locationUrl?: string;
};

export const tideStations: TideStation[] = [
  {
    id: "istanbul-bogazi",
    name: "İstanbul Boğazı",
    region: "Türkiye",
    highTideOffset: 2.5,
    tidalRange: "20-40 cm",
    factor: 0.4,
    rangeM: 0.3,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "izmir-korfezi",
    name: "İzmir Körfezi",
    region: "Türkiye",
    highTideOffset: 3.0,
    tidalRange: "15-30 cm",
    factor: 0.3,
    rangeM: 0.22,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "antalya",
    name: "Antalya",
    region: "Türkiye",
    highTideOffset: 2.8,
    tidalRange: "20-35 cm",
    factor: 0.35,
    rangeM: 0.28,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "mersin",
    name: "Mersin",
    region: "Türkiye",
    highTideOffset: 3.2,
    tidalRange: "15-25 cm",
    factor: 0.25,
    rangeM: 0.2,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "trabzon",
    name: "Trabzon",
    region: "Türkiye",
    highTideOffset: 2.0,
    tidalRange: "10-20 cm",
    factor: 0.2,
    rangeM: 0.15,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "canakkale-bogazi",
    name: "Çanakkale Boğazı",
    region: "Türkiye",
    highTideOffset: 2.3,
    tidalRange: "25-45 cm",
    factor: 0.45,
    rangeM: 0.35,
    timezoneLabel: "TRT (UTC+3)",
  },
  {
    id: "akdeniz-genel",
    name: "Akdeniz (Genel)",
    region: "Genel",
    highTideOffset: 3.0,
    tidalRange: "20-40 cm",
    factor: 0.4,
    rangeM: 0.3,
    timezoneLabel: "UTC+2",
  },
  {
    id: "karadeniz-genel",
    name: "Karadeniz (Genel)",
    region: "Genel",
    highTideOffset: 2.5,
    tidalRange: "10-25 cm",
    factor: 0.25,
    rangeM: 0.18,
    timezoneLabel: "UTC+3",
  },
  {
    id: "atlantik-kiyilari",
    name: "Atlantik Kıyıları",
    region: "Genel",
    highTideOffset: 1.5,
    tidalRange: "2-6 m",
    factor: 1.5,
    rangeM: 4,
    timezoneLabel: "UTC",
  },
  {
    id: "mans-denizi",
    name: "Manş Denizi",
    region: "Birleşik Krallık / Fransa",
    highTideOffset: 1.0,
    tidalRange: "4-12 m",
    factor: 2.5,
    rangeM: 8,
    timezoneLabel: "GMT",
  },
];

export type PortInfo = Pick<TideStation, "name" | "highTideOffset" | "tidalRange" | "factor">;

export const turkishPorts: PortInfo[] = tideStations
  .filter((station) => station.region === "Türkiye")
  .map(({ name, highTideOffset, tidalRange, factor }) => ({
    name,
    highTideOffset,
    tidalRange,
    factor,
  }));
