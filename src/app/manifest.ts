import type { MetadataRoute } from "next";

const LOGO_URL = "https://kmpegsmccgycgtwqnjpv.supabase.co/storage/v1/object/public/assets/ChatGPT%20Image%2016%20de%20set.%20de%202026,%2021_01_43.png";

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
      { src: LOGO_URL, sizes: "192x192", type: "image/png" },
      { src: LOGO_URL, sizes: "512x512", type: "image/png" },
    ],
  };
}
