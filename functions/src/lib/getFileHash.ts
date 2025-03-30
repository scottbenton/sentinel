import crypto from "crypto";

export function getMD5Hash(buffer: Buffer): string {
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    return hash;
}
