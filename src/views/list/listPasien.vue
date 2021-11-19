<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      color="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content :fullscreen="true">
      <Tab></Tab>
      <div class="ion-text-center">
        <ion-text>List Pasien</ion-text>
      </div>
      <ion-grid>
        <!-- <ion-icon
          :icon="chevronBackCircleOutline"
          @click="$router.go(-1)"
        ></ion-icon> -->
        <ion-item
          style="margin-top: 50px"
          v-for="(Pasien, i) in listPasien"
          :key="i"
        >
          <!-- <ion-list> -->
          <ion-row>
            <ion-col
              ><ion-avatar
                ><img
                  v-if="Pasien.profilPicture"
                  :src="Pasien.profilPicture"
                  alt="" /></ion-avatar
              ><img src="../../../assets/avatar.png" alt="" />
            </ion-col>
            <ion-col
              ><ion-label>{{ Pasien.nama }}</ion-label></ion-col
            >
            <ion-col
              ><ion-button @click="goTo(Pasien.id)"
                >profile</ion-button
              ></ion-col
            >
          </ion-row>
          <!-- </ion-list> -->
        </ion-item>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  // IonList,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonText,
  IonAvatar,
  // IonIcon,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { chevronBackCircleOutline } from "ionicons/icons";
import Tab from "../tab.vue";

export default defineComponent({
  components: {
    IonAvatar,
    Tab,
    IonButton,
    IonText,
    IonProgressBar,
    // IonList,
    // IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
  },
  data() {
    return {
      listPasien: "",
      spinner: false,
    };
  },
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },

  async ionViewDidEnter() {
    const vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    if (token) {
      const dataPasien = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/listByRole/Pasien`,
      });

      vm.listPasien = dataPasien.data.data;
      vm.spinner = false;
    }
  },
  methods: {
    goTo(index) {
      this.$router.push(`/profilePasien/${index}`);
    },
  },
});
</script>

<style>
.ion-text-center {
  text-align: center;
  margin-top: 20px;
}
img {
  width: 50px;
  height: auto;
}
ion-icon {
  font-size: 20px;
}
</style>
