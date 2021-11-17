import { createRouter, createWebHistory } from "@ionic/vue-router";
// import Home from '../views/Home.vue'

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/pasien/login.vue"),

  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/pasien/register.vue"),

  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/views/mainView/MainViewPasient.vue"),
  },
  {
    path: "/mainDokter",
    name: "mainDokter",
    component: () => import("@/views/mainView/MainViewDokter.vue"),
  },
  {
    path: "/update",
    name: "update",
    component: () => import("@/views/pasien/updateUser.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/pasien/profile.vue"),
  },
  {
    path: "/profileDokter",
    name: "profileDokter",
    component: () => import("@/views/dokter/profileDokter.vue"),
  },
  {
    path: "/inputdata",
    name: "inputdata",
    component: () => import("@/views/pasien/inputUserData.vue"),
  },
  {
    path: "/listDokter",
    name: "listDokter",
    component: () => import("@/views/list/listDokter.vue"),
  },
  {
    path: "/listPasien",
    name: "listPasien",
    component: () => import("@/views/list/listPasien.vue"),
  },
  {
    path: "/profilePasien/:id",
    name: "profileById",
    component: () => import("@/views/pasien/profileId.vue"),
  },
  {
    path: "/profileDokter/:id",
    name: "profileDokterById",
    component: () => import("@/views/dokter/dokterId.vue"),
  },
  {
    path: "/registerJadwal",
    name: "registerJadwal",
    component: () => import("@/views/jadwal/registerJadwal.vue"),
  },
  {
    path: "/listJadwal/:id",
    name: "listJadwal",
    component: () => import("@/views/jadwal/listJadwal.vue"),
  },
  {
    path: "/listJadwalByDokterId",
    name: "listJadwalByDokterId",
    component: () => import("@/views/jadwal/listJadwalByDokterId.vue"),
  },
  {
    path: "/updateJadwal/:id",
    name: "updateJadwal",
    component: () => import("@/views/jadwal/updateJadwal.vue"),
  },
  {
    path: "/testHistory/:id",
    name: "testHistory",
    component: () => import("@/views/pasien/testHistory.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


export default router;
