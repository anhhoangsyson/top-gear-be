import OrderModel from '../schema/order.schema';

export class OrderRepository {
  async create(order: any) {
    return await OrderModel.create(order);
  }

  async updateStatus(
    idOrTransId: string,
    status: string,
    app_trans_id?: string,
  ) {
    const updateData: any = { status };
    if (app_trans_id) updateData.app_trans_id = app_trans_id;
    return await OrderModel.findOneAndUpdate(
      { $or: [{ _id: idOrTransId }, { app_trans_id: idOrTransId }] },
      updateData,
      { new: true },
    );
  }

  async findByTransId(app_trans_id: string) {
    return await OrderModel.findOne({ app_trans_id });
  }
}
