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
      <ion-grid>
        <ion-row id="row1">
          <!-- <ion-icon
            :icon="chevronBackCircleOutline"
            @click="$router.go(-1)"
          ></ion-icon> -->
          <ion-col>
            <ion-grid>
              <ion-row>
                <ion-col style="margin-top:10px;" size="7">
                  <ion-text color="light"><h5>Selamat Datang,</h5> </ion-text
                  ><br />
                  <ion-text color="light">{{ profile.nama }} </ion-text>
                </ion-col>
                <ion-col size="5">
                  <ion-avatar>
                    <img
                      class="imgFotoPribadi"
                      v-if="profile.profilPicture"
                      :src="ip+profile.profilPicture"
                    />
                    <img
                      class="imgFotoPribadi"
                      v-else
                      src="../../../assets/avatar.png"
                    />
                  </ion-avatar>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
        <ion-row id="row2"> </ion-row>
      </ion-grid>
      <!-- <ion-list> -->
        <ion-item
          ><ion-button @click="$router.push(`/listJadwalByDokterId`)"
            >List Jadwal</ion-button
          ></ion-item
        >
        <ion-item
          ><ion-button @click="$router.push('/RegisterJadwal')"
            >Register Jadwal</ion-button
          ></ion-item
        >
        <!-- <ion-item><ion-button>jalankan tes EEG</ion-button></ion-item>
        <ion-item><ion-button>Riwayat Tes EEG</ion-button></ion-item>
        <ion-item><ion-button>Perangkat EEG</ion-button></ion-item>
        <ion-item><ion-button>hubungi kontak</ion-button> </ion-item> -->
      <!-- </ion-list> -->
    </ion-content>
  </ion-page>
</template>
<script>
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { create } from "ionicons/icons";

import {
  IonContent,
  IonPage,
  IonAvatar,
  IonGrid,
  IonRow,
  IonText,
  IonButton,
  IonCol,
  // IonList,
  IonProgressBar,
  IonItem,
  // IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { chevronBackCircleOutline } from "ionicons/icons";

export default defineComponent({
  components: {
    // IonList,
    IonItem,
    // IonIcon,
    IonContent,
    IonPage,
    IonProgressBar,
    IonButton,
    IonAvatar,
    IonGrid,
    IonRow,
    IonText,
    IonCol,
  },

  setup() {
    return {
      create,
      chevronBackCircleOutline,
    };
  },
  methods: {},
  data() {
    return {
      profile: "",
      ip: ipBackend,
      spinner: false,
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
        url: ipBackend + `users/profil`,
      });
      vm.profile = data.data.data[0];
      // vm.age = Math.floor(
      //   (new Date().getTime() -
      //     new Date(data.data.data[0].tanggalLahir).getTime()) /
      //     31536000000
      // );
      vm.spinner = false;
    }
  },
});
</script>
<style scoped>
#row1 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3b72ff;
  /* border-radius:  0  0 50% 50%  ; */
}
#row2 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3b72ff;
  border-radius: 0 0 50% 50%;
}
.imgFotoPribadi {
  border-radius: 50%;
  z-index: 1;
}

ion-avatar img {
  width: 300% !important;
  height: 300% !important;
  max-width: 150px !important;
  max-height: 150px !important;
  padding: 5px !important;
  background-color: #386cf2;
}
#profile {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
ion-icon {
  font-size: 20px;
  color: white;
}
</style>
