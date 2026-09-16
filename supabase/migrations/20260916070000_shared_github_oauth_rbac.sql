-- Canonical shared RBAC for GitHub OAuth identities.
-- Passwords and OAuth client secrets must remain in provider secret stores.

create table if not exists operations_shared.account_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  github_login text,
  role text not null check (role in ('owner','admin','user')),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists account_roles_email_lower_idx
  on operations_shared.account_roles (lower(email));

create table if not exists operations_shared.project_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_key text not null,
  role text not null check (role in ('owner','admin','user')),
  created_at timestamptz not null default now(),
  primary key (user_id, project_key)
);

alter table operations_shared.account_roles enable row level security;
alter table operations_shared.project_access enable row level security;

create or replace function operations_shared.current_app_role()
returns text language sql stable security definer set search_path = ''
as $$ select role from operations_shared.account_roles where user_id = auth.uid() and approved = true $$;

revoke all on function operations_shared.current_app_role() from public;
grant execute on function operations_shared.current_app_role() to authenticated;

drop policy if exists "account_roles_read_self_or_privileged" on operations_shared.account_roles;
create policy "account_roles_read_self_or_privileged" on operations_shared.account_roles
for select to authenticated using (
  user_id = auth.uid() or operations_shared.current_app_role() in ('owner','admin')
);

drop policy if exists "project_access_read_self_or_privileged" on operations_shared.project_access;
create policy "project_access_read_self_or_privileged" on operations_shared.project_access
for select to authenticated using (
  user_id = auth.uid() or operations_shared.current_app_role() in ('owner','admin')
);

create or replace function operations_shared.sync_authorized_identity()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  normalized_email text := lower(coalesce(new.email, ''));
  assigned_role text;
  is_approved boolean := false;
  gh_login text := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    new.raw_user_meta_data ->> 'login'
  );
begin
  assigned_role := case normalized_email
    when 'tanauancharles1@gmail.com' then 'owner'
    when 'kairocasino8@gmail.com' then 'admin'
    when 'huxleysee@gmail.com' then 'user'
    else 'user'
  end;

  is_approved := normalized_email in (
    'tanauancharles1@gmail.com',
    'kairocasino8@gmail.com',
    'huxleysee@gmail.com'
  );

  insert into operations_shared.account_roles
    (user_id, email, github_login, role, approved, updated_at)
  values
    (new.id, normalized_email, gh_login, assigned_role, is_approved, now())
  on conflict (user_id) do update set
    email = excluded.email,
    github_login = excluded.github_login,
    role = excluded.role,
    approved = excluded.approved,
    updated_at = now();

  delete from operations_shared.project_access where user_id = new.id;

  if is_approved then
    insert into operations_shared.project_access (user_id, project_key, role)
    select new.id, project_key, assigned_role
    from operations_shared.project_registry
    where enabled = true
    on conflict (user_id, project_key) do update set role = excluded.role;
  end if;

  return new;
end;
$$;

revoke all on function operations_shared.sync_authorized_identity() from public;

drop trigger if exists sync_authorized_identity_trigger on auth.users;
create trigger sync_authorized_identity_trigger
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function operations_shared.sync_authorized_identity();

insert into operations_shared.account_roles
  (user_id, email, github_login, role, approved, updated_at)
select
  u.id,
  lower(coalesce(u.email, '')),
  coalesce(
    u.raw_user_meta_data ->> 'user_name',
    u.raw_user_meta_data ->> 'preferred_username',
    u.raw_user_meta_data ->> 'login'
  ),
  case lower(coalesce(u.email, ''))
    when 'tanauancharles1@gmail.com' then 'owner'
    when 'kairocasino8@gmail.com' then 'admin'
    else 'user'
  end,
  lower(coalesce(u.email, '')) in (
    'tanauancharles1@gmail.com',
    'kairocasino8@gmail.com',
    'huxleysee@gmail.com'
  ),
  now()
from auth.users u
on conflict (user_id) do update set
  email = excluded.email,
  github_login = excluded.github_login,
  role = excluded.role,
  approved = excluded.approved,
  updated_at = now();

insert into operations_shared.project_access (user_id, project_key, role)
select ar.user_id, pr.project_key, ar.role
from operations_shared.account_roles ar
cross join operations_shared.project_registry pr
where ar.approved = true and pr.enabled = true
on conflict (user_id, project_key) do update set role = excluded.role;

grant usage on schema operations_shared to authenticated;
grant select on operations_shared.account_roles, operations_shared.project_access to authenticated;
