import type { Request } from "express";

const normalizeHeaders = (req: Request): Headers => {
  const enc = req.headers["accept-encoding"]?.toLowerCase();

  let acceptEnc = "identity";

  if (enc?.includes("br")) acceptEnc = "br";
  else if (enc?.includes("gzip")) acceptEnc = "gzip";

  const rawLang = req.headers["accept-language"];

  const lang =
    (Array.isArray(rawLang) ? rawLang[0] : rawLang)
      ?.trim()
      .toLocaleLowerCase()
      .split(",")[0] || "en";

  const auth = req.headers["authorization"] || "";

  const norm = new Headers();

  norm.set("accept-encoding", acceptEnc);
  norm.set("accept-language", lang);
  norm.set("authorization", auth);

  return norm;
};

export default normalizeHeaders;
