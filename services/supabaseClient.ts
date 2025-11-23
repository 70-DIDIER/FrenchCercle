import { createClient } from '@supabase/supabase-js';
import { Registrant } from '../types';

// Configuration Supabase avec les clés fournies
// Project ID: ffizyyezebjilmdjtwlw
const projectRef = 'ffizyyezebjilmdjtwlw';
const supabaseUrl = `https://${projectRef}.supabase.co` as string;

// Clé publique (Anon Key). 
// Note: Si 'sb_publishable...' ne fonctionne pas, utilisez la clé 'anon' du dashboard Supabase (commence par 'ey...')
const supabaseAnonKey = 'sb_publishable_KREB4hLpAniuwrViWjV2VA_Ji0ftpZ6' as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Map DB snake_case to App camelCase
const mapFromDb = (row: any): Registrant => ({
  id: row.id.toString(),
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  courseInterest: row.course_interest,
  level: row.level,
  type: row.type as 'ZOOM' | 'IN_PERSON',
  status: row.status as 'PENDING' | 'CONTACTED' | 'ENROLLED',
  date: row.date || new Date(row.created_at).toISOString().split('T')[0]
});

export const fetchRegistrants = async (): Promise<Registrant[]> => {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('registrants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrants:', error);
    // Si la clé est invalide, on ne lance pas l'erreur pour ne pas casser l'UI, on retourne vide
    throw error;
  }

  return data ? data.map(mapFromDb) : [];
};

export const addRegistrantToDb = async (registrant: Omit<Registrant, 'id' | 'status'>) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase
    .from('registrants')
    .insert([
      {
        first_name: registrant.firstName,
        last_name: registrant.lastName,
        email: registrant.email,
        course_interest: registrant.courseInterest,
        level: registrant.level,
        type: registrant.type,
        status: 'PENDING',
        date: registrant.date
      }
    ])
    .select();

  if (error) {
    console.error('Error adding registrant:', error);
    throw error;
  }

  return data ? mapFromDb(data[0]) : null;
};