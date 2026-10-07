import { supabase, isSupabaseConfigured } from './supabase';
import { initialDrivers, initialFreight, initialDeductions, initialPayments } from './mockData';

// Inicialização de LocalStorage caso Supabase não esteja ativo
const initializeLocalData = () => {
  if (!localStorage.getItem('tf_drivers')) {
    localStorage.setItem('tf_drivers', JSON.stringify(initialDrivers));
  }
  if (!localStorage.getItem('tf_freight')) {
    localStorage.setItem('tf_freight', JSON.stringify(initialFreight));
  }
  if (!localStorage.getItem('tf_deductions')) {
    localStorage.setItem('tf_deductions', JSON.stringify(initialDeductions));
  }
  if (!localStorage.getItem('tf_payments')) {
    localStorage.setItem('tf_payments', JSON.stringify(initialPayments));
  }
};

initializeLocalData();

export const dataService = {
  // --- MOTORISTAS ---
  getDrivers: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('drivers').select('*').order('name');
      if (error) throw error;
      return data;
    }
    return JSON.parse(localStorage.getItem('tf_drivers') || '[]');
  },

  saveDriver: async (driverData) => {
    if (isSupabaseConfigured) {
      if (driverData.id && !driverData.id.startsWith('d')) {
        const { data, error } = await supabase.from('drivers').update(driverData).eq('id', driverData.id).select();
        if (error) throw error;
        return data[0];
      } else {
        const { id, ...newObj } = driverData;
        const { data, error } = await supabase.from('drivers').insert([newObj]).select();
        if (error) throw error;
        return data[0];
      }
    } else {
      const drivers = JSON.parse(localStorage.getItem('tf_drivers') || '[]');
      let updated;
      if (driverData.id) {
        updated = drivers.map(d => d.id === driverData.id ? driverData : d);
      } else {
        const newDriver = { ...driverData, id: 'd_' + Date.now() };
        updated = [...drivers, newDriver];
      }
      localStorage.setItem('tf_drivers', JSON.stringify(updated));
      return driverData;
    }
  },

  deleteDriver: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (error) throw error;
    } else {
      const drivers = JSON.parse(localStorage.getItem('tf_drivers') || '[]');
      const filtered = drivers.filter(d => d.id !== id);
      localStorage.setItem('tf_drivers', JSON.stringify(filtered));
    }
  },

  // --- FRETES ---
  getFreight: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('freights').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
    return JSON.parse(localStorage.getItem('tf_freight') || '[]');
  },

  saveFreight: async (freightData) => {
    if (isSupabaseConfigured) {
      if (freightData.id && !freightData.id.startsWith('f')) {
        const { data, error } = await supabase.from('freights').update(freightData).eq('id', freightData.id).select();
        if (error) throw error;
        return data[0];
      } else {
        const { id, ...newObj } = freightData;
        const { data, error } = await supabase.from('freights').insert([newObj]).select();
        if (error) throw error;
        return data[0];
      }
    } else {
      const list = JSON.parse(localStorage.getItem('tf_freight') || '[]');
      let updated;
      if (freightData.id) {
        updated = list.map(f => f.id === freightData.id ? freightData : f);
      } else {
        const newItem = { ...freightData, id: 'f_' + Date.now() };
        updated = [newItem, ...list];
      }
      localStorage.setItem('tf_freight', JSON.stringify(updated));
      return freightData;
    }
  },

  deleteFreight: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('freights').delete().eq('id', id);
      if (error) throw error;
    } else {
      const list = JSON.parse(localStorage.getItem('tf_freight') || '[]');
      localStorage.setItem('tf_freight', JSON.stringify(list.filter(item => item.id !== id)));
    }
  },

  // --- DESCONTOS ---
  getDeductions: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('deductions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
    return JSON.parse(localStorage.getItem('tf_deductions') || '[]');
  },

  saveDeduction: async (deductionData) => {
    if (isSupabaseConfigured) {
      if (deductionData.id && !deductionData.id.startsWith('ded')) {
        const { data, error } = await supabase.from('deductions').update(deductionData).eq('id', deductionData.id).select();
        if (error) throw error;
        return data[0];
      } else {
        const { id, ...newObj } = deductionData;
        const { data, error } = await supabase.from('deductions').insert([newObj]).select();
        if (error) throw error;
        return data[0];
      }
    } else {
      const list = JSON.parse(localStorage.getItem('tf_deductions') || '[]');
      let updated;
      if (deductionData.id) {
        updated = list.map(d => d.id === deductionData.id ? deductionData : d);
      } else {
        const newItem = { ...deductionData, id: 'ded_' + Date.now() };
        updated = [newItem, ...list];
      }
      localStorage.setItem('tf_deductions', JSON.stringify(updated));
      return deductionData;
    }
  },

  deleteDeduction: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('deductions').delete().eq('id', id);
      if (error) throw error;
    } else {
      const list = JSON.parse(localStorage.getItem('tf_deductions') || '[]');
      localStorage.setItem('tf_deductions', JSON.stringify(list.filter(item => item.id !== id)));
    }
  },

  // --- PAGAMENTOS ---
  getPayments: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('payments').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
    return JSON.parse(localStorage.getItem('tf_payments') || '[]');
  },

  registerPayment: async (paymentData, freightIdsToUpdate) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('payments').insert([paymentData]).select();
      if (error) throw error;
      
      if (freightIdsToUpdate && freightIdsToUpdate.length > 0) {
        await supabase.from('freights').update({ status: 'Pago' }).in('id', freightIdsToUpdate);
      }
      return data[0];
    } else {
      const payments = JSON.parse(localStorage.getItem('tf_payments') || '[]');
      const newPay = { ...paymentData, id: 'p_' + Date.now() };
      localStorage.setItem('tf_payments', JSON.stringify([newPay, ...payments]));

      if (freightIdsToUpdate && freightIdsToUpdate.length > 0) {
        const freights = JSON.parse(localStorage.getItem('tf_freight') || '[]');
        const updated = freights.map(f => freightIdsToUpdate.includes(f.id) ? { ...f, status: 'Pago' } : f);
        localStorage.setItem('tf_freight', JSON.stringify(updated));
      }
      return newPay;
    }
  }
};