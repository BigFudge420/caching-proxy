const normalizeHeaders = (headers: Headers): Headers => {
  const enc = headers.get("accept-encoding")?.trim();

  let acceptEnc = "identity";

  if (enc?.includes("br")) {
    acceptEnc = "br";
  } else if (enc?.includes("gzip")) {
    acceptEnc = "gzip";
  }

  const lang =
    headers.get("accept-language")?.trim().split(",")[0].toLowerCase() || "en";
  const auth = headers.get("authorization") || "";

  const normHeaders = new Headers();

  normHeaders.set("accept-encoding", String(acceptEnc));
  normHeaders.set("accept-language", String(lang));
  normHeaders.set("authorization", String(auth));

  return normHeaders;
};

export default normalizeHeaders;
