/**
 * ESEMPI DI UTILIZZO - ClientToolbar Component
 * =============================================
 * 
 * Questo file contiene esempi pratici di come implementare 
 * il componente ClientToolbar in diversi scenari.
 */

import React, { useState } from 'react';
import ClientToolbar from './ClientToolbar';

// ============================================================================
// ESEMPIO 1: Implementazione Base con State Management
// ============================================================================

export function Example1_BasicImplementation() {
  const [clients, setClients] = useState([
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
      notes: 'Cliente storico. Preferisce contatti su Telegram.'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);

  const handleViewDetails = (client) => {
    console.log('Viewing details for client:', client.name);
    // Puoi implementare qui la logica di visualizzazione dettagli
  };

  const handleWhatsApp = (client) => {
    console.log('Preparing WhatsApp message for:', client.name);
    // La toolbar gestisce l'apertura di WhatsApp automaticamente
  };

  const handleNewSubscription = (client) => {
    console.log('Creating new subscription for:', client.name);
    // Puoi qui aprire una pagina di creazione abbonamento
  };

  const handleEditClient = (client) => {
    console.log('Editing client:', client.name);
    // I dati modificati vengono passati al callback
  };

  const handleDeleteClient = (clientId) => {
    console.log('Deleting client with ID:', clientId);
    // Aggiorna lo stato
    setClients(clients.filter(c => c.id !== clientId));
    setSelectedClient(null);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Esempio 1: Implementazione Base</h1>

      <ClientToolbar
        selectedClient={selectedClient}
        clients={clients}
        onDeselect={() => setSelectedClient(null)}
        onViewDetails={handleViewDetails}
        onWhatsApp={handleWhatsApp}
        onNewSubscription={handleNewSubscription}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />

      {/* Selezionatore di cliente per il test */}
      <div className="mt-6 p-4 bg-slate-800 rounded">
        <h3 className="text-white font-bold mb-4">Seleziona un cliente per testare:</h3>
        <div className="flex gap-2">
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client.name)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedClient === client.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {client.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ESEMPIO 2: Integrazione con API Backend
// ============================================================================

export function Example2_APIIntegration() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simula una chiamata API
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Sostituisci con la tua API reale
      // const response = await fetch('/api/clients');
      // const data = await response.json();
      // setClients(data);

      // Per questo esempio, usiamo dati mock
      setClients([
        {
          id: 1,
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com',
          phone: '+39 333 1234567',
          avatar: 'MR',
          status: 'active',
          type: 'Standard',
          iptv: null,
          notes: 'Note del cliente'
        }
      ]);
    } catch (error) {
      console.error('Errore nel caricamento clienti:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      // const response = await fetch(`/api/clients/${updatedClient.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedClient)
      // });
      // const data = await response.json();

      // Aggiorna lo stato locale
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      alert('Client aggiornato con successo!');
    } catch (error) {
      console.error('Errore nella modifica client:', error);
      alert('Errore nella modifica del client');
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      // const response = await fetch(`/api/clients/${clientId}`, {
      //   method: 'DELETE'
      // });

      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
      alert('Client eliminato con successo!');
    } catch (error) {
      console.error('Errore nell\'eliminazione client:', error);
      alert('Errore nell\'eliminazione del client');
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Esempio 2: Integrazione API</h1>

      {loading && <p className="text-yellow-400">Caricamento clienti...</p>}

      <ClientToolbar
        selectedClient={selectedClient}
        clients={clients}
        onDeselect={() => setSelectedClient(null)}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />
    </div>
  );
}

// ============================================================================
// ESEMPIO 3: Custom Callbacks e Logica Avanzata
// ============================================================================

export function Example3_AdvancedCallbacks() {
  const [clients, setClients] = useState([
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
        lastIp: '87.12.33.11'
      },
      notes: 'Cliente di test'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  // Log tutte le azioni per audit
  const logAction = (action, details) => {
    const entry = {
      timestamp: new Date().toLocaleString('it-IT'),
      action,
      details,
      user: 'admin' // Sostituisci con l'utente reale
    };
    setAuditLog(prev => [entry, ...prev]);
    console.log('Audit Log:', entry);
  };

  const handleViewDetails = (client) => {
    logAction('VIEW_DETAILS', { clientId: client.id, clientName: client.name });
  };

  const handleWhatsApp = (client) => {
    logAction('WHATSAPP_MESSAGE', { clientId: client.id, clientPhone: client.phone });
  };

  const handleNewSubscription = (client) => {
    logAction('NEW_SUBSCRIPTION', { clientId: client.id, clientName: client.name });
    // Potrebbe aprire una nuova pagina o form
    // window.location.href = `/subscriptions/new?clientId=${client.id}`;
  };

  const handleEditClient = (updatedClient) => {
    logAction('EDIT_CLIENT', { clientId: updatedClient.id, changes: updatedClient });
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    logAction('DELETE_CLIENT', { clientId, clientName: client?.name });
    setClients(clients.filter(c => c.id !== clientId));
    setSelectedClient(null);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Esempio 3: Callback Avanzati con Audit Log</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Toolbar */}
        <div className="lg:col-span-2">
          <ClientToolbar
            selectedClient={selectedClient}
            clients={clients}
            onDeselect={() => setSelectedClient(null)}
            onViewDetails={handleViewDetails}
            onWhatsApp={handleWhatsApp}
            onNewSubscription={handleNewSubscription}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />

          {/* Selezionatore clienti */}
          <div className="mt-6 p-4 bg-slate-800 rounded">
            <h3 className="text-white font-bold mb-4">Clienti disponibili:</h3>
            <div className="space-y-2">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.name)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    selectedClient === client.name
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {client.name} - {client.email}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="text-white font-bold mb-4">Audit Log</h3>
          {auditLog.length === 0 ? (
            <p className="text-slate-400 text-sm">Nessuna azione registrata</p>
          ) : (
            <div className="space-y-3">
              {auditLog.map((log, idx) => (
                <div key={idx} className="border-l-2 border-indigo-500 pl-3 py-2 text-sm">
                  <p className="text-slate-300 font-mono text-xs">{log.timestamp}</p>
                  <p className="text-indigo-400 font-bold">{log.action}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {JSON.stringify(log.details, null, 2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ESEMPIO 4: Customizzazione UI e Styling
// ============================================================================

export function Example4_CustomStyling() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients] = useState([
    {
      id: 1,
      name: 'Mario Rossi',
      email: 'mario.rossi@email.com',
      phone: '+39 333 1234567',
      avatar: '👨‍💼',
      status: 'active',
      type: 'Standard',
      iptv: null,
      notes: 'VIP Client'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Esempio 4: Custom Styling</h1>
        <p className="text-slate-400 mb-6">Toolbar con background personalizzato</p>

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 shadow-2xl border border-slate-600">
          <ClientToolbar
            selectedClient={selectedClient}
            clients={clients}
            onDeselect={() => setSelectedClient(null)}
          />
        </div>

        {/* Selezionatore */}
        <div className="mt-6 p-4 bg-slate-800 rounded">
          <button
            onClick={() => setSelectedClient('Mario Rossi')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
          >
            Seleziona Mario Rossi
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ESEMPIO PRINCIPALE
// ============================================================================

export default Example1_BasicImplementation;

/**
 * PER TESTARE GLI ESEMPI:
 * 
 * 1. Nel file App.js, importa l'esempio desiderato:
 *    import { Example1_BasicImplementation } from './ClientToolbarExamples';
 * 
 * 2. Usa il componente nel render:
 *    <Example1_BasicImplementation />
 * 
 * 3. Oppure crea una route nel router per ogni esempio
 * 
 * Ogni esempio mostra un caso d'uso diverso del componente.
 */
