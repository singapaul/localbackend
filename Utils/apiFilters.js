class APIFilters {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //   lets you query a parameter e.g. the title or the location e.t.c
  //  {{Domain}}/api/v1/jobs?title=reac
  // {{Domain}}/api/v1/jobs?company=Srat Tech
  filter() {
    const queryCopy = { ...this.queryString };

    // Removing fields from the query
    const removeFields = ["sort", "fields", "q", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Advance filter using: <, <=, >, >=
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  //   {{Domain}}/api/v1/jobs?sort=salary or -salary or {{Domain}}/api/v1/jobs?salary[gt]=1000
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-postingDate");
    }

    return this;
  }
  //   {{Domain}}/api/v1/jobs?fields=title or -title
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  //   {{Domain}}/api/v1/jobs?q=reac
  searchByQuery() {
    if (this.queryString.q) {
      const qu = this.queryString.q.split("-").join(" ");
      this.query = this.query.find({ $text: { $search: '"' + qu + '"' } });
    }

    return this;
  }

  //   {{Domain}}/api/v1/jobs?limit=10&page=2
  // {{Domain}}/api/v1/jobs?limit=5
  pagination() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skipResults = (page - 1) * limit;

    this.query = this.query.skip(skipResults).limit(limit);

    return this;
  }
}

module.exports = APIFilters;
