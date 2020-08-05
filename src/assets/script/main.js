class Student {
  constructor(name) {
    this.name = name,
    this.info = {}
  }

  async getInfo() {
    const data = await { name: this.name }
    return data
  }

  setInfo(data = {}) {
    this.info = { ...this.info, ...data }
  }
}