<template>
  <body>
    <ion-app>
      <Menu></Menu>
      <ion-router-outlet id="main" />
    </ion-app>
  </body>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import Menu from "./views/menu.vue";
import { Storage } from "@capacitor/storage";

export default defineComponent({
  name: "App",
  components: {
    Menu,
    IonApp,
    IonRouterOutlet,
  },
  data() {
    return {
      login: false,
    };
  },
  async ionViewDidEnter() {
    const vm = this;
    const login = await Storage.get({ key: "token" });
    if (login) {
      vm.login = true;
    } else {
      vm.login = false;
    }
    console.log(vm.login);
  },
});
</script>
<style>
/* ion-content,
ion-toolbar,
ion-page {
  --background: linear-gradient(
    90deg,
    rgba(43, 90, 148, 1) 0%,
    rgba(45, 120, 229, 1) 35%,
    rgba(45, 112, 229, 1) 100%
  );
} */
ion-item {
  /* --background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgb(150, 220, 180, 1) 75%,
    rgb(97, 245, 134) 100%
  ); */
  /* --background: rgb(210, 241, 243); */
  border: transparent solid 1px;
  border-radius: 20px;

  /* padding: 20px; */
  color: black;
}
ion-card {
  /* --background: linear-gradient(
    90deg,
    rgba(255,255,255, 1) 0%,
    rgb(150, 220, 180, 1) 75%,
    rgb(97, 245, 134) 100%
  ); */
  /* --background: rgb(216, 227, 245); */
  padding: 20px;
  border-radius: 20px;
}
ion-button {
  --background: rgb(140, 183, 240);
  border-radius: 20px;

  color: black;
}
ion-infinite-scroll-content {
  --color: rgb(140, 183, 240);
}
/* ion-list {
  --background: linear-gradient(
    90deg,
    rgba(43, 180, 148, 1) 0%,
    rgb(50, 200, 220, 1) 35%,
    rgba(97, 228, 245, 1) 100%
  );
} */
</style>
