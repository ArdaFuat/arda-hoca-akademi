-- Arda Hoca Akademi - Dersler v2 kurs planı ve içerik yükleme
-- Supabase > SQL Editor içinde tek sefer çalıştırabilirsin.
alter table public.lessons add column if not exists practice_task text not null default '';
alter table public.lessons add column if not exists category_key text not null default 'python';
alter table public.lessons add column if not exists difficulty text not null default 'Başlangıç';
alter table public.lessons add column if not exists estimated_minutes integer not null default 20;
delete from public.lessons;
insert into public.lessons (title, description, content, example_code, practice_task, category_key, difficulty, estimated_minutes, order_index, visible) values
('Python Nedir?','Python dilinin kullanım alanlarını ve kurs boyunca ilerleme mantığını öğren.','## Dersin Amacı
Bu derste Python Nedir? konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Python dilinin kullanım alanlarını ve kurs boyunca ilerleme mantığını öğren. Bu konu Python bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Merhaba Python")','Python ile yapılabilecek 5 farklı proje fikri yaz ve hangisini yapmak istediğini seç.','python','Başlangıç',18,1,true),
('Replit ile Kurulum Gerektirmeden Python Geliştirme','Tarayıcı üzerinden hızlıca Python kodu yazıp çalıştırmayı öğren.','## Dersin Amacı
Bu derste Replit ile Kurulum Gerektirmeden Python Geliştirme konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tarayıcı üzerinden hızlıca Python kodu yazıp çalıştırmayı öğren. Bu konu Python Geliştirme Ortamı bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Replit veya web editörü hazır!")','Tarayıcıdaki kod alanında adını ekrana yazdıran bir program dene.','gelistirme-ortami','Başlangıç',18,2,true),
('Python Kurulumu Nasıl Yapılır?','Python kurulumu, PATH seçeneği ve sürüm kontrolünü öğren.','## Dersin Amacı
Bu derste Python Kurulumu Nasıl Yapılır? konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Python kurulumu, PATH seçeneği ve sürüm kontrolünü öğren. Bu konu Python Geliştirme Ortamı bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Kurulum kontrolü başarılı")','Bilgisayarında python --version komutunun hangi sonucu verdiğini not al.','gelistirme-ortami','Başlangıç',20,3,true),
('Python için Editör Kurulumu','VS Code gibi editörlerle Python dosyası oluşturmayı öğren.','## Dersin Amacı
Bu derste Python için Editör Kurulumu konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
VS Code gibi editörlerle Python dosyası oluşturmayı öğren. Bu konu Python Geliştirme Ortamı bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Editörüm hazır")','hello.py adlı dosya oluşturup içine print komutu yaz.','gelistirme-ortami','Başlangıç',20,4,true),
('Python için Komut Satırı Programının Kullanımı','Terminal veya komut satırı üzerinden Python dosyası çalıştırmayı öğren.','## Dersin Amacı
Bu derste Python için Komut Satırı Programının Kullanımı konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Terminal veya komut satırı üzerinden Python dosyası çalıştırmayı öğren. Bu konu Python Geliştirme Ortamı bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Bu dosya komut satırından çalıştı")','Bir .py dosyasını terminalden çalıştırmayı dene.','gelistirme-ortami','Başlangıç',22,5,true),
('Python ile İlk Uygulama','İlk mini Python uygulamanı yazarak giriş, işlem ve çıktı mantığını gör.','## Dersin Amacı
Bu derste Python ile İlk Uygulama konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
İlk mini Python uygulamanı yazarak giriş, işlem ve çıktı mantığını gör. Bu konu Python Geliştirme Ortamı bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','ad = input("Adın: ")
print("Merhaba", ad)','Kullanıcıdan ad ve yaş alıp tek cümlede yazdır.','gelistirme-ortami','Başlangıç',25,6,true),
('Python Sayı Veri Tipleri: Integer ve Float','Tam sayı ve ondalıklı sayıların farkını öğren.','## Dersin Amacı
Bu derste Python Sayı Veri Tipleri: Integer ve Float konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tam sayı ve ondalıklı sayıların farkını öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','tam_sayi = 25
ondalikli = 12.5
print(type(tam_sayi))
print(type(ondalikli))','İki ürün fiyatı tanımla ve toplam tutarı hesapla.','objeler-veri-yapilari','Başlangıç',22,7,true),
('Python Matematiksel Operatörler','Toplama, çıkarma, çarpma, bölme, mod ve üs alma işlemlerini öğren.','## Dersin Amacı
Bu derste Python Matematiksel Operatörler konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Toplama, çıkarma, çarpma, bölme, mod ve üs alma işlemlerini öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','a = 10
b = 3
print(a + b)
print(a / b)
print(a % b)
print(a ** b)','Bir dikdörtgenin alanını ve çevresini hesaplayan kod yaz.','objeler-veri-yapilari','Başlangıç',25,8,true),
('Python Değişken Tanımlama','Verileri isimlendirip program içinde saklamayı öğren.','## Dersin Amacı
Bu derste Python Değişken Tanımlama konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Verileri isimlendirip program içinde saklamayı öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','isim = "Arda"
yas = 19
aktif_mi = True
print(isim, yas, aktif_mi)','Kendi öğrenci kartını değişkenlerle oluştur.','objeler-veri-yapilari','Başlangıç',20,9,true),
('Python Veri Tipi Dönüşümleri','String, int ve float dönüşümlerini öğren.','## Dersin Amacı
Bu derste Python Veri Tipi Dönüşümleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
String, int ve float dönüşümlerini öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','sayi = "42"
sayi = int(sayi)
print(sayi + 8)','Kullanıcıdan iki sayı alıp toplamını yazdır.','objeler-veri-yapilari','Başlangıç',25,10,true),
('Python Karakter Dizileri: Strings','Metinleri indeksleme, parçalama ve birleştirmeyi öğren.','## Dersin Amacı
Bu derste Python Karakter Dizileri: Strings konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Metinleri indeksleme, parçalama ve birleştirmeyi öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','mesaj = "Python Dersi"
print(mesaj[0])
print(mesaj[0:6])
print(len(mesaj))','Adını tersten yazdırmayı dene.','objeler-veri-yapilari','Başlangıç',25,11,true),
('Python String Metotları','upper, lower, replace, split gibi metotları kullan.','## Dersin Amacı
Bu derste Python String Metotları konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
upper, lower, replace, split gibi metotları kullan. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','metin = "python programlama"
print(metin.upper())
print(metin.replace("python", "Python"))','Kullanıcının yazdığı cümledeki boşlukları temizleyip büyük harfe çevir.','objeler-veri-yapilari','Başlangıç',25,12,true),
('Python Listeler','Birden fazla veriyi tek değişkende liste olarak sakla.','## Dersin Amacı
Bu derste Python Listeler konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Birden fazla veriyi tek değişkende liste olarak sakla. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','ogrenciler = ["Ali", "Ayşe", "Mehmet"]
print(ogrenciler[0])
ogrenciler.append("Zeynep")
print(ogrenciler)','3 ürünlü alışveriş listesi oluştur ve sonuna yeni ürün ekle.','objeler-veri-yapilari','Başlangıç',25,13,true),
('Python Liste Metotları','append, remove, pop, sort ve reverse metotlarını öğren.','## Dersin Amacı
Bu derste Python Liste Metotları konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
append, remove, pop, sort ve reverse metotlarını öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','sayilar = [5, 2, 9, 1]
sayilar.sort()
print(sayilar)','Bir puan listesi oluşturup küçükten büyüğe sırala.','objeler-veri-yapilari','Başlangıç',25,14,true),
('Python Tuple','Değiştirilemeyen veri koleksiyonlarını öğren.','## Dersin Amacı
Bu derste Python Tuple konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Değiştirilemeyen veri koleksiyonlarını öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','konum = (39.9, 32.8)
print(konum[0])','Bir RGB renk değerini tuple olarak sakla.','objeler-veri-yapilari','Başlangıç',18,15,true),
('Python Sets','Tekrarsız veri saklayan set yapısını öğren.','## Dersin Amacı
Bu derste Python Sets konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tekrarsız veri saklayan set yapısını öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','sayilar = {1, 2, 2, 3, 4}
print(sayilar)','Tekrar eden isimlerden oluşan listeyi set ile tekilleştir.','objeler-veri-yapilari','Başlangıç',20,16,true),
('Python Dictionary','Anahtar-değer mantığı ile veri saklamayı öğren.','## Dersin Amacı
Bu derste Python Dictionary konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Anahtar-değer mantığı ile veri saklamayı öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','ogrenci = {"ad": "Arda", "yas": 19, "ders": "Python"}
print(ogrenci["ad"])','Bir ürünün adı, fiyatı ve stok bilgisini dictionary olarak yaz.','objeler-veri-yapilari','Başlangıç',25,17,true),
('Python Value ve Referans Veri Tipleri','Değer ve referans mantığını listeler üzerinden öğren.','## Dersin Amacı
Bu derste Python Value ve Referans Veri Tipleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Değer ve referans mantığını listeler üzerinden öğren. Bu konu Python Objeleri ve Veri Yapıları bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','liste1 = [1, 2, 3]
liste2 = liste1
liste2.append(4)
print(liste1)','Liste kopyalarken copy() kullanarak farkı gözlemle.','objeler-veri-yapilari','Başlangıç',25,18,true),
('Python Operatörler','Operatör türlerini genel olarak tanı.','## Dersin Amacı
Bu derste Python Operatörler konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Operatör türlerini genel olarak tanı. Bu konu Python Operatörler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','x = 10
y = 5
print(x > y)','Her operatör türüne bir örnek yaz.','operatorler','Başlangıç',18,19,true),
('Python Aritmetik Operatörler','Sayısal işlemlerde kullanılan operatörleri uygula.','## Dersin Amacı
Bu derste Python Aritmetik Operatörler konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Sayısal işlemlerde kullanılan operatörleri uygula. Bu konu Python Operatörler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print(10 + 3)
print(10 // 3)
print(10 % 3)
print(2 ** 4)','Bir sayının tek mi çift mi olduğunu mod ile bul.','operatorler','Başlangıç',20,20,true),
('Python Atama Operatörleri','Değişken değerlerini kısa yoldan güncellemeyi öğren.','## Dersin Amacı
Bu derste Python Atama Operatörleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Değişken değerlerini kısa yoldan güncellemeyi öğren. Bu konu Python Operatörler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','puan = 50
puan += 10
puan *= 2
print(puan)','Bir oyun puanını her doğru cevapta 5 artıran kod yaz.','operatorler','Başlangıç',20,21,true),
('Python Karşılaştırma Operatörleri','Değerleri karşılaştırıp True/False sonucu üret.','## Dersin Amacı
Bu derste Python Karşılaştırma Operatörleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Değerleri karşılaştırıp True/False sonucu üret. Bu konu Python Operatörler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','yas = 18
print(yas >= 18)
print(yas == 20)','Kullanıcının yaşının ehliyet için yeterli olup olmadığını kontrol et.','operatorler','Başlangıç',20,22,true),
('Python Mantıksal Operatörler','and, or ve not ile çoklu koşullar oluştur.','## Dersin Amacı
Bu derste Python Mantıksal Operatörler konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
and, or ve not ile çoklu koşullar oluştur. Bu konu Python Operatörler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','yas = 20
veli_izni = False
print(yas >= 18 or veli_izni)','Giriş için kullanıcı adı ve şifre kontrolü yapan koşul yaz.','operatorler','Başlangıç',22,23,true),
('Python Koşul İfadeleri','if, elif ve else ile karar veren programlar yaz.','## Dersin Amacı
Bu derste Python Koşul İfadeleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
if, elif ve else ile karar veren programlar yaz. Bu konu Python Koşul İfadeleri bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','notu = 72
if notu >= 85:
    print("Pek iyi")
elif notu >= 50:
    print("Geçti")
else:
    print("Kaldı")','Not ortalamasına göre geçti/kaldı programı yaz.','kosul-ifadeleri','Başlangıç',25,24,true),
('Python Koşullu İfadeler Örnekleri','Gerçek hayattan koşul uygulamaları yap.','## Dersin Amacı
Bu derste Python Koşullu İfadeler Örnekleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Gerçek hayattan koşul uygulamaları yap. Bu konu Python Koşul İfadeleri bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','kullanici = "arda"
sifre = "1234"
if kullanici == "arda" and sifre == "1234":
    print("Giriş başarılı")
else:
    print("Hatalı giriş")','Basit ATM menüsü için bakiye kontrolü yaz.','kosul-ifadeleri','Başlangıç',30,25,true),
('Python For Döngüsü','Belirli aralıkta ya da koleksiyon üzerinde tekrar yap.','## Dersin Amacı
Bu derste Python For Döngüsü konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Belirli aralıkta ya da koleksiyon üzerinde tekrar yap. Bu konu Python Döngüler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','for sayi in range(1, 6):
    print(sayi)','1’den 100’e kadar olan sayıların toplamını hesapla.','donguler','Başlangıç',25,26,true),
('Python While Döngüsü','Koşul doğru olduğu sürece çalışan döngü yaz.','## Dersin Amacı
Bu derste Python While Döngüsü konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Koşul doğru olduğu sürece çalışan döngü yaz. Bu konu Python Döngüler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','sayi = 1
while sayi <= 5:
    print(sayi)
    sayi += 1','Şifre doğru girilene kadar tekrar soran program yaz.','donguler','Başlangıç',25,27,true),
('Python Döngü Operatörleri','break ve continue kullanarak döngüyü kontrol et.','## Dersin Amacı
Bu derste Python Döngü Operatörleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
break ve continue kullanarak döngüyü kontrol et. Bu konu Python Döngüler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','for i in range(1, 8):
    if i == 3:
        continue
    if i == 6:
        break
    print(i)','1-20 arasında 13 gelince duran döngü yaz.','donguler','Başlangıç',22,28,true),
('Python Döngü Uygulamaları','Döngülerle mini uygulamalar geliştir.','## Dersin Amacı
Bu derste Python Döngü Uygulamaları konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Döngülerle mini uygulamalar geliştir. Bu konu Python Döngüler bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','for satir in range(1, 6):
    print("*" * satir)','Çarpım tablosu yazdıran program yap.','donguler','Başlangıç',30,29,true),
('Python Fonksiyonlar','Tekrar kullanılabilir kod blokları oluştur.','## Dersin Amacı
Bu derste Python Fonksiyonlar konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tekrar kullanılabilir kod blokları oluştur. Bu konu Python Fonksiyonlar bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','def selamla():
    print("Merhaba")

selamla()','Kullanıcıya hoş geldin mesajı veren fonksiyon yaz.','fonksiyonlar','Başlangıç',25,30,true),
('Python Fonksiyon Parametreleri','Fonksiyona dışarıdan değer göndermeyi öğren.','## Dersin Amacı
Bu derste Python Fonksiyon Parametreleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Fonksiyona dışarıdan değer göndermeyi öğren. Bu konu Python Fonksiyonlar bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','def topla(a, b):
    return a + b

print(topla(5, 3))','Üç sayının ortalamasını döndüren fonksiyon yaz.','fonksiyonlar','Başlangıç',25,31,true),
('Python Lambda Fonksiyonu','Tek satırlık küçük fonksiyonlar yaz.','## Dersin Amacı
Bu derste Python Lambda Fonksiyonu konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tek satırlık küçük fonksiyonlar yaz. Bu konu Python Fonksiyonlar bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','kare = lambda x: x * x
print(kare(6))','Bir sayıyı ikiyle çarpan lambda fonksiyonu yaz.','fonksiyonlar','Başlangıç',20,32,true),
('Fonksiyonların Kapsamı (Function Scope)','Yerel ve global değişken farkını öğren.','## Dersin Amacı
Bu derste Fonksiyonların Kapsamı (Function Scope) konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Yerel ve global değişken farkını öğren. Bu konu Python Fonksiyonlar bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','x = 10

def yazdir():
    x = 5
    print("Fonksiyon içi:", x)

yazdir()
print("Dışarısı:", x)','Aynı isimli iç ve dış değişken kullanarak sonucu gözlemle.','fonksiyonlar','Başlangıç',25,33,true),
('Python Fonksiyon Uygulaması','Fonksiyonlarla küçük bir proje geliştir.','## Dersin Amacı
Bu derste Python Fonksiyon Uygulaması konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Fonksiyonlarla küçük bir proje geliştir. Bu konu Python Fonksiyonlar bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','def not_hesapla(vize, final):
    return vize * 0.4 + final * 0.6

print(not_hesapla(70, 90))','Fonksiyonlarla basit hesap makinesi yap.','fonksiyonlar','Başlangıç',35,34,true),
('OOP Nedir?','Nesne tabanlı programlamanın temel fikrini öğren.','## Dersin Amacı
Bu derste OOP Nedir? konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Nesne tabanlı programlamanın temel fikrini öğren. Bu konu Python Nesne Tabanlı Programlama bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Ogrenci:
    pass

arda = Ogrenci()
print(arda)','Günlük hayattan 3 nesne ve özelliklerini yaz.','oop','Orta',25,35,true),
('Class','Sınıf tanımlamayı ve nesne üretmeyi öğren.','## Dersin Amacı
Bu derste Class konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Sınıf tanımlamayı ve nesne üretmeyi öğren. Bu konu Python Nesne Tabanlı Programlama bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Araba:
    def __init__(self, marka, model):
        self.marka = marka
        self.model = model

araba = Araba("Toyota", "Corolla")
print(araba.marka)','Kendi Telefon class yapını oluştur.','oop','Orta',30,36,true),
('Method','Sınıf içine fonksiyon yazarak davranış tanımla.','## Dersin Amacı
Bu derste Method konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Sınıf içine fonksiyon yazarak davranış tanımla. Bu konu Python Nesne Tabanlı Programlama bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Ogrenci:
    def __init__(self, ad):
        self.ad = ad

    def selamla(self):
        print("Merhaba", self.ad)

ogr = Ogrenci("Arda")
ogr.selamla()','Öğrenci class içine not_ekle metodu yaz.','oop','Orta',30,37,true),
('Kalıtım','Bir sınıftan başka sınıfa özellik miras almayı öğren.','## Dersin Amacı
Bu derste Kalıtım konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Bir sınıftan başka sınıfa özellik miras almayı öğren. Bu konu Python Nesne Tabanlı Programlama bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Canli:
    def nefes_al(self):
        print("Nefes alıyor")

class Insan(Canli):
    pass

arda = Insan()
arda.nefes_al()','Hayvan ve Kedi classlarıyla kalıtım örneği yap.','oop','Orta',30,38,true),
('Quiz Uygulaması','OOP bilgisiyle mini quiz uygulaması tasarla.','## Dersin Amacı
Bu derste Quiz Uygulaması konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
OOP bilgisiyle mini quiz uygulaması tasarla. Bu konu Python Nesne Tabanlı Programlama bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Soru:
    def __init__(self, metin, cevap):
        self.metin = metin
        self.cevap = cevap

soru1 = Soru("Python dosya uzantısı nedir?", ".py")
print(soru1.metin)','Soru classı ile 3 soruluk mini quiz hazırla.','oop','Orta',40,39,true),
('Django Nedir?','Python ile web geliştirme frameworkü olan Django’yu tanı.','## Dersin Amacı
Bu derste Django Nedir? konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Python ile web geliştirme frameworkü olan Django’yu tanı. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','print("Django ile web sitesi yapılır")','Django ile yapılabilecek 3 web sitesi fikri yaz.','django','Orta',25,40,true),
('Django Nasıl Kurulur?','Django paketini pip ile kurma mantığını öğren.','## Dersin Amacı
Bu derste Django Nasıl Kurulur? konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Django paketini pip ile kurma mantığını öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','pip install django','Kurulumdan sonra django-admin --version komutunu not al.','django','Orta',25,41,true),
('Python Venv','Projeye özel sanal ortam oluşturmayı öğren.','## Dersin Amacı
Bu derste Python Venv konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Projeye özel sanal ortam oluşturmayı öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','python -m venv venv','Bir proje klasöründe venv oluşturma adımlarını yaz.','django','Orta',25,42,true),
('Django ile Proje Oluşturma','Yeni Django projesi başlatmayı öğren.','## Dersin Amacı
Bu derste Django ile Proje Oluşturma konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Yeni Django projesi başlatmayı öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','django-admin startproject mysite','mysite adında örnek proje oluşturma komutunu yaz.','django','Orta',30,43,true),
('Django Uygulaması Ekleme','Django app mantığını öğren.','## Dersin Amacı
Bu derste Django Uygulaması Ekleme konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Django app mantığını öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','python manage.py startapp blog','lessons adında bir app oluşturma komutunu yaz.','django','Orta',25,44,true),
('Django Urls & Views','URL ile view fonksiyonu bağlamayı öğren.','## Dersin Amacı
Bu derste Django Urls & Views konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
URL ile view fonksiyonu bağlamayı öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','def home(request):
    return render(request, "home.html")','/hakkimda adresi için view ve url taslağı yaz.','django','Orta',35,45,true),
('Django Templates','HTML şablonlarını dinamik kullanmayı öğren.','## Dersin Amacı
Bu derste Django Templates konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
HTML şablonlarını dinamik kullanmayı öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','<h1>Merhaba {{ isim }}</h1>','Template içinde öğrenci adını gösterecek örnek yaz.','django','Orta',30,46,true),
('Django Base Template-Layout','Ortak navbar/footer yapısını base template ile kur.','## Dersin Amacı
Bu derste Django Base Template-Layout konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Ortak navbar/footer yapısını base template ile kur. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','{% extends "base.html" %}
{% block content %}Merhaba{% endblock %}','base.html içinde content bloğu tasarla.','django','Orta',30,47,true),
('Django Static Files','CSS, JS ve görsel dosyalarını yönet.','## Dersin Amacı
Bu derste Django Static Files konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
CSS, JS ve görsel dosyalarını yönet. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','{% load static %}
<link rel="stylesheet" href="{% static "style.css" %}">','Bir style.css dosyasını template’e bağlama kodunu yaz.','django','Orta',30,48,true),
('Django Bootstrap','Bootstrap ile hızlı arayüz oluştur.','## Dersin Amacı
Bu derste Django Bootstrap konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Bootstrap ile hızlı arayüz oluştur. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','<button class="btn btn-primary">Kaydet</button>','Bootstrap kart yapısı ile ders kartı taslağı oluştur.','django','Orta',25,49,true),
('Partial View Templates','Tekrarlanan HTML parçalarını include ile kullan.','## Dersin Amacı
Bu derste Partial View Templates konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Tekrarlanan HTML parçalarını include ile kullan. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','{% include "partials/navbar.html" %}','Navbar bölümünü partial olarak ayırma örneği yaz.','django','Orta',25,50,true),
('Django Link Ekleme','Template içinde sayfalar arası bağlantı oluştur.','## Dersin Amacı
Bu derste Django Link Ekleme konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Template içinde sayfalar arası bağlantı oluştur. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','<a href="{% url "home" %}">Ana Sayfa</a>','Bir ders detay sayfasına link oluştur.','django','Orta',25,51,true),
('Django Dinamik Veriyle Çalışma','View’den template’e veri göndermeyi öğren.','## Dersin Amacı
Bu derste Django Dinamik Veriyle Çalışma konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
View’den template’e veri göndermeyi öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','return render(request, "liste.html", {"dersler": dersler})','Bir ürün listesini template’e gönderme örneği yaz.','django','Orta',35,52,true),
('Django Url Parametreleri','URL’den id gibi parametreler almayı öğren.','## Dersin Amacı
Bu derste Django Url Parametreleri konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
URL’den id gibi parametreler almayı öğren. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','path("ders/<int:id>/", views.detail, name="detail")','/ogrenci/5 adresi için path örneği yaz.','django','Orta',30,53,true),
('Django Models','Veritabanı tablolarını model classlarıyla tanımla.','## Dersin Amacı
Bu derste Django Models konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Veritabanı tablolarını model classlarıyla tanımla. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','class Ders(models.Model):
    baslik = models.CharField(max_length=100)
    aciklama = models.TextField()','Ders modeli için başlık ve açıklama alanları oluştur.','django','Orta',35,54,true),
('Django Migrations','Model değişikliklerini veritabanına uygula.','## Dersin Amacı
Bu derste Django Migrations konusunu adım adım öğreneceğiz. Amaç sadece tanım ezberlemek değil; konunun gerçek kod içinde nerede işimize yarayacağını görmek.

## Konu Anlatımı
Model değişikliklerini veritabanına uygula. Bu konu Django bölümünün önemli parçalarından biridir. Önce temel mantığı kavrayacağız, sonra küçük örneklerle kullanımı pekiştireceğiz.

Python öğrenirken en önemli nokta her konudan sonra hemen uygulama yapmaktır. Bu yüzden dersi okuduktan sonra örnek kodu çalıştır, çıktıyı incele ve kodun bir satırını değiştirerek sonucu tekrar dene.

## Dikkat Edilecek Noktalar
- Kodu ezberlemeye çalışma, satır satır ne yaptığını anlamaya çalış.
- Hata alınca önce hata mesajını oku, sonra hangi satırda olduğunu kontrol et.
- Örnek kodu aynen çalıştırdıktan sonra mutlaka kendine göre değiştir.

## Ders Sonu Kontrol
Bu dersi bitirdiğinde konunun ne işe yaradığını, hangi komutlarla kullanıldığını ve küçük bir örneğini kendi başına yazabiliyor olmalısın.','python manage.py makemigrations
python manage.py migrate','Yeni model ekledikten sonra çalışacak iki komutu yaz.','django','Orta',30,55,true);
