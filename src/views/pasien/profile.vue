<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      color="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>

  <ion-page v-else>
    <ion-content v-if="role == `Pasien`">
      <Tab slot="fixed"></Tab>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-card>
              <ion-card color="primary" id="header">
                <ion-card-header>
                  <h3>
                    <strong>{{ profile.nama }} Profile</strong>
                  </h3>
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

              <ion-item class="pasien" lines="none">
                <ion-grid>
                  <ion-row>
                    <strong><h4>USER INFORMATION</h4></strong>
                  </ion-row>
                </ion-grid>
              </ion-item>
              <ion-item class="pasien">
                <img slot="start" src="../../../assets/Group69.svg" alt="" />
                <ion-text> Full name </ion-text>
                <ion-text slot="end">{{ profile.nama }} </ion-text>
              </ion-item>
              <ion-item class="pasien">
                <img slot="start" src="../../../assets/Group70.svg" alt="" />
                <ion-text>Age</ion-text>
                <ion-text slot="end"> {{ age }}</ion-text>
              </ion-item>

              <ion-item class="pasien">
                <img slot="start" src="../../../assets/Group72.svg" alt="" />
                <ion-text>Blood type</ion-text>
                <ion-text slot="end">
                  {{ profile.golonganDarah }}
                </ion-text>
              </ion-item>
              <ion-item class="pasien">
                <img slot="start" src="../../../assets/Group73.svg" alt="" />
                <ion-text>Body height</ion-text>
                <ion-text slot="end"> {{ profile.tinggiBadan }} cm </ion-text>
              </ion-item>
              <ion-item class="pasien">
                <img slot="start" src="../../../assets/Group75.svg" alt="" />
                <ion-text>Body weight</ion-text>
                <ion-text slot="end"> {{ profile.beratBadan }} kgs </ion-text>
              </ion-item>
              <ion-item class="pasien" lines="none">
                <ion-text><h4>Medical Record</h4></ion-text>
                <div slot="end" @click="$router.push(`/testHistory/${id}`)">
                  <ion-text color="dark"> See more </ion-text>
                  <ion-icon
                    class="grey"
                    :icon="chevronForwardCircleOutline"
                  ></ion-icon>
                </div>
              </ion-item>
              <div v-if="scanUser.length > 0">
                <swiper @swiper="setSwiperInstance">
                  <swiper-slide v-for="scan in scanUser" :key="scan.id">
                    <ion-card
                      id="swiper-slide"
                      style="background-color: #9de2b9"
                    >
                      <div class="slider">
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <div style="text-align: end">
                                <ion-text> Illness Classification </ion-text>
                              </div>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                        <div style="margin-top: 50px">
                          <h4>{{ scan.hasil }}</h4>

                          {{ moment(scan.tanggalJadwal).format("Do MMM YYYY") }}
                        </div>
                      </div>
                    </ion-card>
                  </swiper-slide>
                </swiper>
              </div>
              <div v-else>
                <ion-card>
                  <ion-item  class="pasien"> Belum ada Medical Record </ion-item>
                </ion-card>
              </div>
              <ion-item  class="pasien"
                ><ion-button slot="start"  class="pasien" @click="$router.push('/update')"
                  >Update My Profile</ion-button
                >
                <ion-button  slot="end" class="pasien" @click="logout()"
                  ><ion-icon :icon="logOutOutline"></ion-icon
                ></ion-button>
              </ion-item>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-content v-else>
      <Tab slot="fixed"></Tab>
      <ion-card color="primary">
        <ion-item color="primary" lines="none">
          <ion-label>
            <ion-text color="light"><h4>Selamat datang</h4> </ion-text><br />
            <ion-text id="nama" color="light"
              ><h4>Dr.{{ profile.nama }}</h4></ion-text
            >
          </ion-label>
          <ion-avatar>
            <img
              class="imgFotoPribadi"
              v-if="profile.profilPicture"
              :src="ip + profile.profilPicture"
              alt=""
            />

            <img
              class="imgFotoPribadi"
              v-else
              src="../../../assets/avatar.png"
            />
          </ion-avatar>
        </ion-item>
      </ion-card>

      <ion-item lines="none">
        <ion-button @click="isShowRegister()"> Register jadwal </ion-button>
      </ion-item>
      <ion-card v-show="showRegister">
        <ion-item>
          <ion-label>Tanggal</ion-label>
          <ion-datetime
            v-model="tanggalJadwal"
            display-format="YYYY:MM:DD"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Jam Mulai</ion-label>
          <ion-datetime
            display-format="HH:mm"
            minute-values="0,15,30,45"
            v-model="jamMulai"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Jam selesai</ion-label>
          <ion-datetime
            display-format="HH:mm"
            minute-values="0,15,30,45"
            v-model="jamSelesai"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-button disabled v-if="loading">submit</ion-button>
          <ion-button v-model="cek" v-else @click="submit()">submit</ion-button>
        </ion-item>
      </ion-card>
      <ion-item>
        <ion-button stot="start" @click="clickJadwal()">List Jadwal</ion-button>
        <ion-button slot="end" @click="clickPasien()"> List Pasien</ion-button>
      </ion-item>
      <div v-show="jadwal">
        <div v-if="dataJadwal.length > 0">
          <div v-for="jadwal in dataJadwal" :key="jadwal.id">
            <ion-card>
              <ion-item>
                <ion-label>Tanggal Jadwal</ion-label>
                {{ moment(jadwal.tanggalJadwal).format("YYYY/MM/DD") }}
              </ion-item>
              <ion-item>
                <ion-label>Jam Mulai</ion-label>
                {{ jadwal.jamMulai }}
              </ion-item>
              <ion-item>
                <ion-label>Jam Selesai</ion-label>
                {{ jadwal.jamSelesai }}
              </ion-item>
              <ion-item>
                <ion-label>Status Jadwal</ion-label>
                {{ jadwal.statusJadwal }}
              </ion-item>
              <ion-item size="3">
                <ion-button slot="start" @click="$router.push(`/updateJadwal/${jadwal.id}`)">
                  update
                </ion-button>
                <ion-button slot="end" @click="$router.push(`/listPasien/${jadwal.id}`)">
                  Pasien
                </ion-button>
              </ion-item>
            </ion-card>
            <ion-infinite-scroll
              @ionInfinite="loadData($event)"
              threshold="100px"
              id="infinite-scroll"
              :disabled="isDisabled"
            >
              <ion-infinite-scroll-content
                loading-spinner="bubbles"
                loading-text="Loading more data..."
              >
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </div>
        </div>
        <div v-else>
          <ion-card>
            <div>
              <ion-item>
                <ion-label>belum ada jadwal</ion-label>
              </ion-item>
            </div>
          </ion-card>
        </div>
      </div>
      <div v-show="pasien">
        <div v-if="spinner">
          <ion-progress-bar
            type="indeterminate"
            color="primary"
            value="0.5"
          ></ion-progress-bar>
        </div>
        <ion-grid>
          <ion-card
            style="margin-top: 50px"
            v-for="Pasien in listPasien"
            :key="Pasien.id"
          >
            <ion-list @click="$router.push(`/listScanningPasien/${Pasien.id}`)">
              <ion-item>
                <ion-text>Nama: </ion-text
                ><ion-text slot="end">{{ Pasien.nama }}</ion-text>
              </ion-item>
              <ion-item>
                <ion-text>Gol Darah: </ion-text
                ><ion-text slot="end">{{ Pasien.golonganDarah }}</ion-text>
              </ion-item>
              <ion-item>
                <ion-text>Tinggi: </ion-text
                ><ion-text slot="end">{{ Pasien.tinggiBadan }}</ion-text>
              </ion-item>
              <ion-item>
                <ion-text>Berat: </ion-text
                ><ion-text slot="end">{{ Pasien.beratBadan }}</ion-text>
              </ion-item>
            </ion-list>
          </ion-card>
          <ion-infinite-scroll
            @ionInfinite="loadData($event)"
            threshold="100px"
            id="infinite-scroll"
            :disabled="isDisabled"
          >
            <ion-infinite-scroll-content
              loading-spinner="bubbles"
              loading-text="Loading more data..."
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  alertController,
  IonCol,
  IonRow,
  IonGrid,
  IonItem,
  IonText,
  IonContent,
  IonButton,
  IonCardHeader,
  IonPage,
  IonIcon,
  IonProgressBar,
  IonCard,
  IonLabel,
  IonInfiniteScroll,
  IonList,
  IonInfiniteScrollContent,
  IonDatetime,
  IonAvatar,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import "swiper/swiper-bundle.min.css";

