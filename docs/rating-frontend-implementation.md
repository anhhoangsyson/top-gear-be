# Rating System - Frontend Implementation Guide

## 📋 Tổng quan

Document này hướng dẫn Frontend implement các tính năng mới của Rating System:
1. **Admin Reply** - Hiển thị và quản lý reply từ admin
2. **Status Management** - Quản lý trạng thái hiển thị rating (ẩn/hiện)

---

## 🎯 User Stories

### User (Khách hàng)
- ✅ Xem được reply từ admin trên đánh giá của mình
- ✅ Nhận notification khi admin reply
- ✅ Chỉ xem được rating có status = "visible"

### Admin
- ✅ Reply đánh giá của khách hàng
- ✅ Chỉnh sửa/xóa reply
- ✅ Ẩn/hiện rating không phù hợp
- ✅ Filter rating theo status

---

## 📦 TypeScript Interfaces

```typescript
// Rating Status Enum
export enum RatingStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

// Admin Reply Interface
export interface IAdminReply {
  content: string;
  adminId: {
    _id: string;
    fullname: string;
    email: string;
  };
  repliedAt: string; // ISO date string
}

// Rating Interface (Updated)
export interface IRating {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  laptopId?: {
    _id: string;
    name: string;
    modelName: string;
    images: string[];
  } | null;
  rating: number; // 1-5
  comment?: string;
  status: RatingStatus; // MỚI
  adminReply?: IAdminReply; // MỚI
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface RatingResponse {
  success: boolean;
  data: IRating;
  message: string;
}

export interface RatingListResponse {
  success: boolean;
  data: {
    ratings: IRating[];
    total: number;
    page: number;
    totalPages: number;
  };
}
```

---

## 🔌 API Endpoints

### Base URL
```typescript
const API_BASE_URL = 'https://api.example.com/api/v1/rating';
```

### 1. Get Ratings by Laptop (Public)
```typescript
// GET /rating/laptop/:laptopId
// Chỉ trả về rating có status = "visible"

async function getRatingsByLaptop(
  laptopId: string,
  page: number = 1,
  limit: number = 10
): Promise<RatingListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/laptop/${laptopId}?page=${page}&limit=${limit}`
  );
  return response.json();
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "_id": "rating123",
        "rating": 5,
        "comment": "Sản phẩm tuyệt vời!",
        "userId": {
          "_id": "user123",
          "fullname": "Nguyễn Văn A",
          "avatar": "https://..."
        },
        "status": "visible",
        "adminReply": {
          "content": "Cảm ơn bạn đã tin tưởng sản phẩm!",
          "adminId": {
            "_id": "admin123",
            "fullname": "Admin Support",
            "email": "admin@example.com"
          },
          "repliedAt": "2025-11-26T10:00:00.000Z"
        },
        "createdAt": "2025-11-25T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### 2. Admin: Get All Ratings with Filters
```typescript
// GET /rating/admin/all
// Admin có thể xem tất cả rating (bao gồm hidden)

interface GetAllRatingsParams {
  page?: number;
  limit?: number;
  status?: 'visible' | 'hidden';
  laptopId?: string;
  userId?: string;
  orderId?: string;
  rating?: number;
  search?: string;
}

async function getAllRatings(
  params: GetAllRatingsParams,
  adminToken: string
): Promise<RatingListResponse> {
  const queryString = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  const response = await fetch(
    `${API_BASE_URL}/admin/all?${queryString}`,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    }
  );
  return response.json();
}
```

**Usage Examples:**
```typescript
// Lấy tất cả rating visible
await getAllRatings({ status: 'visible', page: 1 }, adminToken);

// Lấy tất cả rating hidden
await getAllRatings({ status: 'hidden', page: 1 }, adminToken);

// Lấy rating của 1 laptop cụ thể
await getAllRatings({ laptopId: 'laptop123' }, adminToken);

// Lọc rating 1 sao
await getAllRatings({ rating: 1 }, adminToken);
```

---

### 3. Admin: Reply to Rating
```typescript
// POST /rating/admin/:id/reply

interface AdminReplyPayload {
  content: string; // 1-2000 chars
}

async function addAdminReply(
  ratingId: string,
  payload: AdminReplyPayload,
  adminToken: string
): Promise<RatingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin/${ratingId}/reply`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  return response.json();
}
```

**Example:**
```typescript
await addAdminReply(
  'rating123',
  { content: 'Cảm ơn bạn đã đánh giá!' },
  adminToken
);
```

---

### 4. Admin: Update Reply
```typescript
// PATCH /rating/admin/:id/reply

