import { useCallback, useState } from 'react';
import type { DexVariant } from '../types';
import { GAME_DEX_FILES } from '../constants';
import { fetchDexFile } from '../lib/dex';

export function useDex() {
  const [dexFiles, setDexFiles] = useState<Record<string, DexVariant[]>>({});
  const [loading, setLoading] = useState(false);

  const filesForGame = useCallback((game: string) => GAME_DEX_FILES[game] || GAME_DEX_FILES[''], []);

  const ensureDexFiles = useCallback(
    async (names: string[]) => {
      const need = names.filter((n) => !dexFiles[n]);
      if (!need.length) return;
      setLoading(true);
      const loaded: Record<string, DexVariant[]> = {};
      await Promise.all(
        need.map(async (n) => {
          loaded[n] = await fetchDexFile(n);
        }),
      );
      setDexFiles((prev) => ({ ...prev, ...loaded }));
      setLoading(false);
    },
    [dexFiles],
  );

  const getDex = useCallback(
    (game: string): DexVariant[] => {
      const files = filesForGame(game);
      const seen = new Set<string>();
      const out: DexVariant[] = [];
      files.forEach((n) => {
        const arr = dexFiles[n];
        if (arr) {
          arr.forEach((p) => {
            if (!seen.has(p.key)) {
              seen.add(p.key);
              out.push(p);
            }
          });
        }
      });
      return out;
    },
    [dexFiles, filesForGame],
  );

  return { ensureDexFiles, filesForGame, getDex, loading };
}
