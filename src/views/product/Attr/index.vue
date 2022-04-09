<template>
  <div>
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :showCategory="isShowTable"
      />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="list" style="width: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150">
          </el-table-column>
          <el-table-column label="属性分类">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="index"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-delete"
                @click="deleteAttr(row, $index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- <template slot-scope="{ row, $index }"> -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue()"
          :disabled="!attrInfo.attrName"
          >添加属性名</el-button
        >
        <!-- </template> -->
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- // !注意 这个项目的ele-ui 版本低，确定的事件回调为onconfirm 而不是confirm -->
              <el-popconfirm
                @onConfirm="deleteAttrValue(row, $index)"
                :title="`确定删除${row.valueName}`"
              >
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttrOrUpdate"
          :disabled="!attrInfo.attrValueList.length"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash的浅拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      list: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [
          //{
          // attrId: 0,
          // valueName: "",
          //},
        ],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    async getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      if (category1Id && category2Id && category3Id) {
        const res = await this.$API.attr.reqAttrList(
          category1Id,
          category2Id,
          category3Id
        );
        if (res.code === 200) {
          this.list = res.data;
        }
      }
    },
    addAttrValue() {
      if (this.attrInfo.attrValueList.length === 0) {
        // 添加属性
        // 向属性值里面添加元素
        this.attrInfo.attrValueList.push({
          attrId: this.attrInfo.id,
          valueName: "",
          flag: true,
        });
      } else {
        console.log(this.attrInfo.attrValueList);
        if (
          this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1]
            .valueName === ""
        ) {
          this.$message.error("请输入内容");
          return;
        } else {
          this.attrInfo.attrValueList.push({
            attrId: this.attrInfo.id,
            valueName: "",
            flag: true,
          });
          return;
        }
      }
      this.$nextTick(() => {
        // 添加属性的时候，使最后一个的input聚焦
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      this.isShowTable = false;
      // 清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 跟新属性
    updateAttr(row) {
      //   console.log(row);
      // 深拷贝，浅拷贝
      this.attrInfo = cloneDeep(row);
      this.isShowTable = false;
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点
    toLook(row) {
      console.log(row);
      if (row.valueName.trim() === "") {
        this.$message.error("请输入内容");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message.error("属性值不能一样");
        this.attrInfo.attrValueList.splice(
          this.attrInfo.attrValueList.length - 1,
          1
        );
        return;
      }
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      console.log(row, index, "---");
      /*
        获取input，实现自动聚焦
        在点击span的时候，需要注意，对于浏览器而言，DOM的上树下树，页面的重绘重拍，需要消耗时间
        点击span的时候,重绘一个input是需要消耗时间的，因此我们不能马上点击span立马获取input
        $nextTick()浏览器渲染完成，节点挂载完毕，开始执行
        * */
      this.$nextTick(() => {
        // 获取相应的表单元素，实现自动聚焦
        this.$refs[index].focus();
      });
    },
    // 删除属性值
    deleteAttrValue(row, index) {
      // 没接口，不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 添加属性，修改属性
    async saveAttrOrUpdate() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            // 带有属性值,删除flag
            delete item.flag;
            return true;
          } else {
            return false;
          }
        }
      );
      try {
        const res = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        if (res.code == 200) {
          console.log(res);
          this.$message.success(res.message);
          this.getAttrList();
          this.isShowTable = true;
        } else {
          this.$message.error("无法修改");
        }
      } catch (error) {
        // alert(error)
      }
    },
    deleteAttr(row, index) {
      this.list.splice(index, 1);
    },
  },
};
</script>

<style></style>
