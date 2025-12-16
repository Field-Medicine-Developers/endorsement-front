import { createRouter, createWebHistory } from "vue-router";

const baseUrl = import.meta.env.VITE_BUILD_ADDRESS || "";

export const routes = [
  // صفحة تسجيل الدخول
  {
    path: `${baseUrl}/login`,
    component: () => import("../layouts/Auth.vue"),
    meta: { hideFromNav: true },
    children: [
      {
        path: "",
        component: () => import("@/views/Login.vue"),
        meta: { hideFromNav: true },
      },
    ],
  },
  
  {
    path: `${baseUrl}/injury-support-view/:id`,
    name: "InjurySupportView",
    component: () => import("@/views/injuries/InjurySupportView.vue"),
    meta: { public: true, hideFromNav: true },
  },
  

  {
    path: `${baseUrl}/about`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "لوحة ", component: () => import("@/views/Dashboard/About.vue") },
    ],
  },

  {
    path: `${baseUrl}/incoming`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "الوارد",
        component: () => import("@/views/IncomingWrapper/IncomingWrapper.vue"),
      },
    ],
  },

  {
    path: `${baseUrl}/margin-note`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "الهامش الإداري",
        component: () => import("@/views/Margin/MarginTabs.vue"),
      },
    ],
  },

  {
    path: `${baseUrl}/division-flow`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: " الإداري",
        component: () => import("@/views/Divisionfolder/DivisionTabs.vue")
      },
    ],
  },

  {
    path: `${baseUrl}/data-management`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "الإدارة ",
        component: () =>
          import("@/views/DataManagementModule/DataManagementWrapper.vue"),
      },
    ],
  },
  {
    path: `${baseUrl}/flow`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: " البيانات والتدقيق",
        component: () => import("@/views/FlowWrapper/FlowWrapper.vue"),
      },
    ],
  },
  {
    path: `${baseUrl}/return-flow`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "الاسترجاع",
        component: () => import("@/views/ReturnWrapper/ReturnWrapper.vue"),
      },
    ],
  },

  {
    path: `${baseUrl}/injury-supports`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "تأييد الإصابة",
        component: () => import("@/views/injuries/InjurySupports.vue"),
      },
    ],
  },
  {
    path: `${baseUrl}/contacts`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "إعدادات النظام",
        component: () => import("@/views/Contacts.vue"),
      },
    ],
  },
  

  // {
  //   path: `${baseUrl}/departments`,
  //   component: () => import("@/layouts/Page.vue"),
  //   children: [
  //     { path: "", name: "الشُعَب", component: () => import("@/views/Departments.vue") }
  //   ],
  // },

  // {
  //   path: `${baseUrl}/formations`,
  //   component: () => import("@/layouts/Page.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "التشكيلات",
  //       component: () => import("@/views/Formations.vue")
  //     }
  //   ],
  // },

  // {
  //   path: `${baseUrl}/users`,
  //   component: () => import("@/layouts/Page.vue"),
  //   children: [
  //     { path: "", name: "الحسابات", component: () => import("@/views/Users.vue") }
  //   ],
  // },

  // أي مسار غير معروف → login
  // {
  //   path: `${baseUrl}/:pathMatch(.*)*`,
  //   component: () => import("@/views/errors/NotFound404.vue"),
  //   meta: { public: true },
  // },
  {
    path: `${baseUrl}/:pathMatch(.*)*`,
    redirect: `${baseUrl}/login`,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

//  حماية الصفحات (اختياري)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.meta.public) {
    return next();
  }

  if (!isAuthenticated && to.path !== `${baseUrl}/login`) {
    return next(`${baseUrl}/login`);
  }

  next();
});

