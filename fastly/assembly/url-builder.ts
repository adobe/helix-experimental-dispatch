import { PathInfo } from "./path-info";
import { URL } from "./url";

export class URLBuilder {
  protected baseURL = "https://adobeioruntime.net/api/v1/web/";
  protected namespace = "helix";
  protected static = "helix-services/static@v1";
  protected redirect = "helix-services/redirect@v1";
  protected contentOpts: Map<string, string>;
  protected staticOpts: Map<string, string>;
  protected rootPath = "";
  protected pack = "default";

  constructor(contentOpts: Map<string, string>, staticOpts: Map<string, string>, root: string, pack: string) {
    this.contentOpts = contentOpts;
    this.staticOpts = staticOpts;
    this.rootPath = root;
    this.pack = pack;
  }

  build404URLs(infos: PathInfo[]): Set<string> {
    const urls = new Set<string>();

    if (infos.length > 0 && infos[0].extension == "html") {
      urls.add(new URL(this.baseURL)
        .append(this.namespace)
        .append(this.static)
        .appendParam("path", "/404.html")
        .appendParam("esi", "false")
        .appendParam("plain", "true")
        .appendParams(this.contentOpts)
        .toString());
    }

    urls.add(new URL(this.baseURL)
      .append(this.namespace)
      .append(this.static)
      .appendParam("path", "/404.html")
      .appendParam("esi", "false")
      .appendParam("plain", "true")
      .appendParams(this.staticOpts)
      .toString());

    return urls;
  }

  buildFallbackURLs(infos: PathInfo[]): Set<string> {
    const urls = new Set<string>();
    for (let i = 0; i < infos.length; i++) {
      urls.add(new URL(this.baseURL)
        .append(this.namespace)
        .append(this.static)
        .appendParam("path", infos[i].path)
        .appendParam("esi", "false")
        .appendParam("plain", "true")
        .appendParams(this.staticOpts)
        .toString());
    }
    return urls;
  }

  buildActionURLs(infos: PathInfo[]): Set<string> {
    const urls = new Set<string>();
    for (let i = 0; i < infos.length; i++) {
      let actionname = infos[i].extension;
      if (infos[i].selector != "") {
        actionname = infos[i].selector + "_" + infos[i].extension;
      }

      urls.add(new URL(this.baseURL)
        .append(this.namespace)
        .append(this.pack)
        .append(actionname)
        .appendParam("path", infos[i].relativePath + ".md")
        .appendParam("rootPath", this.rootPath)
        .appendParams(this.contentOpts)
        .toString());
    }
    return urls;
  }

  buildRawURLs(infos: PathInfo[]): Set<string> {
    const urls = new Set<string>();
    for (let i = 0; i < infos.length; i++) {
      urls.add(new URL(this.baseURL)
        .append(this.namespace)
        .append(this.static)
        .appendParam("path", infos[i].path)
        .appendParam("esi", "false")
        .appendParam("plain", "true")
        .appendParam("root", this.rootPath)
        .appendParams(this.contentOpts)
        .toString());
    }
    return urls;
  }

  buildRedirectURLs(path: string): Set<string> {
    const urls = new Set<string>();
    urls.add(new URL(this.baseURL)
      .append(this.namespace)
      .append(this.redirect)
      .appendParam("path", path)
      .appendParams(this.contentOpts)
      .toString());
    return urls;
  }
}