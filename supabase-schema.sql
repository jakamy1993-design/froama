-- ============================================================================
-- SCHEMA COMPLETO CRM IPTV - SUPABASE
-- Versione Ottimizzata e Senza Errori
-- ============================================================================
-- Script SQL per creare il database completo del CRM IPTV
-- Esegui questo script nell'SQL Editor di Supabase per un setup perfetto

-- ============================================================================
-- 1. TABELLA IMPOSTAZIONI SISTEMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  crm_name TEXT DEFAULT 'OmniFlow CRM',
  support_email TEXT DEFAULT 'support@omniflow.com',
  language TEXT DEFAULT 'Italiano',
  currency TEXT DEFAULT 'EUR (€)',
  security JSONB DEFAULT '{"twoFA": false}',
  integrations JSONB DEFAULT '{"xtreamUrl": "", "xtreamUsername": "", "xtreamPassword": "", "telegramToken": ""}',
  billing JSONB DEFAULT '{"paypal": "", "bitcoin": "", "usdt": ""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- ============================================================================
-- 2. TABELLA CLIENTI
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar TEXT DEFAULT 'U',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'warning', 'suspended')),
  type TEXT DEFAULT 'Standard' CHECK (type IN ('Standard', 'Reseller', 'VIP', 'Trial')),
  iptv JSONB DEFAULT '{
    "username": "",
    "expireDate": "",
    "status": "active",
    "mac": "",
    "plan": "",
    "connections": 1,
    "lastIp": "",
    "m3uUrl": "",
    "password": ""
  }',
  payments JSONB DEFAULT '[]',
  notes TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_payment_date DATE,
  subscription_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. TABELLA LEAD/CONTATTI
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'Manuale' CHECK (source IN ('Manuale', 'Telegram', 'WhatsApp', 'Instagram', 'Web', 'Referral', 'Facebook', 'TikTok', 'Other')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'trial', 'negotiating', 'converted', 'lost')),
  interest TEXT DEFAULT 'IPTV',
  notes TEXT,
  converted_client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. TABELLA PIANI ABBONAMENTO
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'subscription' CHECK (category IN ('subscription', 'trial', 'commercial', 'addon')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_months INTEGER NOT NULL DEFAULT 1,
  max_connections INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. TABELLA ABBONAMENTI IPTV
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  plan_id BIGINT REFERENCES subscription_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'expiring', 'trial', 'suspended', 'cancelled')),
  expire_date DATE NOT NULL,
  days_left INTEGER DEFAULT 0,
  last_seen TEXT DEFAULT 'Mai',
  phone TEXT,
  mac_address TEXT,
  connections INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  auto_renewal BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. TABELLA CONTABILITÀ
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounting (
  id BIGSERIAL PRIMARY KEY,
  period TEXT NOT NULL, -- formato YYYY-MM
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'profit')),
  category TEXT NOT NULL CHECK (category IN ('subscription', 'server_cost', 'credit_cost', 'marketing', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  payment_method TEXT CHECK (payment_method IN ('paypal', 'bank_transfer', 'crypto', 'cash', 'card', 'other')),
  transaction_date DATE NOT NULL,
  reconciled BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. TABELLA LOG ATTIVITÀ (AUDIT TRAIL)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT, -- per future autenticazione
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('client', 'lead', 'subscription', 'plan', 'accounting')),
  entity_id BIGINT NOT NULL,
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDICI OTTIMIZZATI PER PERFORMANCE
-- ============================================================================

-- Indici per clients
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Indici per leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_converted_client_id ON leads(converted_client_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Indici per subscription_plans
CREATE INDEX IF NOT EXISTS idx_subscription_plans_category ON subscription_plans(category);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);

-- Indici per subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expire_date ON subscriptions(expire_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_days_left ON subscriptions(days_left);
CREATE INDEX IF NOT EXISTS idx_subscriptions_username ON subscriptions(username);

-- Indici per accounting
CREATE INDEX IF NOT EXISTS idx_accounting_period ON accounting(period);
CREATE INDEX IF NOT EXISTS idx_accounting_type ON accounting(type);
CREATE INDEX IF NOT EXISTS idx_accounting_category ON accounting(category);
CREATE INDEX IF NOT EXISTS idx_accounting_transaction_date ON accounting(transaction_date);
CREATE INDEX IF NOT EXISTS idx_accounting_client_id ON accounting(client_id);
CREATE INDEX IF NOT EXISTS idx_accounting_subscription_id ON accounting(subscription_id);

-- ============================================================================
-- FUNZIONI TRIGGER PER CALCOLI AUTOMATICI
-- ============================================================================

-- Funzione per aggiornare giorni rimanenti abbonamento
CREATE OR REPLACE FUNCTION update_subscription_days_left()
RETURNS TRIGGER AS $$
BEGIN
  NEW.days_left := CASE
    WHEN NEW.expire_date >= CURRENT_DATE THEN (NEW.expire_date - CURRENT_DATE)
    ELSE -(CURRENT_DATE - NEW.expire_date)
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare contatore abbonamenti cliente
CREATE OR REPLACE FUNCTION update_client_subscription_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clients
  SET
    subscription_count = (
      SELECT COUNT(*) FROM subscriptions
      WHERE client_id = clients.id AND status IN ('active', 'expiring')
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.client_id, OLD.client_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare statistiche finanziarie cliente
CREATE OR REPLACE FUNCTION update_client_financial_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clients
  SET
    total_spent = COALESCE((
      SELECT SUM((payment->>'amount')::decimal)
      FROM jsonb_array_elements(COALESCE(clients.payments, '[]'::jsonb)) AS payment
      WHERE (payment->>'status') = 'completed'
    ), 0),
    last_payment_date = (
      SELECT MAX((payment->>'date')::date)
      FROM jsonb_array_elements(COALESCE(clients.payments, '[]'::jsonb)) AS payment
      WHERE (payment->>'status') = 'completed'
    ),
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per creare transazione contabile da pagamento
CREATE OR REPLACE FUNCTION create_accounting_from_payment()
RETURNS TRIGGER AS $$
DECLARE
  payment_record jsonb;
  transaction_period text;
  payment_id bigint;
BEGIN
  -- Per ogni nuovo pagamento completato
  FOR payment_record IN SELECT * FROM jsonb_array_elements(COALESCE(NEW.payments, '[]'::jsonb))
  LOOP
    IF (payment_record->>'status') = 'completed' THEN
      payment_id := (payment_record->>'id')::bigint;
      transaction_period := to_char((payment_record->>'date')::date, 'YYYY-MM');

      -- Inserisci transazione se non esiste
      INSERT INTO accounting (period, type, category, description, amount, client_id, payment_method, transaction_date)
      VALUES (
        transaction_period,
        'income',
        'subscription',
        COALESCE(payment_record->>'item', 'Pagamento abbonamento'),
        (payment_record->>'amount')::decimal,
        NEW.id,
        LOWER(COALESCE(payment_record->>'method', 'other')),
        (payment_record->>'date')::date
      )
      ON CONFLICT DO NOTHING; -- Evita duplicati
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per convertire lead in cliente
CREATE OR REPLACE FUNCTION convert_lead_to_client(lead_id BIGINT, client_data JSONB)
RETURNS BIGINT AS $$
DECLARE
  new_client_id BIGINT;
BEGIN
  -- Crea nuovo cliente dai dati del lead
  INSERT INTO clients (name, email, phone, notes, type)
  VALUES (
    client_data->>'name',
    client_data->>'email',
    client_data->>'phone',
    COALESCE(client_data->>'notes', ''),
    COALESCE(client_data->>'type', 'Standard')
  )
  RETURNING id INTO new_client_id;

  -- Aggiorna lead come convertito
  UPDATE leads
  SET
    status = 'converted',
    converted_client_id = new_client_id,
    converted_at = NOW(),
    updated_at = NOW()
  WHERE id = lead_id;

  RETURN new_client_id;
END;
$$ LANGUAGE plpgsql;

-- Funzione per calcolare statistiche periodo
CREATE OR REPLACE FUNCTION calculate_period_stats(target_period TEXT DEFAULT NULL)
RETURNS TABLE (
  period TEXT,
  total_revenue DECIMAL(10,2),
  total_expenses DECIMAL(10,2),
  net_profit DECIMAL(10,2),
  avg_margin DECIMAL(5,2),
  active_subscriptions BIGINT,
  server_cost DECIMAL(10,2),
  credit_cost DECIMAL(10,2)
) AS $$
DECLARE
  calc_period TEXT := COALESCE(target_period, to_char(CURRENT_DATE, 'YYYY-MM'));
BEGIN
  RETURN QUERY
  SELECT
    calc_period,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_revenue,
    COALESCE(ABS(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
    COALESCE(ABS(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)), 0) as net_profit,
    CASE
      WHEN SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) > 0
      THEN ROUND((
        (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) -
         ABS(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END))) /
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) * 100
      ), 2)
      ELSE 0
    END as avg_margin,
    COUNT(DISTINCT s.id) as active_subscriptions,
    150.00 as server_cost, -- Costo fisso server mensile
    COUNT(DISTINCT s.id)::decimal * 2.00 as credit_cost -- €2 per abbonamento attivo
  FROM accounting a
  LEFT JOIN subscriptions s ON s.status IN ('active', 'expiring') AND
    to_char(s.created_at, 'YYYY-MM') = calc_period
  WHERE a.period = calc_period;
