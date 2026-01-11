const normalizeURL = (urlStr: string): string => {
  const url = new URL(urlStr);

  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();

  if (
    (url.protocol === "http:" && url.port === "80") ||
    (url.protocol === "https:" && url.port === "443")
  ) {
    url.port = "";
  }

  let pathname = url.pathname.replace(/\/{2,}/g, "/");

  const segments: string[] = [];
  for (const part of pathname.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") segments.pop();
    else segments.push(part);
  }

  pathname = "/" + segments.join("/");
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  url.pathname = pathname;

  const params: Array<[string, string]> = [];

  url.searchParams.forEach((value, key) => {
    if (value === "") return;
    params.push([key, value]);
  });

  params.sort(
    ([ak, av], [bk, bv]) => ak.localeCompare(bk) || av.localeCompare(bv)
  );

  url.search = params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  url.search = url.search.replace(/\+/g, "%20");

  url.hash = "";

  return url.toString();
};

export default normalizeURL;
