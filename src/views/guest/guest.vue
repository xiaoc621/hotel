!<!--  -->
<template>
  <div>
    <div class="search">
      <label style="color:#666;font-size:12px">客户姓名：</label>
      <el-input
        clearable
        v-model="guestName"
        placeholder="请输入客户姓名"
        size="mini"
        style="width:200px;margin-right:10px"
      ></el-input>
      <label style="color:#666;font-size:12px">结帐状态：</label>
      <el-select
        size="mini"
        v-model="resideStateId"
        placeholder="请选择结帐状态"
        clearable
        style="margin-right:15px"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
        >
        </el-option>
      </el-select>
      <el-button type="success" size="mini" @click="searchClick"
        >查询</el-button
      >
      <el-button type="primary" size="mini" @click="addClick">添加</el-button>
      <el-button type="warning" size="mini" @click="excelClick"
        >导出Excel</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="客户姓名" width="80">
        <template slot-scope="scope">{{ scope.row.guestName }}</template>
      </el-table-column>
      <el-table-column label="客户电话" width="100">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="身份证号" width="150">
        <template slot-scope="scope">{{ scope.row.identityId }}</template>
      </el-table-column>
      <el-table-column label="入住房间" width="80">
        <template slot-scope="scope">{{ scope.row.room.roomId }}</template>
      </el-table-column>
      <el-table-column label="房间类型" width="80">
        <template slot-scope="scope">{{
          scope.row.room.roomType.roomTypeName
        }}</template>
      </el-table-column>
      <el-table-column label="床位数" width="70">
        <template slot-scope="scope">{{
          scope.row.room.roomType.bedNum
        }}</template>
      </el-table-column>
      <el-table-column label="价格" width="50">
        <template slot-scope="scope">{{
          scope.row.room.roomType.roomTypePrice
        }}</template>
      </el-table-column>
      <el-table-column label="入住日期" width="150">
        <template slot-scope="scope">{{ scope.row.resideDate }}</template>
      </el-table-column>
      <el-table-column label="离开日期" width="150">
        <template slot-scope="scope">{{ scope.row.leaveDate }}</template>
      </el-table-column>
      <el-table-column label="押金" width="80">
        <template slot-scope="scope">{{ scope.row.deposit }}</template>
      </el-table-column>
      <el-table-column label="消费" width="60">
        <template slot-scope="scope">{{ scope.row.totalMoney }}</template>
      </el-table-column>
      <el-table-column label="入住人数" width="70">
        <template slot-scope="scope">{{ scope.row.guestNum }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.resideStateId === 1 ? 'danger' : 'success'"
            disable-transitions
            >{{ scope.row.resideState.resideStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.resideStateId === 1"
            size="mini"
            type="text"
            style="color:#E6A23C"
            @click="handleJieZhang(scope.$index, scope.row)"
            >结账</el-button
          >
          <el-button
            v-if="scope.row.resideStateId === 2"
            size="mini"
            type="text"
            style="color:#F56C6C"
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
      :title="isAdd ? '添加客户' : '修改客户'"
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
          <el-form-item label="姓名" prop="guestName">
            <el-input
              v-model="ruleForm.guestName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identityId">
            <el-input
              v-model="ruleForm.identityId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客房类型" prop="roomTypeId">
            <el-select
              @change="roomTypeChange"
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择客房"
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
          <el-form-item label="客房" prop="roomId">
            <el-select
              size="mini"
              v-model="ruleForm.roomId"
              placeholder="请选择房间"
              clearable
              style="margin-right:15px"
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住时间" prop="resideDate">
            <el-date-picker
              v-model="ruleForm.resideDate"
              type="datetime"
              placeholder="请选择入住时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="押金" prop="deposit">
            <el-input v-model="ruleForm.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="入住人数" prop="guestNum">
            <el-input v-model="ruleForm.guestNum" autocomplete="off"></el-input>
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
  </div>
</template>

<script>
import { xlsx } from "../../utli/xlsx";
export default {
  data() {
    // 验证身份证号
    var validateIdentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else {
        callback();
      }
    };
    // 验证姓名
    var validateGuestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    // 验证电话
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    // 验证客房类型
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择客房类型"));
      } else {
        callback();
      }
    };
    // 验证房间号
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客房编号"));
      } else {
        callback();
      }
    };
    // 验证入住日期
    var validateResideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住日期"));
      } else {
        callback();
      }
    };
    // 验证押金
    var validateDeposit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入押金"));
      } else {
        callback();
      }
    };
    // 验证入住人数
    var validateGuestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入入住人数"));
      } else {
        callback();
      }
    };

    return {
      //客房类型列表
      roomTypeList: [],
      //客房列表
      roomList: [],
      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //结账状态列表
      resideStateList: [],
      //结账状态编号（用于搜索）
      resideStateId: "",
      //当前页码
      pageIndex: 1,
      //是否打开抽屉
      drawer: false,
      //抽屉是否添加
      isAdd: true,
      //客户姓名（用于搜索）
      guestName: "",
      //表单数据
      ruleForm: {
        //身份证号
        identityId: "",
        //姓名
        guestName: "",
        //电话
        phone: "",
        //房间类型编号
        roomTypeId: "",
        //房间号
        roomId: "",
        //入住日期
        resideDate: "",
        //押金
        deposit: "",
        // 入住人数
        guestNum: ""
      },
      // 表单的验证数据
      rules: {
        //验证身份证号
        identityId: [{ validator: validateIdentityId, trigger: "blur" }],
        //验证姓名
        guestName: [{ validator: validateGuestName, trigger: "blur" }],
        //验证电话
        phone: [{ validator: validatePhone, trigger: "blur" }],
        //验证房间类型
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
        // 验证房间号
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        // 验证入住日期
        resideDate: [{ validator: validateResideDate, trigger: "change" }],
        // 验证押金
        deposit: [{ validator: validateDeposit, trigger: "change" }],
        // 验证入住人数
        guestNum: [{ validator: validateGuestNum, trigger: "change" }]
      }
    };
  },
  created() {
    //调用获取表格数据方法
    this.getTableData();
    //调用获取结账状态列表方法
    this.getResideStateList();
    //调用获取房间类型列表和房间列表方法
    this.getRoomTypeList();
  },
  methods: {
    //导出房间信息
     excelClick() {
      let json = this.tableData.map(r => {
        return {
          guestName: r.guestName,
          phone:r.phone,
          identityId:r.identityId,
          roomId: r.room.roomId,
          roomTypeName: r.room.roomType.roomTypeName,
          bedNum:r.room.roomType.bedNum,
          roomTypePrice:r.room.roomType.roomTypePrice,
          resideDate:r.resideDate,
          leaveDate:r.leaveDate,
          deposit:r.deposit,
          totalMoney:r.totalMoney,
          guestNum:r.guestNum,
          resideStateName:r.resideState.resideStateName
        };
      });
      let fields = {
        guestName: "客人姓名",
        phone: "电话",
        identityId:"身份证",
        roomId:"入住房间",
        roomTypeName:"客房类型",
        bedNum: "床位数",
        roomTypePrice: "价格",
        resideDate:"入住日期",
        leaveDate:"离开日期",
        deposit:"押金",
        totalMoney:"消费",
        guestNum:"入住人数",
        resideStateName:"房间状态"
      }
      let filename = '客人入住信息表'
      xlsx(json,fields,filename)
    },
    //编辑表格数据
    async handleEdit(index, row) {
      const guestId = row.guestId;
      // 根据角色编号获取对象
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      this.ruleForm = res;
      this.ruleForm.roomTypeId = res.room.roomTypeId;
      this.roomTypeChange(1);
      // 修改
      this.isAdd = false;
      this.drawer = true;
    },
    //删除表格数据
    async handleDelete(index, row) {
      // 确定是否删除
      await this.$con_f("是否确定删除？");
      // 获取编号
      const guestId = row.guestId;
      // 删除对应账号信息
      let { success, message } = await this.$post("GuestRecord/Delete", {
        guestId
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
      let { data, count } = await this.$get("GuestRecord/List", {
        pageIndex: this.pageIndex,
        guestName: this.guestName,
        resideStateId: this.resideStateId || 0
      });
      this.tableData = data;
      this.count = count;
    },

    //添加抽屉
    addClick() {
      this.drawer = true;
    },
    //关闭抽屉
    drawerClose(done) {
      // this.ruleForm={
      //   roleName: ""
      // };
      this.resetForm("ruleForm");
      this.isAdd = true;
      done();
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isAdd) {
            // 执行添加功能
            let { success, message } = await this.$post(
              "/GuestRecord/Add",
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
              "/GuestRecord/Update",
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
    //表单重置方法
    resetForm(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
      // 清空表单数据
      this.ruleForm = {
        //身份证号
        identityId: "",
        //姓名
        guestName: "",
        //电话
        phone: "",
        //房间类型编号
        roomTypeId: "",
        //房间号
        roomId: "",
        //入住日期
        resideDate: "",
        //押金
        deposit: "",
        // 入住人数
        guestNum: ""
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
    async getResideStateList() {
      let res = await this.$get("/ResideState/List");
      this.resideStateList = res;
    },
    // 结账方法
    async handleJieZhang(index,row){
      await this.$con_f("是否确定结账？");
      let guestId = row.guestId
      let {totalMoney} = await this.$post('/GuestRecord/Checkout',{guestId})
      this.$msg_s('结账成功！需要支付'+totalMoney+'元，客房费用！')
      this.getTableData()
      
    },
    // 获取客房类型列表和客房列表方法
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    // 客房类型列表下拉框
    async roomTypeChange(type) {
      if (!type) {
        this.ruleForm.roomId = "";
      }
      let roomTypeId = this.ruleForm.roomTypeId;
      if (roomTypeId) {
        let { data } = await this.$get("/Room/List", {
          roomTypeId,
          roomStateId: 1,
          guestId: this.ruleForm.guestId || 0
        });
        this.roomList = data;
      }
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