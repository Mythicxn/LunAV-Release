# LunAV Launcher

## Tiếng Việt

### Giới thiệu

Launcher kiểm tra bản LunAV trên GitHub, tải `LunAV.exe` vào thư mục dữ liệu riêng của launcher và cho phép người dùng mở ứng dụng. Đây là bản portable, không cài launcher vào Windows.

### Build và phát hành

1. Cài Node.js 22 rồi chạy `npm ci`.
2. Chạy `npm run build`; file `dist/LunAV-Launcher.exe` sẽ được tạo.
3. Tạo GitHub Release với tag version không có tiền tố `v` (ví dụ `1.0.2`). GitHub Actions sẽ build source của tag và tải `LunAV-Launcher.exe` lên release.
4. Chỉ phát hành file do workflow tạo. Workflow hiện chưa ký Authenticode; chỉ cấu hình ký nếu dịch vụ ký chấp nhận dự án.

### Cập nhật LunAV

- Launcher kiểm tra GitHub Releases của [`Mythicxn/LunAV`](https://github.com/Mythicxn/LunAV) (cấu hình trong `main.js`), chọn asset `LunAV.exe`, tải về và chạy app.
- Chỉ dùng stable release có tag `X.Y.Z` và đính kèm asset `LunAV.exe`.
- Khi gỡ LunAV, launcher xóa các bản app đã tải nhưng giữ dữ liệu/cài đặt riêng của app.

### Gỡ bỏ

- Trong launcher, mở menu ba gạch, chọn **Gỡ cài đặt LunAV** và xác nhận.
- Thao tác xóa các bản LunAV do launcher tải; dữ liệu/cài đặt riêng của app được giữ lại.
- Đóng LunAV trước khi gỡ. Vì launcher là bản portable, người dùng cần đóng launcher và tự xóa `LunAV-Launcher.exe` nếu không muốn giữ nó.

### Giấy phép

- Source launcher trong repo [`LunAV-Release`](https://github.com/Mythicxn/LunAV-Release) được cấp phép theo MIT License. Xem file `LICENSE`. MIT cho phép sử dụng, sửa đổi, phân phối và sử dụng thương mại, với điều kiện giữ thông báo bản quyền và license khi phân phối.
- MIT của launcher không cấp quyền đối với `LunAV.exe`, hình ảnh/model, icon hoặc tài sản bên thứ ba nếu các quyền đó không thuộc chủ repo launcher.
- Electron và các thành phần bên thứ ba giữ các license riêng của chúng.

### Chính sách ký mã

Chỉ áp dụng nếu dự án được SignPath Foundation chấp nhận và cấu hình dịch vụ ký:

> Free code signing provided by [SignPath.io](https://about.signpath.io), certificate by [SignPath Foundation](https://signpath.org).

- Committer/author: Mythicxn, chủ repo và người quản lý source/build.
- Reviewer: Mythicxn xem xét các pull request trước khi merge; các thay đổi tự đóng góp cần được xem xét theo quy trình mà SignPath chấp thuận.
- Approver: Mythicxn phê duyệt thủ công từng yêu cầu ký phát hành, nếu được SignPath chấp nhận.

Launcher có thể tự động kiểm tra GitHub, tải và chạy `LunAV.exe` từ repo `Mythicxn/LunAV`. App LunAV được phát hành riêng; chữ ký launcher không ký thay cho app. Việc chấp nhận chính sách và dự án thuộc SignPath.

### Quyền riêng tư

Launcher không chủ động gửi thông tin cá nhân. Khi khởi động, launcher truy cập GitHub API để kiểm tra release và có thể tải `LunAV.exe` từ GitHub khi cần cập nhật. Giao diện tải font Inter từ Google Fonts. Launcher lưu file app và thông tin phiên bản trong thư mục dữ liệu Electron trên máy người dùng.

Phần này chỉ mô tả launcher; chính sách riêng tư và cách xử lý dữ liệu của `LunAV.exe` cùng các dịch vụ mà app sử dụng cần được xem tại repo/trang LunAV.

### Nguồn và liên hệ

- Source/license launcher: [Mythicxn/LunAV-Release](https://github.com/Mythicxn/LunAV-Release)
- App và release app: [Mythicxn/LunAV](https://github.com/Mythicxn/LunAV)
- Website: [mythicxn.github.io/LunAV-webside](https://mythicxn.github.io/LunAV-webside/)

---

## English

### Overview

The launcher checks GitHub for LunAV releases, downloads `LunAV.exe` into its own data directory, and lets the user start the app. The launcher is portable and does not install itself into Windows.

### Build and release

1. Install Node.js 22 and run `npm ci`.
2. Run `npm run build` to create `dist/LunAV-Launcher.exe`.
3. Create a GitHub Release with a version tag without a `v` prefix (for example, `1.0.2`). GitHub Actions builds the source at the release tag and uploads `LunAV-Launcher.exe` to the release.
4. Distribute only the artifact produced by the workflow. The workflow does not currently apply an Authenticode signature; signing should be configured only if a signing provider accepts the project.

### LunAV updates

- The launcher checks GitHub Releases for [`Mythicxn/LunAV`](https://github.com/Mythicxn/LunAV), as configured in `main.js`, selects the `LunAV.exe` asset, downloads it, and starts the app.
- Publish stable releases using `X.Y.Z` tags and attach the `LunAV.exe` asset.
- Uninstalling LunAV removes app versions downloaded by the launcher while preserving LunAV's separate user data and settings.

### Uninstall

- In the launcher, open the hamburger menu, select **Uninstall LunAV**, and confirm.
- This removes LunAV versions downloaded by the launcher; the app's separate user data and settings are kept.
- Close LunAV before uninstalling. Since the launcher is portable, close it and manually delete `LunAV-Launcher.exe` if you no longer want to keep it.

### License

- The launcher source in [`LunAV-Release`](https://github.com/Mythicxn/LunAV-Release) is licensed under the MIT License. See `LICENSE`. MIT permits use, modification, distribution, and commercial use, provided the copyright notice and license are included with distributed copies or substantial portions.
- The launcher's MIT License does not grant rights to `LunAV.exe`, images/models, icons, or third-party assets unless those rights belong to the launcher repository owner.
- Electron and third-party components remain under their respective licenses.

### Code signing policy

Applicable only if the project is accepted by SignPath Foundation and code signing is configured:

> Free code signing provided by [SignPath.io](https://about.signpath.io), certificate by [SignPath Foundation](https://signpath.org).

- Committer/author: Mythicxn, repository owner and source/build maintainer.
- Reviewer: Mythicxn reviews pull requests before merging; self-authored changes must follow a review process accepted by SignPath.
- Approver: Mythicxn manually approves each release-signing request, if accepted by SignPath.

The launcher may automatically check GitHub, download, and run `LunAV.exe` from the separate `Mythicxn/LunAV` repository. LunAV is released separately; the launcher signature does not sign the app. SignPath decides whether to accept the project and this policy.

### Privacy

The launcher does not intentionally send personal information. On startup, it contacts the GitHub API to check for releases and may download `LunAV.exe` from GitHub when an update is needed. The interface loads the Inter font from Google Fonts. The launcher stores the app files and version state in Electron's user data directory on the user's device.

This section describes the launcher only. See the LunAV repository/site for privacy information and data handling related to `LunAV.exe` and services used by the app.

### Source and contact

- Launcher source/license: [Mythicxn/LunAV-Release](https://github.com/Mythicxn/LunAV-Release)
- App and app releases: [Mythicxn/LunAV](https://github.com/Mythicxn/LunAV)
- Website: [mythicxn.github.io/LunAV-webside](https://mythicxn.github.io/LunAV-webside/)
