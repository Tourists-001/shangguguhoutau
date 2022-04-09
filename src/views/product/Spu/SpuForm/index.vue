<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="照片墙">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${useSelectSaleAttr.length}个未选择`"
          v-model="attrId"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in useSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="marginright: 20px"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column label="属性名" width="100px" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, i) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(i, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                @click="spu.spuSaleAttrList.splice($index, 1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" @click="AddOrUpdateSpu">保存</el-button>
        <el-button type="info" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储spu数据
      spuImageList: [], //存储图片
      saleAttrList: [],
      dynamicTags: ["标签一", "标签二", "标签三"],
      // inputVisible: false,
      inputValue: "",
      attrId: "",
    };
  },
  computed: {
    // 还未选择的销售属性
    useSelectSaleAttr() {
      //!! 从三个中找出存在的 过滤加every
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      //   console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 图片上传成功的回调
    handleSuccess(res, file, fileList) {
      this.spuImageList = fileList;
      // console.log(this.spuImageList);
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      // console.log("object");
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    // 点击获取属性详细信息
    initSpuData(row) {
      // 获取SPu信息的数据
      const { id } = row;
      this.reqSpu(id);
      this.spuTradeMask();
      this.getSpuImageList(id);
      this.getBaseSaleAttr();
    },
    // 获取spu数据
    async reqSpu(id) {
      const res = await this.$API.spu.reqSpu(id);
      if (res.code == 200) {
        this.spu = res.data;
      }
    },
    async spuTradeMask() {
      const res = await this.$API.spu.reqTradeMarkList();
      if (res.code == 200) {
        this.tradeMarkList = res.data;
      }
    },
    async getSpuImageList(id) {
      const res = await this.$API.spu.reqSpuImageList(id);
      if (res.code == 200) {
        let listArr = res.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
    },
    // 获取所有销售属性
    async getBaseSaleAttr() {
      const res = await this.$API.spu.reqBaseSaleAttr();
      if (res.code == 200) {
        this.saleAttrList = res.data;
      }
    },
    // showInput() {
    //   this.inputVisible = true;
    //   this.$nextTick((_) => {
    //     this.$refs.saveTagInput.$refs.input.focus();
    //   });
    // },
    // 移出光标
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值
      // 判断是否一致和不能为空
      if (inputValue.trim() == "") {
        this.$message.error("不能为空");
        return;
      }
      const res = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (!res) {
        this.$message.error("不能重复");
        return;
      }
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(":");
      // console.log(baseSaleAttrId, saleAttrName);
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrId = "";
    },
    // 添加新的标签
    addSaleAttrValue(row) {
      // console.log(row);
      // 通过set添加响应式数据
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      //   this.inputVisible = true;
      //   this.$nextTick((_) => {
      //     this.$refs.saveTagInput.$refs.input.focus();
      //   });
    },
    // 上传数据
    async AddOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      const res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code === 200) {
        this.$message.success("上传成功");
        this.$emit("AddOrUpdateSpu", 0);
      }
    },
    // 添加spu
    addSpuData(id) {
      this.spu.category3Id = id;
      this.spuTradeMask();
      this.getBaseSaleAttr();
    },
    close() {
      this.$emit("changeScene", 0);
      // 点击取消清除data的数据
      //  Object.assign  合并对象
      // this._data 可以操作data当中的响应式数据
      // this.$options 获取配置对象 this.$options.data()配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
      // console.log(this._data);
      // console.log(this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
