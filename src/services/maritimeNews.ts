import { supabase } from "@/integrations/supabase/client";

export type MaritimeNewsItem = {
  title: string;
  link: string;
  publishedAt?: string;
  source: string;
  summary?: string;
};

export type MaritimeNewsResponse = {
  fetchedAt: string;
  items: MaritimeNewsItem[];
  sources?: Array<{ id: string; name: string; url: string }>;
  errors?: Array<{ source: string; error: string }>;
};

export async function fetchMaritimeNews(limit = 30): Promise<MaritimeNewsResponse> {
  const { data, error } = await supabase.functions.invoke("maritime-news", {
    body: { limit },
  });

  if (error) throw error;
  return data as MaritimeNewsResponse;
}
