interface RankingEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  title?: string;
  details?: string; // e.g. "dragon (Lv.10)" for PKer
  change?: 'up' | 'down' | 'stay' | 'new';
}

interface RankingResponse {
  category: 'explorer_clear' | 'explorer_level' | 'admin_lethality' | 'admin_popularity' | 'pker_slain' | 'pker_level';
  entries: RankingEntry[];
  totalEntries: number;
}

interface MyRankResponse {
  category: string;
  myEntry?: RankingEntry;
  surroundingEntries: RankingEntry[];
}
