<template>
  <el-container style="height: 100%">
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <CommonHeader></CommonHeader>
      </el-header>
      <common-tag></common-tag>
      <transition name="fade-transform" mode="out-in">
        <el-main>
          <router-view :key="key"></router-view>
        </el-main>
      </transition>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "@/components/CommonAside";
import CommonHeader from "@/components/CommonHeader";
import CommonTag from "@/components/CommonTag";
export default {
  name: "Main",
  components: {
    CommonAside,
    CommonHeader,
    CommonTag,
  },
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: rgb(52, 55, 68);
}
.el-main {
  padding-top: 0;
}
</style>