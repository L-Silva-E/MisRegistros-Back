# Changelog

All notable changes to the `MisRegistros-Back` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
