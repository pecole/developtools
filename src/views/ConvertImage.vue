<template>
  <div class="home">
    <div class="receiving-box-outer">
      <div
        class="receiving-box-inner"
        @dragover.prevent
        @drop.prevent="dropFile"
      >
        画像をドラッグ＆ドロップしてください
      </div>
    </div>
  </div>
  <div class="input-container">
    <input
      class="input-text"
      type="number"
      placeholder="横幅"
      v-model="state.width"
    />
    <input
      class="input-text"
      type="number"
      placeholder="高さ"
      v-model="state.height"
    />
    <SelectBox
      label="ファイル形式"
      :items="fileFormats"
      v-model="state.selectedFormat"
    />
  </div>
  <button @click="generate">生成</button>
  <div v-show="state.image">
    <img
      :src="state.image"
      alt=""
      srcset=""
      :width="state.width"
      :height="state.height"
      loading="lazy"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import SelectBox from "@/components/SelectBox.vue";

const fileFormats = ["webp", "jpeg", "png"];

interface State {
  file: File | null;
  image: string | ArrayBuffer | null;
  width: string;
  height: string;
  selectedFormat: string;
}

export default defineComponent({
  name: "Home",
  components: { SelectBox },
  setup() {
    const state = reactive<State>({
      file: null, // ファイルオブジェクト
      image: null, // プレビュー用イメージ
      width: "", // 横幅
      height: "", // 縦幅
      selectedFormat: "webp", // 選択中フォーマット
    });

    // drag file
    const dropFile = async (e: any) => {
      if (!e.dataTransfer.files || !(e.dataTransfer.files[0] instanceof File)) {
        return;
      }
      const file = e.dataTransfer.files[0];
      let isAcceptType = false;
      switch (file.type) {
        case "image/jpeg":
        case "image/webp":
        case "image/png":
          isAcceptType = true;
          break;
      }
      if (!isAcceptType) {
        alert("このファイルは変換できません。");
        return;
      }
      const { width, height } = await imageSize(file);
      state.width = width;
      state.height = height;
      state.file = file;
      createImage(file);
    };

    const changeFile = async (e: any) => {
      if (e.target.files.length) {
        state.file = e.target.files[0];
        createImage(e.target.files[0]);
        const data = await (window as any).api.convertImage(state.file);
      }
    };

    // file -> iamge
    const createImage = (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        state.image = reader.result;
      };
    };

    // get image size
    const imageSize = async (file: File): Promise<any> => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          const size = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };

          URL.revokeObjectURL(img.src);
          resolve(size);
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.src = URL.createObjectURL(file);
      });
    };

    // convert file
    const generate = async () => {
      if (!validate) {
        alert("入力内容に不備があります");
        return;
      }
      const buf = await state.file?.arrayBuffer();
      const req = [buf, state.selectedFormat, state.width, state.height];
      const data = await (window as any).api.convertImage(req);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([data], { type: "image/" + state.selectedFormat })
      );
      link.download = "";
      link.click();
    };

    const validate = (): boolean => {
      if (!state.width && !state.height) {
        // 横幅、高さの両方が未入力
      }
      return true;
    };

    return {
      state,
      changeFile,
      fileFormats,
      dropFile,
      generate,
    };
  },
});
</script>
<style lang="scss" scoped>
.input-container {
  display: flex;
  width: 100%;
}

.input-text {
  width: 100%;
  margin: 5px;
  padding: 8px;
  // border-radius: 5px 5px 5px 5px;
}

.receiving-box-outer {
  display: table;
  width: 100%;
  padding: 15px 0;
}
.receiving-box-inner {
  height: 230px;
  color: #777;
  border: 10px dashed #aaa;
  border-radius: 10px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
</style>