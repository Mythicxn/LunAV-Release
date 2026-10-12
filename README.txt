LunAV Launcher

Phat hanh
1. Chay `npm install` trong thu muc nay.
2. Chay `npm run build`; file portable duoc tao trong `dist`.
3. Tao GitHub Release trong repo chua launcher, dung tag `vX.Y.Z`, roi tai len
   file `LunAV-Launcher.exe`.
4. Dat nut tai tren website/repo khac toi URL:
   `https://github.com/<owner>/<launcher-repo>/releases/latest/download/LunAV-Launcher.exe`.

Cap nhat LunAV
- Launcher dang kiem tra GitHub Releases cua `Mythicxn/LunAV` (khai bao trong
  `main.js`). Neu file LunAV.exe nam o repo khac, sua OWNER va REPO tai day.
- Tao release stable voi tag `vX.Y.Z` va dinh kem file `.exe` cua LunAV. Khong
  dung draft/prerelease; launcher tai asset `.exe` dau tien hoac `LunAV.exe`.
- Launcher so sanh tag theo semver X.Y.Z, tai ban moi vao thu muc rieng va giu
  lai ban da cai neu cap nhat that bai.

Luu y
- Nut tai ban moi nhat chi tai launcher moi cho nguoi dung; launcher hien tai
  chua tu cap nhat chinh no.
- File `icon.ico` duoc dung cho icon cua cua so, giao dien va goi build Windows.

Go LunAV
- Mo menu ba gach trong launcher, chon "Go cai dat LunAV" va xac nhan.
- Thao tac chi xoa cac ban LunAV do launcher tai trong thu muc du lieu cua
  launcher; khong xoa du lieu/cai dat rieng cua LunAV.
- Dong LunAV truoc khi go. Launcher la ban portable, khong co muc uninstall
  trong Windows; neu khong muon giu launcher, dong no va tu xoa file .exe.

Giay phep
- Repo launcher su dung MIT License; xem file LICENSE trong repo de doc toan van.
- MIT cho phep su dung, sua doi, phan phoi va su dung thuong mai. Khi phan phoi
  ma nguon hoac phan dang ke, can giu thong bao ban quyen va toan van license.
- License launcher khong tu dong ap dung cho app LunAV hoac tai san ben thu ba.
