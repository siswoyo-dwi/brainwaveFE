<template>
  <ion-menu class="menuOptions" side="start" menu-id="first" content-id="main">
    <ion-header>
      <ion-toolbar translucent>
        <ion-title>
          <img id="img-home" src="../../assets/Group-38.svg" alt="" />
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="custom-menu-item">
      <ion-item button  class="item" @click="$router.push('/profile')">
        <!-- <ion-icon  name="mail" slot="start"></ion-icon> -->
        <ion-label slot="end"> Profile</ion-label>
      </ion-item>
      <ion-item button @click="$router.push('/listdokter')">
        <!-- <ion-icon name="paper-plane" slot="start"></ion-icon> -->
        <ion-label slot="end"> Dokter</ion-label>
      </ion-item>
      <ion-item button @click="$router.push('/listsemuajadwal')">
        <!-- <ion-icon name="heart" slot="start"></ion-icon> -->
        <ion-label slot="end"> Jadwal</ion-label>
      </ion-item>
      <ion-item button @click="logout()">
        <!-- <ion-icon name="archive" slot="start"></ion-icon> -->
        <ion-label slot="end"> Log Out</ion-label>
      </ion-item>
    </ion-content>
  </ion-menu>
</template>
<script>
import {
  IonContent,
  IonHeader,
  IonItem,
  IonMenu,
  IonLabel,
//   IonIcon,
  IonTitle,
  IonToolbar,
  menuController,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonItem,
    // IonIcon,
    IonMenu,
    IonTitle,
    IonLabel,
    IonToolbar,
  },
  setup(){
const logout =async ()=>{
      let vm = this;
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Perhatian!",
        message: "Apakah yakin akan keluar?",
        buttons: [
          {
            text: "Batal",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel:", blah);
            },
          },
          {
            text: "Ya",
            handler: async () => {
              await Storage.set({
                key: "token",
                value: JSON.stringify({}),
              });
              vm.$router.push("/home");
            },
          },
        ],
      });
      return alert.present();
    }
  
    return { logout }
  },
  methods: {
    async openMenu() {
      await menuController.open();
    },
    async keljuar() {
      let vm = this;
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Perhatian!",
        message: "Apakah yakin akan keluar?",
        buttons: [
          {
            text: "Batal",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel:", blah);
            },
          },
          {
            text: "Ya",
            handler: async () => {
              await Storage.set({
                key: "token",
                value: JSON.stringify({}),
              });
              vm.$router.push("/home");
            },
          },
        ],
      });
      return alert.present();
    },
  },
});
</script>
<style>
.my-custom-menu {
  --width: 500px;
}

#img-home {
  display: flex;
  justify-self: center;
  margin: auto;
}
.custom-menu-item.item {
pointer-events: auto !important;
}
ion-menu{
    margin-top: 50px;
}
</style>
