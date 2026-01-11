# ClientToolbar - Componente di Gestione Azioni Cliente

## 📋 Descrizione Generale

Il componente `ClientToolbar` è una barra di azioni completa per la gestione di un cliente selezionato in una dashboard di gestione clienti. Include modali interattivi per ogni funzionalità richiesta e gestisce tutti gli eventi di forma elegante e professionale.

## 🎨 Pulsanti Disponibili

| Pulsante | Colore | Funzionalità |
|----------|--------|-------------|
| **Visualizza Dettagli** | Grigio Scuro | Apre un modale con tutti i dati del cliente |
| **WhatsApp** | Verde | Apre un modale per inviare messaggi su WhatsApp |
| **Nuovo Abbonamento** | Viola | Apre un form per creare un nuovo abbonamento |
| **Modifica Cliente** | Blu | Apre un form per modificare i dati del cliente |
| **Elimina Cliente** | Rosso | Mostra una conferma prima di eliminare |
| **Deseleziona** | Grigio Chiaro | Deseleziona il cliente e nasconde la toolbar |

## 📦 Installazione

Il componente è già integrato nel progetto. Assicurati che sia importato in `App.js`:

```javascript
import ClientToolbar from './ClientToolbar';
```

## 🚀 Utilizzo

### Implementazione Base

```jsx
<ClientToolbar
  selectedClient={selectedClient}
  clients={clients}
  onDeselect={() => setSelectedClient(null)}
  onViewDetails={(client) => {
    // Gestisci l'azione di visualizzazione dettagli
    console.log('Viewing details for:', client);
  }}
  onWhatsApp={(client) => {
    // Gestisci l'azione WhatsApp
    console.log('WhatsApp action for:', client);
  }}
  onNewSubscription={(client) => {
    // Gestisci la creazione di nuovo abbonamento
    console.log('New subscription for:', client);
  }}
  onEditClient={(client) => {
    // Gestisci la modifica del cliente
    console.log('Editing client:', client);
  }}
  onDeleteClient={(clientId) => {
    // Gestisci l'eliminazione del cliente
    console.log('Deleting client:', clientId);
  }}
/>
```

## 📑 Props

### `selectedClient` (string | null)
- **Tipo**: `string | null`
- **Descrizione**: Nome del cliente attualmente selezionato
- **Obbligatorio**: ✅ Sì

### `clients` (array)
- **Tipo**: `Array<Object>`
- **Descrizione**: Array di tutti i clienti disponibili
- **Struttura oggetto cliente**:
  ```javascript
  {
    id: number,
    name: string,
    email: string,
    phone: string,
    avatar: string,
    status: 'active' | 'warning' | 'inactive',
    type: string,
    iptv: {
      username: string,
      expireDate: string,
      status: string,
      mac: string,
      plan: string,
      connections: number,
      lastIp: string
    },
    notes: string
  }
  ```
- **Obbligatorio**: ✅ Sì

### `onDeselect` (function)
- **Tipo**: `() => void`
- **Descrizione**: Callback eseguito quando l'utente clicca su "Deseleziona"
- **Obbligatorio**: ✅ Sì

### `onViewDetails` (function)
- **Tipo**: `(client: Object) => void`
- **Descrizione**: Callback eseguito quando l'utente clicca "Visualizza Dettagli"
- **Obbligatorio**: ❌ No

### `onWhatsApp` (function)
- **Tipo**: `(client: Object) => void`
- **Descrizione**: Callback eseguito quando l'utente clicca "WhatsApp"
- **Obbligatorio**: ❌ No

### `onNewSubscription` (function)
- **Tipo**: `(client: Object) => void`
- **Descrizione**: Callback eseguito quando l'utente clicca "Nuovo Abbonamento"
- **Obbligatorio**: ❌ No

### `onEditClient` (function)
- **Tipo**: `(client: Object) => void`
- **Descrizione**: Callback eseguito quando l'utente clicca "Modifica Cliente"
- **Obbligatorio**: ❌ No

### `onDeleteClient` (function)
- **Tipo**: `(clientId: number) => void`
- **Descrizione**: Callback eseguito quando l'utente conferma l'eliminazione
- **Obbligatorio**: ❌ No

## 🎭 Modali Disponibili

### 1. **ClientDetailsModal** - Visualizza Dettagli
Mostra tutte le informazioni del cliente in un modale professionale:
- Informazioni personali (Nome, Email, Telefono, Stato)
- Informazioni abbonamento IPTV (Username, Piano, Data Scadenza, MAC, Connessioni, Ultimo IP)
- Note aggiuntive

### 2. **WhatsAppModal** - Invia Messaggio WhatsApp
Permette di inviare messaggi WhatsApp precompilati:
- Campo di testo modificabile con messaggio pre-compilato
- Contatore dei caratteri
- Apre direttamente WhatsApp Web con il messaggio formattato
- Supporta numeri telefonici italiani automaticamente

**Esempio di utilizzo del link WhatsApp**:
```javascript
// Il componente genera automaticamente:
https://wa.me/393331234567?text=Ciao%20Mario%2C%20ecco%20il%20promemoria...
```

### 3. **SubscriptionModal** - Nuovo/Modifica Abbonamento
Form completo per gestire gli abbonamenti:
- Selezione del piano (Base SD, Full 1 Mese, Full Sport, ecc.)
- Selezione dello stato (Attivo, Scaduto, In Scadenza, Trial)
- Data di scadenza
- Note aggiuntive

