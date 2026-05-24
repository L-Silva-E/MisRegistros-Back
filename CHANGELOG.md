# Changelog

All notable changes to the `MisRegistros-Back` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.12.3] - 2026-05-24

### Fixed

- **Seed fails with `spawn ts-node ENOENT` under pnpm**: `ts-node` was only a transitive dependency of `ts-node-dev`. pnpm does not hoist transitive dependencies, so the `ts-node` binary was not available in PATH when Prisma ran the seed command. Fixed by adding `ts-node` as a direct `devDependency`

### Changed

- **Seed images migrated from imgur to Cloudinary**: all recipe thumbnail URLs and the admin user avatar now point to Cloudinary (`res.cloudinary.com/dp5rqmzzw`) to keep seed data consistent with the rest of the image storage strategy

---

## [1.12.2] - 2026-05-24

### Fixed

- **Docker build failure with pnpm v11**: `corepack prepare pnpm@latest` instalaba pnpm v11 en la imagen, que ya no lee el campo `"pnpm"` de `package.json`. Se resolvió fijando la versión a `pnpm@10.11.0` en ambos Dockerfiles (`corepack prepare pnpm@10.11.0 --activate`) para que coincida con la versión local del proyecto
- **Prisma no encontraba el engine en Alpine (OpenSSL)**: En Node 22-alpine (Alpine 3.19+), Prisma no detectaba la versión de OpenSSL al no tener las librerías instaladas, usaba por defecto el engine compilado para OpenSSL 1.1.x, que no existe en Alpine moderno. Se resolvieron dos problemas por separado:
  - Se agregó `RUN apk add --no-cache openssl` en ambos Dockerfiles para que Prisma pueda detectar OpenSSL 3.x en tiempo de ejecución
  - Se agregó `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` al bloque `generator client` de `schema.prisma` para que `prisma generate` incluya el engine correcto para Alpine con OpenSSL 3.x

## [1.12.1] - 2026-05-23

### Changed

- **Package manager migrated from npm to pnpm**: replaced `package-lock.json` with `pnpm-lock.yaml` as the project's official lock file
  - Added `"pnpm": { "onlyBuiltDependencies" }` section to `package.json` to approve build scripts for `@prisma/client`, `@prisma/engines` and `prisma` — required by pnpm v10's default security model that blocks all dependency scripts
  - Updated `Dockerfile` and `Dockerfile.dev` to install pnpm via `npm install -g pnpm`, copy the new lock file and run `pnpm install --frozen-lockfile`
  - All `package.json` scripts remain unchanged and are compatible with `pnpm run`

## [1.12.0] - 2026-05-23

### Added

- **User avatar management**: Implemented profile picture upload and deletion for authenticated users:
  - New field `avatar String?` on `User` model — migration `add_avatar_to_user`
  - New `PATCH /v1/user/me/avatar` — accepts `multipart/form-data` with the file in the `avatar` field. Uploads to Cloudinary under `mis-registros/profile-pictures/`, converts to WebP. If the user already has an avatar, the previous image is deleted from Cloudinary automatically. Returns the updated `UserPublicModel`
  - New `DELETE /v1/user/me/avatar` — removes the avatar from Cloudinary and sets `avatar: null` in DB. Returns `400` with message `"El usuario no tiene una foto de perfil"` if the user has no avatar set
  - New `UserService.updateAvatar(userId, avatarUrl)` and `UserService.deleteAvatar(userId)` methods
  - New `avatar?: string | null` field added to `UserModel` and `UserPublicModel` interfaces
  - `avatar` field included in `select` of `register` and `getMe` service methods so all user endpoints return it consistently

### Changed

- **`uploadMiddleware`**: refactored from a fixed middleware to a factory function `uploadMiddleware(fieldName)` — allows each route to declare its own form field name. Recipe routes use `uploadMiddleware("thumbnail")`, avatar route uses `uploadMiddleware("avatar")`

