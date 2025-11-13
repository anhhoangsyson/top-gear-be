import Rating, { IRating } from '../schema/rating.schema';
import mongoose from 'mongoose';

export class RatingRepository {
  async createRating(ratingData: Partial<IRating>): Promise<IRating> {
    const rating = new Rating(ratingData);
    return await rating.save();
  }

  async findRatingById(id: string): Promise<IRating | null> {
    return await Rating.findById(id)
      .populate('userId', 'fullname email avatar')
      .populate('laptopId', 'name modelName images')
      .populate('orderId', 'orderStatus totalAmount');
  }

  async findRatingByOrderAndUser(
    orderId: string,
    userId: string,
    laptopId?: string | null,
  ): Promise<IRating | null> {
    const query: any = {
      orderId: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (laptopId) {
      query.laptopId = new mongoose.Types.ObjectId(laptopId);
    } else {
      query.laptopId = null;
    }

    return await Rating.findOne(query);
  }

  async findRatingsByOrder(orderId: string): Promise<IRating[]> {
    return await Rating.find({ orderId: new mongoose.Types.ObjectId(orderId) })
      .populate('userId', 'fullname email avatar')
      .populate('laptopId', 'name modelName images')
      .sort({ createdAt: -1 });
  }

  async findRatingsByLaptop(
    laptopId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    ratings: IRating[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ laptopId: new mongoose.Types.ObjectId(laptopId) })
        .populate('userId', 'fullname email avatar')
        .populate('orderId', 'orderStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Rating.countDocuments({
        laptopId: new mongoose.Types.ObjectId(laptopId),
      }),
    ]);

    return {
      ratings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRatingsByUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    ratings: IRating[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('orderId', 'orderStatus totalAmount')
        .populate('laptopId', 'name modelName images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Rating.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      ratings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateRating(
    id: string,
    updateData: Partial<IRating>,
  ): Promise<IRating | null> {
    return await Rating.findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'fullname email avatar')
      .populate('laptopId', 'name modelName images')
      .populate('orderId', 'orderStatus');
  }

  async deleteRating(id: string): Promise<boolean> {
    const result = await Rating.findByIdAndDelete(id);
    return !!result;
  }

  async getLaptopRatingStats(laptopId: string): Promise<{
    average: number;
    count: number;
    distribution: { rating: number; count: number }[];
  }> {
    const stats = await Rating.aggregate([
      { $match: { laptopId: new mongoose.Types.ObjectId(laptopId) } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
          distribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: [],
      };
    }

    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: stats[0].distribution.filter((r: number) => r === rating).length,
    }));

    return {
      average: Math.round(stats[0].average * 10) / 10, // Round to 1 decimal
      count: stats[0].count,
      distribution,
    };
  }

  // Admin methods
  async findAllRatings(
    filters: {
      orderId?: string;
      userId?: string;
      laptopId?: string;
      rating?: number;
      search?: string;
    },
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    ratings: IRating[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.orderId) {
      query.orderId = new mongoose.Types.ObjectId(filters.orderId);
    }

    if (filters.userId) {
      query.userId = new mongoose.Types.ObjectId(filters.userId);
    }

    if (filters.laptopId) {
      query.laptopId = new mongoose.Types.ObjectId(filters.laptopId);
    }

    if (filters.rating) {
      query.rating = filters.rating;
    }

    if (filters.search) {
      query.$or = [{ comment: { $regex: filters.search, $options: 'i' } }];
    }

    const [ratings, total] = await Promise.all([
      Rating.find(query)
        .populate('userId', 'fullname email avatar')
        .populate('laptopId', 'name modelName images')
        .populate('orderId', 'orderStatus totalAmount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Rating.countDocuments(query),
    ]);

    return {
      ratings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOverallStats(): Promise<{
    totalRatings: number;
    averageRating: number;
    distribution: { rating: number; count: number }[];
    ratingsByMonth: { month: string; count: number }[];
    topRatedLaptops: { laptopId: string; average: number; count: number }[];
  }> {
    const [
      totalRatings,
      averageRating,
      distributionData,
      monthlyData,
      topLaptops,
    ] = await Promise.all([
      Rating.countDocuments(),
      Rating.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' },
          },
        },
      ]),
      Rating.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Rating.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
      Rating.aggregate([
        {
          $match: { laptopId: { $ne: null } },
        },
        {
          $group: {
            _id: '$laptopId',
            average: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
        { $sort: { average: -1, count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const distribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = distributionData.find((d: any) => d._id === rating);
      return {
        rating,
        count: found ? found.count : 0,
      };
    });

    const ratingsByMonth = monthlyData.map((item: any) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      count: item.count,
    }));

    const topRatedLaptops = topLaptops.map((item: any) => ({
      laptopId: item._id.toString(),
      average: Math.round(item.average * 10) / 10,
      count: item.count,
    }));

    return {
      totalRatings,
      averageRating:
        averageRating.length > 0
          ? Math.round(averageRating[0].average * 10) / 10
          : 0,
      distribution,
      ratingsByMonth,
      topRatedLaptops,
    };
  }
}
