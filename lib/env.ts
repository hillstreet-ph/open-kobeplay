import { z } from "zod";
const publicSchema=z.object({NEXT_PUBLIC_SUPABASE_URL:z.string().url(),NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:z.string().min(1)});
export function publicEnv(){return publicSchema.parse({NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY})}
export function requireServerSecret(name:"SUPABASE_SERVICE_ROLE_KEY"|"STRIPE_SECRET_KEY"|"STRIPE_WEBHOOK_SECRET"){const value=process.env[name];if(!value)throw new Error(`Missing required server secret: ${name}`);return value}