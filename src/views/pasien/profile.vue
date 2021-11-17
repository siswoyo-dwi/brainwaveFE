<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      color="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col
            ><ion-list>
              <ion-card>
                <ion-card>
                  <ion-card-header color="primary">
                    <ion-label>
                      <!-- <ion-icon
                        :icon="chevronBackCircleOutline"
                        @click="$router.go(-1)"
                      ></ion-icon> -->
                      <h3>{{ profile.nama }} Profile</h3>
                    </ion-label>
                    <img
                      class="image-profile"
                      v-if="!profile.profilPicture"
                      src="../../../assets/avatar.png"
                      alt=""
                    />
                    <img
                      v-else
                      class="image-profile"
                      :src="ip + profile.profilPicture"
                      alt=""
                    />
                  </ion-card-header>
                </ion-card>

                <ion-item>
                  <ion-grid>
                    <ion-row>
                      <strong><h4>USER INFORMATION</h4></strong>
                    </ion-row>
                    <ion-item>
                      <img
                        slot="start"
                        src="../../../assets/Group69.svg"
                        alt=""
                      />
                        <ion-text  slot="start"> Full name </ion-text>
                        <ion-text slot="end">{{ profile.nama }} </ion-text>
                    </ion-item>
                    <!-- <ion-row>
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
                    </ion-row> -->
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
                          <ion-text> {{ profile.tinggiBadan }} cm </ion-text>
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
                          <ion-text> {{ profile.beratBadan }} kgs </ion-text>
                        </div>
                      </ion-col>
                    </ion-row>
                    <ion-row> </ion-row>
                  </ion-grid>
                </ion-item>
                <ion-item
                  ><ion-button @click="$router.push('/update')"
                    >Update My Profile</ion-button
                  >
                  <ion-button @click="goTo()">Dashboard</ion-button>
                  <ion-button @click="logout()"
                    ><ion-icon :icon="logOutOutline"></ion-icon
                  ></ion-button>
                </ion-item>
              </ion-card>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  alertController,
  IonCol,
  IonRow,
  IonList,
  IonGrid,
  IonItem,
  IonText,
  IonContent,
  IonCard,
  IonLabel,
  IonButton,
  IonProgressBar,
  IonCardHeader,
  IonPage,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { chevronBackCircleOutline, logOutOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
export default defineComponent({
  components: {
    IonCol,
    IonRow,
    IonList,
    IonGrid,
    IonItem,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonProgressBar,
    IonContent,
    IonText,
    IonButton,
    IonPage,
    IonLabel,
  },
  setup() {
    const router = useRouter();
    const slideOpts = {
      initialSlide: 1,
      speed: 400,
    };
    return { slideOpts, router, chevronBackCircleOutline, logOutOutline };
  },
  data() {
    return {
      profile: "",
      ip: ipBackend,
      scanUser: "",
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
        url: ipBackend + `users/profil`,
      });
      const set = await Storage.get({ key: "id" });
      const id = JSON.parse(set.value);
      const user = await axios({
        method: "get",
        url: ipBackend + `scanning/listScanningByUserId/${id}`,
        headers: { token: token },
      });
      vm.scanUser = user.data.data;
      vm.profile = data.data.data[0];
      console.log(vm.scanUser);
      console.log(vm.profile);
      vm.spinner = false;
      vm.age = Math.floor(
        (new Date().getTime() -
          new Date(data.data.data[0].tanggalLahir).getTime()) /
          31536000000
      );
    }
  },

  methods: {
    goTo() {
      const vm = this;
      if (vm.profile.role == "Pasien") {
        vm.$router.push("/main");
      } else {
        vm.$router.push("/mainDokter");
      }
    },
    async logout() {
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

<style scoped>
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
  border-radius: 5%;
}
.image-profile {
  height: 150px;
  width: 150px;
  display: block;
  margin: auto;
  margin-top: 10px;

  border-radius: 50%;
}
.ion-text-center {
  text-align: center;
}
.ion-margin {
  margin-bottom: 10px;
}
h3 {
  font-weight: 700;
  text-align: center;
}
ion-icon {
  font-size: 20px;
}
ion-text {
  font-size: 18px;
}
</style>
