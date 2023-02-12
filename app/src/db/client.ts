import { createClient } from "@supabase/supabase-js";

console.log(process.env);
const supabase = createClient(
  "https://kskatigvwydjkupclwep.supabase.co",
  process.env.REACT_APP_SUPABASE_API_KEY || ""
);

export async function createNewGame() {
  return await supabase.from("games").insert([{}]).select();
}
