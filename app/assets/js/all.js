import userProductModal from './productModal.js'
const apiUrl = 'https://vue3-course-api.hexschool.io/'
const apiPath = 'chiayu'

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loading: '',
      },
      payLoading: false,
      products: [],
      product: {},
      cart: {},
      cartLength: 0,

      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  methods: {
    getData(page = 1) {
      axios
        .get(`${apiUrl}api/${apiPath}/products?page=${page}`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.products = res.data.products
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getProduct(id) {
      this.loadingStatus.loading = id
      axios
        .get(`${apiUrl}api/${apiPath}/product/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.product = response.data.product
            this.loadingStatus.loading = ''
            this.$refs.userProductModal.openModal()
          } else {
            this.loadingStatus.loading = ''
            alert(response.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addToCart(id, qty = 1) {
      this.loadingStatus.loading = id
      let data = {
        data: {
          product_id: id,
          qty,
        },
      }
      this.$refs.userProductModal.hideModal()
      axios
        .post(`${apiUrl}api/${apiPath}/cart`, data)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message)
            this.loadingStatus.loading = ''
            this.getCart()
          } else {
            this.loadingStatus.loading = ''
            alert(response.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getCart() {
      axios
        .get(`${apiUrl}api/${apiPath}/cart`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.cart = res.data.data
            this.cartLength = res.data.data.carts.length
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteCart(id) {
      axios
        .delete(`${apiUrl}api/${apiPath}/cart/${id}`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            this.getCart()
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    deleteAll() {
      axios
        .delete(`${apiUrl}api/${apiPath}/carts`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            this.getCart()
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateCart(id, product_id, qty) {
      console.log(id, qty)
      let data = {
        data: {
          product_id,
          qty,
        },
      }
      axios
        .put(`${apiUrl}api/${apiPath}/cart/${id}`, data)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            this.getCart()
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    onSubmit() {
      this.payLoading = true
      if (this.cart.carts.length <= 0) {
        this.payLoading = false
        alert('購物車是空的喔')
        return
      }
      let data = {
        data: this.form,
      }
      axios
        .post(`${apiUrl}api/${apiPath}/order`, data)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            alert(res.data.message)
            this.getCart()
            this.$refs.form.resetForm()
            this.payLoading = false
          } else {
            alert(res.data.message)
            this.payLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },

  mounted() {
    this.getData()
    this.getCart()
  },
})

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json')

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
})
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule])
  }
})

app.component('userProductModal', userProductModal)
app.component('VForm', VeeValidate.Form)
app.component('VField', VeeValidate.Field)
app.component('ErrorMessage', VeeValidate.ErrorMessage)

app.mount('#app')
