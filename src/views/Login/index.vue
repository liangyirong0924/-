<template>
  <div class="login" id="login-app">
    <div class="login-box">
      <img src="@/assets/images/main-logo.jpg" alt="" />
      <div class="login-form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <div class="login-form-title">
            <img
              src="@/assets/images/main-logo.jpg"
              style="width: 100px; height: 120px"
              alt=""
            />
          </div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
              maxlength="20"
              prefix-icon="el-icon-user-solid"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              maxlength="20"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              class="login-btn"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken1 } from '@/utils/auth';
import {  getInfo } from '@/api/acl/user'
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loading: false,
    };
  },
  computed: {
    loginRules() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error("请输入用户名"));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码必须在6位以上"));
        } else {
          callback();
        }
      };
      return {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      };
    },
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          /*   login(this.loginForm).then(res=>{
            if(res.code==200){
              this.$store.commit('clearMenu')
              let menu=[];
              menu=this.getAdminMenu();
              this.$store.commit('setMenu',menu)
              this.$store.commit('user/setToken',res.data);
              this.$store.commit("addMenu",this.$router)
              this.$router.push({name:"home"})
            }else{
              this.$message.warning(res.msg);
            }
          }) */

          this.loading = true;
          try {
            await this.$store.dispatch("user/login", this.loginForm);
            const token = getToken1();
           await getInfo(token).then((res) => {
             
              const role = res.data.role;
              let menu = this.generateRoutes(role);
              this.$store.commit("setMenu", menu);
              this.$store.commit("addMenu", this.$router);
            });

            this.$router.push({ path: "/home" });
            this.loading = false;
          } catch (error) {
            this.loading = false;
            alert(error.message);
          }

          /*  //按钮会有一个loading效果
          this.loading = true;
          //派发一个action：user/login 带着用户名与密码的载荷
          this.$store.dispatch("user/login", this.loginForm).then(() => {
              this.$store.commit('user/setToken',res.data)
              this.$store.dispatch('user/getInfo')
              const name=this.$store.state.user.name;
              this.$store.commit('clearMenu')
              
              if(name=="admin"){
                this.menu=getAdminMenu();
                
              }else{
               this.menu=getAdminMenu().filters((item,index)=>index!==2);
                 
              }
              console.log(menu);
               this.$store.commit('setMenu',menu)
               this.$store.commit('addMenu',this.$router)
              //登录成功进行路由的跳转
             this.$router.push({ path: this.redirect || '/' })
              //loading效果结束
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });  */
        } else {
          this.loading = false;
          console.log("登录失败!!");
          return false;
        }
      });
    },
    generateRoutes(role) {
      if (role === 0) {
        return [
          {
            path: "/home",
            name: "Home",
            label: "首页",
            icon: "s-home",
            url: "Home/index.vue",
          },
          {
            path: "/member",
            name: "Menber",
            label: "员工管理",
            url: "Member/index.vue",
            icon: "s-custom",
          },
          {
            path: "/category",
            name: "Category",
            label: "分类管理",
            url: "Category/index.vue",
            icon: "menu",
          },
          {
            path: "/food",
            name: "Food",
            label: "菜品管理",
            url: "Food/index.vue",
            icon: "dish",
          },
          {
            path: "/combo",
            name: "Combo",
            label: "套餐管理",
            url: "Combo/index",
            icon: "suitcase",
          },
          {
            path: "/order",
            name: "Order",
            label: "订单明细",
            url: "Order/index",
            icon: "document",
          },
        ];
      } else {
        return [
          {
            path: "/home",
            name: "home",
            label: "首页",
            icon: "s-home",
            url: "Home/index.vue",
          },
          {
            path: "/category",
            name: "Category",
            label: "分类管理",
            url: "Category/index.vue",
            icon: "menu",
          },
          {
            path: "/food",
            name: "Food",
            label: "菜品管理",
            url: "Food/index.vue",
            icon: "dish",
          },
          {
            path: "/combo",
            name: "Combo",
            label: "套餐管理",
            url: "Combo/index",
            icon: "suitcase",
          },
          {
            path: "/order",
            name: "Order",
            label: "订单明细",
            url: "Order/index",
            icon: "document",
          },
        ];
      }
    },
  },
};
</script>

<style scoped>
.body {
  min-width: 1366px;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url(~@/assets/images/main.jpg) no-repeat;
  background-size: 100% 100%;
}
.login-box {
  width: 1000px;
  height: 474.38px;
  border-radius: 8px;
  display: flex;
}

.login-box img {
  width: 60%;
  height: auto;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-form {
  background: #ffffff;
  width: 40%;
  border-radius: 0px 8px 8px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form .el-form {
  width: 214px;
  height: 307px;
}
.login-form .el-form-item {
  margin-bottom: 30px;
}
.login-form .el-form-item.is-error .el-input__inner {
  border: 0 !important;
  border-bottom: 1px solid #fd7065 !important;
  background: #fff !important;
}
.login-form .input-icon {
  height: 32px;
  width: 18px;
  margin-left: -2px;
}
.login-form .el-input__inner {
  border: 0;
  border-bottom: 1px solid #e9e9e8;
  border-radius: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  height: 32px;
  line-height: 32px;
}
.login-form .el-input__prefix {
  left: 0;
}
.login-form .el-input--prefix .el-input__inner {
  padding-left: 26px;
}
.login-form .el-input__inner::placeholder {
  color: #aeb5c4;
}
.login-form .el-form-item--medium .el-form-item__content {
  line-height: 32px;
}
.login-form .el-input--medium .el-input__icon {
  line-height: 32px;
}
.login-btn {
  border-radius: 17px;
  padding: 11px 20px !important;
  margin-top: 10px;
  font-weight: 500;
  font-size: 14px;
  border: 0;
  background-color: #ffc200;
}
.login-btn:hover,
.login-btn:focus {
  /* background: #FFC200; */
  /* color: #ffffff; */
}
.login-form-title {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
.login-form-title .title-label {
  font-weight: 500;
  font-size: 20px;
  color: #333333;
  margin-left: 10px;
}
</style>