## [1.11.0] - 2026-05-21

### Added

- **Image upload for recipes via Cloudinary**: Implemented end-to-end image upload support for recipe creation and update using a coupled flow:
  - New dependencies: `cloudinary`, `multer`, `@types/multer`
  - New environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - New `src/config/cloudinary.ts` — initializes the Cloudinary SDK using `environment.ts`
  - New `src/modules/storage/services/storage.service.ts` — shared, decoupled service with three methods:
    - `upload(buffer, folder)` — uploads a buffer to Cloudinary, forces WebP format with automatic quality optimization, returns `{ url, public_id }`
    - `delete(publicId)` — removes an image from Cloudinary by its `public_id`
    - `extractPublicId(url)` — parses the `public_id` from a Cloudinary URL (used to identify and clean up the previous image on PATCH)
  - New `src/middleware/upload.middleware.ts` — Multer middleware with `memoryStorage` (no disk writes), type filter (`image/jpeg`, `image/png`, `image/webp`) and 5MB size limit. Returns typed error responses: `400` for oversized files, `415` for unsupported types

### Changed

- **`POST /recipe`**: endpoint now accepts `multipart/form-data` instead of `application/json`. The `thumbnail` field is no longer part of the body — it is sent as a file in the `thumbnail` form field. If the DB operation fails after a successful upload, the image is deleted from Cloudinary automatically in the `catch` block to avoid orphaned files
- **`PATCH /recipe/:id`**: endpoint now accepts `multipart/form-data` and supports updating the recipe image. When a new image is uploaded, the previous Cloudinary image is deleted automatically after a successful DB update. If the DB update fails, the newly uploaded image is deleted to preserve consistency
- **`RecipeCreateZodSchema`**: `thumbnail` removed from body validation (now comes from file). Added `z.preprocess(parseJsonString, ...)` for `ingredients` and `steps` to handle JSON string serialization required by `multipart/form-data`
- **`RecipeUpdateZodSchema`**: Added `z.preprocess(parseJsonString, ...)` for `ingredients` and `steps` for multipart compatibility
- **`RecipeBaseZodSchema`**: `score` migrated from `z.number()` to `z.coerce.number()` — domain-level change that tolerates string input regardless of transport format
- **`AuthorizationApiKey` middleware**: added `LoggerService` logging on rejected requests — logs `method`, `endpoint` and `ip` at error level so unauthorized access attempts appear in both console and `error.log`

## [1.10.0] - 2026-05-10

### Added

- **Password reset flow**: Implemented end-to-end forgot/reset password functionality via SendGrid:
  - New dependency: `@sendgrid/mail`
  - New environment variables: `SENDGRID_API_KEY`, `SENDGRID_EMAIL_FROM`, `SENDGRID_TEMPLATE_ID_RESET_PASSWORD`
  - New `src/services/mail.service.ts` with `MailService.sendResetPassword()` — wraps SendGrid dynamic template call with `{{first_name}}` and `{{reset_link}}` variables
  - New utility functions in `src/modules/user/utils/token.utils.ts`: `generateResetToken()` (32-byte cryptographically secure hex via Node.js `crypto`) and `generateResetTokenExpiry()` (1-hour fixed expiry)
  - New fields on `User` model: `resetToken String? @unique` and `resetTokenExpires DateTime?` — migration `add_reset_token_to_user`
  - `POST /v1/user/forgot-password` — receives `{ email }`, generates a reset token, persists it with expiry, and sends the reset email. Always returns the same `200` response regardless of whether the email exists (prevents user enumeration)
  - `POST /v1/user/reset-password` — receives `{ token, newPassword }`, validates token existence and expiry, hashes the new password with bcrypt, clears reset fields. Returns `400` with distinct messages for invalid vs. expired tokens

## [1.9.0] - 2026-05-09

### Added

