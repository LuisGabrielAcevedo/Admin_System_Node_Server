function seachFieldsData(route) {
  return searchBy[route]();
}

const searchBy = {
  users: () => ["email", "lastName", "firstName"],
  stores: () => ["name"],
  roles: () => ["name"],
  permissions: () => ["name", "description", "module"],
  customers: () => ["email", "firstName", "lastName", "phone"],
  countries: () => ["name", "nameInitials"],
  companies: () => ["name"],
  applications: () => ["name", "code", "description"],
  follows: () => [],
  vendors: () => ["name"],
  brands: () => ["name"],
  productcategories: () => ["name"],
  producttypes: () => ["name"],
  rooms: () => ["name"],
  products: () => ["name"]
};

module.exports = {
  seachFieldsData
};
