<template>
  <ion-menu class="menuOptions" side="start" menu-id="first" content-id="main">
    <ion-header>
      <ion-toolbar color="success" translucent>
        <ion-title>
          <img id="img-home" src="../../assets/Group-38.svg" alt="" />
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="custom-menu-item">
      <ion-item button class="item" @click="profile()">
        <ion-label slot="end"> Profile</ion-label>
      </ion-item>
      <ion-item button @click="$router.push('/listdokter')">
        <ion-label slot="end"> Dokter</ion-label>
      </ion-item>
      <ion-item button @click="History()">
        <ion-label slot="end"> History</ion-label>
      </ion-item>
      <ion-item button @click="jadwal()">
        <ion-label slot="end"> Jadwal</ion-label>
      </ion-item>
      <ion-item button @click="logout()">
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
import { Storage } from "@capacitor/storage";
import { useRouter } from "vue-router";
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
  setup() {
    const router = useRouter();
    return { router };
  },
  ionViewDidEnter() {
    console.log("hai");
  },
  methods: {
    async profile() {
      const vm = this;
      const role = await Storage.get({ key: "role" });

      if (role.value == `"Dokter"`) {
        vm.$router.push("/profileDokter");
      } else if (role.value == `"Pasien"`) {
        vm.$router.push("/profile");
      }
    },
    async History() {
      const vm = this;
      const id = await Storage.get({ key: "id" });
      vm.$router.push(`/testHistory/${id.value.substring(1,id.value.length-1)}`);
    },
    async jadwal() {
      const vm = this;
      const role = await Storage.get({ key: "role" });

      if (role.value == `"Dokter"`) {
        vm.$router.push("/listJadwalByDokterId");
      } else if (role.value == `"Pasien"`) {
        vm.$router.push("/listsemuajadwal");
      }
    },
    open() {},
    async openMenu() {
      await menuController.open();
    },
    async logout() {
      let vm = this;
      menuController.close();
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
              Storage.set({
                key: "id",
                value: JSON.stringify({}),
              });
              Storage.set({
                key: "role",
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
ion-menu {
  margin-top: -10px;
}
</style>