- **User model and authentication infrastructure**: Implemented full user management system:
  - New `User` model in Prisma schema with fields: `id`, `email`, `username`, `passwordHash`, `role` (ADMIN/USER enum), `isActive`, `lastLoginAt`, `createdAt`, `updatedAt`
  - Unique constraints on `email` and `username`
  - Three database migrations: `add_user_model`, `add_user_fk_to_recipe`, `add_role_to_user`
  - Dependencies added: `jsonwebtoken`, `bcryptjs` and their TypeScript types (`@types/jsonwebtoken`, `@types/bcryptjs`)
  - New environment variables: `JWT_SECRET` and `JWT_EXPIRES_IN`

- **Authentication middleware**: New `src/middleware/auth.middleware.ts`:
  - `authMiddleware` — validates `Authorization: Bearer <token>` header, injects user data into `req.user`, returns `401` if token is missing or invalid
  - `optionalAuthMiddleware` — soft variant that resolves the user if a valid token is present but does not block the request

- **User endpoints** with Zod input validation:
  - `POST /v1/user/register` — creates user with bcrypt-hashed password, returns public profile (no `passwordHash` exposed)
  - `POST /v1/user/login` — validates credentials, updates `lastLoginAt`, returns JWT and public user data
  - `GET /v1/user/me` — returns the authenticated user's profile

- **User–Recipe ownership**:
  - Optional `idUser` foreign key added to `Recipe` (`onDelete: SetNull` preserves recipes if a user is deleted)
  - `POST /v1/recipe` now associates the created recipe with the authenticated user
  - `GET /v1/recipe` supports `idUser=<number>` and `idUser=me` filters
  - `PATCH` and `DELETE` enforce ownership — only the owner or an `ADMIN` can modify a recipe (returns `403 Forbidden` otherwise)

- **User seeding**: New seed function in `src/shared/prisma/seeds/user/index.ts` to populate an initial admin user

- **Tests for user module**: 18 new unit tests covering `UserController` and `UserService` (register, login, getMe — success and error paths)

### Changed

- **Recipe routes secured**: `POST`, `PATCH`, `DELETE` now require JWT authentication via `authMiddleware`. `GET` uses `optionalAuthMiddleware`
- **Standardized error response format**: All error responses across controllers and middleware now use the `ErrorResponse` interface `{ error, details }`. HTTP status codes use `HttpStatusCode` enum constants throughout
- **Frontend URL environment variable consolidated**: Replaced `FRONT_URL_LOCAL`, `FRONT_URL_DEV` and `FRONT_URL_PROD` with a single `FRONT_URL` variable, set per deployment environment
- **`SALT_ROUNDS` extracted to shared constant**: Moved to `src/modules/user/constants.ts` to avoid duplication between service and seed

### Fixed

- **Recipe count ignoring filters**: `RecipeService.get` was returning the total record count regardless of active query filters. Count now correctly applies the same `where` clause as `findMany`
- **JWT `expiresIn` type cast**: Removed `as any` — options object is now properly typed as `SignOptions`
- **TOCTOU race condition in recipe ownership check**: Ownership verification and the update/delete operation are now atomic inside a Prisma `$transaction`, eliminating the window between the read and write
- **`JWT_SECRET` missing in production**: Application now throws an error at startup if `API_ENV=production` and `JWT_SECRET` is not defined, preventing tokens from being silently signed with a known fallback value

## [1.8.2] - 2025-09-29

### Changed

- **Dependency versions updated automatically via Express cascade**:
  - `body-parser`: `1.20.2` → `1.20.3`
  - `cookie`: `0.6.0` → `0.7.1`
  - `path-to-regexp`: `0.1.7` → `0.1.12`
  - `send`: `0.18.0` → `0.19.0`
  - `serve-static`: `1.15.0` → `1.16.2`
  - `qs`: `6.11.0` → `6.13.0`
  - `encodeurl`: `~1.0.2` → `~2.0.0`
  - `finalhandler`: `1.2.0` → `1.3.1`

