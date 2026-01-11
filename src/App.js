import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  Tv,
  TrendingUp,
  Settings,
  Search,
  Bell, 
  LogOut, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  FileText,
  MessageSquare,
  Bot,
  RefreshCw,
  Ban,
  Download,
  Calculator,
  DollarSign,
  Euro,
  Filter,
  Plus,
  Columns,
  List,
  MoreHorizontal,
  Mail,
  Clock,
  Server,
  Activity,
  Globe,
  Zap,
  AlertCircle,
  Clock3,
  Send,
  Shield,
  Smartphone,
  Palette,
  Save,
  ToggleLeft,
  ToggleRight,
  Edit,
  Eye,
  MessageCircle,
  Trash2,
  X,
  UserPlus,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Supabase configuration - Replace with your actual Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DATI MOCK (SIMULATI) ---

const MOCK_CLIENTS = [
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario.rossi@email.com',
    phone: '+39 333 1234567',
    avatar: 'MR',
    status: 'active',
    type: 'Standard',
    iptv: {
      username: 'mario_tv_88',
      expireDate: '2026-02-15',
      status: 'active',
      mac: '00:1A:79:44:2B:11',
      plan: 'Full Sport + Cinema 4K',
      connections: 1,
      lastIp: '87.12.33.11 (Milano, IT)'
    },
    payments: [
      { id: 101, date: '2024-02-15', item: 'Rinnovo 12 Mesi', amount: 80, method: 'PayPal', status: 'completed' },
      { id: 102, date: '2023-02-15', item: 'Rinnovo 12 Mesi', amount: 75, method: 'PayPal', status: 'completed' },
      { id: 103, date: '2023-01-15', item: 'Prova 1 Mese', amount: 10, method: 'PayPal', status: 'completed' }
    ],
    notes: 'Cliente storico. Preferisce contatti su Telegram.'
  },
  {
    id: 2,
    name: 'Luca Bianchi',
    email: 'luca.b@studio.com',
    phone: '+39 340 9876543',
    avatar: 'LB',
    status: 'warning', 
    type: 'Reseller',
    iptv: {
      username: 'lucatv_pro',
      expireDate: '2025-01-12', 
      status: 'expiring',
      mac: '11:2B:44:55:FF:AA',
      plan: 'Base SD',
      connections: 2,
      lastIp: '99.11.22.33 (Roma, IT)'
    },
    payments: [
      { id: 201, date: '2024-12-12', item: 'Rinnovo 1 Mese', amount: 10, method: 'Crypto', status: 'completed' }
    ],
    notes: 'Chiede spesso supporto per Smart TV Samsung.'
  },
  {
    id: 3,
    name: 'Giulia Verdi',
    email: 'g.verdi@crypto.net',
    phone: '+39 328 5556667',
    avatar: 'GV',
    status: 'active',
    type: 'Finance Only',
    iptv: null,
    finance: {
      kyc: 'pending',
      riskProfile: 'Aggressivo',
      totalAssets: 120500,
      portfolio: [
        { asset: 'Altcoins', value: 80000, trend: 'up' },
        { asset: 'Azioni Tech', value: 40500, trend: 'up' }
      ]
    },
    notes: 'Interessata a nuovi lanci di token.'
  }
];

const MOCK_LEADS = [
  { id: 1, name: 'Alessandro Magno', email: 'alessandro.magno@email.com', phone: '+39 333 1234567', source: 'Telegram', status: 'new', time: '2h fa', interest: 'IPTV Sport' },
  { id: 2, name: 'Marco Polo', email: 'marco.polo@email.com', phone: '+39 334 2345678', source: 'Referral', status: 'contacted', time: '1g fa', interest: 'Reseller' },
  { id: 3, name: 'Elena di Troia', email: 'elena.troia@email.com', phone: '+39 335 3456789', source: 'Web', status: 'trial', time: '3g fa', interest: 'IPTV Cinema' },
  { id: 4, name: 'Cesare Augusto', email: 'cesare.augusto@email.com', phone: '+39 336 4567890', source: 'Instagram', status: 'negotiating', time: '5g fa', interest: 'Full Package' },
  { id: 5, name: 'Cleopatra VII', email: 'cleopatra.vii@email.com', phone: '+39 337 5678901', source: 'WhatsApp', status: 'new', time: '10m fa', interest: 'Crypto Info' },
];

