/**
 * TEST UNITARI - ClientToolbar Component
 * ======================================
 * 
 * Questi test verificano il funzionamento corretto del componente ClientToolbar
 * 
 * Per eseguire i test:
 * npm test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientToolbar from './ClientToolbar';

// Mock data
const mockClients = [
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario@example.com',
    phone: '+39 333 1234567',
    avatar: 'MR',
    status: 'active',
    type: 'Standard',
    iptv: {
      username: 'mario_tv',
      expireDate: '2026-02-15',
      status: 'active',
      mac: '00:1A:79:44:2B:11',
      plan: 'Full Sport',
      connections: 1,
      lastIp: '87.12.33.11'
    },
    notes: 'Test client'
  },
  {
    id: 2,
    name: 'Luca Bianchi',
    email: 'luca@example.com',
    phone: '+39 340 9876543',
    avatar: 'LB',
    status: 'warning',
    type: 'Reseller',
    iptv: null,
    notes: 'Another test client'
  }
];

// ============================================================================
// TEST SUITE 1: Rendering e Visibility
// ============================================================================

describe('ClientToolbar - Rendering', () => {
  test('Non renderizza la toolbar quando nessun cliente è selezionato', () => {
    const { container } = render(
      <ClientToolbar
        selectedClient={null}
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const toolbar = container.querySelector('.bg-indigo-600');
    expect(toolbar).toBeFalsy();
  });

  test('Renderizza la toolbar quando un cliente è selezionato', () => {
    const { container } = render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const toolbar = container.querySelector('.bg-indigo-600');
    expect(toolbar).toBeTruthy();
  });

  test('Mostra il nome del cliente nella toolbar', () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
  });

  test('Mostra l\'email del cliente nella toolbar', () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    expect(screen.getByText('mario@example.com')).toBeInTheDocument();
  });
});

// ============================================================================
// TEST SUITE 2: Button Visibility
// ============================================================================

describe('ClientToolbar - Button Visibility', () => {
  beforeEach(() => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );
  });

  test('Renderizza il pulsante Visualizza Dettagli', () => {
    expect(screen.getByText('Visualizza Dettagli')).toBeInTheDocument();
  });

  test('Renderizza il pulsante WhatsApp', () => {
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
  });

  test('Renderizza il pulsante Nuovo Abbonamento', () => {
    expect(screen.getByText('Nuovo Abbonamento')).toBeInTheDocument();
  });

  test('Renderizza il pulsante Modifica Cliente', () => {
    expect(screen.getByText('Modifica Cliente')).toBeInTheDocument();
  });

  test('Renderizza il pulsante Elimina Cliente', () => {
    expect(screen.getByText('Elimina Cliente')).toBeInTheDocument();
  });

  test('Renderizza il pulsante Deseleziona', () => {
    expect(screen.getByText('Deseleziona')).toBeInTheDocument();
  });
});

// ============================================================================
// TEST SUITE 3: Button Click Handlers
// ============================================================================

describe('ClientToolbar - Button Click Handlers', () => {
  test('Chiama onDeselect quando clicchi il pulsante Deseleziona', () => {
    const mockDeselect = jest.fn();
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={mockDeselect}
      />
    );

    const deselezionaButton = screen.getByText('Deseleziona');
    fireEvent.click(deselezionaButton);

    expect(mockDeselect).toHaveBeenCalledTimes(1);
  });

  test('Apre il modale Dettagli quando clicchi il pulsante', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const detailsButton = screen.getByText('Visualizza Dettagli');
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('Dettagli Cliente')).toBeInTheDocument();
    });
  });

  test('Apre il modale WhatsApp quando clicchi il pulsante', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const whatsappButton = screen.getByText('WhatsApp');
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      expect(screen.getByText('Invia su WhatsApp')).toBeInTheDocument();
    });
  });

  test('Apre il modale Modifica Client quando clicchi il pulsante', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const editButton = screen.getByText('Modifica Cliente');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Modifica Cliente')).toBeInTheDocument();
    });
  });

  test('Apre il modale Eliminazione quando clicchi il pulsante Elimina', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const deleteButton = screen.getByText('Elimina Cliente');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Conferma Eliminazione')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TEST SUITE 4: ClientDetailsModal
// ============================================================================

describe('ClientToolbar - ClientDetailsModal', () => {
  test('Mostra le informazioni personali del cliente', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const detailsButton = screen.getByText('Visualizza Dettagli');
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('mario@example.com')).toBeInTheDocument();
      expect(screen.getByText('+39 333 1234567')).toBeInTheDocument();
    });
  });

  test('Mostra le informazioni IPTV se disponibili', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const detailsButton = screen.getByText('Visualizza Dettagli');
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('mario_tv')).toBeInTheDocument();
      expect(screen.getByText('Full Sport')).toBeInTheDocument();
    });
  });

  test('Chiude il modale quando clicchi il pulsante Chiudi', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const detailsButton = screen.getByText('Visualizza Dettagli');
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(screen.getByText('Dettagli Cliente')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Chiudi');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Dettagli Cliente')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// TEST SUITE 5: WhatsAppModal
// ============================================================================

describe('ClientToolbar - WhatsAppModal', () => {
  test('Mostra il nome del cliente nel modale WhatsApp', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const whatsappButton = screen.getByText('WhatsApp');
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
    });
  });

  test('Permette di modificare il messaggio WhatsApp', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const whatsappButton = screen.getByText('WhatsApp');
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Digita il tuo messaggio...');
      fireEvent.change(textarea, { target: { value: 'Nuovo messaggio' } });
      expect(textarea.value).toBe('Nuovo messaggio');
    });
  });

  test('Chiude il modale quando clicchi Annulla', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const whatsappButton = screen.getByText('WhatsApp');
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      expect(screen.getByText('Invia su WhatsApp')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Annulla');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Invia su WhatsApp')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// TEST SUITE 6: EditClientModal
// ============================================================================

describe('ClientToolbar - EditClientModal', () => {
  test('Popola i campi del form con i dati attuali del cliente', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const editButton = screen.getByText('Modifica Cliente');
    fireEvent.click(editButton);

    await waitFor(() => {
      const inputs = screen.getAllByDisplayValue('Mario Rossi');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  test('Valida i campi obbligatori prima del salvataggio', async () => {
    const mockEdit = jest.fn();
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
        onEditClient={mockEdit}
      />
    );

    const editButton = screen.getByText('Modifica Cliente');
    fireEvent.click(editButton);

    await waitFor(() => {
      const inputs = screen.getAllByDisplayValue('Mario Rossi');
      const emailInput = screen.getByDisplayValue('mario@example.com');
      
      // Svuota il nome
      fireEvent.change(inputs[0], { target: { value: '' } });
      
      const saveButton = screen.getByText('Salva');
      fireEvent.click(saveButton);
      
      // Dovrebbe mostrare un alert di validazione
      expect(window.alert).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// TEST SUITE 7: DeleteConfirmModal
// ============================================================================

describe('ClientToolbar - DeleteConfirmModal', () => {
  test('Mostra il nome del cliente nel modale di conferma eliminazione', async () => {
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    const deleteButton = screen.getByText('Elimina Cliente');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Mario Rossi/)).toBeInTheDocument();
    });
  });

  test('Chiama onDeleteClient quando si conferma l\'eliminazione', async () => {
    const mockDelete = jest.fn();
    render(
      <ClientToolbar
        selectedClient="Mario Rossi"
        clients={mockClients}
        onDeselect={() => {}}
        onDeleteClient={mockDelete}
      />
    );

    const deleteButton = screen.getByText('Elimina Cliente');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const confirmButton = screen.getByText('Elimina');
      fireEvent.click(confirmButton);
    });

    expect(mockDelete).toHaveBeenCalledWith(1);
  });
});

// ============================================================================
// TEST SUITE 8: Missing Client Handling
// ============================================================================

describe('ClientToolbar - Edge Cases', () => {
  test('Gestisce correttamente se il cliente non esiste nella lista', () => {
    render(
      <ClientToolbar
        selectedClient="Cliente Inesistente"
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    // Dovrebbe mostrare il messaggio di nessun cliente selezionato
    expect(screen.getByText(/Nessun cliente selezionato/)).toBeInTheDocument();
  });

  test('Mostra il messaggio corretto quando nessun cliente è selezionato', () => {
    render(
      <ClientToolbar
        selectedClient={null}
        clients={mockClients}
        onDeselect={() => {}}
      />
    );

    expect(screen.getByText(/Nessun cliente selezionato/)).toBeInTheDocument();
  });

  test('Gestisce lista clienti vuota', () => {
    render(
      <ClientToolbar
        selectedClient={null}
        clients={[]}
        onDeselect={() => {}}
      />
    );

    expect(screen.getByText(/Nessun cliente selezionato/)).toBeInTheDocument();
  });
});

/**
 * COMANDI PER ESEGUIRE I TEST:
 * 
 * npm test                          # Esegui tutti i test in modalità watch
 * npm test -- --no-coverage         # Esegui senza coverage report
 * npm test -- --coverage            # Esegui con coverage report dettagliato
 * npm test ClientToolbar            # Esegui solo i test di ClientToolbar
 * npm test -- --verbose             # Esegui con output dettagliato
 */