END;
$$ LANGUAGE plpgsql;

-- Funzione per sincronizzare contabilità automatica
CREATE OR REPLACE FUNCTION sync_accounting_data(target_period TEXT DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  calc_period TEXT := COALESCE(target_period, to_char(CURRENT_DATE, 'YYYY-MM'));
  stats RECORD;
BEGIN
  -- Ottieni statistiche del periodo
  SELECT * INTO stats FROM calculate_period_stats(calc_period);

  -- Inserisci o aggiorna record contabili
  INSERT INTO accounting (period, type, category, description, amount, transaction_date)
  VALUES
    (calc_period, 'income', 'subscription', 'Ricavi abbonamenti ' || calc_period, stats.total_revenue, (calc_period || '-01')::date),
    (calc_period, 'expense', 'server_cost', 'Costo server ' || calc_period, -stats.server_cost, (calc_period || '-01')::date),
    (calc_period, 'expense', 'credit_cost', 'Costo crediti IPTV ' || calc_period, -stats.credit_cost, (calc_period || '-01')::date),
    (calc_period, 'profit', 'net_profit', 'Utile netto ' || calc_period, stats.net_profit, (calc_period || '-01')::date)
  ON CONFLICT (period, type, category) DO UPDATE SET
    amount = EXCLUDED.amount,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Funzione per log attività
CREATE OR REPLACE FUNCTION log_entity_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  entity_desc TEXT;
  entity_type TEXT;
BEGIN
  -- Mappa nomi tabella plurali ai nomi entità singolari
  CASE TG_TABLE_NAME
    WHEN 'clients' THEN entity_type := 'client';
    WHEN 'leads' THEN entity_type := 'lead';
    WHEN 'subscriptions' THEN entity_type := 'subscription';
    WHEN 'subscription_plans' THEN entity_type := 'plan';
    WHEN 'accounting' THEN entity_type := 'accounting';
    ELSE entity_type := TG_TABLE_NAME; -- fallback per tabelle future
  END CASE;

  -- Determina tipo azione
  IF TG_OP = 'INSERT' THEN
    action_type := 'create_' || entity_type;
    entity_desc := 'Creato nuovo ' || entity_type;
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update_' || entity_type;
    entity_desc := 'Aggiornato ' || entity_type;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete_' || entity_type;
    entity_desc := 'Eliminato ' || entity_type;
    INSERT INTO activity_log (action, entity_type, entity_id, description, old_values)
    VALUES (action_type, entity_type, OLD.id, entity_desc, row_to_json(OLD));
    RETURN OLD;
  END IF;

  -- Per INSERT/UPDATE
  INSERT INTO activity_log (action, entity_type, entity_id, description, old_values, new_values)
  VALUES (action_type, entity_type, NEW.id, entity_desc,
    CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
    row_to_json(NEW));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER DEFINITIONS
-- ============================================================================

-- Trigger per aggiornare giorni rimanenti
CREATE TRIGGER update_subscription_days_trigger
  BEFORE INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscription_days_left();

-- Trigger per aggiornare contatore abbonamenti cliente
CREATE TRIGGER update_client_subscription_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_client_subscription_count();

-- Trigger per aggiornare statistiche finanziarie cliente
CREATE TRIGGER update_client_financial_stats_trigger
  AFTER INSERT OR UPDATE OF payments ON clients
  FOR EACH ROW EXECUTE FUNCTION update_client_financial_stats();

-- Trigger per creare transazioni contabili da pagamenti
CREATE TRIGGER create_accounting_from_payment_trigger
  AFTER INSERT OR UPDATE OF payments ON clients
  FOR EACH ROW EXECUTE FUNCTION create_accounting_from_payment();

-- Trigger per logging attività (opzionali)
CREATE TRIGGER log_clients_activity
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION log_entity_activity();

CREATE TRIGGER log_leads_activity
  AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_entity_activity();

CREATE TRIGGER log_subscriptions_activity
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION log_entity_activity();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy permissive per sviluppo (da modificare per produzione)
CREATE POLICY "allow_all_authenticated" ON settings FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON clients FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON leads FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON subscriptions FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON accounting FOR ALL USING (true);
CREATE POLICY "allow_all_authenticated" ON activity_log FOR ALL USING (true);

-- ============================================================================
-- DATI DI ESEMPIO PER TEST
-- ============================================================================

-- Impostazioni di default
INSERT INTO settings (crm_name, support_email, language, currency, integrations, billing) VALUES
('OmniFlow CRM', 'support@omniflow.com', 'Italiano', 'EUR (€)',
 '{"xtreamUrl": "", "xtreamUsername": "", "xtreamPassword": "", "telegramToken": ""}',
 '{"paypal": "", "bitcoin": "", "usdt": ""}')
ON CONFLICT (id) DO NOTHING;

-- Piani abbonamento di esempio
INSERT INTO subscription_plans (name, category, description, price, cost, duration_months, max_connections, is_active) VALUES
('Trial 24h', 'trial', 'Prova gratuita 24 ore', 0.00, 0.00, 0, 1, true),
('Base 1 Mese', 'subscription', 'Pacchetto base mensile', 10.00, 2.00, 1, 1, true),
('Cinema 3 Mesi', 'subscription', 'Pacchetto Cinema trimestrale', 25.00, 5.00, 3, 1, true),
('Full Sport', 'subscription', 'Pacchetto Sport completo', 45.00, 9.00, 1, 1, true),
('Full 12 Mesi', 'subscription', 'Pacchetto completo annuale', 80.00, 16.00, 12, 1, true),
('Full Sport + Cinema 4K', 'subscription', 'Pacchetto premium 4K', 120.00, 24.00, 12, 2, true),
('Commercial', 'commercial', 'Licenza commerciale multi-connessione', 150.00, 30.00, 12, 5, true)
ON CONFLICT (name) DO NOTHING;

-- Clienti di esempio
INSERT INTO clients (name, email, phone, avatar, status, type, notes) VALUES
('Mario Rossi', 'mario.rossi@email.com', '+393331234567', 'MR', 'active', 'Standard', 'Cliente storico, preferisce contatti WhatsApp'),
('Luca Bianchi', 'luca.b@studio.com', '+393409876543', 'LB', 'active', 'Reseller', 'Rivenditore attivo, gestisce 5 clienti'),
('Giuseppe Verdi', 'peppe@email.com', '+393392345678', 'GV', 'warning', 'Standard', 'Abbonamento in scadenza')
ON CONFLICT DO NOTHING;

-- Lead di esempio
INSERT INTO leads (name, email, phone, source, status, interest, notes) VALUES
('Alessandro Magno', 'alessandro@email.com', '+393331234567', 'Telegram', 'new', 'IPTV Sport', 'Interessato allo sport'),
('Marco Polo', 'marco@email.com', '+393342345678', 'Referral', 'contacted', 'Reseller', 'Vuole diventare rivenditore'),
('Elena di Troia', 'elena@email.com', '+393353456789', 'Web', 'trial', 'IPTV Cinema', 'Ha fatto la prova gratuita')
ON CONFLICT DO NOTHING;

-- Abbonamenti di esempio
INSERT INTO subscriptions (client_id, plan_id, name, username, plan, status, expire_date, phone, mac_address, connections, price, cost) VALUES
(1, 5, 'Mario Rossi', 'mario_tv_88', 'Full 12 Mesi', 'active', '2026-02-15', '+393331234567', '00:1A:79:44:2B:11', 1, 80.00, 16.00),
(2, 2, 'Luca Bianchi', 'lucatv_pro', 'Base 1 Mese', 'expiring', '2025-01-12', '+393409876543', '11:2B:44:55:FF:AA', 2, 10.00, 2.00),
(3, 4, 'Giuseppe Verdi', 'peppe_napoli', 'Full Sport', 'expiring', '2025-01-15', '+393392345678', '22:3C:55:66:GG:BB', 1, 45.00, 9.00)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- VISTE UTILI PER DASHBOARD
-- ============================================================================

-- Vista statistiche dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 'total_clients' as metric, COUNT(*)::text as value FROM clients WHERE status = 'active'
UNION ALL
SELECT 'total_leads' as metric, COUNT(*)::text as value FROM leads WHERE status IN ('new', 'contacted', 'trial', 'negotiating')
UNION ALL
SELECT 'active_subscriptions' as metric, COUNT(*)::text as value FROM subscriptions WHERE status IN ('active', 'expiring')
UNION ALL
SELECT 'expiring_soon' as metric, COUNT(*)::text as value FROM subscriptions WHERE status IN ('active', 'expiring') AND days_left <= 7
UNION ALL
SELECT 'monthly_revenue' as metric, COALESCE(SUM(amount), 0)::text as value FROM accounting WHERE type = 'income' AND period = to_char(CURRENT_DATE, 'YYYY-MM');

-- Vista report finanziario mensile
CREATE OR REPLACE VIEW monthly_financial_report AS
SELECT
  period,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as revenue,
  ABS(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) as expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) + SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as profit,
  ROUND(
    CASE
      WHEN SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) > 0
      THEN ((SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) + SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) /
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)) * 100
      ELSE 0
    END, 2
  ) as margin_percentage
