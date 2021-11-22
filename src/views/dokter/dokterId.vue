<template>
  <div v-if="spinner">
    <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
      <Tab slot="fixed"></Tab>
      <ion-card x style="margin-top: 50px">
        <ion-item color="primary" class="ion-text-center">
          <img
            v-if="!profile.profilPicture"
            src="../../../assets/avatar.png"
            alt=""
          />
          <ion-avatar v-else>
            <img :src="ip + profile.profilPicture" alt="" />
          </ion-avatar>
        </ion-item>
        <ion-item>
          <strong><h4>USER INFORMATION</h4></strong>
        </ion-item>
        <ion-item>
          <img
            class="img-profile"
            slot="start"
            src="../../../assets/Group69.svg"
            alt=""
          />
          <ion-text> Full name </ion-text>
          <ion-text slot="end">{{ profile.nama }} </ion-text>
        </ion-item>

        <ion-item>
          <ion-icon slot="start" id="home" :icon="home"></ion-icon>

          <ion-text size="4">Address</ion-text>
          <ion-text slot="end"> {{ profile.alamat }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-icon :icon="logoWhatsapp"  id="wa"> </ion-icon>
          <ion-text>Nomor Wa</ion-text>
          <ion-text slot="end">
            {{ profile.noHpUser }}
          </ion-text>
        </ion-item>
        <ion-item
          ><ion-button @click="$router.push(`/listJadwal/${id}`)"
            >List Jadwal</ion-button
          >
        </ion-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonText,
  IonCard,
  IonButton,
  IonProgressBar,
  IonItem,
  IonAvatar,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import Tab from "../tab.vue";
import { chevronBackCircleOutline, logoWhatsapp, home } from "ionicons/icons";
export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
      logoWhatsapp,
      home,
    };
  },
  components: {
    IonPage,
    IonIcon,
    IonContent,
    IonProgressBar,
    IonText,
    Tab,
    IonButton,
    IonItem,
    IonCard,
    IonAvatar,
  },
  data() {
    return {
      id: this.$route.params.id,
      profile: "",
      ip: ipBackend,
      spinner: false,
      age: "",
    };
  },
  async ionViewDidEnter() {
    const vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    if (token) {
      const data = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/detailsUsersById/` + vm.id,
      });
      vm.profile = data.data.data[0];
      vm.age = Math.floor(
        (new Date().getTime() -
          new Date(data.data.data[0].tanggalLahir).getTime()) /
          31536000000
      );
      vm.spinner = false;
    }
  },
});
</script>

<style>
img {
  height: 100%;
  width: auto;
  display: block;
  margin: auto;
}
ion-avatar {
  border-radius: 50%;
}
ion-content {
  display: flex;
  justify-self: center;
  margin: auto;
}
ion-item {
  margin: 24px auto;
  /* width: 70%; */
}
ion-button {
  margin: 24px auto;
  /* width: 90%; */
  /* border-radius: 5%; */
}
.img-profile,
ion-icon {
  margin-right: 10px;
}
ion-icon {
  font-size: 30px;
}
ion-icon#wa{
  color: aquamarine;
}
ion-icon#home{
  color: aqua;
}
</style>
