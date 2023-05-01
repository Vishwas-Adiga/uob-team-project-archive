import { useEffect, useState } from "react";
import { get } from "./fetch";

export const useData = <T>(
  url: string,
  deps: any[] = []
): [T | undefined, () => void] => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [ignore, setIgnore] = useState(false);
  useEffect(() => {
    get(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    setIgnore(true);
  }, [url, ignore, deps]);
  return [data, setIgnore.bind(null, false)];
};
