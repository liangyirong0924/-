<template>
  <div>
    <div v-show="isShowTable" class="dashboard-container" id="food-app">
      <div class="container">
        <div class="tableBar">
          <el-input
            v-model="foodList.input"
            placeholder="请输入菜品名称"
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
            <span
              style="color:red"
              class="span-btn delBut non"
              @click="deleteHandle('批量', null)"
              >批量删除</span
            >
            <span
            style="color:skyblue"
             class="span-btn blueBug non" @click="statusHandle('1')"
              >批量启售</span
            >
            <span
            
              style="border: none;color:gray"
              class="span-btn delBut non"
              @click="statusHandle('0')"
              >批量停售</span
            >
            <el-button type="primary" @click="addFoodtype('add')">
              + 新建菜品
            </el-button>
          </div>
        </div>
        <el-table
          :data="foodList.tableData"
          stripe
          class="tableBox"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="name" label="菜品名称"></el-table-column>
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
          <el-table-column
            prop="categoryName"
            label="菜品分类"
          ></el-table-column>
          <el-table-column label="售价">
            <template slot-scope="scope">
              <span style="margin-right: 10px"
                >￥{{ (scope.row.price).toFixed(2) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="售卖状态">
            <template slot-scope="scope">
              <span style="margin-right: 10px">{{
                scope.row.status == "0" ? "停售" : "启售"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最后操作时间">
          </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                class="blueBug"
                @click="addFoodtype(scope.row.id)"
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
          :page-size="foodList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="foodList.counts"
          @size-change="handleSizeChange"
          :current-page.sync="foodList.page"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <div v-show="!isShowTable" class="addBrand-container" id="food-add-app">
    <div class="container">
      <el-form
        ref="ruleForm"
        :model="foodAdd.ruleForm"
        :rules="rules"
        :inline="true"
        label-width="180px"
        class="demo-ruleForm"
      >
        <div>
          <el-form-item
            label="菜品名称:"
            prop="name"
          >
            <el-input
              v-model="foodAdd.ruleForm.name"
              placeholder="请填写菜品名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item
            label="菜品分类:"
            prop="categoryId"
          >
            <el-select
              v-model="foodAdd.ruleForm.categoryId"
              placeholder="请选择菜品分类"
            >
              <el-option v-for="(item,index) in foodAdd.dishList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="菜品价格:"
            prop="price"
          >
            <el-input
              v-model="foodAdd.ruleForm.price"
              placeholder="请设置菜品价格"
            />
          </el-form-item>
        </div>
        <el-form-item label="口味做法配置:">
          <el-form-item>
            <div class="flavorBox">
              <span
                v-if="foodAdd.dishFlavors.length == 0"
                class="addBut"
                @click="addFlavore"
              > + 添加口味</span>
              <div
                v-if="foodAdd.dishFlavors.length != 0"
                class="flavor"
              >
                <div class="title">
                  <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                </div>
                <div class="cont">
                  <div
                    v-for="(item, index) in foodAdd.dishFlavors"
                    :key="index"
                    class="items"
                  >
                    <div class="itTit">
                      <!-- <SelectInput
                        :dish-flavors-data="dishFlavorsData"
                        :index="index"
                        :value="item.name"
                        @select="selectHandle"
                      /> -->
                      <div class="selectInput">
                        <div>
                           <el-input
                              v-model="item.name"
                              type="text"
                              style="width: 100%"
                              placeholder="请输入口味"
                              @focus="selectFlavor(true,index)"
                              @blur="outSelect(false,index)"
                              @input="inputHandle(index)"
                            />
                        </div>
                        <div v-show="item.showOption" class="flavorSelect">
                          <span
                            v-for="(it, ind) in foodAdd.dishFlavorsData"
                            :key="ind"
                            class="items"
                            @click="checkOption(it,ind,index)"
                          >{{ it.name }}</span>
                          <span
                            v-if="foodAdd.dishFlavorsData == []"
                            class="none"
                          >无数据</span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="labItems"
                      style="display: flex"
                    >
                      <span
                        v-for="(it, ind) in item.value"
                        :key="ind"
                      >{{ it }} <i @click="delFlavorLabel(index, ind)">X</i></span>
                      <div
                        class="inputBox"
                        :style="foodAdd.inputStyle"
                        contenteditable="true"
                        @focus="flavorPosition(index)"
                        @keydown.enter="(val)=>keyDownHandle(val,index)"
                      ></div>
                    </div>
                    <span
                      class="delFlavor delBut non"
                      @click="delFlavor(index)"
                    >删除</span>
                  </div>
                </div>
                <div
                  class="addBut"
                  @click="addFlavore"
                >
                  添加口味
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form-item>
        <div>
        </div>
        <div>
          <el-form-item
            label="菜品图片:"
            prop="region"
            class="uploadImg"
          >
          
            <el-upload
              class="avatar-uploader"
              action="/lyr/api/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-change="onChange"
              ref="upload"
            >
           
              <img
                v-if="foodAdd.imageUrl"
                :src="foodAdd.imageUrl"
                class="avatar"
              ></img>
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item
            label="菜品描述:"
            prop="region"
          >
            <el-input
              v-model="foodAdd.ruleForm.description"
              type="textarea"
              :rows="3"
              placeholder="菜品描述，最长200字"
              maxlength="200"
            />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()">
              取消
            </el-button>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >
              保存
            </el-button>
            <el-button
              v-if="foodAdd.actionType == 'add'"
              type="primary"
              class="continue"
              @click="submitForm('ruleForm','goAnd')"
            >
              保存并继续添加菜品
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  </div>
</template>

<script>
import "@/assets/less/page.css";
export default {
  name: "Food",
  data() {
    return {
      id: "",
      isShowTable: true,
      foodAdd: {
        restKey: 0,
        textarea: "",
        value: "",
        imageUrl: "",
        actionType: "",
        dishList: [],
        dishFlavorsData: [],
        dishFlavors: [],
        vueRest: "1",
        index: 0,
        inputStyle: { flex: 1 },
        ruleForm: {
          name: "",
          id: "",
          price: "",
          code: "",
          image: "",
          description: "",
          dishFlavors: [],
          status: true,
          categoryId: "",
        },
        mak: false,
      },
      foodList: {
        input: "",
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData: [],
        dishState: "",
        checkList: [],
      },
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const params = {
        page: this.foodList.page,
        pageSize: this.foodList.pageSize,
        name: this.foodList.input ? this.foodList.input : undefined,
      };
      await this.$API.food
        .getDishPage(params)
        .then((res) => {
          if (String(res.code) === "200") {
            this.foodList.tableData = res.data.records || [];
            this.foodList.counts = res.data.total;
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
      this.foodList.page = 1;
      this.init();
    },
    // 添加
    addFoodtype(st) {
      this.getDishList();
      if (st === "add") {
        this.foodAdd.actionType = "add";
        this.isShowTable = false;
        this.$refs.ruleForm.resetFields();
        this.foodAdd.imageUrl = "";
        this.foodAdd.dishFlavors = [];
        // this.dishFlavorsData = []
        this.foodAdd.imageUrl = "";
        this.foodAdd.ruleForm = {
          name: "",
          id: "",
          price: "",
          code: "",
          image: "",
          description: "",
          dishFlavors: [],
          status: true,
          categoryId: "",
        };
      } else {
        this.isShowTable = false;
        //或者修改员工
        this.foodAdd.actionType = "edit";
        this.id = st;
        this.initOption();
      }
    },

    // 删除
    deleteHandle(type, id) {
      if (type === "批量" && id === null) {
        if (this.foodList.checkList.length === 0) {
          return this.$message.error("请选择删除对象");
        }
      }
      this.$confirm("确认删除该菜品, 是否继续?", "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        this.$API.food
          .deleteDish(type === "批量" ? this.foodList.checkList.join(",") : id)
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
      }).catch((error) => {
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });;
    },

    //状态更改
    statusHandle(row) {
      let params = {};
      if (typeof row === "string") {
        if (this.foodList.checkList.length === 0) {
          this.$message.error("批量操作，请先勾选操作菜品！");
          return false;
        }
        params.id = this.foodList.checkList.join(",");
        params.status = row;
      } else {
        params.id = row.id;
        params.status = row.status ? "0" : "1";
      }
      this.foodList.dishState = params;
      this.$confirm("确认更改该菜品状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 起售停售---批量起售停售接口
        this.$API.food
          .dishStatusByStatus(this.foodList.dishState)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success("菜品状态已经更改成功！");
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
      this.foodList.checkList = checkArr;
    },
    handleSizeChange(val) {
      this.foodList.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.foodList.page = val;
      this.init();
    },
    //foodAdd
    async initOption() {
      this.$API.food.queryDishById(this.id).then((res) => {
        console.log(res);
        if (String(res.code) === "200") {
          this.foodAdd.ruleForm = { ...res.data };
          this.foodAdd.ruleForm.price = Number(res.data.price).toFixed(2);
          this.foodAdd.ruleForm.status = res.data.status == "1";
          this.foodAdd.dishFlavors =
            res.data.flavors &&
            res.data.flavors.map((obj) => ({
              ...obj,
              value: JSON.parse(obj.value),
              showOption: false,
            }));

          // this.ruleForm.id = res.data.data.categoryId
          // this.imageUrl = res.data.data.image
          this.foodAdd.imageUrl = `/lyr/api/common/download?name=${res.data.image}`;
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      });
    },
    // 按钮 - 添加口味
    addFlavore() {
      this.foodAdd.dishFlavors.push({ name: "", value: [], showOption: false }); // JSON.parse(JSON.stringify(this.dishFlavorsData))
    },

    // 按钮 - 删除口味
    delFlavor(ind) {
      this.foodAdd.dishFlavors.splice(ind, 1);
    },

    // 按钮 - 删除口味标签
    delFlavorLabel(index, ind) {
      this.foodAdd.dishFlavors[index].value.splice(ind, 1);
    },

    //口味位置记录
    flavorPosition(index) {
      this.foodAdd.index = index;
    },

    // 添加口味标签
    keyDownHandle(val, index) {
      console.log("keyDownHandle----val", val);
      console.log("keyDownHandle----index", index);
      console.log(
        "keyDownHandle----this.dishFlavors",
        this.foodAdd.dishFlavors
      );
      if (event) {
        event.cancelBubble = true;
        event.preventDefault();
        event.stopPropagation();
      }

      if (val.target.innerText.trim() != "") {
        this.foodAdd.dishFlavors[index].value.push(val.target.innerText);
        val.target.innerText = "";
      }
    },

    // 获取菜品分类
    getDishList() {
      this.$API.food.getCategoryList({ type: 1 }).then((res) => {
        if (res.code === 200) {
          this.foodAdd.dishList = res.data;
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      });
    },

    // 获取口味列表
    getFlavorListHand() {
      // flavor flavorData
      this.foodAdd.dishFlavorsData = [
        { name: "甜味", value: ["无糖", "少糖", "半糖", "多糖", "全糖"] },
        { name: "温度", value: ["热饮", "常温", "去冰", "少冰", "多冰"] },
        { name: "忌口", value: ["不要葱", "不要蒜", "不要香菜", "不要辣"] },
        { name: "辣度", value: ["不辣", "微辣", "中辣", "重辣"] },
      ];
    },

    selectFlavor(st, index) {
      console.log("st", st);
      console.log("index", index);
      console.log("this.dishFlavors", this.foodAdd.dishFlavors);
      const obj = JSON.parse(JSON.stringify(this.foodAdd.dishFlavors[index]));
      obj.showOption = st;
      this.foodAdd.dishFlavors.splice(index, 1, obj);
      // this.dishFlavors[index].showOption = st
    },

    outSelect(st, index) {
      const _this = this;
      setTimeout(() => {
        const obj = JSON.parse(
          JSON.stringify(_this.foodAdd.dishFlavors[index])
        );
        obj.showOption = st;
        _this.foodAdd.dishFlavors.splice(index, 1, obj);
      }, 200);
    },

    inputHandle(val, index) {
      // this.selectFlavor(false,index)
    },

    checkOption(val, ind, index) {
      this.selectHandle(val.name, index, ind);
      this.foodAdd.dishFlavors[index].name = val.name;
    },

    selectHandle(val, key, ind) {
      const arrDate = [...this.foodAdd.dishFlavors];
      arrDate[key] = JSON.parse(
        JSON.stringify(this.foodAdd.dishFlavorsData[ind])
      );
      this.foodAdd.dishFlavors = arrDate;
    },

    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = { ...this.foodAdd.ruleForm };
          // params.flavors = this.dishFlavors
          params.status = this.foodAdd.ruleForm ? 1 : 0;
          params.price = Number(this.foodAdd.ruleForm.price).toFixed(2);
          params.categoryId = this.foodAdd.ruleForm.categoryId;
          params.flavors = this.foodAdd.dishFlavors.map((obj) => ({
            ...obj,
            value: JSON.stringify(obj.value),
          }));
          delete params.dishFlavors;
          if (!this.foodAdd.imageUrl) {
            this.$message.error("请上传菜品图片");
            return;
          }
          if (this.foodAdd.actionType == "add") {
            delete params.id;
            this.$API.food
              .addDish(params)
              .then((res) => {
                if (res.code === 200) {
                  this.init();
                  this.$message.success("菜品添加成功！");
                  if (!st) {
                    this.goBack();
                  } else {
                    this.foodAdd.dishFlavors = [];
                    // this.dishFlavorsData = []
                    this.foodAdd.imageUrl = "";
                    this.foodAdd.ruleForm = {
                      name: "",
                      id: "",
                      price: "",
                      code: "",
                      image: "",
                      description: "",
                      dishFlavors: [],
                      status: true,
                      categoryId: "",
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
            delete params.updateTime;
            this.$API.food
              .editDish(params)
              .then((res) => {
                if (res.code === 200) {
                  this.init();
                  this.$message.success("菜品修改成功！");
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
      // 拼接down接口预览
      if (response.code === 201 && response.msg === "未登录") {
        this.$router.push("/login");
      } else {
        this.foodAdd.imageUrl = `/lyr/api/common/download?name=${response.data}`;
        this.foodAdd.ruleForm.image = response.data;
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
  },

  computed: {
    rules() {
      return {
        name: [{ required: true, message: "请填写菜品名称", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择菜品分类", trigger: "change" },
        ],
        price: [
          {
            required: true,
            // 'message': '请填写菜品价格',
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
        ],
      };
    },
  },
};
</script>

<style scoped>
.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
}
.selectInput .flavorSelect {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  border-radius: 3px;
  border: solid 1px #ff903d;
  line-height: 30px;
  text-align: center;
  background: #fff;
  top: 50px;
  z-index: 99;
}
.selectInput .flavorSelect .items {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  line-height: 35px;
  border-bottom: solid 1px #f4f4f4;
  color: #666;
}
.selectInput .flavorSelect .none {
  font-size: 14px;
}

#food-add-app .uploadImg .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>