// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdmynzzcqvaatmuthgja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXluenpjcXZhYXRtdXRoZ2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MDkyMzcsImV4cCI6MjA1OTQ4NTIzN30.uc2gn3DvrNvnMkpUm-9i7aQ7aJL41oNdL7d98jTK8vM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);