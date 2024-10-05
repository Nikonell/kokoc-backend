import { BunFile } from "bun";
import { NotFoundError } from "elysia";
import { mkdir } from "node:fs/promises";

const UPLOADS_PATH = '/uploads';

const getFile = async (path: string): Promise<BunFile | null> => {
    const file = Bun.file(path);
    return await file.exists() ? file : null;
};

export const getUpload = async (prefix: string, filename: string, defaultFilename?: string): Promise<BunFile> => {
    const requestedFile = await getFile(`${UPLOADS_PATH}/${prefix}/${filename}`);
    if (requestedFile) return requestedFile;

    if (defaultFilename) {
        const defaultFile = await getFile(`${UPLOADS_PATH}/${prefix}/${defaultFilename}`);
        if (defaultFile) return defaultFile;
    }

    throw new NotFoundError("File not found");
};

export const saveUpload = async (prefix: string, filename: string, file: File): Promise<void> => {
    const dir = `${UPLOADS_PATH}/${prefix}`;
    await mkdir(dir, { recursive: true });

    const bunfile = Bun.file(`${dir}/${filename}`);
    await Bun.write(bunfile, file);
}