### 4. **EditClientModal** - Modifica Cliente
Form per aggiornare i dati del cliente:
- Nome, Email, Telefono
- Stato (Attivo, Avviso, Inattivo)
- Tipo di cliente
- Note

### 5. **DeleteConfirmModal** - Conferma Eliminazione
Modale di conferma prima dell'eliminazione:
- Mostra il nome del cliente
- Avverte sui dati che verranno eliminati
- Richiede conferma esplicita

## 💡 Funzionalità Specifiche

### WhatsApp Integration
- **Apertura automatica**: Clicca "Invia su WhatsApp" per aprire WhatsApp Web
- **Numero automatico**: Estrae il numero dal campo telefono e lo formatta automaticamente
- **Messaggio personalizzato**: L'utente può modificare il messaggio prima dell'invio
- **Supporto italiano**: Gestisce automaticamente i numeri in formato italiano (+39 o 39)

```javascript
// Esempio di estrazione numero:
const phoneNumber = '+39 333 1234567';
// Diventa: 393331234567
```

### Validazione Form
- Tutti i form hanno validazione incorporata
- Mostra avvisi se i campi obbligatori non sono compilati
- Email viene validata sul campo email
- Date vengono validate come formato date

### Gestione degli Stati
- Il componente gestisce internamente gli stati dei modali
- Un solo modale può essere aperto alla volta
- La chiusura di un modale resetta lo stato automaticamente

## 🔧 Personalizzazione

### Modificare i Colori dei Pulsanti

Locca la sezione `/* Modals */` nel file e modifica le classi Tailwind:

```javascript
// Nel componente ClientToolbar, cerca:
<button
  onClick={handleViewDetails}
  className="... bg-slate-600 hover:bg-slate-500 ..." // Modifica qui
>
```

### Aggiungere Nuovi Campi al Form di Modifica Cliente

Nel file `ClientToolbar.js`, nella funzione `EditClientModal`, aggiungi:

```javascript
<div>
  <label className="block text-xs font-medium text-slate-400 mb-2">Nuovo Campo</label>
  <input
    type="text"
    value={formData.nuovoCampo || ''}
    onChange={(e) => handleChange('nuovoCampo', e.target.value)}
    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
  />
</div>
```

### Personalizzare il Messaggio WhatsApp Predefinito

Nel file `ClientToolbar.js`, nella funzione `WhatsAppModal`, modifica:

```javascript
const [message, setMessage] = useState(
  `Ciao ${client?.name?.split(' ')[0] || 'Cliente'}, [PERSONALIZZA IL MESSAGGIO]`
);
```

## 🌐 Integrazione con Backend

Per integrare il componente con vere API:

### Esempio 1: Salvataggio Modifiche Cliente
```javascript
onEditClient={(client) => {
  // Chiama la tua API
  fetch(`/api/clients/${client.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    console.log('Cliente aggiornato:', data);
    // Aggiorna lo stato locale
  });
}}
```

### Esempio 2: Eliminazione Cliente
```javascript
onDeleteClient={(clientId) => {
  fetch(`/api/clients/${clientId}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    console.log('Cliente eliminato');
    // Aggiorna la lista clienti
  });
}}
```

### Esempio 3: Creazione Abbonamento
```javascript
// Nel SubscriptionModal, modifica onSave:
onSave={(client, data) => {
  fetch(`/api/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: client.id,
      ...data
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Abbonamento creato:', data);
    // Aggiorna la lista abbonamenti
  });
}}
```

## 📱 Responsive Design

Il componente è completamente responsivo:
- ✅ Mobile: Pulsanti si impilano su schermi piccoli
- ✅ Tablet: Layout ottimizzato per tablet
- ✅ Desktop: Layout orizzontale con spacing ottimale
- ✅ Modali: Scrollabili su mobile, centrati su desktop

## 🎯 Flusso di Utilizzo Tipico

1. **Utente seleziona un cliente** dalla tabella
2. **Toolbar appare** con il nome del cliente
3. **Utente clicca un pulsante**
4. **Modale si apre** con il form/info corrispondente
5. **Utente completa l'azione** (modifica, invio, ecc.)
6. **Modale si chiude** e callback viene eseguito
7. **Dati vengono salvati** nel backend
8. **UI si aggiorna** con i nuovi dati

## 🐛 Troubleshooting

### Il modale non appare
- Verifica che `selectedClient` non sia null
- Controlla che il cliente esista nell'array `clients`
- Assicurati che il Z-index (z-50) non sia coperto

### WhatsApp non apre
- Verifica il numero di telefono sia in formato corretto
- Controlla che il browser permetta popup
- Prova con un numero diverso per debug

### Validazione form non funziona
- Assicurati di completare tutti i campi obbligatori (segnalati con *)
- Controlla il browser console per errori JavaScript

## 📚 File Collegati

- **[ClientToolbar.js](./ClientToolbar.js)** - Componente principale
- **[App.js](./App.js)** - File dove il componente è integrato (riga ~69)
- **[Tailwind CSS Config](./tailwind.config.js)** - Configurazione stili

## 📄 License

Questo componente fa parte del progetto IPTV Dashboard.

---

**Ultima modifica**: Gennaio 2026  
**Versione**: 1.0.0  
**Status**: ✅ Production Ready
