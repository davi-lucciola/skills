import fs from "node:fs/promises";
import path from "node:path";

function errorCode(error: unknown): string | undefined {
  if (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

export function assertInside(parent: string, child: string): void {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  const escapes = relative.split(path.sep).includes("..");
  if (relative === "" || escapes || path.isAbsolute(relative)) {
    throw new Error(`Caminho fora do diretório permitido: ${child}`);
  }
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.stat(target);
    return true;
  } catch (error) {
    if (errorCode(error) === "ENOENT") return false;
    throw error;
  }
}

export async function installSkill({
  sourceDir,
  destRoot,
  name,
  overwrite,
}: {
  sourceDir: string;
  destRoot: string;
  name: string;
  overwrite: boolean;
}): Promise<{ status: "skipped" | "replaced" | "installed"; dest: string }> {
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
