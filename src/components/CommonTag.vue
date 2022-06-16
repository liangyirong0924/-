<template>
  <div class="tabs">
    <el-tag
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'Home'"
      :key="tag.name"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
      size="small"
      >{{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getToken1 } from "@/utils/auth";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  mounted() {
    this.beforeUnload();
  },
  methods: {
    changeMenu(item) {
      this.$router.push({ name: item.name });
    },
    handleClose(tag, index) {
      const length = this.tags.length - 1; //原数组的i值
      this.close(tag);
      if (tag.name !== this.$route.name) {
        //当前路由跟当前页面一致 且点击的不是当前路由
        return;
      }
      if (index === length) {
        //向左跳转   //当前路由跟当前页面一致  且点击的不是当前路由
        this.$router.push({
          name: this.tags[index - 1].name,
        });
      } else {
        //向右跳转               //当前路由跟当前页面不一致 且点击的是当前路由
        this.$router.push({
          name: this.tags[index].name,
        });
      }
    },
    ...mapMutations({
      close: "closeTag",
    }),
    //监听页面刷新
    beforeUnload() {
      window.addEventListener("beforeunload", () => {
        let tabViews = this.tags.map((item) => {
          return {
            fullPath: item.fullPath,
            hash: item.hash,
            name: item.name,
            label: item.label,
            path: item.path,
            title: item.title,
            icon: item.icon,
          };
        });

        sessionStorage.setItem("tabViews", JSON.stringify(tabViews));
      });
      let oldViews = JSON.parse(sessionStorage.getItem("tabViews")) || [];      
        if (oldViews.length > 0) {
          this.$store.state.tab.tabsList = oldViews;
        
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tabs {
  padding: 20px;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 15px;
  }
}
</style>
