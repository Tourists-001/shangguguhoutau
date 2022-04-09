<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          :disabled="!showCategory"
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handle1"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, i) in list1"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="!showCategory || cForm.category1Id == ''"
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="handle2"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, i) in list2"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="!showCategory || cForm.category2Id == ''"
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="handle3"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item, i) in list3"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ['showCategory'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List();
      if (res.code === 200) {
        this.list1 = res.data;
      }
    },
    async handle1() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      this.list2 = [];
      this.list3 = [];
      this.cForm.category3Id = "";
      this.cForm.category2Id = "";
      const res = await this.$API.attr.reqCategory2List(this.cForm.category1Id);
      if (res.code == 200) {
        this.list2 = res.data;
      }
    },
    async handle2() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      this.list3 = [];
      this.cForm.category3Id = "";
      const res = await this.$API.attr.reqCategory3List(this.cForm.category2Id);
      if (res.code == 200) {
        this.list3 = res.data;
      }
    },
    handle3() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
};
</script>

<style></style>
