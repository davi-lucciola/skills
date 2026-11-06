import fs from "node:fs/promises";
import path from "node:path";

export function assertInside(parent, child) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  const escapes = relative.split(path.sep).includes("..");
  if (relative === "" || escapes || path.isAbsolute(relative)) {
    throw new Error(`Caminho fora do diretório permitido: ${child}`);
  }
}

export async function pathExists(target) {
  try {
    await fs.stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function installSkill({ sourceDir, destRoot, name, overwrite }) {
  const dest = path.resolve(destRoot, name);
  assertInside(destRoot, dest);

  const exists = await pathExists(dest);
  if (exists && !overwrite) {
    return { status: "skipped", dest };
  }

  await fs.mkdir(destRoot, { recursive: true });
  if (exists) {
    await fs.rm(dest, { recursive: true, force: true });
  }
  await fs.cp(sourceDir, dest, { recursive: true });
  return { status: exists ? "replaced" : "installed", dest };
}
