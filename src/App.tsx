import { useState } from 'react';
import type { Cell } from './types';
import { useBingoStore } from './hooks/useBingoStore';
import Header from './components/Header';
import BingoRail from './components/BingoRail';
import BingoBoard from './components/BingoBoard';
import PickerDialog from './components/PickerDialog';
import Toast from './components/Toast';
import { exportPNG, exportSVG } from './lib/exportImage';
import { useI18n } from './i18n/I18nContext';

export default function App() {
  const { t } = useI18n();
  const {
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
    hasUndo,
  } = useBingoStore();

  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  if (!active) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        size={active.size}
        onSizeChange={setSize}
        onClearBoard={clearBoard}
        onExportPNG={() => exportPNG(active, { untitled: t.exportUntitled, caughtOf: t.exportCaughtOf })}
        onExportSVG={() => exportSVG(active, { untitled: t.exportUntitled, caughtOf: t.exportCaughtOf })}
      />
      <BingoRail bingos={bingos} activeId={activeId} onSelect={selectBingo} onDelete={deleteBingo} onAdd={addBingo} />
      <BingoBoard
        bingo={active}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onEdit={setPickerIndex}
      />

      {pickerIndex !== null && (
        <PickerDialog
          initialCell={active.cells[pickerIndex]}
          onCancel={() => setPickerIndex(null)}
          onConfirm={(cell: Cell) => {
            setCell(pickerIndex, cell);
            setPickerIndex(null);
          }}
          onRemove={() => {
            clearCell(pickerIndex);
            setPickerIndex(null);
          }}
        />
      )}

      {hasUndo && <Toast onUndo={undoClear} />}
    </div>
  );
}
