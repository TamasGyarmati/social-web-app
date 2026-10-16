# Social

A full-stack social media platform: a **RESTful ASP.NET Core API** paired with a complete **Angular single-page application** frontend.

![Social](docs/social-readme.png)

## ✨ Features

- **Authentication & Security** — JWT authentication with refresh tokens, email confirmation, route guards, and account management.
- **Social Feed** — Create, edit, delete, and like posts with image uploads, newest-first sorting, and personalized filters.
- **Threaded Comments** — Nested replies with unlimited depth, lazy loading, caching, and comment likes.
- **User Profiles & Social Connections** — Custom avatars, profile management, user discovery, follow/unfollow, and follower/following lists.
- **Account Management** — Update personal details, change email or password, and delete accounts.
- **Media & Email** — Image validation and processing with ImageSharp, plus email confirmations via MailKit.
- **Responsive UI** — Mobile-friendly navigation, Angular Material dialogs and snackbars, and a custom 404 page.
- **REST API** — ASP.NET Core API with authentication, user, post, and comment endpoints, role-based administration, and CORS configuration.

## 🛠️ Tech Stack

### Backend

- **.NET 10** / **C#**
- **ASP.NET Core** — Web framework
- **ASP.NET Core Identity** — Users, roles, password hashing, email confirmation tokens
- **JWT Bearer Authentication** — Access + refresh tokens
- **Entity Framework Core 10** — ORM (`Microsoft.EntityFrameworkCore.SqlServer`)
- **MSSQL Server** — Database
- **MailKit** — SMTP email sending
- **SixLabors.ImageSharp** — Image validation, resizing and WebP conversion
- **Custom file logging** — `FileLogger` service + `RequestLoggingMiddleware` writing to `Backend/SocialMedia.App/Logs/`

### Frontend

- **Angular 21** — Standalone components, signals-based state, `inject()`-based DI
- **TypeScript 5.9**
- **Angular Material 21 + CDK** — UI components, theming, dialogs, snackbars
- **SCSS** — Component-scoped styling with shared variables and auth layout partials
- **Angular Router** — Client-side routing with `canActivate` route guards
- **RxJS 7.8** — Observables for HTTP and state

## 📁 Project Structure

```
social-web-app/
├── Backend/
│   ├── SocialMedia.App/        # API host: controllers, DI wiring, middleware, config
│   ├── SocialMedia.Data/       # EF Core DbContext, migrations, repositories
│   ├── SocialMedia.Domain/     # Entities, enums, DTOs
│   ├── SocialMedia.Logic/      # Business logic, services, result types
│   └── SocialMedia.sln
└── Frontend/
    └── Social/                 # Angular SPA
        ├── public/             # Static assets served by Angular
        └── src/
            ├── app/
            │   ├── _env/       # API endpoint + token key configuration
            │   ├── _models/    # TypeScript interfaces mirroring API DTOs
            │   ├── _services/  # HTTP services (auth, login, register, post CRUD)
            │   ├── _shared/    # Material imports + SCSS variables/partials
            │   └── <feature>/  # One folder per feature component (.ts/.html/.scss)
            └── styles.scss
```

### Backend layering

```
Controllers → Services (Logic) → Repositories → Database
```

Business logic lives in `SocialMedia.Logic` and communicates through explicit result objects (`ReturnResults/*`) rather than exceptions for expected outcomes. Each feature folder in the frontend follows the same convention: `.ts` logic, `.html` template, `.scss` styles, `.spec.ts` test.

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| .NET SDK | **10.0** (e.g. `10.0.302`) | Required by all backend projects (`net10.0`) |
| Node.js | **`^20.19.0 \|\| ^22.12.0 \|\| >=24.0.0`** | Enforced by Angular 21 (developed against `v24.12.0`) |
| npm | **11.6.2** | Pinned via `"packageManager"` in `Frontend/Social/package.json` |
| Angular CLI | **21.2.24** | Installed locally as `@angular/cli` — no global install needed |
| SQL Server | **2019+ / Express / Developer / container** | Any instance reachable via the connection string |
| EF Core CLI | **10.x** | Only needed for migrations — see below |

Verify your toolchain:

```bash
dotnet --version    # expect 10.x
node --version      # expect v20.19+ / v22.12+ / v24+
npm --version       # expect 11.6.2
```

Install the Entity Framework CLI once (only required for creating/applying migrations):

