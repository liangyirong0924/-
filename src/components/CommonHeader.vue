<template>
  <header>
    <div class="l-content">
      <el-button
        @click="handMenu"
        plain
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- <h3 style="color: #fff">首页</h3> -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item  class="myColor"  v-for=" item in tags" :key="item.path" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
        
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <span class="userInfo" >{{username}}</span>
      <el-dropdown trigger="click" size="mini">
        <span>
          <img class="user" :src="userImg" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="text-align:center" @click.native="go">首页</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "CommonHeader",
  data() {
    return {
      userImg: require("@/assets/images/user_img.jpg"),
    };
  },
  methods: {
    handMenu() {
      this.$store.commit("collapseMenu");
    },
   async logout(){
      await this.$store.dispatch('user/logout')    
      this.$message.success("退出登录成功！")
      this.$store.commit('clearMenu')
      this.$router.push('/login')
    },
    go(){
      this.$router.push({path:'/home'})
    }
  },
  computed:{
    ...mapState({
      tags:state=>state.tab.tabsList
      
    }),
    username(){
      return this.$store.state.user.username;
    }
  
  }
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  display: flex;
  text-align: center;
  
  align-items: center;
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }
}
.myColor /deep/ .el-breadcrumb__inner{
  color: #fff;
}
.userInfo{
  margin-top: 10px;
  margin-right: 10px;
  color: #fff;


}

</style>