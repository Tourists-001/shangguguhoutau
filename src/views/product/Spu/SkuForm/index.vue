<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="SKU价格">
      <el-input
        placeholder="SKU价格"
        v-model="skuInfo.price"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU重量">
      <el-input placeholder="SKU重量" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" :rows="4" v-model="skuInfo.skuDesc"
        >规格描述</el-input
      >
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in attrInfoList"
          :key="index"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="index"
        >
          <el-select
            placeholder="请选择"
            v-model="saleAttr.saleAttrIdAndSaleValueId"
          >
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        border
        style="width: 100%"
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" prop="prop" width="80">
        </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="列表" width="width" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              size="mini"
              v-if="row.isDefault == 0"
              @click="changeDefault(row)"
              >设置默认</el-button
            >
            <el-button size="small" v-else>还原</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="操作">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">退出</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SKU",
  data() {
    return {
      spuImageList: [], // 图片的信息
      spuSaleAttrList: [], // 销售的属性
      attrInfoList: [], // 平台属性的数据
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集图片字段(缺失字段)
      imgList: [],
    };
  },
  methods: {
    // 获取sku的form数据
    async getData(category1Id, category2Id, spu) {
      this.sup = spu;
      // 收集数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 获取图片的接口
      const imageList = await this.$API.sku.reqSpuImageList(spu.id);
      if (imageList.code === 200) {
        let list = imageList.data;
        // 添加服务器缺少的字段
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取售卖属性的列表数据
      const saleAttrList = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (saleAttrList.code === 200) {
        this.spuSaleAttrList = saleAttrList.data;
      }
      // 获取属性的信息列表
      const spuAttrInfoList = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (spuAttrInfoList.code == 200) {
        this.attrInfoList = spuAttrInfoList.data;
      }
    },
    // 复选框按钮的事件
    handleSelectionChange(params) {
      // 获取到选择的信息（缺少isDefault字段）
      this.imgList = params;
    },
    // 修改图片默认
    changeDefault(row) {
      // 图片列表的数据的default变为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消
    cancel() {
      this.$emit("changeScene", 0);
      Object.assign(this._data, this.$options.data());
    },
    // 添加sku
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, spuImageList } = this;
      // 平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          console.log({ attrId, valueId });
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndSaleValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndSaleValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      skuInfo.skuImageList = spuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      console.log(skuInfo);
      const res = await this.$API.spu.reqAddSku(skuInfo);
      if (res === 200) {
        this.$message.success("成功");
        this.$emit("changeScene", 0);
      }
    },
  },
};
</script>

<style></style>
