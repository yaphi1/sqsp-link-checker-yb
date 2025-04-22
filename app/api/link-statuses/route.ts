import { CurlResult, LinkStatus } from '@/app/types';
import { exec } from 'child_process';
import { JSDOM } from 'jsdom';

async function curl(url: string) {
  return new Promise<CurlResult>((resolve) => {
    exec(`curl -sL ${url}`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log({ error, stderr });
        resolve({
          url,
          html: null,
        });
      }
      resolve({
        url,
        html: stdout,
      });
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

export async function GET() {
  const showcase = await curl('https://www.squarespace.com/showcase');
  if (!showcase.html) { return; }
  const dom = new JSDOM(showcase.html);
  const links = Array.from(dom.window.document.querySelectorAll('.category-websites__website--link a'));
  const linkUrls = links.map(link => link.getAttribute('href') ?? '');
  const linkStatuses = await getLinkStatuses(linkUrls);

  return Response.json({ linkStatuses });
}
