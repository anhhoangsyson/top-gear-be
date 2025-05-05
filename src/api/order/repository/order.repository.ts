import Order, {
  OrderStatus,
  IOrder,
  IOrderWithCustomer,
} from '../schema/order.schema';
import OrderDetail, {
  IOrderDetail,
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
  ): Promise<IOrderDetail[]> {
    return await OrderDetail.insertMany(orderDetailData);
  }

  async findOrderById(orderId: string): Promise<IOrderWithCustomer | null> {
    const pipeline: PipelineStage[] = [
      // Lọc Order theo _id
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      // Nối với collection orderdetails
      {
        $lookup: {
          from: 'orderdetails', // Tên collection trong MongoDB
          localField: 'orderDetails', // Trường trong Order chứa _id của OrderDetail
          foreignField: '_id', // Trường _id trong OrderDetail
          as: 'orderDetails', // Tên mảng chứa kết quả
        },
      },
      // Chỉ giữ các trường cần thiết trong orderDetails
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
          orderDetails: {
            $map: {
              input: '$orderDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                productVariantId: '$$detail.productVariantId',
                quantity: '$$detail.quantity',
                price: '$$detail.price',
                subTotal: '$$detail.subTotal',
              },
            },
          },
        },
      },
    ];

    // Thực hiện aggregation
    const [order] = await Order.aggregate(pipeline);
    // console.log('Aggregated Order:', order);

    if (!order) return null;

    const user = await Users.findOne({ _id: order.customerId })
      .select('fullname email phone address')
      .lean();
    if (!user) return null;

    const customer: Omit<
      IUser,
      | 'password'
      | 'role'
      | 'avatar'
      | '_id'
      | 'createAt'
      | 'updateAt'
      | 'usersname'
      | 'sex'
    > = {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
    return { ...order, customer } as unknown as IOrderWithCustomer;
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

  async getAllOrders() {
    const pipeline: PipelineStage[] = [
      // Chuyển đổi customerId từ string sang ObjectId nếu hợp lệ
      {
        $addFields: {
          customerId: {
            $cond: {
              if: {
                $regexMatch: {
                  input: '$customerId',
                  regex: /^[a-fA-F0-9]{24}$/,
                },
              }, // Kiểm tra hợp lệ
              then: { $toObjectId: '$customerId' }, // Chuyển đổi nếu hợp lệ
              else: null, // Gán null nếu không hợp lệ
            },
          },
        },
      },
      // Nối với collection orderdetails
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetails',
        },
      },
      // Nối với collection users
      {
        $lookup: {
          from: 'users',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      // Giải nén mảng customer thành object
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Chỉ giữ các trường cần thiết
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
          'customer.fullname': 1,
          'customer.phone': 1,
          orderDetails: {
            $map: {
              input: '$orderDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                productVariantId: '$$detail.productVariantId',
                quantity: '$$detail.quantity',
                price: '$$detail.price',
                subTotal: '$$detail.subTotal',
              },
            },
          },
        },
      },
    ];

    return await Order.aggregate(pipeline);
  }
}
