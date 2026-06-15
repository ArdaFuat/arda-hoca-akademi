-- Profil resmi ve isim yönetimi v6
-- Supabase SQL Editor içinde bir kez çalıştır.

alter table public.profiles
add column if not exists avatar_url text not null default '';

-- Öğrenci kendi ismini değiştiremez. Sadece kendi profil resmini bu güvenli fonksiyonla günceller.
create or replace function public.update_own_avatar(avatar_url_value text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Giriş yapılmamış.';
  end if;

  update public.profiles
  set avatar_url = coalesce(avatar_url_value, '')
  where id = auth.uid()
  returning * into updated_profile;

  return updated_profile;
end;
$$;

grant execute on function public.update_own_avatar(text) to authenticated;

-- Supabase Storage: profil fotoğrafları için public bucket.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Eski policy varsa temizle.
drop policy if exists "avatars_read_public" on storage.objects;
drop policy if exists "avatars_insert_own_folder" on storage.objects;
drop policy if exists "avatars_update_own_folder" on storage.objects;
drop policy if exists "avatars_delete_own_folder" on storage.objects;

-- Profil resimleri public okunabilir.
create policy "avatars_read_public"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Kullanıcı sadece kendi klasörüne görsel yükleyebilir: avatars/<user_id>/dosya.png
create policy "avatars_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_delete_own_folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
