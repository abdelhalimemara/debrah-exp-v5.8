-- Enable the pg_cron extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_rent_due_dates();

-- Create the function to check rent due dates
CREATE OR REPLACE FUNCTION check_rent_due_dates()
RETURNS void AS $$
DECLARE
    due_date date;
    tenant_name text;
    office_id uuid;
    payable_id uuid;
    amount decimal;
BEGIN
    -- Check for payments due in 1 day
    FOR due_date, tenant_name, office_id, payable_id, amount IN
        SELECT p.due_date, t.full_name, p.office_id, p.id, p.amount
        FROM payables p
        JOIN contracts c ON p.contract_id = c.id
        JOIN tenants t ON c.tenant_id = t.id
        WHERE p.status = 'pending'
        AND p.due_date = CURRENT_DATE + INTERVAL '1 day'
    LOOP
        INSERT INTO notifications (office_id, type, title, message, metadata)
        VALUES (
            office_id,
            'rent_due',
            'Rent Due Tomorrow',
            'Rent payment of SAR ' || amount || ' from ' || tenant_name || ' is due tomorrow',
            jsonb_build_object(
                'payable_id', payable_id,
                'amount', amount,
                'tenant_name', tenant_name,
                'due_in_days', 1
            )
        );
    END LOOP;

    -- Check for payments due in 3 days
    FOR due_date, tenant_name, office_id, payable_id, amount IN
        SELECT p.due_date, t.full_name, p.office_id, p.id, p.amount
        FROM payables p
        JOIN contracts c ON p.contract_id = c.id
        JOIN tenants t ON c.tenant_id = t.id
        WHERE p.status = 'pending'
        AND p.due_date = CURRENT_DATE + INTERVAL '3 days'
    LOOP
        INSERT INTO notifications (office_id, type, title, message, metadata)
        VALUES (
            office_id,
            'rent_due',
            'Rent Due in 3 Days',
            'Rent payment of SAR ' || amount || ' from ' || tenant_name || ' is due in 3 days',
            jsonb_build_object(
                'payable_id', payable_id,
                'amount', amount,
                'tenant_name', tenant_name,
                'due_in_days', 3
            )
        );
    END LOOP;

    -- Check for payments due in 1 week
    FOR due_date, tenant_name, office_id, payable_id, amount IN
        SELECT p.due_date, t.full_name, p.office_id, p.id, p.amount
        FROM payables p
        JOIN contracts c ON p.contract_id = c.id
        JOIN tenants t ON c.tenant_id = t.id
        WHERE p.status = 'pending'
        AND p.due_date = CURRENT_DATE + INTERVAL '7 days'
    LOOP
        INSERT INTO notifications (office_id, type, title, message, metadata)
        VALUES (
            office_id,
            'rent_due',
            'Rent Due in 1 Week',
            'Rent payment of SAR ' || amount || ' from ' || tenant_name || ' is due in 1 week',
            jsonb_build_object(
                'payable_id', payable_id,
                'amount', amount,
                'tenant_name', tenant_name,
                'due_in_days', 7
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Drop existing cron job if it exists
SELECT cron.unschedule('check-rent-due-dates');

-- Schedule the job to run daily at midnight
SELECT cron.schedule(
    'check-rent-due-dates',   -- name of the cron job
    '0 0 * * *',             -- cron expression: midnight every day
    $$SELECT check_rent_due_dates();$$ -- SQL to execute
);