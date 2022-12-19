<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSearch" @reset="onSearchReset" class="q-gutter-md">
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

      <div>
        <q-btn
          label="Search Transaction Details"
          type="submit"
          color="positive"
        />
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
  <div class="q-pa-md">
    <q-table
      class="my-sticky-virtscroll-table"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      title="Transactions"
      :rows="rows"
      :columns="columns"
      :separator="separator"
      :loading="loading"
    />
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    const trxID = ref(null);
    const columns = [
      {
        name: "index",
        label: "#",
        field: "index",
      },
      {
        name: "username",
        required: true,
        label: "Username",
        align: "left",
        field: (row) => row.username,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "walletNumber",
        align: "center",
        label: "Wallet Number",
        field: "walletNumber",
        sortable: true,
      },
      {
        name: "paymentID",
        label: "Payment ID",
        field: "paymentID",
        sortable: true,
      },
      { name: "amount", label: "Amount", field: "amount" },
      { name: "currency", label: "Currency", field: "currency" },
      {
        name: "transactionID",
        label: "Transaction ID",
        field: "transactionID",
        sortable: true,
      },
      {
        name: "invoiceNumber",
        label: "Invoice Number",
        field: "invoiceNumber",
        sortable: true,
      },
      {
        name: "status",
        label: "Status",
        field: "status",
      },
      {
        name: "initiatedAt",
        label: "Initiated At",
        field: "initiatedAt",
        sortable: true,
      },
      {
        name: "executedAt",
        label: "Executed At",
        field: "executedAt",
        sortable: true,
      },
      {
        name: "refundStatus",
        label: "Refund Status",
        field: "refundStatus",
      },
      {
        name: "refundTrxID",
        label: "Refund Transaction ID",
        field: "refundTrxID",
      },
      {
        name: "refundAmount",
        label: "Refund Amount",
        field: "refundAmount",
      },
    ];
    let rows = ref([]);

    let seed = [];

    const fetchTransactions = async () => {
      const transactions = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/transactions/fetch`
      );
      seed = transactions.data.transactions;
      rows.value = rows.value.concat(seed.slice(0).map((r) => ({ ...r })));
      rows.value.forEach((row, index) => {
        row.index = index;
      });
      loading.value = false;
    };
    const onSearch = async () => {
      $q.loading.show({
        message: "Please wait while we process your request",
        boxClass: "bg-grey-3 text-grey-9",
        spinnerColor: "dark",
      });
      const searched = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/transactions/search`,
        {
          trxID: trxID.value,
        },
        {
          withCredentials: true,
        }
      );
      if (searched.data.success == true) {
        $q.loading.hide();

        $q.dialog({
          title: "Transaction Details",
          message: `
                  trxID: ${searched.data.transaction.trxID}<br/>
                  initiationTime: ${searched.data.transaction.initiationTime}<br/>
                  completedTime: ${searched.data.transaction.completedTime}<br/>
                  customerMsisdn: ${searched.data.transaction.customerMsisdn}<br/>
                  transactionStatus: ${searched.data.transaction.transactionStatus}<br/>
                  amount: ${searched.data.transaction.amount}<br/>
                  currency: ${searched.data.transaction.currency}
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
          message: searched.data.error.message,
          type: "negative",
        });
      }
    };

    const onSearchReset = () => {
      trxID.value = null;
    };

    return {
      loading,
      trxID,
      columns,
      rows,
      separator: ref("vertical"),
      pagination: ref({
        rowsPerPage: 20,
      }),
      fetchTransactions,
      onSearch,
      onSearchReset,
    };
  },
  async created() {
    try {
      await this.fetchTransactions();
    } catch (error) {
      return error;
    }
  },
};
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
