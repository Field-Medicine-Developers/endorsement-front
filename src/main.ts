import { createApp } from "vue";

import App from "@/App.vue";
import { router } from "@/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/assets/css/global.css";
import "@/assets/css/navbar.css";
import "@/assets/css/dashbard.css";
import "vue3-select/dist/vue3-select.css";
import role from "@/directives/role";

const app = createApp(App);

app.directive("role", role);

app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
