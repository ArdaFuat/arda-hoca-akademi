-- Arda Hoca Akademi v4 - Dashboard, ders ilerleme ve test sistemi
-- Supabase SQL Editor içinde bir kez çalıştır.

alter table public.lessons
add column if not exists quiz_json jsonb not null default '[]'::jsonb;

alter table public.posts
add column if not exists helpful_count integer not null default 0,
add column if not exists is_pinned boolean not null default false,
add column if not exists is_solved boolean not null default false;

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_opened_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

-- Eski policy varsa temizle
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public' and tablename = 'lesson_progress'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

create policy "lesson_progress_read_own_or_teacher"
on public.lesson_progress for select
to authenticated
using (student_id = auth.uid() or public.is_teacher(auth.uid()));

create policy "lesson_progress_insert_own"
on public.lesson_progress for insert
to authenticated
with check (student_id = auth.uid());

create policy "lesson_progress_update_own_or_teacher"
on public.lesson_progress for update
to authenticated
using (student_id = auth.uid() or public.is_teacher(auth.uid()))
with check (student_id = auth.uid() or public.is_teacher(auth.uid()));

create policy "lesson_progress_delete_teacher"
on public.lesson_progress for delete
to authenticated
using (public.is_teacher(auth.uid()));

-- Mevcut derslerde test alanı boşsa otomatik kısa test oluştur.
update public.lessons
set quiz_json = jsonb_build_array(
  jsonb_build_object(
    'type', 'multiple_choice',
    'question', title || ' dersinde en doğru öğrenme yöntemi hangisidir?',
    'options', jsonb_build_array('Sadece başlığı okumak', 'Kodu yazıp çalıştırmak', 'Hiç pratik yapmamak', 'Cevapları ezberlemek'),
    'answer', 'Kodu yazıp çalıştırmak'
  ),
  jsonb_build_object(
    'type', 'fill_blank',
    'question', 'Python’da ekrana çıktı vermek için ____ fonksiyonu kullanılır.',
    'answer', 'print'
  )
)
where quiz_json = '[]'::jsonb or quiz_json is null;
