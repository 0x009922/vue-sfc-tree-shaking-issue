<script>
export default defineComponent({
    name: 'SampleComponentJs'
})
</script>

<script setup>
import { ref } from 'vue'

const counter = ref(0)
</script>

<template>
    <button @click="counter++">{{ counter }}</button>
</template>
