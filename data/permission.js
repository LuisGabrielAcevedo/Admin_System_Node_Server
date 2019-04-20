const permissionData = [
    {
        module: 'administration',
        actionType: 'first_action',
        permissions: [
            'post_admins',
            'put_admins',
            'get_admins',
            'delete_admins',
            'post_users',
            'put_users',
            'get_users',
            'delete_users',
            'post_countries',
            'put_countries',
            'get_countries',
            'delete_countries',
            'post_roles',
            'put_roles',
            'get_roles',
            'delete_roles',
            'post_applications',
            'put_applications',
            'get_applications',
            'delete_applications',
            'post_companies',
            'put_companies',
            'get_companies',
            'delete_companies',
            'post_customers',
            'put_customers',
            'get_customers',
            'delete_customers',
            'post_licenses',
            'put_licenses',
            'get_licenses',
            'delete_licenses',
            'post_locals',
            'put_locals',
            'get_locals',
            'delete_locals',
            'post_permissions',
            'put_permissions',
            'get_permissions',
            'delete_permissions',
        ]
    },
    {
        module: 'administration',
        actionType: 'second_action',
        permissions: [
            'post_permissions_update'
        ]
    },
    {
        module: 'administration',
        actionType: 'without_action',
        permissions: [
            'change_language',
            'change_color'
        ]
    },
    {
        module: 'inventory',
        actionType: 'first_action',
        permissions: [
            'post_products',
            'put_products',
            'get_products',
            'delete_products',
            'post_brands',
            'put_brands',
            'get_brands',
            'delete_brands',
            'post_product-categories',
            'put_product-categories',
            'get_product-categories',
            'delete_product-categories',
            'post_product-types',
            'put_product-types',
            'get_product-types',
            'delete_product-types',
            'post_vendors',
            'put_vendors',
            'get_vendors',
            'delete_vendors'
        ]
    },
    {
        module: 'pos',
        actionType: 'first_action',
        permissions: [
            'post_orders',
            'put_orders',
            'get_orders',
            'delete_orders',
            'post_orderItems',
            'put_orderItems',
            'get_orderItems',
            'delete_orderItems'
        ]
    }, 
    {
        module: 'examples',
        actionType: 'first_action',
        permissions: [
            'get_mercado-libre',
            'get_spotify',
            'get_youtube'
        ]
    }
]

module.exports = permissionData;