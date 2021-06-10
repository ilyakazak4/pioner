const cart = Vue.createApp({
  data: () => ({
    cart: [],
    loading: false,
    email: '',
    error: '',
  }),
  methods: {
    del(id) {
      this.cart = this.cart.filter(entry => entry.id !== id)
    },
    inc(id) {
      this.cart = this.cart.map(entry => {
        if (entry.id === id) {
          return { ...entry, count: entry.count + 1 }
        }
        return entry
      })
    },
    dec(id) {
      this.cart = this.cart.map(entry => {
        if (entry.id === id) {
          return { ...entry, count: entry.count - 1 > 1 ? entry.count - 1 : 1 }
        }
        return entry
      })
    },
    async buy() {
      if (!this.email) return (this.error = 'Введите почту!')
      const cart = this.cart.map(({ id, count }) => ({ id, count }))
      const body = JSON.stringify({
        email: this.email,
        cart,
      })
      this.loading = true
      const res = await (
        await fetch('https://pioner-api.herokuapp.com/order', {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()
      window.open(res.url, '_self')
    },
  },
  watch: {
    cart(value) {
      localStorage.setItem('cart', JSON.stringify(value))
    },
  },
  async created() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
  },
})

cart.mount('#cart')
