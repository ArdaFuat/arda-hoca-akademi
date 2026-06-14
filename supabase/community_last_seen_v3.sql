-- Arda Hoca Akademi v3
-- Topluluk detayları + kod paylaşımı + bağlantılı ders/ödev + kullanıcı son görülme
-- Supabase SQL Editor içinde tek seferde çalıştır.

alter table public.profiles
add column if not exists last_seen_at timestamptz;

create or replace function public.touch_profile_last_seen()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set last_seen_at = now()
  where id = auth.uid();
end;
$$;

grant execute on function public.touch_profile_last_seen() to authenticated;

alter table public.posts
add column if not exists post_type text not null default 'question',
add column if not exists code_snippet text not null default '',
add column if not exists resource_url text not null default '',
add column if not exists lesson_id uuid references public.lessons(id) on delete set null,
add column if not exists assignment_id uuid references public.assignments(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_post_type_check'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
    add constraint posts_post_type_check
    check (post_type in ('question', 'code', 'project', 'resource', 'announcement'));
  end if;
end $$;

create index if not exists posts_post_type_idx on public.posts(post_type);
create index if not exists posts_lesson_id_idx on public.posts(lesson_id);
create index if not exists posts_assignment_id_idx on public.posts(assignment_id);
create index if not exists profiles_last_seen_at_idx on public.profiles(last_seen_at desc);
