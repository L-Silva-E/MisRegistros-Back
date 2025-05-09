# Changelog

All notable changes to the `MisRegistros-Back` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
