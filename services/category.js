'use strict';

const Category = require('models/category');

class CategoryService {

  /**
   * Get a category by ID
   * @param id      The category ID
   * @param options The query options
   * @return {Category} The category
   */
  static async getById(id, options = {}) {
    return await Category.where({id: id}).fetch(options)
  }

  /**
   * Find a category by name
   * @param category The category to search by
   * @param options The query options
   * @return {Category} The category
   */
  static async findByCategory(category, options = {}) {
    return await Category.query(qb => {
      qb.where('category', 'ilike', category);
    }).fetch();
  }

}

module.exports = CategoryService;