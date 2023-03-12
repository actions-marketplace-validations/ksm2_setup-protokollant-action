import * as cache from '@actions/tool-cache';
import * as core from '@actions/core';
import styles from 'ansi-styles';
import path from 'node:path';
import { fetchLatestVersion } from './fetch';

const TOOL_NAME = 'protokollant';

async function main() {
  const specifiedVersion = core.getInput('version');
  const version = specifiedVersion || (await fetchLatestVersion());
  setVersion(version);

  const cachedPath = cache.find(TOOL_NAME, version);
  if (cachedPath) {
    core.info('Found in cache');
    setPath(cachedPath);
  } else {
    const os = getOS();
    const url = buildUrl(version, os, 'amd64');
    const archivePath = await cache.downloadTool(url);
    const extractedDir = await cache.extractTar(archivePath);
    const inCache = await cache.cacheDir(extractedDir, TOOL_NAME, version);
    core.addPath(inCache);
    const exePath = path.resolve(inCache, 'protokollant');
    setPath(exePath);
  }
}

function getOS(): string {
  switch (process.platform) {
    case 'darwin': {
      return 'darwin';
    }
    case 'win32': {
      return 'windows';
    }
    case 'linux': {
      return 'linux';
    }
    default: {
      throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }
}

function setVersion(version: string): void {
  core.info(`Using Protokollant version ${styles.color.cyan.open}v${version}${styles.color.close}`);
  core.setOutput('version', version);
}

function setPath(exePath: string): void {
  core.info(`Protokollant is located at ${styles.color.cyan.open}${exePath}${styles.color.close}`);
  core.setOutput('path', exePath);
}

function buildUrl(version: string, os: string, platform: string): string {
  const archive = os === 'windows' ? 'zip' : 'tar.gz';
  return `https://github.com/ksm2/protokollant/releases/download/v${version}/protokollant-v${version}-${os}-${platform}.${archive}`;
}

main().catch((error) => {
  core.setFailed(error.message);
});
