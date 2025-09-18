// langs.ts
import SA from "@/shared/icons/SA.vue";
import USA from "@/shared/icons/USA.vue";
// import EG from "@/shared/icons/Egy.vue";
import FR from "@/shared/icons/FR.vue";
import DE from "@/shared/icons/DE.vue";
import ES from "@/shared/icons/ES.vue";
// import ES from "@/shared/icons/ES.vue";
import ZH from "@/shared/icons/ZH.vue";
import THA from "@/shared/icons/THA.vue";
import JAP from "@/shared/icons/JAP.vue";
import KOR from "@/shared/icons/KOR.vue";
import ITA from "@/shared/icons/ITA.vue";
import POR from "@/shared/icons/POR.vue";
import RUS from "@/shared/icons/RUS.vue";
import VIE from "@/shared/icons/VIE.vue";
import IR from "@/shared/icons/IR.vue";


import { LangEnum } from "@/features/setting/languages/Core/enums/langEnum";

export const LangsMap: Record<
  LangEnum,
  { name: string; icon: any }
> = {
  [LangEnum.ARABIC] : { name: "Arabic", icon: SA,code: LangEnum.ARABIC },
  [LangEnum.ENGLISH] : { name: "English", icon: USA, code: LangEnum.ENGLISH },
  [LangEnum.FRENCH] : { name: "French", icon: FR, code: LangEnum.FRENCH },
  [LangEnum.GERMAN] : { name: "German", icon: DE, code: LangEnum.GERMAN },
  [LangEnum.SPANISH] : { name: "Spanish", icon: ES, code: LangEnum.SPANISH },
  [LangEnum.CHINESE] : { name: "Chinese", icon: ZH, code: LangEnum.CHINESE },
  [LangEnum.JAPANESE] : { name: "Japanese", icon: JAP, code: LangEnum.JAPANESE },
  [LangEnum.KOREAN] : { name: "Korean", icon: KOR, code: LangEnum.KOREAN },
  [LangEnum.ITALIAN] : { name: "Italian", icon: ITA, code: LangEnum.ITALIAN },
  [LangEnum.PORTUGUESE] : { name: "Portuguese", icon: POR, code: LangEnum.PORTUGUESE },
  [LangEnum.RUSSIAN] : { name: "Russian", icon: RUS, code: LangEnum.RUSSIAN },
  [LangEnum.THAI] : { name: "Thai", icon: THA, code: LangEnum.THAI },
  [LangEnum.VIETNAMESE] : { name: "Vietnamese", icon: VIE, code: LangEnum.VIETNAMESE },
  [LangEnum.PERSIAN] : { name: "Iraqi", icon: IR, code: LangEnum.PERSIAN },


};
