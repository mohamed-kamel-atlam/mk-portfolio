/**
 * Asset access layer (`@/shared/assets`) — the single import surface for every
 * static-asset path and image convention. Application code resolves paths here
 * instead of hardcoding strings, so `public/` can be reorganized in one place
 * and every image ships with consistent sizing/placeholder conventions.
 */
export { ASSET_DIR, assetPath, type AssetDir } from "./paths";
export {
  BLUR_DATA_URL,
  blurDataUrl,
  IMAGE_SIZES,
  PROFILE_IMAGE_SRC,
  placeholderImage,
  projectCover,
  projectLogo,
  projectGalleryImage,
  type ImageAsset,
  type ImageSizePreset,
} from "./images";
export { companyLogo, techLogo } from "./logos";
export { illustration, svgIcon } from "./icons";
