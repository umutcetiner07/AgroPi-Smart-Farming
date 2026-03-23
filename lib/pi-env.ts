/**
 * Pi REST API (`Authorization: Key …`) için sunucu anahtarı.
 * Developer Portal’da genelde “API Key” ile eşleşir; yoksa `PI_APP_SECRET` kullanılır.
 */
export function getPiServerAuthorizationKey(): string | undefined {
  const key =
    process.env.PI_API_KEY?.trim() || process.env.PI_APP_SECRET?.trim();
  return key || undefined;
}
