-- ArquiGest — esquema base
-- Multi-tenant: cada escritório (organization) vê apenas os seus dados.
-- Clientes acedem apenas aos projetos em que são cliente.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type public.country_code as enum ('PT', 'AO', 'BR');
create type public.org_role as enum ('owner', 'admin', 'architect');
create type public.project_status as enum ('draft', 'active', 'on_hold', 'completed', 'cancelled');
create type public.phase_status as enum ('pending', 'in_progress', 'awaiting_client', 'completed');
create type public.request_status as enum ('pending', 'submitted', 'approved', 'rejected');
create type public.document_kind as enum ('drawing', 'model', 'render', 'contract', 'client_upload', 'other');

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 1),
  country public.country_code not null,
  currency text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.org_role not null default 'architect',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index on public.organization_members (user_id);

-- Convites pendentes para arquitetos (ligados automaticamente quando o e-mail é confirmado)
create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role public.org_role not null default 'architect' check (role <> 'owner'),
  invited_by uuid references public.profiles (id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, email)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  full_name text not null check (length(trim(full_name)) > 1),
  email text not null,
  phone text,
  tax_id text,          -- NIF (PT/AO) ou CPF/CNPJ (BR)
  address text,
  created_at timestamptz not null default now(),
  unique (org_id, email)
);
create index on public.clients (user_id);

-- Modelos de fases por país (ver docs/fases-projeto.md)
create table public.phase_templates (
  country public.country_code not null,
  position int not null,
  code text not null,
  name text not null,
  description text not null default '',
  default_weeks int not null default 4,
  primary key (country, position)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  lead_architect_id uuid references public.profiles (id) on delete set null,
  code text,
  name text not null check (length(trim(name)) > 1),
  description text not null default '',
  location text not null default '',
  typology text not null default '',   -- moradia, apartamento, comércio, ...
  country public.country_code not null,
  status public.project_status not null default 'active',
  start_date date,
  due_date date,
  progress int not null default 0 check (progress between 0 and 100),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.projects (org_id);
create index on public.projects (client_id);

create table public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  position int not null,
  code text not null,
  name text not null,
  description text not null default '',
  status public.phase_status not null default 'pending',
  start_date date,
  due_date date,
  completed_at timestamptz,
  unique (project_id, position)
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  phase_id uuid references public.project_phases (id) on delete set null,
  title text not null check (length(trim(title)) > 1),
  description text not null default '',
  due_date date not null,
  done_at timestamptz,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.milestones (project_id, due_date);

create table public.document_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  title text not null check (length(trim(title)) > 1),
  description text not null default '',
  due_date date,
  status public.request_status not null default 'pending',
  review_note text,
  requested_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.document_requests (project_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid references public.document_requests (id) on delete set null,
  phase_id uuid references public.project_phases (id) on delete set null,
  name text not null,
  kind public.document_kind not null default 'other',
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint,
  version int not null default 1,
  visible_to_client boolean not null default true,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.documents (project_id, created_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) > 0 and length(body) <= 5000),
  created_at timestamptz not null default now()
);
create index on public.messages (project_id, created_at);

