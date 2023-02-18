import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kskatigvwydjkupclwep.supabase.co",
  process.env.REACT_APP_SUPABASE_API_KEY || ""
);

export async function createNewGame() {
  return await supabase.from("games").insert([{}]).select();
}

export function teamsPresenceState({ gameId }: { gameId: string }) {
  return supabase.channel(gameId, {
    config: { presence: { key: "presences" } },
  });
}
