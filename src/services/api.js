import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- SERVICES ---
export const itemService = {
  getAll: async () => {
    const { data, error } = await supabase.from('Item').select('*');
    if (error) throw error;
    return data;
  },
  create: async (itemData) => {
    // itemData: { title, price, type, ... }
    const { data, error } = await supabase.from('Item').insert(itemData).select();
    if (error) throw error;
    return data;
  }
};

export const orderService = {
  create: async (orderData) => {
    // Validasi DP Minimal 30% (Double check di service layer)
    if (orderData.dpPercentage < 30) throw new Error("DP Minimal 30%");
    
    const { data, error } = await supabase.from('Order').insert(orderData).select();
    if (error) throw error;
    return data;
  },
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('Order')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }
};

export const storageService = {
  upload: async (file, bucket = 'portfolio-assets') => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }
};
