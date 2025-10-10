#!/usr/bin/env node
import https from 'https';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function encodeQuery(q) {
  return encodeURIComponent(q);
}

async function getPublicDomainImageUrl(query) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeQuery(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url%7Cextmetadata&format=json&origin=*`;
  const json = await fetchJson(api);
  if (!json.query || !json.query.pages) return null;
  const pages = Object.values(json.query.pages);
  for (const page of pages) {
    const info = page.imageinfo && page.imageinfo[0];
    if (!info || !info.extmetadata) continue;
    const md = info.extmetadata;
    const license = (md.LicenseShortName && md.LicenseShortName.value || '').toLowerCase();
    const usageTerms = (md.UsageTerms && md.UsageTerms.value || '').toLowerCase();
    if (license.includes('public domain') || license.includes('cc0')) {
      return info.url;
    }
    // Some NOAA/NASA files may indicate PD in UsageTerms
    if (usageTerms.includes('public domain')) {
      return info.url;
    }
  }
  return null;
}

async function main() {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    console.error('Usage: fetch_commons_pd_url.mjs <search query>');
    process.exit(1);
  }
  try {
    const url = await getPublicDomainImageUrl(query);
    if (!url) {
      process.exitCode = 2;
      return;
    }
    process.stdout.write(url);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

main();
