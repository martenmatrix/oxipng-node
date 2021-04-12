import { join } from "path";
import BinWrapper from "bin-wrapper";

const OXIPNG_VERSION = "4.0.3";
const BASE_URL = "https://github.com/shssoichiro/oxipng/releases/download";

const bin = new BinWrapper()
  .src(
    `${BASE_URL}/v${OXIPNG_VERSION}/oxipng-${OXIPNG_VERSION}-x86_64-apple-darwin.tar.gz`,
    "darwin"
  )
  .src(
    `${BASE_URL}/v${OXIPNG_VERSION}/oxipng-${OXIPNG_VERSION}-x86_64-unknown-linux-musl.tar.gz`,
    "linux",
    "x64"
  )
  .src(
    `${BASE_URL}/v${OXIPNG_VERSION}/oxipng-${OXIPNG_VERSION}-x86_64-pc-windows-msvc.zip`,
    "win32",
    "x64"
  )
  .dest(join("vendor"))
  .use(process.platform === "win32" ? "oxipng.exe" : "oxipng")
  .version(`>=${OXIPNG_VERSION}`);

interface Options {
  path?: string;
  out?: string;
  alpha?: boolean;
  compression?: 1 | 2 | 3 | 4 | 5 | 6;
  interlacing?: boolean;
  strip?: "safe" | "all";
}

function transformOptions(params: Options): string[] {
  const args = [];

  if (params.compression) {
    let compression = Number(params.compression);
    compression = Number.isNaN(compression) ? 2 : compression;
    compression = Math.max(params.compression, 1);
    compression = Math.min(params.compression, 6);

    args.push("-o", String(compression));
  }

  if (params.interlacing) {
    args.push("-i", String(Boolean(params.interlacing)));
  }

  if (params.strip) {
    args.push("--strip", params.strip);
  }

  if (params.out) {
    args.push("--out", params.out);
  }

  if (params.alpha) {
    args.push("--alpha", String(Boolean(params.alpha)));
  }

  if (params.path) {
    args.push(params.path);
  }

  return args;
}

export function run(params: Options): Promise<void> {
  return bin.run(transformOptions(params));
}
