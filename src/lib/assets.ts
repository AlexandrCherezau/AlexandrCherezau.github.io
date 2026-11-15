/** Prefix for files in /public when the site is deployed under a sub-path. Kept JSON-free for client bundles. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const SCENE_ASSETS = {
  glb: "/3d/keycap.glb",
  atlas: "/3d/glyphs.webp",
} as const;
