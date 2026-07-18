import { useCallback, useRef, useState } from 'react';
import type { Bingo, Cell } from '../types';
import { MAX_BINGOS } from '../constants';
import { emptyCells, loadData, newBingo, saveData } from '../lib/storage';
import { useI18n } from '../i18n/I18nContext';

export function useBingoStore() {
  const { t } = useI18n();
  const [bingos, setBingos] = useState<Bingo[]>(() => loadData(t.defaultBingoTitle).bingos);
  const [activeId, setActiveId] = useState<string>(() => loadData(t.defaultBingoTitle).activeId);
  const [undoSnapshot, setUndoSnapshot] = useState<{ id: string; cells: Cell[] } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((nextBingos: Bingo[], nextActiveId: string) => {
    saveData({ bingos: nextBingos, activeId: nextActiveId });
  }, []);

  const active = bingos.find((b) => b.id === activeId) || bingos[0];

  const patchActive = useCallback(
    (fn: (b: Bingo) => Bingo) => {
      setBingos((prev) => {
        const next = prev.map((b) => (b.id === activeId ? fn({ ...b }) : b));
        persist(next, activeId);
        return next;
      });
    },
    [activeId, persist],
  );

  const addBingo = useCallback(() => {
    setBingos((prev) => {
      if (prev.length >= MAX_BINGOS) return prev;
      const b = newBingo(t.bingoNumbered(prev.length + 1), active?.size || 5);
      const next = [...prev, b];
      persist(next, b.id);
      setActiveId(b.id);
      return next;
    });
  }, [active, persist, t]);

  const selectBingo = useCallback(
    (id: string) => {
      setActiveId(id);
      persist(bingos, id);
    },
    [bingos, persist],
  );

  const deleteBingo = useCallback(
    (id: string) => {
      setBingos((prev) => {
        if (prev.length <= 1 && !window.confirm(t.confirmDeleteBingo)) return prev;
        let next = prev.filter((b) => b.id !== id);
        if (!next.length) next = [newBingo(t.defaultBingoTitle, 5)];
        const nextActive = activeId === id ? next[0].id : activeId;
        persist(next, nextActive);
        setActiveId(nextActive);
        return next;
      });
    },
    [activeId, persist, t],
  );

  const setSize = useCallback(
    (n: number) => {
      patchActive((b) => {
        const cur = b.cells;
        const next: Cell[] = [];
        for (let i = 0; i < n * n; i++) {
          const c = cur[i] || { key: null, name: '', game: '', caught: false };
          next.push(c.key ? c : { key: null, name: '', game: '', caught: false });
        }
        return { ...b, size: n, cells: next };
      });
    },
    [patchActive],
  );

  const clearCell = useCallback(
    (i: number) => {
      patchActive((b) => {
        const cells = b.cells.slice();
        cells[i] = { key: null, name: '', game: '', caught: false };
        return { ...b, cells };
      });
    },
    [patchActive],
  );

  const setCell = useCallback(
    (i: number, cell: Cell) => {
      patchActive((b) => {
        const cells = b.cells.slice();
        cells[i] = cell;
        return { ...b, cells };
      });
    },
    [patchActive],
  );

  const setTitle = useCallback((title: string) => patchActive((b) => ({ ...b, title })), [patchActive]);
  const setDescription = useCallback(
    (description: string) => patchActive((b) => ({ ...b, description })),
    [patchActive],
  );

  const clearBoard = useCallback(() => {
    if (!active || !active.cells.some((c) => c.key)) return;
    const snapshot = active.cells;
    const boardId = active.id;
    patchActive((b) => ({ ...b, cells: emptyCells(b.size) }));
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoSnapshot({ id: boardId, cells: snapshot });
    undoTimer.current = setTimeout(() => setUndoSnapshot(null), 6000);
  }, [active, patchActive]);

  const undoClear = useCallback(() => {
    if (!undoSnapshot) return;
    setBingos((prev) => {
      const next = prev.map((b) => (b.id === undoSnapshot.id ? { ...b, cells: undoSnapshot.cells } : b));
      persist(next, activeId);
      return next;
    });
    setUndoSnapshot(null);
    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }
  }, [undoSnapshot, activeId, persist]);

  return {
    bingos,
    active,
    activeId,
    addBingo,
    selectBingo,
    deleteBingo,
    setSize,
    clearCell,
    setCell,
    setTitle,
    setDescription,
    clearBoard,
    undoClear,
    hasUndo: !!undoSnapshot,
  };
}
