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
基於Vue3、Vite的架構開發，UI framework使用Bootstrap，使用MVVM設計模式，導入第三方google登入註冊，實現socket-io即時聊天功能，並部屬至Vercel
- 後端<br>
基於Node.js的Express架構開發，使用MVC設計模式，在Restful規範下實現CRUD，ODM使用mongoose操控MongoDB Atlas，儲存用戶上傳圖檔至Firebase Storage，並擁有全域錯誤管理handleErrorAsync，最後使用Docker打包部屬至Render<br>
- [後端repository](<https://github.com/GustavoFringgg/ChatWall-Frontend_v2>) ⬅


---

### 前後端流程MVVM/MVC 服務架構圖
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2FMVC_final.drawio.png?alt=media&token=31d5f531-6c72-4293-b341-253717522d11" width="700">

---
### Features
- ✅ 用戶註冊與登入與登出(JWT 權限驗證、Google第三方登入)
- ✅ 修改用戶暱稱大頭貼密碼功能
- ✅ 發佈貼文
- ✅ 留言功能
- ✅ 貼文篩選(最新貼文/最舊貼文/熱門貼文/搜索貼文)
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


## Installation

#### 1. Clone the repository && Move to the ChatWall-Backend directory
```
git clone https://github.com/GustavoFringgg/ChatWall-Backend.git
cd ChatWall-Backend
```
#### 2. Install the dependencies
```
npm install
```
#### 3. Launch the application
```
//開發者模式
npm run start:dev

//正式環境模式
npm run start:production
```
---
# Screenshots
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0618.jpg?alt=media&token=483269aa-004e-4cea-9638-12c27ca2143d" width="500" style="display: inline-block;"/>
<img src="https://firebasestorage.googleapis.com/v0/b/theodore-s-blog.appspot.com/o/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E5%A4%BE%2Fgithub%20readme%2FchatWall%2F0618.jpg?alt=media&token=483269aa-004e-4cea-9638-12c27ca2143d" width="500" style="display: inline-block;"/>


---

# Technologies & Libraries
### Backend:
- Node.js v20.11.1

### Backend Framework:
- express@4.16.4
- express-rate-limit@7.4.0

### Database:
- firebase-admin@12.1.1
- mongoose@8.9.4

### Connection:
- axios@1.7.2

### Authentication:
- jsonwebtoken@9.0.2
- validator@13.12.0

### Encryption:
- bcryptjs@2.4.3
- uuid@10.0.0

### Image Handling:
- image-size@1.1.1
- multer@1.4.5-lts.1

### Documentation:
- dotenv@16.4.5
- swagger-autogen@2.23.7
- swagger-ui-express@5.0.1

### Logging:
- morgan@1.9.1

### Passport Login:
- passport-google-oauth20@2.0.0
- passport@0.7.0

### Real-time Connection:
- socket.io@4.8.1

---

開發者
秉宏

聯絡我: [Email](mailto:adamtsai0408@gmail.com)<br>
LINE: ethern520

