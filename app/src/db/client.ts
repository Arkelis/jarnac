import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://kskatigvwydjkupclwep.supabase.co",
  import.meta.env.VITE_SUPABASE_API_KEY || ""
)
