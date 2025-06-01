import { SideType } from "@/convex/_types";

export type StepType = "intro" | "side" | "action" | "list";

export const sides: Record<SideType, { slogan: string }> = {
  hungeros: {
    slogan:
      "Az Ősök Földje, ahol a múlt dicsősége él tovább. " +
      "Hungeros a hagyomány, a rend és az erő birodalma, " +
      "amelyet Victarion Oben, a Vaskezű Vezér ural. " +
      "Az ország lakói a stabilitásra, a nemzeti öntudatra " +
      "és a központosított hatalomra esküsznek. A birodalom " +
      "vastörvényeit nem könnyű megváltoztatni - " +
      "de aki a rendet választja, az biztos talajon áll.",
  },
  westeria: {
    slogan:
      "A Változás Szeleinek otthona. Westeria a megújulás, " +
      "az átláthatóság és a polgári szabadság földje, " +
      "ahol Petyr Magor, a Népszavak Mestere vezeti a népet. " +
      "A tartomány híres a szókimondásról, a szabad kérdésekről " +
      "és a nyilvánosság fényéről. Westeriában mindenki felteheti " +
      "a kérdést, amit másutt csak suttogni mernek.",
  },
};
