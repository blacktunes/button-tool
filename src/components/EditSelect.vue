<template>
  <div>
    <select v-model="select" @change="selectChange">
      <option></option>
      <template v-for="(item, index) in data.category" :key="item.name + index">
        <option>{{item.name}}</option>
      </template>
    </select>
  </div>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const data = inject('data')

    const select = ref(props.category)

    const selectChange = () => {
      for (const i in data.voices) {
        if (data.voices[i].name === props.name) {
          data.voices[i].category = select.value
          break
        }
      }
    }

    return {
      select,
      data,
      selectChange
    }
  }
}
</script>

<style lang="stylus" scoped></style>