### Fixed

- **Critical security update**: Resolved **10 security vulnerabilities** across project dependencies:
  - **EXPRESS UPDATE**: Upgraded Express from `4.19.2` to `4.21.2` (resolves 6 vulnerabilities)
  - **HIGH severity fixes**:
    - `body-parser` DoS vulnerability (CVSS: 7.5) - Fixed denial of service when URL encoding is enabled
    - `cross-spawn` ReDoS vulnerability (CVSS: 7.5) - Fixed Regular Expression Denial of Service
    - `path-to-regexp` ReDoS vulnerabilities (CVSS: 7.5) - Fixed two ReDoS issues in routing patterns
    - `express` XSS vulnerability (CVSS: 5.0) - Fixed Cross-Site Scripting via response.redirect()
  - **MODERATE severity fixes**:
    - `@babel/helpers` RegExp inefficiency (CVSS: 6.2) - Fixed inefficient RegExp complexity in generated code
    - `micromatch` ReDoS vulnerability (CVSS: 5.3) - Fixed Regular Expression Denial of Service in pattern matching
  - **LOW severity fixes**: `cookie`, `send`, `serve-static`, `brace-expansion` - Multiple parsing and XSS vulnerabilities

## [1.8.1] - 2025-09-21

### Added

- **Enhanced foreign key constraint error handling**: Implemented specific error handling for P2003 (Foreign Key Constraint) errors in Prisma middleware:
  - Added dedicated handling for deletion conflicts when records have dependencies
  - Improved HTTP status code from 400 Bad Request to 409 Conflict for better semantic accuracy
  - Enhanced error messages with contextual information and actionable guidance

### Changed

- **Improved error response quality**:
  - **Before**: Generic "Bad Request" with technical Prisma error details
  - **After**: Clear "Conflict" message explaining the dependency issue and resolution steps

## [1.8.0] - 2025-09-21

### Added

- **Metadata endpoint with usage statistics**: Implemented comprehensive metadata endpoint for RecipeBook module:
  - New `GET /v1/metadata/usage-count` endpoint for retrieving all metadata with usage statistics
  - Complete metadata response including ingredients, categories, and origins with their respective usage counts
  - Alphabetical ordering of all metadata results for consistent frontend display

- **Enhanced TypeScript interfaces for metadata**: New model interfaces for improved type safety:

## [1.7.0] - 2025-09-19

### Added

- **Recipe duplication functionality**: Implemented comprehensive recipe duplication feature:
  - New `POST /v1/recipe/:id/duplicate` endpoint for duplicating existing recipes
  - `RecipeService.duplicate()` method with data transformation for editing workflow
  - Automatic name modification with "(Copia)" suffix for duplicated recipes
  - Complete preservation of recipe data (ingredients, steps, category, origin) excluding metadata (id, timestamps)
  - Error handling for non-existent recipes with appropriate HTTP status codes

- **Enhanced TypeScript interfaces**: New model interfaces for improved type safety:
  - `RecipeIngredientInput` interface for recipe creation/update with ingredient data
  - `FullRecipeResponse` interface for API responses with populated relations
  - Updated `FullRecipeModel` to use proper ingredient typing

### Changed

- **Consolidated test organization**: Refactored test structure for better maintainability:
  - Moved recipe duplication unit tests from separate `recipe.duplicate.test.ts` into `recipe.service.test.ts`
  - Integrated duplication integration tests from `recipe.duplicate.integration.test.ts` into `integration.test.ts`
  - Enhanced test coverage with edge cases (recipes without steps, error scenarios)
  - Improved ingredient data structure in tests to match new `RecipeIngredientInput` interface

- **Improved service return types**: Updated `RecipeService` method signatures:
  - Enhanced return type consistency across `create`, `patch`, and `delete` methods
  - Better type safety for API responses with populated database relations

