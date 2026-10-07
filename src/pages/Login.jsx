import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck class="w-10 h-10" />
          </div>
          <h1 class="text-2xl font-bold text-white">TRANS<span class="text-emerald-400">FRETE</span></h1>
          <p class="text-sm text-slate-400 mt-1">Gestão Financeira e Pagamento de Fretes</p>
        </div>

        {error && (
          <div class="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-lg flex items-center space-x-2">
            <AlertCircle class="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">E-mail Corporativo</label>
            <div class="relative">
              <Mail class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: admin@transfrete.com"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Senha</label>
            <div class="relative">
              <Lock class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-emerald-600/20 transition duration-200 mt-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Acessando...' : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div class="mt-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 text-xs text-slate-400 text-center">
          <p class="font-semibold text-slate-300 mb-1">Acesso de Demonstração Local:</p>
          <p>E-mail: <span class="text-emerald-400">admin@transfrete.com</span></p>
          <p>Senha: <span class="text-emerald-400">123456</span></p>
        </div>
      </div>
    </div>
  );
}