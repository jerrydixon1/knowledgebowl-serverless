'use strict';

const Bookshelf = require('bookshelf-instance');
const Category  = require('models/category');
const Question  = require('models/question');

class CategoryController {

  /**
   * List the categories
   * @param request The express request
   * @param response The express response
   * @return {Promise.<void>} Http response
   */
  static async list(request, response) {
    try {
      let categories = await new Category().orderBy('category').fetchAll();
      response.json(categories);
    } catch (err) {
      console.error('Error occurred while listing categories: ', err);
      response.boom.internal(err);
    }
  }

  /**
   * Create a new category
   * @param request
   * @param response
   * @return {Promise.<void>}
   */
  static async create(request, response) {
    try {
      const newCategory = await new Category(request.body).save()
      response.json(newCategory);
    } catch(err) {
      console.log('Error occurred while creating category: ', err);
      response.boom.internal(err);
    }
  }

  /**
   * Edit an existing category
   * @param {Object}   request The express request object
   * @param {Category} request.pre.category The existing category, queried via middleware
   * @param {Object}   response The express response object
   * @return {*} The http response
   */
  static async edit(request, response) {
    try {
      let category = await Category.where({id: request.body.id}).fetch();
      category.set('category', request.body.category);
      response.json(await category.save());
    } catch(err) {
      console.log('Error occurred while editing category: ', err);
      response.boom.internal(err);
    }
  }

  /**
   * Delete a category and all related questions
   * @param {Object}   request The express request object
   * @param {Category} request.pre.category The category to delete, retrieved by middleware
   * @param {Object}   response The express response object
   * @return {*} The http response
   */
  static deleteCategory(request, response) {

    Bookshelf.transaction(async transaction => {
      try {
        let category = request.pre.category;
        let relatedQuestions = await Question.where({category_id: category.get('id')}).fetchAll();

        // Loop through all questions and delete them
        for(let question of relatedQuestions.models) {
          await question.destroy({transacting: transaction});
        }

        // Delete the category
        let destroyedCategory = await category.destroy({transacting: transaction});

        // Commit the transaction
        transaction.commit();
        response.json(destroyedCategory);
      } catch(err) {
        // Rollback the transaction
        transaction.rollback();
        console.log(`Error occurred while deleting category ${request.params.categoryId}: `, err);
        response.boom.internal(err);
      }
    });

  }
}

module.exports = CategoryController;