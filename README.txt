LunAV Launcher

Gioi thieu
Launcher kiem tra ban LunAV tren GitHub, tai LunAV.exe vao thu muc du lieu rieng
cua launcher va cho phep nguoi dung mo app. Launcher la ban portable, khong cai
dat vao Windows.

Build va phat hanh
1. Cai Node.js 22 va chay `npm ci`.
2. Chay `npm run build`; file `dist/LunAV-Launcher.exe` duoc tao.
3. Tao GitHub Release voi tag bat dau bang `v` (vi du `v1.0.2`). GitHub Actions
   se build tu source cua tag va tai `LunAV-Launcher.exe` len release.
4. Chi phat hanh file build do workflow tao. Workflow khong ky so Authenticode;
   viec ky chi bat dau sau khi SignPath chap nhan va duoc cau hinh.

Cap nhat LunAV
- Launcher kiem tra GitHub Releases cua `Mythicxn/LunAV` (khai bao trong
  `main.js`), chon asset LunAV.exe, tai va chay app.
- Chi phat hanh stable release tag `vX.Y.Z` kem asset LunAV.exe.
- Launcher giu du lieu LunAV rieng khi go bo cac ban app da tai.

Go bo
- Trong launcher, mo menu ba gach, chon "Go cai dat LunAV" va xac nhan.
- Thao tac xoa cac ban LunAV do launcher tai va giu du lieu/cai dat rieng cua app.
- Dong LunAV truoc khi go. Vi launcher la ban portable, nguoi dung tu dong
  launcher va xoa file LunAV-Launcher.exe neu khong muon giu no.

Giay phep
- Source launcher trong repo LunAV-Release duoc cap phep theo MIT License.
  Xem file LICENSE; license cho phep su dung, sua doi, phan phoi va su dung
  thuong mai, voi dieu kien giu thong bao ban quyen va license khi phan phoi.
- MIT cua launcher khong cap quyen doi voi LunAV.exe, hinh anh/model, icon hoac
  tai san ben thu ba neu cac quyen do khong thuoc chu repo launcher.
- Electron va cac thanh phan ben thu ba giu cac license rieng cua chung.

Code signing policy
Chinh sach du kien neu du an duoc SignPath Foundation chap nhan:
"Free code signing provided by SignPath.io, certificate by SignPath Foundation".

Authors/committers: Mythicxn (chu repo, quan ly source va quy trinh build).
Reviewers: Mythicxn (xem xet pull request cua nguoi dong gop truoc khi merge).
Approver: Mythicxn (phe duyet thu cong tung yeu cau ky phat hanh).

Chinh sach nay chi ap dung sau khi SignPath chap nhan du an va bat dau ky.
Launcher co the tu dong kiem tra GitHub, tai va chay LunAV.exe tu repo
Mythicxn/LunAV. App LunAV duoc phat hanh rieng; launcher khong ky thay cho app.

Quyen rieng tu
Launcher khong chu dong gui thong tin ca nhan. Khi khoi dong, launcher truy cap
GitHub API de kiem tra release va co the tai LunAV.exe tu GitHub khi can cap
nhat; giao dien tai font Inter tu Google Fonts. Launcher luu file app va thong
tin phien ban trong thu muc du lieu Electron tren may nguoi dung.

Chinh sach nay chi mo ta launcher; chinh sach rieng tu va cach xu ly du lieu cua
LunAV.exe va cac dich vu ma app su dung can duoc xem tai repo/trang cua LunAV.

Nguon va lien he
- Source/license launcher: https://github.com/Mythicxn/LunAV-Release
- App va release app: https://github.com/Mythicxn/LunAV
- Website: https://mythicxn.github.io/LunAV-webside/
