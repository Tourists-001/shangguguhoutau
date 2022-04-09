<template>
  <div>
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :showCategory="scene == 0"
      />
    </el-card>
    <el-card>
      <!-- 一开始出现的表单 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" :data="list">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
            border
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
            <template slot-scope="{ row }">
              <el-tag type="danger">{{ row.description }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HitButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                :title="'添加'"
                @click="addSku(row)"
              ></HitButton>
              <HitButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                :title="'修改'"
                @click="updateSpu(row, $index)"
              ></HitButton>
              <HitButton
                type="info"
                icon="el-icon-info"
                size="mini"
                :title="'信息'"
                @click="handle(row)"
              ></HitButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HitButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :title="'删除'"
                ></HitButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :pager-count="7"
          :page-sizes="[3, 5, 10]"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper,->,sizes,total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
        @AddOrUpdateSpu="AddOrUpdateSpu"
      />
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScenes" />
      <!-- 信息 -->
      <el-dialog
        :title="`${spu.spuName}的spu列表`"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table :data="spuList" style="100%" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
          <el-table-column prop="price" label="价格" width="width"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      isShow: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      list: [],
      scene: 0, // 0代表展示SPU列表数据
      dialogTableVisible: false,
      spu: {},
      spuList: [],
      loading:true,
    };
  },
  components: {
    SkuForm,
    SpuForm,
  },
  methods: {
    async getSpuList(pages = 1) {
      this.page = pages;
      const { category3Id } = this;
      const { page, limit } = this;
      if (category3Id) {
        const res = await this.$API.spu.reqSpuCategoryList(
          page,
          limit,
          category3Id
        );
        // console.log(res);
        if (res.code === 200) {
          this.list = res.data.records;
          this.total = res.data.total;
        }
      }
    },
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      // console.log(row);
      this.scene = 1;
      // 可以获取父组件的方法进行调用
      this.$refs.spu.initSpuData(row);
    },
    changeScene(scene) {
      this.scene = scene;
      // if(flag == '修改') {
      this.getSpuList();
      // } else {
      // this.getSpuList()
      // }
    },
    AddOrUpdateSpu(scene) {
      this.scene = scene;
      this.getSpuList(this.page);
    },
    async deleteSpu(row) {
      console.log(row);
      const { id } = row;
      const res = await this.$API.spu.reqDeleteSpu(id);
      this.$$message.success("删除成功");
      // console.log(res);
      this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
    },
    // 添加sku
    addSku(row) {
      // console.log(row);
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    changeScenes() {
      this.scene = 0;
    },
    async handle(spu) {
      this.spu = spu;
      this.dialogTableVisible = true;
      const res = await this.$API.spu.reqSkuList(spu.id);
      if (res.code === 200) {
        this.spuList = res.data;
        this.loading = false
        // console.log(this.spuList);
      }
    },
    close() {
      // loading为真
      this.loading = true
      this.spuList = []
      this.dialogTableVisible = false
      done()
    }
  },
};
</script>

<style></style>
