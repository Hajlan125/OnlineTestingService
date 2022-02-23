<template>
  <div class="container">
    <vue-tree
        style="width: 1000px; height: 600px; border: 1px solid gray;"
        :dataset="sampleData"
        :config="treeConfig"
    >
      <template v-slot:node="{ node, collapsed }">
        <div
            class="rich-media-node"
            :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <span style="padding: 10px 0; font-weight: bold;"
          >能力值{{ node.q_title }}</span
          >
          <div><button>+</button>
            <button>EDIT</button></div>
        </div>
      </template>
    </vue-tree>
  </div>
</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";

export default {
  mounted() {
    this.$store.dispatch('initExpandQuestions')
  },
  components: {
    VueTree
  },
  name: 'treemap',
  data() {
    return {
      sampleData: this.$store.state.expandQuestions.find(item => item.q_id === 1),

      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rich-media-node {
  width: 105px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  background-color: #0a68b4;
  border-radius: 4px;
}
</style>
