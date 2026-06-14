-- Arda Hoca Akademi - Supabase SQL Kurulumu
-- Bu dosyayı Supabase SQL Editor içinde tek seferde çalıştır.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Öğrenci',
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  content text not null default '',
  example_code text not null default '',
  practice_task text not null default '',
  category_key text not null default 'python',
  difficulty text not null default 'Başlangıç',
  estimated_minutes integer not null default 20,
  order_index integer not null default 0,
  visible boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starter_code text not null default '',
  assigned_to uuid references public.profiles(id) on delete cascade,
  due_date date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  code_text text not null default '',
  file_url text not null default '',
  teacher_feedback text not null default '',
  score integer,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- Otomatik updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

drop trigger if exists set_submissions_updated_at on public.submissions;
create trigger set_submissions_updated_at
before update on public.submissions
for each row execute function public.set_updated_at();

-- Yeni kullanıcı gelince otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Öğrenci'),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Öğretmen kontrol fonksiyonu
create or replace function public.is_teacher(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'teacher'
  );
$$;

-- RLS aç
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.messages enable row level security;

-- Eski policy varsa temizle
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- profiles
create policy "profiles_read_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_insert_own_student"
on public.profiles for insert
to authenticated
with check (id = auth.uid() and role = 'student');

create policy "profiles_update_teacher"
on public.profiles for update
to authenticated
using (public.is_teacher(auth.uid()))
with check (public.is_teacher(auth.uid()));

-- lessons
create policy "lessons_read_visible_or_teacher"
on public.lessons for select
to authenticated
using (visible = true or public.is_teacher(auth.uid()));

create policy "lessons_insert_teacher"
on public.lessons for insert
to authenticated
with check (public.is_teacher(auth.uid()));

create policy "lessons_update_teacher"
on public.lessons for update
to authenticated
using (public.is_teacher(auth.uid()))
with check (public.is_teacher(auth.uid()));

create policy "lessons_delete_teacher"
on public.lessons for delete
to authenticated
using (public.is_teacher(auth.uid()));

-- assignments
create policy "assignments_read_related_or_teacher"
on public.assignments for select
to authenticated
using (
  public.is_teacher(auth.uid())
  or assigned_to is null
  or assigned_to = auth.uid()
);

create policy "assignments_insert_teacher"
on public.assignments for insert
to authenticated
with check (public.is_teacher(auth.uid()));

create policy "assignments_update_teacher"
on public.assignments for update
to authenticated
using (public.is_teacher(auth.uid()))
with check (public.is_teacher(auth.uid()));

create policy "assignments_delete_teacher"
on public.assignments for delete
to authenticated
using (public.is_teacher(auth.uid()));

-- submissions
create policy "submissions_read_own_or_teacher"
on public.submissions for select
to authenticated
using (student_id = auth.uid() or public.is_teacher(auth.uid()));

create policy "submissions_insert_own"
on public.submissions for insert
to authenticated
with check (student_id = auth.uid());

create policy "submissions_update_own_or_teacher"
on public.submissions for update
to authenticated
using (student_id = auth.uid() or public.is_teacher(auth.uid()))
with check (student_id = auth.uid() or public.is_teacher(auth.uid()));

create policy "submissions_delete_teacher"
on public.submissions for delete
to authenticated
using (public.is_teacher(auth.uid()));

-- posts
create policy "posts_read_authenticated"
on public.posts for select
to authenticated
using (true);

create policy "posts_insert_own"
on public.posts for insert
to authenticated
with check (author_id = auth.uid());

create policy "posts_delete_own_or_teacher"
on public.posts for delete
to authenticated
using (author_id = auth.uid() or public.is_teacher(auth.uid()));

-- comments
create policy "comments_read_authenticated"
on public.comments for select
to authenticated
using (true);

create policy "comments_insert_own"
on public.comments for insert
to authenticated
with check (author_id = auth.uid());

create policy "comments_delete_own_or_teacher"
on public.comments for delete
to authenticated
using (author_id = auth.uid() or public.is_teacher(auth.uid()));

-- messages
create policy "messages_read_student_or_teacher"
on public.messages for select
to authenticated
using (student_id = auth.uid() or public.is_teacher(auth.uid()));

create policy "messages_insert_student_or_teacher"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and (
    student_id = auth.uid()
    or public.is_teacher(auth.uid())
  )
);

create policy "messages_delete_teacher"
on public.messages for delete
to authenticated
using (public.is_teacher(auth.uid()));

-- Demo dersleri
insert into public.lessons (title, description, content, example_code, order_index, visible)
values
(
  'Python 1: Değişkenler',
  'Python’da değişken mantığını öğren.',
  'Değişken, bir değeri saklamak için kullandığımız isimdir. Python’da değişken oluşturmak için özel bir komut gerekmez. Bir isim yazıp eşittir ile değer veririz.\n\nÖrnek: isim = "Arda"\n\nBu derste string, integer ve float veri tiplerini tanıyacağız.',
  'isim = "Furkan"\nyas = 14\npuan = 92.5\n\nprint(isim)\nprint(yas)\nprint(puan)',
  1,
  true
),
(
  'Python 2: If Else',
  'Koşullu ifadeler ile karar veren programlar yaz.',
  'if else yapısı programın karar vermesini sağlar. Eğer koşul doğruysa if bloğu, yanlışsa else bloğu çalışır.',
  'not_ortalamasi = 75\n\nif not_ortalamasi >= 50:\n    print("Geçtin")\nelse:\n    print("Kaldın")',
  2,
  true
),
(
  'Python 3: Döngüler',
  'For döngüsü ile tekrar eden işlemler yap.',
  'Döngüler aynı işlemi tekrar tekrar yaptırır. for döngüsü genelde belli bir aralıkta dönmek için kullanılır.',
  'for sayi in range(1, 6):\n    print("Sayı:", sayi)',
  3,
  true
)
on conflict do nothing;
