# Ignite Call

![App Screen](screenshots/01.png)

## Getting starter

**1. Setup environment variables**:

Check the Google Calendar API for more information: https://developers.google.com/calendar/api/quickstart/js
```env
   DATABASE_URL="mysql://root:docker@localhost:3306/ignitecall"

   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
```

**2. Install dependencies**

```bash
   npm i
```

3. **Start Docker services:**

```bash
   docker-compose up
```

4. **Run Prisma migrations:**

```bash
   npx prisma migrate dev
```

5. **Start the development server:**

```bash
   npm run start:dev
```

## Screenshots

![App Screen](screenshots/02.png)
![App Screen](screenshots/03.png)
![App Screen](screenshots/04.png)
![App Screen](screenshots/05.png)
![App Screen](screenshots/06.png)
![App Screen](screenshots/07.png)
![App Screen](screenshots/08.png)

Google calendar
![App Screen](screenshots/09.png)

![App Screen](screenshots/10.png)
