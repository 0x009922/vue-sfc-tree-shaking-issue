<script lang="ts">
export default defineComponent({
    name: 'SampleComponent'
})
</script>

<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0)
</script>

<template>
    <button @click="counter++">{{ counter }}</button>
</template>
