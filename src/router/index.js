import { createRouter, createWebHistory } from "@ionic/vue-router";
import { Storage } from "@capacitor/storage";
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
    meta: {
      guest: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/pasien/login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/pasien/register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/update",
    name: "update",
    component: () => import("@/views/pasien/updateUser.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/pasien/profile.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/inputdata",
    name: "inputdata",
    component: () => import("@/views/pasien/inputUserData.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listDokter",
    name: "listDokter",
    component: () => import("@/views/list/listDokter.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listPasien",
    name: "listPasien",
    component: () => import("@/views/list/listPasien.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/profilePasien/:id",
    name: "profileById",
    component: () => import("@/views/pasien/profileId.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/profileDokter/:id",
    name: "profileDokterById",
    component: () => import("@/views/dokter/dokterId.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/registerJadwal",
    name: "registerJadwal",
    component: () => import("@/views/jadwal/registerJadwal.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listJadwal/:id",
    name: "listJadwal",
    component: () => import("@/views/jadwal/listJadwal.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listPasien/:id",
    name: "listPasien",
    component: () => import("@/views/dokter/listPasien.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listScanningPasien/:id",
    name: "listScanningPasien",
    component: () => import("@/views/dokter/listScanning.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listJadwalByDokterId",
    name: "listJadwalByDokterId",
    component: () => import("@/views/jadwal/listJadwalByDokterId.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/updateJadwal/:id",
    name: "updateJadwal",
    component: () => import("@/views/jadwal/updateJadwal.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/testHistory/:id",
    name: "testHistory",
    component: () => import("@/views/pasien/testHistory.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listsemuajadwal",
    name: "listsemuajadwal",
    component: () => import("@/views/list/listJadwal.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/detailJadwal/:id",
    name: "detailJadwal",
    component: () => import("@/views/jadwal/detailJadwal.vue"),
    meta: {
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const get = await Storage.get({ key: "token" });
  const token = get.value;
  if (to.matched.some((record) => record.meta.auth)) {
    if (token && token.length > 2) {
      next();
      return;
    } else {
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (token.length <= 2) {
      next();
      return;
    } else {
      next("/profile");
    }
  }
});
export default router;
