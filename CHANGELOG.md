# Changelog

All notable changes to the `MisRegistros-Back` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