const LEAD_STATUSES = [
  { id: 'new', label: 'Nuovi Contatti', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'contacted', label: 'Contattati', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { id: 'trial', label: 'In Prova (Test)', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  { id: 'negotiating', label: 'In Trattativa', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
];

// --- NUOVI MOCK PER GESTIONE ABBONAMENTI ---
const MOCK_SUBSCRIPTIONS = [
  { id: 101, name: 'Marco Gialli', username: 'marco_g_90', plan: 'Full 12 Mesi', status: 'expired', expire_date: '2024-01-09', days_left: -1, last_seen: '2 giorni fa' },
  { id: 102, name: 'Luca Bianchi', username: 'lucatv_pro', plan: 'Base 1 Mese', status: 'expiring', expire_date: '2025-01-12', days_left: 1, last_seen: 'Oggi' },
  { id: 103, name: 'Giuseppe Verdi', username: 'peppe_napoli', plan: 'Full Sport', status: 'expiring', expire_date: '2025-01-15', days_left: 3, last_seen: 'Oggi' },
  { id: 104, name: 'Luigi Neri', username: 'gigio_88', plan: 'Cinema 3 Mesi', status: 'active', expire_date: '2025-02-28', days_left: 45, last_seen: 'Ieri' },
  { id: 105, name: 'Test User 01', username: 'trial_x22', plan: 'Trial 24h', status: 'trial', expire_date: '2025-01-11', days_left: 0, last_seen: '1 ora fa' },
  { id: 106, name: 'Bar Sport', username: 'bar_sport_to', plan: 'Commercial', status: 'active', expire_date: '2025-08-01', days_left: 200, last_seen: 'Ora' },
];

// --- COMPONENTI UI ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
      ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Badge = ({ children, color }) => {
  const colors = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

// --- NUOVA VISTA IMPOSTAZIONI ---
const SettingsView = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState('general');

  const SettingsTab = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left
        ${activeTab === id 
          ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-100">Impostazioni Sistema</h2>
           <p className="text-slate-400">Configurazione piattaforma, API e sicurezza</p>
        </div>
        <button onClick={() => alert('Impostazioni salvate con successo!')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
          <Save size={18} /> Salva Modifiche
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Generale</p>
          <SettingsTab id="general" label="Profilo & Brand" icon={Palette} />
          <SettingsTab id="security" label="Sicurezza & Accessi" icon={Shield} />
          
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Connettività</p>
          <SettingsTab id="integrations" label="Integrazioni & API" icon={Globe} />
          <SettingsTab id="billing" label="Metodi di Pagamento" icon={CreditCard} />
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* TAB: GENERALE */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Informazioni Piattaforma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nome CRM</label>
                    <input type="text" value={settings.crmName} onChange={(e) => onUpdateSettings({ crmName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email di Supporto</label>
                    <input type="email" value={settings.supportEmail} onChange={(e) => onUpdateSettings({ supportEmail: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Lingua Predefinita</label>
                    <select value={settings.language} onChange={(e) => onUpdateSettings({ language: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option>Italiano</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Valuta</label>
                    <select value={settings.currency} onChange={(e) => onUpdateSettings({ currency: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INTEGRAZIONI */}
          {activeTab === 'integrations' && (
             <div className="space-y-6 animate-fade-in">
               {/* Xtream Codes */}
               <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-violet-500/20 text-violet-400 rounded-lg"><Server size={20}/></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">Pannello IPTV (Xtream Codes)</h3>
                      <p className="text-xs text-slate-400">Collega il tuo pannello rivenditore per gestire le linee</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">URL Pannello (DNS)</label>
                      <input type="text" value={settings.integrations.xtreamUrl} onChange={(e) => onUpdateSettings({ integrations: { ...settings.integrations, xtreamUrl: e.target.value } })} placeholder="http://cms.example.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-medium text-slate-400 mb-1">Username API</label>
                         <input type="text" value={settings.integrations.xtreamUsername} onChange={(e) => onUpdateSettings({ integrations: { ...settings.integrations, xtreamUsername: e.target.value } })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-slate-400 mb-1">Password API</label>
                         <input type="password" value={settings.integrations.xtreamPassword} onChange={(e) => onUpdateSettings({ integrations: { ...settings.integrations, xtreamPassword: e.target.value } })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                     <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/10">
                       <RefreshCw size={12}/> Testa Connessione
                     </button>
                  </div>
               </div>

               {/* Telegram Bot */}
               <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Send size={20}/></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">Telegram Bot</h3>
                      <p className="text-xs text-slate-400">Per inviare notifiche di scadenza automatiche</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Bot Token (da @BotFather)</label>
                    <input type="text" value={settings.integrations.telegramToken} onChange={(e) => onUpdateSettings({ integrations: { ...settings.integrations, telegramToken: e.target.value } })} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
               </div>
             </div>
          )}

          {/* TAB: SICUREZZA */}
           {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Credenziali di Accesso</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Vecchia Password</label>
                    <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Nuova Password</label>
                      <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Conferma Password</label>
                      <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

               <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2"><Smartphone size={20} className="text-emerald-400"/> 2FA (Autenticazione a due fattori)</h3>
                     <p className="text-xs text-slate-400 mt-1">Richiedi un codice via App Authenticator al login.</p>
                  </div>
                  <div onClick={() => onUpdateSettings({ security: { ...settings.security, twoFA: !settings.security.twoFA } })} className={`cursor-pointer ${settings.security.twoFA ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {settings.security.twoFA ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                  </div>
               </div>
            </div>
          )}

          {/* TAB: BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Configurazione Incassi</h3>
                <p className="text-sm text-slate-400 mb-6">Inserisci qui i dati che vedranno i clienti per pagarti.</p>
                
                <div className="space-y-6">
                   <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">P</div>
                         <h4 className="font-medium text-slate-200">PayPal</h4>
                      </div>
                      <input type="text" value={settings.billing.paypal} onChange={(e) => onUpdateSettings({ billing: { ...settings.billing, paypal: e.target.value } })} placeholder="tuaemail@paypal.com" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm focus:outline-none" />
                   </div>

                   <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded bg-orange-900/50 flex items-center justify-center text-orange-400 font-bold">₿</div>
                         <h4 className="font-medium text-slate-200">Bitcoin Wallet</h4>
                      </div>
                      <input type="text" value={settings.billing.bitcoin} onChange={(e) => onUpdateSettings({ billing: { ...settings.billing, bitcoin: e.target.value } })} placeholder="bc1qxy2kgdygjkUG..." className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm font-mono focus:outline-none" />
                   </div>

                   <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold">T</div>
                         <h4 className="font-medium text-slate-200">USDT (TRC20)</h4>
                      </div>
                      <input type="text" value={settings.billing.usdt} onChange={(e) => onUpdateSettings({ billing: { ...settings.billing, usdt: e.target.value } })} placeholder="T9yD14Nj9..." className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm font-mono focus:outline-none" />
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- NUOVA VISTA GESTIONE SCADENZE IPTV ---
const IptvManagerView = ({ subscriptions, onSendReminder, onAddSubscription, onNotifySubscription, onRenewSubscription, clients, onEditClient, onDeleteClient, onContactWhatsApp, onViewClientDetail, onUpdateSubscription, onDeleteSubscription, onEditSubscription }) => {
  const [filterStatus, setFilterStatus] = useState('all'); // all, urgent, active, expired
  const [selectedSubs, setSelectedSubs] = useState(new Set());
  const [selectedClient, setSelectedClient] = useState(null);
  const toggleSelect = (id) => {
    setSelectedSubs(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const selectClient = (clientName) => {
    if (selectedClient === clientName) {
      setSelectedClient(null);
    } else {
      setSelectedClient(clientName);
    }
  };

  const selectAllFiltered = (items) => {
    setSelectedSubs(prev => {
      const copy = new Set(prev);
      const allIds = items.map(i => i.id);
      const allSelected = allIds.every(id => copy.has(id));
      if (allSelected) {
        allIds.forEach(id => copy.delete(id));
      } else {
        allIds.forEach(id => copy.add(id));
      }
      return copy;
    });
  };

  const getClientSubscriptions = () => {
    if (!selectedClient) return filteredSubs;
    return filteredSubs.filter(sub => sub.name === selectedClient);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'expired': return 'red';
      case 'expiring': return 'yellow';
      case 'active': return 'green';
      case 'trial': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'expired': return 'SCADUTO';
      case 'expiring': return 'IN SCADENZA';
      case 'active': return 'ATTIVO';
      case 'trial': return 'TRIAL / PROVA';
      default: return status;
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'urgent') return sub.status === 'expired' || sub.status === 'expiring';
    return sub.status === filterStatus;
  });

  const expiredToday = subscriptions.filter(sub => sub.status === 'expired').length;
  const expiringSoon = subscriptions.filter(sub => sub.days_left > 0 && sub.days_left <= 3).length;
  const activeLines = subscriptions.filter(sub => sub.status === 'active').length;
  const trialCount = subscriptions.filter(sub => sub.status === 'trial').length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header e Azioni Rapide */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Gestione Abbonamenti</h2>
          <p className="text-slate-400">Pannello di controllo scadenze e rinnovi</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => onSendReminder({ mode: 'selected', selectedIds: Array.from(selectedSubs) })} className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors w-full md:w-auto shadow-lg shadow-emerald-500/20">
            <MessageSquare size={18} />
            <span className="hidden md:inline">Invia Reminder Massivo</span>
            <span className="md:hidden">Reminder</span>
          </button>
            <button onClick={() => onAddSubscription && onAddSubscription()} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors w-full md:w-auto shadow-lg shadow-indigo-500/20">
            <Plus size={18} />
            <span className="hidden md:inline">Nuova Linea</span>
            <span className="md:hidden">Nuovo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - Focus su Scadenze */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterStatus('expired')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${filterStatus === 'expired' ? 'bg-red-500/20 border-red-500' : 'bg-slate-800 border-slate-700 hover:border-red-500/50'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400"><AlertCircle size={20}/></div>
            <span className="text-2xl font-bold text-slate-100">{expiredToday}</span>
          </div>
          <p className="text-sm font-medium text-slate-300">Scaduti (totale)</p>
          <p className="text-xs text-red-400 mt-1">Azione immediata richiesta</p>
        </div>

        <div 
          onClick={() => setFilterStatus('urgent')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${filterStatus === 'urgent' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-800 border-slate-700 hover:border-yellow-500/50'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400"><Clock3 size={20}/></div>
            <span className="text-2xl font-bold text-slate-100">{expiringSoon}</span>
          </div>
          <p className="text-sm font-medium text-slate-300">In Scadenza (3gg)</p>
          <p className="text-xs text-yellow-400 mt-1">Invia preventivi rinnovo</p>
        </div>

        <div 
          onClick={() => setFilterStatus('active')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${filterStatus === 'active' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700 hover:border-emerald-500/50'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><CheckCircle size={20}/></div>
            <span className="text-2xl font-bold text-slate-100">{activeLines}</span>
          </div>
          <p className="text-sm font-medium text-slate-300">Linee Attive</p>
          <p className="text-xs text-emerald-400 mt-1">98% Retention Rate</p>
        </div>

        <div 
           onClick={() => setFilterStatus('all')}
           className={`p-4 rounded-xl border cursor-pointer transition-all ${filterStatus === 'all' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400"><Zap size={20}/></div>
            <span className="text-2xl font-bold text-slate-100">{trialCount}</span>
          </div>
          <p className="text-sm font-medium text-slate-300">Trial / Test</p>
          <p className="text-xs text-indigo-400 mt-1">In conversione</p>
        </div>
      </div>

      {/* Tabella Scadenze e Gestione */}
      <div className="border bg-slate-800 border-slate-700 rounded-xl overflow-hidden shadow-lg">

         {/* Menu Cliente Selezionato */}
         {selectedClient && (
           <div className="bg-indigo-600/10 border-b border-indigo-500/30 p-4">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                   <Users size={20} className="text-indigo-400" />
                 </div>
                 <div>
                   <h4 className="text-lg font-semibold text-slate-100">{selectedClient}</h4>
                   <p className="text-sm text-slate-400">Abbonamenti attivi: {getClientSubscriptions().length}</p>
                 </div>
               </div>
               <div className="flex gap-2 flex-wrap">
                 <button
                   onClick={() => {
                     const client = clients.find(c => c.name === selectedClient);
                     if (client && onViewClientDetail) onViewClientDetail(client);
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <Eye size={16} /> Visualizza Dettagli
                 </button>
                 <button
                   onClick={() => {
                     const client = clients.find(c => c.name === selectedClient);
                    if (client && onContactWhatsApp) onContactWhatsApp(client);
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <MessageSquare size={16} /> WhatsApp
                 </button>
                 <button
                   onClick={() => onAddSubscription && onAddSubscription()}
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <Plus size={16} /> Nuovo Abbonamento
                 </button>
                 <button
                   onClick={() => {
                     const client = clients.find(c => c.name === selectedClient);
                     if (client && onEditClient) onEditClient(client);
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <Edit size={16} /> Modifica Cliente
                 </button>
                 <button
                   onClick={() => {
                     const client = clients.find(c => c.name === selectedClient);
                     if (client && onDeleteClient) onDeleteClient(client.id);
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <Trash2 size={16} /> Elimina Cliente
                 </button>
                 <button
                   onClick={() => setSelectedClient(null)}
                   className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <X size={16} /> Deseleziona
                 </button>
               </div>
             </div>
           </div>
         )}

         <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <List size={20} className="text-slate-400"/> Lista Abbonamenti
              {filterStatus !== 'all' && <span className="text-xs font-normal bg-slate-700 px-2 py-0.5 rounded text-slate-300">Filtro: {filterStatus}</span>}
            </h3>
            <div className="flex gap-2 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-none">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                 <input 
                    type="text" 
                    placeholder="Cerca cliente..." 
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
                 />
               </div>
               <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 border border-slate-600">
                 <Filter size={16}/>
               </button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 text-xs uppercase border-b border-slate-700 text-slate-400">
                  <th className="py-4 pl-4 font-semibold w-12">
                    <input type="checkbox" onChange={() => selectAllFiltered(getClientSubscriptions())} checked={getClientSubscriptions().length > 0 && getClientSubscriptions().every(s => selectedSubs.has(s.id))} />
                  </th>
                  <th className="py-4 pl-6 font-semibold w-1/4">Cliente / Utente</th>
                  <th className="py-4 px-4 font-semibold">Piano</th>
                  <th className="py-4 px-4 font-semibold text-center">Stato</th>
                  <th className="py-4 px-4 font-semibold">Scadenza</th>
                  <th className="py-4 px-4 font-semibold text-right pr-6">Azioni Rapide</th>
                </tr>
              </thead>
               <tbody className="text-sm divide-y divide-slate-700/50">
                  {getClientSubscriptions().map(sub => (
                     <tr key={sub.id} className="hover:bg-slate-700/30 transition-colors group">
                       <td className="py-4 pl-4">
                         <input type="checkbox" checked={selectedSubs.has(sub.id)} onChange={() => toggleSelect(sub.id)} />
                       </td>
                        <td className="py-4 pl-6">
                           <div className="flex flex-col">
                             <button
                               onClick={() => selectClient(sub.name)}
                               className={`font-bold text-base transition-colors text-left ${selectedClient === sub.name ? 'text-indigo-400' : 'text-slate-200 hover:text-indigo-400'}`}
                             >
                               {sub.name}
                             </button>
                             <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{sub.username}</span>
                               <span className="text-[10px] text-slate-500 flex items-center gap-1"><Activity size={10}/> {sub.last_seen}</span>
                             </div>
                           </div>
                        </td>
                        <td className="py-4 px-4">
                           <span className="text-slate-300 bg-slate-700/30 px-2.5 py-1 rounded text-xs border border-slate-600/50 font-medium">
                             {sub.plan}
                           </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                           <Badge color={getStatusColor(sub.status)}>
                             {getStatusLabel(sub.status)}
                           </Badge>
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex flex-col">
                              <span className={`font-mono font-medium ${sub.days_left < 0 ? 'text-red-400' : sub.days_left <= 3 ? 'text-yellow-400' : 'text-slate-300'}`}>
                                {sub.expire_date}
                              </span>
                              <span className={`text-xs font-bold mt-0.5 ${sub.days_left < 0 ? 'text-red-500' : sub.days_left <= 3 ? 'text-yellow-500' : 'text-slate-500'}`}>
                                {sub.days_left < 0 ? `SCADUTO DA ${Math.abs(sub.days_left)} GG` : sub.days_left === 0 ? 'SCADE OGGI' : `${sub.days_left} giorni rimanenti`}
                              </span>
                           </div>
                        </td>
                        <td className="py-4 pr-6 text-right">
                           <div className="flex justify-end gap-2 opacity-100">
                              {/* Action Buttons */}
                              {sub.status === 'expired' || sub.status === 'expiring' ? (
                                <>
                                  <button onClick={() => onNotifySubscription && onNotifySubscription(sub)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded shadow-sm transition-colors" title="Invia Messaggio WhatsApp">
                                    <MessageSquare size={14} /> Avvisa
                                  </button>
                                  <button onClick={() => onRenewSubscription && onRenewSubscription(sub)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded shadow-sm transition-colors" title="Rinnovo Rapido">
                                    <RefreshCw size={14} /> Rinnova
                                  </button>
                                </>
                              ) : null}
                              <button onClick={() => onEditSubscription && onEditSubscription(sub)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors" title="Modifica Abbonamento">
                                 <Edit size={16}/>
                              </button>
                              <button onClick={() => onDeleteSubscription && onDeleteSubscription(sub.id)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors" title="Elimina Abbonamento">
                                 <Trash2 size={16}/>
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {filteredSubs.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                <AlertCircle size={48} className="mx-auto mb-3 opacity-20"/>
                <p>Nessun abbonamento trovato con questo filtro.</p>
              </div>
            )}
         </div>
         {/* Footer Tabella */}
         <div className="p-3 bg-slate-800/80 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
           <span>Mostrati {filteredSubs.length} risultati</span>
           <div className="flex gap-2">
             <button className="hover:text-white">Precedente</button>
             <button className="hover:text-white">Successivo</button>
           </div>
         </div>
      </div>
    </div>
  );
};

// --- VISTA CLIENTI & LEAD ---

const ClientsLeadsView = ({ 
  onSelectClient, 
  clients, 
  leads, 
  onExportCSV, 
  onOpenModal, 
  onDeleteClient, 
  onContactWhatsApp,
  onEditClient,
  onViewClientDetail,
  onConvertLeadToClient,
  onUpdateLeadStatus
}) => {
  const [viewMode, setViewMode] = useState('clients'); // 'clients' | 'leads'
  const [menuOpen, setMenuOpen] = useState(null);

  // Chiudi il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.menu-container')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Pagina */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Gestione Clienti & Lead</h2>
          <p className="text-slate-400">Database contatti e pipeline di vendita</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => onOpenModal()} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors w-full md:w-auto">
            <Plus size={18} />
            <span className="hidden md:inline">Nuovo Contatto</span>
            <span className="md:hidden">Nuovo</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigazione Interna */}
      <div className="flex items-center gap-4 border-b border-slate-700">
        <button 
          onClick={() => setViewMode('clients')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'clients' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Users size={18} /> Base Clienti
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full ml-1">{clients.length}</span>
        </button>
        <button 
          onClick={() => setViewMode('leads')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'leads' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Columns size={18} /> Pipeline Lead (Kanban)
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full ml-1">{MOCK_LEADS.length}</span>
        </button>
      </div>

      {/* CONTENUTO: LISTA CLIENTI */}
      {viewMode === 'clients' && (
        <div className="space-y-4">
          {/* Filtri */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Cerca per nome, email o telefono..." 
                className="w-full h-10 pl-9 pr-4 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-700">
              <Filter size={16} /> Filtri Avanzati
            </button>
             <button onClick={() => onExportCSV(clients, 'clienti')} className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-700">
              <Download size={16} /> Export CSV
            </button>
          </div>

          <div className="border bg-slate-800 border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 text-xs uppercase border-b border-slate-700 text-slate-400">
                    <th className="py-4 pl-4 font-semibold">Cliente</th>
                    <th className="py-4 px-2 font-semibold">Stato</th>
                    <th className="py-4 px-2 font-semibold">Tipo</th>
                    <th className="py-4 px-2 font-semibold text-center">Servizi</th>
                    <th className="py-4 px-2 font-semibold text-right pr-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-700/50">
                  {clients.map(c => (
                    <tr key={c.id} onClick={() => onSelectClient(c)} className="hover:bg-slate-700/30 cursor-pointer transition-colors group">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm border border-slate-600">
                            {c.avatar}
                          </div>
                          <div>
                            <p className="text-slate-200 font-medium group-hover:text-indigo-400 transition-colors">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge color={c.status === 'active' ? 'green' : c.status === 'warning' ? 'yellow' : 'red'}>
                          {c.status === 'active' ? 'Attivo' : c.status === 'warning' ? 'In Scadenza' : 'Scaduto'}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-slate-400 text-sm">{c.type}</span>
                      </td>
                      <td className="py-4 px-2 text-center">
                         <div className="flex items-center justify-center gap-2">
                            {c.iptv && <Tv size={16} className="text-violet-400" title="IPTV Attiva" />}
                            {c.finance && <CreditCard size={16} className="text-emerald-400" title="Conto Finance" />}
                         </div>
                      </td>
                      <td className="py-4 pr-4 text-right relative">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setMenuOpen(menuOpen === c.id ? null : c.id);
                           }}
                           className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                         >
                            <MoreHorizontal size={18} />
                         </button>
                         {menuOpen === c.id && (
                           <div className="menu-container absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onEditClient(c);
                                 setMenuOpen(null);
                               }}
                               className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                             >
                               <Edit size={16} /> Modifica
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onViewClientDetail(c);
                                 setMenuOpen(null);
                               }}
                               className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                             >
                               <Eye size={16} /> Visualizza Dettagli
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onContactWhatsApp(c);
                                 setMenuOpen(null);
                               }}
                               className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                             >
                               <MessageCircle size={16} /> WhatsApp
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onDeleteClient(c.id);
                                 setMenuOpen(null);
                               }}
                               className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2"
                             >
                               <Trash2 size={16} /> Elimina
                             </button>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTENUTO: PIPELINE LEAD (KANBAN) */}
      {viewMode === 'leads' && (
        <div className="h-[calc(100vh-250px)] overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1000px] h-full">
            {LEAD_STATUSES.map(status => {
              const leadsInStatus = leads.filter(l => l.status === status.id);
              return (
                <div key={status.id} className="flex-1 min-w-[280px] flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-xl h-full">
                  {/* Colonna Header */}
                  <div className={`p-3 border-b border-slate-700 rounded-t-xl flex justify-between items-center ${status.color.replace('text-', 'bg-').split(' ')[0].replace('/10','/5')}`}>
                    <h3 className={`font-semibold text-sm ${status.color.split(' ')[1]}`}>{status.label}</h3>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">{leadsInStatus.length}</span>
                  </div>

                  {/* Colonna Body (Drag Area) */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {leadsInStatus.map(lead => (
                      <div key={lead.id} className="p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                        <div className="flex justify-between items-start mb-2 relative">
                          <h4 className="font-medium text-slate-200">{lead.name}</h4>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === `lead-${lead.id}` ? null : `lead-${lead.id}`);
                            }}
                            className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {menuOpen === `lead-${lead.id}` && (
                            <div className="absolute right-0 top-6 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                              {status.id !== 'new' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const prevStatus = LEAD_STATUSES.find(s => s.id === status.id);
                                    const prevIndex = LEAD_STATUSES.indexOf(prevStatus);
                                    if (prevIndex > 0) {
                                      onUpdateLeadStatus(lead.id, LEAD_STATUSES[prevIndex - 1].id);
                                    }
                                    setMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                >
                                  <ArrowLeft size={16} /> Sposta Indietro
                                </button>
                              )}
                              {status.id !== 'negotiating' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentStatus = LEAD_STATUSES.find(s => s.id === status.id);
                                    const currentIndex = LEAD_STATUSES.indexOf(currentStatus);
                                    if (currentIndex < LEAD_STATUSES.length - 1) {
                                      onUpdateLeadStatus(lead.id, LEAD_STATUSES[currentIndex + 1].id);
                                    }
                                    setMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                >
                                  <ArrowRight size={16} /> Sposta Avanti
                                </button>
                              )}
                              <div className="border-t border-slate-700 my-1"></div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onConvertLeadToClient(lead);
                                  setMenuOpen(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 flex items-center gap-2"
                              >
                                <UserPlus size={16} /> Converti in Cliente
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 border border-slate-600">{lead.source}</span>
                          <span className="text-xs text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">{lead.interest}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-2">
                           <div className="flex gap-2">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const phoneNumber = lead.phone.replace(/\s+/g, '').replace(/^\+39/, '');
                                 window.open(`https://wa.me/${phoneNumber}`, '_blank');
                               }}
                               className="text-slate-400 hover:text-green-400 transition-colors" 
                               title="WhatsApp"
                             >
                               <MessageSquare size={14} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 window.open(`mailto:${lead.email}`, '_blank');
                               }}
                               className="text-slate-400 hover:text-blue-400 transition-colors" 
                               title="Email"
                             >
                               <Mail size={14} />
                             </button>
                           </div>
                           <div className="flex items-center gap-1 text-xs text-slate-500">
                             <Clock size={12} /> {lead.time}
                           </div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 text-xs font-medium text-slate-500 border border-dashed border-slate-700 rounded-lg hover:bg-slate-700/50 hover:text-slate-300 transition-colors">
                      + Aggiungi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODAL CLIENTE ---
const ClientModal = ({ isOpen, onClose, onSave, client, formData, onFormChange }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {client ? 'Modifica Cliente' : 'Nuovo Cliente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informazioni Base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => onFormChange({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => onFormChange({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Telefono</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => onFormChange({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo Cliente</label>
              <select
                value={formData.type || 'Standard'}
                onChange={(e) => onFormChange({...formData, type: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Standard">Standard</option>
                <option value="Reseller">Reseller</option>
              </select>
            </div>
          </div>

          {/* IPTV Credentials */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Credenziali IPTV</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username IPTV</label>
                <input
                  type="text"
                  value={formData.iptv?.username || ''}
                  onChange={(e) => onFormChange({
                    ...formData,
                    iptv: {...formData.iptv, username: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Data Scadenza</label>
                <input
                  type="date"
                  value={formData.iptv?.expireDate || ''}
                  onChange={(e) => onFormChange({
                    ...formData,
                    iptv: {...formData.iptv, expireDate: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">MAC Address</label>
                <input
                  type="text"
                  value={formData.iptv?.mac || ''}
                  onChange={(e) => onFormChange({
                    ...formData,
                    iptv: {...formData.iptv, mac: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="00:1A:79:44:2B:11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Piano</label>
                <input
                  type="text"
                  value={formData.iptv?.plan || ''}
                  onChange={(e) => onFormChange({
                    ...formData,
                    iptv: {...formData.iptv, plan: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Full Sport + Cinema 4K"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Connessioni</label>
                <input
                  type="number"
                  value={formData.iptv?.connections || 1}
                  onChange={(e) => onFormChange({
                    ...formData,
                    iptv: {...formData.iptv, connections: parseInt(e.target.value)}
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => onFormChange({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="Note aggiuntive sul cliente..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {client ? 'Salva Modifiche' : 'Crea Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL DETTAGLI CLIENTE ---
const ClientDetailModal = ({ isOpen, onClose, client, onEdit }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg border border-slate-600">
              {client.avatar}
            </div>
            Dettagli Cliente: {client.name}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informazioni Base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Informazioni Base</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Nome Completo:</span>
                <span className="text-white font-medium">{client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{client.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telefono:</span>
                <span className="text-white">{client.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo Cliente:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.type === 'Reseller' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {client.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stato:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active' ? 'bg-green-600 text-white' :
                  client.status === 'warning' ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {client.status === 'active' ? 'Attivo' :
                   client.status === 'warning' ? 'In Scadenza' : 'Scaduto'}
                </span>
              </div>
            </div>
          </div>

          {/* Credenziali IPTV */}
          {client.iptv && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Credenziali IPTV</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Username:</span>
                  <span className="text-white font-mono">{client.iptv.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Scadenza:</span>
                  <span className="text-white">{client.iptv.expireDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MAC Address:</span>
                  <span className="text-white font-mono">{client.iptv.mac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Piano:</span>
                  <span className="text-white">{client.iptv.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Connessioni:</span>
                  <span className="text-white">{client.iptv.connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ultimo IP:</span>
                  <span className="text-white font-mono text-sm">{client.iptv.lastIp}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagamenti */}
        {client.payments && client.payments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Storico Pagamenti</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2 px-2 text-slate-400">Data</th>
                    <th className="py-2 px-2 text-slate-400">Servizio</th>
                    <th className="py-2 px-2 text-slate-400">Importo</th>
                    <th className="py-2 px-2 text-slate-400">Metodo</th>
                    <th className="py-2 px-2 text-slate-400">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {client.payments.map(payment => (
                    <tr key={payment.id} className="border-b border-slate-700/50">
                      <td className="py-2 px-2 text-slate-300">{payment.date}</td>
                      <td className="py-2 px-2 text-slate-300">{payment.item}</td>
                      <td className="py-2 px-2 text-white font-medium">€{payment.amount}</td>
                      <td className="py-2 px-2 text-slate-300">{payment.method}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                        }`}>
                          {payment.status === 'completed' ? 'Completato' : 'In Corso'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note */}
        {client.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Note</h3>
            <p className="text-slate-300 bg-slate-700/50 p-3 rounded-lg">{client.notes}</p>
          </div>
        )}

        {/* Azioni */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => onEdit && onEdit(client)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} /> Modifica Cliente
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`https://wa.me/${client.phone.replace(/\s+/g, '').replace(/^\+39/, '')}`, '_blank')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NUOVA VISTA CALCOLO FINANZA (Rifatta come richiesto) ---

const FinanceCalculatorView = ({ 
  clients, 
  subscriptions, 
  subscriptionPlans, 
  onOpenPlanModal,
  onDeletePlan
}) => {
  const [calcPrice, setCalcPrice] = useState(10);
  const [calcCost, setCalcCost] = useState(2);
  const [accountingData, setAccountingData] = useState([]);
  const [productMargins, setProductMargins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  // Calcola statistiche automaticamente dai dati esistenti
  const calculateStats = () => {
    const currentMonth = selectedPeriod;

    // Calcola ricavi da pagamenti clienti
    const totalRevenue = clients.reduce((sum, client) => {
      if (client.payments && Array.isArray(client.payments)) {
        return sum + client.payments
          .filter(payment => payment.status === 'completed' && payment.date.startsWith(currentMonth))
          .reduce((clientSum, payment) => clientSum + payment.amount, 0);
      }
      return sum;
    }, 0);

    // Calcola costi stimati (server + crediti)
    const serverCost = 150; // Costo fisso mensile server
    const creditCostPerSubscription = 2; // Costo per abbonamento attivo
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const totalCreditCost = activeSubscriptions * creditCostPerSubscription;
    const totalExpenses = serverCost + totalCreditCost;

    // Calcola utile netto
    const netProfit = totalRevenue - totalExpenses;
    const avgMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      avgMargin,
      activeSubscriptions,
      serverCost,
      creditCost: totalCreditCost
    };
  };

  // Carica dati contabili da Supabase
  const loadAccountingData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Carica dati contabili
      const { data: accounting, error: accountingError } = await supabase
        .from('accounting')
        .select('*')
        .eq('period', selectedPeriod)
        .order('transaction_date', { ascending: false });

      if (accountingError) throw accountingError;
      setAccountingData(accounting || []);

      // Carica margini prodotti
      const { data: margins, error: marginsError } = await supabase
        .from('product_margins')
        .select('*')
        .eq('is_active', true)
        .order('total_profit', { ascending: false });

      if (marginsError) throw marginsError;
      setProductMargins(margins || []);

    } catch (err) {
      console.error('Error loading accounting data:', err);
      // Fallback ai dati calcolati automaticamente
      setAccountingData([]);
      setProductMargins([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  // Sincronizza dati calcolati con Supabase
  const syncAccountingData = async () => {
    try {
      const stats = calculateStats();
      const currentMonth = selectedPeriod;

      // Crea record contabili per il mese corrente
      const accountingRecords = [
        {
          id: Date.now(),
          period: currentMonth,
          type: 'income',
          category: 'subscription',
          description: `Ricavi abbonamenti ${currentMonth}`,
          amount: stats.totalRevenue,
          transaction_date: `${currentMonth}-01`
        },
        {
          id: Date.now() + 1,
          period: currentMonth,
          type: 'expense',
          category: 'server_cost',
          description: `Costo server ${currentMonth}`,
          amount: -stats.serverCost,
          transaction_date: `${currentMonth}-01`
        },
        {
          id: Date.now() + 2,
          period: currentMonth,
          type: 'expense',
          category: 'credit_cost',
          description: `Costo crediti IPTV ${currentMonth}`,
          amount: -stats.creditCost,
          transaction_date: `${currentMonth}-01`
        },
        {
          id: Date.now() + 3,
          period: currentMonth,
          type: 'profit',
          category: 'net_profit',
          description: `Utile netto ${currentMonth}`,
          amount: stats.netProfit,
          transaction_date: `${currentMonth}-01`
        }
      ];

      // Salva in Supabase
      const { error } = await supabase
        .from('accounting')
        .upsert(accountingRecords, { onConflict: 'id' });

      if (error) throw error;

      // Ricarica dati
      await loadAccountingData();
      alert('Dati contabili sincronizzati con successo!');

    } catch (err) {
      console.error('Error syncing accounting data:', err);
      alert('Errore nella sincronizzazione: ' + err.message);
    }
  };

  // Carica dati quando cambia il periodo
  useEffect(() => {
    loadAccountingData();
  }, [selectedPeriod, loadAccountingData]);

  const profit = calcPrice - calcCost;
  const margin = calcPrice > 0 ? ((profit / calcPrice) * 100).toFixed(1) : 0;
  const stats = calculateStats();

  

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Contabilità & Margini</h2>
          <p className="text-slate-400">Analisi automatica profitti e calcolo guadagni prodotti</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {Array.from({length: 12}, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const value = date.toISOString().slice(0, 7);
              const label = date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
              return <option key={value} value={value}>{label}</option>;
            })}
          </select>
          <button
            onClick={syncAccountingData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Sincronizza
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700">Scarica Report CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calcolatore Rapido */}
        <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-indigo-400" size={20}/>
                <h3 className="text-lg font-semibold text-slate-100">Simulatore Guadagno</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold">Prezzo Vendita (€)</label>
                    <input
                        type="number"
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(Number(e.target.value))}
                        className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold">Costo Fornitore/Credito (€)</label>
                    <input
                        type="number"
                        value={calcCost}
                        onChange={(e) => setCalcCost(Number(e.target.value))}
                        className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">Profitto Netto</span>
                        <span className="text-xl font-bold text-emerald-400">+ € {profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Margine %</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${Number(margin) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {margin}%
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Overview Totale */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 border bg-slate-800 border-slate-700 rounded-xl flex flex-col justify-between">
                <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">Incasso Totale ({selectedPeriod})</p>
                    <h3 className="text-2xl font-bold text-white mt-2">€ {stats.totalRevenue.toLocaleString('it-IT', {minimumFractionDigits: 2})}</h3>
                </div>
                <div className="mt-4">
                    <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                      {stats.activeSubscriptions} abbonamenti attivi
                    </span>
                </div>
            </div>
            <div className="p-5 border bg-slate-800 border-slate-700 rounded-xl flex flex-col justify-between">
                <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">Spese (Server + Crediti)</p>
                    <h3 className="text-2xl font-bold text-white mt-2">€ {stats.totalExpenses.toLocaleString('it-IT', {minimumFractionDigits: 2})}</h3>
                </div>
                <div className="mt-4">
                    <span className="text-slate-400 text-xs">Server: €{stats.serverCost} | Crediti: €{stats.creditCost}</span>
                </div>
            </div>
             <div className="p-5 border bg-gradient-to-br from-indigo-900 to-slate-800 border-indigo-500/30 rounded-xl flex flex-col justify-between shadow-lg shadow-indigo-500/10">
                <div>
                    <p className="text-indigo-200 text-xs uppercase font-bold">Utile Netto</p>
                    <h3 className="text-3xl font-bold text-white mt-2">€ {stats.netProfit.toLocaleString('it-IT', {minimumFractionDigits: 2})}</h3>
                </div>
                <div className="mt-4">
                    <span className="text-indigo-200 text-xs">Margine medio: {stats.avgMargin.toFixed(1)}%</span>
                </div>
            </div>
        </div>
      </div>

      {/* Tabella Performance Prodotti */}
      <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Analisi Profittabilità Prodotti</h3>
          {isLoading ? (
            <div className="text-center py-8 text-slate-400">Caricamento dati...</div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs uppercase border-b border-slate-700 text-slate-400">
                            <th className="pb-3 pl-2">Prodotto / Piano</th>
                            <th className="pb-3 text-right">Venduti</th>
                            <th className="pb-3 text-right">Prezzo Unit.</th>
                            <th className="pb-3 text-right">Costo Unit.</th>
                            <th className="pb-3 text-right">Profitto Totale</th>
                            <th className="pb-3 text-right">ROI</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {productMargins.length > 0 ? productMargins.map(product => {
                            const roi = product.cost_price > 0 ? (((product.selling_price - product.cost_price) / product.cost_price) * 100).toFixed(0) : 0;
                            return (
                              <tr key={product.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                                  <td className="py-3 pl-2 font-medium text-slate-200">{product.product_name}</td>
                                  <td className="py-3 text-right text-slate-300">{product.total_sold}</td>
                                  <td className="py-3 text-right text-slate-300">€ {product.selling_price.toFixed(2)}</td>
                                  <td className="py-3 text-right text-red-300/80">- € {product.cost_price.toFixed(2)}</td>
                                  <td className="py-3 text-right font-bold text-emerald-400">+ € {product.total_profit.toLocaleString('it-IT', {minimumFractionDigits: 2})}</td>
                                  <td className="py-3 text-right">
                                      <span className="px-2 py-1 text-xs font-medium rounded bg-slate-700 text-indigo-300">{roi}%</span>
                                  </td>
                              </tr>
                            );
                        }) : (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-slate-400">
                              Nessun dato disponibile. Clicca "Sincronizza" per calcolare automaticamente i margini dai tuoi dati.
                            </td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
          )}
      </div>

      {/* Gestione Piani Abbonamento */}
      <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Gestione Piani Abbonamento</h3>
            <button
              onClick={() => onOpenPlanModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Nuovo Piano
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase border-b border-slate-700 text-slate-400">
                  <th className="pb-3 pl-2">Nome Piano</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3 text-right">Prezzo</th>
                  <th className="pb-3 text-right">Costo</th>
                  <th className="pb-3 text-right">Margine</th>
                  <th className="pb-3 text-center">Stato</th>
                  <th className="pb-3 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {subscriptionPlans.length > 0 ? subscriptionPlans.map(plan => {
                  const margin = plan.price > 0 ? (((plan.price - plan.cost) / plan.price) * 100).toFixed(1) : 0;
                  return (
                    <tr key={plan.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 pl-2 font-medium text-slate-200">{plan.name}</td>
                      <td className="py-3 text-slate-300 capitalize">{plan.category}</td>
                      <td className="py-3 text-right text-slate-300">€ {plan.price.toFixed(2)}</td>
                      <td className="py-3 text-right text-red-300/80">€ {plan.cost.toFixed(2)}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">{margin}%</td>
                      <td className="py-3 text-center">
                        <Badge color={plan.is_active ? 'green' : 'red'}>
                          {plan.is_active ? 'Attivo' : 'Disattivo'}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => onOpenPlanModal(plan)}
                            className="px-2 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded transition-all duration-200"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => onDeletePlan(plan.id)}
                            className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-all duration-200"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      Nessun piano abbonamento trovato. Clicca "Nuovo Piano" per creare il primo piano.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Transazioni Recenti */}
      <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Transazioni {selectedPeriod}</h3>
          {isLoading ? (
            <div className="text-center py-8 text-slate-400">Caricamento transazioni...</div>
          ) : accountingData.length > 0 ? (
            <div className="space-y-3">
              {accountingData.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : transaction.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {transaction.type === 'income' ? <TrendingUp size={16} /> : transaction.type === 'expense' ? <DollarSign size={16} /> : <Calculator size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{transaction.description}</p>
                      <p className="text-xs text-slate-400">{transaction.category} • {new Date(transaction.transaction_date).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {transaction.amount >= 0 ? '+' : ''}€{Math.abs(transaction.amount).toLocaleString('it-IT', {minimumFractionDigits: 2})}
                    </p>
                    {transaction.payment_method && (
                      <p className="text-xs text-slate-400 capitalize">{transaction.payment_method}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              Nessuna transazione registrata per questo periodo. Clicca "Sincronizza" per calcolare automaticamente dalle tue vendite.
            </div>
          )}
      </div>
    </div>
  );
};

const DashboardView = ({ onSelectClient, clients, onBotAction, stats }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [clientTypeData, setClientTypeData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // Recupera dati ricavi mensili da Supabase
  const fetchRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('accounting')
        .select('period, type, amount')
        .order('period');

      if (error) throw error;

      // Raggruppa per mese e calcola ricavi, spese e profitti
      const monthlyData = {};
      data.forEach(record => {
        const month = record.period;
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, expenses: 0 };
        }
        if (record.type === 'income') {
          monthlyData[month].revenue += parseFloat(record.amount);
        } else if (record.type === 'expense') {
          monthlyData[month].expenses += Math.abs(parseFloat(record.amount));
        }
      });

      // Converte in array per il grafico
      const chartData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month: new Date(month + '-01').toLocaleDateString('it-IT', { month: 'short' }),
          revenue: Math.round(data.revenue),
          expenses: Math.round(data.expenses),
          profit: Math.round(data.revenue - data.expenses)
        }))
        .sort((a, b) => new Date('2024-' + a.month) - new Date('2024-' + b.month));

      setRevenueData(chartData);
    } catch (error) {
      console.error('Errore nel recupero dati ricavi:', error);
      // Fallback ai dati mock se non ci sono dati
      setRevenueData([
        { month: 'Gen', revenue: 8500, expenses: 3200, profit: 5300 },
        { month: 'Feb', revenue: 9200, expenses: 3800, profit: 5400 },
        { month: 'Mar', revenue: 10100, expenses: 4100, profit: 6000 },
        { month: 'Apr', revenue: 11800, expenses: 4500, profit: 7300 },
        { month: 'Mag', revenue: 12400, expenses: 4800, profit: 7600 },
        { month: 'Giu', revenue: 13200, expenses: 5200, profit: 8000 },
      ]);
    }
  };

  // Recupera distribuzione tipi clienti da Supabase
  const fetchClientTypeData = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('type')
        .not('type', 'is', null);

      if (error) throw error;

      // Conta i tipi di clienti
      const typeCount = {};
      data.forEach(client => {
        typeCount[client.type] = (typeCount[client.type] || 0) + 1;
      });

      // Colori per i tipi
      const colors = {
        'Standard': '#3b82f6',
        'Reseller': '#8b5cf6',
        'VIP': '#f59e0b',
        'Trial': '#10b981'
      };

      const chartData = Object.entries(typeCount).map(([name, value]) => ({
        name,
        value,
        color: colors[name] || '#6b7280'
      }));

      setClientTypeData(chartData);
    } catch (error) {
      console.error('Errore nel recupero dati clienti:', error);
      // Fallback ai dati mock
      setClientTypeData([
        { name: 'Standard', value: 65, color: '#3b82f6' },
        { name: 'Reseller', value: 25, color: '#8b5cf6' },
        { name: 'VIP', value: 8, color: '#f59e0b' },
        { name: 'Trial', value: 2, color: '#10b981' },
      ]);
    }
  };

  // Recupera dati sottoscrizioni da Supabase
  const fetchSubscriptionData = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .not('plan', 'is', null);

      if (error) throw error;

      // Raggruppa per piano e status
      const planStats = {};
      data.forEach(sub => {
        if (!planStats[sub.plan]) {
          planStats[sub.plan] = { active: 0, expired: 0 };
        }
        if (sub.status === 'active' || sub.status === 'expiring') {
          planStats[sub.plan].active += 1;
        } else {
          planStats[sub.plan].expired += 1;
        }
      });

      const chartData = Object.entries(planStats).map(([plan, stats]) => ({
        plan: plan.length > 10 ? plan.substring(0, 10) + '...' : plan,
        active: stats.active,
        expired: stats.expired
      }));

      setSubscriptionData(chartData);
    } catch (error) {
      console.error('Errore nel recupero dati sottoscrizioni:', error);
      // Fallback ai dati mock
      setSubscriptionData([
        { plan: 'Full 12M', active: 245, expired: 12 },
        { plan: 'Base 1M', active: 189, expired: 8 },
        { plan: 'Sport', active: 156, expired: 15 },
        { plan: 'Cinema', active: 134, expired: 6 },
        { plan: 'Trial', active: 23, expired: 45 },
      ]);
    }
  };

  // Carica tutti i dati dei grafici
  useEffect(() => {
    const loadChartData = async () => {
      setLoadingCharts(true);
      await Promise.all([
        fetchRevenueData(),
        fetchClientTypeData(),
        fetchSubscriptionData()
      ]);
      setLoadingCharts(false);
    };

    loadChartData();
  }, []);

  // Rimuovi i dati mock statici che erano qui prima
  // const revenueData = [...];
  // const clientTypeData = [...];
  // const subscriptionData = [...];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats con design premium */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative overflow-hidden p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">{stat.label}</span>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  stat.change.startsWith('+')
                    ? 'text-emerald-300 bg-emerald-500/20'
                    : 'text-red-300 bg-red-500/20'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafici principali */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Grafico Ricavi */}
        <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Andamento Ricavi</h3>
          </div>
          {loadingCharts ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Grafico Tipi Clienti */}
        <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Distribuzione Clienti</h3>
          </div>
          {loadingCharts ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Grafico Sottoscrizioni e Tabella Clienti */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Grafico Sottoscrizioni */}
        <div className="lg:col-span-2 p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Tv size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Sottoscrizioni per Piano</h3>
          </div>
          {loadingCharts ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="plan" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend wrapperStyle={{ color: '#f1f5f9' }} />
                <Bar dataKey="active" fill="#10b981" name="Attive" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expired" fill="#ef4444" name="Scadute" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Bot size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Azioni Rapide</h3>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => onBotAction('Invia Promo Scadenza (IPTV)')}
              className="flex items-center justify-between w-full p-4 text-sm text-left transition-all duration-200 border rounded-xl bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600 hover:from-indigo-600/20 hover:to-purple-600/20 hover:border-indigo-500/50 hover:shadow-lg group"
            >
              <span className="text-slate-200 font-medium">📢 Promo Scadenza IPTV</span>
              <MessageSquare size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </button>
            <button
              onClick={() => onBotAction('Report Mercati Crypto')}
              className="flex items-center justify-between w-full p-4 text-sm text-left transition-all duration-200 border rounded-xl bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600 hover:from-emerald-600/20 hover:to-teal-600/20 hover:border-emerald-500/50 hover:shadow-lg group"
            >
              <span className="text-slate-200 font-medium">📈 Report Crypto</span>
              <TrendingUp size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>
            <button
              onClick={() => onBotAction('Alert Manutenzione Server')}
              className="flex items-center justify-between w-full p-4 text-sm text-left transition-all duration-200 border rounded-xl bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600 hover:from-red-600/20 hover:to-pink-600/20 hover:border-red-500/50 hover:shadow-lg group"
            >
              <span className="text-slate-200 font-medium">⚠️ Manutenzione Server</span>
              <AlertTriangle size={18} className="text-slate-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabella Clienti Recenti con design migliorato */}
      <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
            <Users size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Clienti Recenti</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase border-b border-slate-700 text-slate-400">
                <th className="pb-4 pl-2 font-semibold">Cliente</th>
                <th className="pb-4 font-semibold">Tipo</th>
                <th className="pb-4 font-semibold">Stato</th>
                <th className="pb-4 text-right font-semibold">Azione</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {clients.slice(0, 5).map(client => (
                <tr key={client.id} className="border-b border-slate-700/50 last:border-0 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-indigo-900/10 transition-all duration-200">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {client.avatar}
                      </div>
                      <span className="font-medium text-slate-200">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-slate-400">{client.type}</span>
                  </td>
                  <td className="py-4">
                    <Badge color={client.status === 'active' ? 'green' : client.status === 'warning' ? 'yellow' : 'red'}>
                      {client.status === 'active' ? 'Attivo' : 'Scadenza'}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onSelectClient(client)}
                      className="px-3 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-all duration-200"
                    >
                      Gestisci
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- MODAL GESTIONE PIANI ABBONAMENTO ---
const PlanModal = ({ isOpen, onClose, onSave, plan, formData, onFormChange }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign size={24} className="text-indigo-400" />
            {plan ? 'Modifica Piano' : 'Nuovo Piano Abbonamento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nome Piano *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="subscription">Abbonamento</option>
                <option value="trial">Prova</option>
                <option value="commercial">Commerciale</option>
                <option value="addon">Addon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Descrizione</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prezzo (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => onFormChange({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Costo (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => onFormChange({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Margine (%)</label>
              <input
                type="text"
                value={formData.price > 0 ? (((formData.price - formData.cost) / formData.price) * 100).toFixed(1) + '%' : '0%'}
                readOnly
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Durata (mesi) *</label>
              <input
                type="number"
                min="0"
                value={formData.duration_months}
                onChange={(e) => onFormChange({ ...formData, duration_months: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Connessioni Max *</label>
              <input
                type="number"
                min="1"
                value={formData.max_connections}
                onChange={(e) => onFormChange({ ...formData, max_connections: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => onFormChange({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              Piano Attivo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              {plan ? 'Aggiorna Piano' : 'Crea Piano'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientDetailView = ({ client, onBack, onEdit, onAddIptv }) => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, iptv, finance
  const [showAddIptvModal, setShowAddIptvModal] = useState(false);

  if (!client) return null;

  return (
    <div className="animate-fade-in">
      {/* Header Dettaglio */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 transition-colors rounded-lg hover:bg-slate-800 text-slate-400">
            ← Indietro
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {client.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{client.name}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{client.email}</span>
                <span>•</span>
                <span>{client.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => onEdit && onEdit(client)}
             className="px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-500"
           >
             Modifica
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Profilo & Note
        </button>
        <button 
          onClick={() => setActiveTab('iptv')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'iptv' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Tv size={16} /> IPTV Manager
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'finance' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <CreditCard size={16} /> Pagamenti & Storico
        </button>
      </div>

      {/* Contenuto Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TAB PROFILO */}
        {activeTab === 'profile' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-slate-100">Dettagli Anagrafica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400">Codice Cliente</p>
                    <p className="font-mono text-slate-200">CLI-{client.id}99X</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400">Data Iscrizione</p>
                    <p className="text-slate-200">12 Gen 2023</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400">Canale Acquisizione</p>
                    <p className="text-slate-200">Referral Telegram</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-400">Trust Score</p>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle size={14} /> 98/100
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl h-fit">
              <h3 className="mb-4 text-lg font-semibold text-slate-100">Note Interne</h3>
              <textarea 
                className="w-full h-32 p-3 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-300 focus:border-indigo-500 focus:outline-none resize-none"
                defaultValue={client.notes}
              ></textarea>
              <button className="w-full mt-3 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600">
                Salva Note
              </button>
            </div>
          </>
        )}

        {/* TAB IPTV */}
        {activeTab === 'iptv' && (
          client.iptv ? (
            <>
              <div className="lg:col-span-2 space-y-6">
                {/* Stato Linea e Credenziali */}
                <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Tv size={100} />
                  </div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">Dettagli Linea</h3>
                      <p className="text-slate-400 text-sm">Abbonamento: <span className="text-violet-400">{client.iptv.plan}</span></p>
                    </div>
                    <Badge color={client.iptv.status === 'active' ? 'green' : 'red'}>
                      {client.iptv.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4 mb-6 relative z-10">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-900/50 border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-800 text-slate-400"><Users size={16}/></div>
                        <div>
                          <p className="text-xs text-slate-500">Username</p>
                          <p className="font-mono text-sm text-slate-200">{client.iptv.username}</p>
                        </div>
                      </div>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300">Copia</button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-900/50 border-slate-700">
                       <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-800 text-slate-400"><Wifi size={16}/></div>
                        <div>
                          <p className="text-xs text-slate-500">MAC Address</p>
                          <p className="font-mono text-sm text-slate-200">{client.iptv.mac}</p>
                        </div>
                      </div>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300">Reset</button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-900/50 border-slate-700">
                       <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-800 text-slate-400"><Download size={16}/></div>
                        <div>
                          <p className="text-xs text-slate-500">Playlist M3U</p>
                          <p className="font-mono text-xs text-slate-400 truncate w-48">http://line.server-cdn.com/get.php...</p>
                        </div>
                      </div>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300">Invia</button>
                    </div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <button className="flex-1 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 flex items-center justify-center gap-2">
                       <RefreshCw size={16} /> Estendi 12 Mesi
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2">
                       Estendi 1 Mese
                    </button>
                     <button className="px-3 py-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 border border-red-500/20">
                       <Ban size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 {/* Statistiche Tecniche */}
                <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                  <h3 className="mb-4 text-sm font-semibold uppercase text-slate-400 tracking-wider">Monitoraggio</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Scadenza</span>
                        <span className="text-slate-200">{client.iptv.expireDate}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-1">Ultimo Accesso</p>
                      <p className="text-sm text-slate-200 font-mono">{client.iptv.lastIp}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                       <p className="text-xs text-slate-500 mb-1">Connessioni Attive</p>
                       <p className="text-sm text-slate-200 font-mono">{client.iptv.connections} / 2 Max</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-3 py-12 text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
              <Tv size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nessun servizio IPTV attivo per questo cliente.</p>
              <button 
                onClick={() => setShowAddIptvModal(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300"
              >
                + Attiva Nuova Linea
              </button>
            </div>
          )
        )}

        {/* TAB FINANZA (STORICO PAGAMENTI) */}
        {activeTab === 'finance' && (
           <>
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-slate-100">Storico Pagamenti</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs uppercase border-b border-slate-700 text-slate-400">
                          <th className="pb-3 pl-2">Data</th>
                          <th className="pb-3">Servizio</th>
                          <th className="pb-3">Metodo</th>
                          <th className="pb-3 text-right">Importo</th>
                          <th className="pb-3 text-right">Stato</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {client.payments && client.payments.map(pay => (
                          <tr key={pay.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                            <td className="py-3 pl-2 text-slate-400">{pay.date}</td>
                            <td className="py-3 font-medium text-slate-200">{pay.item}</td>
                            <td className="py-3 text-slate-400">{pay.method}</td>
                            <td className="py-3 text-right font-bold text-slate-200">€ {pay.amount.toFixed(2)}</td>
                            <td className="py-3 text-right">
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Pagato</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!client.payments && <p className="text-slate-500 text-center py-4">Nessun pagamento registrato.</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 {/* Valore Cliente */}
                 <div className="p-6 border bg-slate-800 border-slate-700 rounded-xl">
                    <h3 className="mb-4 text-sm font-semibold uppercase text-slate-400 tracking-wider">Statistiche Cliente</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 uppercase">Lifetime Value</p>
                        <p className="text-2xl font-bold text-emerald-300">
                          € {client.payments ? client.payments.reduce((acc, curr) => acc + curr.amount, 0) : 0}
                        </p>
                        <p className="text-xs text-emerald-500/70 mt-1">Totale speso da quando è cliente</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-slate-700/30">
                         <p className="text-xs text-slate-400 uppercase">Media Scontrino</p>
                         <p className="text-xl font-bold text-slate-200">€ 55.00</p>
                      </div>
                    </div>
                    
                    <button className="w-full mt-6 py-2 text-sm text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 flex items-center justify-center gap-2">
                      <FileText size={16} /> Invia Estratto Conto
                    </button>
                 </div>
              </div>
           </>
        )}
      </div>

      {/* Add IPTV Modal */}
      <AddIptvModal
        isOpen={showAddIptvModal}
        onClose={() => setShowAddIptvModal(false)}
        onSave={onAddIptv}
        client={client}
      />
    </div>
  );
};

// --- MODAL AGGIUNGI LINEA IPTV ---
const AddIptvModal = ({ isOpen, onClose, onSave, client }) => {
  const [iptvData, setIptvData] = useState({
    username: '',
    expireDate: '',
    mac: '',
    plan: '',
    connections: 1
  });
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client && client.id) {
      onSave(client.id, iptvData);
    } else {
      onSave(null, {...iptvData, ownerName, phone: ownerPhone});
    }
    setIptvData({
      username: '',
      expireDate: '',
      mac: '',
      plan: '',
      connections: 1
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tv size={24} className="text-violet-400" />
            Aggiungi Linea IPTV
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username IPTV</label>
            <input
              type="text"
              value={iptvData.username}
              onChange={(e) => setIptvData({...iptvData, username: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="es. mario_tv_2024"
              required
            />
          </div>

            {!client && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome Cliente</label>
                  <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Nome cliente" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Telefono Cliente</label>
                  <input type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="+39 333 1234567" />
                </div>
              </>
            )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Data Scadenza</label>
            <input
              type="date"
              value={iptvData.expireDate}
              onChange={(e) => setIptvData({...iptvData, expireDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">MAC Address</label>
            <input
              type="text"
              value={iptvData.mac}
              onChange={(e) => setIptvData({...iptvData, mac: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="00:1A:79:44:2B:11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Piano</label>
            <select
              value={iptvData.plan}
              onChange={(e) => setIptvData({...iptvData, plan: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Seleziona un piano</option>
              <option value="Base SD">Base SD</option>
              <option value="Full Sport + Cinema 4K">Full Sport + Cinema 4K</option>
              <option value="Premium All Inclusive">Premium All Inclusive</option>
              <option value="Reseller Package">Reseller Package</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Connessioni</label>
            <input
              type="number"
              value={iptvData.connections}
              onChange={(e) => setIptvData({...iptvData, connections: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              min="1"
              max="5"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Aggiungi Linea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- APP MAIN COMPONENT ---

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, clients, settings, finance, iptv
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState([]);
  const [showClientDetailModal, setShowClientDetailModal] = useState(false);
  const [selectedClientDetail, setSelectedClientDetail] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    status: 'active',
    type: 'Standard',
    iptv: {
      username: '',
      expireDate: '',
      status: 'active',
      mac: '',
      plan: '',
      connections: 1,
      lastIp: '',
      m3uUrl: '',
      password: ''
    },
    payments: [],
    notes: ''
  });

  const [settings, setSettings] = useState({
    crmName: 'OmniFlow CRM',
    supportEmail: 'support@omniflow.com',
    language: 'Italiano',
    currency: 'EUR (€)',
    security: {
      twoFA: false
    },
    integrations: {
      xtreamUrl: '',
      xtreamUsername: '',
      xtreamPassword: '',
      telegramToken: ''
    },
    billing: {
      paypal: '',
      bitcoin: '',
      usdt: ''
    }
  });

  // Subscriptions state (replaces usage of MOCK_SUBSCRIPTIONS for live sync)
  const [subscriptions, setSubscriptions] = useState([]);

  // Subscription plans state
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const [showMassReminderModal, setShowMassReminderModal] = useState(false);
  const [showAddIptvModal, setShowAddIptvModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  // Plan modal state (single source of truth for plan CRUD)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    category: 'subscription',
    description: '',
    price: 0,
    cost: 0,
    duration_months: 1,
    max_connections: 1,
    is_active: true
  });

  const openPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({
        name: plan.name || '',
        category: plan.category || 'subscription',
        description: plan.description || '',
        price: plan.price || 0,
        cost: plan.cost || 0,
        duration_months: plan.duration_months || 1,
        max_connections: plan.max_connections || 1,
        is_active: typeof plan.is_active === 'boolean' ? plan.is_active : true
      });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: '',
        category: 'subscription',
        description: '',
        price: 0,
        cost: 0,
        duration_months: 1,
        max_connections: 1,
        is_active: true
      });
    }
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
    setEditingPlan(null);
    setPlanFormData({
      name: '',
      category: 'subscription',
      description: '',
      price: 0,
      cost: 0,
      duration_months: 1,
      max_connections: 1,
      is_active: true
    });
  };

  const handlePlanSave = async () => {
    try {
      if (editingPlan && editingPlan.id) {
        const { data, error } = await supabase
          .from('subscription_plans')
          .update({ ...planFormData, updated_at: new Date() })
          .eq('id', editingPlan.id)
          .select();
        if (error) throw error;
        if (Array.isArray(data) && data.length) {
          setSubscriptionPlans(prev => prev.map(p => (p.id === editingPlan.id ? data[0] : p)));
        }
      } else {
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert([{ ...planFormData }])
          .select();
        if (error) throw error;
        if (Array.isArray(data) && data.length) {
          setSubscriptionPlans(prev => [...prev, ...data]);
        }
      }
      closePlanModal();
    } catch (err) {
      console.error('Error saving plan:', err);
      const errorMsg = err?.code === 'PGRST116' || err?.message?.includes('404')
        ? 'La tabella subscription_plans non esiste. Eseguire lo schema SQL in Supabase.'
        : 'Errore durante il salvataggio del piano.';
      window.alert(errorMsg);
    }
  };

  const deleteSubscriptionPlan = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo piano?')) return;
    try {
      const { error } = await supabase.from('subscription_plans').delete().eq('id', id);
      if (error) throw error;
      setSubscriptionPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting plan:', err);
      const errorMsg = err?.code === 'PGRST116' || err?.message?.includes('404')
        ? 'La tabella subscription_plans non esiste. Eseguire lo schema SQL in Supabase.'
        : 'Errore durante l\'eliminazione del piano.';
      window.alert(errorMsg);
    }
  };

  // Fetch data from Supabase
  const fetchSupabaseData = async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*');
      if (leadsError) throw leadsError;
      setLeads(leadsData || []);

      const { data: subsData, error: subsError } = await supabase.from('subscriptions').select('*');
      if (subsError) throw subsError;
      setSubscriptions(subsData || []);

      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase.from('dashboard_stats').select('*');
      if (statsError) throw statsError;
      if (statsData) {
        const mappedStats = statsData.map(item => {
          let icon, color, label;
          switch (item.metric) {
            case 'total_clients':
              icon = Users;
              color = 'text-blue-500';
              label = 'Totale Clienti';
              break;
            case 'active_subscriptions':
              icon = Tv;
              color = 'text-violet-500';
              label = 'Linee IPTV Attive';
              break;
            case 'monthly_revenue':
              icon = Euro;
              color = 'text-emerald-500';
              label = 'Fatturato Mese';
              break;
            case 'total_leads':
              icon = MessageSquare;
              color = 'text-orange-500';
              label = 'Ticket Aperti';
              break;
            default:
              icon = Users;
              color = 'text-slate-500';
              label = item.metric.replace('_', ' ').toUpperCase();
          }
          return {
            label,
            value: item.value.toString(),
            change: '+0%',
            icon,
            color
          };
        });
        setStats(mappedStats);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fallback to mock data if Supabase fails
      setClients(MOCK_CLIENTS);
      setLeads(MOCK_LEADS);
      setSubscriptions(MOCK_SUBSCRIPTIONS);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchSupabaseData();
  }, []);

  // Fetch data from Supabase (replaces external integration)
  const fetchExternalData = async () => {
    setSyncing(true);
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*');

      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*');

      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('name');

      if (clientsError) throw clientsError;
      if (subsError) throw subsError;
      if (leadsError) throw leadsError;
      // subscription_plans is optional - log warning but don't fail sync if table doesn't exist
      if (plansError) {
        console.warn('subscription_plans table not available:', plansError.message);
      }

      if (Array.isArray(clientsData)) setClients(clientsData);
      if (Array.isArray(subsData)) setSubscriptions(subsData);
      if (Array.isArray(leadsData)) setLeads(leadsData);
      if (Array.isArray(plansData)) setSubscriptionPlans(plansData);

      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase.from('dashboard_stats').select('*');
      if (!statsError && statsData) {
        const mappedStats = statsData.map(item => {
          let icon, color, label;
          switch (item.metric) {
            case 'total_clients':
              icon = Users;
              color = 'text-blue-500';
              label = 'Totale Clienti';
              break;
            case 'active_subscriptions':
              icon = Tv;
              color = 'text-violet-500';
              label = 'Linee IPTV Attive';
              break;
            case 'monthly_revenue':
              icon = Euro;
              color = 'text-emerald-500';
              label = 'Fatturato Mese';
              break;
            case 'total_leads':
              icon = MessageSquare;
              color = 'text-orange-500';
              label = 'Ticket Aperti';
              break;
            default:
              icon = Users;
              color = 'text-slate-500';
              label = item.metric.replace('_', ' ').toUpperCase();
          }
          return {
            label,
            value: item.value.toString(),
            change: '+0%',
            icon,
            color
          };
        });
        setStats(mappedStats);
      }

      setLastSync(new Date().toISOString());
    } catch (err) {
      console.error('Sync error:', err);
      alert('Errore sincronizzazione: ' + (err.message || String(err)));
    } finally {
      setSyncing(false);
    }
  };

  // Optional: auto-poll every 5 minutes
  React.useEffect(() => {
    const id = setInterval(() => {
      fetchExternalData();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Aggiorna i margini dei prodotti quando vengono venduti abbonamenti
  const updateProductMargins = async (planName, sellingPrice) => {
    try {
      // Calcola il costo basato sul prezzo (margine 80%)
      const costPrice = sellingPrice * 0.2; // 20% costo, 80% margine
      const marginPercentage = 80.00;

      // Cerca se il prodotto esiste già
      const { data: existingProduct, error: searchError } = await supabase
        .from('product_margins')
        .select('*')
        .eq('product_name', planName)
        .eq('is_active', true)
        .single();

      if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = not found
        throw searchError;
      }

      if (existingProduct) {
        // Aggiorna il prodotto esistente
        const newTotalSold = existingProduct.total_sold + 1;
        const newTotalRevenue = existingProduct.total_revenue + sellingPrice;
        const newTotalCost = existingProduct.total_cost + costPrice;
        const newTotalProfit = newTotalRevenue - newTotalCost;

        const { error: updateError } = await supabase
          .from('product_margins')
          .update({
            total_sold: newTotalSold,
            total_revenue: newTotalRevenue,
            total_cost: newTotalCost,
            total_profit: newTotalProfit,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id);

        if (updateError) throw updateError;
      } else {
        // Crea un nuovo prodotto
        const newProduct = {
          id: Date.now(),
          product_name: planName,
          plan_type: 'subscription',
          selling_price: sellingPrice,
          cost_price: costPrice,
          margin_percentage: marginPercentage,
          total_sold: 1,
          total_revenue: sellingPrice,
          total_cost: costPrice,
          total_profit: sellingPrice - costPrice,
          is_active: true
        };

        const { error: insertError } = await supabase
          .from('product_margins')
          .insert([newProduct]);

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error updating product margins:', err);
      // Non bloccare l'operazione principale per errori sui margini
    }
  };

  // Add or attach iptv line to client or create subscription if no clientId
  const addIptv = async (clientId, iptvData) => {
    try {
      if (clientId) {
        // Update client with IPTV data
        const { error } = await supabase
          .from('clients')
          .update({
            iptv: {
              ...iptvData,
              status: 'active',
              lastIp: '87.12.33.11 (Milano, IT)'
            }
          })
          .eq('id', clientId);

        if (error) throw error;

        // Update local state
        setClients(prev => prev.map(client =>
          client.id === clientId ? {
            ...client,
            iptv: {
              ...iptvData,
              status: 'active',
              lastIp: '87.12.33.11 (Milano, IT)'
            }
          } : client
        ));
      } else {
        // Calcola il prezzo basato sul piano
        let price = 10; // default
        if (iptvData.plan?.includes('12 Mesi')) price = 80;
        else if (iptvData.plan?.includes('6 Mesi')) price = 45;
        else if (iptvData.plan?.includes('3 Mesi')) price = 25;

        // Create new subscription
        const newSub = {
          name: iptvData.ownerName || `User-${Date.now().toString().slice(-3)}`,
          username: iptvData.username,
          plan: iptvData.plan,
          status: 'active',
          expire_date: iptvData.expireDate,
          last_seen: 'Ora',
          phone: iptvData.phone || '',
          mac_address: iptvData.mac,
          connections: iptvData.connections || 1,
          price: price,
          cost: price * 0.2 // 80% margin
        };

        const { data, error } = await supabase
          .from('subscriptions')
          .insert([newSub])
          .select();

        if (error) throw error;

        // Update local state
        setSubscriptions(prev => [data[0], ...prev]);

        // Salva transazione contabile per il nuovo abbonamento
        const transactionDate = new Date().toISOString().split('T')[0];
        const period = transactionDate.substring(0, 7);

        const accountingRecord = {
          id: Date.now(),
          period: period,
          type: 'income',
          category: 'subscription',
          description: `Nuovo abbonamento ${iptvData.plan} - ${newSub.name}`,
          amount: price,
          subscription_id: newSub.id,
          payment_method: 'cash', // default, può essere cambiato
          transaction_date: transactionDate
        };

        const { error: accountingError } = await supabase
          .from('accounting')
          .insert([accountingRecord]);

        if (accountingError) {
          console.error('Error saving accounting record:', accountingError);
          // Non bloccare la creazione dell'abbonamento
        }

        // Aggiorna i margini del prodotto
        await updateProductMargins(iptvData.plan, price);
      }
    } catch (err) {
      console.error('Error adding IPTV:', err);
      alert('Errore nell\'aggiunta dell\'IPTV: ' + err.message);
    }
  };

  // Update subscription
  const updateSubscription = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSubscriptions(prev => prev.map(sub =>
        sub.id === id ? { ...sub, ...updates } : sub
      ));
    } catch (err) {
      console.error('Error updating subscription:', err);
      alert('Errore nell\'aggiornamento dell\'abbonamento: ' + err.message);
    }
  };

  // Delete subscription
  const deleteSubscription = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo abbonamento?')) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.error('Error deleting subscription:', err);
      alert('Errore nell\'eliminazione dell\'abbonamento: ' + err.message);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setCurrentView('detail');
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExportCSV = (data, filename) => {
    // Simulate CSV export
    alert(`Esportazione CSV simulata per ${filename}. Dati: ${data.length} elementi`);
  };

  const handleSendReminder = () => {
    // fallback: open mass reminder modal with all subscriptions selected
    setShowMassReminderModal(true);
  };

  const handleBotAction = (action) => {
    alert(`Azione bot "${action}" eseguita!`);
  };

  const openClientModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setClientForm(client);
    } else {
      setEditingClient(null);
      setClientForm({
        id: Date.now(),
        name: '',
        email: '',
        phone: '',
        avatar: '',
        status: 'active',
        type: 'Standard',
        iptv: {
          username: '',
          expireDate: '',
          status: 'active',
          mac: '',
          plan: '',
          connections: 1,
          lastIp: '',
          m3uUrl: '',
          password: ''
        },
        payments: [],
        notes: ''
      });
    }
    setShowClientModal(true);
  };

  // Messaging helpers
  const encodePhone = (phone) => phone.replace(/\s+/g, '').replace(/^\+/, '').replace(/^0+/, '');

  const sendWhatsApp = (phone, message) => {
    if (!phone) return;
    const num = encodePhone(phone).replace(/^39/, '');
    const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const buildFrenchMessage = (type, sub, client) => {
    const name = client?.name || sub.name || 'Bonjour';
    const plan = sub.plan || '';
    const expire = sub.expire_date || '';
    const days = typeof sub.days_left === 'number' ? sub.days_left : null;

    if (type === 'expired') {
      return `Bonjour ${name},\nVotre abonnement ${plan} a expiré le ${expire}.\nSouhaitez-vous le renouveler maintenant ? Répondez OUI pour confirmer.`;
    }
    if (type === 'expiring') {
      return `Bonjour ${name},\nVotre abonnement ${plan} expire le ${expire} (${days} jours restants).\nSouhaitez-vous le renouveler ? Répondez OUI pour confirmer.`;
    }
    if (type === 'renew') {
      return `Bonjour ${name},\nSouhaitez-vous renouveler votre abonnement ${plan} ? Répondez OUI pour confirmer le paiement et la prolongation.`;
    }
    // default
    return `Bonjour ${name},\nNous vous informons au sujet de votre abonnement ${plan} (scadenza: ${expire}).`;
  };

  const handleNotifySubscription = (sub) => {
    // find client by name or username
    const client = clients.find(c => c.name === sub.name || (c.iptv && c.iptv.username === sub.username));
    const type = sub.days_left < 0 ? 'expired' : (sub.days_left <= 3 ? 'expiring' : 'expiring');
    const msg = buildFrenchMessage(type, sub, client);
    const phone = client?.phone || sub.phone;
    if (!phone) {
      alert(`No phone found for ${sub.name}.`);
      return;
    }
    sendWhatsApp(phone, msg);
  };

  const handleRenewSubscription = (sub) => {
    const client = clients.find(c => c.name === sub.name || (c.iptv && c.iptv.username === sub.username));
    const msg = buildFrenchMessage('renew', sub, client);
    const phone = client?.phone || sub.phone;
    if (!phone) {
      alert(`No phone found for ${sub.name}.`);
      return;
    }
    sendWhatsApp(phone, msg);
  };

  // Handler invoked when user confirms mass reminder
  const confirmMassReminder = ({ target, customMessage }) => {
    // build list of recipients
    let recipients = [];
    if (target === 'all') {
      recipients = subscriptions.slice();
    } else if (target === 'expired') {
      recipients = subscriptions.filter(s => s.status === 'expired');
    } else if (target === 'urgent') {
      recipients = subscriptions.filter(s => s.status === 'expiring' || s.days_left <= 3);
    } else if (target === 'selected') {
      // no selected context passed here — fallback to all
      recipients = subscriptions.slice();
    }

    let missingPhones = 0;
    recipients.forEach(sub => {
      const client = clients.find(c => c.name === sub.name || (c.iptv && c.iptv.username === sub.username));
      const phone = client?.phone || sub.phone;
      if (!phone) { missingPhones++; return; }
      const type = sub.days_left < 0 ? 'expired' : (sub.days_left <= 3 ? 'expiring' : 'expiring');
      const msg = customMessage && customMessage.trim().length > 0 ? customMessage : buildFrenchMessage(type, sub, client);
      sendWhatsApp(phone, msg);
    });

    if (missingPhones > 0) {
      alert(`${missingPhones} destinataires sans numero di telefono. Verifica i clienti mancanti.`);
    }
    setShowMassReminderModal(false);
  };

  // Mass reminder modal component
  const MassReminderModal = ({ isOpen, onClose, onConfirm, defaultTarget }) => {
    const [target, setTarget] = useState(defaultTarget || 'urgent'); // urgent, expired, all, selected
    const [customMessage, setCustomMessage] = useState('');

    React.useEffect(() => {
      if (!isOpen) {
        setCustomMessage('');
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Reminder Massivo - Message (FR)</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Target</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200">
                <option value="selected">Selezionati</option>
                <option value="expired">Scaduti</option>
                <option value="urgent">In scadenza (≤3gg)</option>
                <option value="all">Tutti</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Messaggio (francese)</label>
              <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={5} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200" placeholder="Laisser vide pour utiliser le message automatique..."></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Annulla</button>
              <button onClick={() => onConfirm({ target, customMessage })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Invia</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const saveClient = async () => {
    try {
      if (editingClient) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(clientForm)
          .eq('id', editingClient.id);

        if (error) throw error;

        setClients(prev => prev.map(c => c.id === editingClient.id ? clientForm : c));
      } else {
        // Create new client
        const { error: clientError } = await supabase
          .from('clients')
          .insert([clientForm]);

        if (clientError) throw clientError;

        setClients(prev => [...prev, clientForm]);

        // Add to leads if new
        const newLead = {
          id: clientForm.id,
          name: clientForm.name,
          source: 'Manuale',
          status: 'new',
          time: 'Ora',
          interest: clientForm.iptv.username ? 'IPTV' : 'Cliente'
        };

        const { error: leadError } = await supabase
          .from('leads')
          .insert([newLead]);

        if (leadError) throw leadError;

        setLeads(prev => [...prev, newLead]);

        // Salva transazioni contabili per i pagamenti del nuovo cliente
        if (clientForm.payments && Array.isArray(clientForm.payments)) {
          const accountingRecords = clientForm.payments.map((payment, index) => ({
            id: Date.now() + index,
            period: payment.date.substring(0, 7), // YYYY-MM
            type: 'income',
            category: 'subscription',
            description: `${payment.item} - ${clientForm.name}`,
            amount: payment.amount,
            client_id: clientForm.id,
            payment_method: payment.method.toLowerCase().replace(' ', '_'),
            transaction_date: payment.date
          }));

          if (accountingRecords.length > 0) {
            const { error: accountingError } = await supabase
              .from('accounting')
              .insert(accountingRecords);

            if (accountingError) {
              console.error('Error saving accounting records:', accountingError);
              // Non bloccare il salvataggio del cliente per errori contabili
            }
          }
        }
      }
      setShowClientModal(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Error saving client:', err);
      alert('Errore nel salvataggio del cliente: ' + err.message);
    }
  };

  const deleteClient = async (clientId) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm('Sei sicuro di voler eliminare questo cliente?')) {
      try {
        // Prima elimina i record collegati nelle altre tabelle
        const { error: accountingError } = await supabase
          .from('accounting')
          .delete()
          .eq('client_id', clientId);

        if (accountingError) {
          console.error('Error deleting accounting records:', accountingError);
          // Non bloccare se non riesce, potrebbe non esserci nulla da eliminare
        }

        // Elimina le subscriptions collegate
        const { error: subsError } = await supabase
          .from('subscriptions')
          .delete()
          .eq('client_id', clientId);

        if (subsError) {
          console.error('Error deleting subscriptions:', subsError);
          // Non bloccare se non riesce
        }

        // Ora elimina il cliente
        const { error: clientError } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId);

        if (clientError) throw clientError;

        // Aggiorna lo stato locale
        setClients(prev => prev.filter(c => c.id !== clientId));
        alert('Cliente eliminato con successo!');
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Errore nell\'eliminazione del cliente: ' + err.message);
      }
    }
  };

  const contactWhatsApp = (client) => {
    const phoneNumber = client.phone.replace(/\s+/g, '').replace(/^\+39/, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const convertLeadToClient = (lead) => {
    // Crea un nuovo cliente basato sul lead
    const newClient = {
      id: Date.now(), // ID univoco
      name: lead.name,
      email: `${lead.name.toLowerCase().replace(/\s+/g, '.')}@email.com`, // Email placeholder
      phone: '+39 333 1234567', // Telefono placeholder
      avatar: lead.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'active',
      type: lead.interest.includes('Reseller') ? 'Reseller' : 'Standard',
      iptv: lead.interest.includes('IPTV') ? {
        username: `${lead.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-3)}`,
        expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 anno da oggi
        status: 'active',
        mac: '00:1A:79:44:2B:11',
        plan: lead.interest,
        connections: 1,
        lastIp: '87.12.33.11 (Milano, IT)'
      } : null,
      payments: [],
      notes: `Convertito da lead - Fonte: ${lead.source}, Interesse: ${lead.interest}`
    };

    // Aggiungi il nuovo cliente
    setClients(prev => [...prev, newClient]);
    
    // Rimuovi il lead dalla lista
    setLeads(prev => prev.filter(l => l.id !== lead.id));

    // Mostra un messaggio di conferma
    alert(`Lead "${lead.name}" convertito in cliente con successo!`);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (err) {
      console.error('Error updating lead status:', err);
      alert('Errore nell\'aggiornamento dello stato del lead: ' + err.message);
    }
  };

  // NOTE: `addIptv` implemented earlier (supports creating subscription when clientId is null)

  const renderContent = () => {
    if (currentView === 'detail' && selectedClient) {
      return <ClientDetailView 
        client={selectedClient} 
        onBack={() => { setSelectedClient(null); setCurrentView('clients'); }}
        onEdit={(client) => {
          setEditingClient(client);
          setClientForm({...client});
          setShowClientModal(true);
          setCurrentView('clients'); // Torna alla vista clienti per mostrare il modal
        }}
        onAddIptv={addIptv}
      />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView onSelectClient={handleClientSelect} clients={filteredClients} onBotAction={handleBotAction} stats={stats} />;
      case 'finance':
        return <FinanceCalculatorView 
          clients={clients} 
          subscriptions={subscriptions}
          subscriptionPlans={subscriptionPlans}
          onOpenPlanModal={openPlanModal}
          onDeletePlan={deleteSubscriptionPlan}
        />;
      case 'iptv':
        return <IptvManagerView
          subscriptions={filteredSubscriptions}
          onSendReminder={handleSendReminder}
          onAddSubscription={() => setShowAddIptvModal(true)}
          onNotifySubscription={handleNotifySubscription}
          onRenewSubscription={handleRenewSubscription}
          clients={clients}
          onEditClient={(client) => {
            setEditingClient(client);
            setClientForm({...client});
            setShowClientModal(true);
          }}
          onDeleteClient={deleteClient}
          onContactWhatsApp={contactWhatsApp}
          onViewClientDetail={(client) => { setSelectedClientDetail(client); setShowClientDetailModal(true); }}
          onUpdateSubscription={updateSubscription}
          onDeleteSubscription={deleteSubscription}
          onEditSubscription={(sub) => {
            const newExpireDate = prompt('Nuova data di scadenza (YYYY-MM-DD):', sub.expire_date);
            if (newExpireDate && newExpireDate !== sub.expire_date) {
              updateSubscription(sub.id, { expire_date: newExpireDate });
            }
          }}
        />;
      case 'clients':
        return <ClientsLeadsView 
          onSelectClient={handleClientSelect} 
          clients={filteredClients} 
          leads={filteredLeads} 
          onExportCSV={handleExportCSV} 
          onOpenModal={openClientModal} 
          onDeleteClient={deleteClient} 
          onContactWhatsApp={contactWhatsApp}
          onEditClient={(client) => {
            setEditingClient(client);
            setClientForm({...client});
            setShowClientModal(true);
          }}
          onViewClientDetail={(client) => {
            setSelectedClientDetail(client);
            setShowClientDetailModal(true);
          }}
          onConvertLeadToClient={convertLeadToClient}
          onUpdateLeadStatus={updateLeadStatus}
        />;
      case 'settings':
        return <SettingsView settings={settings} onUpdateSettings={updateSettings} />; // Nuova vista Impostazioni
      default:
        return <div className="text-slate-400 p-10 text-center">Modulo in costruzione 🚧</div>;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-900 text-slate-200">
      
      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 z-20 flex flex-col w-64 h-screen border-r bg-slate-900 border-slate-800">
        <div className="flex items-center h-16 px-6 border-b border-slate-800">
          <div className="w-8 h-8 mr-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg"></div>
          <span className="text-lg font-bold text-white tracking-tight">OmniFlow</span>
        </div>
        
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">Main</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => {setCurrentView('dashboard'); setSelectedClient(null);}} />
          <SidebarItem icon={Users} label="Clienti & Lead" active={currentView === 'clients' || currentView === 'detail'} onClick={() => {setCurrentView('clients'); setSelectedClient(null);}} />
          
          <p className="px-4 mb-2 mt-6 text-xs font-semibold uppercase text-slate-500 tracking-wider">Gestione</p>
          <SidebarItem icon={Tv} label="IPTV Manager" active={currentView === 'iptv'} onClick={() => setCurrentView('iptv')} />
          <SidebarItem icon={DollarSign} label="Contabilità" active={currentView === 'finance'} onClick={() => setCurrentView('finance')} />
          <SidebarItem icon={Bot} label="Automazioni" onClick={() => setCurrentView('automation')} />

          <p className="px-4 mb-2 mt-6 text-xs font-semibold uppercase text-slate-500 tracking-wider">System</p>
          <SidebarItem icon={Settings} label="Impostazioni" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b bg-slate-900/80 backdrop-blur-md border-slate-800">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Cerca cliente, MAC address o pratica..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm transition-colors border rounded-lg bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 transition-colors rounded-lg hover:bg-slate-800 text-slate-400">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchExternalData()}
                className={`px-3 py-1 text-xs rounded-lg border ${syncing ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                title="Sync Now"
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <div className="text-xs text-slate-400">
                {lastSync ? `Last: ${new Date(lastSync).toLocaleString()}` : 'Not synced'}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-200">Admin User</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      {/* Client Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setEditingClient(null);
          setClientForm({});
        }}
        onSave={saveClient}
        client={editingClient}
        formData={clientForm}
        onFormChange={setClientForm}
      />

      {/* Client Detail Modal */}
      <ClientDetailModal
        isOpen={showClientDetailModal}
        onClose={() => {
          setShowClientDetailModal(false);
          setSelectedClientDetail(null);
        }}
        client={selectedClientDetail}
        onEdit={(client) => {
          setEditingClient(client);
          setClientForm({...client});
          setShowClientModal(true);
          setShowClientDetailModal(false);
        }}
      />

      {/* Mass Reminder Modal */}
      <MassReminderModal isOpen={showMassReminderModal} onClose={() => setShowMassReminderModal(false)} onConfirm={confirmMassReminder} defaultTarget="urgent" />
      {/* Global Add IPTV Modal (from IPTV Manager) */}
      <AddIptvModal isOpen={showAddIptvModal} onClose={() => setShowAddIptvModal(false)} onSave={addIptv} client={null} />
      {/* Plan Management Modal (App-level) */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={closePlanModal}
        onSave={handlePlanSave}
        plan={editingPlan}
        formData={planFormData}
        onFormChange={setPlanFormData}
      />

    </div>
  );
}
