class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // destruture the query
    // array of excluded fields
    const excludedFields = ["page", "sort", "limit", "fields"];
    // dont want new array so, use foreach
    // delete all the occurence of the excluded from the
    // destructured query
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B. Advanced Filtering
    // make the destructured query a string
    let queryStr = JSON.stringify(queryObj);
    // then replace the string values
    // change gte === $gte
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    // then parse it --- change it into an object again
    // let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort;
    if (sortBy) {
      this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // only gets properties that are in the field
      // tours?fields=name,duration,price
      // gets only name, duration, price
      const fields = this.queryString.fields.split(",").join(" "); // Join for multiple fields
      this.query = this.query.select(fields);
    } else {
      // gets all the properties except __v
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  async queryResults() {
    try {
      const results = await this.query;
      return results;
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching data");
    }
  }
}
export default APIFeatures;
