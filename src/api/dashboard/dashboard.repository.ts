import Laptop from '../laptop/schema/laptop.schema';
import orderSchema, { OrderStatus } from '../order/schema/order.schema';
import { Users } from '../users/schema/user.schema';

export const getDashboardSummaryRepo = async (from: Date, to: Date) => {
  to.setDate(to.getDate() + 1);
  // console.log('from:', from, 'to:', to);
  // Tổng đơn hàng và doanh thu
  const orderAgg = await orderSchema
    .aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
          orderStatus: 'completed',
          // "completed" // hoặc "completed" nếu trong DB lưu chữ thường
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ])
    .exec();

  // console.log('orderAgg:', orderAgg);
  const orderResult = orderAgg.length > 0 ? orderAgg[0] : null;
  // console.log("Order Aggregation Result:", orderResult);
  const totalOrders = orderAgg[0]?.totalOrders || 0;
  const totalRevenue = orderAgg[0]?.totalRevenue || 0;

  // Tổng user
  const totalUsers = await Users.countDocuments({
    createdAt: { $gte: from, $lte: to },
  });

  // Sản phẩm bán chạy & doanh thu cao nhất
  const bestSellersAgg = await orderSchema.aggregate([
    {
      $match: { createdAt: { $gte: from, $lte: to }, orderStatus: 'completed' },
    },
    // Join sang orderdetails
    {
      $lookup: {
        from: 'orderdetails',
        localField: 'orderDetails',
        foreignField: '_id',
        as: 'orderDetailsData',
      },
    },
    { $unwind: '$orderDetailsData' },
    {
      $group: {
        _id: '$orderDetailsData.laptopId', // hoặc productId nếu là sản phẩm khác
        sold: { $sum: '$orderDetailsData.quantity' },
        revenue: { $sum: '$orderDetailsData.subTotal' },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  const bestSellerIds = bestSellersAgg.map((item) => item._id);
  const bestSellerLaptops = await Laptop.find({ _id: { $in: bestSellerIds } });
  const bestSellers = bestSellersAgg.map((item) => ({
    productId: item._id,
    name:
      bestSellerLaptops.find((l) => l._id.equals(item._id))?.name || 'Unknown',
    sold: item.sold,
  }));

  // Sản phẩm doanh thu cao nhất
  const topRevenueAgg = [...bestSellersAgg].sort(
    (a, b) => b.revenue - a.revenue,
  );
  const topRevenueProduct = topRevenueAgg[0]
    ? {
        productId: topRevenueAgg[0]._id,
        name:
          bestSellerLaptops.find((l) => l._id.equals(topRevenueAgg[0]._id))
            ?.name || 'Unknown',
        revenue: topRevenueAgg[0].revenue,
      }
    : null;

  // Tính tăng trưởng so với tháng trước
  const lastMonthFrom = new Date(from);
  lastMonthFrom.setMonth(lastMonthFrom.getMonth() - 1);
  const lastMonthTo = new Date(to);
  lastMonthTo.setMonth(lastMonthTo.getMonth() - 1);

  const lastMonthAgg = await orderSchema.aggregate([
    {
      $match: {
        createdAt: { $gte: lastMonthFrom, $lte: lastMonthTo },
        orderStatus: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ]);
  const lastMonthOrders = lastMonthAgg[0]?.totalOrders || 0;
  const lastMonthRevenue = lastMonthAgg[0]?.totalRevenue || 0;

  const growth = {
    orders:
      lastMonthOrders === 0
        ? totalOrders > 0
          ? null
          : 0 // null: tăng trưởng vô hạn (từ 0 lên >0), 0: không tăng
        : ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100, // trả về phần trăm
    revenue:
      lastMonthRevenue === 0
        ? totalRevenue > 0
          ? null
          : 0
        : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
  };

  // 5 đon hàn gần nhất:
  const recentOrders = await orderSchema.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    {
      $addFields: {
        customerIdObj: {
          $cond: [
            { $eq: [{ $type: '$customerId' }, 'string'] },
            { $toObjectId: '$customerId' },
            '$customerId',
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'customerIdObj',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'orderdetails',
        localField: 'orderDetails',
        foreignField: '_id',
        as: 'orderDetailsData',
      },
    },
    {
      $project: {
        _id: 1,
        user: { fullname: '$user.fullname', email: '$user.email' },
        products: '$orderDetailsData.laptopId',
        orderStatus: 1,
        createdAt: 1,
        totalAmount: 1,
      },
    },
  ]);

  // doanh số từng tháng
  const monthlySales = await orderSchema.aggregate([
    {
      $match: {
        orderStatus: 'completed',
      },
    },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  const now = new Date();
  const year = now.getFullYear();
  const monthlySalesFull = Array.from({ length: 12 }, (_, i) => {
    const found = monthlySales.find(
      (m) => m._id.year === year && m._id.month === i + 1,
    );
    return {
      year,
      month: i + 1,
      totalOrders: found ? found.totalOrders : 0,
      totalRevenue: found ? found.totalRevenue : 0,
    };
  });

  const lastMonthUsers = await Users.countDocuments({
    createdAt: { $gte: lastMonthFrom, $lte: lastMonthTo },
  });
  const growthUsers =
    lastMonthUsers === 0
      ? totalUsers > 0
        ? null
        : 0
      : (totalUsers - lastMonthUsers) / lastMonthUsers;

  return {
    totalOrders,
    totalRevenue,
    totalUsers,
    bestSellers,
    topRevenueProduct,
    growth: {
      ...growth,
      users: growthUsers,
    },
    recentOrders,
    monthlySales,
    monthlySalesFull,
  };
};
