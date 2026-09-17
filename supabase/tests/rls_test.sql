-- Teste de isolamento multi-tenant e permissões do cliente.
-- Executar: docker exec -i supabase_db_arquigest psql -U postgres -v ON_ERROR_STOP=1 < supabase/tests/rls_test.sql
-- Corre numa transação e faz rollback no fim.

begin;

insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data, aud, role) values
  ('00000000-0000-0000-0000-00000000000a', 'arq.a@teste.pt', now(), '{"full_name":"Arquiteta A"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000b', 'arq.b@teste.pt', now(), '{"full_name":"Arquiteto B"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000c', 'cliente.c@teste.pt', now(), '{"full_name":"Cliente C"}', 'authenticated', 'authenticated');

create temp table ctx (k text primary key, v uuid);
grant all on ctx to authenticated;

create or replace function pg_temp.login(p uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p, 'role', 'authenticated')::text, true);
$$;

set local role authenticated;

-- Arquiteta A: escritório, cliente e projeto
select pg_temp.login('00000000-0000-0000-0000-00000000000a');
insert into ctx values ('org_a', public.create_organization('Atelier A', 'PT'));
insert into public.clients (org_id, full_name, email)
  select v, 'Cliente C', 'Cliente.C@teste.pt' from ctx where k = 'org_a';
insert into ctx select 'client_c', id from public.clients limit 1;
insert into ctx select 'project', public.create_project(
  (select v from ctx where k = 'org_a'), (select v from ctx where k = 'client_c'), 'Moradia Teste');
insert into public.milestones (project_id, org_id, title, due_date, visible_to_client)
  select v, v, 'Prazo interno', current_date + 5, false from ctx where k = 'project';
insert into public.document_requests (project_id, org_id, title, requested_by)
  select v, v, 'Caderneta predial', '00000000-0000-0000-0000-00000000000a' from ctx where k = 'project';

do $$
begin
  assert (select count(*) from public.project_phases) = 7, 'PT deve ter 7 fases';
  assert (select user_id from public.clients limit 1) = '00000000-0000-0000-0000-00000000000c',
    'cliente com conta confirmada deve ficar ligado automaticamente';
  assert (select count(*) from public.project_events) >= 3, 'eventos da linha temporal';
end $$;

-- Progresso: concluir a 1.ª fase
update public.project_phases set status = 'completed' where position = 1;
do $$
begin
  assert (select progress from public.projects) = 14, 'progresso deve ser 14%';
end $$;

-- Arquiteto B: não vê nada do escritório A
select pg_temp.login('00000000-0000-0000-0000-00000000000b');
select public.create_organization('Atelier B', 'BR');
do $$
begin
  assert (select count(*) from public.projects) = 0, 'B não pode ver projetos de A';
  assert (select count(*) from public.clients) = 0, 'B não pode ver clientes de A';
  assert (select count(*) from public.messages) = 0, 'B não pode ver mensagens de A';
  begin
    insert into public.messages (project_id, org_id, sender_id, body)
      select v, v, '00000000-0000-0000-0000-00000000000b', 'intruso' from ctx where k = 'project';
    raise exception 'B conseguiu escrever no projeto de A';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.create_project((select v from ctx where k = 'org_a'), (select v from ctx where k = 'client_c'), 'x');
    raise exception 'B conseguiu criar projeto no escritório de A';
  exception when raise_exception then
    if sqlerrm <> 'Sem permissão' then raise; end if;
  end;
end $$;

-- Cliente C: vê o projeto, não vê prazos internos, não altera fases
select pg_temp.login('00000000-0000-0000-0000-00000000000c');
do $$
declare n int;
begin
  assert (select count(*) from public.projects) = 1, 'C deve ver o seu projeto';
  assert (select count(*) from public.project_phases) = 7, 'C deve ver as fases';
  assert (select count(*) from public.milestones) = 0, 'C não deve ver prazos internos';
  assert (select count(*) from public.organizations) = 1, 'C vê o escritório do projeto';
  update public.project_phases set status = 'completed';
  get diagnostics n = row_count;
  assert n = 0, 'C não pode alterar fases';
  begin
    insert into public.document_requests (project_id, org_id, title)
      select v, v, 'x' from ctx where k = 'project';
    raise exception 'C conseguiu criar pedido';
  exception when insufficient_privilege then null;
  end;
end $$;

insert into public.messages (project_id, org_id, sender_id, body)
  select v, v, '00000000-0000-0000-0000-00000000000c', 'Olá arquiteta!' from ctx where k = 'project';

-- C envia documento para o pedido, a tentar marcá-lo como "drawing" e invisível
insert into public.documents (project_id, org_id, request_id, name, kind, storage_path, visible_to_client)
  select p.v, o.v, (select id from public.document_requests limit 1), 'caderneta.pdf', 'drawing',
         o.v || '/' || p.v || '/abc-caderneta.pdf', false
    from ctx p, ctx o where p.k = 'project' and o.k = 'org_a';
do $$
begin
  assert (select kind from public.documents) = 'client_upload', 'tipo forçado a client_upload';
  assert (select visible_to_client from public.documents), 'documento do cliente visível';
  assert (select status from public.document_requests) = 'submitted', 'pedido passa a submitted';
  begin
    insert into public.documents (project_id, org_id, name, storage_path)
      select v, v, 'x.pdf', 'outro/caminho/x.pdf' from ctx where k = 'project';
    raise exception 'caminho inválido aceite';
  exception when raise_exception then
    if sqlerrm <> 'Caminho de ficheiro inválido' then raise; end if;
  end;
  begin
    perform public.review_document_request((select id from public.document_requests limit 1), true);
    raise exception 'C conseguiu aprovar o próprio documento';
  exception when raise_exception then
    if sqlerrm <> 'Sem permissão' then raise; end if;
  end;
end $$;

-- A aprova
select pg_temp.login('00000000-0000-0000-0000-00000000000a');
select public.review_document_request((select id from public.document_requests limit 1), true, 'Ok');
do $$
begin
  assert (select status from public.document_requests) = 'approved', 'aprovado';
  assert (select count(*) from public.messages) = 1, 'A vê a mensagem do cliente';
  assert exists (select 1 from public.profiles where full_name = 'Cliente C'), 'A vê o perfil do cliente';
end $$;

select 'RLS OK' as resultado;
rollback;
