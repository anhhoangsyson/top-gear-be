# API Documentation - Laptop Search Features

## Base URL
```
http://localhost:3000/api/v1/laptop
```

## Search Endpoints

### 1. Search Suggestions
**Endpoint:** `GET /search/suggestions`

**Description:** Trả về danh sách gợi ý sản phẩm laptop khi user đang gõ (realtime suggestions). API này trả về thông tin cơ bản của laptop bao gồm hình ảnh, tên, giá để hiển thị dropdown suggestions.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Từ khóa tìm kiếm |
| limit | number | No | 10 | Số lượng gợi ý tối đa |

**Request Example:**
```bash
GET /api/v1/laptop/search/suggestions?q=asus&limit=5
```

**Response Success (200):**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "ASUS ROG Strix G15",
      "modelName": "G513QM-HF301W",
      "slug": "asus-rog-strix-g15-g513qm-hf301w",
      "price": 35990000,
      "discountPrice": 32990000,
      "primaryImage": "https://res.cloudinary.com/...",
      "brand": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "ASUS",
        "logo": "https://res.cloudinary.com/..."
      }
    },
    // ... more suggestions
  ],
  "query": "asus",
  "count": 5,
  "message": "Search suggestions retrieved successfully"
}
```

**Response Error (400):**
```json
{
  "message": "Query parameter \"q\" is required"
}
```

**Use Case:**
- Hiển thị dropdown suggestions khi user đang gõ vào search box
- Mỗi suggestion hiển thị: ảnh sản phẩm, tên, giá, brand
- User có thể click vào suggestion để đi đến trang chi tiết sản phẩm

---

### 2. Autocomplete
**Endpoint:** `GET /search/autocomplete`

**Description:** Trả về danh sách các từ khóa để hoàn thành câu tìm kiếm (autocomplete text). API này chỉ trả về mảng các string keywords, không có thông tin sản phẩm.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Từ khóa tìm kiếm |
| limit | number | No | 10 | Số lượng từ khóa tối đa |

**Request Example:**
```bash
GET /api/v1/laptop/search/autocomplete?q=intel&limit=8
```

**Response Success (200):**
```json
{
  "data": [
    "Intel Core i7",
    "Intel Core i5",
    "Intel Core i9",
    "Dell Inspiron Intel Core i7",
    "HP Pavilion Intel Core i5",
    "ASUS VivoBook Intel Core i7",
    "Lenovo ThinkPad Intel Core i5",
    "Acer Aspire Intel Core i7"
  ],
  "query": "intel",
  "count": 8,
  "message": "Autocomplete suggestions retrieved successfully"
}
```

**Response Error (400):**
```json
{
  "message": "Query parameter \"q\" is required"
}
```

**Use Case:**
- Hiển thị dropdown list các từ khóa gợi ý để user chọn
- Giúp user hoàn thành câu tìm kiếm nhanh hơn
- Tự động fill vào search box khi user chọn một keyword

---

### 3. Realtime Search
**Endpoint:** `GET /search`

**Description:** Tìm kiếm laptop realtime với kết quả đầy đủ, hỗ trợ phân trang và nhiều tùy chọn sắp xếp. API này trả về danh sách laptop chi tiết matching với query.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Từ khóa tìm kiếm |
| page | number | No | 1 | Số trang (bắt đầu từ 1) |
| limit | number | No | 20 | Số sản phẩm mỗi trang |
| sortBy | string | No | relevance | Cách sắp xếp kết quả |

**Sort Options (sortBy):**
- `relevance`: Độ liên quan (mặc định)
- `price_asc`: Giá tăng dần
- `price_desc`: Giá giảm dần
- `rating`: Đánh giá cao nhất
- `newest`: Mới nhất
- `name`: Tên A-Z

**Request Example:**
```bash
GET /api/v1/laptop/search?q=gaming&page=1&limit=20&sortBy=price_desc
```

**Response Success (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "modelName": "ROG Strix G15",
      "name": "ASUS ROG Strix G15 G513QM",
      "brandId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "ASUS",
        "logo": "https://res.cloudinary.com/..."
      },
      "categoryId": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Gaming Laptop",
        "slug": "gaming-laptop"
      },
      "description": "Laptop gaming hiệu năng cao...",
      "price": 35990000,
      "discountPrice": 32990000,
      "stock": 15,
      "warranty": 24,
      "releaseYear": 2023,
      "status": "new",
      "weight": 2.3,
      "dimensions": "354 x 259 x 27.2 mm",
      "specifications": {
        "processor": "AMD Ryzen 9 5900HX",
        "processorGen": "5th Gen",
        "processorSpeed": 3.3,
        "ram": 16,
        "ramType": "DDR4",
        "storage": 512,
        "storageType": "SSD NVMe",
        "graphicsCard": "NVIDIA GeForce RTX 3060",
        "graphicsMemory": 6,
        "displaySize": 15.6,
        "displayResolution": "1920x1080",
        "displayType": "IPS",
        "refreshRate": 144,
        "touchscreen": false,
        "battery": "90Wh",
        "batteryLife": 5,
        "operatingSystem": "Windows 11",
        "ports": ["USB-C", "HDMI 2.0", "RJ45"],
        "webcam": "720p HD",
        "keyboard": "RGB Backlit",
        "speakers": "2x speakers",
        "connectivity": "Wi-Fi 6, Bluetooth 5.1"
      },
      "images": [
        {
          "imageUrl": "https://res.cloudinary.com/...",
          "altText": "ASUS ROG Strix G15 front view",
          "isPrimary": true,
          "sortOrder": 1
        }
      ],
      "ratings": {
        "average": 4.5,
        "count": 128
      },
      "isActive": true,
      "isPromoted": false,
      "tags": ["gaming", "AMD Ryzen 9", "RTX 3060", "144Hz"],
      "slug": "asus-rog-strix-g15-g513qm-hf301w",
      "seoMetadata": {
        "metaTitle": "ASUS ROG Strix G15 - Gaming Laptop",
        "metaDescription": "Laptop gaming cao cấp...",
        "keywords": ["gaming laptop", "ASUS", "RTX 3060"]
      },
      "createdAt": "2023-10-15T10:30:00.000Z",
      "updatedAt": "2023-11-01T14:20:00.000Z"
    },
    // ... more laptops
  ],
  "query": "gaming",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  },
  "message": "Search results retrieved successfully"
}
```

