-- Arda Hoca Akademi v8
-- Ders içi kod/çıktı altyapısı, topluluk beğeni/yanıt sistemi ve öğrenci pasifleştirme.
-- Supabase SQL Editor içinde bir kez çalıştır.

-- Öğrenci silme: auth.users silinmez; profil pasifleştirilir ve girişte platforma alınmaz.
alter table public.profiles
add column if not exists is_deleted boolean not null default false,
add column if not exists deleted_at timestamptz;

create index if not exists profiles_is_deleted_idx on public.profiles(is_deleted);

-- Topluluk öğretmen işaretlemeleri.
alter table public.posts
add column if not exists is_helpful boolean not null default false,
add column if not exists is_pinned boolean not null default false,
add column if not exists is_solved boolean not null default false;

-- Yorumlara yanıt verebilme.
alter table public.comments
add column if not exists parent_id uuid references public.comments(id) on delete cascade;

create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists comments_post_id_parent_idx on public.comments(post_id, parent_id);

-- Paylaşım ve yorum beğenileri.
create table if not exists public.community_likes (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (target_type, target_id, user_id)
);

create index if not exists community_likes_target_idx on public.community_likes(target_type, target_id);
create index if not exists community_likes_user_idx on public.community_likes(user_id);

alter table public.community_likes enable row level security;

-- Eski policy varsa temizle.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public' and tablename in ('community_likes')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

create policy "community_likes_read_authenticated"
on public.community_likes for select
to authenticated
using (true);

create policy "community_likes_insert_own"
on public.community_likes for insert
to authenticated
with check (user_id = auth.uid());

create policy "community_likes_delete_own_or_teacher"
on public.community_likes for delete
to authenticated
using (user_id = auth.uid() or public.is_teacher(auth.uid()));

-- Paylaşım işaretleri için öğretmen güncelleme izni.
drop policy if exists "posts_update_teacher" on public.posts;
create policy "posts_update_teacher"
on public.posts for update
to authenticated
using (public.is_teacher(auth.uid()))
with check (public.is_teacher(auth.uid()));

-- Yorum yanıtlarında parent_id ile insert hakkı mevcut policy üzerinden çalışır.
-- Profiles update_teacher policy zaten öğretmenin öğrenciyi pasifleştirmesine izin verir.
