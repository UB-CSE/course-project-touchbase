<template>
  <div>
    <v-app-bar app color="primary" flat dark clipped-left clipped-right>
      <Tabs></Tabs>
      <v-spacer></v-spacer>
      <TouchbaseButton></TouchbaseButton>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Tabs from "./Tabs.vue";
import TouchbaseButton from "./TouchbaseButton.vue";

@Component({
  components: { Tabs, TouchbaseButton },
})
export default class TopBar extends Vue {}
</script>