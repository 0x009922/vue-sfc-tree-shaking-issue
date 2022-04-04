<script lang="ts">
export default defineComponent({
    name: 'MyButton'
})
</script>

<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0)
</script>

<template>
    <button @click="counter++">{{ counter }}</button>
</template>