### Fixed

- **Null step handling**: Fixed potential runtime error when duplicating recipes without steps by adding null safety (`originalRecipe.steps?.map()`)

## [1.6.0] - 2025-09-14

### Changed

- **Enhanced TypeScript type safety**: Comprehensive refactoring to eliminate `any` types across the codebase:
  - **Controllers**: Replaced `any` error types with `unknown` and proper type guards in all controllers (`category`, `ingredient`, `origin`, `recipe`, `step`, `feature`)
  - **Services**: Updated all service `get` methods to use `QueryParams` interface instead of `any` for query parameters
  - **Tests**: Improved type safety in all test files:
    - Replaced `any[]` arrays with proper model types (`CategoryModel[]`, `IngredientModel[]`, etc.)
    - Updated mock functions to use `unknown` with type guards instead of `any`
    - Fixed query parameter typing issues with `as const` assertions

- **Improved interface naming**: Renamed `Iquery.ts` to `query.types.ts` following modern TypeScript conventions:

## [1.5.0] - 2025-09-13

### Added

- **Docker hot reload support**: Implemented automatic code reloading for Docker development environment:
  - New `dev:container` npm script with polling-based file watching for reliable change detection in containers
  - Enhanced Docker development workflow with real-time code updates without container rebuilds
- **Optimized Docker development configuration**:
  - Separate `docker-compose.dev.yml` with writable volume mounts for source code synchronization
  - Anonymous volume for `node_modules` to prevent host/container dependency conflicts
  - Improved `Dockerfile.dev` optimized for development with proper hot reload support

## [1.4.0] - 2025-09-13

### Added

- **Test coverage script**: New `test:coverage` npm script for comprehensive code coverage analysis using Jest
- **Enhanced test robustness**: Improved error validation tests for ingredient units with exact API error messages

### Changed

- **Standardized unit test structure**: Complete refactoring of all `recipeBook` module controller tests:
  - Unified mock structure across all controllers (`category`, `ingredient`, `origin`, `step`, `recipe`)
  - Consistent implementation of AAA pattern (Arrange, Act, Assert) in all test cases
- **Test maintainability**: Consistent code structure and naming conventions across all test files

## [1.3.0] - 2025-09-01

### Changed

- **Standardized cooking measurement units**: Refined `Unit` enum in `enums.ts` to focus on practical culinary measurements:
  - Changed `unit` to `u` for brevity
  - Added `pinch`, `cup` and `cl` for better representation of small quantities
- **Enhanced seed data realism**: Updated ingredient and recipe seed data for more practical cooking scenarios:
  - Migrated ingredient units to appropriate measurements (e.g., spices to `tsp`/`pinch`, liquids to `tbsp`/`cup`)
  - Adjusted recipe quantities to match realistic cooking proportions
  - Improved ingredient-to-unit consistency across all recipes
- **Improved validation error structure**: Renamed `validation` to `validations` in `ErrorResponse` interface for better semantic clarity

## [1.2.0] - 2025-08-31

### Added

- **Centralized step numbering utility**: Created `assignStepNumbers()` utility function in `recipe.utils.ts` for consistent step number assignment across recipe operations
- **Enhanced type safety**: `RecipeStepInput` interface for recipe-specific step operations
- **Comprehensive validation error messages**: Added custom `invalid_type_error` messages for all Zod schema fields to replace generic error messages

### Changed

- **Improved validation error responses**: Enhanced Zod validation middleware to provide detailed error arrays with all validation issues:
  - Removed redundant `field` property from `ErrorResponse` interface
  - Added `validation` array containing all error details
- **Refactored recipe service**: Moved recipe-specific interfaces (`RecipeStepModel`, `RecipeStepInput`) from `step.model.ts` to `recipe.model.ts`
- **Standardized validation messages**: Unified all validation error messages for consistency and improved clarity
- **Improved pagination validation**: Updated page validation to accept 0-based pagination (page >= 0)

