import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrCreate(title: string): Promise<Category> {
    const findCategory = await this.findOne({
      where: { title },
    });

    if (!findCategory) {
      const newCategory = this.create({ title });

      return this.save(newCategory);
    }

    return findCategory;
  }
}

export default CategoriesRepository;
