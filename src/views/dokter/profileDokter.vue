<template>
  <div v-if="spinner">
      <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content color="primary">
      <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon>

      <ion-grid>
        <ion-row id="row1">
          <ion-col>
            <ion-grid>
              <ion-row>
                <ion-col size="5">
                  <ion-avatar>
                    <img
                      class="imgFotoPribadi"
                      v-if="profile.profilPicture"
                      :src="ip+profile.profilPicture"
                      alt=""
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
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button @click="$router.push('/registerjadwal')">
              Register jadwal
            </ion-button>
            <ion-button @click="$router.push('/listJadwalByDokterId')">
              List jadwal
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonPage,
  IonContent,
  IonProgressBar,
  IonRow,
  IonCol,
  IonGrid,
  IonAvatar,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { ipBackend } from "@/ipBackend";
import { Storage } from "@capacitor/storage";

import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  data() {
    return {
      profile: "",
      ip:ipBackend,
      spinner: false,
    };
  },
  components: {
    IonPage,
    IonIcon,
    IonContent,
    IonProgressBar,
    IonRow,
    IonButton,
    IonCol,
    IonGrid,
    IonAvatar,
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
      vm.spinner = false;
    }
  },
});
</script>

<style>
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
ion-avatar {
  border-radius: 50%;
}
</style>
