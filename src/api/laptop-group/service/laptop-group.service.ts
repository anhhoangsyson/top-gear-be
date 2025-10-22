import { LaptopGroupRepository } from '../repository/laptop-group.repository';

export class LaptopGroupService {
  private repo = new LaptopGroupRepository();

  create(data: any) {
    return this.repo.create(data);
  }

  getAll() {
    return this.repo.findAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
