<template>
   <div >
    <div v-show="isShowTable" class="dashboard-container" id="combo-app">
    <div class="container">
      <div class="tableBar">
        <el-input
          v-model="comboList.input"
          placeholder="请输入套餐名称"
          style="width: 250px"
          clearable
          @keyup.enter.native="handleQuery"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer"
            @click="init"
          ></i>
        </el-input>
        <div class="tableLab">
          <span style="color:red" class="span-btn delBut non" @click="deleteHandle('批量')"
            >批量删除</span
          >
          <span style="color:skyblue"  class="span-btn blueBug non" @click="statusHandle('1')"
            >批量启售</span
          >
          <span
            style="border: none;color:red"
            class="span-btn delBut non"
            @click="statusHandle('0')"
            >批量停售</span
          >
          <el-button type="primary" @click="addSetMeal('add')">
            + 新建套餐
          </el-button>
        </div>
      </div>
      <el-table
        :data="comboList.tableData"
        stripe
        class="tableBox"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="25"></el-table-column>
        <el-table-column prop="name" label="套餐名称"></el-table-column>
        <el-table-column prop="image" label="图片" align="center">
          <template slot-scope="{ row }">
            <el-image
              style="width: auto; height: 40px; border: none; cursor: pointer"
              :src="getImage(row.image)"
              :preview-src-list="[`/lyr/api/common/download?name=${row.image}`]"
            >
              <div slot="error" class="image-slot">
                <img
                  src="@/assets/images/noImg.png"
                  style="width: auto; height: 40px; border: none"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="套餐分类"></el-table-column>
        <el-table-column prop="price" label="套餐价">
          <template slot-scope="scope">
            <span>￥{{ (scope.row.price).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status == "0" ? "停售" : "启售" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后操作时间">
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="blueBug"
              @click="addSetMeal(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              type="info"
              size="mini"
              class="blueBug"
              @click="statusHandle(scope.row)"
            >
              {{ scope.row.status == "0" ? "启售" : "停售" }}
            </el-button>
            <el-button
              type="danger"
              size="mini"
              class="delBut non"
              @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="comboList.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="comboList.counts"
        @size-change="handleSizeChange"
        :current-page.sync="comboList.page"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
  <div v-show="!isShowTable" class="addBrand-container" id="combo-add-app">
      <div class="container">
        <el-form
          ref="ruleForm"
          :model="comboOption.ruleForm"
          :rules="rules"
          :inline="true"
          label-width="180px"
          class="demo-ruleForm"
        >
          <div>
            <el-form-item label="套餐名称:" prop="name" >
              <el-input v-model="comboOption.ruleForm.name" placeholder="请填写套餐名称" maxlength="20"/>
            </el-form-item>
            <el-form-item label="套餐分类:" prop="idType">
              <el-select v-model="comboOption.ruleForm.idType" placeholder="请选择套餐分类" @change="$forceUpdate()">
                <el-option v-for="(item, index) in comboOption.setMealList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="套餐价格:" prop="price">
              <el-input v-model="comboOption.ruleForm.price" placeholder="请设置套餐价格" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="套餐菜品:" class="setmealFood">
              <el-form-item>
                <div class="addDish">
                  <span v-if="comboOption.dishTable.length == 0" class="addBut" @click="openAddDish"> + 添加菜品</span>
                  <div v-if="comboOption.dishTable.length != 0" class="content">
                    <div class="addBut" style="margin-bottom: 20px" @click="openAddDish">+ 添加菜品</div>
                    <div class="table">
                      <el-table :data="comboOption.dishTable" style="width: 100%">
                        <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
                        <el-table-column prop="price" label="原价" width="180">
                          <template slot-scope="scope"> {{ Number(scope.row.price).toFixed(2)}} </template>
                        </el-table-column>
                        <el-table-column prop="address" align="center" label="份数" >
                          <template slot-scope="scope">
                            <el-input-number

                              v-model="scope.row.copies"
                              
                              size="small"
                              :min="1"
                              :max="10"
                              label="描述文字"
                            ></el-input-number>
                            
                          </template>
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="180px;" align="center">
                          <template slot-scope="scope">
                            <el-button type="text" size="small" style="color:red" @click="delDishHandle(scope.$index)"> 删除 </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="套餐图片:" class="uploadImg">
              <el-upload
                class="avatar-uploader"
                action="/lyr/api/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-change="onChange"
                ref="upload"
              >
                <img v-if="comboOption.imageUrl" :src="comboOption.imageUrl" class="avatar"></img>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>
          <div class="address">
            <el-form-item label="套餐描述:">
              <el-input v-model="comboOption.ruleForm.description" type="textarea" :rows="3" placeholder="套餐描述，最长200字" maxlength="200"/>
            </el-form-item>
          </div>
          <div class="subBox address">
            <el-form-item>
              <el-button @click="goBack()"> 取消 </el-button>
              <el-button type="primary" @click="submitForm('ruleForm', false)"> 保存 </el-button>
              <el-button
                v-if="comboOption.actionType == 'add'"
                type="primary"
                class="continue"
                @click="submitForm('ruleForm', true)"
              >
                保存并继续添加套餐
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-dialog
        title="添加菜品"
        class="addDishList"
        :visible.sync="comboOption.dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <el-input
          v-model="value"
          class="seachDish"
          placeholder="请输入菜品名称进行搜索"
          style="width: 250px"
          size="small"
          clearable
        >
          <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="seachHandle"></i>
        </el-input>
        <!-- <AddDish ref="adddish" :check-list="checkList" :seach-key="seachKey" @checkList="getCheckList" /> -->
        
        <div class="addDishCon">
          <div class="leftCont">
            <div
              v-show="seachKey.trim() == ''"
              class="tabBut"
            >
              <span
                v-for="(item, index) in comboOption.dishType"
                :key="index"
                :class="{act:index == comboOption.keyInd}"
                @click="checkTypeHandle(index, item.id)"
              >{{ item.name }}</span>
            </div>
            <div class="tabList">
              <div class="table">
                <div v-if="comboOption.dishAddList.length == 0" style="padding-left:10px">
                  暂无菜品!
                </div>
                <el-checkbox-group
                  v-if="comboOption.dishAddList.length > 0"
                  v-model="comboOption.checkedList"
                  @change="checkedListHandle"
                >
                  <div
                    v-for="(item, index) in comboOption.dishAddList"
                    :key="index"
                    class="items"
                  >
                    <el-checkbox
                      :key="index"
                      :label="item"
                    >
                      <div class="item">
                        <span style="flex: 3;text-align: left">{{ item.dishName }}</span>
                        <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                        <span>￥{{ Number(item.price).toFixed(2)}}</span>
                      </div>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <div class="ritCont">
            <div class="tit">
              已选菜品({{ comboOption.checkedList.length }})
            </div>
            <div class="items">
              <div
                v-for="(item, ind) in comboOption.checkedList"
                :key="ind"
                class="item"
              >
                <span>{{ item.dishName }}</span>
                <span class="price">￥ {{ Number(item.price).toFixed(2) }} </span>
                <span
                  class="del"
                  @click="delCheck(ind)"
                >
                  <img
                    src="@/assets/images/btn_clean@2x.png"
                    alt=""
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addTableList">确 定</el-button>
        </span>
      </el-dialog>
    </div>
   </div>
   
</template>

<script>
import "@/assets/less/page.css";
export default {
  name: "Combo",
  data() {
    return {
      comboList: {
        input: "",
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData: [],
        dishState: "",
        checkList: [],
      },
      isShowTable: true,
      id: "",
      seachKey: "",
      value: "",
      comboOption: {
        actionType: "",

        setMealList: [],

        dishList: [],
        imageUrl: "",
        actionType: "",
        dishTable: [],
        dialogVisible: false,
        checkList: [],
        ruleForm: {
          name: "",
          categoryId: "",
          price: "",
          code: "",
          image: "",
          description: "",
          dishList: [],
          status: true,
          idType: "",
        },
        dishType: [],
        dishAddList: [],
        dishListCache: [],
        keyInd: 0,
        searchValue: "",
        checkedList: [],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const params = {
        page: this.comboList.page,
        pageSize: this.comboList.pageSize,
        name: this.comboList.input ? this.comboList.input : undefined,
      };
      await this.$API.combo
        .getSetmealPage(params)
        .then((res) => {
          if (String(res.code) === "200") {
            this.comboList.tableData = res.data.records || [];
            this.comboList.counts = res.data.total;
          }
        })
        .catch((err) => {
          this.$message.error("请求出错了：" + err);
        });
    },
    getImage(image) {
      return `/lyr/api/common/download?name=${image}`;
    },
    handleQuery() {
      this.comboList.page = 1;
      this.init();
    },
    // 添加
    addSetMeal(st) {
      this.getDishTypeList();
      this.getDishType();
      if (st === "add") {
        this.$refs.ruleForm.resetFields();
        this.comboOption.dishList = [];
        this.comboOption.dishTable = [];
        this.comboOption.ruleForm = {
          name: "",
          categoryId: "",
          price: "",
          code: "",
          image: "",
          description: "",
          dishList: [],
          status: true,
          id: "",
          idType: "",
        };
        this.comboOption.imageUrl = "";
        this.isShowTable = false;
        this.comboOption.actionType = "add";

        //添加员工
      } else {
        this.isShowTable = false;

        //或者修改员工
        this.comboOption.actionType = "edit";
        this.id = st;
        this.initOption();
      }
    },
    deleteHandle(type, id) {
      if (type === "批量" && id === null) {
        if (this.comboList.checkList.length === 0) {
          return this.$message.error("请选择删除对象");
        }
      }
      this.$confirm("确定删除该套餐, 是否继续?", "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$API.combo
            .deleteSetmeal(
              type === "批量" ? this.comboList.checkList.join(",") : id
            )
            .then((res) => {
              if (res.code === 200) {
                this.$message.success("删除成功！");
                this.handleQuery();
              } else {
                this.$message.error(res.msg || "操作失败");
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
    //状态更改
    statusHandle(row) {
      let params = {};
      if (typeof row === "string") {
        if (this.comboList.checkList.length == 0) {
          this.$message.error("批量操作，请先勾选操作菜品！");
          return false;
        }
        params.ids = this.comboList.checkList.join(",");
        params.status = row;
      } else {
        params.ids = row.id;
        params.status = row.status ? "0" : "1";
      }
      this.$confirm("确认更改该套餐状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 起售停售---批量起售停售接口
        this.$API.combo
          .setmealStatusByStatus(params)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success("套餐状态已经更改成功！");
              this.handleQuery();
            } else {
              this.$message.error(res.msg || "操作失败");
            }
          })
          .catch((err) => {
            this.$message.error("请求出错了：" + err);
          });
      }).catch((error) => {
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });;
    },
    // 全部操作
    handleSelectionChange(val) {
      let checkArr = [];
      val.forEach((n) => {
        checkArr.push(n.id);
      });
      this.comboList.checkList = checkArr;
    },
    handleSizeChange(val) {
      this.comboList.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.comboList.page = val;
      this.init();
    },
    async initOption() {
      await this.$API.combo.querySetmealById(this.id).then((res) => {
        if (String(res.code) === "200") {
          this.comboOption.ruleForm = res.data;
          this.comboOption.ruleForm.status = res.data.status === "1";
          this.comboOption.ruleForm.price = res.data.price.toFixed(2);
          this.comboOption.imageUrl = `/lyr/api/common/download?name=${res.data.image}`;
          this.comboOption.checkList = res.data.setmealDishes;
          this.comboOption.dishTable = res.data.setmealDishes;
          this.comboOption.ruleForm.idType = res.data.categoryId;
          // this.ruleForm.password = ''
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      });
    },
    // 获取套餐分类
    getDishTypeList() {
      this.$API.food
        .getCategoryList({ type: 2, page: 1, pageSize: 1000 })
        .then((res) => {
          if (res.code === 200) {
            this.comboOption.setMealList = res.data.map((obj) => ({
              ...obj,
              idType: obj.id,
            }));
          } else {
            this.$message.error(res.msg || "操作失败");
          }
        });
    },
    // 删除套餐菜品
    delDishHandle(index) {
      this.comboOption.dishTable.splice(index, 1);
      this.comboOption.checkList.splice(index, 1);
    },
    // 获取添加菜品数据
    getCheckList(value) {
      this.comboOption.checkList = [...value];
    },
    // 添加菜品
    openAddDish() {
      this.seachKey = "";
      this.comboOption.dialogVisible = true;
      //搜索条件清空，菜品重新查询，菜品类别选第一个重新查询
      this.value = "";
      this.comboOption.keyInd = 0;
      this.getDishList(this.comboOption.dishType[0].id);
    },
    // 取消添加菜品
    handleClose(done) {
      // this.$refs.adddish.close()
      this.comboOption.dialogVisible = false;
      // this.checkList = JSON.parse(JSON.stringify(this.dishTable))
      // this.dialogVisible = false
    },
    // 保存添加菜品列表
    addTableList() {
      this.comboOption.dishTable = JSON.parse(
        JSON.stringify(this.comboOption.checkList)
      );
      this.comboOption.dishTable.forEach((n) => {
        n.copies = 1;
      });
      this.comboOption.dialogVisible = false;
      // 添加处理逻辑清空选中list
      this.comboOption.checkList = [];
    },
    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let prams = { ...this.comboOption.ruleForm };
          prams.price = this.comboOption.ruleForm.price;
          prams.setmealDishes = this.comboOption.dishTable.map((obj) => ({
            copies: obj.copies,
            dishId: obj.dishId,
            name: obj.name,
            price: obj.price,
          }));
          prams.status = this.comboOption.ruleForm ? 1 : 0;
          prams.categoryId = this.comboOption.ruleForm.idType;
          if (prams.setmealDishes.length < 1) {
            this.$message.error("请选择菜品！");
            return;
          }
          if (!this.comboOption.imageUrl) {
            this.$message.error("请上传套餐图片");
            return;
          }
          // delete prams.dishList
          if (this.comboOption.actionType == "add") {
            delete prams.id;
            this.$API.combo
              .addSetmeal(prams)
              .then((res) => {
                if (res.code === 200) {
                  this.init();
                  this.$message.success("套餐添加成功！");
                  if (!st) {
                    this.goBack();
                  } else {
                    this.$refs.ruleForm.resetFields();
                    this.comboOption.dishList = [];
                    this.comboOption.dishTable = [];
                    this.comboOption.ruleForm = {
                      name: "",
                      categoryId: "",
                      price: "",
                      code: "",
                      image: "",
                      description: "",
                      dishList: [],
                      status: true,
                      id: "",
                      idType: "",
                    };
                    this.comboOption.imageUrl = "";
                  }
                } else {
                  this.$message.error(res.msg || "操作失败");
                }
              })
              .catch((err) => {
                this.$message.error("请求出错了：" + err);
              });
          } else {
            delete prams.updateTime;
            this.$API.combo
              .editSetmeal(prams)
              .then((res) => {
                if (res.code === 200) {
                  this.init();
                  this.$message.success("套餐修改成功！");
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
          return false;
        }
      });
    },
    handleAvatarSuccess(response, file, fileList) {
      // this.imageUrl = response.data

      if (response.code === 201 && response.msg === "未登录") {
        this.$router.push("/login");
      } else {
        this.comboOption.imageUrl = `/lyr/api/common/download?name=${response.data}`;
        this.comboOption.ruleForm.image = response.data;
      }
    },
    onChange(file) {
      if (file) {
        const suffix = file.name.split(".")[1];
        const size = file.size / 1024 / 1024 < 2;
        if (["png", "jpeg", "jpg"].indexOf(suffix) < 0) {
          this.$message.error("上传图片只支持 png、jpeg、jpg 格式！");
          this.$refs.upload.clearFiles();
          return false;
        }
        if (!size) {
          this.$message.error("上传文件大小不能超过 2MB!");
          return false;
        }
        return file;
      }
    },
    goBack() {
      this.isShowTable = true;
    },
    // 获取套餐分类
    getDishType() {
      this.$API.food.getCategoryList({ type: 1 }).then((res) => {
        if (res.code === 200) {
          this.comboOption.dishType = res.data;
          this.getDishList(res.data[0].id);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 通过套餐ID获取菜品列表分类
    getDishList(id) {
      this.$API.food.queryDishList({ categoryId: id }).then((res) => {
        if (res.code === 200) {
          if (res.data.length == 0) {
            this.comboOption.dishAddList = [];
            return;
          }
          let newArr = res.data;
          newArr.forEach((n) => {
            n.dishId = n.id;
            n.copies = 1;
            // n.dishCopies = 1
            n.dishName = n.name;
          });
          this.comboOption.dishAddList = newArr;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 关键词收搜菜品列表分类
    getDishForName(name) {
      this.$API.food.queryDishList({ name }).then((res) => {
        if (res.code === 200) {
          let newArr = res.data;

          newArr.forEach((n) => {
            n.dishId = n.id;
            n.dishName = n.name;
          });

          this.comboOption.dishAddList = newArr;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    seachHandle() {
      this.seachKey = this.value;
    },

    checkTypeHandle(ind, id) {
      this.comboOption.keyInd = ind;
      this.getDishList(id);
    },

    checkedListHandle(value) {
      this.getCheckList(this.comboOption.checkedList);
    },

    open(done) {
      this.comboOption.dishListCache = JSON.parse(
        JSON.stringify(this.comboOption.checkList)
      );
    },

    close(done) {
      this.comboOption.checkList = this.comboOption.dishListCache;
    },

    // 删除
    delCheck(ind) {
      this.comboOption.checkedList.splice(ind, 1);
    },
  },
  computed: {
    rules() {
      return {
        name: {
          required: true,
          message: "请输入套餐名称",
          trigger: "blur",
        },
        idType: {
          required: true,
          message: "请选择套餐分类",
          trigger: "change",
        },
        price: {
          required: true,
          // 'message': '请输入套餐价格',
          validator: (rules, value, callback) => {
            if (!value) {
              callback(new Error("请填写菜品价格"));
            } else {
              const reg = /^\d+(\.\d{0,2})?$/;
              if (reg.test(value)) {
                if (value < 10000) {
                  callback();
                } else {
                  callback(new Error("菜品价格小于10000"));
                }
              } else {
                callback(
                  new Error("菜品价格格式只能为数字,且最多保留两位小数")
                );
              }
            }
          },
          trigger: "blur",
        },
      };
    },
  },
  watch: {
    seachKey(value) {
      if (value.trim()) {
        this.getDishForName(this.seachKey);
      }
    },
    //  'comboOption.searKey':{
    //     handler(value){
    //       if (value.trim()) {
    //         console.log(this.comboOption.seachKey);
    //         this.getDishForName(this.comboOption.seachKey);
    //       }
    //     }
    //  },

    checkList(value) {
      this.comboOption.checkedList = value;
    },
  },
};
</script>

<style  scoped>
.addDish>>> .el-input {
  width: 130px;
}
.addDish>>> .el-input-number__increase {
  border-left: 1px solid  #ffe1ca;
  background: #fff3ea;
}
.addDish>>> .el-input-number__decrease {
  border-right: solid 1px #ffe1ca;
  background: #fff3ea;
}
.addDish>>> input {
  border: 1px solid #ffe1ca;
}
.addDish .table {
  border: solid 1px #ebeef5;
  border-radius: 3px;
}
.addDish .table th {
  padding: 5px 0;
}
.addDish .table td {
  padding: 7px 0;
}
.addDishList .seachDish {
  position: absolute;
  top: 10px;
  right: 20px;
}
.addDishList .el-dialog__body {
  padding: 0;
  border-bottom: solid 1px #ccc;
}
.addDishList .el-dialog__footer {
  padding-top: 27px;
}

.addDish {
  width: 777px;
}
.addDish .addBut {
  background: #ffc200;
  display: inline-block;
  padding: 0px 20px;
  border-radius: 3px;
  line-height: 40px;
  cursor: pointer;
  border-radius: 4px;
  color: #333333;
  font-weight: 500;
}
.addDish .content {
  background: #fafafb;
  padding: 20px;
  border: solid 1px #ccc;
  border-radius: 3px;
}
.addDishCon {
  padding: 0 20px;
  display: flex;
  line-height: 40px;
}
.addDishCon .leftCont {
  display: flex;
  border-right: solid 2px #e4e7ed;
  width: 60%;
  padding: 15px;
}
.addDishCon .leftCont .tabBut {
  width: 110px;
}
.addDishCon .leftCont .tabBut span {
  display: block;
  text-align: center;
  border-right: solid 2px #f4f4f4;
  cursor: pointer;
}
.addDishCon .leftCont .act {
  border-color: #ffc200 !important;
  color: #ffc200 !important;
}
.addDishCon .leftCont .tabList {
  flex: 1;
  padding: 15px;
}
.addDishCon .leftCont .tabList .table {
  border: solid 1px #f4f4f4;
  border-bottom: solid 1px #f4f4f4;
}
.addDishCon .leftCont .tabList .table .items {
  border-bottom: solid 1px #f4f4f4;
  padding: 0 10px;
  display: flex;
}
.addDishCon .leftCont .tabList .table .items .el-checkbox,
.addDishCon .leftCont .tabList .table .items .el-checkbox__label {
  width: 100%;
}
.addDishCon .leftCont .tabList .table .items .item {
  display: flex;
  padding-right: 20px;
}
.addDishCon .leftCont .tabList .table .items .item span {
  display: inline-block;
  text-align: center;
  flex: 1;
}
.addDishCon .ritCont {
  width: 40%;
  padding: 0 15px;
}
.addDishCon .ritCont .item {
  box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #818693;
}
.addDishCon .ritCont .item span:first-child {
  text-align: left;
  color: #20232a;
}
.addDishCon .ritCont .item .price {
  display: inline-block;
  flex: 1;
}
.addDishCon .ritCont .item .del {
  cursor: pointer;
}
.addDishCon .ritCont .item .del img {
  position: relative;
  top: 5px;
  width: 20px;
}

.addDishCon .el-checkbox__label {
  width: 100%;
}
#combo-add-app .setmealFood .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

#combo-add-app .uploadImg .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

</style>