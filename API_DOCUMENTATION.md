# API Documentation

## Overview

The NMG Quiz Portal integrates with the Roodito API through a secure Next.js proxy to provide quiz data for Kenyan students across CBC and 8-4-4 education systems.

## Base URL

```
https://roodito.com/Api_controller/quiz_table_data
```

## Authentication

All API requests require a `tutor_id` parameter:
- **Value**: `62fa2e148efknmg`
- **Type**: String
- **Required**: Yes

## Endpoints

### Get Quiz Data

**Endpoint**: `GET /api/quiz_table_data`

**Description**: Retrieves paginated quiz data with optional filtering.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tutor_id` | string | Yes | - | Authentication token |
| `page` | number | No | 1 | Page number for pagination |
| `per_page` | number | No | 20 | Items per page (max: 100) |
| `subject` | string | No | - | Filter by subject name |
| `grade` | string | No | - | Filter by grade level |
| `level` | string | No | - | Filter by education level |
| `quiz_type` | string | No | - | Filter by quiz type |

#### Example Request

```bash
curl "http://localhost:3000/api/quiz_table_data?page=1&per_page=10"
```

#### Example Response

```json
{
  "text": "Success",
  "type": "json",
  "data": [
    {
      "date": "July 19, 2025",
      "level": "Upper Primary",
      "subject": "Social studies",
      "grade": "4",
      "number_of_question": "1",
      "quiz_id": "687b5c8e61c37",
      "quiz_link": "https://roodito.com/do-quiz/687b5c8e61c37",
      "quiz_type": "Premium"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "per_page": 10,
    "total_pages": 15
  }
}
```

## Response Format

### Quiz Object

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Quiz creation date |
| `level` | string | Education level (e.g., "Upper Primary") |
| `subject` | string | Subject name |
| `grade` | string | Grade level |
| `number_of_question` | string | Number of questions in quiz |
| `quiz_id` | string | Unique quiz identifier |
| `quiz_link` | string | Direct link to quiz on Roodito |
| `quiz_type` | string | Quiz type (e.g., "Premium") |

### Pagination Object

| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of quizzes |
| `page` | number | Current page number |
| `per_page` | number | Items per page |
| `total_pages` | number | Total number of pages |

## Error Responses

### 400 Bad Request
```json
{
  "error": "INVALID_PARAMETERS",
  "message": "Invalid query parameters",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

### 408 Timeout
```json
{
  "error": "TIMEOUT",
  "message": "Request timed out",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Internal server error",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

## Rate Limiting

- **Timeout**: 30 seconds per request
- **Retry Logic**: 3 attempts with exponential backoff
- **Cache Duration**: 10 minutes

## Security

- **API Proxy**: All requests go through Next.js API routes
- **Input Validation**: Query parameters are validated and sanitized
- **Error Handling**: Sensitive information is not exposed in error messages
- **Headers**: Proper security headers are set on responses

## Caching

The API implements intelligent caching:

- **Cache Duration**: 10 minutes
- **Cache Key**: Based on query parameters
- **Cache Invalidation**: Automatic after TTL expires
- **Cache Strategy**: Cache-first with background refresh

## Usage Examples

### Get All Quizzes (Paginated)
```javascript
const response = await fetch('/api/quiz_table_data?page=1&per_page=50');
const data = await response.json();
```

### Filter by Subject
```javascript
const response = await fetch('/api/quiz_table_data?subject=Mathematics&page=1');
const data = await response.json();
```

### Filter by Grade and Level
```javascript
const response = await fetch('/api/quiz_table_data?grade=4&level=Upper Primary');
const data = await response.json();
```

## Integration Notes

1. **Progressive Loading**: The frontend implements progressive loading to show data as it arrives
2. **Error Handling**: Graceful error handling with user-friendly messages
3. **Performance**: Optimized for fast loading with caching and pagination
4. **Mobile Support**: Responsive design that works on all devices

## Monitoring

- **Response Times**: Monitor API response times
- **Error Rates**: Track error rates and types
- **Cache Hit Rates**: Monitor cache effectiveness
- **User Engagement**: Track quiz completion rates 