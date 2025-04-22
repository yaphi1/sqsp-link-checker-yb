import { CurlResult, LinkStatus } from '@/app/types';
import { validateUrl } from '@the-node-forge/url-validator';
import { exec } from 'child_process';
import { JSDOM } from 'jsdom';
import { NextRequest } from 'next/server';

async function curl(url: string) {
  return new Promise<CurlResult>((resolve) => {
    const isUrlValid = validateUrl(url);
    if (!isUrlValid) {
      console.error('Invalid url:', url);
      resolve({ url: '', html: null });
    }

    exec(`curl -sL ${url}`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error({ error, stderr });
        resolve({ url, html: null });
      }
      resolve({ url, html: stdout });
    });
  });
}

function curlMultipleUrls(urls: Array<string>) {
  return Promise.all(urls.map(url => curl(url)));
}

function isSquarespaceSite(html: string | null) {
  const isSquarespace = Boolean(html && (/<!-- This is Squarespace\. -->/i).test(html));
  return isSquarespace;
}

function getLinkStatusFromCurlResult(curlResult: CurlResult) {
  const linkStatus: LinkStatus = {
    url: curlResult.url,
    isSquarespaceSite: isSquarespaceSite(curlResult.html),
  };
  return linkStatus;
}

async function getLinkStatuses(urls: Array<string>) {
  const curlResults = await curlMultipleUrls(urls);
  const linkStatuses = curlResults.map(getLinkStatusFromCurlResult);

  return linkStatuses;
}

type CacheData = {
  lastUpdatedTimestampInMs: number,
  linkStatuses: Array<LinkStatus>,
};

type Cache = {
  data: CacheData | null,
  get: () => CacheData | null,
  set: (data: CacheData) => void,
};

const cache: Cache = {
  data: null,
  get() {
    return cache.data;
  },
  set(data) {
    cache.data = data;
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shouldUseCache = !searchParams.has('bustCache');
  if (shouldUseCache && cache.data) {
    return Response.json(cache.data);
  }

  const showcase = await curl('https://www.squarespace.com/showcase');
  if (!showcase.html) { return; }
  const dom = new JSDOM(showcase.html);
  const links = Array.from(dom.window.document.querySelectorAll('.category-websites__website--link a'));
  const linkUrls = links.map(link => link.getAttribute('href') ?? '');
  const linkStatuses = await getLinkStatuses(linkUrls);
  const lastUpdatedTimestampInMs = Date.now();
  const linkStatusData = { lastUpdatedTimestampInMs, linkStatuses };

  cache.set(linkStatusData);

  return Response.json(linkStatusData);
}
