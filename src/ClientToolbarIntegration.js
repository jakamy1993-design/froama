/**
 * INTEGRAZIONE BACKEND - ClientToolbar Component
 * ==============================================
 * 
 * Questo file mostra come integrare il componente ClientToolbar
 * con un backend reale (Supabase, REST API, ecc.)
 */

import React, { useState, useCallback } from 'react';
import ClientToolbar from './ClientToolbar';
// import { createClient } from '@supabase/supabase-js'; // Per Supabase

// ============================================================================
// OPZIONE 1: Integrazione con REST API Generica
// ============================================================================

export function IntegrateWithRESTAPI() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch clienti
  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
      console.error('Errore nel caricamento clienti:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Modifica cliente
  const handleEditClient = useCallback(async (updatedClient) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${updatedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedClient)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // Aggiorna lo stato locale
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      alert('Cliente aggiornato con successo!');
    } catch (err) {
      setError(err.message);
      alert(`Errore: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [clients]);

  // Elimina cliente
  const handleDeleteClient = useCallback(async (clientId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
      alert('Cliente eliminato con successo!');
    } catch (err) {
      setError(err.message);
      alert(`Errore: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [clients]);

  // Carica clienti al mount
  React.useEffect(() => {
    loadClients();
  }, [loadClients]);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Integrazione REST API
      </h1>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded mb-6">
          Errore: {error}
        </div>
      )}

      {loading && (
        <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 p-4 rounded mb-6">
          Caricamento in corso...
        </div>
      )}

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
// OPZIONE 2: Integrazione con Supabase
// ============================================================================

export function IntegrateWithSupabase() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inizializza Supabase (decommentare e configurare)
  // const supabase = createClient(
  //   process.env.REACT_APP_SUPABASE_URL,
  //   process.env.REACT_APP_SUPABASE_ANON_KEY
  // );

  // Fetch clienti da Supabase
  const loadClientsFromSupabase = async () => {
    setLoading(true);
    try {
      // const { data, error } = await supabase
      //   .from('clients')
      //   .select('*');
      
      // if (error) throw error;
      // setClients(data);

      // Mock per demo
      setClients([]);
    } catch (error) {
      console.error('Errore Supabase:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modifica cliente in Supabase
  const handleEditClient = async (updatedClient) => {
    setLoading(true);
    try {
      // const { error } = await supabase
      //   .from('clients')
      //   .update(updatedClient)
      //   .eq('id', updatedClient.id);
      
      // if (error) throw error;

      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      alert('Cliente aggiornato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Elimina cliente da Supabase
  const handleDeleteClient = async (clientId) => {
    setLoading(true);
    try {
      // const { error } = await supabase
      //   .from('clients')
      //   .delete()
      //   .eq('id', clientId);
      
      // if (error) throw error;

      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
      alert('Cliente eliminato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadClientsFromSupabase();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Integrazione Supabase
      </h1>

      {loading && <p className="text-yellow-400">Caricamento...</p>}

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
// OPZIONE 3: Integrazione con Firebase
// ============================================================================

export function IntegrateWithFirebase() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inizializza Firebase (decommentare e configurare)
  // import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
  // import { initializeApp } from 'firebase/app';
  
  // const firebaseConfig = {
  //   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // };
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);

  // Fetch clienti da Firebase
  const loadClientsFromFirebase = async () => {
    setLoading(true);
    try {
      // const clientsCollection = collection(db, 'clients');
      // const snapshot = await getDocs(clientsCollection);
      // const clientsList = snapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }));
      // setClients(clientsList);

      setClients([]);
    } catch (error) {
      console.error('Errore Firebase:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modifica cliente in Firebase
  const handleEditClient = async (updatedClient) => {
    setLoading(true);
    try {
      // const clientRef = doc(db, 'clients', updatedClient.id);
      // await updateDoc(clientRef, updatedClient);

      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      alert('Cliente aggiornato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Elimina cliente da Firebase
  const handleDeleteClient = async (clientId) => {
    setLoading(true);
    try {
      // const clientRef = doc(db, 'clients', clientId);
      // await deleteDoc(clientRef);

      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
      alert('Cliente eliminato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadClientsFromFirebase();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Integrazione Firebase
      </h1>

      {loading && <p className="text-yellow-400">Caricamento...</p>}

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
// OPZIONE 4: Integrazione con GraphQL
// ============================================================================

export function IntegrateWithGraphQL() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);

  const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

  // Funzione generica per query GraphQL
  const graphQLQuery = async (query, variables = {}) => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    return data.data;
  };

  // Fetch clienti con GraphQL
  const loadClientsFromGraphQL = async () => {
    setLoading(true);
    try {
      const query = `
        query GetClients {
          clients {
            id
            name
            email
            phone
            avatar
            status
            type
            notes
            iptv {
              username
              expireDate
              status
              mac
              plan
              connections
              lastIp
            }
          }
        }
      `;

      const result = await graphQLQuery(query);
      setClients(result.clients);
    } catch (error) {
      console.error('Errore GraphQL:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modifica cliente con GraphQL
  const handleEditClient = async (updatedClient) => {
    setLoading(true);
    try {
      const mutation = `
        mutation UpdateClient($id: ID!, $input: ClientInput!) {
          updateClient(id: $id, input: $input) {
            id
            name
            email
            phone
            avatar
            status
            type
            notes
          }
        }
      `;

      await graphQLQuery(mutation, {
        id: updatedClient.id,
        input: updatedClient
      });

      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
      alert('Cliente aggiornato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Elimina cliente con GraphQL
  const handleDeleteClient = async (clientId) => {
    setLoading(true);
    try {
      const mutation = `
        mutation DeleteClient($id: ID!) {
          deleteClient(id: $id) {
            success
          }
        }
      `;

      await graphQLQuery(mutation, { id: clientId });

      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
      alert('Cliente eliminato!');
    } catch (error) {
      console.error('Errore:', error.message);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadClientsFromGraphQL();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Integrazione GraphQL
      </h1>

      {loading && <p className="text-yellow-400">Caricamento...</p>}

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
// UTILITY: Error Handler
// ============================================================================

export const handleBackendError = (error) => {
  if (error.message === 'Unauthorized') {
    // Reindirizza al login
    window.location.href = '/login';
  } else if (error.message === 'Not Found') {
    alert('Risorsa non trovata');
  } else if (error.message === 'Bad Request') {
    alert('Richiesta non valida. Verifica i dati inseriti');
  } else {
    alert(`Errore: ${error.message}`);
  }
};

// ============================================================================
// UTILITY: Request Formatter per API
// ============================================================================

export const formatAPIRequest = (data) => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    status: data.status,
    type: data.type,
    notes: data.notes,
    // Serializza IPTV se presente
    ...(data.iptv && {
      iptv: JSON.stringify(data.iptv)
    })
  };
};

// ============================================================================
// UTILITY: Response Parser da API
// ============================================================================

export const parseAPIResponse = (data) => {
  return {
    ...data,
    // Deserializza IPTV se è una stringa
    ...(typeof data.iptv === 'string' && {
      iptv: JSON.parse(data.iptv)
    })
  };
};

export default IntegrateWithRESTAPI;
