'use strict'

const Product = use('App/Models/Product')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    response,
    view
  }) {
    const {
      page,
      category_id
    } = request.get()

    const products = (category_id) ?
      await Product.query().where({category_id}).with('user').with('category').with('file').paginate(page) :
      await Product.query().with('user').with('category').with('file').paginate(page)

    return products
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response,
    auth
  }) {
    const data = request.only(['category_id', 'file_id', 'title', 'description', 'price', 'status'])

    const product = await Product.create({
      ...data,
      user_id: auth.user.id
    })

    await product.load('category')
    await product.load('file')

    return product
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    request,
    response,
    view
  }) {
    const product = await Product.findOrFail(params.id)

    await product.load('user')
    await product.load('category')
    await product.load('file')

    return product
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response
  }) {
    const product = await Product.findOrFail(params.id)
    const data = request.only(['category_id', 'file_id', 'title', 'description', 'price', 'status'])

    product.merge(data)

    await product.load('category')
    await product.load('file')
    await product.save()

    return product
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    request,
    response
  }) {
    const product = await Product.findOrFail(params.id)

    await product.delete()

    return product
  }
}

module.exports = ProductController
