import * as http from '@actions/http-client';

const API_URL = 'https://api.github.com/repos/ksm2/protokollant/releases/latest';

const httpClient = new http.HttpClient('Setup Protokollant');

export async function fetchLatestVersion(): Promise<string> {
  const response = await httpClient.get(API_URL);
  const body = await response.readBody();
  const release = JSON.parse(body);
  const tagName = release.tag_name;
  const version = parseTag(tagName);

  return version;
}

function parseTag(tag: string): string {
  const match = tag.match(/^v(\d+\.\d+.\d+)$/);
  if (match) {
    return match[1];
  }
  throw new Error(`Failed to parse tag: ${tag}`);
}
