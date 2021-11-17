<template>
  <ion-page>
    <ion-content>
      <ion-row>
        <ion-col>
          <div id="text-welcome">
            <ion-text color="primary">Welcome!</ion-text> <br />
            <ion-text>Please login first to continue.</ion-text>
          </div>
          <img id="img-home" src="../../assets/Group-38.svg" alt="" />
          <ion-text id="text-home">EEG DroMo</ion-text>
          <ion-button
            @click="goToRegister"
            id="button-home"
            expand="block"
            color="primary"
          >
            Create an Account
          </ion-button>

          <div id="line-or">
            <img class="line-black" src="../../assets/line.svg" alt="" /> OR
            <img class="line-black" src="../../assets/line.svg" alt="" />
          </div>
          <div id="text-login">
            <ion-text style="margin-left: 5px"
              ><p>You already have an account?</p></ion-text
            >
            <ion-text color="primary"
              ><p @click="goToLogin()">Login</p></ion-text
            >
          </div>
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
  IonButton,

  IonText,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    IonText,
  },
  setup() {
    const router = useRouter();

    return { router};
  },
  methods: {
    goToLogin() {
      this.$router.replace("/login");
    },
    goToRegister() {
      this.$router.replace("/register");
    },
  },
});
</script>

<style scoped>
.loginBox {
  margin: 45% auto;
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
.loginBox:hover {
  transform: translateY(-18px);
  transition: 0.3s ease-in;
  box-shadow: 10px 10px 10px rgba(56, 128, 255, 0.25);
}
.loginBox h1 {
  text-align: center;
  margin-top: 4px;
}
.loginBox p {
  font-size: 14px;
  text-align: center;
  color: #3880ff;
  cursor: pointer;
}
#img-home {
  display: flex;
  justify-self: center;
  margin: auto;
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
#text-welcome {
  margin-top: 7%;
  margin-left: 5%;
}
#text-login {
  display: flex;
  justify-content: center;
}
#line-or {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 85%;
}
#line-or {
  margin-top: 20px;
}
.line-black {
  margin: 0 20px;
}
.logo1,
.logo2 {
  width: 43px;
  height: auto;
}
#logo {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
