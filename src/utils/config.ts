import { readFileSync } from "fs";
import path from "path";

interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  main: string;
  scripts?: Record<string, string>;
  keywords?: string[];
  author?: string;
}

const readPackageInfo = (p?: string): PackageInfo => {
  const packagePath = p ?? path.join(__dirname, "..", "..", "package.json");
  const packageInfo = readFileSync(packagePath, { encoding: "utf-8" });
  const ret = JSON.parse(packageInfo) as PackageInfo;
  return ret;
};

export default readPackageInfo;
