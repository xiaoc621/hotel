!<!--  -->
<template>
  <div>
    <div class="search">
      <label style="color:#666;font-size:12px">客房类型：</label>
      <el-select
        size="mini"
        v-model="roomTypeId"
        placeholder="请选择客房类型"
        clearable
        style="margin-right:15px"
      >
        <el-option
          v-for="item in roomTypeList"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"
        >
        </el-option>
      </el-select>
      <label style="color:#666;font-size:12px">客房状态：</label>
      <el-select
        size="mini"
        v-model="roomStateId"
        placeholder="请选择客房状态"
        clearable
        style="margin-right:15px"
      >
        <el-option
          v-for="item in roomStateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick"
        >查询</el-button
      >
      <el-button type="primary" size="mini" @click="addClick">添加</el-button>
      <el-button type="warning" size="mini" @click="export2Excel">
        导出Excel
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="房间号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="150px">
        <template slot-scope="scope">
          {{ scope.row.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="150px">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="房间状态" width="150px">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="
              scope.row.roomStateId === 1
                ? 'success'
                : scope.row.roomStateId === 2
                ? 'danger'
                : 'warning'
            "
            disable-transitions
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleShowImg(scope.$index, scope.row)"
            >图片</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex j-c" style="margin-top:17px">
      <el-pagination
        background
        layout="prev, pager, next"
        :tatol="count"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <el-drawer
      :title="isAdd ? '添加客房类型' : '修改客房类型'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
      size="45%"
    >
      <div style="padding:0 10px">
        <el-form
          siz="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="房间号" prop="roomId">
            <el-input v-model="ruleForm.roomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房类型"
              clearable
              style="margin-right:15px"
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              size="mini"
              v-model="ruleForm.roomStateId"
              placeholder="请选择客房状态"
              clearable
              style="margin-right:15px"
            >
              <el-option
                v-for="item in roomStateList2"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <quill-editor
              v-model="ruleForm.description"
              ref="myQuillEditor"
              style="height:200px; margin-bottom:120px"
            >
            </quill-editor>
          </el-form-item>
          <el-form-item class="dq">
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <!-- 图片弹出层 -->
    <el-dialog
      title="房间图片"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 图片上传组件 -->
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 弹出层（用于显示大图） -->
      <el-dialog :visible.sync="dialogVisible2" append-to-body="">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
// 导入头像房间图片根路径和头像上传根路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config/index";
import { xlsx } from "../../utli/xlsx";
export default {
  data() {
    // 验证房间号
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房编号"));
      } else {
        callback();
      }
    };
    // 验证房间状态
    var validateRoomStateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间状态"));
      } else {
        callback();
      }
    };
    // 验证房间类型
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间类型"));
      } else {
        callback();
      }
    };
    return {
      fileList: [],
      roomId: "",
      //房间图片上传路径
      Upload_RoomImg_URL,
      //房间图片类型
      BASE_URL_RoomImg,
      //是否显示弹出层
      dialogVisible: false,
      //查看大图
      dialogVisible2: false,
      dialogImageUrl: "",
      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //客房类型列表
      roomTypeList: [],
      //客房状态列表(查询)
      roomStateList: [],
      //客房状态列表（添加或修改）
      roomStateList2: [],
      //客房状态编号
      roomStateId: [],
      //当前页码
      pageIndex: 1,
      //是否打开抽屉
      drawer: false,
      //抽屉是否添加
      isAdd: true,
      //客房类型编号
      roomTypeId: "",
      //表单数据
      ruleForm: {
        //房间号
        roomId: "",
        //状态编号
        roomStateId: "",
        //类型编号
        roomTypeId: "",
        //描述
        description: ""
      },
      // 表单的验证数据
      rules: {
        // 验证房间号
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        // 验证状态
        roomStateId: [{ validator: validateRoomStateId, trigger: "change" }],
        // 验证类型价格
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }]
      }
    };
  },
  created() {
    //调用获取表格数据方法
    this.getTableData();
    // 调用获取客房类型列表方法
    this.getRoomTypeList();
    // 调用获取客房状态列表方法
    this.getRoomStateList();
  },
  methods: {
    // 导出房间信息
    export2Excel() {
      let json = this.tableData.map(r => {
        return {
          roomId: r.roomId,
          roomType: r.roomType.roomTypeName,
          bedNum: r.roomType.bedNum,
          price: r.roomType.roomTypePrice,
          roomState: r.roomState.roomStateName
        };
      });
      let fields = {
        roomId: "客房编号",
        roomType: "客房类型",
        bedNum: "床位数",
        price: "价格",
        roomState: "客房状态"
      }
      let filename = '客房信息表'
      xlsx(json,fields,filename)
    },
    // 编辑表格数据
    async handleEdit(index, row) {
      const roomId = row.roomId;
      // 根据角色编号获取对象
      let res = await this.$get("/Room/GetOne", { roomId });
      this.ruleForm = res;
      this.ruleForm.id = res.roomId;
      // 修改
      this.isAdd = false;
      this.drawer = true;
    },
    // 删除表格数据
    async handleDelete(index, row) {
      // 确定是否删除
      await this.$con_f("是否确定删除？");
      // 获取编号
      const roomId = row.roomId;
      // 删除对应账号信息
      let { success, message } = await this.$post("Room/Delete", {
        roomId
      });
      if (success) {
        this.$msg_s(message);
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    async getTableData() {
      // 获取房间信息
      let { data, count } = await this.$get("Room/List", {
        roomTypeId: this.roomTypeId || 0,
        roomStateId: this.roomStateId || 0,
        pageIndex: this.pageIndex
      });
      this.tableData = data;
      this.count = count;
    },

    // 添加抽屉
    addClick() {
      this.drawer = true;
    },
    // 关闭抽屉
    drawerClose(done) {
      // this.ruleForm={
      //   roleName: ""
      // };
      this.resetForm("ruleForm");
      this.isAdd = true;
      done();
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isAdd) {
            // 执行添加功能
            let { success, message } = await this.$post(
              "/Room/Add",
              this.ruleForm
            );
            // 判断是否添加成功
            if (success) {
              this.$msg_s(message);
              this.getTableData();
              this.resetForm("ruleForm");
            } else {
              this.$msg_e(message);
            }
          } else {
            // 执行添加功能
            let { success, message } = await this.$post(
              "/Room/Update",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
            } else {
              this.$msg_e(message);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 表单重置方法
    resetForm(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
      // 清空表单数据
      this.ruleForm = {
        //房间号
        roomId: "",
        //状态编号
        roomStateId: "",
        //类型编号
        roomTypeId: "",
        //描述
        description: ""
      };
    },
    currentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    searchClick() {
      this.getTableData();
    },
    addClick() {
      this.drawer = true;
    },
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    async getRoomStateList() {
      let res = await this.$get("/RoomState/List");
      this.roomStateList = res;
      //   获取房间状态信息（房间状态没有入住）
      let res2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList2 = res2;
    },
    handleShowImg(index, row) {
      //显示客房图片列表的对话框
      this.dialogVisible = true;
      // 获取客房编号
      this.roomId = row.roomId;
      this.showImg();
    },
    async showImg() {
      // 根据客房编号查询所有客房图片
      let res = await this.$get("/RoomImg/List", { roomId: this.roomId });
      this.fileList = await res.map(r => {
        return {
          roomImgId: r.roomImgId,
          name: r.imgUrl,
          url: this.BASE_URL_RoomImg + r.imgUrl
        };
      });
    },
    // 关闭图片弹出框
    handleClose(done) {
      this.fileList = [];
      done();
    },
    // 删除照片墙照片
    async handleRemove(file, fileList) {
      // 获取图片id和图片名称
      let { roomImgId, name } = file;
      let { success, message } = await this.$post("/RoomImg/Delete", {
        roomImgId,
        filename: name
      });
      if (success) {
        this.$msg_s("删除成功");
      } else {
        this.$msg_e("删除失败");
      }
    },
    // 预览照片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    // 上传成功的方法
    async handleAvatarSuccess(res) {
      let { success, filename } = res;
      if (success) {
        let res = await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename
        });
      }
      if (res.success) {
        this.showImg();
      }
    },
    //  照片上传之前的方法
    beforeAvatarUpload(file) {
      //  定义可以上传的图片格式
      let img_type_list = ["image/jpeg", "image/png", "image/gif"];
      const isJPG = img_type_list.includes(file.type);
      //  限制图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传房间图片可以是 JPG/png/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传房间图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style scoped>
.search {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 8px;
}
</style>