# Oauth2-Example

โปรเจกต์นี้เป็นตัวอย่างการใช้งาน OAuth 2.0 เพื่อเชื่อมต่อกับผู้ให้บริการ (Providers) ต่างๆ เช่น Discord และ Google

## เกี่ยวกับโปรเจกต์

โปรเจกต์นี้สร้างขึ้นเพื่อเป็นตัวอย่างพื้นฐานในการทำความเข้าใจและประยุกต์ใช้ OAuth 2.0 Authorization Code Grant flow กับ Service Providers ยอดนิยมอย่าง Discord และ Google ในการยืนยันตัวตนและขอสิทธิ์เข้าถึงข้อมูลผู้ใช้

## คุณสมบัติ

-   ตัวอย่างการเชื่อมต่อ OAuth 2.0 กับ Discord
-   ตัวอย่างการเชื่อมต่อ OAuth 2.0 กับ Google
-   แสดงขั้นตอนการขอ Authorization Code, Access Token และการเรียก API พื้นฐาน

## ข้อกำหนดเบื้องต้น

ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้งซอฟต์แวร์ต่อไปนี้แล้ว:

-   Node.js (แนะนำเวอร์ชัน LTS ล่าสุด)
-   และติดตั้ง bun โดยใช้คำสั่ง
    ```bash
    npm install -g bun
    ```

## การติดตั้ง

1.  Clone repository:
    ```bash
    git clone https://github.com/NekoSakuraLucia/Oauth2-Example.git
    cd Oauth2-Example
    ```
2.  ติดตั้ง dependencies:
    ```bash
    bun install
    ```

## การตั้งค่า

โปรเจกต์นี้ต้องการการตั้งค่า Client ID และ Client Secret จากแต่ละ OAuth Provider

1.  คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
    ```bash
    cp .env.example .env
    ```
2.  แก้ไขค่าตัวแปรต่างๆ ในไฟล์ `.env` ให้ถูกต้องตามที่คุณได้มาจาก Developer Portal ของแต่ละ Provider:

    ```env
    # SERVER
    SERVER_PORT='3000' # สามารถเปลี่ยน Port ได้ตามต้องการ

    # Discord Provider
    DISCORD_CLIENT_ID='your_discord_client_id'
    DISCORD_CLIENT_SECRET='your_discord_client_secret'
    DISCORD_REDIRECT_URI='http://localhost:3000/discord/auth/callback' # ตรวจสอบให้ตรงกับที่ตั้งค่าใน Discord Developer Portal

    # Google Provider
    GOOGLE_CLIENT_ID='your_google_client_id'
    GOOGLE_CLIENT_SECRET='your_google_client_secret'
    GOOGLE_REDIRECT_URI='http://localhost:3000/google/auth/callback' # ตรวจสอบให้ตรงกับที่ตั้งค่าใน Google Cloud Console
    ```

    **สำคัญ:** `REDIRECT_URI` ในไฟล์ `.env` จะต้องตรงกับที่คุณตั้งค่าไว้ในหน้า Dashboard ของแต่ละ OAuth Provider (Discord Developer Portal, Google Cloud Console)

## การใช้งาน

1.  รันเซิร์ฟเวอร์:
    ```bash
    bun run dev
    ```
2.  เปิดเว็บเบราว์เซอร์แล้วไปที่ `http://localhost:3000` (หรือ Port ที่คุณตั้งค่าไว้)
3.  ทดลองเข้าสู่ระบบโดยการไป `http://localhost:3000/discord/auth` หรือ `http://localhost:3000/google/auth` เพื่อเริ่มกระบวนการ OAuth 2.0

## ใบอนุญาต

โปรเจกต์นี้อยู่ภายใต้ใบอนุญาต [MIT License]
