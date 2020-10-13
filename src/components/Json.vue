<template>
  <div class="index">
    <div class="text">
      <textarea v-model="text"></textarea>
      <div class="input">
        <div class="item">
          <div>对象名：</div>
          <input v-model="dataName" />
        </div>
        <div class="item">
          <div>分类名：</div>
          <input v-model="categoryName" />
        </div>
        <div class="item">
          <div>分类翻译：</div>
          <input v-model="categoryTranslate" />
        </div>
        <div class="item">
          <div>语音对象：</div>
          <input v-model="voiceListName" />
        </div>
        <div class="item">
          <div>Name：</div>
          <input v-model="voiceName" />
        </div>
        <div class="item">
          <div>Path：</div>
          <input v-model="voicePath" />
        </div>
        <div class="item">
          <div>语音翻译：</div>
          <input v-model="voiceTranslate" />
        </div>
        <div class="item">
          <div>中文翻译：</div>
          <input v-model="zhTranslate" />
        </div>
        <div class="item">
          <div>日文翻译：</div>
          <input v-model="jaTranslate" />
        </div>
        <div class="item">
          <div>英文翻译：</div>
          <input v-model="enTranslate" />
        </div>
      </div>
    </div>
    <textarea class="result" v-model="result"></textarea>
    <button @click="check">校验</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const text = ref('')

    const dataName = ref('groups')
    const categoryName = ref('group_name')
    const categoryTranslate = ref('group_description')
    const voiceListName = ref('voice_list')
    const voiceName = ref('name')
    const voicePath = ref('path')
    const voiceTranslate = ref('description')
    const zhTranslate = ref('zh')
    const jaTranslate = ref('ja')
    const enTranslate = ref('en')

    const result = ref('')

    const format = (data) => {
      const temp = {
        category: [],
        voices: []
      }
      const list = dataName.value ? data[dataName.value] : data
      list.forEach(i => {
        temp.category.push({
          name: i[categoryName.value],
          translate: {
            'zh-CN': i[categoryTranslate.value][zhTranslate.value],
            'ja-JP': i[categoryTranslate.value][jaTranslate.value],
            'en-US': i[categoryTranslate.value][enTranslate.value]
          }
        })
        i[voiceListName.value].forEach(j => {
          temp.voices.push({
            name: j[voiceName.value],
            path: j[voicePath.value],
            translate: {
              'zh-CN': j[voiceTranslate.value][zhTranslate.value],
              'ja-JP': j[voiceTranslate.value][jaTranslate.value],
              'en-US': j[voiceTranslate.value][enTranslate.value]
            },
            category: i[categoryName.value]
          })
        })
      })
      result.value = JSON.stringify(temp, null, 2)
    }

    const check = () => {
      try {
        format(JSON.parse(text.value))
      } catch (e) {
        console.error('校验失败', e)
      }
    }

    return {
      dataName,
      categoryName,
      categoryTranslate,
      voiceListName,
      voiceName,
      voicePath,
      voiceTranslate,
      zhTranslate,
      jaTranslate,
      enTranslate,
      text,
      result,
      check
    }
  }
}
</script>

<style lang="stylus" scoped>
.index
  display flex
  flex-direction column
  width 100vw
  height 100vh

  .text
    display flex
    flex-wrap wrap
    margin 10px

    textarea
      flex-grow 5
      flex-shrink 0
      height 210px

    .input
      flex 1 0 200px
      display flex
      flex-direction column
      margin 5px

      .item
        display flex

        div
          flex 0 0 80px

        input
          width 100%

  .result
    flex 1
    margin 0 10px 10px 10px

  button
    margin 0 10px 10px 10px
</style>