### Removed

- **Code duplication**: Eliminated duplicate step numbering logic between recipe create and update operations

### Fixed

- **Step numbering logic**: Resolved issues with step number assignment, ensuring proper handling of:
  - Existing step numbers are preserved
  - Missing numbers are auto-assigned sequentially
  - Duplicate numbers are avoided
  - Steps are returned sorted by number

## [1.1.0] - 2025-08-23

### Added

- **New centralized API response structure**: Introduced `api.response.ts` with standardized interfaces:
  - `CollectionResponse<T>` for paginated/counted data responses
  - `ItemResponse<T>` for single item responses
  - `DeleteResponse` for deletion confirmations
  - `ErrorResponse` for client-facing errors
  - `ErrorWithCode` for internal error handling with HTTP status codes

### Changed

- **BREAKING: API Response Format**: Modernized all API endpoints to use the new response structure:
  - Removed redundant `code` and `message` fields from successful and essential information responses
  - Standardized collection responses to include `count` and `data` fields
- **Interface naming**: Refactored `IBaseModel` to `BaseEntity` and renamed to `base.entity.ts`, following modern TypeScript conventions:
  - Removed Hungarian notation (`I` prefix)
  - Updated all model interfaces to extend `BaseEntity`
- **Error handling**: Enhanced error middleware and controllers to use the new `ErrorWithCode` pattern
- **Controllers refactoring**: Updated all controllers (`Recipe`, `Category`, `Ingredient`, `Origin`, `Step`, `Feature`) to implement the new response interfaces
- **Middleware improvements**: Updated `authorization.ts` and `schema.validation.ts` to use `ErrorResponse`

### Removed

- **Obsolete interfaces**: Cleaned up unused and deprecated interfaces:
  - Removed `IResponse` interface (replaced by new API response structure)
  - Removed `Ibase.repository.ts` (was commented out and unused)
- **Code duplication**: Eliminated redundant response formatting across controllers

### Fixed

- **TypeScript compilation**: Resolved all type safety issues after interface refactoring
- **Response consistency**: Ensured all API endpoints follow the same response pattern

## [1.0.3] - 2025-06-14

### Added

- Nothing added in this version.

### Changed

- Modified `thumbnail` field in Recipe model to be optional (`String?`) and updated with default placeholder value: `https://placehold.co/900x600/1C4532/C6F6D5.png?text=Imagen+de+la+Receta`.
- Enhanced Zod validation for Recipe `thumbnail` field to properly handle URLs with query parameters.

### Fixed

- Fixed wrong entity name in middleware of schema validation.

## [1.0.2] - 2025-05-10

### Added

- Introduced `LoggerService` to standardize logging across the application using Winston.
- Custom log format supporting `[Entity] Action - Message` with structured metadata.
- Helper support for logging per-entity with semantic actions like `"Creating"` and `"Created"`.

### Changed

- Refactored all direct calls to the logger to use `LoggerService`.
- Updated Winston configuration to support structured logs for both console and file transports.
- Enhanced error logs to include stack trace, error name, and query context.

### Removed

- Redundant `info` log entries before actions when sufficient context is provided by success or error logs.

## [1.0.1] - 2025-04-20

### Fixed

- Fixed missing attributes in test cases which caused `docker-compose up --build -d` to fail.

## [1.0.0] - 2025-04-19

### Added

- Initial release of `MisRegistros-Back`.
- `RecipeBook` and `Feature` management modules with full CRUD operations.
- RESTful API endpoints for:
  - `Recipes`
  - `Ingredients`
  - `Categories`
  - `Steps`
  - `Origins`
- API key-based authentication middleware.
- Request validation using Zod schemas.
- Integration with Prisma ORM for database operations.
- Structured error handling and centralized logging.

### Changed

- Nothing changed in this initial version.

### Fixed

- No bug fixes in this initial version.
