// // User related interfaces
// export interface User {
//     userId: string
//     userName: string
//     firstName: string
//     email: string
//     password: string
//     phone: string
//     sex: boolean
//     birth: Date
//     role: string
//   }

//   export interface Location {
//     locationId: string
//     userId: string
//     district: string
//     province: string
//     latitude: number
//     longitude: number
//   }

//   // Product related interfaces
//   export interface Product {
//     productId: string
//     categoryId: string
//     productName: string
//   }

//   export interface Category {
//     categoryId: string
//     categoryName: string
//     parentCategoryId?: string // Optional for root categories
//   }

//   // export interface ProductVariant {
//   //   productVariantId: string
//   //   productId: string
//   //   productVariantName: string
//   //   price: number
//   //   quantity: number
//   // }

//   export interface ProductImage {
//     imageId: string
//     productVariantId: string
//     imageUrl: string
//   }

//   export interface Attribute {
//     attributeId: string
//     attributeName: string
//   }

//   export interface ProductAttribute {
//     productAttributeId: string
//     productVariantId: string
//     attributeId: string
//   }

//   export interface CategoryAttribute {
//     categoryAttributeId: string
//     categoryId: string
//     attributeId: string
//   }

//   // Order related interfaces
//   export interface Order {
//     orderId: string
//     userId: string
//     voucherId?: string
//     totalAmount: number
//     orderStatus: OrderStatus
//     address: string
//     createdAt: Date
//     discountAmount: number
//     paymentMethod: string
//   }

//   export interface OrderDetail {
//     orderDetailId: string
//     productVariantId: string
//     orderId: string
//     quantity: number
//     price: number
//   }

//   // Voucher interface
//   export interface Voucher {
//     voucherId: string
//     voucherCode: string
//     voucherName: string
//     discountAmount: number
//     discountPercent: number
//     minOrderAmount: number
//     maxDiscount: number
//     startDate: Date
//     endDate: Date
//     usageLimit: number
//     usedCount: number
//     isActive: boolean
//   }

//   // Enums
//   export enum OrderStatus {
//     PENDING = "pending",
//     PROCESSING = "processing",
//     SHIPPED = "shipped",
//     DELIVERED = "delivered",
//     CANCELLED = "cancelled",
//   }
