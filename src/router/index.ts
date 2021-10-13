import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import ConvertImage from "../views/ConvertImage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "ConvertImage",
    component: ConvertImage,
  },
];

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes,
});

export default router;