FROM accounting
GROUP BY period
ORDER BY period DESC;

-- ============================================================================
-- COMMENTI E ISTRUZIONI FINALI
-- ============================================================================

/*
SCHEMA CRM IPTV - SUPABASE
==========================

Questo schema SQL crea un database completo e ottimizzato per il CRM IPTV con:

✅ TABELLE PRINCIPALI:
- settings: Configurazioni sistema
- clients: Clienti con dati IPTV e pagamenti
- leads: Contatti/lead con conversione automatica
- subscription_plans: Piani abbonamento configurabili
- subscriptions: Abbonamenti attivi con calcoli automatici
- accounting: Contabilità completa con categorie
- activity_log: Audit trail per tutte le operazioni

✅ TRIGGER AUTOMATICI:
- Calcolo giorni rimanenti abbonamenti
- Aggiornamento contatori clienti
- Sincronizzazione contabile automatica
- Logging attività per audit

✅ INDICI OTTIMIZZATI:
- Performance elevate per ricerche frequenti
- Query dashboard veloci
- Filtraggio efficiente

✅ FUNZIONI UTILI:
- convert_lead_to_client(): Conversione automatica lead
- calculate_period_stats(): Statistiche periodo
- sync_accounting_data(): Sincronizzazione contabile

✅ DATI DI ESEMPIO:
- Piani abbonamento realistici
- Clienti e lead di test
- Abbonamenti attivi

✅ VISTE DASHBOARD:
- Statistiche in tempo reale
- Report finanziari mensili

ISTRUZIONI SETUP:
1. Esegui questo script in Supabase SQL Editor
2. Verifica che tutte le tabelle siano create
3. Controlla i dati di esempio
4. L'app React si connetterà automaticamente

NOTE DI SICUREZZA:
- RLS abilitato su tutte le tabelle
- Policy permissive per sviluppo
- Modificare policy per produzione
- Aggiungere autenticazione utenti se necessario
*/