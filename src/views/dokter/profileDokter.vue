<template>
  <div v-if="spinner">
    <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
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
        <ion-button @click="clickJadwal()">List Jadwal</ion-button>
        <ion-button slot="end" @click="clickPasien()"> List Pasien</ion-button>
      </ion-item>
      <div v-show="jadwal">
        <div v-if="dataJadwal.length > 0">
          <div v-for="jadwal in dataJadwal" :key="jadwal.id">
            <ion-card @click="$router.push(`/listPasien/${jadwal.id}`)">
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
                <ion-button @click="$router.push(`/updateJadwal/${jadwal.id}`)">
                  update
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
  IonButton,
  IonPage,
  IonContent,
  IonProgressBar,
  IonCard,
  IonLabel,
  IonInfiniteScroll,
  IonList,
  IonGrid,
  // IonRow,
  // IonCol,
  // IonGrid,
  // IonList,
  IonInfiniteScrollContent,
  IonDatetime,
  IonItem,
  IonText,
  IonAvatar,
  // IonIcon,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import moment from "moment";
import "moment/locale/id";
import axios from "axios";
import { ipBackend } from "@/ipBackend";
import { Storage } from "@capacitor/storage";
import Tab from "../tab.vue";
import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  setup() {
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
      chevronBackCircleOutline,
      isDisabled,
      loadData,
      items,
    };
  },
  watch: {
    async cek(newValue, oldValue) {
      console.log(newValue !== oldValue);

      if (newValue !== oldValue) {
        console.log(newValue !== oldValue);

        await this.getJadwal();
      }
    },
  },
  data() {
    return {
      listPasien: "",
      profile: "",
      ip: ipBackend,
      jadwal: false,
      pasien: false,
      showRegister: false,
      spinner: false,
      moment,
      cek: 0,
      tanggalJadwal: "",
      jamMulai: "",
      jamSelesai: "",
      dataJadwal: "",
      loading: false,
    };
  },
  components: {
    IonPage,
    // IonIcon,
    Tab,
    IonContent,
    IonProgressBar,
    // IonRow,
    IonInfiniteScroll,
    IonDatetime,
    IonButton,
    IonCard,
    IonLabel,
    // IonCol,
    IonList,
    IonGrid,
    // IonList,
    IonItem,
    IonInfiniteScrollContent,

    IonText,
    // IonGrid,
    IonAvatar,
  },
  async ionViewDidEnter() {
    const vm = this;
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
      console.log(vm.listPasien);
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
      console.log(vm.cek);
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
        console.log(vm.cek);

        // vm.$router.push("/listJadwalByDokterId");
      }
    },
  },
});
</script>

<style scoped>
ion-card {
  min-height: 30vh;
  border-radius: 0 0 50px 50px;
  font-weight: 1000;
}
h4 {
  font-weight: 700;
}
ion-label ion-text#nama {
  margin-top: -500px;
}
</style>
