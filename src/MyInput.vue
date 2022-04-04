<script lang="ts">
export default defineComponent({
    name: 'MyInput'
})
</script>


<script setup lang="ts">
import { ref } from 'vue'

const model = ref('')
</script>

<template>
    <input v-model="model"> Hey
</template>
