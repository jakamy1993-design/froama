import React, { useState } from 'react';
import {
  Eye,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  X,
  Send,
} from 'lucide-react';

/**
 * Modal per Visualizzare Dettagli Cliente
 */
const ClientDetailsModal = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Dettagli Cliente</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informazioni Personali */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Informazioni Personali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome</label>
                <p className="text-slate-200">{client.name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <p className="text-slate-200">{client.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Telefono</label>
                <p className="text-slate-200">{client.phone}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Stato</label>
                <p className="text-slate-200 capitalize">
                  {client.status === 'active' && (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                      Attivo
                    </span>
                  )}
                  {client.status === 'warning' && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                      Avviso
                    </span>
                  )}
                  {client.status === 'inactive' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                      Inattivo
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* IPTV Subscription Info */}
          {client.iptv && (
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Abbonamento IPTV</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                  <p className="text-slate-200">{client.iptv.username}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Piano</label>
                  <p className="text-slate-200">{client.iptv.plan}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Data Scadenza</label>
                  <p className="text-slate-200">{client.iptv.expireDate}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">MAC Address</label>
                  <p className="text-slate-200">{client.iptv.mac}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Connessioni</label>
                  <p className="text-slate-200">{client.iptv.connections}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ultimo IP</label>
                  <p className="text-slate-200 text-sm">{client.iptv.lastIp}</p>
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          {client.notes && (
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Note</h3>
              <p className="text-slate-200 whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal per Inviare Messaggio WhatsApp
 */
const WhatsAppModal = ({ client, onClose, onSend }) => {
  const [message, setMessage] = useState(
    `Ciao ${client?.name?.split(' ')[0] || 'Cliente'}, ecco il promemoria per il tuo abbonamento. Contattami per informazioni.`
  );

  if (!client) return null;

  const handleSend = () => {
    if (!message.trim()) {
      alert('Inserisci un messaggio');
      return;
    }

    // Estrai numero di telefono - rimuovi spazi e caratteri speciali
    const phoneNumber = client.phone.replace(/\D/g, '');
    const fullNumber = phoneNumber.startsWith('39') ? phoneNumber : '39' + phoneNumber;

    // Apri WhatsApp Web con il messaggio
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    if (onSend) onSend(client, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-lg w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Invia su WhatsApp</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Destinatario</label>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
              <p className="text-slate-100 font-medium">{client.name}</p>
              <p className="text-slate-400 text-sm">{client.phone}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Messaggio</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-32"
              placeholder="Digita il tuo messaggio..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Caratteri: {message.length}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            <Send size={18} /> Invia su WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal per Creare/Modificare Abbonamento
 */
const SubscriptionModal = ({ client, existingSubscription, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    existingSubscription || {
      plan: 'Full 12 Mesi',
      status: 'active',
      expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    }
  );

  if (!client) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.plan || !formData.expireDate) {
      alert('Compila tutti i campi obbligatori');
      return;
    }
    if (onSave) onSave(client, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-lg w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">
            {existingSubscription ? 'Modifica Abbonamento' : 'Nuovo Abbonamento'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Cliente</label>
            <input
              type="text"
              value={client.name}
              disabled
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Piano *</label>
            <select
              value={formData.plan}
              onChange={(e) => handleChange('plan', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option>Base SD</option>
              <option>Full 1 Mese</option>
              <option>Full Sport</option>
              <option>Full Cinema</option>
              <option>Full Sport + Cinema 4K</option>
              <option>Full 3 Mesi</option>
              <option>Full 12 Mesi</option>
              <option>Trial 24h</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Stato</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Attivo</option>
                <option value="expired">Scaduto</option>
                <option value="expiring">In Scadenza</option>
                <option value="trial">Trial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Data Scadenza *</label>
              <input
                type="date"
                value={formData.expireDate}
                onChange={(e) => handleChange('expireDate', e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-24"
              placeholder="Note aggiuntive..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal per Modificare Cliente
 */
const EditClientModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState(client || {});

  if (!client) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Compila tutti i campi obbligatori');
      return;
    }
    if (onSave) onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-lg w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Modifica Cliente</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Nome *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Telefono *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Stato</label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="active">Attivo</option>
              <option value="warning">Avviso</option>
              <option value="inactive">Inattivo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Tipo</label>
            <input
              type="text"
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="Es: Standard, Reseller"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Note</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-20"
              placeholder="Note aggiuntive..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            <Edit size={18} /> Salva
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal di Conferma per Eliminazione
 */
const DeleteConfirmModal = ({ client, onClose, onConfirm }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-sm w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-red-400">Conferma Eliminazione</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-200 mb-4">
            Sei sicuro di voler eliminare il cliente <strong>{client.name}</strong>?
          </p>
          <p className="text-slate-400 text-sm">
            Questa azione è irreversibile e eliminerà tutti i dati associati a questo cliente.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm(client.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 size={18} /> Elimina
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Toolbar Principale per Cliente Selezionato
 */
export const ClientToolbar = ({
  selectedClient,
  clients,
  onDeselect,
  onViewDetails,
  onWhatsApp,
  onNewSubscription,
  onEditClient,
  onDeleteClient,
}) => {
  const [activeModal, setActiveModal] = useState(null); // null, 'details', 'whatsapp', 'subscription', 'edit', 'delete'

  // Trova il cliente selezionato tra la lista
  const client = typeof selectedClient === 'object'
    ? selectedClient
    : clients?.find(c => c.name === selectedClient);

  if (!selectedClient || !client) {
    return (
      <div className="bg-yellow-600/10 border-b border-yellow-500/30 p-4">
        <p className="text-yellow-200 text-sm">
          Nessun cliente selezionato. Clicca su un nome cliente nella tabella sottostante per visualizzare il menu delle azioni.
        </p>
      </div>
    );
  }

  const closeModal = () => setActiveModal(null);

  const handleViewDetails = () => {
    setActiveModal('details');
    if (onViewDetails) onViewDetails(client);
  };

  const handleWhatsApp = () => {
    setActiveModal('whatsapp');
    if (onWhatsApp) onWhatsApp(client);
  };

  const handleNewSubscription = () => {
    setActiveModal('subscription');
    if (onNewSubscription) onNewSubscription(client);
  };

  const handleEditClient = () => {
    setActiveModal('edit');
    if (onEditClient) onEditClient(client);
  };

  const handleDeleteClient = () => {
    setActiveModal('delete');
    if (onDeleteClient) onDeleteClient(client);
  };

  return (
    <>
      {/* Toolbar Header */}
      <div className="bg-indigo-600/10 border-b border-indigo-500/30 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Client Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <div className="text-indigo-400 font-bold text-sm">
                {client.avatar || client.name?.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-100">{client.name}</h4>
              <p className="text-sm text-slate-400">{client.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Visualizza Dettagli - Grigio scuro */}
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Visualizza Dettagli"
            >
              <Eye size={16} /> Visualizza Dettagli
            </button>

            {/* WhatsApp - Verde */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Invia su WhatsApp"
            >
              <MessageSquare size={16} /> WhatsApp
            </button>

            {/* Nuovo Abbonamento - Viola */}
            <button
              onClick={handleNewSubscription}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Nuovo Abbonamento"
            >
              <Plus size={16} /> Nuovo Abbonamento
            </button>

            {/* Modifica Cliente - Blu */}
            <button
              onClick={handleEditClient}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Modifica Cliente"
            >
              <Edit size={16} /> Modifica Cliente
            </button>

            {/* Elimina Cliente - Rosso */}
            <button
              onClick={handleDeleteClient}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Elimina Cliente"
            >
              <Trash2 size={16} /> Elimina Cliente
            </button>

            {/* Deseleziona - Grigio chiaro */}
            <button
              onClick={() => {
                onDeselect?.();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Deseleziona"
            >
              <X size={16} /> Deseleziona
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'details' && (
        <ClientDetailsModal client={client} onClose={closeModal} />
      )}

      {activeModal === 'whatsapp' && (
        <WhatsAppModal
          client={client}
          onClose={closeModal}
          onSend={(client, message) => {
            console.log(`Messaggio WhatsApp inviato a ${client.name}: ${message}`);
          }}
        />
      )}

      {activeModal === 'subscription' && (
        <SubscriptionModal
          client={client}
          onClose={closeModal}
          onSave={(client, data) => {
            console.log(`Abbonamento salvato per ${client.name}:`, data);
            alert(`Abbonamento creato/modificato con successo per ${client.name}`);
          }}
        />
      )}

      {activeModal === 'edit' && (
        <EditClientModal
          client={client}
          onClose={closeModal}
          onSave={(data) => {
            console.log('Cliente modificato:', data);
            alert(`Cliente ${data.name} modificato con successo`);
          }}
        />
      )}

      {activeModal === 'delete' && (
        <DeleteConfirmModal
          client={client}
          onClose={closeModal}
          onConfirm={(clientId) => {
            console.log(`Cliente ${clientId} eliminato`);
            alert(`Cliente eliminato con successo`);
            onDeselect?.();
          }}
        />
      )}
    </>
  );
};

export default ClientToolbar;
