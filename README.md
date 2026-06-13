# Arda Hoca Akademi

Netlify + Supabase ile ücretsiz çalışacak öğrenci eğitim platformu.

## Özellikler

- Öğrenci girişi / kayıt
- Öğrenci paneli
- Dersler ve konu anlatımları
- Kişiye özel veya tüm sınıfa ödev verme
- Öğrenci ödev teslimi
- Öğretmen geri bildirimi
- Topluluk alanı
- Öğrencilerin sadece Arda Hoca'ya mesaj atabildiği kalıcı mesajlaşma
- Tarayıcı içinde Python kod çalıştırma alanı
- Öğretmen yönetim paneli

## 1. Supabase kurulumu

1. https://supabase.com adresinden ücretsiz proje oluştur.
2. Sol menüden `SQL Editor` bölümüne gir.
3. `supabase/schema.sql` dosyasının tamamını kopyalayıp çalıştır.
4. Authentication > Providers > Email açık olsun.
5. İstersen Authentication > URL Configuration bölümünde site linkini Netlify linkin olarak ayarla.

## 2. Öğretmen hesabını admin yapma

Önce siteden kendi hesabınla kayıt ol. Sonra Supabase SQL Editor'da şunu çalıştır:

```sql
update public.profiles
set role = 'teacher', full_name = 'Arda Hoca'
where id = (
  select id from auth.users where email = 'SENIN_MAIL_ADRESIN'
);
```

Örnek:

```sql
update public.profiles
set role = 'teacher', full_name = 'Arda Hoca'
where id = (
  select id from auth.users where email = 'ardabesiktasarda@gmail.com'
);
```

## 3. Local çalıştırma

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` dosyasına Supabase bilgilerini yaz:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Supabase bilgileri:

- Project Settings > API > Project URL
- Project Settings > API > anon public key

## 4. Netlify'a yükleme

1. Projeyi GitHub'a yükle.
2. Netlify > Add new site > Import an existing project.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables bölümüne şunları ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy et.

## 5. Önemli notlar

Bu proje tamamen ücretsiz servislerle çalışacak şekilde hazırlanmıştır. Supabase ve Netlify ücretsiz planlarında kota limitleri vardır. Başlangıçta öğrenci platformu için yeterlidir.

Kod çalıştırma alanı Pyodide kullanır. Python kodları öğrencinin tarayıcısında çalışır. Bu sayede ayrı Python server gerekmez.

## 6. Dosya yapısı

```text
src/
  components/
  lib/
  pages/
  App.jsx
  main.jsx
supabase/
  schema.sql
```
