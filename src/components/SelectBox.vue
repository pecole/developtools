<template>
  <div class="container outer-select">
    <select v-model="localValue">
      <option value="" hidden>{{ label }}</option>
      <option v-for="item in items" :key="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

interface State {
  selected: string;
}

export default defineComponent({
  name: "SelectBox",
  props: {
    label: String,
    items: Array,
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const localValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });

    return {
      localValue,
    };
  },
});
</script>
<style lang="scss" scoped>
.container {
  overflow: hidden;
  width: 98%;
  margin: 5px;
  text-align: center;
}
.container select {
  width: 100%;
  //   padding-right: 1em;
  cursor: pointer;
  text-indent: 0.01px;
  text-overflow: ellipsis;
  border: none;
  outline: none;
  background: transparent;
  background-image: none;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
}
.container select::-ms-expand {
  display: none;
}
.container.outer-select {
  position: relative;
  border: 1px solid #bbbbbb;
  border-radius: 2px;
  background: #ffffff;
}
.container.outer-select::before {
  position: absolute;
  top: 0.8em;
  right: 0.9em;
  width: 0;
  height: 0;
  padding: 0;
  content: "";
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #666666;
  pointer-events: none;
}
.container.outer-select select {
  padding: 8px 38px 8px 8px;
  color: #666666;
}
</style>