-- Linha temporal (eventos gerados por triggers)
create table public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  type text not null,
  title text not null,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.project_events (project_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Funções auxiliares de autorização (security definer evita recursão de RLS)
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = p_org and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_org_admin(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = p_org and m.user_id = (select auth.uid())
      and m.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_project_client(p_project uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p
    join public.clients c on c.id = p.client_id
    where p.id = p_project and c.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_project_staff(p_project uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p
    join public.organization_members m on m.org_id = p.org_id
    where p.id = p_project and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.can_access_project(p_project uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_project_staff(p_project) or public.is_project_client(p_project);
$$;

-- Organizações onde o utilizador é cliente de algum projeto
create or replace function public.is_org_client(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.clients c
    where c.org_id = p_org and c.user_id = (select auth.uid())
  );
$$;

-- Perfis visíveis: o próprio, colegas de escritório, e as pessoas ligadas
-- aos projetos em que participo (arquiteto <-> cliente).
create or replace function public.can_see_profile(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_user = (select auth.uid())
    or exists (
      select 1 from public.organization_members a
      join public.organization_members b on b.org_id = a.org_id
      where a.user_id = (select auth.uid()) and b.user_id = p_user
    )
    or exists ( -- sou staff e o outro é cliente do meu escritório
      select 1 from public.organization_members a
      join public.clients c on c.org_id = a.org_id
      where a.user_id = (select auth.uid()) and c.user_id = p_user
    )
    or exists ( -- sou cliente e o outro é staff do escritório
      select 1 from public.clients c
      join public.organization_members b on b.org_id = c.org_id
      where c.user_id = (select auth.uid()) and b.user_id = p_user
    );
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Perfil automático + ligação de convites/clientes quando o e-mail é confirmado
create or replace function public.handle_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, full_name, email)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
    on conflict (id) do nothing;
  elsif new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;

  if new.email_confirmed_at is not null then
    update public.clients
       set user_id = new.id
     where user_id is null and lower(email) = lower(new.email);

    insert into public.organization_members (org_id, user_id, role)
    select i.org_id, new.id, i.role
      from public.organization_invitations i
     where i.accepted_at is null and lower(i.email) = lower(new.email)
    on conflict do nothing;

    update public.organization_invitations
       set accepted_at = now()
     where accepted_at is null and lower(email) = lower(new.email);
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user();

create trigger on_auth_user_updated
  after update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user();

-- Cliente criado com e-mail de uma conta já confirmada: liga logo
create or replace function public.link_client_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.email := lower(trim(new.email));
  if new.user_id is null then
    select u.id into new.user_id
      from auth.users u
     where lower(u.email) = new.email and u.email_confirmed_at is not null
     limit 1;
  end if;
  return new;
end;
$$;

create trigger clients_link_user
  before insert on public.clients
  for each row execute function public.link_client_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- Garante que org_id das tabelas filhas coincide com o do projeto
create or replace function public.set_org_from_project()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select p.org_id into new.org_id from public.projects p where p.id = new.project_id;
  if new.org_id is null then
    raise exception 'Projeto inexistente';
  end if;
  return new;
end;
$$;

create trigger phases_org before insert or update of project_id on public.project_phases
  for each row execute function public.set_org_from_project();
create trigger milestones_org before insert or update of project_id on public.milestones
  for each row execute function public.set_org_from_project();
create trigger requests_org before insert or update of project_id on public.document_requests
  for each row execute function public.set_org_from_project();
-- prefixo "aa_" para correr antes de documents_guard (triggers disparam por ordem alfabética)
create trigger aa_documents_org before insert or update of project_id on public.documents
  for each row execute function public.set_org_from_project();
create trigger messages_org before insert or update of project_id on public.messages
  for each row execute function public.set_org_from_project();

-- Regista um evento na linha temporal
create or replace function public.log_event(
  p_project uuid, p_type text, p_title text, p_visible boolean default true
) returns void language sql security definer set search_path = '' as $$
  insert into public.project_events (project_id, org_id, actor_id, type, title, visible_to_client)
  select p.id, p.org_id, (select auth.uid()), p_type, p_title, p_visible
    from public.projects p where p.id = p_project;
$$;
revoke execute on function public.log_event(uuid, text, text, boolean) from public, anon, authenticated;

create or replace function public.projects_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_event(new.id, 'project_created', 'Projeto criado');
  elsif new.status is distinct from old.status then
    perform public.log_event(new.id, 'project_status', 'Estado do projeto alterado para ' ||
      case new.status
        when 'draft' then 'Rascunho'
        when 'active' then 'Em curso'
        when 'on_hold' then 'Suspenso'
        when 'completed' then 'Concluído'
        when 'cancelled' then 'Cancelado'
      end);
  end if;
  return new;
end;
$$;
create trigger projects_events after insert or update of status on public.projects
  for each row execute function public.projects_events();

-- Documentos e pedidos: o cliente só pode enviar documentos para si e com tipo client_upload
create or replace function public.documents_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.storage_path not like new.org_id::text || '/' || new.project_id::text || '/%' then
    raise exception 'Caminho de ficheiro inválido';
  end if;
  if not public.is_project_staff(new.project_id) then
    new.kind := 'client_upload';
    new.visible_to_client := true;
    new.phase_id := null;
  end if;
  new.uploaded_by := (select auth.uid());

  -- versão = nº de documentos anteriores com o mesmo nome (ou mesmo pedido)
  select coalesce(max(d.version), 0) + 1 into new.version
    from public.documents d
   where d.project_id = new.project_id
     and (
       (new.request_id is not null and d.request_id = new.request_id)
       or (new.request_id is null and d.request_id is null and lower(d.name) = lower(new.name))
     );
  return new;
end;
$$;
create trigger documents_guard before insert on public.documents
  for each row execute function public.documents_guard();

create or replace function public.documents_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.request_id is not null then
    update public.document_requests
       set status = 'submitted', review_note = null
     where id = new.request_id and status in ('pending', 'rejected');
  end if;
  perform public.log_event(
    new.project_id,
    'document_uploaded',
    case when new.kind = 'client_upload' then 'Cliente enviou documento: ' else 'Documento publicado: ' end
      || new.name || case when new.version > 1 then ' (v' || new.version || ')' else '' end,
    new.visible_to_client
  );
  return new;
end;
$$;
create trigger documents_events after insert on public.documents
  for each row execute function public.documents_events();

create or replace function public.requests_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_event(new.project_id, 'request_created', 'Documento pedido ao cliente: ' || new.title);
  elsif new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    perform public.log_event(new.project_id, 'request_' || new.status,
      case new.status when 'approved' then 'Documento aprovado: ' else 'Documento rejeitado: ' end || new.title);
  end if;
  return new;
end;
$$;
create trigger requests_events after insert or update of status on public.document_requests
  for each row execute function public.requests_events();

-- Fases: datas de conclusão, progresso do projeto e eventos
create or replace function public.phases_before()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'completed' and (tg_op = 'INSERT' or old.status <> 'completed') then
    new.completed_at := now();
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;
  return new;
end;
$$;
create trigger phases_before before insert or update of status on public.project_phases
  for each row execute function public.phases_before();

create or replace function public.phases_after()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_project uuid := coalesce(new.project_id, old.project_id);
begin
  update public.projects p
     set progress = coalesce((
       select round(100.0 * count(*) filter (where ph.status = 'completed') / nullif(count(*), 0))
         from public.project_phases ph where ph.project_id = v_project
     ), 0)
   where p.id = v_project;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    perform public.log_event(new.project_id, 'phase_' || new.status,
      case new.status
        when 'in_progress' then 'Fase iniciada: '
        when 'awaiting_client' then 'Fase aguarda aprovação do cliente: '
        when 'completed' then 'Fase concluída: '
        else 'Fase reaberta: '
      end || new.name);
  end if;
  return null;
end;
$$;
create trigger phases_after after insert or update of status or delete on public.project_phases
  for each row execute function public.phases_after();

create or replace function public.milestones_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_event(new.project_id, 'milestone_created',
      'Novo prazo: ' || new.title || ' (' || to_char(new.due_date, 'DD/MM/YYYY') || ')', new.visible_to_client);
  elsif new.done_at is not null and old.done_at is null then
    perform public.log_event(new.project_id, 'milestone_done', 'Prazo cumprido: ' || new.title, new.visible_to_client);
  elsif new.due_date is distinct from old.due_date then
    perform public.log_event(new.project_id, 'milestone_moved',
      'Prazo alterado: ' || new.title || ' → ' || to_char(new.due_date, 'DD/MM/YYYY'), new.visible_to_client);
  end if;
  return new;
end;
$$;
create trigger milestones_events after insert or update of done_at, due_date on public.milestones
  for each row execute function public.milestones_events();

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

-- Cria o escritório e torna o utilizador atual proprietário
create or replace function public.create_organization(p_name text, p_country public.country_code)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_org uuid;
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'Não autenticado';
  end if;
  insert into public.organizations (name, country, currency)
  values (trim(p_name), p_country,
          case p_country when 'PT' then 'EUR' when 'AO' then 'AOA' else 'BRL' end)
  returning id into v_org;
  insert into public.organization_members (org_id, user_id, role) values (v_org, v_uid, 'owner');
  return v_org;
end;
$$;
revoke execute on function public.create_organization(text, public.country_code) from public, anon;

-- Cria o projeto com as fases do modelo do país, com datas sequenciais
create or replace function public.create_project(
  p_org uuid,
  p_client uuid,
  p_name text,
  p_description text default '',
  p_location text default '',
  p_typology text default '',
  p_start date default current_date,
  p_due date default null,
  p_code text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_project uuid;
  v_country public.country_code;
  v_cursor date := coalesce(p_start, current_date);
  t record;
begin
  if not public.is_org_member(p_org) then
    raise exception 'Sem permissão';
  end if;
  if not exists (select 1 from public.clients c where c.id = p_client and c.org_id = p_org) then
    raise exception 'Cliente inválido';
  end if;
  select o.country into v_country from public.organizations o where o.id = p_org;

  insert into public.projects (org_id, client_id, lead_architect_id, code, name, description,
                               location, typology, country, start_date, due_date, created_by)
  values (p_org, p_client, (select auth.uid()), nullif(trim(p_code), ''), trim(p_name),
          coalesce(p_description, ''), coalesce(p_location, ''), coalesce(p_typology, ''),
          v_country, v_cursor, p_due, (select auth.uid()))
  returning id into v_project;

  for t in select * from public.phase_templates where country = v_country order by position loop
    insert into public.project_phases (project_id, org_id, position, code, name, description,
                                       status, start_date, due_date)
    values (v_project, p_org, t.position, t.code, t.name, t.description,
            case when t.position = 1 then 'in_progress'::public.phase_status else 'pending' end,
            v_cursor, v_cursor + (t.default_weeks * 7));
    v_cursor := v_cursor + (t.default_weeks * 7);
  end loop;

  if p_due is null then
    update public.projects set due_date = v_cursor where id = v_project;
  end if;
  return v_project;
end;
$$;
revoke execute on function public.create_project(uuid, uuid, text, text, text, text, date, date, text) from public, anon;

-- Revisão de pedido de documento (aprovar/rejeitar) — só staff
create or replace function public.review_document_request(p_request uuid, p_approve boolean, p_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_project uuid;
begin
  select project_id into v_project from public.document_requests where id = p_request;
  if v_project is null or not public.is_project_staff(v_project) then
    raise exception 'Sem permissão';
  end if;
  update public.document_requests
     set status = case when p_approve then 'approved'::public.request_status else 'rejected' end,
         review_note = nullif(trim(p_note), ''),
         reviewed_by = (select auth.uid())
   where id = p_request;
end;
$$;
revoke execute on function public.review_document_request(uuid, boolean, text) from public, anon;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.clients enable row level security;
alter table public.phase_templates enable row level security;
alter table public.projects enable row level security;
alter table public.project_phases enable row level security;
alter table public.milestones enable row level security;
alter table public.document_requests enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.project_events enable row level security;

-- profiles
create policy "profiles_select" on public.profiles for select to authenticated
  using (public.can_see_profile(id));
create policy "profiles_update_self" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- organizations
create policy "orgs_select" on public.organizations for select to authenticated
  using (public.is_org_member(id) or public.is_org_client(id));
create policy "orgs_update" on public.organizations for update to authenticated
  using (public.is_org_admin(id)) with check (public.is_org_admin(id));

-- organization_members
create policy "members_select" on public.organization_members for select to authenticated
  using (public.is_org_member(org_id) or public.is_org_client(org_id));
create policy "members_update" on public.organization_members for update to authenticated
  using (public.is_org_admin(org_id) and role <> 'owner')
  with check (public.is_org_admin(org_id) and role <> 'owner');
create policy "members_delete" on public.organization_members for delete to authenticated
  using (public.is_org_admin(org_id) and role <> 'owner');

-- organization_invitations
create policy "invites_select" on public.organization_invitations for select to authenticated
  using (public.is_org_member(org_id));
create policy "invites_insert" on public.organization_invitations for insert to authenticated
  with check (public.is_org_admin(org_id));
create policy "invites_update" on public.organization_invitations for update to authenticated
  using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));
create policy "invites_delete" on public.organization_invitations for delete to authenticated
  using (public.is_org_admin(org_id));

-- clients
create policy "clients_select" on public.clients for select to authenticated
  using (public.is_org_member(org_id) or user_id = (select auth.uid()));
create policy "clients_insert" on public.clients for insert to authenticated
  with check (public.is_org_member(org_id));
create policy "clients_update" on public.clients for update to authenticated
  using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "clients_delete" on public.clients for delete to authenticated
  using (public.is_org_admin(org_id));

-- phase_templates
create policy "templates_select" on public.phase_templates for select to authenticated using (true);

-- projects
create policy "projects_select" on public.projects for select to authenticated
  using (public.is_org_member(org_id) or public.is_project_client(id));
create policy "projects_update" on public.projects for update to authenticated
  using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "projects_delete" on public.projects for delete to authenticated
  using (public.is_org_admin(org_id));

-- project_phases
create policy "phases_select" on public.project_phases for select to authenticated
  using (public.can_access_project(project_id));
create policy "phases_insert" on public.project_phases for insert to authenticated
  with check (public.is_project_staff(project_id));
create policy "phases_update" on public.project_phases for update to authenticated
  using (public.is_project_staff(project_id)) with check (public.is_project_staff(project_id));
create policy "phases_delete" on public.project_phases for delete to authenticated
  using (public.is_project_staff(project_id));

-- milestones
create policy "milestones_select" on public.milestones for select to authenticated
  using (public.is_project_staff(project_id) or (visible_to_client and public.is_project_client(project_id)));
create policy "milestones_insert" on public.milestones for insert to authenticated
  with check (public.is_project_staff(project_id));
create policy "milestones_update" on public.milestones for update to authenticated
  using (public.is_project_staff(project_id)) with check (public.is_project_staff(project_id));
create policy "milestones_delete" on public.milestones for delete to authenticated
  using (public.is_project_staff(project_id));

-- document_requests (revisão via RPC review_document_request)
create policy "requests_select" on public.document_requests for select to authenticated
  using (public.can_access_project(project_id));
create policy "requests_insert" on public.document_requests for insert to authenticated
  with check (public.is_project_staff(project_id) and requested_by = (select auth.uid()));
create policy "requests_delete" on public.document_requests for delete to authenticated
  using (public.is_project_staff(project_id));

-- documents
create policy "documents_select" on public.documents for select to authenticated
  using (public.is_project_staff(project_id) or (visible_to_client and public.is_project_client(project_id)));
create policy "documents_insert" on public.documents for insert to authenticated
  with check (public.can_access_project(project_id));
create policy "documents_update" on public.documents for update to authenticated
  using (public.is_project_staff(project_id)) with check (public.is_project_staff(project_id));
create policy "documents_delete" on public.documents for delete to authenticated
  using (public.is_project_staff(project_id));

-- messages
create policy "messages_select" on public.messages for select to authenticated
  using (public.can_access_project(project_id));
create policy "messages_insert" on public.messages for insert to authenticated
  with check (public.can_access_project(project_id) and sender_id = (select auth.uid()));

-- project_events (só leitura; escrita via triggers)
create policy "events_select" on public.project_events for select to authenticated
  using (public.is_project_staff(project_id) or (visible_to_client and public.is_project_client(project_id)));

-- ---------------------------------------------------------------------------
-- Storage: bucket privado; caminho = {org_id}/{project_id}/{ficheiro}
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 524288000) -- 500 MB (modelos IFC)
on conflict (id) do nothing;

create or replace function public.storage_project_id(p_name text)
returns uuid language plpgsql immutable set search_path = '' as $$
begin
  return (string_to_array(p_name, '/'))[2]::uuid;
exception when others then
  return null;
end;
$$;

create policy "files_select" on storage.objects for select to authenticated
  using (
    bucket_id = 'project-files' and exists (
      select 1 from public.documents d
      where d.storage_path = storage.objects.name
        and (public.is_project_staff(d.project_id)
             or (d.visible_to_client and public.is_project_client(d.project_id)))
    )
  );
create policy "files_insert" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-files'
    and public.can_access_project(public.storage_project_id(name))
  );
create policy "files_delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-files'
    and public.is_project_staff(public.storage_project_id(name))
  );

-- ---------------------------------------------------------------------------
-- Realtime para a conversa
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
