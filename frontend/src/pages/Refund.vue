<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onRefundSubmit" @reset="onRefundReset" class="q-gutter-md">
      <q-input
        filled
        v-model="paymentID"
        label="Payment ID"
        hint="Enter the Payment ID"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the Payment ID',
        ]"
      />
      <q-input
        filled
        v-model="trxID"
        label="Transaction ID"
        hint="Enter the Transaction ID"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the Transaction ID',
        ]"
      />

      <q-input
        filled
        type="number"
        v-model="amount"
        label="Amount"
        hint="Enter the refund amount"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the refund amount',
        ]"
      />
      <q-input
        filled
        v-model="reason"
        label="Reason"
        hint="Enter the refund reason"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the refund reason',
        ]"
      />
      <q-input
        filled
        v-model="invoiceNumber"
        label="Invoice Number"
        hint="Enter the invoice number"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the invoice number',
        ]"
      />
      <div>
        <q-btn label="Refund" type="submit" color="positive" />
        <q-btn
          label="Clear"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
  <q-separator />
  <div class="q-pa-md" style="max-width: 400px">
    <q-form
      @submit="onRefundStatusSubmit"
      @reset="onRefundStatusReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="refundPaymentID"
        label="Payment ID"
        hint="Enter the Payment ID"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the Payment ID',
        ]"
      />
      <q-input
        filled
        v-model="refundTrxID"
        label="Transaction ID"
        hint="Enter the Transaction ID"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please enter the Transaction ID',
        ]"
      />

      <div>
        <q-btn label="Check Refund Status" type="submit" color="positive" />
        <q-btn
          label="Clear"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar } from "quasar";
import axios from "axios";

export default defineComponent({
  name: "Refund",
  setup() {
    const paymentID = ref(null);
    const trxID = ref(null);
    const amount = ref(null);
    const reason = ref(null);
    const invoiceNumber = ref(null);
    const refundTrxID = ref(null);
    const refundPaymentID = ref(null);

    const $q = useQuasar();

    const onRefundSubmit = async () => {
      $q.loading.show({
        message: "Please wait while we process your request",
        boxClass: "bg-grey-3 text-grey-9",
        spinnerColor: "dark",
      });
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/refund`,
        {
          paymentID: paymentID.value,
          trxID: trxID.value,
          amount: amount.value,
          reason: reason.value,
          invoiceNumber: invoiceNumber.value,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success == true) {
        $q.loading.hide();
        $q.notify({
          message: "Refund Successful",
          type: "positive",
        });
        $q.dialog({
          title: "Refunded Transaction Details",
          message: `
                  originalTrxID: ${response.data.refundedTransaction.originalTrxID}<br/>
                  refundTrxID: ${response.data.refundedTransaction.refundTrxID}<br/>
                  transactionStatus: ${response.data.refundedTransaction.transactionStatus}<br/>
                  amount: ${response.data.refundedTransaction.amount}<br/>
                  currency: ${response.data.refundedTransaction.currency}<br/>
                  charge: ${response.data.refundedTransaction.charge}<br/>
                  completedTime: ${response.data.refundedTransaction.completedTime}
        `,
          persistent: true,
          html: true,
        })
          .onOk(() => {
            refundPaymentID.value = paymentID.value;
            refundTrxID.value = trxID.value;
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } else {
        $q.loading.hide();
        $q.notify({
          message: response.data.error.message,
          type: "negative",
        });
      }
    };

    const onRefundReset = () => {
      paymentID.value = null;
      trxID.value = null;
      amount.value = null;
      reason.value = null;
      invoiceNumber.value = null;
    };

    const onRefundStatusSubmit = async () => {
      $q.loading.show({
        message: "Please wait while we process your request",
        boxClass: "bg-grey-3 text-grey-9",
        spinnerColor: "dark",
      });
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/refund/status`,
        {
          paymentID: refundPaymentID.value,
          trxID: refundTrxID.value,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success == true) {
        $q.loading.hide();
        $q.dialog({
          title: "Refunded Transaction Details",
          message: `
                  originalTrxID: ${response.data.refundedTransactionStatus.originalTrxID}<br/>
                  refundTrxID: ${response.data.refundedTransactionStatus.refundTrxID}<br/>
                  transactionStatus: ${response.data.refundedTransactionStatus.transactionStatus}<br/>
                  amount: ${response.data.refundedTransactionStatus.amount}<br/>
                  currency: ${response.data.refundedTransactionStatus.currency}<br/>
                  charge: ${response.data.refundedTransactionStatus.charge}<br/>
                  completedTime: ${response.data.refundedTransactionStatus.completedTime}
        `,
          persistent: true,
          html: true,
        })
          .onOk(() => {})
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } else {
        $q.loading.hide();
        $q.notify({
          message: response.data.error.message,
          type: "negative",
        });
      }
    };

    const onRefundStatusReset = () => {
      refundPaymentID.value = null;
      refundTrxID.value = null;
    };

    return {
      paymentID,
      trxID,
      amount,
      reason,
      invoiceNumber,
      refundTrxID,
      refundPaymentID,
      onRefundSubmit,
      onRefundReset,
      onRefundStatusSubmit,
      onRefundStatusReset,
    };
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
