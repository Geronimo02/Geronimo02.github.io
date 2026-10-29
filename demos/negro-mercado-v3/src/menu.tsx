import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { menu as staticMenu, type MenuItem } from './data';

type MenuState = { items: MenuItem[]; categories: string[]; accepting: boolean; live: boolean; soldOut: Set<string> };

const MenuContext = createContext<MenuState | null>(null);

function build(raw: (MenuItem & { available?: boolean })[], accepting: boolean, live: boolean): MenuState {
  const items = raw
    .filter((i) => i.published)
    .map((i) => ({ ...i, variants: i.variants.filter((v) => typeof v.price === 'number') }))
    .filter((i) => i.variants.length > 0);
  const categories = ['Todos', ...Array.from(new Set(items.map((i) => i.category)))];
  const soldOut = new Set(raw.filter((i) => i.available === false).map((i) => i.id));
  return { items, categories, accepting, live, soldOut };
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MenuState>(() => build(staticMenu, true, false));
  useEffect(() => {
    let alive = true;
    api.menu().then((r) => { if (alive) setState(build(r.items, r.accepting, true)); }).catch(() => { /* sin API (vite dev): queda la carta estática */ });
    return () => { alive = false; };
  }, []);
  return <MenuContext.Provider value={state}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuState {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu fuera de MenuProvider');
  return ctx;
}