import {
  logOutOutline,
  chevronForwardCircleOutline,
} from "ionicons/icons";
import Tab from "../tab.vue";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
export default defineComponent({
  components: {
    Tab,
    IonCol,
    IonRow,
    IonGrid,
    IonItem,
    IonIcon,
    Swiper,
    SwiperSlide,
    IonContent,
    IonCard,
    IonCardHeader,
    IonProgressBar,
    IonText,
    IonButton,
    IonPage,
    IonLabel,
    IonInfiniteScroll,
    IonList,
    IonInfiniteScrollContent,
    IonDatetime,
    IonAvatar,
  },
  setup() {
    const router = useRouter();
    const slides = ref();
    const setSwiperInstance = (swiper) => {
      slides.value = swiper;
    };
    const isDisabled = ref(false);
    const items = ref([]);
    const pushData = () => {
      const max = items.value.length + 2;
      const min = max - 2;
      for (let i = min; i < max; i++) {
        items.value.push(i);
      }
    };

    const loadData = (ev) => {
      setTimeout(() => {
        pushData();
        ev.target.complete();
        if (items.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      router,
      chevronForwardCircleOutline,
      isDisabled,
      loadData,
      items,
      logOutOutline,
      setSwiperInstance,
    };
  },
  data() {
    return {
      profile: "",
      ip: ipBackend,
      scanUser: "",
      id: "",
      spinner: false,
      age: "",
      listPasien: "",
      jadwal: false,
      pasien: false,
      role: null,
      showRegister: false,
      moment,
      cek: 0,
      tanggalJadwal: "",
      jamMulai: "",
      jamSelesai: "",
      dataJadwal: "",
      loading: false,
    };
  },
  watch: {
    async cek(newValue, oldValue) {
      if (newValue !== oldValue) {
        await this.getJadwal();
      }
    },
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
      vm.id = JSON.parse(set.value);
      const get = await Storage.get({ key: "role" });
      vm.role = get.value.substring(1, get.value.length-1);
      const user = await axios({
        method: "get",
        url: ipBackend + `scanning/listScanningByUserId/${vm.id}`,
        headers: { token: token },
      });
      vm.scanUser = user.data.data;
      vm.profile = data.data.data[0];
      vm.spinner = false;
      vm.age = Math.floor(
        (new Date().getTime() -
          new Date(data.data.data[0].tanggalLahir).getTime()) /
          31536000000
      );
    }
    vm.spinner = true;
    if (token) {
      const jadwal = await axios({
        method: "get",
        url: ipBackend + `jadwal/listByUserLogin`,
        headers: { token: token },
      });
      vm.dataJadwal = jadwal.data.data;
      const data = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/profil`,
      });

      vm.profile = data.data.data[0];
      const set = await Storage.get({ key: "id" });
      const id = JSON.parse(set.value);

      const pasien = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/listPasienByDokterId/${id}`,
      });
      vm.listPasien = pasien.data.data;
      vm.spinner = false;
    }
  },

  methods: {
    clickJadwal() {
      let vm = this;
      if (vm.jadwal == false) {
        vm.jadwal = true;
        vm.pasien = false;
      } else {
        vm.jadwal = false;
        vm.pasien = false;
      }
    },
    clickPasien() {
      let vm = this;
      if (vm.pasien == false) {
        vm.pasien = true;
        vm.jadwal = false;
      } else {
        vm.pasien = false;
        vm.jadwal = false;
      }
    },
    async getJadwal() {
      let vm = this;
      vm.spinner = true;
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        const jadwal = await axios({
          method: "get",
          url: ipBackend + `jadwal/listByUserLogin`,
          headers: { token: token },
        });
        vm.dataJadwal = jadwal.data.data;
        vm.spinner = false;
      }
    },
    isShowRegister() {
      const vm = this;
      if (vm.showRegister) {
        vm.showRegister = false;
      } else {
        vm.showRegister = true;
      }
    },
    async submit() {
      let vm = this;
      vm.loading = true;
      const tanggal = moment(vm.tanggalJadwal).format("YYYY/MM/DD");
      const jamMulai = moment(vm.jamMulai).format("HH:mm ");
      const jamSelesai = moment(vm.jamSelesai).format("HH:mm ");
      const data = {
        tanggalJadwal: tanggal,
        jamMulai: jamMulai,
        jamSelesai: jamSelesai,
      };
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            token: token,
          },
          url: ipBackend + `jadwal/register`,
          data: data,
        });
        vm.showRegister = false;
        vm.tanggalJadwal = "";
        vm.jamMulai = "";
        vm.jamSelesai = "";
        vm.loading = false;
        vm.cek += 1;
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
ion-item.pasien {
  margin: 24px auto;
  /* width: 70%; */
}
ion-button.pasien {
  margin: 24px auto;
  /* width: 90%; */
  /* border-radius: 5%; */
}
.image-profile {
  height: 150px;
  width: 150px;
  display: block;
  margin: auto;
  margin-top: 10px;

  border-radius: 50%;
}

h3 {
  font-weight: 700;
  text-align: center;
}
.grey {
  color: black !important;
}
ion-text {
  font-size: 18px;
}
h4 {
  font-weight: 700;
  color: black;
}
#swiper-slide {
  width: 300px;
  height: 200px;
}

ion-card#header {
  margin: -20px;
  border-radius: 0 0 50px 50px;
}
</style>
