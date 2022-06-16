<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg" />
          <div class="userinfo">
            <p v-if="username==='admin'?1:0" class="name">admin</p>
            <p v-else class="name">{{username}}</p>
           
            <p v-if="$store.state.user.username === 'admin'" class="access">
              超级管理员
            </p>
            <p v-else class="access">员工</p>
          </div>
        </div>
        <div class="login-info">
          <p>
            当前登录的时间:<span>{{ loginTime }}</span>
          </p>
          <p>当前登录的地点:<span>桂林</span></p>
        </div>
      </el-card>
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col style="margin-top: 20px" :span="16">
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            :style="{ background: item.color }"
          ></i>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px">
        <div style="height: 280px" ref="charts"></div>
      </el-card>
      <div class="graph">
        <el-card style="height: 260px">
          <div style="height: 240px" ref="userEcharts"></div>
        </el-card>
        <el-card style="height: 260px">
          <div style="height: 240px" ref="vidioEcharts"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import moment from "moment";
import * as echarts from "echarts";

export default {
  name: "home",
  data() {
    return {
      userImg: require("@/assets/images/user_img.jpg"),
      countData: [
        {
          name: "今日支付订单",
          value: 999,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 50,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单",
          value: 180,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单",
          value: 2453,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "本月收藏订单",
          value: 1542,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单",
          value: 2400,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
      tableData: [
        {
          name: "米饭",
          todayBuy: 100,
          monthBuy: 300,
          totalBuy: 500,
        },
        {
          name: "王老吉",
          todayBuy: 100,
          monthBuy: 400,
          totalBuy: 600,
        },
        {
          name: "清蒸河鲜海鲜",
          todayBuy: 20,
          monthBuy: 100,
          totalBuy: 400,
        },
        {
          name: "老火靓汤",
          todayBuy: 45,
          monthBuy: 100,
          totalBuy: 300,
        },
        {
          name: "上汤焗龙虾",
          todayBuy: 34,
          monthBuy: 100,
          totalBuy: 200,
        },
        {
          name: "北冰洋",
          todayBuy: 34,
          monthBuy: 100,
          totalBuy: 150,
        },
      ],
      orderData: [],
      tableLabel: {
        name: "菜品",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      orderlist: [],
      totalMoney: 0,
    };
  },
  created() {
    this.$store.dispatch("user/getInfo");
    this.init();
  },
  mounted() {
    this.$API.order.getData().then((res) => {
      const { data } = res.data;
      console.log(res);
      if (res.code === 20000) {
        const order = res.data.orderData;

        const xData = order.date;
        const KeyArr = Object.keys(order.data[0]);
        const series = [];
        KeyArr.forEach((key) => {
          series.push({
            name: key,
            data: order.data.map((item) => item[key]),
            type: "line",
          });
        });
        const options = {
          xAxis: {
            data: xData,
          },
          yAxis: {},
          legend: {
            data: KeyArr,
          },
          series,
        };
        const E = echarts.init(this.$refs.charts);
        E.setOption(options);
        //用户图
        const userOption = {
          legend: {
            //图例文字颜色
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            left: "20%",
          },
          //提示框
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: res.data.userData.map((item) => item.date),
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
            axisLabel: {
              interval: 0,
              color: "#333",
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
          color: ["#2ec7c9", "#b6a2de"],
          series: [
            {
              name: "新增用户",
              data: res.data.userData.map((item) => item.new),
              type: "bar",
            },
            {
              name: "活跃用户",
              data: res.data.userData.map((item) => item.active),
              type: "bar",
            },
          ],
        };
        const EA = echarts.init(this.$refs.userEcharts);
        EA.setOption(userOption);
        const video = {
          tooltip: {
            trigger: "item",
          },
          color: [
            "#0f78f4",
            "#dd536b",
            "#9462e5",
            "#e1bb22",
            "#39c362",
            "#3ed1cf",
          ],
          series: [
            {
              data: res.data.videoData,
              type: "pie",
            },
          ],
        };
        const EB = echarts.init(this.$refs.vidioEcharts);
        EB.setOption(video);
      }
    });
  },
  computed: {
    loginTime() {
      let date = +new Date();

      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    username() {
      return this.$store.state.user.username;
    },
    // todayMoney() {
    //   let sum = 0;
    //   this.orderInfoList.forEach((item) => {
    //     if (item.status > 1 && item.status < 5) {
    //       sum += item.amount;
    //     }
    //   });

    //   return sum;
    // },
  },
  methods: {
    async init() {
      this.$API.order
        .getOrderDetailPage({
          page: 1,
          pageSize: 999,
          number: this.input || undefined,
          beginTime: this.beginTime || undefined,
          endTime: this.endTime || undefined,
        })
        .then((res) => {
          if (String(res.code) === "200") {
            this.orderlist = res.data.records || [];
            let unPayPrice = 0;
            this.orderlist.forEach((item) => {
              if (item.status > 1 && item.status < 5) {
                this.totalMoney += item.amount;
              }

              if (item.status === 1 || item.status === 5) {
                unPayPrice += item.amount;
              }
            });
            this.countData[0].value = this.totalMoney;
            this.countData[3].value = this.totalMoney;
            this.countData[2].value = unPayPrice;
            this.countData[5].value = unPayPrice;
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
  },
};
</script>

<style>
</style>