```bash
dotnet tool install --global dotnet-ef
```

### 1. Clone the repository

```bash
git clone https://github.com/TamasGyarmati/social-web-app.git
cd social-web-app
```

### 2. Start the backend API

**Configure secrets.** The API reads configuration from environment variables (loaded from a `.env` file located at `Backend/SocialMedia.App/.env`):

```bash
# Backend/SocialMedia.App/.env
ConnectionStrings__SocialMediaDb=Server=localhost;Database=SocialMediaDb;Trusted_Connection=True;TrustServerCertificate=True
Jwt__Key=<a-long-random-secret>
```

SMTP credentials for outgoing mail go in `Backend/SocialMedia.App/appsettings.Development.json`:

```json
{
  "Smtp": {
    "Host": "localhost",
    "Port": 1025,
    "Name": "Your Name",
    "Address": "you@example.com"
  }
}
```

A local SMTP catcher such as [MailPit](https://github.com/axllent/mailpit) on port `1025` works well for development.

**Restore, migrate and run:**

```bash
cd Backend
dotnet restore

# Apply EF Core migrations (creates + updates the SQL Server database).
# Run from the web project so EF Tools can resolve the startup project.
cd SocialMedia.App
dotnet ef database update
dotnet run
```

Or equivalently, from the `Backend` folder in one line:

```bash
dotnet run --project SocialMedia.App
```

The API listens on **`http://localhost:5000`**. Swagger UI is available at **<http://localhost:5000/swagger>** in the `Development` environment.

> The CORS policy `Angular` in `Program.cs` already allows `http://localhost:4200`, which is where the frontend runs by default.

### 3. Start the Angular frontend

```bash
cd Frontend/Social
npm install
npm start
```

Open **<http://localhost:4200>**. The dev server hot-reloads on file changes.

The API base URL is in `src/app/_env/env.ts`. If your backend does not run on `http://localhost:5000`, update the variables `host` and `port` there:

```ts
const host = 'localhost';
const port = 5000;

const apiUri = `http://${host}:${port}`;

export const env = {
  host,
  port,
  apiUri,

  authLoginUri: `${apiUri}/api/Auth/login`,
  authRegisterUri: `${apiUri}/api/Auth/register`,
```

> There is no `environment.ts` / file-replacement setup yet, so this file is edited directly for now.

### Full startup from a clean clone

```bash
# Terminal 1 — API
cd Backend && dotnet restore && dotnet run --project SocialMedia.App

# Terminal 2 — SPA
cd Frontend/Social && npm install && npm start
```

## 🔌 API Reference

Swagger UI at <http://localhost:5000/swagger> is the authoritative, always-up-to-date reference. Route groups:

| Group | Base route | Endpoints |
| --- | --- | --- |
| Auth | `/api/Auth` | `register`, `login`, `refresh`, `confirm-email` |
| Posts | `/api/Post` | `all`, `{id}`, `POST`, `PUT {id}`, `DELETE {id}`, `{id}/like` |
| Comments | `/api/Comment` | `all/{postId}`, `{id}`, `POST`, `PUT {id}`, `DELETE {id}`, `{id}/like` |
| Users | `/User` | `all`, `{id}`, `whoami`, `avatar`, `PUT all/password/email`, `confirm-email-change`, `follow/{id}`, `DELETE me`, `logout`, `add-to-admin/{userId}` |

Authenticated endpoints expect an `Authorization: Bearer <token>` header.

## 📊 Architecture Notes

- **Image pipeline** — Uploads are checked against an extension allowlist (`.jpg`, `.jpeg`, `.png`, `.webp`), decoded with ImageSharp (which rejects non-image payloads), resized (avatars cropped to 256×256, post images capped at 1200px preserving aspect ratio) and re-encoded to WebP under `wwwroot/images/{avatars,posts}/` with a GUID filename. Static files are served directly by the backend.
- **Soft deletes** — Users and posts carry deleted flags/timestamps rather than being removed, and deleted accounts fall back to a placeholder avatar.
- **Result pattern** — Logic methods return typed result objects (`LoginResult`, `PostResult`, `SoftDeleteUserResult`, …) that controllers translate into HTTP responses.
- **ImageSharp runs synchronously** in the request path — no background job queue is wired up yet.

---

**Status:** Working full-stack MVP — Angular SPA + ASP.NET Core API | **Stack:** .NET 10 · Angular 21 · SQL Server
