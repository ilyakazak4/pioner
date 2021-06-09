const app = Vue.createApp({
  data: () => ({
    loading: false,
    entry: {},
    addedToCart: false,

  }),
  methods: {
    addToCart() {
      if (this.addedToCart) return
      let count = 1
      const oldCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const entry = oldCart.find(e => e.id === this.entry.id)
      if (entry) {
        count = entry.count + 1
        localStorage.setItem(
          'cart',
          JSON.stringify(
            oldCart.map(e => {
              if (e.id === entry.id) {
                return {
                  ...e,
                  count: e.count + 1,
                }
              }
              return e
            })
          )
        )
      } else {
        localStorage.setItem(
          'cart',
          JSON.stringify([...oldCart, { ...this.entry, count }])
        )
      }

      this.addedToCart = true
    },
    async getEntry() {
      const id = window.location.search.substr(4)
      this.loading = true
      const res = await (
        await fetch(
          'https://cdn.contentful.com/spaces/35uubkt99ycg/environments/master/entries?access_token=Dhg4LaFrl92FTteb27356BPnCiCBNvn65rqccz8ELOQ&content_type=product'
        )
      ).json()
      const item = res.items.find(({ sys }) => sys.id === id)
      const { fields, sys } = item
      this.entry = {
        ...fields,
        id: sys.id,
        image: res.includes.Asset.find(
          asset => asset.sys.id === fields.image.sys.id
        ).fields.file.url,
        specifications: fields.specifications.map(
          spec =>
            res.includes.Entry.find(entry => entry.sys.id === spec.sys.id)
              .fields
        ),
        status: res.includes.Entry.find(
          entry => entry.sys.id === fields.status.sys.id
        ).fields.name,
      }
      this.loading = false
    },
  },
  async created() {
    await this.getEntry()
  },
})

app.mount('#app')
