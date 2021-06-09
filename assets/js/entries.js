const app = Vue.createApp({
  data: () => ({
    loading: false,
    entries: [],
  }),
  methods: {
    async getEntries() {
      this.loading = true
      const res = await (
        await fetch(
          'https://cdn.contentful.com/spaces/35uubkt99ycg/environments/master/entries?access_token=Dhg4LaFrl92FTteb27356BPnCiCBNvn65rqccz8ELOQ&content_type=product'
        )
      ).json()
      this.entries = res.items.map(({ fields, sys }) => ({
        ...fields,
        id: sys.id,
        image: res.includes.Asset.find(
          asset => asset.sys.id === fields.image.sys.id
        ).fields.file.url,
      }))
      this.loading = false
    },
  },
  async created() {
    await this.getEntries()
  },
})

app.mount('#app')