**Response Error (400):**
```json
{
  "message": "Query parameter \"q\" is required"
}
```

**Use Case:**
- Hiển thị kết quả tìm kiếm đầy đủ trên trang search results
- Hỗ trợ phân trang để load nhiều sản phẩm
- Cho phép user sắp xếp kết quả theo nhiều tiêu chí
- Hiển thị tất cả thông tin chi tiết của laptop

---

## Search Behavior

### Search Fields
Tìm kiếm được thực hiện trên các trường sau:
- `name`: Tên laptop
- `modelName`: Model laptop
- `description`: Mô tả sản phẩm
- `tags`: Các tag đã được gán
- `specifications.processor`: Tên CPU
- `specifications.graphicsCard`: Tên card đồ họa

### Search Mode
- **Case-insensitive**: Không phân biệt hoa thường
- **Partial matching**: Tìm kiếm theo chuỗi con (substring)
- **Multi-field**: Tìm trên nhiều trường cùng lúc
- **Active only**: Chỉ tìm các laptop đang active (`isActive: true`)

---

## Integration Examples

### React/Next.js Example

#### 1. Search Suggestions (Debounced)
```typescript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

interface Suggestion {
  id: string;
  name: string;
  modelName: string;
  slug: string;
  price: number;
  discountPrice?: number;
  primaryImage: string;
  brand: {
    _id: string;
    name: string;
    logo: string;
  };
}

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const fetchSuggestions = debounce(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/laptop/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, 300); // 300ms delay

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel(); // Cleanup
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm laptop..."
      />

      {loading && <div>Loading...</div>}

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((item) => (
            <a key={item.id} href={`/laptop/${item.slug}`} className="suggestion-item">
              <img src={item.primaryImage} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>{item.brand.name}</p>
                <span className="price">
                  {item.discountPrice?.toLocaleString('vi-VN') || item.price.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### 2. Autocomplete
```typescript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

const SearchWithAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const fetchAutocomplete = debounce(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setKeywords([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/laptop/search/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=8`
      );
      const data = await response.json();
      setKeywords(data.data || []);
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
    }
  }, 300);

  useEffect(() => {
    fetchAutocomplete(query);
    return () => fetchAutocomplete.cancel();
  }, [query]);

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    setKeywords([]);
    // Redirect to search results page
    window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm laptop..."
      />

      {keywords.length > 0 && (
        <ul className="autocomplete-list">
          {keywords.map((keyword, index) => (
            <li key={index} onClick={() => handleSelectKeyword(keyword)}>
              {keyword}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

#### 3. Full Search Results Page
```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SearchResult {
  // ... full laptop interface
}

const SearchResultsPage = () => {
  const router = useRouter();
  const { q, page = '1', sortBy = 'relevance' } = router.query;

  const [laptops, setLaptops] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/laptop/search?q=${encodeURIComponent(q as string)}&page=${page}&limit=20&sortBy=${sortBy}`
        );
        const data = await response.json();
        setLaptops(data.data || []);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q, page, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    router.push({
      pathname: '/search',
      query: { q, page: 1, sortBy: newSortBy },
    });
  };

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: '/search',
      query: { q, page: newPage, sortBy },
    });
  };

  return (
    <div className="search-results">
      <h1>Kết quả tìm kiếm cho "{q}"</h1>
      <p>Tìm thấy {pagination.total} sản phẩm</p>

      <div className="sort-options">
        <select value={sortBy as string} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="relevance">Liên quan nhất</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
          <option value="newest">Mới nhất</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="laptop-grid">
            {laptops.map((laptop) => (
              <div key={laptop._id} className="laptop-card">
                <img src={laptop.images[0]?.imageUrl} alt={laptop.name} />
                <h3>{laptop.name}</h3>
                <p>{laptop.brandId.name}</p>
                <div className="price">
                  {laptop.discountPrice ? (
                    <>
                      <span className="original">{laptop.price.toLocaleString('vi-VN')} đ</span>
                      <span className="discount">{laptop.discountPrice.toLocaleString('vi-VN')} đ</span>
                    </>
                  ) : (
                    <span>{laptop.price.toLocaleString('vi-VN')} đ</span>
                  )}
                </div>
                <div className="specs">
                  <span>{laptop.specifications.processor}</span>
                  <span>{laptop.specifications.ram}GB RAM</span>
                  <span>{laptop.specifications.storage}GB SSD</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === pagination.page ? 'active' : ''}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
```

---

## Performance Tips

### Frontend Optimization
1. **Debouncing**: Luôn sử dụng debounce (300-500ms) cho search suggestions và autocomplete
2. **Caching**: Cache kết quả search trong một thời gian ngắn (5-10 phút)
3. **Lazy Loading**: Sử dụng pagination thay vì load tất cả results
4. **Skeleton Loading**: Hiển thị skeleton UI khi đang load

### Backend Optimization
1. **Indexing**: Database đã có text index trên các trường search
2. **Limit Results**: Giới hạn số lượng kết quả trả về
3. **Select Fields**: Suggestions chỉ select các fields cần thiết

---

## Error Handling

### Common Errors
```typescript
// Query parameter missing
{
  "message": "Query parameter \"q\" is required"
}

// Server error
{
  "message": "Internal server error",
  "error": "..."
}
```

### Frontend Error Handling Example
```typescript
const fetchSearchResults = async (query: string) => {
  try {
    const response = await fetch(`/api/v1/laptop/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search error:', error);
    // Show error message to user
    return { data: [], pagination: { total: 0 } };
  }
};
```

---

## Testing with cURL

```bash
# Test search suggestions
curl -X GET "http://localhost:3000/api/v1/laptop/search/suggestions?q=asus&limit=5"

# Test autocomplete
curl -X GET "http://localhost:3000/api/v1/laptop/search/autocomplete?q=intel&limit=10"

# Test realtime search
curl -X GET "http://localhost:3000/api/v1/laptop/search?q=gaming&page=1&limit=20&sortBy=price_desc"
```

---

## Notes

- Tất cả endpoints chỉ trả về laptops có `isActive: true`
- Search không phân biệt hoa thường (case-insensitive)
- Sử dụng query parameter `q` cho search query (không phải `query` hay `search`)
- Pagination bắt đầu từ page 1 (không phải 0)
- Default limit cho suggestions là 10, cho search results là 20
- Response luôn có format chuẩn với `data`, `message`, và pagination info (nếu có)
