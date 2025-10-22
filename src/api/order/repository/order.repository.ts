import Order, {
  OrderStatus,
  IOrder,
  IOrderWithCustomer,
} from '../schema/order.schema';
import OrderDetail, {
  IOrderDetail,
  IOrderDetailResponse,
} from '../../orderDetail/schema/orderDetail.schema';
import { Users } from '../../users/schema/user.schema';
import { IUser } from '../../users/dto/users.dto';
import mongoose, { PipelineStage } from 'mongoose';

export class OrderRepository {
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
  }

  async createOrderDetail(
    orderDetailData: IOrderDetail[],
  ): Promise<IOrderDetailResponse[]> {
    return await OrderDetail.insertMany(orderDetailData);
  }

  async findOrderById(orderId: string): Promise<IOrderWithCustomer | null> {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      {
        $addFields: {
          customerId: {
            $cond: [
              { $eq: [{ $type: '$customerId' }, 'string'] },
              { $toObjectId: '$customerId' },
              '$customerId',
            ],
          },
        },
      },
      // Join orderdetails
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetails',
        },
      },
      // Join laptops
      {
        $lookup: {
          from: 'laptops',
          localField: 'orderDetails.laptopId',
          foreignField: '_id',
          as: 'laptopDetails',
        },
      },
      // Join users
      {
        $lookup: {
          from: 'users',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          customerId: 1,
          totalAmount: 1,
          orderStatus: 1,
          address: 1,
          discountAmount: 1,
          voucherId: 1,
          paymentMethod: 1,
          note: 1,
          createAt: 1,
          customer: {
            fullname: '$customer.fullname',
            phone: '$customer.phone',
            email: '$customer.email',
            address: '$customer.address',
          },
          orderDetails: {
            $map: {
              input: '$orderDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                laptopId: '$$detail.laptopId',
                quantity: '$$detail.quantity',
                price: '$$detail.price',
                subTotal: '$$detail.subTotal',
                name: {
                  $let: {
                    vars: {
                      laptop: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$laptopDetails',
                              as: 'l',
                              cond: { $eq: ['$$l._id', '$$detail.laptopId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: '$$laptop.name',
                  },
                },
                slug: {
                  $let: {
                    vars: {
                      laptop: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$laptopDetails',
                              as: 'l',
                              cond: { $eq: ['$$l._id', '$$detail.laptopId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: '$$laptop.slug',
                  },
                },
                images: {
                  $filter: {
                    input: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: '$laptopDetails',
                                as: 'l',
                                cond: { $eq: ['$$l._id', '$$detail.laptopId'] },
                              },
                            },
                            as: 'laptop',
                            in: '$$laptop.images',
                          },
                        },
                        0,
                      ],
                    },
                    as: 'img',
                    cond: { $eq: ['$$img.isPrimary', true] },
                  },
                },
              },
            },
          },
        },
      },
    ];

    const [order] = await Order.aggregate(pipeline);
    if (!order) return null;

    // Lấy thông tin user như cũ nếu cần
    return order as unknown as IOrderWithCustomer;
  }

  async updateStatus(
    idOrTransId: string,
    status: OrderStatus,
    transactionId?: string,
    paymentUrl?: string,
  ): Promise<IOrder | null> {
    const updateData: any = { orderStatus: status };
    if (transactionId) updateData.paymentTransactionId = transactionId;
    if (paymentUrl) updateData.paymentUrl = paymentUrl;

    // Nếu có transactionId (khi tạo đơn hàng), tìm bằng _id
    if (transactionId || paymentUrl) {
      return await Order.findOneAndUpdate(
        { _id: idOrTransId }, // Tìm bằng _id khi tạo đơn hàng
        updateData,
        { new: true },
      );
    }

    // Nếu không có transactionId hoặc paymentUrl (khi xử lý callback), tìm bằng paymentTransactionId
    return await Order.findOneAndUpdate(
      { paymentTransactionId: idOrTransId }, // Tìm bằng paymentTransactionId khi callback
      updateData,
      { new: true },
    );
  }

  async getMyOrders(customerId: string) {
    return await Order.find({ customerId: customerId });
  }

  async cancelingOrder(id: string) {
    const order = await Order.findById(id);

    if (order?.orderStatus === OrderStatus.COMPLETED) {
      return {
        message: 'Đơn hàng đã hoàn thành, không thể hủy',
      };
    }

    return await Order.findByIdAndUpdate(
      id,
      { orderStatus: OrderStatus.PAYMENT_CANCELING },
      { new: true },
    );
  }

  async changeOrderStatus(status: string, id: string) {
    return await Order.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        orderStatus: status,
      },
      {
        new: true,
      },
    );
  }

  async canceledOrder(id: string) {
    const order = await Order.findById(id);
    if (order?.orderStatus === OrderStatus.PAYMENT_CANCELING) {
      return await Order.findByIdAndUpdate(
        id,
        { orderStatus: OrderStatus.CANCELLED },
        { new: true },
      );
    }
  }

  async compeleteOrder(id: string) {
    const order = await Order.findById(id);

    if (order?.orderStatus === OrderStatus.PAYMENT_SUCCESS) {
      return await Order.findByIdAndUpdate(
        id,
        { orderStatus: OrderStatus.COMPLETED },
        { new: true },
      );
    } else {
      return {
        message: 'Đơn hàng chưa thanh toán thành công',
      };
    }
  }

  // async getAllOrders() {
  //   const pipeline: PipelineStage[] = [
  //     // Chuyển đổi customerId từ string sang ObjectId nếu hợp lệ
  //     {
  //       $addFields: {
  //         customerId: {
  //           $cond: {
  //             if: {
  //               $regexMatch: {
  //                 input: '$customerId',
  //                 regex: /^[a-fA-F0-9]{24}$/,
  //               },
  //             }, // Kiểm tra hợp lệ
  //             then: { $toObjectId: '$customerId' }, // Chuyển đổi nếu hợp lệ
  //             else: null, // Gán null nếu không hợp lệ
  //           },
  //         },
  //       },
  //     },
  //     // Nối với collection orderdetails
  //     {
  //       $lookup: {
  //         from: 'orderdetails',
  //         localField: 'orderDetails',
  //         foreignField: '_id',
  //         as: 'orderDetails',
  //       },
  //     },
  //     // Nối với collection users
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'customerId',
  //         foreignField: '_id',
  //         as: 'customer',
  //       },
  //     },
  //     // Giải nén mảng customer thành object
  //     {
  //       $unwind: {
  //         path: '$customer',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     // Chỉ giữ các trường cần thiết
  //     {
  //       $project: {
  //         customerId: 1,
  //         totalAmount: 1,
  //         orderStatus: 1,
  //         address: 1,
  //         discountAmount: 1,
  //         voucherId: 1,
  //         paymentMethod: 1,
  //         note: 1,
  //         createdAt: 1,
  //         'customer.fullname': 1,
  //         'customer.phone': 1,
  //         orderDetails: {
  //           $map: {
  //             input: '$orderDetails',
  //             as: 'detail',
  //             in: {
  //               _id: '$$detail._id',
  //               productVariantId: '$$detail.productVariantId',
  //               quantity: '$$detail.quantity',
  //               price: '$$detail.price',
  //               subTotal: '$$detail.subTotal',
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ];

  //   return await Order.aggregate(pipeline);
  // }

  async getAllOrders() {
    const pipeline: mongoose.PipelineStage[] = [
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetails',
        },
      },
      {
        $lookup: {
          from: 'laptops',
          localField: 'orderDetails.laptopId',
          foreignField: '_id',
          as: 'laptopDetails',
        },
      },
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
        $project: {
          _id: 1,
          customerId: 1,
          totalAmount: 1,
          orderStatus: 1,
          address: 1,
          discountAmount: 1,
          voucherId: 1,
          paymentMethod: 1,
          note: 1,
          createdAt: 1,
          orderDetails: {
            $map: {
              input: '$orderDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                laptopId: '$$detail.laptopId',
                quantity: '$$detail.quantity',
                price: '$$detail.price',
                subTotal: '$$detail.subTotal',
                images: {
                  $let: {
                    vars: {
                      laptop: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$laptopDetails',
                              as: 'l',
                              cond: { $eq: ['$$l._id', '$$detail.laptopId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      $filter: {
                        input: '$$laptop.images',
                        as: 'img',
                        cond: { $eq: ['$$img.isPrimary', true] },
                      },
                    },
                  },
                },
              },
            },
          },
          user: {
            fullname: '$user.fullname',
            phone: '$user.phone',
            email: '$user.email',
          },
        },
      },
    ];

    return await Order.aggregate(pipeline);
  }

  async getOrderDetailById(orderId: string) {
    const pipeline: mongoose.PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetails',
        },
      },
      {
        $lookup: {
          from: 'laptops',
          localField: 'orderDetails.laptopId',
          foreignField: '_id',
          as: 'laptopDetails',
        },
      },
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
        $project: {
          _id: 1,
          customerId: 1,
          totalAmount: 1,
          orderStatus: 1,
          address: 1,
          discountAmount: 1,
          voucherId: 1,
          paymentMethod: 1,
          note: 1,
          createdAt: 1,
          orderDetails: {
            $map: {
              input: '$orderDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                laptopId: '$$detail.laptopId',
                quantity: '$$detail.quantity',
                price: '$$detail.price',
                subTotal: '$$detail.subTotal',
                images: {
                  $let: {
                    vars: {
                      laptop: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$laptopDetails',
                              as: 'l',
                              cond: { $eq: ['$$l._id', '$$detail.laptopId'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      $filter: {
                        input: '$$laptop.images',
                        as: 'img',
                        cond: { $eq: ['$$img.isPrimary', true] },
                      },
                    },
                  },
                },
              },
            },
          },
          user: {
            fullname: '$user.fullname',
            phone: '$user.phone',
            email: '$user.email',
          },
        },
      },
    ];

    const [order] = await Order.aggregate(pipeline);
    return order;
  }
}
