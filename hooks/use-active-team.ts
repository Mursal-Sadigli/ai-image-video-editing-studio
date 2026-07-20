import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveTeamState {
  activeTeamId: string | null;
  setActiveTeamId: (id: string | null) => void;
}

export const useActiveTeam = create<ActiveTeamState>()(
  persist(
    (set) => ({
      activeTeamId: null,
      setActiveTeamId: (id) => set({ activeTeamId: id }),
    }),
    {
      name: 'active-team-storage', // localStorage-ə yazılacaq ad
    }
  )
);
