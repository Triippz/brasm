import * as net from 'net';

export enum OsType {
  WINDOWS = 'WINDOWS',
  MAC = 'MAC',
  LINUX = 'LINUX',
  UNKNOWN = 'UNKNOWN',
}

function isPortAvailable(port: number) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.message === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

function getOsType(): OsType {
  switch (process.platform) {
    case 'win32':
      return OsType.WINDOWS;
    case 'darwin':
      return OsType.MAC;
    case 'linux':
      return OsType.LINUX;
    default:
      return OsType.UNKNOWN;
  }
}

export const SystemUtils = {
  isPortAvailable,
  getOsType,
};
