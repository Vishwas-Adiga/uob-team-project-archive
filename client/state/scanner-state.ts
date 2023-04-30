import { atom } from "recoil";

export interface Scanner {
  open: boolean;
  mode: "read" | "register";
}

export const scannerState = atom<Scanner>({
  key: "SCANNER",
  default: { open: false, mode: "read" },
});
