const malePic = "/avatar-male.jpg";
const femalePic = "/avatar-female.jpg";

export function contestantImageSrc(
  picture: string | null | undefined,
  gender: string | null | undefined,
  appUrl?: string,
) {
  const fallback = gender?.toLowerCase() === "male" ? malePic : femalePic;
  if (!picture) return fallback;
  if (/^https?:\/\//i.test(picture)) return picture;

  const normalizedPath = picture.startsWith("/") ? picture : `/${picture}`;
  return appUrl ? `${appUrl}${normalizedPath}` : normalizedPath;
}
