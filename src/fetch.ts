import * as http from '@actions/http-client';

const API_URL = 'https://api.github.com/repos/ksm2/protokollant/releases/latest';

const httpClient = new http.HttpClient('Setup Protokollant');

export async function fetchLatestVersion(): Promise<string> {
  try {
    const response = await httpClient.get(API_URL);
    const body = await response.readBody();
    const release = JSON.parse(body);
    const version = parseTag(extractVersion(release));

    return version;
  } catch (error) {
    throw new Error(`Failed to fetch latest version: ${(error as Error).message}`);
  }
}

function extractVersion(release: any): string {
  if (typeof release.tag_name !== 'string') {
    throw new Error(`Invalid release: ${JSON.stringify(release)}`);
  }
  return release.tag_name;
}

function parseTag(tag: string): string {
  const match = tag.match(/^v(\d+\.\d+.\d+)$/);
  if (match) {
    return match[1];
  }
  throw new Error(`Failed to parse tag: ${tag}`);
}
