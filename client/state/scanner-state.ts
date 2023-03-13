import { atom } from "recoil";

export interface Scanner {
  open: boolean;
}

export const scannerState = atom<Scanner>({
  key: "SCANNER",
  default: { open: false },
});
