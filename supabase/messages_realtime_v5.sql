-- Arda Hoca Akademi - Mesajlar canlı güncelleme düzeltmesi
-- Supabase SQL Editor içinde çalıştır.

-- Realtime için messages tablosunu yayın listesine ekle.
-- Böylece mesajlar sayfa yenilemeden diğer kullanıcıya düşer.
alter table public.messages replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      join pg_class c on c.oid = pr.prrelid
      join pg_namespace n on n.oid = c.relnamespace
      where p.pubname = 'supabase_realtime'
        and n.nspname = 'public'
        and c.relname = 'messages'
    ) then
      alter publication supabase_realtime add table public.messages;
    end if;
  end if;
end $$;
