# ChatWall 雀窩- Frontend<br>


### 專案描述
ChatWall是一個社交媒體平台，提供用戶一般註冊/一般登入/google第三方登入，發佈動態、圖片、留言評論、貼文點讚、追蹤用戶以及線上聊天即時等功能

---

本頁為前端repository，提供測試帳號供用戶使用<br>

|暱稱 | E-mail                | Password   |
|----|-----------------------|------------|
| 我是測試員 | 123456789a@gmail.com   | 123456789a |

前往[ChatWall!](<https://chat-wall-frontend-v2.vercel.app/#/>) ⬅⬅⬅⬅⬅

--- 
ChatWall為前後端分離開發<br>
- 前端<br>
基於Vue3、Vite的架構開發，UI framework使用Bootstrap，符合RWD，並使用MVVM設計模式，使用Pinia管理用戶狀態，導入第三方google登入註冊，實現socket-io即時聊天功能，並部屬至Vercel<br><br>
- 後端<br>
基於Node.js的Express架構開發，使用MVC設計模式，在Restful規範下實現CRUD，ODM使用mongoose操控MongoDB Atlas，儲存用戶上傳圖檔至Firebase Storage，並擁有全域錯誤管理handleErrorAsync，最後使用Docker打包部屬至Render<br>
[後端repository](<https://github.com/GustavoFringgg/ChatWall-Frontend_v2>) ⬅<br>



---

### 前後端流程MVVM/MVC 服務架構圖
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2FMVC_final.drawio.png?alt=media&token=31d5f531-6c72-4293-b341-253717522d11" width="700">

---
### Features
- ✅ 用戶註冊與登入與登出(JWT 權限驗證、Google第三方登入)
- ✅ 修改用戶暱稱大頭貼密碼功能
- ✅ 發佈貼文
- ✅ 留言功能
- ✅ 貼文篩選(最新貼文/最舊貼文/熱門貼文/關鍵字搜尋貼文)
- ✅ 刪除貼文
- ✅ 點讚功能
- ✅ 追蹤用戶
- ✅ 顯示用戶貼文列表
- ✅ 顯示個人貼文列表
- ✅ 顯示按讚列表
- ✅ 顯示已追蹤用戶功能
- ✅ 圖片上傳，用於更換用戶大頭貼/貼文夾帶圖片(Firebase第三方API串接)
- ✅ 聊天室功能(socket.IO)
---

# Screenshots
<div style="display: flex;">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0627.jpg?alt=media&token=2546ae8c-07e0-4637-8657-66344b26b3dd" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0645.jpg?alt=media&token=15e9ffe6-2969-4019-a4cc-34932ef385dc" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0628.jpg?alt=media&token=32bcde94-43ad-4927-b0b5-f7bbe6cc1b59" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0647.jpg?alt=media&token=bde2f297-107a-40da-b561-f40fd75bed62" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0633.jpg?alt=media&token=49f3c4df-4630-4300-ab0b-5c870d3c19eb" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0642.jpg?alt=media&token=64095a18-9333-4487-8951-cb4739c00cd1" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0636.jpg?alt=media&token=2e1045f2-8430-458c-ae1e-d2d40de6cd38" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0637.jpg?alt=media&token=b781a3ea-e623-4432-9698-4aa52c00a7f6" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0638.jpg?alt=media&token=dd9f2aa5-b223-4c81-8150-f465561634b2" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0640.jpg?alt=media&token=ab6bb41c-d3e6-4cd6-b915-0ae5529713d5" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0649-a.jpg?alt=media&token=3667b814-1340-4f5a-9986-d2ee5fba14cd" width="500" height="250">
  <img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0649b.jpg?alt=media&token=3f07b8ed-2949-4a9e-926e-105db0799d45" width="500" height="250">
</div>

---

## Installation

#### 1. Clone the repository && Move to the ChatWall-Backend directory
```
git clone https://github.com/GustavoFringgg/ChatWall-Frontend_v2.git
cd ChatWall-Frontend_v2
```
#### 2. Install the dependencies
```
npm install
```
#### 3. Launch the application
```
//開發者模式
npm run start:dev
```
---

# Technologies & Libraries
### Core Framework & Plugins :
- vue@3.5.13
- vue-router@4.5.0
- pinia@2.3.0

### Build & Development Tools 
- vite@5.4.14
- gh-pages@6.2.0

### UI & Styling 
- bootstrap@5.3.3
- sass@1.82.0
- sweetalert2@11.14.5

### Utilities 
- axios@1.7.9
- dayjs@1.11.13

### Real-time Connection:
- socket.io@4.8.1

---

開發者
秉宏

聯絡我: [Email](mailto:adamtsai0408@gmail.com)<br>
LINE: ethern520

