<template>
  <div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-list bordered separator>
        <q-item clickable>
          <q-item-section style="filter: blur(2px)" class="text-bold">
            Firstname Lastname</q-item-section
          >
          <q-item-section>
            <q-btn
              rounded
              color="dark grey"
              size="sm"
              class="full-width"
              label="Pay to unlock"
              @click="showPaymentDialog"
              type="submit"
            />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section style="filter: blur(2px)" class="text-bold">
            Firstname Lastname</q-item-section
          >
          <q-item-section>
            <q-btn
              rounded
              color="dark grey"
              size="sm"
              class="full-width"
              label="Locked"
              type="submit"
            />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section style="filter: blur(2px)" class="text-bold">
            Firstname Lastname</q-item-section
          >
          <q-item-section>
            <q-btn
              rounded
              color="dark grey"
              size="sm"
              class="full-width"
              label="Locked"
              type="submit"
            />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section style="filter: blur(2px)" class="text-bold">
            Firstname Lastname</q-item-section
          >
          <q-item-section>
            <q-btn
              rounded
              color="dark grey"
              size="sm"
              class="full-width"
              label="Locked"
              type="submit"
            />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section style="filter: blur(2px)" class="text-bold">
            Firstname Lastname</q-item-section
          >
          <q-item-section>
            <q-btn
              rounded
              color="dark grey"
              size="sm"
              class="full-width"
              label="Locked"
              type="submit"
            />
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import PaymentDialog from "src/components/PaymentDialog.vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "Products",
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    if (
      router.currentRoute.value.query.status &&
      router.currentRoute.value.query.paymentID
    ) {
      const status = router.currentRoute.value.query.status;
      const paymentID = router.currentRoute.value.query.paymentID;
      router.push("/products");
      if (status == "success") {
        $q.loading.show({
          message: "Please wait while we process your payment",
          boxClass: "bg-grey-3 text-grey-9",
          spinnerColor: "dark",
        });
        axios
          .post(
            `${import.meta.env.VITE_API_ENDPOINT}/payment/execute`,
            {
              paymentID: paymentID,
            },
            {
              withCredentials: true,
            }
          )
          .then(async (response) => {
            if (response.data.success == true) {
              $q.loading.hide();
              $q.notify({
                message: response.data.message,
                type: "positive",
              });
            } else {
              const queryResponse = await axios.post(
                `${import.meta.env.VITE_API_ENDPOINT}/payment/query`,
                {
                  paymentID: paymentID,
                },
                {
                  withCredentials: true,
                }
              );
              if (queryResponse.data.success == true) {
                $q.loading.hide();
                $q.notify({
                  message: response.data.message,
                  type: "postive",
                });
              } else {
                $q.loading.hide();
                $q.notify({
                  message: response.data.error.message,
                  type: "negative",
                });
              }
            }
          });
      } else if (status == "cancel" || status == "failure") {
        axios
          .post(
            `${import.meta.env.VITE_API_ENDPOINT}/payment/delete`,
            {
              paymentID: paymentID,
              status: status,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.data.success == true) {
              if (status == "cancel") {
                $q.notify({
                  message: "Payment Cancelled",
                  type: "negative",
                });
              } else if (status == "failure") {
                $q.notify({
                  message: "Payment Failed",
                  type: "negative",
                });
              }
            } else {
              $q.notify({
                message: "Unknown Error Occured",
                type: "negative",
              });
            }
          });
      }
    }

    const showPaymentDialog = async () => {
      try {
        $q.dialog({
          component: PaymentDialog,

          // props forwarded to your custom component
          componentProps: {
            text: "something",
            price: "10",
            // ...more..props...
          },
        })
          .onOk(() => {
            console.log("OK");
          })
          .onCancel(() => {
            console.log("Cancel");
          })
          .onDismiss(() => {
            console.log("Called on OK or Cancel");
          });
      } catch (error) {
        return error;
      }
    };

    return { showPaymentDialog };
  },
});
</script>

<style>
.info-note {
  font-family: Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
    Arial, sans-serif;
  background-color: #fcf2d7;
  border-radius: 4px;
  margin: 16px 10px;
  padding: 16px 24px;
  font-size: 1em;
  line-height: 1.35em;
  border-width: 0 5px;
  border-style: solid;
  border-color: #f4cf6a;
  letter-spacing: 0.5px;
}
</style>
