import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chácara da Nega",
    short_name: "Chácara da Nega",
    description: "Reserve a Chácara da Nega direto pelo celular.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2f9e5c",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
