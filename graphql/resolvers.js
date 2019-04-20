const mongoose = require('mongoose');
const Admin = require('../models/admin');
const Country = require('../models/country');
const Company = require('../models/company');
const Rol = require('../models/rol');
const User = require('../models/user');

export const resolvers = {
	Query: {
		getAdmins: (root, { input }) => {
			return new Promise((resolve, reject) => {
				// 1. Validar sort
				const sort = input.sort ? input.sort : '';
				// 2. Validar pagina
				const page = input.page ? input.page : 1;
				// 3. Validar items por pagina
				const itemsPerPage = input.itemsPerPage ? input.itemsPerPage : 10;
				Admin.find({}).sort(sort).paginate(page, itemsPerPage, (err, dataBaseResp, totalItems) => {
					if (err) reject(err);
					else
						resolve({
							totalItems: totalItems,
							totalPages: Math.ceil(totalItems / itemsPerPage),
							currentPage: page,
							itemsPerPage: itemsPerPage,
							data: dataBaseResp
						});
				});
			});
		},
		getCountries: () => {
			return Country.find({});
		},
		getCompanies: () => {
			return Company.find({}).populate('country admin');
		},
		getRoles: () => {
			return Rol.find({}).populate('company');
		},
		getUsers: () => {
			return User.find({}).populate([
				{
					path: 'company',
					populate: { path: 'country' }
				},
                {   path: 'rol'  }
			]);
		}
	}
};
