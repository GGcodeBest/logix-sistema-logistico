-- TABELA MOTORISTAS
CREATE TABLE public.drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    phone TEXT,
    plate TEXT NOT NULL,
    model TEXT,
    type TEXT,
    bank TEXT,
    agency TEXT,
    account TEXT,
    pix TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Ativo'
);

-- TABELA FRETES
CREATE TABLE public.freights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    number TEXT NOT NULL,
    date DATE NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    client TEXT NOT NULL,
    client_code TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    cargo_type TEXT,
    amount NUMERIC(10, 2) DEFAULT 0.00,
    toll NUMERIC(10, 2) DEFAULT 0.00,
    daily_allowance NUMERIC(10, 2) DEFAULT 0.00,
    other_additions NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- TABELA DESCONTOS
CREATE TABLE public.deductions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    freight_id UUID REFERENCES public.freights(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    reason TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    notes TEXT
);

-- TABELA PAGAMENTOS
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gross_amount NUMERIC(10, 2) NOT NULL,
    deductions_amount NUMERIC(10, 2) NOT NULL,
    net_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Pago'
);