export type Lang = 'en' | 'pt-BR';

export const LANG_STORAGE_KEY = 'bsh:lang:v1';

interface Dictionary {
  grid: string;
  clearBoard: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  caughtCount: (caught: number, total: number) => string;
  untitled: string;
  previous: string;
  next: string;
  deleteBoard: string;
  addBoard: string;
  confirmDeleteBingo: string;
  choosePokemon: string;
  close: string;
  game: string;
  noGame: string;
  randomPick: string;
  rollAnother: string;
  searchPlaceholder: string;
  loadingDex: string;
  dexUnavailable: string;
  resultsCount: (n: number) => string;
  dexHint: (n: number) => string;
  pickAbove: string;
  markCaught: string;
  caughtLabel: string;
  remove: string;
  cancel: string;
  add: string;
  update: string;
  boardCleared: string;
  undo: string;
  exportUntitled: string;
  exportCaughtOf: (caught: number, total: number) => string;
  exportData: string;
  importData: string;
  importSummary: (imported: number, skipped: number) => string;
  importInvalidFile: string;
  importNothingValid: string;
  importNoRoom: string;
}

export const translations: Record<Lang, Dictionary> = {
  en: {
    grid: 'Grid',
    clearBoard: 'Clear board',
    titlePlaceholder: 'Bingo title',
    descriptionPlaceholder: 'Add a description (theme, rules, target region…)',
    caughtCount: (caught, total) => `${caught}/${total} caught`,
    untitled: 'Untitled',
    previous: 'Previous',
    next: 'Next',
    deleteBoard: 'Delete',
    addBoard: 'Add board',
    confirmDeleteBingo: 'Delete this bingo? At least one card is kept.',
    choosePokemon: 'Choose a Pokémon',
    close: 'Close',
    game: 'Game',
    noGame: 'No game',
    randomPick: 'Pick a random Pokémon from this game',
    rollAnother: '🔀 Roll another',
    searchPlaceholder: 'Search by name… (e.g. typhlosion-hisui)',
    loadingDex: 'Loading Pokédex…',
    dexUnavailable: 'Pokédex unavailable — check your connection.',
    resultsCount: (n) => `${n} result${n === 1 ? '' : 's'}`,
    dexHint: (n) => `${n} Pokémon in this game · type to search`,
    pickAbove: 'Pick a Pokémon above.',
    markCaught: 'Mark as caught',
    caughtLabel: '✓ Caught',
    remove: '🗑 Remove',
    cancel: 'Cancel',
    add: 'Add',
    update: 'Update',
    boardCleared: 'Board cleared.',
    undo: 'Undo',
    exportUntitled: 'Shiny Bingo',
    exportCaughtOf: (caught, total) => `${caught} / ${total} caught`,
    exportData: '📤 Export board',
    importData: '📥 Import board',
    importSummary: (imported, skipped) =>
      skipped > 0
        ? `Imported ${imported} board${imported === 1 ? '' : 's'}, ${skipped} skipped (board limit reached).`
        : `Imported ${imported} board${imported === 1 ? '' : 's'}.`,
    importInvalidFile: "Could not read that file — make sure it's a valid Bingo Shiny Hunt export.",
    importNothingValid: 'No valid boards were found in that file.',
    importNoRoom: 'Board limit reached — delete a board before importing more.',
  },
  'pt-BR': {
    grid: 'Grade',
    clearBoard: 'Limpar cartela',
    titlePlaceholder: 'Título do bingo',
    descriptionPlaceholder: 'Adicione uma descrição (tema, regras, região alvo…)',
    caughtCount: (caught, total) => `${caught}/${total} capturados`,
    untitled: 'Sem título',
    previous: 'Anterior',
    next: 'Próximo',
    deleteBoard: 'Excluir',
    addBoard: 'Adicionar cartela',
    confirmDeleteBingo: 'Excluir este bingo? Pelo menos uma cartela é mantida.',
    choosePokemon: 'Escolha um Pokémon',
    close: 'Fechar',
    game: 'Jogo',
    noGame: 'Nenhum jogo',
    randomPick: 'Escolher um Pokémon aleatório deste jogo',
    rollAnother: '🔀 Sortear outro',
    searchPlaceholder: 'Buscar por nome… (ex.: typhlosion-hisui)',
    loadingDex: 'Carregando Pokédex…',
    dexUnavailable: 'Pokédex indisponível — verifique sua conexão.',
    resultsCount: (n) => `${n} resultado${n === 1 ? '' : 's'}`,
    dexHint: (n) => `${n} Pokémon neste jogo · digite para buscar`,
    pickAbove: 'Escolha um Pokémon acima.',
    markCaught: 'Marcar como capturado',
    caughtLabel: '✓ Capturado',
    remove: '🗑 Remover',
    cancel: 'Cancelar',
    add: 'Adicionar',
    update: 'Atualizar',
    boardCleared: 'Cartela limpa.',
    undo: 'Desfazer',
    exportUntitled: 'Bingo Shiny',
    exportCaughtOf: (caught, total) => `${caught} / ${total} capturados`,
    exportData: '📤 Exportar cartela',
    importData: '📥 Importar cartela',
    importSummary: (imported, skipped) =>
      skipped > 0
        ? `${imported} cartela${imported === 1 ? '' : 's'} importada${imported === 1 ? '' : 's'}, ${skipped} ignorada${skipped === 1 ? '' : 's'} (limite de cartelas atingido).`
        : `${imported} cartela${imported === 1 ? '' : 's'} importada${imported === 1 ? '' : 's'}.`,
    importInvalidFile: 'Não foi possível ler esse arquivo — confirme se é uma exportação válida do Bingo Shiny Hunt.',
    importNothingValid: 'Nenhuma cartela válida foi encontrada nesse arquivo.',
    importNoRoom: 'Limite de cartelas atingido — exclua uma cartela antes de importar mais.',
  },
};

export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'pt-BR') return stored;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}
