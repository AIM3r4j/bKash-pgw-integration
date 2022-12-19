const routes = [
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      needsAuth: true,
    },
    children: [
      {
        path: "",
        component: () => import("pages/Home.vue"),
        meta: {
          needsAuth: true,
        },
      },

      {
        path: "transactions",
        component: () => import("src/pages/Transactions.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "manage/credential",
        component: () => import("src/pages/CredentialManagement.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "products",
        component: () => import("pages/Products.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "refund",
        component: () => import("src/pages/Refund.vue"),
        meta: {
          needsAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
    meta: {
      userLoggedIn: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
