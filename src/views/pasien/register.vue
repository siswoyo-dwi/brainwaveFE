<template>
  <ion-page>
    <ion-content>
      <Menu></Menu>
      <Tab></Tab>
      <!-- <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon> -->
      <div lines="none">
        <ion-item>
          <ion-text color="light">Hello there!</ion-text>
          <img
            class="my2"
            src="../../../assets/Group-38.svg"
            style="width: 20px"
            alt=""
          />
        </ion-item>
        <ion-item>
          <ion-text
            >Please enter your email address and your password to Sign Up to our
            app.</ion-text
          >
        </ion-item>
        <ion-item>
          <div id="container" class="registerBox">
            <ion-item lines="full">
              <ion-label position="floating">Email</ion-label>
              <ion-input
                class="input"
                type="email"
                v-model="username"
              ></ion-input>
            </ion-item>
            <ion-item lines="full">
              <ion-label position="floating">Password</ion-label>
              <ion-input
                type="password"
                v-if="this.cek.length == 0"
                v-model="password"
              ></ion-input>
              <ion-input v-else v-model="password"></ion-input>
            </ion-item>
            <ion-item>
              <input
                type="checkbox"
                style="margin-right: 10px"
                class="form-check-input"
                v-model="cek"
                value="yes"
                id="check"
              />

              <label class="form-check-label" for="exampleCheck1"
                >show password</label
              >
            </ion-item>
            <ion-button expand="block" color="primary" @click="doRegister()"
              >Sign Up</ion-button
            >
            <ion-text color="black">You already have an account?</ion-text
            ><ion-text @click="$router.push('/login')" color="light">
              Login
            </ion-text>
          </div>
        </ion-item>

        <!-- <ion-item style="text-align: center">
          <ion-text><p>You already have an account?</p></ion-text
          ><ion-text color="light"
            ><p @click="$router.push('/login')" class="my2">Login</p></ion-text
          ></ion-item
        > -->
      </div>
      <ion-col>
        <br />
      </ion-col>
      <ion-row>
        <ion-col> </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  // IonGrid,
  IonRow,
  // IonList,
  IonCol,
  IonText,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  // IonIcon,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { chevronBackCircleOutline, logOutOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import Menu from "../menu.vue";
import Tab from "../tab.vue";

export default defineComponent({
  components: {
    IonContent,
    // IonGrid,
    // IonIcon,
    IonRow,
    // IonList,
    Menu,
    Tab,
    IonCol,
    IonText,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  data() {
    return {
      username: "",
      password: "",
      cek: [],
    };
  },
  setup() {
    const router = useRouter();
    return { router, chevronBackCircleOutline, logOutOutline };
  },
  methods: {
    async doRegister() {
      let vm = this;
      let res = await axios.post(ipBackend + "users/register", {
        password: vm.password,
        username: vm.username,
      });

      if (res.data.message !== "sukses") {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "OOPS!",
          message: res.data.message,
          buttons: [
            {
              text: "Okay",
              handler: () => {
                vm.$router.push("/login");
              },
            },
          ],
        });
        return alert.present();
      } else if (
        res.data.message == "sukses" &&
        vm.username.length > 5 &&
        vm.password > 5
      ) {
        vm.$router.push("/inputdata");

        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Sukses!",
          message: "Anda Berhasil Menambahkan Userbaru",
          buttons: [
            {
              text: "Okay",
              handler: () => {
                vm.$router.push("/login");
              },
            },
          ],
        });
        return alert.present();
      } else {
        if (vm.username.length < 5 && vm.password.length < 5) {
          const alertregis = await alertController.create({
            cssClass: "my-custom-class",
            header: "Registrasi Gagal!",
            message: "username / password tidak sesuai syarat",
            buttons: [
              {
                text: "Ok",
              },
            ],
          });
          return alertregis.present();
        } else {
          const alertregis = await alertController.create({
            cssClass: "my-custom-class",
            header: "Registrasi Gagal!",
            message: res.response.message,
            buttons: [
              {
                text: "Ok",
              },
            ],
          });
          return alertregis.present();
        }
      }
      // } else {

      // }
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
              vm.$router.push("/");
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
.registerBox {
  margin: 20% auto;
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 12px;
  height: 350px;
  border-radius: 8px;
  transform: translateY(18px);
  box-shadow: 1px 1px 10px rgba(56, 128, 255, 0.25);
  transition: 0.3s ease-out;
}
.registerBox:hover {
  transform: translateY(-18px);
  transition: 0.3s ease-in;
  box-shadow: 10px 10px 10px rgba(56, 128, 255, 0.25);
}
.registerBox h1 {
  text-align: center;
  margin-top: 4px;
}
.registerBox p {
  font-size: 14px;
  text-align: center;
  color: white;
  cursor: pointer;
}

#text-home,
#button-home {
  display: flex;
  justify-content: space-around;
  margin: auto;
  width: 85%;
}
#button-home {
  margin-top: 50px;
}
.my2 {
  margin-left: 5px;
}
</style>
