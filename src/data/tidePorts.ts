export type TidePort = {
  id: string;
  name: string;
  region?: string;
  country?: string;
};

export const tidePorts: TidePort[] = [
  { id: "istanbul-tr", name: "İstanbul", region: "Marmara", country: "Türkiye" },
  { id: "izmir-tr", name: "İzmir", region: "Ege", country: "Türkiye" },
  { id: "mersin-tr", name: "Mersin", region: "Akdeniz", country: "Türkiye" },
  { id: "gemlik-tr", name: "Gemlik", region: "Marmara", country: "Türkiye" },
  { id: "rotterdam-nl", name: "Rotterdam", country: "Hollanda" },
  { id: "hamburg-de", name: "Hamburg", country: "Almanya" },
  { id: "piraeus-gr", name: "Pire (Piraeus)", country: "Yunanistan" },
  { id: "valencia-es", name: "Valencia", country: "İspanya" },
  { id: "marseille-fr", name: "Marsilya", country: "Fransa" },
  { id: "london-uk", name: "London", country: "Birleşik Krallık" },
  { id: "new-york-us", name: "New York", country: "ABD" },
  { id: "los-angeles-us", name: "Los Angeles", country: "ABD" },
  { id: "vancouver-ca", name: "Vancouver", country: "Kanada" },
  { id: "santos-br", name: "Santos", country: "Brezilya" },
  { id: "durban-za", name: "Durban", country: "Güney Afrika" },
  { id: "alexandria-eg", name: "İskenderiye", country: "Mısır" },
  { id: "singapore-sg", name: "Singapore", country: "Singapur" },
  { id: "shanghai-cn", name: "Shanghai", country: "Çin" },
  { id: "busan-kr", name: "Busan", country: "Güney Kore" },
  { id: "yokohama-jp", name: "Yokohama", country: "Japonya" },
  { id: "sydney-au", name: "Sydney", country: "Avustralya" },
];
