<template>
  <div>
    <div v-show="isShowTable">
      <div class="dashboard-container" id="member-app">
        <div class="container">
          <div class="tableBar">
            <el-input
              v-model="memberList.input"
              placeholder="请输入员工姓名"
              style="width: 250px"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer"
                @click="handleQuery"
              ></i>
            </el-input>
              <div>

             
              <el-button
                
                type="primary"
                @click="addMemberHandle('add')"
              >
                + 添加员工
              </el-button>
              <el-button type="success">
                <download-excel
                class="blueBtn"
                :data="memberList.tableData"
                :fields="json_fields"
                worksheet="My Worksheet"
                name="员工信息表"
              >
                导出Excel<i class="el-icon-download el-icon--right"></i>
              </download-excel>
              </el-button>
             </div>
          </div>
          <el-table :data="memberList.tableData" stripe class="tableBox">
            <el-table-column prop="name" label="员工姓名"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column label="账号状态">
              <template slot-scope="scope">
                {{ String(scope.row.status) === "0" ? "已禁用" : "正常" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  class="blueBug"
                  @click="addMemberHandle(scope.row.id)"
                  :class="{ notAdmin: user !== 'admin' }"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  class="delBut non"
                  @click="statusHandle(scope.row)"
                  v-if="user === 'admin'"
                >
                  {{ scope.row.status == "1" ? "禁用" : "启用" }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pageList"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="memberList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="memberList.counts"
            :current-page.sync="memberList.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div v-show="!isShowTable">
      <div class="addBrand-container" id="member-add-app">
        <div class="container">
          <el-form
            ref="ruleForm"
            :model="memberOption.ruleForm"
            :rules="rules"
            :inline="false"
            label-width="180px"
            class="demo-ruleForm"
          >
            <el-form-item label="账号:" prop="username">
              <el-input
                v-model="memberOption.ruleForm.username"
                placeholder="请输入账号"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="员工姓名:" prop="name">
              <el-input
                v-model="memberOption.ruleForm.name"
                placeholder="请输入员工姓名"
                maxlength="20"
              />
            </el-form-item>

            <el-form-item label="手机号:" prop="phone">
              <el-input
                v-model="memberOption.ruleForm.phone"
                placeholder="请输入手机号"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="memberOption.ruleForm.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idNumber">
              <el-input
                v-model="memberOption.ruleForm.idNumber"
                placeholder="请输入身份证号"
                maxlength="20"
              />
            </el-form-item>
            <div class="subBox address">
              <el-form-item>
                <el-button type="danger" @click="goBack"> 取消 </el-button>
                <el-button
                  type="primary"
                  @click="submitForm('ruleForm', false)"
                >
                  保存
                </el-button>
                <el-button
                  v-if="memberOption.actionType == 'add'"
                  type="success"
                  class="continue"
                  @click="submitForm('ruleForm', true)"
                >
                  保存并继续添加
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkUserName,
  checkName,
  checkPhone,
  validID,
} from "@/utils/validate";

export default {
  name: "test",
  data() {
    return {
      memberList: {
        input: "",
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData: [],

        status: "",
      },
      memberOption: {
        actionType: "",
        ruleForm: {
          name: "",
          phone: "",
          sex: "男",
          idNumber: "",
          username: "",
        },
      },
      json_fields:{
        '员工姓名':'name',
        '账号':'username',
        '手机号':'phone',
        '账号状态':'status',
        '注册时间':'createTime'

      },
      //控制table表格显示与隐藏的
      isShowTable: true,
      id: "",
    };
  },
  mounted() {
    this.init();
    this.user = this.$store.state.user.username;
  },
  methods: {
    async init() {
      const params = {
        page: this.memberList.page,
        pageSize: this.memberList.pageSize,
        name: this.memberList.input ? this.memberList.input : undefined,
      };
      await this.$API.member
        .getMemberList(params)
        .then((res) => {
          if (String(res.code) === "200") {
            this.memberList.tableData = res.data.records || [];

            this.memberList.counts = res.data.total;
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    handleQuery() {
      this.memberList.page = 1;
      this.init();
    },
    //添加员工
    addMemberHandle(st) {
      if (st === "add") {
        this.$refs.ruleForm.resetFields();
        this.isShowTable = false;
        this.memberOption.actionType = "add";
        this.ruleForm = {
          username: "",
          name: "",
          phone: "",
          // 'password': '',
          // 'rePassword': '',/
          sex: "男",
          idNumber: "",
          
        };
        //添加员工
      } else {
        this.isShowTable = false;
        //或者修改员工
        this.memberOption.actionType = "edit";
        this.id = st;
        this.initOption();
      }
    },
    //状态修改
    statusHandle(row) {
      this.id = row.id;
      this.memberList.status = row.status;
      this.$confirm("确认调整该账号的状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.member
            .enableOrDisableEmployee({
              id: this.id,
              status: !this.memberList.status ? 1 : 0,
            })
            .then((res) => {
              console.log("enableOrDisableEmployee", res);
              if (String(res.code) === "200") {
                this.$message.success("账号状态更改成功！");
                this.handleQuery();
              }
            })
            .catch((err) => {
              this.$message.error("请求出错了：" + err);
            });
        })
        .catch((error) => {
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    //每页数量发生改变的监听
    handleSizeChange(val) {
      this.memberList.pageSize = val;
      this.init();
    },
    //当前页改变
    handleCurrentChange(val) {
      this.memberList.page = val;
      this.init();
    },
    async initOption() {
      this.$API.member.queryEmployeeById(this.id).then((res) => {
        if (String(res.code) === "200") {
          console.log(res.data);
          this.memberOption.ruleForm = res.data;
          this.memberOption.ruleForm.sex = res.data.sex === "0" ? "女" : "男";
          // this.ruleForm.password = ''
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      });
    },
    goBack() {
      //取消 返回列表页
      this.isShowTable = true;
    },
    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.memberOption.actionType === "add") {
            const params = {
              ...this.memberOption.ruleForm,
              sex: this.memberOption.ruleForm.sex === "女" ? "0" : "1",
            };
            this.$API.member
              .addEmployee(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("员工添加成功！");
                  this.init();
                  if (!st) {
                    this.goBack();
                  } else {
                    this.ruleForm = {
                      username: "",
                      name: "",
                      phone: "",
                      // 'password': '',
                      // 'rePassword': '',/
                      sex: "男",
                      idNumber: "",
                    };
                  }
                } else {
                  this.$message.error(res.msg || "操作失败");
                }
              })
              .catch((err) => {
                this.$message.error("请求出错了：" + err);
              });
          } else {
            const params = {
              ...this.memberOption.ruleForm,
              sex: this.memberOption.ruleForm.sex === "女" ? "0" : "1",
            };
            this.$API.member
              .editEmployee(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("员工信息修改成功！");
                  this.init();
                  this.goBack();
                } else {
                  this.$message.error(res.msg || "操作失败");
                }
              })
              .catch((err) => {
                this.$message.error("请求出错了：" + err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },

  computed: {
    rules() {
      return {
        //账号
        username: [
          {
            required: true,
            validator: checkUserName,
            trigger: "blur",
          },
        ],
        //姓名
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        idNumber: [{ required: true, validator: validID, trigger: "blur" }],
      };
    },
  },
};
</script>

<style lang="less" scoped>
#member-app .notAdmin::after {
  border: 0 !important;
}
</style>
