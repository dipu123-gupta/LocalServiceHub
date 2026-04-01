/**
 * Reusable utility for handling Mongoose advanced query features
 * like Pagination, Sorting, Filtering, and Field Limiting.
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "page", 
      "sort", 
      "limit", 
      "fields", 
      "search", 
      "city", 
      "lat", 
      "lng", 
      "minPrice", 
      "maxPrice", 
      "rating"
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering (greater than, less than, etc)
    // Example: { price: { gte: '500' } } -> { price: { $gte: '500' } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sorting by newest
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
