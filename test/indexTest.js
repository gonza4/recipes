const sinon = require("sinon");
const mockData = require("./mockData");
const chai = require("chai");
const should = chai.should();
const request = require("request");

const options = {
  json: true,
  url: "http://localhost:5000/api/recipe"
};

describe("testing recipe creation", () => {
  beforeEach(() => {
    this.post = sinon.stub(request, "post");
  });

  afterEach(() => {
    request.post.restore();
  });

  describe("create a recipe should PASS", () => {
    it("create a recipe OK", done => {
      this.post.yields(null, mockData.recipeOK.res, mockData.recipeOK.body);
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(200);
        done();
      });
    });
    it("create a recipe without nutritional info OK", done => {
      this.post.yields(
        null,
        mockData.recipeWithourNutInfo.res,
        mockData.recipeWithourNutInfo.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(200);
        done();
      });
    });
  });
  describe("create a recipe should NOT PASS", () => {
    it("create a recipe without title FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutTitle.res,
        mockData.recipeWithoutTitle.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe without calories FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutCalories.res,
        mockData.recipeWithoutCalories.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe without category FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutCategory.res,
        mockData.recipeWithoutCategory.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe without ingredients FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutIngredients.res,
        mockData.recipeWithoutIngredients.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe without procedure FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutUrlOrProcedure.res,
        mockData.recipeWithoutUrlOrProcedure.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe without yields FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithoutYields.res,
        mockData.recipeWithoutYields.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe with wrong ingredient format FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWrongIngFormat.res,
        mockData.recipeWrongIngFormat.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe with wrong diet format FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWrongDietCatFormat.res,
        mockData.recipeWrongDietCatFormat.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe with wrong health format FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWrongHealthCatFormat.res,
        mockData.recipeWrongHealthCatFormat.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it("create a recipe with wrong category format FAIL", done => {
      this.post.yields(
        null,
        mockData.recipeWithWrongCategory.res,
        mockData.recipeWithWrongCategory.body
      );
      request.post(options, (err, res, body) => {
        res.statusCode.should.equal(404);
        done();
      });
    });
  });
});
