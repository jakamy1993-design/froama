-- ============================================================================
-- SCHEMA COMPLETO CRM IPTV - TUTTE LE TABELLE COLLEGATE
-- ============================================================================
-- Script SQL per creare tutte le tabelle del CRM IPTV con collegamenti automatici
-- Esegui questo script nell'SQL Editor di Supabase

-- ============================================================================
-- 1. TABELLA IMPOSTAZIONI (Settings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  integrations JSONB DEFAULT '{}', -- {xtreamUrl, apiKeys, etc.}
  notifications JSONB DEFAULT '{}', -- {email, whatsapp, telegram settings}
  business JSONB DEFAULT '{}', -- {companyName, address, taxId, etc.}
  pricing JSONB DEFAULT '{}', -- {defaultMargins, currency, taxRate, etc.}
  automation JSONB DEFAULT '{}', -- {autoReminders, autoRenewals, etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ============================================================================
-- 2. TABELLA CLIENTI (Clients)
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'warning', 'suspended')),
  type TEXT DEFAULT 'Standard' CHECK (type IN ('Standard', 'Reseller', 'VIP', 'Trial')),
  iptv JSONB DEFAULT '{}', -- {username, expireDate, status, mac, plan, connections, lastIp}
  payments JSONB DEFAULT '[]', -- [{id, date, item, amount, method, status}]
  notes TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_payment_date DATE,
  subscription_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. TABELLA LEAD (Leads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('Telegram', 'WhatsApp', 'Instagram', 'Web', 'Referral', 'Facebook', 'TikTok', 'Other')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'trial', 'negotiating', 'converted', 'lost')),
  time TEXT, -- timestamp relativo come "2h fa", "1g fa"
  interest TEXT, -- IPTV Sport, Reseller, IPTV Cinema, Full Package, etc.
  assigned_to TEXT, -- nome operatore assegnato
  follow_up_date DATE,
  conversion_probability INTEGER DEFAULT 0 CHECK (conversion_probability >= 0 AND conversion_probability <= 100),
  notes TEXT,
  converted_client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL, -- collega al cliente se convertito
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. TABELLA PIANI ABBONAMENTO (Subscription Plans)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- Full 12 Mesi, Base 1 Mese, etc.
  description TEXT,
  category TEXT DEFAULT 'subscription' CHECK (category IN ('subscription', 'trial', 'commercial', 'addon')),
  price DECIMAL(10,2) NOT NULL, -- prezzo di vendita
  cost DECIMAL(10,2) NOT NULL, -- costo per il rivenditore
  margin_percentage DECIMAL(5,2) DEFAULT 0, -- calcolato automaticamente
  duration_months INTEGER NOT NULL, -- durata in mesi (0 per trial)
  max_connections INTEGER DEFAULT 1,
  features JSONB DEFAULT '{}', -- {sports: true, cinema: true, 4k: true, etc.}
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. TABELLA ABBONAMENTI IPTV (Subscriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  plan_id BIGINT REFERENCES subscription_plans(id) ON DELETE SET NULL, -- riferimento al piano
  name TEXT NOT NULL, -- nome del cliente
  username TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL, -- Full 12 Mesi, Base 1 Mese, Full Sport, Cinema 3 Mesi, Trial 24h, Commercial
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'expiring', 'trial', 'suspended', 'cancelled')),
  expire_date DATE NOT NULL,
  days_left INTEGER DEFAULT 0, -- calcolato da trigger
  last_seen TEXT DEFAULT 'Mai', -- timestamp relativo come "Oggi", "Ieri", "2 giorni fa"
  phone TEXT, -- per invio messaggi WhatsApp
  mac_address TEXT,
  connections INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL, -- costo per il rivenditore
  margin_percentage DECIMAL(5,2) DEFAULT 0, -- calcolato da trigger
  auto_renewal BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. TABELLA CONTABILITÀ (Accounting)
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounting (
  id BIGSERIAL PRIMARY KEY,
  period TEXT NOT NULL, -- '2024-01', '2024-02', etc.
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'profit')),
  category TEXT NOT NULL CHECK (category IN ('subscription', 'reseller', 'server_cost', 'credit_cost', 'marketing', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE, -- nullable, per collegare a cliente specifico
  subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE CASCADE, -- nullable, per collegare ad abbonamento
  lead_id BIGINT REFERENCES leads(id), -- nullable, per collegare a lead
  payment_method TEXT CHECK (payment_method IN ('paypal', 'bank_transfer', 'crypto', 'cash', 'card', 'other')),
  transaction_date DATE NOT NULL,
  reconciled BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. TABELLA MARGINI PRODOTTI (Product Margins)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_margins (
  id BIGSERIAL PRIMARY KEY,
  product_name TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('subscription', 'reseller', 'trial', 'addon')),
  selling_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  margin_percentage DECIMAL(5,2) DEFAULT 0, -- calcolato da trigger
  total_sold INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  total_profit DECIMAL(10,2) DEFAULT 0, -- calcolato da trigger
  avg_monthly_sales INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. TABELLA AUTOMAZIONI (Automations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS automations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'renewal', 'followup', 'notification', 'report')),
  trigger_condition JSONB NOT NULL, -- {days_before_expiry: 3, status: 'expiring'}
  action_config JSONB NOT NULL, -- {message_template: '...', channels: ['whatsapp', 'email']}
  is_active BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. TABELLA LOG ATTIVITÀ (Activity Log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT, -- per future autenticazione utenti
  action TEXT NOT NULL, -- 'create_client', 'update_subscription', 'send_reminder', etc.
  entity_type TEXT NOT NULL, -- 'client', 'subscription', 'lead', 'accounting'
  entity_id BIGINT NOT NULL,
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDICI PER PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_total_spent ON clients(total_spent);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_converted_client_id ON leads(converted_client_id);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_date ON leads(follow_up_date);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_category ON subscription_plans(category);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort_order ON subscription_plans(sort_order);

CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expire_date ON subscriptions(expire_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_days_left ON subscriptions(days_left);
CREATE INDEX IF NOT EXISTS idx_subscriptions_username ON subscriptions(username);

CREATE INDEX IF NOT EXISTS idx_accounting_period ON accounting(period);
CREATE INDEX IF NOT EXISTS idx_accounting_type ON accounting(type);
CREATE INDEX IF NOT EXISTS idx_accounting_category ON accounting(category);
CREATE INDEX IF NOT EXISTS idx_accounting_transaction_date ON accounting(transaction_date);
CREATE INDEX IF NOT EXISTS idx_accounting_client_id ON accounting(client_id);
CREATE INDEX IF NOT EXISTS idx_accounting_subscription_id ON accounting(subscription_id);

CREATE INDEX IF NOT EXISTS idx_product_margins_plan_type ON product_margins(plan_type);
CREATE INDEX IF NOT EXISTS idx_product_margins_active ON product_margins(is_active);

CREATE INDEX IF NOT EXISTS idx_automations_type ON automations(type);
CREATE INDEX IF NOT EXISTS idx_automations_is_active ON automations(is_active);
CREATE INDEX IF NOT EXISTS idx_automations_next_run ON automations(next_run);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_id ON activity_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- ============================================================================
-- TRIGGER FUNCTIONS PER CALCOLI AUTOMATICI
-- ============================================================================

-- Funzione per aggiornare total_spent e last_payment_date dei clienti
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcola il totale speso dal cliente
  UPDATE clients
  SET
    total_spent = (
      SELECT COALESCE(SUM((payment->>'amount')::decimal), 0)
      FROM jsonb_array_elements(COALESCE(payments, '[]'::jsonb)) AS payment
      WHERE (payment->>'status') = 'completed'
    ),
    last_payment_date = (
      SELECT MAX((payment->>'date')::date)
      FROM jsonb_array_elements(COALESCE(payments, '[]'::jsonb)) AS payment
      WHERE (payment->>'status') = 'completed'
    ),
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare subscription_count dei clienti quando cambiano le subscriptions
CREATE OR REPLACE FUNCTION update_client_subscription_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update subscription_count for the client
  UPDATE clients
  SET
    subscription_count = (
      SELECT COUNT(*) FROM subscriptions WHERE client_id = clients.id AND status = 'active'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.client_id, OLD.client_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Funzione per creare transazione contabile quando si aggiunge un pagamento
CREATE OR REPLACE FUNCTION create_accounting_transaction()
RETURNS TRIGGER AS $$
DECLARE
  payment_record jsonb;
  transaction_period text;
BEGIN
  -- Per ogni pagamento completato, crea una transazione contabile
  FOR payment_record IN SELECT * FROM jsonb_array_elements(COALESCE(NEW.payments, '[]'::jsonb))
  LOOP
    IF (payment_record->>'status') = 'completed' AND (payment_record->>'id')::text IS NOT NULL THEN
      transaction_period := to_char((payment_record->>'date')::date, 'YYYY-MM');

      -- Inserisci transazione se non esiste già
      INSERT INTO accounting (id, period, type, category, description, amount, client_id, payment_method, transaction_date)
      VALUES (
        (payment_record->>'id')::bigint,
        transaction_period,
        'income',
        'subscription',
        payment_record->>'item',
        (payment_record->>'amount')::decimal,
        NEW.id,
        LOWER(REPLACE(payment_record->>'method', ' ', '_')),
        (payment_record->>'date')::date
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare margini prodotto quando si crea un abbonamento
CREATE OR REPLACE FUNCTION update_product_margin_on_subscription()
RETURNS TRIGGER AS $$
DECLARE
  cost_price decimal(10,2);
  margin_pct decimal(5,2);
BEGIN
  -- Calcola costo basato sul prezzo (margine 80%)
  cost_price := NEW.price * 0.2;

  -- Calcola margine percentuale, gestendo il caso prezzo zero
  margin_pct := CASE
    WHEN NEW.price > 0 THEN ROUND(((NEW.price - cost_price) / NEW.price) * 100, 2)
    ELSE 0
  END;

  -- Aggiorna o inserisci margine prodotto
  INSERT INTO product_margins (product_name, plan_type, selling_price, cost_price, margin_percentage, total_sold, total_revenue, total_cost, total_profit)
  VALUES (NEW.plan, 'subscription', NEW.price, cost_price, margin_pct, 1, NEW.price, cost_price, NEW.price - cost_price)
  ON CONFLICT (product_name) DO UPDATE SET
    total_sold = product_margins.total_sold + 1,
    total_revenue = product_margins.total_revenue + NEW.price,
    total_cost = product_margins.total_cost + EXCLUDED.cost_price,
    total_profit = product_margins.total_revenue + NEW.price - (product_margins.total_cost + EXCLUDED.cost_price),
    margin_percentage = CASE
      WHEN (product_margins.total_revenue + NEW.price) > 0 THEN
        ROUND((((product_margins.total_revenue + NEW.price) - (product_margins.total_cost + EXCLUDED.cost_price)) / (product_margins.total_revenue + NEW.price)) * 100, 2)
      ELSE 0
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare calcoli automatici degli abbonamenti
CREATE OR REPLACE FUNCTION update_subscription_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcola giorni rimanenti e margine
  NEW.days_left := CASE
    WHEN NEW.expire_date >= CURRENT_DATE THEN (NEW.expire_date - CURRENT_DATE)
    ELSE -(CURRENT_DATE - NEW.expire_date)
  END;

  NEW.margin_percentage := CASE
    WHEN NEW.price > 0 THEN ROUND(((NEW.price - NEW.cost) / NEW.price) * 100, 2)
    ELSE 0
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare calcoli automatici dei margini prodotti
CREATE OR REPLACE FUNCTION update_product_margin_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- Ricalcola margine e profitto totale
  NEW.margin_percentage := CASE
    WHEN NEW.selling_price > 0 THEN ROUND(((NEW.selling_price - NEW.cost_price) / NEW.selling_price) * 100, 2)
    ELSE 0
  END;

  NEW.total_profit := NEW.total_revenue - NEW.total_cost;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per aggiornare calcoli automatici dei piani abbonamento
CREATE OR REPLACE FUNCTION update_subscription_plan_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- Ricalcola margine
  NEW.margin_percentage := CASE
    WHEN NEW.price > 0 THEN ROUND(((NEW.price - NEW.cost) / NEW.price) * 100, 2)
    ELSE 0
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione per loggare attività
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type text;
  entity_desc text;
BEGIN
  -- Determina il tipo di azione
  IF TG_OP = 'INSERT' THEN
    action_type := 'create_' || TG_TABLE_NAME;
    entity_desc := 'Creato nuovo ' || TG_TABLE_NAME;
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update_' || TG_TABLE_NAME;
    entity_desc := 'Aggiornato ' || TG_TABLE_NAME;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete_' || TG_TABLE_NAME;
    entity_desc := 'Eliminato ' || TG_TABLE_NAME;
    -- Per DELETE, usa OLD
    INSERT INTO activity_log (action, entity_type, entity_id, description, old_values)
    VALUES (action_type, TG_TABLE_NAME, OLD.id, entity_desc, row_to_json(OLD));
    RETURN OLD;
  END IF;

  -- Per INSERT e UPDATE
  INSERT INTO activity_log (action, entity_type, entity_id, description, old_values, new_values)
  VALUES (action_type, TG_TABLE_NAME, NEW.id, entity_desc, CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END, row_to_json(NEW));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER
-- ============================================================================

-- Trigger per aggiornare statistiche clienti
CREATE TRIGGER update_client_stats_trigger
  AFTER INSERT OR UPDATE OF name, email, phone, avatar, status, type, iptv, payments, notes ON clients
  FOR EACH ROW EXECUTE FUNCTION update_client_stats();

-- Trigger per aggiornare subscription_count quando cambiano le subscriptions
CREATE TRIGGER update_client_subscription_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_client_subscription_count();

-- Trigger per creare transazioni contabili
CREATE TRIGGER create_accounting_transaction_trigger
  AFTER INSERT OR UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION create_accounting_transaction();

-- Trigger per aggiornare margini prodotti
CREATE TRIGGER update_product_margin_trigger
  AFTER INSERT ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_product_margin_on_subscription();

-- Trigger per calcoli automatici abbonamenti
CREATE TRIGGER update_subscription_calculations_trigger
  BEFORE INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscription_calculations();

-- Trigger per calcoli automatici margini prodotti
CREATE TRIGGER update_product_margin_calculations_trigger
  BEFORE INSERT OR UPDATE ON product_margins
  FOR EACH ROW EXECUTE FUNCTION update_product_margin_calculations();

-- Trigger per calcoli automatici piani abbonamento
CREATE TRIGGER update_subscription_plan_calculations_trigger
  BEFORE INSERT OR UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_subscription_plan_calculations();

-- Trigger per log attività (opzionali, commentare se non necessari)
CREATE TRIGGER log_clients_activity
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_leads_activity
  AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_subscription_plans_activity
  AFTER INSERT OR UPDATE OR DELETE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_subscriptions_activity
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_margins ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy permissive per sviluppo (modificare per produzione)
CREATE POLICY "Allow all operations for authenticated users" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON accounting FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON product_margins FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON automations FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON activity_log FOR ALL USING (true);

-- ============================================================================
-- DATI DI ESEMPIO
-- ============================================================================

-- Impostazioni di default
INSERT INTO settings (id, integrations, notifications, business, pricing, automation) VALUES
(1,
 '{"xtreamUrl": "", "apiKeys": {}}',
 '{"whatsapp": {"enabled": true, "apiKey": ""}, "email": {"enabled": false}}',
 '{"companyName": "IPTV Solutions", "address": "", "taxId": ""}',
 '{"defaultMargin": 80, "currency": "EUR", "taxRate": 22}',
 '{"autoReminders": true, "reminderDays": [1, 3, 7], "autoRenewals": false}'
) ON CONFLICT (id) DO NOTHING;

-- Clienti di esempio
INSERT INTO clients (name, email, phone, avatar, status, type, iptv, payments, notes) VALUES
('Mario Rossi', 'mario.rossi@email.com', '+39 333 1234567', 'MR', 'active', 'Standard',
 '{"username": "mario_tv_88", "expireDate": "2026-02-15", "status": "active", "mac": "00:1A:79:44:2B:11", "plan": "Full Sport + Cinema 4K", "connections": 1, "lastIp": "87.12.33.11 (Milano, IT)"}',
 '[{"id": 101, "date": "2024-02-15", "item": "Rinnovo 12 Mesi", "amount": 80, "method": "PayPal", "status": "completed"}, {"id": 102, "date": "2023-02-15", "item": "Rinnovo 12 Mesi", "amount": 75, "method": "PayPal", "status": "completed"}]',
 'Cliente storico. Preferisce contatti su Telegram.'),
('Luca Bianchi', 'luca.b@studio.com', '+39 340 9876543', 'LB', 'warning', 'Reseller',
 '{"username": "lucatv_pro", "expireDate": "2025-01-12", "status": "expiring", "mac": "11:2B:44:55:FF:AA", "plan": "Full Sport + Cinema 4K", "connections": 2, "lastIp": "151.22.45.78 (Roma, IT)"}',
 '[{"id": 201, "date": "2024-01-12", "item": "Rinnovo 12 Mesi", "amount": 150, "method": "Bank Transfer", "status": "completed"}]',
 'Rivenditore attivo. Gestisce 5 clienti.');

-- Lead di esempio
INSERT INTO leads (name, email, phone, source, status, time, interest) VALUES
('Alessandro Magno', 'alessandro.magno@email.com', '+39 333 1234567', 'Telegram', 'new', '2h fa', 'IPTV Sport'),
('Marco Polo', 'marco.polo@email.com', '+39 334 2345678', 'Referral', 'contacted', '1g fa', 'Reseller'),
('Elena di Troia', 'elena.troia@email.com', '+39 335 3456789', 'Web', 'trial', '3g fa', 'IPTV Cinema'),
('Cesare Augusto', 'cesare.augusto@email.com', '+39 336 4567890', 'Instagram', 'negotiating', '5g fa', 'Full Package'),
('Cleopatra VII', 'cleopatra.vii@email.com', '+39 337 5678901', 'WhatsApp', 'new', '10m fa', 'Crypto Info');

-- Piani abbonamento di esempio
INSERT INTO subscription_plans (name, description, category, price, cost, margin_percentage, duration_months, max_connections, features, is_active, sort_order) VALUES
('Trial 24h', 'Prova gratuita 24 ore', 'trial', 0.00, 0.00, 0.00, 0, 1, '{"sports": false, "cinema": false, "4k": false}', true, 1),
('Base 1 Mese', 'Pacchetto base 1 mese', 'subscription', 10.00, 2.00, 80.00, 1, 1, '{"sports": false, "cinema": false, "4k": false}', true, 2),
('Cinema 3 Mesi', 'Pacchetto Cinema 3 mesi', 'subscription', 25.00, 5.00, 80.00, 3, 1, '{"sports": false, "cinema": true, "4k": false}', true, 3),
('Full Sport', 'Pacchetto Sport completo', 'subscription', 45.00, 9.00, 80.00, 1, 1, '{"sports": true, "cinema": false, "4k": false}', true, 4),
('Full 12 Mesi', 'Pacchetto completo 12 mesi', 'subscription', 80.00, 16.00, 80.00, 12, 1, '{"sports": true, "cinema": true, "4k": false}', true, 5),
('Full Sport + Cinema 4K', 'Pacchetto premium 4K', 'subscription', 120.00, 24.00, 80.00, 12, 2, '{"sports": true, "cinema": true, "4k": true}', true, 6),
('Commercial', 'Licenza commerciale multi-connessione', 'commercial', 150.00, 30.00, 80.00, 12, 5, '{"sports": true, "cinema": true, "4k": true, "commercial": true}', true, 7);

-- Abbonamenti di esempio
INSERT INTO subscriptions (plan_id, name, username, plan, status, expire_date, days_left, last_seen, phone, mac_address, connections, price, cost, margin_percentage) VALUES
(5, 'Mario Rossi', 'mario_tv_88', 'Full 12 Mesi', 'expired', '2024-01-09', -1, '2 giorni fa', '+39 333 1234567', '00:1A:79:44:2B:11', 1, 80.00, 16.00, 80.00),
(2, 'Luca Bianchi', 'lucatv_pro', 'Base 1 Mese', 'expiring', '2025-01-12', 1, 'Oggi', '+39 340 9876543', '11:2B:44:55:FF:AA', 2, 10.00, 2.00, 80.00),
(4, 'Giuseppe Verdi', 'peppe_napoli', 'Full Sport', 'expiring', '2025-01-15', 3, 'Oggi', '+39 339 2345678', '22:3C:55:66:GG:BB', 1, 45.00, 9.00, 80.00),
(3, 'Luigi Neri', 'gigio_88', 'Cinema 3 Mesi', 'active', '2025-02-28', 45, 'Ieri', '+39 341 3456789', '33:4D:66:77:HH:CC', 1, 25.00, 5.00, 80.00),
(1, 'Test User 01', 'trial_x22', 'Trial 24h', 'trial', '2025-01-11', 0, '1 ora fa', '+39 342 4567890', '44:5E:77:88:II:DD', 1, 0.00, 0.00, 0.00),
(7, 'Bar Sport', 'bar_sport_to', 'Commercial', 'active', '2025-08-01', 200, 'Ora', '+39 343 5678901', '55:6F:88:99:JJ:EE', 5, 150.00, 30.00, 80.00);

-- Automazioni di esempio
INSERT INTO automations (name, type, trigger_condition, action_config, is_active) VALUES
('Promemoria Scadenza 7 Giorni', 'reminder',
 '{"days_before_expiry": 7, "status": "active"}',
 '{"message_template": "Ciao {name}, il tuo abbonamento {plan} scade tra 7 giorni. Rinnova ora!", "channels": ["whatsapp"]}',
 true),
('Promemoria Scadenza 1 Giorno', 'reminder',
 '{"days_before_expiry": 1, "status": "expiring"}',
 '{"message_template": "Urgente: {name}, il tuo abbonamento scade domani!", "channels": ["whatsapp", "email"]}',
 true),
('Follow-up Lead Non Convertito', 'followup',
 '{"days_since_contact": 3, "status": "contacted"}',
 '{"message_template": "Ciao {name}, siamo interessati al tuo interesse per {interest}. Possiamo aiutarti?", "channels": ["whatsapp"]}',
 true);

-- ============================================================================
-- VISTE UTILI PER DASHBOARD E REPORT
-- ============================================================================

-- Vista per statistiche dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  'total_clients' as metric,
  COUNT(*) as value
FROM clients
WHERE status = 'active'
UNION ALL
SELECT
  'total_leads' as metric,
  COUNT(*) as value
FROM leads
WHERE status IN ('new', 'contacted', 'trial', 'negotiating')
UNION ALL
SELECT
  'active_subscriptions' as metric,
  COUNT(*) as value
FROM subscriptions
WHERE status = 'active'
UNION ALL
SELECT
  'expiring_soon' as metric,
  COUNT(*) as value
FROM subscriptions
WHERE status = 'active' AND days_left <= 7
UNION ALL
SELECT
  'monthly_revenue' as metric,
  COALESCE(SUM(amount), 0) as value
FROM accounting
WHERE type = 'income' AND period = to_char(CURRENT_DATE, 'YYYY-MM')
UNION ALL
SELECT
  'monthly_expenses' as metric,
  COALESCE(ABS(SUM(amount)), 0) as value
FROM accounting
WHERE type = 'expense' AND period = to_char(CURRENT_DATE, 'YYYY-MM');

-- Vista per report mensile
CREATE OR REPLACE VIEW monthly_report AS
SELECT
  period,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as total_expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as net_profit,
  COUNT(DISTINCT client_id) as paying_clients,
  COUNT(CASE WHEN category = 'subscription' THEN 1 END) as subscription_sales
FROM accounting
GROUP BY period
ORDER BY period DESC;

-- ============================================================================
-- COMMENTI FINALI
-- ============================================================================
/*
Questo schema completo include:

1. TUTTE LE TABELLE del CRM IPTV collegate tra loro
2. TRIGGER automatici per calcoli e aggiornamenti
3. INDICI ottimizzati per performance
4. VISTE utili per dashboard e report
5. DATI di esempio per testare
6. LOGGING delle attività per audit trail
7. ROW LEVEL SECURITY per sicurezza

Il sistema calcolerà automaticamente:
- Margini di profitto per prodotto (tramite trigger)
- Statistiche clienti (totale speso, ultimo pagamento)
- Giorni rimanenti abbonamenti (tramite trigger)
- Transazioni contabili da pagamenti
- Statistiche dashboard in tempo reale

Per utilizzare:
1. Esegui questo script in Supabase SQL Editor
2. Le tabelle saranno create con tutti i collegamenti
3. I trigger calcoleranno automaticamente i dati
4. L'app React si collegherà automaticamente
*/