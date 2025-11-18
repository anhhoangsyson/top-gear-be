import { IMenu, createMenu } from '../dto/menus.dto';
import { Menus } from '../schema/menu.schema';

export class MenusRepository {
  async getAllMenus(): Promise<IMenu[]> {
    return await Menus.find().populate('categories_id');
  }
  async createMenu(menuData: Partial<createMenu>): Promise<IMenu> {
    const Menu = new Menus(menuData);
    return await Menu.save();
  }
  async getMenuById(id: string): Promise<IMenu | null> {
    return await Menus.findById(id);
  }
  async deleteMenusById(id: string): Promise<IMenu | null> {
    return await Menus.findByIdAndDelete(id);
  }
  async updateMenuById(
    id: string,
    dataMenus: Partial<IMenu>,
  ): Promise<IMenu | null> {
    return await Menus.findByIdAndUpdate(id, dataMenus, { new: true });
  }
}