async function updateAdminReply(
  ratingId: string,
  payload: AdminReplyPayload,
  adminToken: string
): Promise<RatingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin/${ratingId}/reply`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  return response.json();
}
```

---

### 5. Admin: Delete Reply
```typescript
// DELETE /rating/admin/:id/reply

async function deleteAdminReply(
  ratingId: string,
  adminToken: string
): Promise<RatingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin/${ratingId}/reply`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    }
  );
  return response.json();
}
```

---

### 6. Admin: Update Rating Status
```typescript
// PATCH /rating/admin/:id/status

interface UpdateStatusPayload {
  status: 'visible' | 'hidden';
}

async function updateRatingStatus(
  ratingId: string,
  payload: UpdateStatusPayload,
  adminToken: string
): Promise<RatingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/admin/${ratingId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  return response.json();
}
```

**Example:**
```typescript
// Ẩn rating
await updateRatingStatus('rating123', { status: 'hidden' }, adminToken);

// Hiện rating
await updateRatingStatus('rating123', { status: 'visible' }, adminToken);
```

---

## 🎨 UI Components

### 1. Rating Card Component (User View)

```tsx
import React from 'react';
import { IRating } from '@/types/rating';
import { Star, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RatingCardProps {
  rating: IRating;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* User Rating Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={rating.userId.avatar || '/default-avatar.png'}
              alt={rating.userId.fullname}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{rating.userId.fullname}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(rating.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < rating.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        {rating.comment && (
          <p className="text-gray-700">{rating.comment}</p>
        )}
      </div>

      {/* Admin Reply Section */}
      {rating.adminReply && (
        <div className="bg-blue-50 rounded-lg p-4 space-y-2 border-l-4 border-blue-500">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Phản hồi từ {rating.adminReply.adminId.fullname}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(rating.adminReply.repliedAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </div>
          <p className="text-gray-700">{rating.adminReply.content}</p>
        </div>
      )}
    </div>
  );
};
```

---

### 2. Admin Rating Management Component

```tsx
import React, { useState } from 'react';
import { IRating, RatingStatus } from '@/types/rating';
import {
  Eye,
  EyeOff,
  MessageSquare,
  Trash2,
  Edit,
} from 'lucide-react';

interface AdminRatingCardProps {
  rating: IRating;
  onReply: (ratingId: string, content: string) => Promise<void>;
  onUpdateReply: (ratingId: string, content: string) => Promise<void>;
  onDeleteReply: (ratingId: string) => Promise<void>;
  onUpdateStatus: (ratingId: string, status: RatingStatus) => Promise<void>;
}

export const AdminRatingCard: React.FC<AdminRatingCardProps> = ({
  rating,
  onReply,
  onUpdateReply,
  onDeleteReply,
  onUpdateStatus,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState(
    rating.adminReply?.content || ''
  );

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    try {
      if (rating.adminReply) {
        await onUpdateReply(rating._id, replyContent);
      } else {
        await onReply(rating._id, replyContent);
      }
      setIsReplying(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus =
      rating.status === RatingStatus.VISIBLE
        ? RatingStatus.HIDDEN
        : RatingStatus.VISIBLE;
    await onUpdateStatus(rating._id, newStatus);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            rating.status === RatingStatus.VISIBLE
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {rating.status === RatingStatus.VISIBLE ? 'Hiển thị' : 'Đã ẩn'}
        </span>

        {/* Rating Score */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{rating.rating}/5</span>
          <span className="text-yellow-400">★</span>
        </div>
      </div>

      {/* User Info */}
      <div>
        <p className="font-medium">{rating.userId.fullname}</p>
        <p className="text-sm text-gray-500">{rating.userId.email}</p>
      </div>

      {/* Comment */}
      {rating.comment && (
        <p className="text-gray-700">{rating.comment}</p>
      )}

      {/* Admin Reply Display */}
      {rating.adminReply && !isEditing && (
        <div className="bg-blue-50 rounded p-3">
          <p className="text-sm text-gray-700">{rating.adminReply.content}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                setReplyContent(rating.adminReply!.content);
                setIsEditing(true);
              }}
              className="text-blue-600 text-sm hover:underline"
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => onDeleteReply(rating._id)}
              className="text-red-600 text-sm hover:underline"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Reply/Edit Form */}
      {(isReplying || isEditing) && (
        <div className="space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Nhập nội dung phản hồi..."
            className="w-full border rounded p-2 min-h-[100px]"
            maxLength={2000}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitReply}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Cập nhật' : 'Gửi phản hồi'}
            </button>
            <button
              onClick={() => {
                setIsReplying(false);
                setIsEditing(false);
                setReplyContent(rating.adminReply?.content || '');
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Hủy
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {replyContent.length}/2000 ký tự
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        {!rating.adminReply && !isReplying && (
          <button
            onClick={() => setIsReplying(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4" />
            Phản hồi
          </button>
        )}

        <button
          onClick={handleToggleStatus}
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            rating.status === RatingStatus.VISIBLE
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {rating.status === RatingStatus.VISIBLE ? (
            <>
              <EyeOff className="w-4 h-4" />
              Ẩn đánh giá
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Hiện đánh giá
            </>
          )}
        </button>
      </div>
    </div>
  );
};
```

---

### 3. Admin Rating Filter Component

```tsx
import React, { useState } from 'react';
import { RatingStatus } from '@/types/rating';

interface FilterState {
  status?: RatingStatus;
  rating?: number;
  search?: string;
}

interface RatingFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({});

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold">Bộ lọc</h3>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Trạng thái</label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value={RatingStatus.VISIBLE}>Hiển thị</option>
          <option value={RatingStatus.HIDDEN}>Đã ẩn</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Điểm đánh giá</label>
        <select
          value={filters.rating || ''}
          onChange={(e) =>
            handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Tìm trong nội dung đánh giá..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setFilters({});
          onFilterChange({});
        }}
        className="w-full py-2 border rounded hover:bg-gray-100"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};
```

---

## 🔧 React Hooks

### useRatingManagement Hook

```typescript
import { useState, useCallback } from 'react';
import { IRating, RatingStatus } from '@/types/rating';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export const useRatingManagement = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const addReply = useCallback(
    async (ratingId: string, content: string): Promise<IRating> => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/rating/admin/${ratingId}/reply`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success('Phản hồi thành công!');
        return result.data;
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateReply = useCallback(
    async (ratingId: string, content: string): Promise<IRating> => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/rating/admin/${ratingId}/reply`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success('Cập nhật phản hồi thành công!');
        return result.data;
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const deleteReply = useCallback(
    async (ratingId: string): Promise<IRating> => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/rating/admin/${ratingId}/reply`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success('Xóa phản hồi thành công!');
        return result.data;
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateStatus = useCallback(
    async (ratingId: string, status: RatingStatus): Promise<IRating> => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/rating/admin/${ratingId}/status`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(
          status === RatingStatus.HIDDEN
            ? 'Đã ẩn đánh giá'
            : 'Đã hiện đánh giá'
        );
        return result.data;
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    addReply,
    updateReply,
    deleteReply,
    updateStatus,
    loading,
  };
};
```

---

## 📱 Complete Page Example

### Admin Rating Management Page

```tsx
import React, { useState, useEffect } from 'react';
import { IRating, RatingStatus } from '@/types/rating';
import { AdminRatingCard } from '@/components/rating/AdminRatingCard';
import { RatingFilter } from '@/components/rating/RatingFilter';
import { useRatingManagement } from '@/hooks/useRatingManagement';
import { Loader } from 'lucide-react';

const AdminRatingManagementPage: React.FC = () => {
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const {
    addReply,
    updateReply,
    deleteReply,
    updateStatus,
  } = useRatingManagement();

  useEffect(() => {
    fetchRatings();
  }, [page, filters]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters,
      }).toString();

      const response = await fetch(
        `/api/v1/rating/admin/all?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setRatings(result.data.ratings);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ratingId: string, content: string) => {
    const updatedRating = await addReply(ratingId, content);
    setRatings((prev) =>
      prev.map((r) => (r._id === ratingId ? updatedRating : r))
    );
  };

  const handleUpdateReply = async (ratingId: string, content: string) => {
    const updatedRating = await updateReply(ratingId, content);
    setRatings((prev) =>
      prev.map((r) => (r._id === ratingId ? updatedRating : r))
    );
  };

  const handleDeleteReply = async (ratingId: string) => {
    const updatedRating = await deleteReply(ratingId);
    setRatings((prev) =>
      prev.map((r) => (r._id === ratingId ? updatedRating : r))
    );
  };

  const handleUpdateStatus = async (
    ratingId: string,
    status: RatingStatus
  ) => {
    const updatedRating = await updateStatus(ratingId, status);
    setRatings((prev) =>
      prev.map((r) => (r._id === ratingId ? updatedRating : r))
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý đánh giá</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <RatingFilter onFilterChange={setFilters} />
        </div>

        {/* Ratings List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có đánh giá nào
            </div>
          ) : (
            <>
              {ratings.map((rating) => (
                <AdminRatingCard
                  key={rating._id}
                  rating={rating}
                  onReply={handleReply}
                  onUpdateReply={handleUpdateReply}
                  onDeleteReply={handleDeleteReply}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRatingManagementPage;
```

---

## ⚠️ Error Handling

### Common Error Scenarios

```typescript
// 1. Validation Error
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "message": "Nội dung reply không được để trống",
      "path": ["content"]
    }
  ]
}

// 2. Not Found Error
{
  "success": false,
  "message": "Đánh giá không tồn tại"
}

// 3. Authorization Error
{
  "message": "Unauthorized"
}

// 4. No Reply Exists
{
  "success": false,
  "message": "Rating này chưa có reply"
}
```

### Error Handling Example

```typescript
try {
  await addReply(ratingId, content);
} catch (error: any) {
  if (error.response?.status === 401) {
    // Redirect to login
    router.push('/login');
  } else if (error.response?.status === 404) {
    toast.error('Không tìm thấy đánh giá');
  } else if (error.response?.data?.errors) {
    // Show validation errors
    error.response.data.errors.forEach((err: any) => {
      toast.error(err.message);
    });
  } else {
    toast.error('Có lỗi xảy ra, vui lòng thử lại');
  }
}
```

---

## 🧪 Testing Checklist

### User Features
- [ ] Hiển thị rating với admin reply
- [ ] Reply được format đúng (avatar, tên, thời gian)
- [ ] Chỉ hiển thị rating có status = "visible"
- [ ] Nhận notification khi admin reply

### Admin Features
- [ ] Admin có thể reply đánh giá
- [ ] Admin có thể edit reply
- [ ] Admin có thể delete reply
- [ ] Admin có thể ẩn/hiện rating
- [ ] Filter theo status hoạt động
- [ ] Filter theo rating (1-5 sao) hoạt động
- [ ] Pagination hoạt động đúng
- [ ] Loading states hiển thị đúng
- [ ] Error messages hiển thị rõ ràng

### Edge Cases
- [ ] Reply content validation (1-2000 chars)
- [ ] Status validation (chỉ "visible" hoặc "hidden")
- [ ] Unauthorized access handling
- [ ] Network error handling
- [ ] Empty states hiển thị đúng

---

## 📊 Performance Optimization

```typescript
// 1. Debounce search filter
import { debounce } from 'lodash';

const debouncedSearch = debounce((value: string) => {
  setFilters((prev) => ({ ...prev, search: value }));
}, 500);

// 2. Lazy load ratings list
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const { data, loadMore, hasMore } = useInfiniteScroll({
  fetchFn: (page) => fetchRatings(page, filters),
});

// 3. Optimistic updates
const handleUpdateStatus = async (ratingId: string, status: RatingStatus) => {
  // Update UI immediately
  setRatings((prev) =>
    prev.map((r) => (r._id === ratingId ? { ...r, status } : r))
  );

  try {
    // Make API call
    await updateStatus(ratingId, status);
  } catch (error) {
    // Revert on error
    fetchRatings();
  }
};
```

---

## 📞 Support & Questions

Nếu có bất kỳ câu hỏi nào trong quá trình implement, vui lòng liên hệ:
- Backend Team Lead
- Email: backend@example.com
- Slack: #rating-system

**Document Version:** 1.0
**Last Updated:** 2025-11-26
**Author:** Backend Team
