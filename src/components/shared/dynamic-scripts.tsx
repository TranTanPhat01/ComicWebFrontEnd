"use client";

import { useEffect } from "react";
import { getPublicSettingsBrowser } from "@/features/public-chapters/api/public-chapters-browser.api";

export function DynamicScripts() {
  useEffect(() => {
    // Chỉ chạy ở client và chỉ chạy 1 lần duy nhất
    if (typeof window === "undefined" || (window as any).__scripts_loaded) return;
    (window as any).__scripts_loaded = true;

    async function injectScripts() {
      try {
        const res = await getPublicSettingsBrowser();
        if (!res.success || !res.data) return;

        const headScripts = res.data.find(x => x.key === "GlobalHeadScripts")?.value || "";
        const bodyScripts = res.data.find(x => x.key === "GlobalBodyScripts")?.value || "";
        const metaTags = res.data.find(x => x.key === "CustomMetaTags")?.value || "";

        // Helper: Inject HTML string vào head
        if (headScripts.trim()) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = headScripts;
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (el.tagName.toLowerCase() === "script") {
                const script = document.createElement("script");
                Array.from(el.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
                script.innerHTML = el.innerHTML;
                document.head.appendChild(script);
              } else {
                document.head.appendChild(el.cloneNode(true));
              }
            }
          });
        }

        // Helper: Inject Meta tags vào head
        if (metaTags.trim()) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = metaTags;
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              document.head.appendChild(node.cloneNode(true));
            }
          });
        }

        // Helper: Inject HTML string vào body
        if (bodyScripts.trim()) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = bodyScripts;
          Array.from(tempDiv.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (el.tagName.toLowerCase() === "script") {
                const script = document.createElement("script");
                Array.from(el.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
                script.innerHTML = el.innerHTML;
                document.body.appendChild(script);
              } else {
                document.body.appendChild(el.cloneNode(true));
              }
            }
          });
        }
      } catch (e) {
        console.error("Failed to inject custom settings scripts", e);
      }
    }

    void injectScripts();
  }, []);

  return null;
}
