import en from "@/locales/en.json" assert { type: "json" };
import ur from "@/locales/ur.json" assert { type: "json" };
import fr from "@/locales/fr.json" assert { type: "json" };
import ar from "@/locales/ar.json" assert { type: "json" };

export type Language = "EN" | "UR" | "FR" | "AR";

const baseEn: Record<string, string> = en as Record<string, string>;
const maps: Record<Language, Record<string, string>> = {
	EN: baseEn,
	UR: { ...(en as Record<string, string>), ...(ur as Record<string, string>) },
	FR: { ...(en as Record<string, string>), ...(fr as Record<string, string>) },
	AR: { ...(en as Record<string, string>), ...(ar as Record<string, string>) },
};

export function getDictionary(lang: Language): Record<string, string> {
	return maps[lang] || baseEn;
}

export function translate(lang: Language, key: string): string {
	const dict = getDictionary(lang);
	return dict[key] ?? baseEn[key] ?? key;
}

export function isRTL(lang: Language): boolean {
	return lang === "UR" || lang === "AR";
}

export const supportedLanguages: Language[] = ["EN", "UR", "FR", "AR"];








