# DocReader Backend

Backend service for DocReader, a document parsing service that handles PDF, Word, and TXT files.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### POST /parse

Upload and parse a document. Returns the parsed text content.

#### Request
- FormData with a single file field: `file`
- Supported file types: PDF, Word (.docx), TXT

#### Response

```json
{
  "success": true,
  "content": "Parsed document content"
}
```

Or in case of error:

```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /health

Health check endpoint.

#### Response

```json
{
  "status": "ok"
}
```

## Deployment

This service can be deployed to any platform that supports Node.js, such as:

- Vercel
- Heroku
- AWS Lambda
- DigitalOcean App Platform

## Environment Variables

- `PORT`: Port to run the service on (default: 3001)
