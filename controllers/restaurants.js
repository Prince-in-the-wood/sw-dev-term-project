const Restaurant = require("../models/Restaurant");

exports.getRestaurants = async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Restaurant.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Restaurant.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const restaurants = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: restaurants.length,
      pagination,
      data: restaurants,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Error occurred during get restaurants" });
  }
};

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).json({
        success: false,
        msg: `No reservation with the id of ${req.params.id}`,
      });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Error occurred during get a restaurants" });
  }
};

exports.createRestaurant = async (req, res, next) => {
  if (req.body.maxCapacity < 1) {
    return res.status(400).json({
      success: false,
      message: `The user with ID ${req.user.id} cannot create a restaurant with non-positive number of tables`,
    });
  }
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({ success: true, data: restaurant });
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    if (req.body.maxCapacity < 1) {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} cannot update a restaurant with non-positive number of tables`,
      });
    }
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!restaurant) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Restaurant not found with id of ${req.params.id}`,
      });
    }
    await restaurant.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
