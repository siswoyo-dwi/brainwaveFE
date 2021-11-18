<template>
  <ion-app>
   
    <!-- <Menu></Menu> -->
    <ion-router-outlet id="main"/>
  </ion-app>
</template>

<script>
import {
  IonApp,
  IonRouterOutlet,
 
} from "@ionic/vue";
import { defineComponent } from "vue";
// import Menu from "./views/menu.vue";
// import Tab from "./views/tab.vue";
export default defineComponent({
  name: "App",

  components: {
    // Menu,
    // Tab,
    IonApp,
    IonRouterOutlet,
  },
});
</script>
<style>
ion-content,ion-toolbar,ion-page {
  --background: linear-gradient(
    90deg,
    rgba(43, 90, 148, 1) 0%,
    rgba(45, 120, 229, 1) 35%,
    rgba(45, 112, 229, 1) 100%
  );
}
ion-item {
  --background: linear-gradient(
    90deg,
    rgba(43, 120, 148, 1) 0%,
    rgb(50, 150, 220, 1) 35%,
    rgba(97, 178, 245, 1) 100%
  );
  color: black;
}
ion-card {
  --background: linear-gradient(
    90deg,
    rgba(43, 120, 148, 1) 0%,
    rgb(50, 150, 220, 1) 35%,
    rgba(97, 178, 245, 1) 100%
  );
  padding: 20px;
  border-radius: 5%;
    color: black;

}
ion-list {
  --background: linear-gradient(
    90deg,
    rgba(43, 180, 148, 1) 0%,
    rgb(50, 200, 220, 1) 35%,
    rgba(97, 228, 245, 1) 100%
  );
}

</style>
