# 🚂 Express.js Product API

A RESTful API built with Express.js and MongoDB for managing products. This API provides full CRUD operations with authentication, validation, filtering, pagination, and search functionality.

## 🚀 Features

- **RESTful CRUD Operations**: Create, Read, Update, Delete products
- **Authentication**: API key-based authentication
- **Validation**: Input validation middleware
- **Filtering**: Filter products by category
- **Search**: Search products by name
- **Pagination**: Paginated product listing
- **Statistics**: Product analytics and statistics
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Logging**: Request logging middleware

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd express-js-server-side-framework-Bochaberii
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your actual values.

4. **Start the server**

   ```bash
   # Development mode
   npm start

   # Production mode
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/productdb
API_KEY=your-secret-api-key-here
NODE_ENV=development
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most write operations require an API key to be included in the request headers:

```
x-api-key: your-secret-api-key-here
```

---

### 🏠 Root Endpoint

#### `GET /`

Welcome message and API information.

**Response:**

```json
"Welcome to the Product API! Go to /api/products to see all products."
```

---

### 📦 Products Endpoints

#### `GET /api/products`

Retrieve all products with optional filtering, searching, and pagination.

**Query Parameters:**

- `category` (optional): Filter by product category
- `search` (optional): Search products by name (case-insensitive)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Example Request:**

```bash
GET /api/products?category=Electronics&search=phone&page=1&limit=5
```

**Example Response:**

```json
{
  "products": [
    {
      "_id": "64f8b2a1c234567890abcdef",
      "name": "iPhone 15",
      "description": "Latest Apple smartphone",
      "price": 999,
      "category": "Electronics",
      "inStock": true,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 1,
  "totalProducts": 1
}
```

---

#### `GET /api/products/:id`

Retrieve a specific product by ID.

**Parameters:**

- `id`: Product ID (MongoDB ObjectId)

**Example Request:**

```bash
GET /api/products/64f8b2a1c234567890abcdef
```

**Example Response:**

```json
{
  "_id": "64f8b2a1c234567890abcdef",
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 999,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2023-09-06T10:30:00.000Z",
  "updatedAt": "2023-09-06T10:30:00.000Z"
}
```

**Error Response (404):**

```json
{
  "message": "Product not found"
}
```

---

#### `POST /api/products`

Create a new product.

**Authentication Required:** Yes (API Key)

**Request Body:**

```json
{
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship smartphone",
  "price": 899,
  "category": "Electronics",
  "inStock": true
}
```

**Example Request:**

```bash
POST /api/products
Content-Type: application/json
x-api-key: your-secret-api-key-here

{
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship smartphone",
  "price": 899,
  "category": "Electronics",
  "inStock": true
}
```

**Example Response (201):**

```json
{
  "_id": "64f8b2a1c234567890abcde0",
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship smartphone",
  "price": 899,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2023-09-06T11:00:00.000Z",
  "updatedAt": "2023-09-06T11:00:00.000Z"
}
```

**Validation Error Response (400):**

```json
{
  "message": "Validation Error: name, description, price, and category are required"
}
```

---

#### `PUT /api/products/:id`

Update an existing product.

**Authentication Required:** Yes (API Key)

**Parameters:**

- `id`: Product ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Premium Samsung smartphone with S Pen",
  "price": 1199,
  "category": "Electronics",
  "inStock": false
}
```

**Example Request:**

```bash
PUT /api/products/64f8b2a1c234567890abcde0
Content-Type: application/json
x-api-key: your-secret-api-key-here

{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Premium Samsung smartphone with S Pen",
  "price": 1199,
  "category": "Electronics",
  "inStock": false
}
```

**Example Response:**

```json
{
  "_id": "64f8b2a1c234567890abcde0",
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Premium Samsung smartphone with S Pen",
  "price": 1199,
  "category": "Electronics",
  "inStock": false,
  "createdAt": "2023-09-06T11:00:00.000Z",
  "updatedAt": "2023-09-06T11:30:00.000Z"
}
```

---

#### `DELETE /api/products/:id`

Delete a product.

**Authentication Required:** Yes (API Key)

**Parameters:**

- `id`: Product ID (MongoDB ObjectId)

**Example Request:**

```bash
DELETE /api/products/64f8b2a1c234567890abcde0
x-api-key: your-secret-api-key-here
```

**Example Response:**

```json
{
  "message": "Product deleted successfully",
  "product": {
    "_id": "64f8b2a1c234567890abcde0",
    "name": "Samsung Galaxy S24 Ultra",
    "description": "Premium Samsung smartphone with S Pen",
    "price": 1199,
    "category": "Electronics",
    "inStock": false,
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

---

#### `GET /api/products/stats`

Get product statistics and analytics.

**Example Request:**

```bash
GET /api/products/stats
```

**Example Response:**

```json
{
  "totalProducts": 25,
  "inStockCount": 20,
  "outOfStockCount": 5,
  "byCategory": [
    {
      "_id": "Electronics",
      "count": 15,
      "avgPrice": 599.99,
      "totalValue": 8999.85
    },
    {
      "_id": "Clothing",
      "count": 10,
      "avgPrice": 49.99,
      "totalValue": 499.9
    }
  ]
}
```

---

## 🔧 Error Responses

The API uses conventional HTTP response codes:

- `200` - OK: Successful GET, PUT
- `201` - Created: Successful POST
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Missing or invalid API key
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error

**Error Response Format:**

```json
{
  "message": "Error description"
}
```

## 🧪 Testing the API

### Using curl

1. **Get all products:**

   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Create a product:**

   ```bash
   curl -X POST http://localhost:3000/api/products \
     -H "Content-Type: application/json" \
     -H "x-api-key: your-secret-api-key-here" \
     -d '{
       "name": "Test Product",
       "description": "A test product",
       "price": 29.99,
       "category": "Test",
       "inStock": true
     }'
   ```

3. **Search products:**
   ```bash
   curl "http://localhost:3000/api/products?search=test&category=Electronics"
   ```

### Using Postman

1. Import the following endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. For authenticated endpoints, add header: `x-api-key: your-secret-api-key-here`
4. Test each endpoint with the examples provided above

## 🏗️ Project Structure

```
├── config/
│   └── db.js              # Database connection
├── models/
│   └── product.js         # Product model/schema
├── routes/
│   └── productRoutes.js   # Product routes and middleware
├── .env                   # Environment variables (not in repo)
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── server.js             # Main application file
└── README.md             # This file
```

## 🚀 Deployment

### Deploying to Heroku

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create your-app-name`
4. Set environment variables: `heroku config:set API_KEY=your-key`
5. Deploy: `git push heroku main`

### Deploying to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built as part of the Express.js Server-Side Framework assignment.
