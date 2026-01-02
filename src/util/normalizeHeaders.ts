import { Request } from "express";

const normalizeHeaders = (req: Request) => {
  const enc = req.headers["accept-encoding"]?.trim();

  let acceptEnc = "identity";

  if (enc?.includes("br")) {
    acceptEnc = "br";
  } else if (enc?.includes("gzip")) {
    acceptEnc = "gzip";
  }

  const lang =
    req.headers["accept-language"]?.trim().split(",")[0].toLowerCase() || "en";
  const auth = req.headers["authorization"]?.trim() || "";

  const normHeaders = new Headers();

  normHeaders.set("accept-encoding", String(acceptEnc));
  normHeaders.set("accept-language", String(lang));
  normHeaders.set("authorization", String(auth));

  return normHeaders;
};

export default normalizeHeaders;
