<template>
  <div v-if="inputShow" class="input">
    <textarea v-model="jsonData"></textarea>
    <button @click="check">校验</button>
  </div>
  <div v-else class="editor">
    <div class="header">
      <button @click="changeShow">
        切换至{{ !showCategory ? "分类" : "语音" }}
      </button>
      <button @click="add">增加{{ showCategory ? "分类" : "语音" }}</button>
      <button @click="dlJson">结果</button>
    </div>
    <table v-if="showCategory">
      <tr>
        <th></th>
        <th>name</th>
        <th>zh-CN</th>
        <th>ja-JP</th>
        <th>en-US</th>
      </tr>
      <template v-for="(item, index) in data.category" :key="data.category.length - index">
        <tr>
          <td>{{ data.category.length - index }}</td>
          <td>
            <input type="text" v-model="item.name" />
          </td>
          <td>
            <input type="text" v-model="item.translate['zh-CN']" />
          </td>
          <td>
            <input type="text" v-model="item.translate['ja-JP']" />
          </td>
          <td>
            <input type="text" v-model="item.translate['en-US']" />
          </td>
        </tr>
      </template>
    </table>
    <table v-else>
      <tr>
        <th></th>
        <th>name</th>
        <th>path</th>
        <th>category</th>
        <th>zh-CN</th>
        <th>ja-JP</th>
        <th>en-US</th>
        <th>title</th>
        <th>time</th>
        <th>url</th>
        <th>pic zh-CN</th>
        <th>pic ja-JP</th>
        <th>pic en-US</th>
      </tr>
      <template v-for="(item, index) in data.voices" :key="data.voices.length - index">
        <tr>
          <td>{{ data.voices.length - index }}</td>
          <td>
            <input type="text" v-model="item.name" />
          </td>
          <td>
            <input
              type="text"
              v-model="item.path"
              @blur.prevent="checkVoice(item.path)"
            />
          </td>
          <td>
            <edit-select :name="item.name" :category="item.category" />
          </td>
          <td>
            <input type="text" v-model="item.translate['zh-CN']" />
          </td>
          <td>
            <input type="text" v-model="item.translate['ja-JP']" />
          </td>
          <td>
            <input type="text" v-model="item.translate['en-US']" />
          </td>
          <td>
            <input type="text" v-model="item.mark['title']" />
          </td>
          <td>
            <input type="text" v-model="item.mark['time']" />
          </td>
          <td>
            <input type="text" v-model="item.mark['url']" />
          </td>
          <td>
            <input
              type="text"
              v-model="item.usePicture['zh-CN']"
              @blur.prevent="checkPic(item.usePicture['zh-CN'])"
            />
          </td>
          <td>
            <input
              type="text"
              v-model="item.usePicture['ja-JP']"
              @blur.prevent="checkPic(item.usePicture['zh-CN'])"
            />
          </td>
          <td>
            <input
              type="text"
              v-model="item.usePicture['en-US']"
              @blur.prevent="checkPic(item.usePicture['zh-CN'])"
            />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { ref, reactive, provide, computed, watch } from 'vue'
import EditSelect from './EditSelect.vue'

export default {
  components: {
    EditSelect
  },
  setup() {
    const inputShow = ref(true)

    const jsonData = ref('')
    const data = reactive({
      category: [],
      voices: []
    })
    provide('data', data)

    const check = () => {
      try {
        const VoiceList = JSON.parse(jsonData.value)
        const voices = []
        VoiceList.voices.forEach(item => {
          if (!item.usePicture) {
            item.usePicture = {}
          }
          if (!item.mark) {
            item.mark = {}
          }
          voices.push(item)
        })
        data.category = VoiceList.category.reverse()
        data.voices = VoiceList.voices.reverse()
        inputShow.value = false
      } catch {
        console.error('校验失败')
      }
    }

    // 是否显示分类
    const showCategory = ref(true)


    const changeShow = () => {
      showCategory.value = !showCategory.value
    }

    const add = () => {
      if (showCategory.value) {
        data.category.unshift({
          name: null,
          translate: {}
        })
      } else {
        data.voices.unshift({
          name: null,
          path: null,
          translate: {},
          usePicture: {},
          category: null,
          mark: {}
        })
      }
    }

    // 需要定义中间变量才能监听到引用的变化值
    const tempData = computed(() => JSON.parse(JSON.stringify(data.category)))

    watch(tempData, (newVal, oldVal) => {
      if (newVal.length === oldVal.length) {
        let oldCategory = null
        let newCategory = null
        for (const i in newVal) {
          if (newVal[i].name !== oldVal[i].name) {
            oldCategory = oldVal[i].name
            newCategory = newVal[i].name
            break
          }
        }
        for (const j in data.voices) {
          if (data.voices[j].category === oldCategory) {
            data.voices[j].category = newCategory
          }
        }
      }
    })

    // 下载JSON文件
    const dlJson = () => {
      const category = []
      const voices = []
      for (const i in data.category) {
        if (data.category[i].name) {
          category.push(data.category[i])
        }
      }
      for (const i in data.voices) {
        if (data.voices[i].name) {
          voices.push(data.voices[i])
        }
      }
      const json = JSON.stringify({
        category: category.reverse(),
        voices: voices.reverse()
      }, null, 2)

      jsonData.value = json
      inputShow.value = true

      // const eleLink = document.createElement('a')
      // eleLink.download = 'voices.json'
      // eleLink.style.display = 'none'
      // // 字符内容转变成blob地址
      // const blob = new Blob([json])
      // eleLink.href = URL.createObjectURL(blob)
      // // 触发点击
      // document.body.appendChild(eleLink)
      // eleLink.click()
      // // 移除DOM
      // document.body.removeChild(eleLink)
    }

    const checkPic = (path) => {
      if (path && !(/\.(?:jpg|png|gif)$/.test(path))) {
        alert(`${path}格式不是正确的文件格式`)
      }
    }
    const checkVoice = (path) => {
      if (path && !(/\.(?:mp3|wav)$/.test(path))) {
        alert(`${path}格式不是正确的文件格式`)
      }
    }

    return {
      inputShow,
      jsonData,
      check,
      data,
      showCategory,
      changeShow,
      add,
      dlJson,
      checkPic,
      checkVoice
    }
  }
}
</script>

<style lang="stylus" scoped>
.input
  display flex
  flex-direction column
  width 100vw
  height 100vh

  textarea
    flex 1
    margin 10px 10px 0 10px

  button
    margin 10px

.editor
  margin 0 10px

  table
    padding-top 30px

    th
      position sticky
      top 35px
      padding 5px 5px 10px 5px
      background #fff

    td
      text-align center

  .header
    position fixed
    top 0
    left 0
    width 100%
    padding 10px
    background #fff
</style>
