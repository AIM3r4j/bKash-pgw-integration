<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section> Locked </q-card-section>
      <q-separator />
      <q-card-section class="text-h6"
        >Pay <span class="text-bold">{{ price }}</span
        >TK to unlock the slot</q-card-section
      >
      <q-separator />
      <q-card-section>
        Please select your preferred payment option:
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions vertical align="evenly">
        <q-btn color="dark" label="Pay with Card" @click="onCardClick" />
        <q-btn color="dark" label="Pay with bKash" @click="onBkashClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";

import { useDialogPluginComponent, useQuasar } from "quasar";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    // ...your custom props
    price: String,
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    // REQUIRED; must be called inside of setup()
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onCardClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // $q.loading.show({
        //   message: "Please wait while we process your request",
        //   boxClass: "bg-grey-3 text-grey-9",
        //   spinnerColor: "dark",
        // });
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      async onBkashClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)

        $q.loading.show({
          message: "Please wait while we process your request",
          boxClass: "bg-grey-3 text-grey-9",
          spinnerColor: "dark",
        });
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically

        const response = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/payment/create`,
          {
            product_price: props.price,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.success == true) {
          window.location = response.data.bkashURL;
        } else {
          $q.loading.hide();
          $q.notify({
            message: response.data.error.message,
            type: "negative",
          });
        }
      },
    };
  },
});
</script>
