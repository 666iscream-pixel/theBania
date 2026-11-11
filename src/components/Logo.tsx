import { asset } from "@/lib/asset";
// Oryginalne logo z profilu (FB/Instagram), tło usunięte. Wersja jasna — na ciemne tła.
export function Logo({ size = 56, light = false }: { size?: number; light?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(light ? "/logo-light.png" : "/logo-dark.png")} alt="The Bania Wrocław" width={size} height={size} style={{ width: size, height: size }} />
  );
}
