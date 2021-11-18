<template>
  <!-- <ion-toolbar> -->
    <ion-buttons>
      <ion-menu-button color="light" auto-hide="true"></ion-menu-button>
    </ion-buttons>
  <!-- </ion-toolbar> -->
  <!-- <Menu /> -->
</template>
<script>
import { defineComponent } from "vue";
import {  IonButtons, IonMenuButton } from "@ionic/vue";
// import Menu from "./menu.vue";
export default defineComponent({
  setup() {},
  components: {
    // Menu,
    // IonToolbar,
    IonButtons,
    IonMenuButton,
  },
});
</script>
