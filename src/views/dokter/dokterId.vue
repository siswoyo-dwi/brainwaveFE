<template>
  <div v-if="spinner">
      <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
      <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon>
      <ion-row>
        <ion-col
          ><ion-list>
            <ion-item class="ion-text-center">
              <img
                v-if="!profile.profilPicture"
                src="../../../assets/avatar.png"
                alt=""
              />
              <ion-avatar v-else>
                <img
                  :src="ip+profile.profilPicture"
                  alt=""
                />
              </ion-avatar>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <strong><h4>USER INFORMATION</h4></strong>
                </ion-row>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group69.svg" alt="" />
                    <div class="ion-text-start"></div>
                  </ion-col>
                  <ion-col size="4">
                    <ion-text> Full name </ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text>{{ profile.nama }} </ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group70.svg" alt="" />
                  </ion-col>
                  <ion-col>
                    <ion-text size="4">Age</ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text> {{ age }}</ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>

            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group72.svg" alt="" />
                  </ion-col>
                  <ion-col size="4">
                    <ion-text>Blood type</ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text>
                        {{ profile.golonganDarah }}
                      </ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group73.svg" alt="" />
                  </ion-col>
                  <ion-col size="4">
                    <ion-text>Body height</ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text>
                        {{ profile.tinggiBadan }}
                      </ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>

            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group75.svg" alt="" />
                  </ion-col>
                  <ion-col size="4">
                    <ion-text>Body weight</ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text>
                        {{ profile.beratBadan }}
                      </ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>

            <ion-item
              ><ion-button @click="$router.push(`/listJadwal/${id}`)"
                >List Jadwal</ion-button
              >
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonProgressBar,
  IonList,
  IonGrid,
  IonItem,
  IonAvatar,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  components: {
    IonPage,
    IonIcon,
    IonContent,
    IonProgressBar,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonList,
    IonItem,
    IonGrid,
    IonAvatar,
  },
  data() {
    return {
      id: this.$route.params.id,
      profile: "",
      ip:ipBackend,
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
</style>
