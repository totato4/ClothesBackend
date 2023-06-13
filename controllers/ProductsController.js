import Products from "../models/Products.js";
import ProductsModel from "../models/Products.js";

export const getOneProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    let doc = await ProductsModel.findOne({ id: productId });
    if (!doc) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товар, запрос не отправлен",
    });
  }
};

export const getProducts = async (req, res, next) => {
  try {
    let query = req.query;
    let discount = req.query.discount;
    let count;
    let products;

    let { page = 1, limit = 12 } = query;
    let search = false;
    page = Number(page);
    limit = Number(limit);

    if (query.title) {
      const firstUpperCase =
        query.title.charAt(0).toUpperCase() + query.title.slice(1);
      search = firstUpperCase;
      delete query.title;
    }
    delete req.query.discount;
    delete query.page;
    delete query.limit;
    if (discount === "discount") {
      req.query.discount = { $gt: 1, $lt: 20 };
    }
    if (search.length > 0) {
      req.query.$and = [{ title: { $regex: search } }];
    }

    products = await ProductsModel.find({ ...query })
      .limit(limit * 1)
      .skip(page > 0 ? (page - 1) * limit : 0);
    count = await ProductsModel.countDocuments({ ...query });

    return res.status(200).json({
      products,
      limit: limit,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: page,
      query: { search: search, query: req.query.discountStart },
    });
  } catch (err) {
    next(err);
  }
};
