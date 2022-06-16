<template >
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    
    text-color="#fff"
    :active-text-color="variables.menuActiveText"
    :background-color="variables.menuBg"
    
  >
  

   <div class="logo" v-if="isCollapse?false:true">
            <!-- <img src="images/logo.png" width="122.5" alt="" /> -->
            <img src="@/assets/images/logo11.png" alt="" style="width: 120px; height: 120px;border-radius:60px" />
    </div>
    <div class="text" v-else>
        <h3 >后台</h3>
    </div>

    <el-menu-item
      v-for="item in noChildren"
      :index="item.path"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasChildren" :key="item.path" :index="item.path">
      <template slot="title">
        <i :class="'el-icon-'+item.path"></i>
        <span slot="title">{{item.label}}</span>
      </template>
      <el-menu-item-group v-for="(subItem,subIndex) in item.children " :key="subItem.path">
        <el-menu-item @click="clickMenu(subItem)" :index="subIndex">{{subItem.label}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>

import {mapState} from 'vuex'
import variables from '@/styles/variables.scss'
export default {
  data() {
    return {
      menu: [
       /*  {
          path: "/",
          name: "home",
          label: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/member",
          name: "menber",
          label: "员工管理",
          url: "Member/Member",
          icon: "s-custom",
        },
        {
          path: "/category",
          name: "category",
          label: "分类管理",
          url: "Category/Category",
          icon: "menu",
        },
        {
          path: "/food",
          name: "food",
          label: "菜品管理",
          url: "Food/Food",
          icon: "dish",
        },
        {
          path: "/combo",
          name: "combo",
          label: "套餐管理",
          url: "Combo/Combo",
          icon: "suitcase",
        },
        {
          path: "/order",
          name: "order",
          label: "订单明细",
          url: "Order/Order",
          icon: "document",
        }, */
      ],
      

    };
  },
 
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item){
      
       this.$router.push({
           name:item.name
       })
       this.$store.commit('selectMenu',item) //item对应{path...}  添加对应的路由到tabsList中以便CommonTag操作
    }
  },
  computed: {
    noChildren() {
      return this.asyncMenu.filter((item) => !item.children);
    },
    hasChildren() {
      return this.asyncMenu.filter((item) => item.children);
    },
    ...mapState({
        isCollapse:(state)=>state.tab.isCollapse
    }),
    asyncMenu(){
      return this.$store.state.tab.menu
    },
    activeMenu() {
      const route = this.$route
      const { path } = route
      // if set path, the sidebar will highlight the path you set
      
      return path
    },
     variables() {
      return variables
    },
  },
};
</script>

<style lang="less" scoped>
el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.logo {
  text-align: center;
  background-color: rgb(52, 55, 68);
  /* height: 100px;
  line-height: 100px;
  padding: 12px 5px; */
  padding: 46px 37px 67px 36px;
}
.img {
  display: inline-block;
  
}
.el-menu{
    height: 100%;
    border: none;
    background-color: rgb(52, 55, 68);
     &:not(.el-menu--collapse) { // 这里是解决点击收起展开按钮时的文字卡顿现象
                width: 200px;
            }  
}
h3{
 
  color: #ccc;
  width: 64px ;
  height: 56px;
  line-height: 56px;
  vertical-align: middle;
}
.text{
  text-align: center;
  
}

</style>

